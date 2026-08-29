import React from 'react';
import Link from 'next/link';

interface CardItem {
  icon?: string;
  title: string;
  description: string;
  linkText?: string;
  linkUrl?: string;
}

interface ThreeColumnCardsProps {
  subtitle?: string;
  title: string;
  intro?: string;
  cards: CardItem[];
}

export default function ThreeColumnCardsBlock({ content }: { content: ThreeColumnCardsProps }) {
  return (
    <section className="section" style={{ backgroundColor: '#F8FAFC', padding: '80px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px' }}>
          {content.subtitle && <h6 className="section-subtitle">{content.subtitle}</h6>}
          <h2 className="section-title">{content.title}</h2>
          {content.intro && <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.6 }}>{content.intro}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {(content.cards || []).map((card, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#fff',
                padding: '35px 30px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              {card.icon && <div style={{ fontSize: '32px', marginBottom: '18px' }}>{card.icon}</div>}
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1E293B', marginBottom: '12px' }}>
                {card.title}
              </h3>
              <p style={{ color: '#64748B', fontSize: '15px', lineHeight: 1.6, flex: 1, marginBottom: '20px' }}>
                {card.description}
              </p>
              {card.linkText && (
                <Link
                  href={card.linkUrl || '/services'}
                  style={{
                    color: 'var(--ast-global-color-0)',
                    fontWeight: 600,
                    fontSize: '14px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {card.linkText} &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
