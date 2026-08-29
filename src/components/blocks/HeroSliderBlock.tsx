'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Slide {
  badge?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showPlayBtn?: boolean;
  bgImage?: string;
}

interface HeroSliderProps {
  slides?: Slide[];
}

export default function HeroSliderBlock({ content }: { content: HeroSliderProps }) {
  const slides = content.slides || [];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <section className="hero-slider" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="slider-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`slide ${idx === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${slide.bgImage || '/images/bg-01-free-img.jpg'})`,
              display: idx === currentSlide ? 'flex' : 'none',
            }}
          >
            <div className="slide-content">
              {slide.badge && <span className="slide-badge">{slide.badge}</span>}
              <h1 className="slide-title">{slide.title}</h1>
              {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
              <div className="slide-actions" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '25px' }}>
                {slide.ctaText && (
                  <Link href={slide.ctaLink || '/contact'} className="btn btn-outline-white">
                    {slide.ctaText}
                  </Link>
                )}
                {slide.showPlayBtn && (
                  <Link href={slide.ctaLink || '/contact'} className="play-btn" aria-label="Watch Video Reel">
                    <svg viewBox="0 0 448 512" style={{ width: '16px', height: '16px', fill: '#ffffff' }}>
                      <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/>
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            className="slider-arrow slider-prev prev"
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            aria-label="Previous Slide"
            style={{
              position: 'absolute',
              top: '50%',
              left: '25px',
              transform: 'translateY(-50%)',
              zIndex: 10,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ display: 'block' }}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            className="slider-arrow slider-next next"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            aria-label="Next Slide"
            style={{
              position: 'absolute',
              top: '50%',
              right: '25px',
              transform: 'translateY(-50%)',
              zIndex: 10,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ display: 'block' }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <div className="slider-dots">
            {slides.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
