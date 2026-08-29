'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getVisibleNavLinks } from '@/lib/permissions';

export default function AdminSidebar({
  isOpen,
  onClose,
  userRole,
}: {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 998,
          }}
        />
      )}

      <aside
        style={{
          width: '260px',
          backgroundColor: '#111111',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 999,
          transform: isOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.3s ease',
          borderRight: '1px solid rgba(255,255,255,0.1)',
        }}
        className="admin-sidebar"
      >
        <div
          style={{
            padding: '24px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link href="/admin/dashboard" style={{ textDecoration: 'none', color: '#fff' }}>
            <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 700, letterSpacing: '0.5px' }}>
              KONNECT <span style={{ color: 'var(--ast-global-color-0)' }}>CMS</span>
            </h2>
          </Link>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'none',
            }}
            className="mobile-close-btn"
          >
            &times;
          </button>
        </div>

        <nav style={{ flex: 1, padding: '20px 10px', overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {getVisibleNavLinks(userRole || 'SUPER_ADMIN').map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <li key={link.href} style={{ marginBottom: '6px' }}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '4px',
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
                      backgroundColor: isActive ? 'var(--ast-global-color-0)' : 'transparent',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '14px',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          <Link
            href="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--ast-global-color-0)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            <span>↗</span> View Public Website
          </Link>
        </div>
      </aside>
    </>
  );
}
