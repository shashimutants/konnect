import React from 'react';
import Link from 'next/link';

interface CardItem {
  number?: string;
  title: string;
  description: string;
  features?: string[];
  btnText?: string;
  btnLink?: string;
}

interface CapabilitiesGridProps {
  subtitle?: string;
  title: string;
  cards?: CardItem[];
}

export default function CapabilitiesGridBlock({ content }: { content: CapabilitiesGridProps }) {
  const cards = content.cards || [];

  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-heading-center">
          {content.subtitle && <h6 className="section-subtitle">{content.subtitle}</h6>}
          <h2 className="section-title">{content.title}</h2>
        </div>

        <div className="services-grid">
          {cards.map((card, idx) => (
            <div key={idx} className="service-card">
              {card.number && <div className="service-number">{card.number}</div>}
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              {card.features && card.features.length > 0 && (
                <ul className="product-features">
                  {card.features.map((feat, fIdx) => (
                    <li key={fIdx}>{feat}</li>
                  ))}
                </ul>
              )}
              {card.btnText && (
                <Link href={card.btnLink || '/services'} className="btn btn-outline">
                  {card.btnText}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
