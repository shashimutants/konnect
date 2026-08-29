'use client';

import React, { useState } from 'react';

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  phone?: string;
  email?: string;
  hours?: string;
  address?: string;
}

export default function ContactFormBlock({ content }: { content: ContactFormProps }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="section">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            {content.subtitle && <h6 className="section-subtitle">{content.subtitle}</h6>}
            <h2>{content.title || 'Get In Touch'}</h2>
            <p style={{ color: '#666', lineHeight: '1.75em', marginTop: '15px', marginBottom: '35px' }}>
              Have questions about our outdoor media availability, commercial video wall installations, or demand generation campaigns? Contact our enterprise team today.
            </p>

            <div className="contact-info-block">
              {content.phone && (
                <div className="contact-info-row">
                  <strong>Phone:</strong> {content.phone}
                </div>
              )}
              {content.email && (
                <div className="contact-info-row">
                  <strong>Email:</strong> {content.email}
                </div>
              )}
              {content.hours && (
                <div className="contact-info-row">
                  <strong>Hours:</strong> {content.hours}
                </div>
              )}
              {content.address && (
                <div className="contact-info-row">
                  <strong>Location:</strong> {content.address}
                </div>
              )}
            </div>
          </div>

          <div className="contact-form-wrap" style={{ background: '#F2F5F7', padding: '40px 35px', border: '1px solid #eaeaea' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <h3 style={{ color: 'var(--ast-global-color-0)', marginBottom: '10px' }}>Thank You!</h3>
                <p style={{ color: '#555' }}>Your message has been received. A representative will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Full Name <span style={{ color: 'var(--ast-global-color-0)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid #ddd', fontSize: '14px' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Email Address <span style={{ color: 'var(--ast-global-color-0)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid #ddd', fontSize: '14px' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Subject / Project Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Billboard Flight / LED Wall Specs"
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid #ddd', fontSize: '14px' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Message <span style={{ color: 'var(--ast-global-color-0)' }}>*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your project requirements..."
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid #ddd', fontSize: '14px' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
