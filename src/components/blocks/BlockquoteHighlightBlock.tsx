import React from 'react';

interface BlockquoteHighlightProps {
  quote: string;
  authorName: string;
  authorTitle?: string;
  company?: string;
  avatarUrl?: string;
  backgroundColor?: string;
}

export default function BlockquoteHighlightBlock({ content }: { content: BlockquoteHighlightProps }) {
  const isDark = content.backgroundColor === 'dark' || content.backgroundColor === '#111';

  return (
    <section
      style={{
        padding: '70px 20px',
        backgroundColor: isDark ? '#111111' : '#F1F5F9',
        color: isDark ? '#FFFFFF' : '#0F172A',
        textAlign: 'center',
      }}
    >
      <div className="container" style={{ maxWidth: '850px' }}>
        <div style={{ fontSize: '48px', color: 'var(--ast-global-color-0)', lineHeight: 1, marginBottom: '15px' }}>
          &ldquo;
        </div>
        <blockquote
          style={{
            fontSize: 'clamp(20px, 3.5vw, 28px)',
            fontWeight: 500,
            lineHeight: 1.45,
            margin: '0 0 25px 0',
            fontStyle: 'italic',
          }}
        >
          {content.quote}
        </blockquote>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
          {content.avatarUrl && (
            <img
              src={content.avatarUrl}
              alt={content.authorName}
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
            />
          )}
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>{content.authorName}</div>
            {(content.authorTitle || content.company) && (
              <div style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
                {content.authorTitle} {content.company ? `• ${content.company}` : ''}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
