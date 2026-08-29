import React from 'react';

interface LogoItem {
  name: string;
  image: string;
}

interface ClientLogosProps {
  subtitle?: string;
  title: string;
  logos?: LogoItem[];
}

export default function ClientLogosBlock({ content }: { content: ClientLogosProps }) {
  const logos = content.logos || [];

  return (
    <section className="section text-center">
      <div className="container">
        {content.subtitle && <h6 className="section-subtitle">{content.subtitle}</h6>}
        <h2 className="section-title">{content.title}</h2>
        <div className="clients-grid">
          {logos.map((logo, idx) => (
            <img key={idx} src={logo.image} alt={logo.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
