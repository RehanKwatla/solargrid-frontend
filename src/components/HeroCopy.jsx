import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import styles from './HeroCopy.module.css';

// Ensure ScrollTrigger is registered
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HeroCopy = () => {
  const sunriseRef = useRef(null);
  const middayRef = useRef(null);
  const energyRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Sunrise text – visible at start, fade out by 10%
      gsap.fromTo(
        sunriseRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          scrollTrigger: {
            trigger: sunriseRef.current,
            start: 'top top',
            end: '+=10%',
            scrub: true,
          },
        }
      );

      // Midday text – fade in around 45% and out after 55%
      gsap.fromTo(
        middayRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: middayRef.current,
            start: '+=45%',
            end: '+=55%',
            scrub: true,
          },
        }
      );

      // Energy generation text – appears at 60% and fades after 80%
      gsap.fromTo(
        energyRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: energyRef.current,
            start: '+=60%',
            end: '+=80%',
            scrub: true,
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.copyOverlay}>
      <div className={styles.copyText} ref={sunriseRef}>
        Energy begins with the sun.
      </div>
      <div className={styles.copyText} ref={middayRef}>
        Track the sun. Capture more energy.
      </div>
      <div className={styles.copyText} ref={energyRef}>
        Smart energy optimization in action.
      </div>
    </div>
  );
};

export default HeroCopy;
