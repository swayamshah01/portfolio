import { useState, useRef } from "react";
import Project from "../components/Project";
import { myProjects } from "../constants";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Projects = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 10, stiffness: 50 });
  const springY = useSpring(y, { damping: 10, stiffness: 50 });
  const overlayRefs = useRef([]);
  const [preview, setPreview] = useState(null);

  const handleMouseMove = (e) => {
    x.set(e.clientX + 20);
    y.set(e.clientY + 20);
  };

  const handleProjectHover = (index, isEntering) => {
    if (window.innerWidth < 768) return;

    const el = overlayRefs.current[index];
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
          duration: 0.3,
          ease: "power2.out",
        }
      );
    } else {
      gsap.to(el, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        duration: 0.25,
        ease: "power2.in",
      });
    }
  };

  return (
    <section
    id="work"
      onMouseMove={handleMouseMove}
      className="relative c-space section-spacing"
    >
      <h2 className="text-heading">My Selected Projects</h2>
      <div className="bg-gradient-to-r from-transparent via-violet-500/20 to-transparent mt-12 h-[1px] w-full" />
      
      {myProjects.map((project, index) => (
        <div
          key={project.id}
          className="relative group"
          onMouseEnter={() => handleProjectHover(index, true)}
          onMouseLeave={() => handleProjectHover(index, false)}
        >
          {/* Elegant Gradient Overlay */}
          <div
            ref={(el) => {
              overlayRefs.current[index] = el;
            }}
            className="absolute inset-0 hidden md:block duration-300 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 -z-10 rounded-lg"
            style={{
              clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
            }}
          />
          
          {/* Subtle glow effect */}
          <div
            className="absolute inset-0 hidden md:block opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-violet-400 to-purple-600 -z-20 rounded-lg blur-xl"
          />
          
          {/* Your existing Project component with enhanced styling */}
          <div className="transition-all duration-500 md:group-hover:px-6 md:group-hover:py-2 relative z-10">
            <Project 
              key={project.id} 
              {...project} 
              setPreview={setPreview} 
            />
          </div>
        </div>
      ))}
      
      {preview && (
        <motion.img
          className="fixed top-0 left-0 z-50 object-cover h-56 rounded-xl shadow-2xl shadow-violet-500/20 pointer-events-none w-80 border border-violet-500/30"
          src={preview}
          style={{ x: springX, y: springY }}
        />
      )}
    </section>
  );
};

export default Projects;