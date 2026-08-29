import React from 'react';
import Link from 'next/link';

interface TwoColumnStoryProps {
  subtitle?: string;
  title: string;
  paragraphs?: string[];
  btnText?: string;
  btnLink?: string;
  sideType?: 'image' | 'checklist';
  sideContent?: string; // Image URL or JSON array of checkmark strings
}

export default function TwoColumnStoryBlock({ content }: { content: TwoColumnStoryProps }) {
  const paragraphs = content.paragraphs || [];
  let checklistItems: string[] = [];

  if (content.sideType === 'checklist' && content.sideContent) {
    try {
      checklistItems = JSON.parse(content.sideContent);
    } catch {
      checklistItems = [content.sideContent];
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="about-intro">
          <div className="about-intro-left">
            {content.subtitle && (
              <h6>
                <span className="separator"></span> {content.subtitle}
              </h6>
            )}
            <h2>{content.title}</h2>
            {paragraphs.map((p, idx) => (
              <p key={idx} style={{ color: '#666', lineHeight: '1.75em', marginTop: idx === 0 ? '20px' : '10px' }}>
                {p}
              </p>
            ))}
            {content.btnText && (
              <div style={{ marginTop: '25px' }}>
                <Link href={content.btnLink || '/about'} className="btn btn-outline">
                  {content.btnText}
                </Link>
              </div>
            )}
          </div>

          <div className="about-intro-right">
            {content.sideType === 'checklist' ? (
              <ul className="check-list" style={{ margin: 0, background: '#F2F5F7', padding: '35px 30px', borderLeft: '4px solid var(--ast-global-color-0)' }}>
                {checklistItems.map((item, idx) => (
                  <li key={idx} style={{ fontSize: '15px', fontWeight: 600, marginBottom: idx === checklistItems.length - 1 ? 0 : '16px' }}>
                    <svg viewBox="0 0 448 512" style={{ width: '16px', height: '16px', fill: 'var(--ast-global-color-0)', marginRight: '10px', verticalAlign: 'middle' }}>
                      <path d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <img
                src={content.sideContent || '/images/about-001-free-img.jpg'}
                alt={content.title}
                style={{ width: '100%', border: '1px solid #eaeaea', boxShadow: '0 15px 35px rgba(0,0,0,0.06)' }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
