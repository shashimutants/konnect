import React from 'react';

interface RowItem {
  feature: string;
  plan1: string;
  plan2: string;
  plan3: string;
}

interface FeatureComparisonProps {
  subtitle?: string;
  title: string;
  description?: string;
  columnHeaders?: string[];
  rows: RowItem[];
}

export default function FeatureComparisonBlock({ content }: { content: FeatureComparisonProps }) {
  const headers = content.columnHeaders || ['Specification', 'Standard Flight', 'Regional Synergy', 'National Dominance'];

  return (
    <section className="section" style={{ backgroundColor: '#fff', padding: '80px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 40px' }}>
          {content.subtitle && <h6 className="section-subtitle">{content.subtitle}</h6>}
          <h2 className="section-title">{content.title}</h2>
          {content.description && <p style={{ color: '#666', fontSize: '15px' }}>{content.description}</p>}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ backgroundColor: '#111', color: '#fff' }}>
                <th style={{ padding: '16px 20px', fontSize: '14px', textTransform: 'uppercase' }}>{headers[0]}</th>
                <th style={{ padding: '16px 20px', fontSize: '14px', textTransform: 'uppercase' }}>{headers[1]}</th>
                <th style={{ padding: '16px 20px', fontSize: '14px', textTransform: 'uppercase', backgroundColor: 'var(--ast-global-color-0)' }}>{headers[2]}</th>
                <th style={{ padding: '16px 20px', fontSize: '14px', textTransform: 'uppercase' }}>{headers[3]}</th>
              </tr>
            </thead>
            <tbody>
              {(content.rows || []).map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: idx % 2 === 0 ? '#F8FAFC' : '#fff' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600, fontSize: '14px', color: '#1E293B' }}>{row.feature}</td>
                  <td style={{ padding: '14px 20px', fontSize: '14px', color: '#64748B' }}>{row.plan1}</td>
                  <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: 600, color: 'var(--ast-global-color-0)', backgroundColor: 'rgba(236,75,70,0.04)' }}>{row.plan2}</td>
                  <td style={{ padding: '14px 20px', fontSize: '14px', color: '#64748B' }}>{row.plan3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
