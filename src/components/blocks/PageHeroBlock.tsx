import React from 'react';

interface PageHeroProps {
  subtitle?: string;
  title: string;
  description?: string;
  bgImage?: string;
}

export default function PageHeroBlock({ content }: { content: PageHeroProps }) {
  return (
    <section
      className="page-hero"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${content.bgImage || '/images/bg-14-free-img.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="hero-content">
        {content.subtitle && (
          <h6 className="section-subtitle" style={{ color: 'var(--ast-global-color-0)', marginBottom: '15px' }}>
            {content.subtitle}
          </h6>
        )}
        <h1>{content.title}</h1>
        {content.description && <p>{content.description}</p>}
      </div>
    </section>
  );
}
