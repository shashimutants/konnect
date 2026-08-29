'use client';

import React, { useState, useEffect } from 'react';
import {
  getSectionTemplates,
  createSectionTemplateAction,
  updateSectionTemplateAction,
  deleteSectionTemplateAction,
} from '@/actions/schemas';
import MediaPickerModal from '@/components/admin/MediaPickerModal';
import SectionWireframe from '@/components/admin/SectionWireframe';
import SchemaPreviewModal from '@/components/admin/SchemaPreviewModal';

const CATEGORIES = ['All', 'Heroes', 'Narrative', 'Capabilities', 'Products', 'Social Proof', 'Interactive', 'Conversion'];

const BLOCK_TYPES = [
  { type: 'HeroSliderBlock', label: 'Hero Slider (Rotating Multi-Slide Banner)' },
  { type: 'PageHeroBlock', label: 'Page Hero Banner (Inner Page Header)' },
  { type: 'SplitHeroBlock', label: '50/50 Split Hero with Dual CTAs' },
  { type: 'VideoHeroBlock', label: 'Full-Width Video Hero Banner' },
  { type: 'TwoColumnStoryBlock', label: '2-Column Story / Narrative with Media' },
  { type: 'ThreeColumnCardsBlock', label: '3-Column Feature Cards' },
  { type: 'RichTextBlock', label: 'WordPress WYSIWYG Rich Text' },
  { type: 'BlockquoteHighlightBlock', label: 'Editorial Pull-Quote Highlight' },
  { type: 'CapabilitiesGridBlock', label: 'Capabilities / Service Cards Grid' },
  { type: 'ModularFrameworkBlock', label: 'Modular 3-Step Framework' },
  { type: 'ProcessStepsBlock', label: 'Process Steps Roadmap (1-4)' },
  { type: 'ProductCatalogBlock', label: 'Product Catalog & Specs Strip' },
  { type: 'FeatureComparisonBlock', label: 'Feature & Specification Comparison Matrix' },
  { type: 'StatsCounterBlock', label: 'Animated Stats Counter Bar' },
  { type: 'ClientLogosBlock', label: 'Client Logo Showcase' },
  { type: 'TestimonialsCarouselBlock', label: 'Customer Reviews & Testimonials Carousel' },
  { type: 'PortfolioGridBlock', label: '8-Box Portfolio Gallery' },
  { type: 'FaqAccordionBlock', label: 'Interactive Expandable FAQ Accordion' },
  { type: 'PricingMatrixBlock', label: 'Tiered Pricing & Campaign Matrix' },
  { type: 'CtaBannerBlock', label: 'Call To Action (CTA) Banner' },
  { type: 'ContactFormBlock', label: 'Contact Info & Inquiry Form' },
];

