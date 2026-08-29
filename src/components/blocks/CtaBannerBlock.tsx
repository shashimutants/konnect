import React from 'react';
import Link from 'next/link';

interface CtaBannerProps {
  variant?: 'light' | 'dark' | 'image';
  subtitle?: string;
  title: string;
  btnText?: string;
  btnLink?: string;
  bgImage?: string;
}

export default function CtaBannerBlock({ content }: { content: CtaBannerProps }) {
  const isImage = content.variant === 'image';
  const isDark = content.variant === 'dark';

  return (
    <section
      className={`cta-section ${isImage ? 'cta-image' : ''}`}
      style={{
        backgroundColor: isDark ? 'var(--ast-global-color-5)' : isImage ? undefined : 'var(--ast-global-color-6)',
        color: isDark || isImage ? '#ffffff' : 'var(--ast-global-color-4)',
        backgroundImage: isImage
          ? `linear-gradient(rgba(0,0,0,0.78), rgba(0,0,0,0.78)), url(${content.bgImage || '/images/bg-14-free-img.jpg'})`
          : undefined,
      }}
    >
      <div className="container">
        {content.subtitle && <h6>{content.subtitle}</h6>}
        <h3 style={{ color: isDark || isImage ? '#ffffff' : 'var(--ast-global-color-4)' }}>
          {content.title}
        </h3>
        {content.btnText && (
          <Link
            href={content.btnLink || '/contact'}
            className={isDark || isImage ? 'btn btn-light' : 'btn btn-primary'}
          >
            {content.btnText}
          </Link>
        )}
      </div>
    </section>
  );
}
