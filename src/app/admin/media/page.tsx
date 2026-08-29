'use client';

import React, { useState, useEffect } from 'react';
import { getMediaGallery, uploadMediaAction, deleteMediaAction } from '@/actions/media';
import Link from 'next/link';

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadMedia();
  }, [search]);

  async function loadMedia() {
    setLoading(true);
    const list = await getMediaGallery(search);
    setMediaList(list);
    setLoading(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', file.name.replace(/\.[^/.]+$/, ''));

    const res = await uploadMediaAction(formData);
    setUploading(false);

    if (res.success) {
      loadMedia();
    } else {
      alert(res.error || 'Failed to upload image.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this media item?')) return;
    const res = await deleteMediaAction(id);
    if (res.success) {
      loadMedia();
    }
  }

  function handleCopy(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function formatFileSize(bytes: number): string {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 6px', color: '#111' }}>
            Media &amp; Asset Library
          </h1>
          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
            Upload, optimize, and manage imagery for pages, heroes, and SEO social tags.
          </p>
        </div>

        <label
          style={{
            padding: '10px 22px',
            backgroundColor: 'var(--ast-global-color-0)',
            color: '#fff',
            borderRadius: '4px',
            fontWeight: 600,
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>{uploading ? '⏳ Uploading Media...' : '⬆ Upload Media'}</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} style={{ display: 'none' }} />
        </label>
      </div>

      {/* Cloudinary notice bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '12px 18px', borderRadius: '6px', border: '1px solid #eaeaea', marginBottom: '20px', fontSize: '13px' }}>
        <div style={{ color: '#666' }}>
          💡 <strong>Storage:</strong> Images are automatically optimized with CDN transforms &amp; thumbnails.
        </div>
        <Link
          href="/admin/settings"
          style={{
            color: 'var(--ast-global-color-0)',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          ⚙️ Configure Cloudinary API Keys &rarr;
        </Link>
      </div>

      {/* Filter Bar */}
      <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '6px', border: '1px solid #eaeaea', marginBottom: '25px', display: 'flex', gap: '15px' }}>
        <input
          type="text"
          placeholder="Search media by filename or alt text..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px 14px', border: '1px solid #ddd', borderRadius: '4px', width: '320px', fontSize: '14px' }}
        />
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '6px' }}>Loading media gallery...</div>
      ) : mediaList.length === 0 ? (
        <div style={{ backgroundColor: '#fff', padding: '60px 20px', textAlign: 'center', borderRadius: '6px', border: '1px solid #eaeaea' }}>
          <h3>No Media Assets Found</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>Upload your first high-resolution photo or billboard asset above.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          {mediaList.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #eaeaea',
                borderRadius: '6px',
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '160px', overflow: 'hidden', backgroundColor: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={item.thumbnailUrl || item.url}
                  alt={item.filename}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e: any) => {
                    e.target.src = item.url;
                  }}
                />
              </div>

              <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>
                  {item.filename}
                </div>
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '14px' }}>
                  {item.width && item.height ? `${item.width} × ${item.height} px • ` : ''}
                  {item.format?.toUpperCase()}
                  {item.size ? ` • ${formatFileSize(item.size)}` : ''}
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleCopy(item.url, item.id)}
                    style={{
                      flex: 1,
                      padding: '6px',
                      backgroundColor: copiedId === item.id ? '#e8f5e9' : '#f5f5f5',
                      color: copiedId === item.id ? '#2e7d32' : '#333',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {copiedId === item.id ? '✓ Copied URL' : 'Copy URL'}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#ffebee',
                      color: '#c62828',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
