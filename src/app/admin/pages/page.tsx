import React from 'react';
import { getPagesList } from '@/actions/pages';
import Link from 'next/link';

export default async function AdminPagesListPage() {
  const pages = await getPagesList();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 6px', color: '#111' }}>
            Pages &amp; Dynamic Section Layouts
          </h1>
          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
            Manage public pages, dynamic visual sections, and SEO metadata.
          </p>
        </div>

        <Link
          href="/admin/pages/new"
          style={{
            padding: '10px 22px',
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
          + Add New Page
        </Link>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #eaeaea', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #eaeaea', textAlign: 'left', color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '14px 20px' }}>Title</th>
              <th style={{ padding: '14px 20px' }}>Slug / Route</th>
              <th style={{ padding: '14px 20px' }}>Sections (Blocks)</th>
              <th style={{ padding: '14px 20px' }}>Language</th>
              <th style={{ padding: '14px 20px' }}>Status</th>
              <th style={{ padding: '14px 20px' }}>Last Updated</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={{ padding: '16px 20px', fontWeight: 600 }}>
                  {page.title} {page.isHome && <span style={{ fontSize: '10px', backgroundColor: '#e3f2fd', color: '#1976d2', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>HOME</span>}
                </td>
                <td style={{ padding: '16px 20px', color: '#666' }}>/{page.slug}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ backgroundColor: '#f0f0f0', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                    {page._count.blocks} Sections
                  </span>
                </td>
                <td style={{ padding: '16px 20px', color: '#666' }}>{page.language}</td>
                <td style={{ padding: '16px 20px' }}>
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
                <td style={{ padding: '16px 20px', color: '#888', fontSize: '13px' }}>
                  {new Date(page.updatedAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <Link
                      href={`/${page.isHome ? '' : page.slug}`}
                      target="_blank"
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                        fontSize: '12px',
                        textDecoration: 'none',
                        color: '#555',
                      }}
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/pages/${page.id}`}
                      style={{
                        padding: '6px 14px',
                        backgroundColor: 'var(--ast-global-color-0)',
                        color: '#fff',
                        borderRadius: '4px',
                        fontSize: '12px',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Edit Layout &amp; SEO
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
