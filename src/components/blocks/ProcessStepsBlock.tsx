import React from 'react';

interface StepItem {
  step: string;
  title: string;
  description: string;
}

interface ProcessStepsProps {
  subtitle?: string;
  title: string;
  description?: string;
  steps: StepItem[];
}

export default function ProcessStepsBlock({ content }: { content: ProcessStepsProps }) {
  return (
    <section className="section" style={{ padding: '80px 0', backgroundColor: '#F8FAFC' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px' }}>
          {content.subtitle && <h6 className="section-subtitle">{content.subtitle}</h6>}
          <h2 className="section-title">{content.title}</h2>
          {content.description && <p style={{ color: '#666', fontSize: '15px' }}>{content.description}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', position: 'relative' }}>
          {(content.steps || []).map((step, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#fff',
                padding: '35px 25px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--ast-global-color-0)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '15px',
                  marginBottom: '20px',
                }}
              >
                {step.step || `0${idx + 1}`}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E293B', marginBottom: '10px' }}>
                {step.title}
              </h3>
              <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
