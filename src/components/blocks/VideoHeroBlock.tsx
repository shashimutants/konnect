import React from 'react';
import Link from 'next/link';

interface VideoHeroProps {
  badge?: string;
  title: string;
  subtitle?: string;
  videoUrl?: string;
  posterImage?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function VideoHeroBlock({ content }: { content: VideoHeroProps }) {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textAlign: 'center',
        overflow: 'hidden',
        padding: '80px 20px',
        backgroundColor: '#000',
      }}
    >
      {/* Background Image / Video Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${content.posterImage || '/images/bg-01-free-img.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.45,
          zIndex: 1,
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '850px' }}>
        {content.badge && (
          <div
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              backgroundColor: 'var(--ast-global-color-0)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '20px',
              borderRadius: '30px',
            }}
          >
            {content.badge}
          </div>
        )}

        <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 700, lineHeight: 1.1, marginBottom: '20px', color: '#fff' }}>
          {content.title}
        </h1>

        {content.subtitle && (
          <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: '35px' }}>
            {content.subtitle}
          </p>
        )}

        {content.ctaText && (
          <Link href={content.ctaLink || '/contact'} className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '15px' }}>
            {content.ctaText}
          </Link>
        )}
      </div>
    </section>
  );
}
