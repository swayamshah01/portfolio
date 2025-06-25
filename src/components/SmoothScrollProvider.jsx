import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

const SmoothScrollProvider = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Animation frame loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // GSAP ScrollTrigger integration
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', window.ScrollTrigger.update);

      window.gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      window.gsap.ticker.lagSmoothing(0);
    }

    // Cleanup
    return () => {
      lenis.destroy();
      if (window.gsap) {
        window.gsap.ticker.remove();
      }
    };
  }, []);

  // Expose lenis instance globally for navigation
  useEffect(() => {
    if (lenisRef.current) {
      window.lenis = lenisRef.current;
    }
  }, []);

  return <>{children}</>;
};

export default SmoothScrollProvider;