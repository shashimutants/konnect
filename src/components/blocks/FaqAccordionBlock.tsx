'use client';

import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  subtitle?: string;
  title: string;
  description?: string;
  faqs: FaqItem[];
}

export default function FaqAccordionBlock({ content }: { content: FaqAccordionProps }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function toggleFaq(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section className="section" style={{ padding: '80px 0', backgroundColor: '#fff' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          {content.subtitle && <h6 className="section-subtitle">{content.subtitle}</h6>}
          <h2 className="section-title">{content.title}</h2>
          {content.description && <p style={{ color: '#666', fontSize: '15px' }}>{content.description}</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {(content.faqs || []).map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  backgroundColor: isOpen ? '#F8FAFC' : '#fff',
                  transition: 'background-color 0.2s',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '20px 24px',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#1E293B',
                  }}
                >
                  <span>{faq.question}</span>
                  <span style={{ fontSize: '20px', color: 'var(--ast-global-color-0)', fontWeight: 700 }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 24px 22px',
                      color: '#64748B',
                      fontSize: '15px',
                      lineHeight: 1.7,
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
