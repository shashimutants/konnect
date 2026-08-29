'use client';

import React, { useState } from 'react';
import BlockRenderer from '@/components/blocks/BlockRenderer';

interface SchemaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  schema: {
    name: string;
    category: string;
    description?: string | null;
    blockType: string;
    defaultContentJson: string;
    defaultAnimationJson?: string | null;
  } | null;
}

export default function SchemaPreviewModal({ isOpen, onClose, schema }: SchemaPreviewModalProps) {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isOpen || !schema) return null;

  let anim = { type: 'fade-in', duration: 'normal', delay: 0 };
  try {
    if (schema.defaultAnimationJson) anim = JSON.parse(schema.defaultAnimationJson);
  } catch {}

  const dummyBlock = {
    id: 'preview-block',
    blockType: schema.blockType,
    orderIndex: 0,
    contentJson: schema.defaultContentJson,
    isVisible: true,
    animationType: anim.type || 'fade-in',
    animationDuration: anim.duration || 'normal',
    animationDelay: anim.delay || 0,
  };

  let viewportWidth = '100%';
  if (viewport === 'tablet') viewportWidth = '768px';
  if (viewport === 'mobile') viewportWidth = '375px';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 100000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          width: '100%',
          maxWidth: '1200px',
          height: '92vh',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Topbar */}
        <div
          style={{
            padding: '14px 24px',
            backgroundColor: '#111827',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', color: 'var(--ast-global-color-0)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Live Schema Preview &bull; {schema.category}
            </span>
            <h3 style={{ margin: '2px 0 0', fontSize: '17px', fontWeight: 700, color: '#fff' }}>
              {schema.name} <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 400 }}>({schema.blockType})</span>
            </h3>
          </div>

          {/* Viewport switcher */}
          <div style={{ display: 'flex', gap: '6px', backgroundColor: '#1F2937', padding: '4px', borderRadius: '6px' }}>
            <button
              onClick={() => setViewport('desktop')}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: viewport === 'desktop' ? 'var(--ast-global-color-0)' : 'transparent',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🖥 Desktop
            </button>
            <button
              onClick={() => setViewport('tablet')}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: viewport === 'tablet' ? 'var(--ast-global-color-0)' : 'transparent',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              📱 Tablet (768px)
            </button>
            <button
              onClick={() => setViewport('mobile')}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: viewport === 'mobile' ? 'var(--ast-global-color-0)' : 'transparent',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              📲 Mobile (375px)
            </button>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '26px',
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>

        {/* Viewport Frame Container */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#0F172A',
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: viewportWidth,
              backgroundColor: '#fff',
              minHeight: '100%',
              borderRadius: viewport === 'desktop' ? '0' : '8px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              transition: 'width 0.3s ease',
            }}
          >
            <BlockRenderer blocks={[dummyBlock]} />
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: '#F9FAFB',
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '12px', color: '#6B7280' }}>
            {schema.description || 'Flexible layout schema with customized visual fields.'}
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              backgroundColor: '#E5E7EB',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
