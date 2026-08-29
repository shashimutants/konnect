'use client';

import React, { useState } from 'react';

interface TestimonialItem {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  stars?: number;
}

interface TestimonialsProps {
  subtitle?: string;
  title: string;
  items: TestimonialItem[];
}

export default function TestimonialsCarouselBlock({ content }: { content: TestimonialsProps }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = content.items || [];
  if (items.length === 0) return null;

  const current = items[activeIndex] || items[0];

  return (
    <section className="section" style={{ backgroundColor: '#111111', color: '#FFFFFF', padding: '90px 0' }}>
      <div className="container" style={{ maxWidth: '850px', textAlign: 'center' }}>
        {content.subtitle && (
          <h6 className="section-subtitle" style={{ color: 'var(--ast-global-color-0)' }}>
            {content.subtitle}
          </h6>
        )}
        <h2 className="section-title" style={{ color: '#fff', marginBottom: '40px' }}>
          {content.title}
        </h2>

        <div style={{ color: '#f59e0b', fontSize: '20px', marginBottom: '20px' }}>
          {'★'.repeat(current.stars || 5)}
        </div>

        <blockquote
          style={{
            fontSize: 'clamp(18px, 3vw, 24px)',
            fontStyle: 'italic',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '30px',
          }}
        >
          &ldquo;{current.quote}&rdquo;
        </blockquote>

        <div style={{ fontWeight: 700, fontSize: '16px', color: '#fff' }}>{current.author}</div>
        {(current.role || current.company) && (
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
            {current.role} {current.company ? `• ${current.company}` : ''}
          </div>
        )}

        {items.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '35px' }}>
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                style={{
                  width: idx === activeIndex ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '10px',
                  backgroundColor: idx === activeIndex ? 'var(--ast-global-color-0)' : 'rgba(255,255,255,0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                aria-label={`Testimonial ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
