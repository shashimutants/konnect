import React from 'react';

interface RichTextProps {
  title?: string;
  htmlContent: string;
}

export default function RichTextBlock({ content }: { content: RichTextProps }) {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '900px' }}>
        {content.title && <h2 className="section-title">{content.title}</h2>}
        <div
          className="rich-text-content"
          style={{ lineHeight: '1.8em', color: '#444' }}
          dangerouslySetInnerHTML={{ __html: content.htmlContent || '' }}
        />
      </div>
    </section>
  );
}
