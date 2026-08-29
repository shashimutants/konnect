'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface MenuItemData {
  id: string;
  title: string;
  url: string;
  badge?: string | null;
  orderIndex: number;
}

export default function Header({
  siteLogo = '/images/logo.png',
  menuItems = [],
}: {
  siteLogo?: string;
  menuItems?: MenuItemData[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
    setServicesDropdownOpen(false);
    setProductsDropdownOpen(false);
  }, [pathname]);

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-inner">
        <Link href="/" className="logo">
          <img src={siteLogo} alt="Konnect Marketing USA" style={{ height: '48px', width: 'auto' }} />
        </Link>

        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          onClick={() => setMobileNavOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`main-nav ${mobileNavOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li>
              <Link href="/" className={pathname === '/' ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className={pathname === '/about' ? 'active' : ''}>
                About
              </Link>
            </li>

            {/* SERVICES MEGA MENU */}
            <li className={`has-dropdown mega-menu-item ${servicesDropdownOpen ? 'open' : ''}`}>
              <Link href="/services" className={pathname === '/services' ? 'active' : ''}>
                Services
              </Link>
              <button
                className="dropdown-toggle"
                aria-label="Toggle submenu"
                onClick={(e) => {
                  e.preventDefault();
                  setServicesDropdownOpen((prev) => !prev);
                }}
              >
                <svg viewBox="0 0 256 512" style={{ width: '12px', height: '12px', fill: 'currentColor' }}>
                  <path d="M118.6 105.4l144 144c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0l-98.6-98.6-98.6 98.6c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l144-144c9.4-9.4 24.6-9.4 33.9 0z"/>
                </svg>
              </button>
              <div className="mega-menu">
                <div className="mega-menu-col">
                  <div className="mega-menu-category">
                    <h4>Digital Marketing &amp; Demand Gen</h4>
                    <ul>
                      <li><Link href="/services">Paid Search &amp; Social</Link></li>
                      <li><Link href="/services">SEO &amp; Content Marketing</Link></li>
                      <li><Link href="/services">Performance Attribution</Link></li>
                      <li><Link href="/services">Geo-Fenced Campaigns</Link></li>
                    </ul>
                    <Link href="/services" className="mega-menu-view-all">View All Digital Marketing</Link>
                  </div>
                  <div className="mega-menu-category">
                    <h4>Outdoor &amp; Transit Advertising</h4>
                    <ul>
                      <li><Link href="/services">Static Billboards</Link></li>
                      <li><Link href="/services">Digital LED Billboards</Link></li>
                      <li><Link href="/services">Transit Shelters &amp; Wraps</Link></li>
                      <li><Link href="/services">Airport &amp; Rail Concourse</Link></li>
                    </ul>
                    <Link href="/services" className="mega-menu-view-all">View All Outdoor &amp; Transit</Link>
                  </div>
                </div>

                <div className="mega-menu-col">
                  <div className="mega-menu-category">
                    <h4>Video Display &amp; Signage</h4>
                    <ul>
                      <li><Link href="/products">LED Video Walls</Link></li>
                      <li><Link href="/products">Corporate Digital Signage</Link></li>
                      <li><Link href="/products">Multi-Branch Cloud CMS</Link></li>
                      <li><Link href="/products">Projection Systems</Link></li>
                    </ul>
                    <Link href="/products" className="mega-menu-view-all">View All Display Systems</Link>
                  </div>
                  <div className="mega-menu-category">
                    <h4>Interactive AV &amp; Kiosks</h4>
                    <ul>
                      <li><Link href="/products">Touchscreen Wayfinding Kiosks</Link></li>
                      <li><Link href="/products">Sensor-Based Displays</Link></li>
                      <li><Link href="/products">Smart Branch Installations</Link></li>
                      <li><Link href="/products">Custom Interactive Apps</Link></li>
                    </ul>
                    <Link href="/products" className="mega-menu-view-all">View All Interactive</Link>
                  </div>
                </div>

                <div className="mega-menu-col">
                  <div className="mega-menu-category">
                    <h4>Creative, Video &amp; Motion</h4>
                    <ul>
                      <li><Link href="/services">Brand &amp; Corporate Films</Link></li>
                      <li><Link href="/services">3D Motion Graphics</Link></li>
                      <li><Link href="/services">Ad Creative Production</Link></li>
                      <li><Link href="/services">Explainer Videos</Link></li>
                    </ul>
                    <Link href="/services" className="mega-menu-view-all">View All Creative</Link>
                  </div>
                  <div className="mega-menu-category">
                    <h4>Lighting, Audio &amp; Events</h4>
                    <ul>
                      <li><Link href="/services">Architectural Facade Lighting</Link></li>
                      <li><Link href="/services">Commercial Sound &amp; PA</Link></li>
                      <li><Link href="/services">Trade Show Booth Production</Link></li>
                      <li><Link href="/services">Experiential Activations</Link></li>
                    </ul>
                    <Link href="/services" className="mega-menu-view-all">View All Events</Link>
                  </div>
                </div>
              </div>
            </li>

            {/* PRODUCTS MEGA MENU */}
            <li className={`has-dropdown mega-menu-item ${productsDropdownOpen ? 'open' : ''}`}>
              <Link href="/products" className={pathname === '/products' ? 'active' : ''}>
                Products
              </Link>
              <button
                className="dropdown-toggle"
                aria-label="Toggle submenu"
                onClick={(e) => {
                  e.preventDefault();
                  setProductsDropdownOpen((prev) => !prev);
                }}
              >
                <svg viewBox="0 0 256 512" style={{ width: '12px', height: '12px', fill: 'currentColor' }}>
                  <path d="M118.6 105.4l144 144c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0l-98.6-98.6-98.6 98.6c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l144-144c9.4-9.4 24.6-9.4 33.9 0z"/>
                </svg>
              </button>
              <div className="mega-menu">
                <div className="mega-menu-col">
                  <div className="mega-menu-category">
                    <h4>Outdoor Media Hardware</h4>
                    <ul>
                      <li><Link href="/products">Digital LED Billboards</Link></li>
                      <li><Link href="/products">Static &amp; Trivision Billboards</Link></li>
                      <li><Link href="/products">Transit Shelters</Link></li>
                      <li><Link href="/products">Pole &amp; Street Displays</Link></li>
                    </ul>
                    <Link href="/products" className="mega-menu-view-all">View All Outdoor Media</Link>
                  </div>
                  <div className="mega-menu-category">
                    <h4>Commercial Audio &amp; Lighting</h4>
                    <ul>
                      <li><Link href="/products">Architectural Wall Grazers</Link></li>
                      <li><Link href="/products">DMX LED Lighting</Link></li>
                      <li><Link href="/products">Distributed PA Systems</Link></li>
                      <li><Link href="/products">Stage &amp; Presentation Sound</Link></li>
                    </ul>
                    <Link href="/products" className="mega-menu-view-all">View All Audio &amp; Lighting</Link>
                  </div>
                </div>

                <div className="mega-menu-col">
                  <div className="mega-menu-category">
                    <h4>LED Video Walls</h4>
                    <ul>
                      <li><Link href="/products">Indoor Ultra-Fine Pitch LED</Link></li>
                      <li><Link href="/products">Curved &amp; Flexible LED Panels</Link></li>
                      <li><Link href="/products">Transparent Glass LED</Link></li>
                      <li><Link href="/products">Outdoor High-Bright Walls</Link></li>
                    </ul>
                    <Link href="/products" className="mega-menu-view-all">View All LED Video Walls</Link>
                  </div>
                  <div className="mega-menu-category">
                    <h4>Interactive Kiosks</h4>
                    <ul>
                      <li><Link href="/products">43"-65" Multi-Touch Kiosks</Link></li>
                      <li><Link href="/products">Capacitive Wayfinding Hubs</Link></li>
                      <li><Link href="/products">Outdoor Weatherproof Displays</Link></li>
                      <li><Link href="/products">Integrated QR/NFC Scanner</Link></li>
                    </ul>
                    <Link href="/products" className="mega-menu-view-all">View All Kiosks</Link>
                  </div>
                </div>

                <div className="mega-menu-col">
                  <div className="mega-menu-category">
                    <h4>Campaign Intelligence</h4>
                    <ul>
                      <li><Link href="/services">Geo-Fenced Attribution</Link></li>
                      <li><Link href="/services">Foot-Traffic Lift Dashboards</Link></li>
                      <li><Link href="/services">Multi-Channel Flight Sync</Link></li>
                      <li><Link href="/services">Real-Time Impression Metrics</Link></li>
                    </ul>
                    <Link href="/services" className="mega-menu-view-all">View All Analytics</Link>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <Link href="/portfolio" className={pathname === '/portfolio' ? 'active' : ''}>
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>
                Contact
              </Link>
            </li>
            <li className="nav-cta">
              <Link href="/contact">Get A Quote</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
