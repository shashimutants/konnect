'use client';

import React from 'react';
import { logoutAction } from '@/actions/auth';

export default function AdminHeader({
  userName = 'Admin',
  userRole = 'SUPER_ADMIN',
  onMenuToggle,
}: {
  userName?: string;
  userRole?: string;
  onMenuToggle: () => void;
}) {
  return (
    <header
      style={{
        height: '65px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #eaeaea',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 25px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button
          onClick={onMenuToggle}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '22px',
            cursor: 'pointer',
            padding: '5px',
            display: 'none',
          }}
          className="admin-mobile-toggle"
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <span style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
          Konnect Management Console
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#222' }}>{userName}</div>
          <div style={{ fontSize: '11px', color: 'var(--ast-global-color-0)', textTransform: 'uppercase', fontWeight: 700 }}>
            {userRole.replace('_', ' ')}
          </div>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'background 0.2s',
            }}
          >
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}
