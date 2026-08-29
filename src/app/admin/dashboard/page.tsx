import React from 'react';
import { db } from '@/lib/db';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const [pagesCount, publishedPagesCount, mediaCount, usersCount] = await Promise.all([
    db.page.count(),
    db.page.count({ where: { status: 'PUBLISHED' } }),
    db.media.count(),
    db.user.count(),
  ]);

  const recentPages = await db.page.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#111' }}>
            System Overview &amp; Analytics
          </h1>
          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
            Welcome to the Konnect Marketing Monolithic CMS Engine.
          </p>
        </div>

        <Link
          href="/admin/pages/new"
          style={{
            padding: '12px 24px',
            backgroundColor: 'var(--ast-global-color-0)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 600,
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          + Create New Page
        </Link>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '35px',
        }}
      >
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '6px', border: '1px solid #eaeaea' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>Total Pages</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#111', marginTop: '8px' }}>{pagesCount}</div>
          <div style={{ fontSize: '12px', color: '#4caf50', marginTop: '4px' }}>{publishedPagesCount} Live &amp; Published</div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '6px', border: '1px solid #eaeaea' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>Cloudinary Media</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#111', marginTop: '8px' }}>{mediaCount}</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Optimized Assets</div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '6px', border: '1px solid #eaeaea' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>Admin Accounts</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#111', marginTop: '8px' }}>{usersCount}</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Active Staff &amp; Editors</div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '6px', border: '1px solid #eaeaea' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>SEO Health</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--ast-global-color-0)', marginTop: '8px' }}>100%</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>JSON-LD Schema Active</div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
        {/* Recent Pages */}
        <div style={{ backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #eaeaea', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Recent Pages &amp; Dynamic Layouts</h3>
            <Link href="/admin/pages" style={{ fontSize: '13px', color: 'var(--ast-global-color-0)', textDecoration: 'none', fontWeight: 600 }}>
              View All Pages &rarr;
            </Link>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left', color: '#888', fontSize: '12px' }}>
                <th style={{ paddingBottom: '12px' }}>Page Title</th>
                <th style={{ paddingBottom: '12px' }}>URL Slug</th>
                <th style={{ paddingBottom: '12px' }}>Status</th>
                <th style={{ paddingBottom: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentPages.map((page) => (
                <tr key={page.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                  <td style={{ padding: '14px 0', fontWeight: 600 }}>{page.title}</td>
                  <td style={{ padding: '14px 0', color: '#666' }}>/{page.slug}</td>
                  <td style={{ padding: '14px 0' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: page.status === 'PUBLISHED' ? '#e8f5e9' : '#fff3e0',
                        color: page.status === 'PUBLISHED' ? '#2e7d32' : '#e65100',
                      }}
                    >
                      {page.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 0', textAlign: 'right' }}>
                    <Link
                      href={`/admin/pages/${page.id}`}
                      style={{
                        padding: '6px 14px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                        fontSize: '12px',
                        textDecoration: 'none',
                        color: '#333',
                        fontWeight: 600,
                      }}
                    >
                      Edit Layout &amp; SEO
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Tools */}
        <div style={{ backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #eaeaea', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 20px' }}>CMS Quick Tools</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link
              href="/admin/media"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                backgroundColor: '#fafafa',
                border: '1px solid #eee',
                borderRadius: '6px',
                textDecoration: 'none',
                color: '#333',
                fontWeight: 500,
                fontSize: '14px',
              }}
            >
              <span style={{ fontSize: '20px' }}>🖼️</span>
              <div>
                <div style={{ fontWeight: 600 }}>Cloudinary Media</div>
                <div style={{ fontSize: '12px', color: '#888' }}>Upload and optimize images</div>
              </div>
            </Link>

            <Link
              href="/admin/menus"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                backgroundColor: '#fafafa',
                border: '1px solid #eee',
                borderRadius: '6px',
                textDecoration: 'none',
                color: '#333',
                fontWeight: 500,
                fontSize: '14px',
              }}
            >
              <span style={{ fontSize: '20px' }}>🧭</span>
              <div>
                <div style={{ fontWeight: 600 }}>Navigation Menus</div>
                <div style={{ fontSize: '12px', color: '#888' }}>Configure mega-menus</div>
              </div>
            </Link>

            <Link
              href="/admin/settings"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                backgroundColor: '#fafafa',
                border: '1px solid #eee',
                borderRadius: '6px',
                textDecoration: 'none',
                color: '#333',
                fontWeight: 500,
                fontSize: '14px',
              }}
            >
              <span style={{ fontSize: '20px' }}>⚙️</span>
              <div>
                <div style={{ fontWeight: 600 }}>Global Settings &amp; SEO</div>
                <div style={{ fontSize: '12px', color: '#888' }}>Schema and site configuration</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