export default function SectionSchemasManagerPage() {
  const [schemas, setSchemas] = useState<any[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchema, setEditingSchema] = useState<any | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [previewSchema, setPreviewSchema] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [schemaCategory, setSchemaCategory] = useState('Heroes');
  const [description, setDescription] = useState('');
  const [blockType, setBlockType] = useState('SplitHeroBlock');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [defaultContentJson, setDefaultContentJson] = useState('{}');
  const [animType, setAnimType] = useState('fade-in');
  const [animDuration, setAnimDuration] = useState('normal');
  const [animDelay, setAnimDelay] = useState(0);

  useEffect(() => {
    loadSchemas();
  }, [category]);

  async function loadSchemas() {
    setLoading(true);
    const data = await getSectionTemplates(category);
    setSchemas(data);
    setLoading(false);
  }

  function openCreateModal() {
    setEditingSchema(null);
    setName('');
    setSchemaCategory('Heroes');
    setDescription('');
    setBlockType('SplitHeroBlock');
    setThumbnailUrl('/images/bg-01-free-img.jpg');
    setDefaultContentJson(JSON.stringify({ title: 'New Custom Schema', subtitle: 'Schema Subtitle' }, null, 2));
    setAnimType('fade-in');
    setAnimDuration('normal');
    setAnimDelay(0);
    setModalOpen(true);
  }

  function openEditModal(schema: any) {
    setEditingSchema(schema);
    setName(schema.name);
    setSchemaCategory(schema.category);
    setDescription(schema.description || '');
    setBlockType(schema.blockType);
    setThumbnailUrl(schema.thumbnailUrl || '');
    try {
      setDefaultContentJson(JSON.stringify(JSON.parse(schema.defaultContentJson), null, 2));
    } catch {
      setDefaultContentJson(schema.defaultContentJson);
    }
    try {
      const anim = JSON.parse(schema.defaultAnimationJson || '{}');
      setAnimType(anim.type || 'fade-in');
      setAnimDuration(anim.duration || 'normal');
      setAnimDelay(anim.delay || 0);
    } catch {
      setAnimType('fade-in');
    }
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const animationJson = JSON.stringify({ type: animType, duration: animDuration, delay: animDelay });

    if (editingSchema) {
      const res = await updateSectionTemplateAction(editingSchema.id, {
        name,
        category: schemaCategory,
        description,
        blockType,
        thumbnailUrl,
        defaultContentJson,
        defaultAnimationJson: animationJson,
      });
      setSaving(false);
      if (res.success) {
        setModalOpen(false);
        loadSchemas();
      } else {
        alert(res.error || 'Failed to update schema.');
      }
    } else {
      const res = await createSectionTemplateAction({
        name,
        category: schemaCategory,
        description,
        blockType,
        thumbnailUrl,
        defaultContentJson,
        defaultAnimationJson: animationJson,
      });
      setSaving(false);
      if (res.success) {
        setModalOpen(false);
        loadSchemas();
      } else {
        alert(res.error || 'Failed to create schema.');
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this Section Design Schema?')) return;
    const res = await deleteSectionTemplateAction(id);
    if (res.success) {
      loadSchemas();
    } else {
      alert(res.error || 'Failed to delete schema.');
    }
  }

  const filteredSchemas = schemas.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.description || '').toLowerCase().includes(search.toLowerCase()) ||
    s.blockType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 6px', color: '#111' }}>
            Section Design Schemas Library
          </h1>
          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
            Visual blueprint illustrations, live interactive previews, and reusable layouts for modern block building.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          style={{
            padding: '10px 22px',
            backgroundColor: 'var(--ast-global-color-0)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 600,
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
          }}
        >
          + Create New Schema
        </button>
      </div>

      {/* Categories & Search Bar */}
      <div
        style={{
          backgroundColor: '#fff',
          padding: '16px 20px',
          borderRadius: '6px',
          border: '1px solid #eaeaea',
          marginBottom: '25px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid #ddd',
                backgroundColor: category === cat ? 'var(--ast-global-color-0)' : '#f8f9fa',
                color: category === cat ? '#fff' : '#333',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search schemas by name or block type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px 14px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', width: '280px' }}
        />
      </div>

      {/* Schema Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading Section Schemas...</div>
      ) : filteredSchemas.length === 0 ? (
        <div style={{ backgroundColor: '#fff', padding: '50px', textAlign: 'center', borderRadius: '6px', border: '1px solid #eaeaea' }}>
          <h3>No Section Schemas Found</h3>
          <p style={{ color: '#666' }}>Try clearing your search filter or create your own custom schema above.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '22px',
          }}
        >
          {filteredSchemas.map((schema) => {
            let anim = { type: 'fade-in', duration: 'normal', delay: 0 };
            try {
              if (schema.defaultAnimationJson) anim = JSON.parse(schema.defaultAnimationJson);
            } catch {}

            return (
              <div
                key={schema.id}
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #eaeaea',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                {/* Visual Layout Blueprint Header */}
                <div style={{ height: '160px', position: 'relative', overflow: 'hidden' }}>
                  <SectionWireframe blockType={schema.blockType} />
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      backgroundColor: 'rgba(15,23,42,0.85)',
                      color: '#fff',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    {schema.category}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(236,75,70,0.95)',
                      color: '#fff',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 600,
                    }}
                  >
                    ⚡ {anim.type || 'fade-in'}
                  </span>
                </div>

                {/* Content Details */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: '#111', marginBottom: '4px' }}>
                    {schema.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ast-global-color-0)', fontWeight: 600, marginBottom: '8px' }}>
                    Type: {schema.blockType}
                  </div>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.5em', margin: '0 0 16px 0', flex: 1 }}>
                    {schema.description || 'Flexible layout schema with customizable visual parameters.'}
                  </p>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', borderTop: '1px solid #eee', paddingTop: '14px' }}>
                    <button
                      type="button"
                      onClick={() => setPreviewSchema(schema)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        backgroundColor: '#0F172A',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      👁️ Live Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(schema)}
                      style={{
                        padding: '8px 14px',
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(schema.id)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schema Edit / Create Modal with Visual Blueprint Inspector */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              width: '100%',
              maxWidth: '850px',
              maxHeight: '92vh',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                {editingSchema ? `Edit Schema: ${editingSchema.name}` : 'Create New Section Schema'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' }}
              >
                &times;
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSave} style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Schema Template Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={schemaCategory}
                    onChange={(e) => setSchemaCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Block Component Selector & Visual Blueprint Preview */}
              <div style={{ marginBottom: '18px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '18px', alignItems: 'center' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px', color: '#1E293B' }}>
                      Underlying Block Component
                    </label>
                    <select
                      value={blockType}
                      onChange={(e) => setBlockType(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '13px', fontWeight: 600 }}
                    >
                      {BLOCK_TYPES.map((b) => (
                        <option key={b.type} value={b.type}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                    <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#64748B' }}>
                      Visual layout structure shown on the right updates dynamically.
                    </p>
                  </div>

                  <div style={{ height: '95px', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <SectionWireframe blockType={blockType} />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Description / Purpose
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                />
              </div>

              {/* Entrance Animation Settings */}
              <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '6px', border: '1px solid #eee', marginBottom: '18px' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--ast-global-color-0)' }}>
                  Default Entrance Animation
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Animation Effect</label>
                    <select
                      value={animType}
                      onChange={(e) => setAnimType(e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                    >
                      <option value="none">None (Static)</option>
                      <option value="fade-in">Fade In</option>
                      <option value="slide-up">Slide Up</option>
                      <option value="slide-down">Slide Down</option>
                      <option value="slide-left">Slide Left</option>
                      <option value="slide-right">Slide Right</option>
                      <option value="zoom-in">Zoom In</option>
                      <option value="bounce-in">Bounce In</option>
                      <option value="flip-in">3D Flip In</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Speed / Duration</label>
                    <select
                      value={animDuration}
                      onChange={(e) => setAnimDuration(e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                    >
                      <option value="fast">Fast (400ms)</option>
                      <option value="normal">Normal (800ms)</option>
                      <option value="slow">Slow (1200ms)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Delay (ms)</label>
                    <input
                      type="number"
                      value={animDelay}
                      step={100}
                      min={0}
                      max={1000}
                      onChange={(e) => setAnimDelay(Number(e.target.value))}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Default Content JSON */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Default Schema Content (JSON)
                </label>
                <textarea
                  rows={6}
                  value={defaultContentJson}
                  onChange={(e) => setDefaultContentJson(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}
                />
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ padding: '10px 18px', backgroundColor: '#eee', border: 'none', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: 'var(--ast-global-color-0)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {saving ? 'Saving...' : 'Save Schema Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Interactive Preview Modal */}
      <SchemaPreviewModal
        isOpen={!!previewSchema}
        onClose={() => setPreviewSchema(null)}
        schema={previewSchema}
      />

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelectImage={(url) => setThumbnailUrl(url)}
      />
    </div>
  );
}
