import React from 'react';
import Link from 'next/link';

interface SpecItem {
  title: string;
  description: string;
}

interface ProductItem {
  badge: string;
  title: string;
  description: string;
  features: string[];
  image: string;
}

interface CategoryGroup {
  categoryNum: string;
  title: string;
  description: string;
  isDark?: boolean;
  products: ProductItem[];
}

interface ProductCatalogProps {
  specsStrip?: SpecItem[];
  categories?: CategoryGroup[];
}

export default function ProductCatalogBlock({ content }: { content: ProductCatalogProps }) {
  const specsStrip = content.specsStrip || [];
  const categories = content.categories || [];

  return (
    <>
      {specsStrip.length > 0 && (
        <section className="section section-alt" style={{ padding: '60px 0' }}>
          <div className="container">
            <div className="specs-grid">
              {specsStrip.map((spec, idx) => (
                <div key={idx} className="spec-card">
                  <div className="spec-icon">
                    <svg viewBox="0 0 512 512">
                      <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zm137 201L233 361c-6.2 6.2-16.4 6.2-22.6 0l-71-71c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0l59.7 59.7l148.7-148.7c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/>
                    </svg>
                  </div>
                  <h4>{spec.title}</h4>
                  <p>{spec.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {categories.map((cat, idx) => (
        <section key={idx} className={`section ${cat.isDark ? 'section-dark' : ''}`}>
          <div className="container">
            <div className="category-header">
              <h6 className="section-subtitle">{cat.categoryNum}</h6>
              <h2 className="section-title" style={{ color: cat.isDark ? '#ffffff' : undefined }}>
                {cat.title}
              </h2>
              <p className="category-desc" style={{ color: cat.isDark ? 'rgba(255,255,255,0.7)' : undefined }}>
                {cat.description}
              </p>
            </div>

            <div className="products-grid">
              {cat.products.map((prod, pIdx) => (
                <div key={pIdx} className={`product-card ${cat.isDark ? 'dark-card' : ''}`}>
                  <div className="product-image" style={{ backgroundImage: `url(${prod.image || '/images/portfolio-0001-free-img.jpg'})` }}>
                    <span className="product-badge">{prod.badge}</span>
                  </div>
                  <div className="product-body">
                    <h3>{prod.title}</h3>
                    <p>{prod.description}</p>
                    {prod.features && (
                      <ul className="product-features">
                        {prod.features.map((feat, fIdx) => (
                          <li key={fIdx}>{feat}</li>
                        ))}
                      </ul>
                    )}
                    <Link href="/contact" className="btn btn-outline" style={{ borderColor: cat.isDark ? '#ffffff' : undefined, color: cat.isDark ? '#ffffff' : undefined }}>
                      Request Specs
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
