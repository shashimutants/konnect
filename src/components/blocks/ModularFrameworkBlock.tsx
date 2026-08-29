import React from 'react';
import Link from 'next/link';

interface Step {
  stepNum: string;
  title: string;
  description: string;
}

interface ModularFrameworkProps {
  subtitle?: string;
  title: string;
  introText?: string;
  steps?: Step[];
  quoteText?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function ModularFrameworkBlock({ content }: { content: ModularFrameworkProps }) {
  const steps = content.steps || [];

  return (
    <section className="section section-dark modular-section">
      <div className="container">
        <div className="section-heading-center">
          {content.subtitle && <h6 className="section-subtitle">{content.subtitle}</h6>}
          <h2 className="section-title" style={{ color: '#ffffff' }}>
            {content.title}
          </h2>
        </div>

        {content.introText && <p className="modular-intro">{content.introText}</p>}

        <div className="modular-steps">
          {steps.map((step, idx) => (
            <div key={idx} className="modular-step">
              <span className="modular-step-num">{step.stepNum}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>

        {(content.quoteText || content.ctaText) && (
          <div className="modular-callout">
            {content.quoteText && <p>&ldquo;{content.quoteText}&rdquo;</p>}
            {content.ctaText && (
              <Link href={content.ctaLink || '/contact'} className="btn btn-primary">
                {content.ctaText}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
