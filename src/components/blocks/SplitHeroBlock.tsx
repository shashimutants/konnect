import React from 'react';
import Link from 'next/link';

interface SplitHeroProps {
  badge?: string;
  title: string;
  subtitle?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  image?: string;
  highlightText?: string;
}

export default function SplitHeroBlock({ content }: { content: SplitHeroProps }) {
  return (
    <section className="section split-hero-section" style={{ padding: '80px 0', backgroundColor: '#fff' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px', alignItems: 'center' }}>
          <div>
            {content.badge && (
              <span style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: 'rgba(236,75,70,0.1)', color: 'var(--ast-global-color-0)', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '18px', borderRadius: '4px' }}>
                {content.badge}
              </span>
            )}
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, lineHeight: 1.15, color: '#111', marginBottom: '20px' }}>
              {content.title}
            </h1>
            {content.subtitle && (
              <p style={{ fontSize: '18px', color: '#666', lineHeight: 1.6, marginBottom: '32px' }}>
                {content.subtitle}
              </p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
              {content.primaryBtnText && (
                <Link href={content.primaryBtnLink || '/contact'} className="btn btn-primary">
                  {content.primaryBtnText}
                </Link>
              )}
              {content.secondaryBtnText && (
                <Link href={content.secondaryBtnLink || '/services'} className="btn" style={{ border: '2px solid #222', color: '#222' }}>
                  {content.secondaryBtnText}
                </Link>
              )}
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}>
              <img
                src={content.image || '/images/bg-01-free-img.jpg'}
                alt={content.title}
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
            </div>
            {content.highlightText && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '20px',
                  backgroundColor: '#111',
                  color: '#fff',
                  padding: '16px 24px',
                  borderRadius: '6px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                ⚡ {content.highlightText}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
