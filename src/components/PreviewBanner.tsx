'use client';

import React from 'react';

interface PreviewBannerProps {
  slug?: string;
}

export default function PreviewBanner({ slug }: PreviewBannerProps) {
  const exitUrl = `/api/draft/disable?returnUrl=${encodeURIComponent(slug ? `/${slug}` : '/')}`;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        backgroundColor: '#1E293B',
        color: '#fff',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        fontSize: '14px',
        fontWeight: 600,
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        borderBottom: '3px solid #EC4B46',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#F59E0B',
            animation: 'pulse 2s infinite',
            display: 'inline-block',
          }}
        />
        You are previewing <strong style={{ color: '#EC4B46' }}>DRAFT</strong> content — This page is not yet published.
      </span>

      <a
        href={exitUrl}
        style={{
          padding: '5px 14px',
          backgroundColor: '#EC4B46',
          color: '#fff',
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        Exit Preview Mode
      </a>
    </div>
  );
}
