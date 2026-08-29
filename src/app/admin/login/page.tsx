'use client';

import React, { useState, Suspense } from 'react';
import { loginAction } from '@/actions/auth';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin/dashboard';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('redirect', redirectPath);

    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#161616',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '40px 35px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: '0 0 8px' }}>
            KONNECT <span style={{ color: 'var(--ast-global-color-0)' }}>CMS</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: 0 }}>
            Sign in to manage pages, sections, media, and SEO.
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(236,75,70,0.15)',
              border: '1px solid var(--ast-global-color-0)',
              color: '#ff8a85',
              padding: '12px 16px',
              borderRadius: '4px',
              fontSize: '13px',
              marginBottom: '25px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px',
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              defaultValue="admin@konnectmarketingusa.com"
              style={{
                width: '100%',
                padding: '14px 16px',
                backgroundColor: '#222',
                border: '1px solid #333',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label
              style={{
                display: 'block',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px',
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              defaultValue="Admin@12345"
              style={{
                width: '100%',
                padding: '14px 16px',
                backgroundColor: '#222',
                border: '1px solid #333',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: 'var(--ast-global-color-0)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Console'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }} />}>
      <LoginForm />
    </Suspense>
  );
}
