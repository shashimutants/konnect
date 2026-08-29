'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getPageWithBlocks,
  updatePageAction,
  createPageAction,
  saveContentBlockAction,
  reorderBlocksAction,
  toggleBlockVisibilityAction,
  deleteContentBlockAction,
  createTranslationAction,
  getPageTranslations,
  generatePreviewUrl,
} from '@/actions/pages';
import BlockEditorModal from '@/components/admin/BlockEditorModal';
import MediaPickerModal from '@/components/admin/MediaPickerModal';
import Link from 'next/link';

const SUPPORTED_LANGUAGES = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ja', label: 'Japanese' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ar', label: 'Arabic' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ko', label: 'Korean' },
];

interface PageEditorProps {
  params: {
    id: string;
  };
}

export default function AdminPageDetailEditor({ params }: PageEditorProps) {
  const isNew = params.id === 'new';
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'content' | 'sections' | 'seo'>('sections');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<any>({
    title: '',
    slug: '',
    template: 'default',
    status: 'DRAFT',
    language: 'en-US',
    isHome: false,
    seoTitle: '',
    seoDescription: '',
    focusKeywords: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImageUrl: '',
    twitterCard: 'summary_large_image',
    robotsIndex: true,
    robotsFollow: true,
    schemaType: 'WebPage',
    customSchemaJson: '',
    blocks: [],
  });

  const [editingBlock, setEditingBlock] = useState<any | null>(null);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [ogMediaPickerOpen, setOgMediaPickerOpen] = useState(false);

  const [translations, setTranslations] = useState<any[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [creatingTranslation, setCreatingTranslation] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    if (!isNew) {
      loadPage();
    }
  }, [params.id]);

  async function loadPage() {
    setLoading(true);
    const data = await getPageWithBlocks(params.id);
    if (data) {
      setPageData(data);
    }
    const trans = await getPageTranslations(params.id);
    setTranslations(trans);
    setLoading(false);
  }

  async function handlePreview() {
    if (isNew) return;
    setPreviewLoading(true);
    const result = await generatePreviewUrl(params.id);
    setPreviewLoading(false);
    if (result.success && result.previewUrl) {
      window.open(result.previewUrl, '_blank');
    } else {
      alert(result.error || 'Failed to generate preview URL.');
    }
  }

  async function handleCreateTranslation() {
    if (!selectedLanguage) return;
    setCreatingTranslation(true);
    const res = await createTranslationAction(params.id, selectedLanguage);
    setCreatingTranslation(false);
    if (res.success && res.pageId) {
      alert('Translation created!');
      router.push(`/admin/pages/${res.pageId}`);
    } else {
      alert(res.error || 'Failed to create translation.');
    }
  }

  async function handlePageSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (isNew) {
      const res = await createPageAction(pageData);
      setSaving(false);
      if (res.success && res.pageId) {
        alert('Page created successfully!');
        router.push(`/admin/pages/${res.pageId}`);
      } else {
        alert(res.error || 'Failed to create page.');
      }
    } else {
      const res = await updatePageAction(params.id, pageData);
      setSaving(false);
      if (res.success) {
        alert('Page and SEO settings saved successfully!');
        loadPage();
      } else {
        alert(res.error || 'Failed to update page.');
      }
    }
  }

  async function handleSaveBlock(blockPayload: any) {
    const res = await saveContentBlockAction(blockPayload);
    if (res.success) {
      loadPage();
    } else {
      alert(res.error || 'Failed to save section block.');
    }
  }

  async function handleMoveBlock(index: number, direction: 'up' | 'down') {
    const newBlocks = [...pageData.blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    setPageData({ ...pageData, blocks: newBlocks });
    await reorderBlocksAction(
      params.id,
      newBlocks.map((b) => b.id)
    );
  }

  async function handleToggleVisibility(blockId: string, currentVal: boolean) {
    await toggleBlockVisibilityAction(blockId, !currentVal);
    loadPage();
  }

  async function handleDeleteBlock(blockId: string) {
    if (!confirm('Are you sure you want to delete this section block?')) return;
    await deleteContentBlockAction(blockId);
    loadPage();
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading page details...</div>;
  }

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <Link href="/admin/pages" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
            &larr; Back to All Pages
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '6px 0 0', color: '#111' }}>
            {isNew ? 'Create New Page' : `Editing: ${pageData.title}`}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {!isNew && (
            <>
              <button
                onClick={handlePreview}
                disabled={previewLoading}
                style={{
                  padding: '10px 18px',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: previewLoading ? 'not-allowed' : 'pointer',
                  color: '#333',
                }}
              >
                {previewLoading ? '⏳ Generating...' : '👁️ Preview Draft'}
              </button>
              <Link
                href={`/${pageData.isHome ? '' : pageData.slug}`}
                target="_blank"
                style={{
                  padding: '10px 18px',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: '#333',
                }}
              >
                ↗ View Live
              </Link>
            </>
          )}

          <button
            onClick={handlePageSave}
            disabled={saving}
            style={{
              padding: '10px 24px',
              backgroundColor: 'var(--ast-global-color-0)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving...' : 'Save Page & SEO'}
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '25px', backgroundColor: '#fff', padding: '0 20px', borderRadius: '6px 6px 0 0' }}>
        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          style={{
            padding: '16px 22px',
            border: 'none',
            background: 'none',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            color: activeTab === 'sections' ? 'var(--ast-global-color-0)' : '#666',
            borderBottom: activeTab === 'sections' ? '3px solid var(--ast-global-color-0)' : 'none',
          }}
        >
          🧩 Dynamic Sections &amp; Visual Layout ({pageData.blocks?.length || 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('content')}
          style={{
            padding: '16px 22px',
            border: 'none',
            background: 'none',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            color: activeTab === 'content' ? 'var(--ast-global-color-0)' : '#666',
            borderBottom: activeTab === 'content' ? '3px solid var(--ast-global-color-0)' : 'none',
          }}
        >
          ⚙️ Page Settings &amp; Language
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          style={{
            padding: '16px 22px',
            border: 'none',
            background: 'none',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            color: activeTab === 'seo' ? 'var(--ast-global-color-0)' : '#666',
            borderBottom: activeTab === 'seo' ? '3px solid var(--ast-global-color-0)' : 'none',
          }}
        >
          🔍 Comprehensive SEO, Social &amp; Schema
        </button>

        {!isNew && (
          <Link
            href={`/admin/pages/${params.id}/revisions`}
            style={{
              padding: '16px 22px',
              fontWeight: 600,
              fontSize: '14px',
              textDecoration: 'none',
              color: '#666',
              marginLeft: 'auto',
            }}
          >
            🕒 Version History
          </Link>
        )}
      </div>

      {/* TAB 1: VISUAL SECTION BUILDER */}
      {activeTab === 'sections' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Add, reorder, edit, and toggle visual sections dynamically on this page.
            </p>
            {!isNew && (
              <button
                type="button"
                onClick={() => {
                  setEditingBlock(null);
                  setBlockModalOpen(true);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'var(--ast-global-color-0)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                + Add New Section Block
              </button>
            )}
          </div>

          {isNew ? (
            <div style={{ backgroundColor: '#fff', padding: '40px', textAlign: 'center', borderRadius: '6px', border: '1px solid #eaeaea' }}>
              <p style={{ color: '#666' }}>Please save the general page details first to begin adding visual sections.</p>
              <button
                type="button"
                onClick={handlePageSave}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'var(--ast-global-color-0)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Save &amp; Continue
              </button>
            </div>
          ) : pageData.blocks.length === 0 ? (
            <div style={{ backgroundColor: '#fff', padding: '50px 20px', textAlign: 'center', borderRadius: '6px', border: '1px solid #eaeaea' }}>
              <h3>No Sections Added Yet</h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>This page does not have any visual blocks. Click below to add your first section.</p>
              <button
                type="button"
                onClick={() => {
                  setEditingBlock(null);
                  setBlockModalOpen(true);
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'var(--ast-global-color-0)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                + Add Section Block
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pageData.blocks.map((block: any, idx: number) => {
                let parsedContent: any = {};
                try {
                  parsedContent = JSON.parse(block.contentJson);
                } catch {
                  parsedContent = {};
                }

                return (
                  <div
                    key={block.id}
                    style={{
                      backgroundColor: '#fff',
                      border: '1px solid #eaeaea',
                      borderRadius: '6px',
                      padding: '18px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      opacity: block.isVisible ? 1 : 0.6,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, backgroundColor: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>
                        #{idx + 1}
                      </span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, fontSize: '15px', color: '#222' }}>
                            {block.blockType}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              backgroundColor: 'rgba(236,75,70,0.08)',
                              color: 'var(--ast-global-color-0)',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontWeight: 600,
                            }}
                          >
                            ⚡ {block.animationType || 'fade-in'} ({block.animationDuration || 'normal'})
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                          {parsedContent.title || parsedContent.subtitle || 'Custom structured section'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* Move Up/Down */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveBlock(idx, 'up')}
                        style={{ padding: '6px 10px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={idx === pageData.blocks.length - 1}
                        onClick={() => handleMoveBlock(idx, 'down')}
                        style={{ padding: '6px 10px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: idx === pageData.blocks.length - 1 ? 'not-allowed' : 'pointer' }}
                        title="Move Down"
                      >
                        ▼
                      </button>

                      {/* Visibility Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(block.id, block.isVisible)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: block.isVisible ? '#e8f5e9' : '#ffebee',
                          color: block.isVisible ? '#2e7d32' : '#c62828',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {block.isVisible ? '👁 Visible' : '🚫 Hidden'}
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBlock(block);
                          setBlockModalOpen(true);
                        }}
                        style={{
                          padding: '6px 14px',
                          backgroundColor: '#f5f5f5',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Edit Content
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteBlock(block.id)}
                        style={{
                          padding: '6px 12px',
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
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAGE DETAILS & LANGUAGE */}
      {activeTab === 'content' && (
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '6px', border: '1px solid #eaeaea' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                Page Title <span style={{ color: 'var(--ast-global-color-0)' }}>*</span>
              </label>
              <input
                type="text"
                value={pageData.title}
                onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                required
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                URL Slug <span style={{ color: 'var(--ast-global-color-0)' }}>*</span>
              </label>
              <input
                type="text"
                value={pageData.slug}
                onChange={(e) => setPageData({ ...pageData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                required
                placeholder="e.g. services or about"
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '25px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                Publication Status
              </label>
              <select
                value={pageData.status}
                onChange={(e) => setPageData({ ...pageData, status: e.target.value })}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              >
                <option value="PUBLISHED">PUBLISHED (Live)</option>
                <option value="DRAFT">DRAFT (Admin Only)</option>
                <option value="SCHEDULED">SCHEDULED</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                HTML Language &amp; Locale (lang)
              </label>
              <select
                value={pageData.language}
                onChange={(e) => setPageData({ ...pageData, language: e.target.value })}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              >
                <option value="en-US">English (United States) - en-US</option>
                <option value="en-GB">English (United Kingdom) - en-GB</option>
                <option value="es-US">Spanish (United States) - es-US</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '25px' }}>
              <input
                type="checkbox"
                id="isHome"
                checked={pageData.isHome}
                onChange={(e) => setPageData({ ...pageData, isHome: e.target.checked })}
                style={{ width: '18px', height: '18px', marginRight: '8px', cursor: 'pointer' }}
              />
              <label htmlFor="isHome" style={{ fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Set as Default Homepage (/)
              </label>
            </div>
          </div>

          {/* TRANSLATIONS SECTION */}
          {!isNew && (
            <div style={{ marginTop: '30px', paddingTop: '30px', borderTop: '1px solid #eaeaea' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '15px' }}>Translations</h3>
              
              {translations.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {translations.map((t) => (
                    <Link
                      key={t.id}
                      href={`/admin/pages/${t.id}`}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #ddd',
                        borderRadius: '16px',
                        fontSize: '12px',
                        textDecoration: 'none',
                        color: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{t.language}</span>
                      <span style={{ color: '#666' }}>• {t.status}</span>
                    </Link>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', minWidth: '200px' }}
                >
                  <option value="">Select a language to translate...</option>
                  {SUPPORTED_LANGUAGES.filter(
                    (lang) => lang.code !== pageData.language && !translations.some((t) => t.language === lang.code)
                  ).map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label} ({lang.code})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleCreateTranslation}
                  disabled={creatingTranslation || !selectedLanguage}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: 'var(--ast-global-color-0)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: creatingTranslation || !selectedLanguage ? 'not-allowed' : 'pointer',
                    opacity: creatingTranslation || !selectedLanguage ? 0.7 : 1,
                  }}
                >
                  {creatingTranslation ? 'Creating...' : '+ Create Translation'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COMPREHENSIVE SEO, SOCIAL & JSON-LD */}
      {activeTab === 'seo' && (
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '6px', border: '1px solid #eaeaea' }}>
          {/* SERP Search Preview */}
          <div style={{ backgroundColor: '#fdfdfd', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '20px', marginBottom: '30px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '13px', textTransform: 'uppercase', color: '#666', letterSpacing: '1px' }}>
              Google Search Result Snippet Preview
            </h4>
            <div style={{ fontFamily: 'Arial, sans-serif' }}>
              <div style={{ fontSize: '14px', color: '#202124' }}>
                https://konnectmarketingusa.com &gt; {pageData.slug}
              </div>
              <div style={{ fontSize: '20px', color: '#1a0dab', fontWeight: 500, margin: '2px 0 4px', cursor: 'pointer' }}>
                {pageData.seoTitle || pageData.title || 'Page Title'} | Konnect Marketing USA
              </div>
              <div style={{ fontSize: '13px', color: '#4d5156', lineHeight: '1.4em' }}>
                {pageData.seoDescription || 'Add a meta description to control how this page appears in Google search engine results.'}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                SEO Meta Title
              </label>
              <input
                type="text"
                value={pageData.seoTitle || ''}
                onChange={(e) => setPageData({ ...pageData, seoTitle: e.target.value })}
                placeholder="Custom title tag for search engines"
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                Focus Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={pageData.focusKeywords || ''}
                onChange={(e) => setPageData({ ...pageData, focusKeywords: e.target.value })}
                placeholder="billboards, led walls, transit media"
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
              SEO Meta Description
            </label>
            <textarea
              rows={3}
              value={pageData.seoDescription || ''}
              onChange={(e) => setPageData({ ...pageData, seoDescription: e.target.value })}
              placeholder="Recommended: 140–160 characters describing the core value of this page."
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                OpenGraph Social Title
              </label>
              <input
                type="text"
                value={pageData.ogTitle || ''}
                onChange={(e) => setPageData({ ...pageData, ogTitle: e.target.value })}
                placeholder="Title when shared on LinkedIn / Meta / Twitter"
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                Social Share Image (OG Image)
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={pageData.ogImageUrl || ''}
                  onChange={(e) => setPageData({ ...pageData, ogImageUrl: e.target.value })}
                  placeholder="/images/bg-01-free-img.jpg"
                  style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
                <button
                  type="button"
                  onClick={() => setOgMediaPickerOpen(true)}
                  style={{ padding: '10px 16px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  🖼 Select Image
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '25px', marginBottom: '25px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                Structured Data Schema Type
              </label>
              <select
                value={pageData.schemaType || 'WebPage'}
                onChange={(e) => setPageData({ ...pageData, schemaType: e.target.value })}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              >
                <option value="WebPage">WebPage (General)</option>
                <option value="Organization">Organization (Company Profile)</option>
                <option value="MarketingAgency">MarketingAgency / LocalBusiness</option>
                <option value="Service">Service (Service Offering)</option>
                <option value="Product">Product (Hardware Specs)</option>
                <option value="ContactPage">ContactPage</option>
                <option value="FAQPage">FAQPage</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '25px' }}>
              <input
                type="checkbox"
                id="robotsIndex"
                checked={pageData.robotsIndex !== false}
                onChange={(e) => setPageData({ ...pageData, robotsIndex: e.target.checked })}
                style={{ width: '18px', height: '18px', marginRight: '8px', cursor: 'pointer' }}
              />
              <label htmlFor="robotsIndex" style={{ fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
                Allow Search Engines to Index (index)
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '25px' }}>
              <input
                type="checkbox"
                id="robotsFollow"
                checked={pageData.robotsFollow !== false}
                onChange={(e) => setPageData({ ...pageData, robotsFollow: e.target.checked })}
                style={{ width: '18px', height: '18px', marginRight: '8px', cursor: 'pointer' }}
              />
              <label htmlFor="robotsFollow" style={{ fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
                Follow Links on this Page (follow)
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
              Custom JSON-LD Schema (Optional Override)
            </label>
            <textarea
              rows={4}
              value={pageData.customSchemaJson || ''}
              onChange={(e) => setPageData({ ...pageData, customSchemaJson: e.target.value })}
              placeholder='Optional: {"@context": "https://schema.org", "@type": "CustomSchema", ...}'
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'monospace', fontSize: '13px' }}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <BlockEditorModal
        isOpen={blockModalOpen}
        onClose={() => {
          setBlockModalOpen(false);
          setEditingBlock(null);
        }}
        pageId={params.id}
        initialBlock={editingBlock}
        onSave={handleSaveBlock}
      />

      <MediaPickerModal
        isOpen={ogMediaPickerOpen}
        onClose={() => setOgMediaPickerOpen(false)}
        onSelectImage={(url) => setPageData({ ...pageData, ogImageUrl: url })}
      />
    </div>
  );
}
