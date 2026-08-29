'use client';

import React, { useEffect, useRef, useState } from 'react';

export type AnimationType =
  | 'none'
  | 'fade-in'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'bounce-in'
  | 'flip-in';

export type AnimationDuration = 'fast' | 'normal' | 'slow';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animationType?: string | null;
  animationDuration?: string | null;
  animationDelay?: number | null;
  className?: string;
  id?: string;
}

export default function AnimatedSection({
  children,
  animationType = 'fade-in',
  animationDuration = 'normal',
  animationDelay = 0,
  className = '',
  id,
}: AnimatedSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const type = (animationType || 'none').toLowerCase() as AnimationType;
  const isNone = type === 'none' || !type;

  useEffect(() => {
    if (isNone) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once animated, unobserve to retain rendered state
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isNone]);

  // Duration mapping
  let durationClass = 'anim-duration-normal';
  if (animationDuration === 'fast') durationClass = 'anim-duration-fast';
  if (animationDuration === 'slow') durationClass = 'anim-duration-slow';

  const delayMs = animationDelay || 0;

  return (
    <div
      ref={sectionRef}
      id={id}
      className={`animated-section-wrapper ${isNone ? '' : `anim-${type}`} ${durationClass} ${
        isVisible ? 'anim-active' : 'anim-initial'
      } ${className}`}
      style={{
        transitionDelay: `${delayMs}ms`,
        animationDelay: `${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}
