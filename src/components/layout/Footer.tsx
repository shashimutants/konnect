import React from 'react';
import Link from 'next/link';

export default function Footer({
  siteName = 'Konnect Marketing USA',
  tagline = 'One partner. Every channel. Every state.',
  phone = '929-242-6868',
  email = 'contact@konnectmarketingusa.com',
  hours = 'Mon - Fri: 9:00 AM - 6:00 PM',
  address = 'New York, NY',
  socialLinkedin = 'https://linkedin.com',
  socialInstagram = 'https://instagram.com',
  socialYoutube = 'https://youtube.com',
}: {
  siteName?: string;
  tagline?: string;
  phone?: string;
  email?: string;
  hours?: string;
  address?: string;
  socialLinkedin?: string;
  socialInstagram?: string;
  socialYoutube?: string;
}) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-row">
          <div className="footer-col footer-brand">
            <Link href="/" className="footer-logo">
              {siteName}
            </Link>
            <p className="footer-tagline">{tagline}</p>
            <div className="footer-social">
              {socialLinkedin && (
                <a href={socialLinkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg viewBox="0 0 448 512">
                    <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.1-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
                  </svg>
                </a>
              )}
              {socialInstagram && (
                <a href={socialInstagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 448 512">
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                  </svg>
                </a>
              )}
              {socialYoutube && (
                <a href={socialYoutube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <svg viewBox="0 0 576 512">
                    <path d="M549.7 124.1c-6.281-23.65-24.79-42.28-48.28-48.6C458.8 64 288 64 288 64S117.2 64 74.63 75.49c-23.5 6.322-42 24.95-48.28 48.6-11.41 42.87-11.41 132.3-11.41 132.3s0 89.44 11.41 132.3c6.281 23.65 24.79 41.5 48.28 47.82C117.2 448 288 448 288 448s170.8 0 213.4-11.49c23.5-6.321 42-24.17 48.28-47.82 11.41-42.87 11.41-132.3 11.41-132.3s0-89.44-11.41-132.3zm-317.5 213.5V175.2l142.7 81.21-142.7 81.2z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div className="footer-col footer-services">
            <h5>Services</h5>
            <ul>
              <li><Link href="/services">Outdoor Advertising</Link></li>
              <li><Link href="/services">Digital Signage</Link></li>
              <li><Link href="/services">Creative &amp; Content</Link></li>
              <li><Link href="/services">Experiential Solutions</Link></li>
              <li><Link href="/services">Events &amp; Exhibitions</Link></li>
              <li><Link href="/services">Marketing Solutions</Link></li>
            </ul>
          </div>

          <div className="footer-col footer-products">
            <h5>Products</h5>
            <ul>
              <li><Link href="/products">Static Billboards</Link></li>
              <li><Link href="/products">Digital LED Billboards</Link></li>
              <li><Link href="/products">Transit Shelters</Link></li>
              <li><Link href="/products">LED Video Walls</Link></li>
              <li><Link href="/products">Interactive Kiosks</Link></li>
              <li><Link href="/products">Audio &amp; Lighting</Link></li>
            </ul>
          </div>

          <div className="footer-col footer-contact">
            <h5>Quick Contact</h5>
            {phone && (
              <div className="footer-contact-row">
                <strong>Phone:</strong> {phone}
              </div>
            )}
            {email && (
              <div className="footer-contact-row">
                <strong>Email:</strong> {email}
              </div>
            )}
            {hours && (
              <div className="footer-contact-row">
                <strong>Hours:</strong> {hours}
              </div>
            )}
            {address && (
              <div className="footer-contact-row">
                <strong>Headquarters:</strong> {address}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <div className="footer-copyright">
            Copyright &copy; {new Date().getFullYear()} {siteName}. All Rights Reserved.
          </div>
          <div className="footer-bottom-links">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/products">Products</Link>
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
