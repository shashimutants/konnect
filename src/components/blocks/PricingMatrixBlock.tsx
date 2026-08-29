import React from 'react';
import Link from 'next/link';

interface PlanItem {
  badge?: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  ctaLink: string;
}

interface PricingMatrixProps {
  subtitle?: string;
  title: string;
  description?: string;
  plans: PlanItem[];
}

export default function PricingMatrixBlock({ content }: { content: PricingMatrixProps }) {
  return (
    <section className="section" style={{ backgroundColor: '#F8FAFC', padding: '80px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px' }}>
          {content.subtitle && <h6 className="section-subtitle">{content.subtitle}</h6>}
          <h2 className="section-title">{content.title}</h2>
          {content.description && <p style={{ color: '#666', fontSize: '15px' }}>{content.description}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', alignItems: 'stretch' }}>
          {(content.plans || []).map((plan, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '40px 30px',
                border: plan.isPopular ? '2px solid var(--ast-global-color-0)' : '1px solid #E2E8F0',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: plan.isPopular ? '0 15px 35px rgba(236,75,70,0.12)' : '0 4px 15px rgba(0,0,0,0.03)',
              }}
            >
              {plan.isPopular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--ast-global-color-0)',
                    color: '#fff',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  Most Popular Flight
                </div>
              )}

              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
                {plan.name}
              </h3>
              <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '20px' }}>
                {plan.description}
              </p>

              <div style={{ marginBottom: '25px' }}>
                <span style={{ fontSize: '36px', fontWeight: 700, color: '#0F172A' }}>{plan.price}</span>
                {plan.period && <span style={{ color: '#64748B', fontSize: '14px', marginLeft: '4px' }}>/{plan.period}</span>}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', flex: 1 }}>
                {(plan.features || []).map((f, fIdx) => (
                  <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#475569', marginBottom: '10px' }}>
                    <span style={{ color: 'var(--ast-global-color-0)', fontWeight: 700 }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaLink || '/contact'}
                className={`btn ${plan.isPopular ? 'btn-primary' : ''}`}
                style={{
                  textAlign: 'center',
                  width: '100%',
                  border: plan.isPopular ? 'none' : '2px solid #222',
                  color: plan.isPopular ? '#fff' : '#222',
                }}
              >
                {plan.ctaText || 'Get Started'}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
