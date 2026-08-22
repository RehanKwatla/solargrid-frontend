import React, { useRef, useLayoutEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { ScrollTrigger } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger);
import gsap from 'gsap';
import { mapScrollToVariables } from '../utils/scrollInterpolation';
import HeroCopy from './HeroCopy';
import styles from './SolarGridHero.module.css';

const SolarGridHero = () => {
  const splineRef = useRef(null);
  const containerRef = useRef(null);
  const rafId = useRef(null);

  // Detect prefers-reduced-motion
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useLayoutEffect(() => {
    if (prefersReduced) {
      // Optionally play a short autoplay animation or static frame
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to({ progress: 0 }, {
        progress: 1,
        ease: 'none',
        onUpdate: function () {
          const vars = mapScrollToVariables(this.targets()[0].progress);
          // Batch updates per animation frame
          if (rafId.current) cancelAnimationFrame(rafId.current);
          rafId.current = requestAnimationFrame(() => {
            if (splineRef.current) {
              const spline = splineRef.current;
              Object.entries(vars).forEach(([key, value]) => {
                spline.setVariable(key, value);
              });
            }
          });
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <section className={styles.heroSection} ref={containerRef}>
      <Spline
        className={styles.splineCanvas}
        scene="/assets/solargrid_hero.spline"
        onLoad={(spline) => {
          splineRef.current = spline;
        }}
      />
      <HeroCopy />
    </section>
  );
};

export default SolarGridHero;
