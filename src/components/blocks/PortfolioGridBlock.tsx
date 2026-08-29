import React from 'react';
import Link from 'next/link';

interface PortfolioItem {
  category: string;
  title: string;
  image: string;
  link?: string;
}

interface PortfolioGridProps {
  items?: PortfolioItem[];
}

export default function PortfolioGridBlock({ content }: { content: PortfolioGridProps }) {
  const items = content.items || [];

  return (
    <section className="portfolio-grid">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="portfolio-item"
          style={{ backgroundImage: `url(${item.image || '/images/portfolio-0001-free-img.jpg'})` }}
        >
          <span className="portfolio-category">{item.category}</span>
          <h4>{item.title}</h4>
          <Link href={item.link || '/portfolio'} className="portfolio-link" aria-label={`View ${item.title}`}>
            <svg viewBox="0 0 448 512" style={{ width: '14px', height: '14px', fill: '#ffffff' }}>
              <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.7 224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h306.7L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
            </svg>
          </Link>
        </div>
      ))}
    </section>
  );
}
