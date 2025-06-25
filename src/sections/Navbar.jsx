import React, { useEffect, useRef, useState } from "react";
import { mySocials } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Navbar = () => {
  const navRef = useRef(null);
  const linksRef = useRef([]);
  const contactRef = useRef(null);
  const topLineRef = useRef(null);
  const bottomLineRef = useRef(null);
  const linkOverlayRefs = useRef([]);
  const emailOverlayRef = useRef(null);
  const socialOverlayRefs = useRef([]);
  const tl = useRef(null);
  const iconTl = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showBurger, setShowBurger] = useState(true);

  // Initialize GSAP animations
  useGSAP(() => {
    // Set initial states
    gsap.set(navRef.current, { xPercent: 100 });
    gsap.set([linksRef.current, contactRef.current], {
      autoAlpha: 0,
      x: -20,
    });

    // Main menu animation timeline
    tl.current = gsap
      .timeline({ paused: true })
      .to(navRef.current, {
        xPercent: 0,
        duration: 1,
        ease: "power3.out",
      })
      .to(
        linksRef.current,
        {
          autoAlpha: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
        },
        "<"
      )
      .to(
        contactRef.current,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "<+0.2"
      );

    // Hamburger icon animation timeline
    iconTl.current = gsap
      .timeline({ paused: true })
      .to(topLineRef.current, {
        rotate: 45,
        y: 3.3,
        duration: 0.3,
        ease: "power2.inOut",
      })
      .to(
        bottomLineRef.current,
        {
          rotate: -45,
          y: -3.3,
          duration: 0.3,
          ease: "power2.inOut",
        },
        "<"
      );
  }, []);

  // Handle scroll for hamburger visibility
  useEffect(() => {
    let lastScrollY = 0;
    
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      setShowBurger(currentScrollY <= lastScrollY || currentScrollY < 10);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle menu function
  const toggleMenu = () => {
    if (isOpen) {
      tl.current.reverse();
      iconTl.current.reverse();
    } else {
      tl.current.play();
      iconTl.current.play();
    }
    setIsOpen(!isOpen);
  };

  // Handle navigation link clicks
  const handleLinkClick = (targetId) => {
    if (isOpen) {
      toggleMenu();
    }
    
    setTimeout(() => {
      const target = document.querySelector(targetId);
      if (target) {
        if (window.lenis) {
          window.lenis.scrollTo(target, {
            duration: 2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        } else {
          target.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    }, isOpen ? 500 : 0);
  };

  // Handle individual navigation link hover effects
  const handleLinkHover = (index, isEntering) => {
    if (window.innerWidth < 768) return;

    const el = linkOverlayRefs.current[index];
    if (!el) return;

    gsap.killTweensOf(el);

    if (isEntering) {
      gsap.fromTo(
        el,
        {
          clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
          duration: 0.15,
          ease: "power2.out",
        }
      );
    } else {
      gsap.to(el, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        duration: 0.2,
        ease: "power2.in",
      });
    }
  };

  // Handle email hover effects
  const handleEmailHover = (isEntering) => {
    if (window.innerWidth < 768) return;

    const el = emailOverlayRef.current;
    if (!el) return;

    gsap.killTweensOf(el);

    if (isEntering) {
      gsap.fromTo(
        el,
        {
          clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
          duration: 0.15,
          ease: "power2.out",
        }
      );
    } else {
      gsap.to(el, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        duration: 0.2,
        ease: "power2.in",
      });
    }
  };

  // Handle social link hover effects
  const handleSocialHover = (index, isEntering) => {
    if (window.innerWidth < 768) return;

    const el = socialOverlayRefs.current[index];
    if (!el) return;

    gsap.killTweensOf(el);

    if (isEntering) {
      gsap.fromTo(
        el,
        {
          clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
          duration: 0.15,
          ease: "power2.out",
        }
      );
    } else {
      gsap.to(el, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        duration: 0.2,
        ease: "power2.in",
      });
    }
  };

  return (
    <>
      {/* Brand/Logo - Always visible */}
      <div className="fixed top-6 left-10 z-40">
        <button
          onClick={() => handleLinkClick('#home')}
          className="text-xl font-bold transition-colors text-white hover:text-white/80"
        >
          Swayam
        </button>
      </div>
      
      {/* Full-screen overlay navigation */}
      <nav
        ref={navRef}
        className="fixed z-50 flex flex-col justify-between w-full h-full px-10 uppercase bg-black text-white/80 py-28 gap-y-10 md:w-1/2 md:left-1/2"
      >
        {/* Navigation Links with Hover Effects */}
        <div className="flex flex-col text-5xl gap-y-2 md:text-6xl lg:text-8xl">
          {["home", "about", "work", "experience", "contact"].map(
            (section, index) => (
              <div 
                key={index} 
                ref={(el) => (linksRef.current[index] = el)}
                className="relative group cursor-pointer"
                onMouseEnter={() => handleLinkHover(index, true)}
                onMouseLeave={() => handleLinkHover(index, false)}
              >
                {/* Individual hover overlay for each link */}
                <div
                  ref={(el) => {
                    linkOverlayRefs.current[index] = el;
                  }}
                  className="absolute inset-0 hidden md:block duration-200 bg-white -z-10 rounded-lg"
                  style={{
                    clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
                  }}
                />
                
                <button
                  className="transition-all duration-300 cursor-pointer hover:text-white md:group-hover:text-black md:group-hover:px-4 py-2 relative z-10 w-full text-left"
                  onClick={() => handleLinkClick(`#${section}`)}
                >
                  {section}
                </button>
              </div>
            )
          )}
        </div>
        
        {/* Contact Section with Email and Social Media */}
        <div
          ref={contactRef}
          className="flex flex-col flex-wrap justify-between gap-8 md:flex-row"
        >
          {/* Email Section with Hover Effect */}
          <div className="font-light">
            <p className="tracking-wider text-white/50 mb-2">E-mail</p>
            <div 
              className="relative group cursor-pointer inline-block"
              onMouseEnter={() => handleEmailHover(true)}
              onMouseLeave={() => handleEmailHover(false)}
            >
              {/* Email hover overlay */}
              <div
                ref={emailOverlayRef}
                className="absolute inset-0 hidden md:block duration-200 bg-white -z-10 rounded-md"
                style={{
                  clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
                }}
              />
              <a
                href="mailto:swayamshah01@gmail.com"
                className="text-xl tracking-widest lowercase text-pretty hover:text-white transition-all duration-300 md:group-hover:text-black md:group-hover:px-2 py-1 relative z-10 block"
              >
                swayamshah01@gmail.com
              </a>
            </div>
          </div>

          {/* Social Media Section with Individual Hover Effects */}
          <div className="font-light">
            <p className="tracking-wider text-white/50 mb-2">Social Media</p>
            <div className="flex flex-col flex-wrap md:flex-row gap-x-2">
              {mySocials.map((social, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer inline-block"
                  onMouseEnter={() => handleSocialHover(index, true)}
                  onMouseLeave={() => handleSocialHover(index, false)}
                >
                  {/* Social link hover overlay */}
                  <div
                    ref={(el) => {
                      socialOverlayRefs.current[index] = el;
                    }}
                    className="absolute inset-0 hidden md:block duration-200 bg-white -z-10 rounded-md"
                    style={{
                      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
                    }}
                  />
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm leading-loose tracking-widest uppercase hover:text-white transition-all duration-300 md:group-hover:text-black md:group-hover:px-2 py-1 relative z-10 block"
                  >
                    {"{ "}
                    {social.name}
                    {" }"}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hamburger Menu Button with Color Change */}
      <div
        className={`fixed z-50 flex flex-col items-center justify-center gap-1 transition-all duration-300 rounded-full cursor-pointer w-14 h-14 md:w-20 md:h-20 top-4 right-10 ${
          isOpen 
            ? 'bg-gradient-to-br from-violet-600 to-purple-700' 
            : 'bg-black'
        }`}
        onClick={toggleMenu}
        style={
          showBurger
            ? { clipPath: "circle(50% at 50% 50%)" }
            : { clipPath: "circle(0% at 50% 50%)" }
        }
      >
        <span
          ref={topLineRef}
          className="block w-8 h-0.5 bg-white rounded-full origin-center"
        ></span>
        <span
          ref={bottomLineRef}
          className="block w-8 h-0.5 bg-white rounded-full origin-center"
        ></span>
      </div>
    </>
  );
};

export default Navbar;