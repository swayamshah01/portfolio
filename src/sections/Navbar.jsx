import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { mySocials } from "../constants";
import styles from './VoidConstruct.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showBurger, setShowBurger] = useState(true);
  const [currentImage, setCurrentImage] = useState('');
  
  const containerRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const menuContentRef = useRef(null);
  const imageContainerRef = useRef(null);
  const currentImageRef = useRef(null);
  const nextImageRef = useRef(null);
  const lastToggleTimeRef = useRef(0);
  const hoverTimelineRefs = useRef(new Map());
  const socialTimelineRefs = useRef(new Map());
  const imageTimelineRef = useRef(null);
  const imageLoadTimeoutRef = useRef(null);

  const defaultImageSrc = "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

  const menuLinksData = [
    { name: 'home', img: 'https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', targetId: '#home' },
    { name: 'about', img: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', targetId: '#about' },
    { name: 'work', img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', targetId: '#work' },
    { name: 'experience', img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', targetId: '#experience' },
    { name: 'contact', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', targetId: '#contact' }
  ];

  // Image Management System
  const ImageManager = {
    preloadImage: (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    },

    initializeImages: () => {
      if (!currentImageRef.current || !nextImageRef.current) return;
      
      // Set initial states
      gsap.set(currentImageRef.current, {
        opacity: 1,
        scale: 1,
        zIndex: 2
      });
      
      gsap.set(nextImageRef.current, {
        opacity: 0,
        scale: 1.1,
        zIndex: 1
      });
      
      // Set default image
      currentImageRef.current.src = defaultImageSrc;
      setCurrentImage(defaultImageSrc);
    },

    changeImage: async (newSrc) => {
      if (!newSrc || newSrc === currentImage || !currentImageRef.current || !nextImageRef.current) {
        return;
      }

      // Kill any existing animation
      if (imageTimelineRef.current) {
        imageTimelineRef.current.kill();
      }

      try {
        // Preload the new image
        await ImageManager.preloadImage(newSrc);
        
        // Set the new image source
        nextImageRef.current.src = newSrc;
        
        // Create transition timeline
        imageTimelineRef.current = gsap.timeline({
          onComplete: () => {
            // Swap the refs for next transition
            const temp = currentImageRef.current;
            currentImageRef.current = nextImageRef.current;
            nextImageRef.current = temp;
            
            // Reset the new "next" image
            gsap.set(nextImageRef.current, {
              opacity: 0,
              scale: 1.1,
              zIndex: 1
            });
            
            gsap.set(currentImageRef.current, {
              zIndex: 2
            });
            
            setCurrentImage(newSrc);
          }
        });

        // Animate the transition
        imageTimelineRef.current
          .to(nextImageRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power2.out"
          })
          .to(currentImageRef.current, {
            opacity: 0,
            scale: 0.95,
            duration: 0.6,
            ease: "power2.out"
          }, 0);

      } catch (error) {
        console.warn('Failed to load image:', newSrc);
      }
    },

    resetToDefault: () => {
      // Clear any pending timeouts
      if (imageLoadTimeoutRef.current) {
        clearTimeout(imageLoadTimeoutRef.current);
      }
      
      // Delay reset to avoid conflicts with quick hover changes
      imageLoadTimeoutRef.current = setTimeout(() => {
        if (currentImage !== defaultImageSrc) {
          ImageManager.changeImage(defaultImageSrc);
        }
      }, 200);
    },

    cleanup: () => {
      if (imageTimelineRef.current) {
        imageTimelineRef.current.kill();
      }
      if (imageLoadTimeoutRef.current) {
        clearTimeout(imageLoadTimeoutRef.current);
      }
    }
  };

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

  useEffect(() => {
    // Initialize images after component mounts
    const initTimeout = setTimeout(() => {
      ImageManager.initializeImages();
    }, 100);

    // Set initial states for menu elements
    const menuLinks = document.querySelectorAll(`.${styles.link} button`);
    const socialLinks = document.querySelectorAll(`.${styles.social} a`);
    const footerLinks = document.querySelectorAll(`.${styles.menuFooter} a`);
    const linkFills = document.querySelectorAll(`.${styles.linkFill}`);
    const linkTexts = document.querySelectorAll(`.${styles.linkText}`);

    gsap.set([...menuLinks, ...socialLinks, ...footerLinks], {
      y: 0,
      opacity: 1,
      x: 0,
      clearProps: "transform"
    });

    gsap.set(linkFills, { scaleX: 0 });
    gsap.set(linkTexts, { color: '#fff' });

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isAnimating) {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      clearTimeout(initTimeout);
      document.removeEventListener("keydown", handleKeyDown);
      hoverTimelineRefs.current.forEach(timeline => timeline.kill());
      socialTimelineRefs.current.forEach(timeline => timeline.kill());
      ImageManager.cleanup();
    };
  }, []);

  const animateToggle = (isOpening) => {
    const open = document.querySelector("#menu-open");
    const close = document.querySelector("#menu-close");

    gsap.to(isOpening ? open : close, {
      x: isOpening ? -5 : 5,
      y: isOpening ? -10 : 10,
      rotation: isOpening ? -5 : 5,
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(isOpening ? close : open, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      delay: 0.2,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const resetAllFillElements = () => {
    const linkFills = document.querySelectorAll(`.${styles.linkFill}`);
    const linkTexts = document.querySelectorAll(`.${styles.linkText}`);
    
    hoverTimelineRefs.current.forEach(timeline => timeline.kill());
    hoverTimelineRefs.current.clear();
    
    gsap.set(linkFills, { scaleX: 0 });
    gsap.set(linkTexts, { color: '#fff' });
    
    const allLinks = document.querySelectorAll(`.${styles.link} button, .${styles.social} a`);
    gsap.set(allLinks, { x: 0 });
  };

  const openMenu = () => {
    if (isAnimating || isOpen) return;

    setIsAnimating(true);
    setIsOpen(true);

    // Reset image to default when opening
    ImageManager.changeImage(defaultImageSrc);

    resetAllFillElements();
    animateToggle(true);

    gsap.to(menuOverlayRef.current, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      duration: 1,
      ease: "power3.inOut"
    });

    gsap.to(menuContentRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.2
    });

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scale: 0.95,
        x: -50,
        rotationY: -15,
        duration: 1,
        ease: "power3.out"
      });
    }

    const menuLinks = document.querySelectorAll(`.${styles.link} button`);
    const socialLinks = document.querySelectorAll(`.${styles.social} a`);
    const footerLinks = document.querySelectorAll(`.${styles.menuFooter} a`);
    const closeButton = document.querySelector(`.${styles.closeButton}`);
    
    gsap.fromTo([...menuLinks, ...socialLinks, ...footerLinks, closeButton], 
      {
        y: 50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.5,
        onComplete: () => {
          setIsAnimating(false);
        }
      }
    );
  };

  const closeMenu = () => {
    if (isAnimating || !isOpen) return;

    setIsAnimating(true);
    setIsOpen(false);

    resetAllFillElements();
    animateToggle(false);

    const menuLinks = document.querySelectorAll(`.${styles.link} button`);
    const socialLinks = document.querySelectorAll(`.${styles.social} a`);
    const footerLinks = document.querySelectorAll(`.${styles.menuFooter} a`);
    const closeButton = document.querySelector(`.${styles.closeButton}`);

    gsap.to([...menuLinks, ...socialLinks, ...footerLinks, closeButton], {
      y: 50,
      opacity: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.in"
    });

    gsap.to(menuContentRef.current, {
      x: -100,
      y: -100,
      scale: 1.5,
      rotation: -15,
      duration: 0.8,
      ease: "power3.in",
      delay: 0.2
    });

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scale: 1,
        x: 0,
        rotationY: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.1
      });
    }

    gsap.to(menuOverlayRef.current, {
      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
      duration: 1,
      ease: "power3.inOut",
      delay: 0.3,
      onComplete: () => {
        setIsAnimating(false);
        // Reset image when menu closes
        ImageManager.changeImage(defaultImageSrc);
      }
    });
  };

  const handleMenuToggle = () => {
    const now = Date.now();
    if (now - lastToggleTimeRef.current < 500) return;
    lastToggleTimeRef.current = now;

    if (!isAnimating) {
      if (!isOpen) {
        openMenu();
      } else {
        closeMenu();
      }
    }
  };

  const handleLinkClick = (targetId) => {
    if (isOpen) {
      closeMenu();
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
    }, isOpen ? 1000 : 0);
  };

  const handleLinkHover = (imgSrc, event) => {
    if (!isOpen || isAnimating) return;

    // Clear any pending reset timeout
    if (imageLoadTimeoutRef.current) {
      clearTimeout(imageLoadTimeoutRef.current);
      imageLoadTimeoutRef.current = null;
    }

    // Change image
    if (imgSrc && imgSrc !== currentImage) {
      ImageManager.changeImage(imgSrc);
    }
    
    const link = event.currentTarget;
    const linkId = link.getAttribute('data-link-id') || `link-${Date.now()}`;
    link.setAttribute('data-link-id', linkId);
    
    const fillElement = link.querySelector(`.${styles.linkFill}`);
    const textElement = link.querySelector(`.${styles.linkText}`);
    
    if (hoverTimelineRefs.current.has(linkId)) {
      hoverTimelineRefs.current.get(linkId).kill();
    }
    
    const tl = gsap.timeline();
    
    tl.to(fillElement, {
      scaleX: 1,
      transformOrigin: "left",
      duration: 0.4,
      ease: "power2.out"
    }, 0)
    .to(textElement, {
      color: '#000',
      duration: 0.2,
      ease: "power2.out"
    }, 0)
    .to(link, {
      x: 20,
      duration: 0.3,
      ease: "power2.out"
    }, 0);
    
    hoverTimelineRefs.current.set(linkId, tl);
  };

  const handleLinkLeave = (event) => {
    if (!isOpen || isAnimating) return;
    
    const link = event.currentTarget;
    const linkId = link.getAttribute('data-link-id');
    
    if (!linkId) return;
    
    const fillElement = link.querySelector(`.${styles.linkFill}`);
    const textElement = link.querySelector(`.${styles.linkText}`);
    
    if (hoverTimelineRefs.current.has(linkId)) {
      hoverTimelineRefs.current.get(linkId).kill();
    }
    
    const tl = gsap.timeline();
    
    tl.to(fillElement, {
      scaleX: 0,
      transformOrigin: "right",
      duration: 0.3,
      ease: "power2.out"
    }, 0)
    .to(textElement, {
      color: '#fff',
      duration: 0.2,
      ease: "power2.out"
    }, 0)
    .to(link, {
      x: 0,
      duration: 0.3,
      ease: "power2.out"
    }, 0);
    
    hoverTimelineRefs.current.set(linkId, tl);

    // Reset to default image after leaving
    ImageManager.resetToDefault();
  };

  const handleSocialHover = (event) => {
    if (!isOpen || isAnimating) return;
    
    const link = event.currentTarget;
    const socialId = link.getAttribute('data-social-id') || `social-${Date.now()}`;
    link.setAttribute('data-social-id', socialId);
    
    if (socialTimelineRefs.current.has(socialId)) {
      socialTimelineRefs.current.get(socialId).kill();
    }
    
    const tl = gsap.timeline();
    tl.to(link, {
      x: 10,
      duration: 0.3,
      ease: "power2.out"
    });
    
    socialTimelineRefs.current.set(socialId, tl);
  };

  const handleSocialLeave = (event) => {
    if (!isOpen || isAnimating) return;
    
    const link = event.currentTarget;
    const socialId = link.getAttribute('data-social-id');
    
    if (!socialId) return;
    
    if (socialTimelineRefs.current.has(socialId)) {
      socialTimelineRefs.current.get(socialId).kill();
    }
    
    const tl = gsap.timeline();
    tl.to(link, {
      x: 0,
      duration: 0.3,
      ease: "power2.out"
    });
    
    socialTimelineRefs.current.set(socialId, tl);
  };

  const handleOverlayClick = (e) => {
    if (e.target === menuOverlayRef.current && isOpen && !isAnimating) {
      closeMenu();
    }
  };

  return (
    <>
      {/* Brand/Logo - Always visible */}
      <div className="fixed top-6 left-6 md:left-10 z-40">
        <button
          onClick={() => handleLinkClick('#home')}
          className="text-lg md:text-xl font-bold transition-colors text-white hover:text-white/80 mix-blend-difference"
        >
          void swayam
        </button>
      </div>

      {/* Hamburger Menu Button */}
      <div
        className={`fixed z-40 flex items-center justify-center transition-all duration-300 rounded-full cursor-pointer w-12 h-12 md:w-16 md:h-16 top-4 right-6 md:right-10 mix-blend-difference ${
          isOpen 
            ? 'bg-white' 
            : 'bg-transparent border border-white/20'
        }`}
        onClick={handleMenuToggle}
        style={
          showBurger
            ? { clipPath: "circle(50% at 50% 50%)" }
            : { clipPath: "circle(0% at 50% 50%)" }
        }
      >
        <p id="menu-open" className={`text-xs md:text-sm font-medium ${isOpen ? 'text-black' : 'text-white'} transition-all duration-300`}>
          menu
        </p>
        <p id="menu-close" className={`text-xs md:text-sm font-medium ${isOpen ? 'text-black' : 'text-white'} transition-all duration-300 absolute opacity-0`}>
          close
        </p>
      </div>
      
      <div 
        className={styles.menuOverlay} 
        ref={menuOverlayRef}
        onClick={handleOverlayClick}
      >
        <div className={styles.menuContent} ref={menuContentRef}>
          {/* Close Button inside menu */}
          <div className={styles.closeButton}>
            <button
              onClick={closeMenu}
              className="fixed top-6 right-6 md:right-10 z-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full transition-all duration-300 hover:bg-white/20 hover:border-white/40"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-white"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className={styles.menuItem}>
            <div className={styles.colLg}>
              <div className={styles.menuPreviewImg} ref={imageContainerRef}>
                {/* Two images for smooth transitions */}
                <img 
                  ref={currentImageRef}
                  alt="current preview" 
                  className={styles.previewImage}
                />
                <img 
                  ref={nextImageRef}
                  alt="next preview" 
                  className={styles.previewImage}
                />
              </div>
            </div>
            <div className={styles.colSm}>
              <div className={styles.menuLinks}>
                {menuLinksData.map((link, index) => (
                  <div key={index} className={styles.link}>
                    <button 
                      onClick={() => handleLinkClick(link.targetId)}
                      onMouseEnter={(e) => handleLinkHover(link.img, e)}
                      onMouseLeave={handleLinkLeave}
                      className="w-full text-left"
                    >
                      <span className={styles.linkText}>{link.name}</span>
                      <div className={styles.linkFill}></div>
                    </button>
                  </div>
                ))}
              </div>
              <div className={styles.menuSocials}>
                {mySocials.map((social, index) => (
                  <div key={index} className={styles.social}>
                    <a 
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onMouseEnter={handleSocialHover}
                      onMouseLeave={handleSocialLeave}
                    >
                      {social.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.menuFooter}>
            <div className={styles.colFull}>
              <a href="mailto:shahswayam24@gmail.com">shahswayam24@gmail.com</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;