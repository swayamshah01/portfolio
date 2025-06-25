import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / scrollHeight;
      setScrollProgress(Math.min(progress, 1));
    };

    // Fallback to regular scroll if Lenis isn't available
    const scrollHandler = () => {
      if (window.lenis) {
        const progress = window.lenis.progress || 0;
        setScrollProgress(progress);
      } else {
        handleScroll();
      }
    };

    // Add both listeners for reliability
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    if (window.lenis) {
      window.lenis.on('scroll', scrollHandler);
    }

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      if (window.lenis) {
        window.lenis.off('scroll', scrollHandler);
      }
    };
  }, []);

  return (
    <>
      {/* Main progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-neutral-200/20 z-[100] backdrop-blur-sm">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: scrollProgress }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 40,
            mass: 0.5
          }}
          style={{ 
            transformOrigin: "0%",
            boxShadow: "0 0 10px rgba(139, 92, 246, 0.5)"
          }}
        />
      </div>
      
      {/* Enhanced glow effect */}
      <div className="fixed top-0 left-0 w-full h-1 z-[99]">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-400 to-purple-500 blur-sm opacity-40"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: scrollProgress }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 35
          }}
          style={{ transformOrigin: "0%" }}
        />
      </div>
    </>
  );
};

export default ScrollProgress;