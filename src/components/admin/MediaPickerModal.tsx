'use client';

import React, { useState, useEffect } from 'react';
import { getMediaGallery, uploadMediaAction } from '@/actions/media';

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  width: number;
  height: number;
  altText?: string | null;
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelectImage,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string, altText?: string) => void;
}) {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen, search]);

  async function loadMedia() {
    setLoading(true);
    try {
      const list = await getMediaGallery(search);
      setMediaList(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', file.name.replace(/\.[^/.]+$/, ''));

    const res = await uploadMediaAction(formData);
    setUploading(false);

    if (res.success && res.media) {
      onSelectImage(res.media.url, res.media.altText || '');
      onClose();
    } else {
      alert(res.error || 'Upload failed.');
    }
  }

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '85vh',
          borderRadius: '6px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Select Image from Media Library</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' }}
          >
            &times;
          </button>
        </div>

        {/* Toolbar */}
        <div
          style={{
            padding: '15px 24px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            gap: '15px',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fafafa',
          }}
        >
          <input
            type="text"
            placeholder="Search media by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '8px 14px', border: '1px solid #ddd', borderRadius: '4px', width: '300px', fontSize: '13px' }}
          />

          <label
            style={{
              padding: '8px 18px',
              backgroundColor: 'var(--ast-global-color-0)',
              color: '#fff',
              borderRadius: '4px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{uploading ? 'Uploading...' : '⬆ Upload New Image'}</span>
            <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Gallery Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading media...</div>
          ) : mediaList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              No images found. Upload your first image to Cloudinary above.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '15px',
              }}
            >
              {mediaList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectImage(item.url, item.altText || '');
                    onClose();
                  }}
                  style={{
                    border: '1px solid #eee',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: '#fafafa',
                  }}
                  className="media-item-card"
                >
                  <div style={{ height: '100px', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={(item as any).thumbnailUrl || item.url}
                      alt={item.filename}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e: any) => {
                        e.target.src = item.url;
                      }}
                    />
                  </div>
                  <div style={{ padding: '8px', fontSize: '11px', color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.filename}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid #eee', textAlign: 'right', background: '#fafafa' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              backgroundColor: '#eee',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
