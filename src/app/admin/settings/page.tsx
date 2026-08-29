'use client';

import React, { useState, useEffect } from 'react';
import { getSiteSettings, updateSiteSettingsAction } from '@/actions/settings';
import { changePasswordAction } from '@/actions/auth';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'cloudinary' | 'seo' | 'security'>('general');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    const data = await getSiteSettings();
    setSettings(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await updateSiteSettingsAction(settings);
    setSaving(false);

    if (res.success) {
      alert('Settings saved successfully.');
    } else {
      alert(res.error || 'Failed to update settings.');
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    setPasswordSaving(true);
    const res = await changePasswordAction(currentPassword, newPassword);
    setPasswordSaving(false);

    if (res.success) {
      setPasswordMessage({ type: 'success', text: res.message || 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMessage({ type: 'error', text: res.error || 'Failed to change password.' });
    }
  }

  const isCloudinarySet = Boolean(
    settings.cloudinary_cloud_name &&
    settings.cloudinary_api_key &&
    settings.cloudinary_api_secret &&
    settings.cloudinary_api_key !== 'your_api_key'
  );

  return (
    <div>
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 6px', color: '#111' }}>
          Global Settings &amp; Configuration
        </h1>
        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
          Manage site branding, Cloudinary storage keys, SEO schemas, and super admin security.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #eaeaea', marginBottom: '25px' }}>
        {[
          { id: 'general', label: '🏢 Brand & Contact' },
          { id: 'cloudinary', label: '☁️ Cloudinary & Media API' },
          { id: 'seo', label: '🔍 Structured SEO' },
          { id: 'security', label: '🔒 Change Password' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'none',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              color: activeTab === tab.id ? 'var(--ast-global-color-0)' : '#666',
              borderBottom: activeTab === tab.id ? '2px solid var(--ast-global-color-0)' : '2px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '6px' }}>
          Loading settings...
        </div>
      ) : (
        <div>
          {/* General Tab */}
          {activeTab === 'general' && (
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #eaeaea', padding: '30px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                Brand &amp; Identity
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Site Brand Name</label>
                  <input
                    type="text"
                    value={settings.site_name || ''}
                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Tagline</label>
                  <input
                    type="text"
                    value={settings.site_tagline || ''}
                    onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                  />
                </div>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 600, borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                Company Contact Info &amp; Locations
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Telephone</label>
                  <input
                    type="text"
                    value={settings.contact_phone || ''}
                    onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
                  <input
                    type="email"
                    value={settings.contact_email || ''}
                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Headquarters Address</label>
                  <input
                    type="text"
                    value={settings.contact_address || ''}
                    onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                  />
                </div>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 600, borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                Social Profiles
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>LinkedIn URL</label>
                  <input
                    type="text"
                    value={settings.social_linkedin || ''}
                    onChange={(e) => setSettings({ ...settings, social_linkedin: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Instagram URL</label>
                  <input
                    type="text"
                    value={settings.social_instagram || ''}
                    onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>YouTube URL</label>
                  <input
                    type="text"
                    value={settings.social_youtube || ''}
                    onChange={(e) => setSettings({ ...settings, social_youtube: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '12px 30px',
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
                {saving ? 'Saving...' : 'Save Brand Settings'}
              </button>
            </form>
          )}

          {/* Cloudinary Tab */}
          {activeTab === 'cloudinary' && (
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #eaeaea', padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '14px', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px' }}>
                    Cloudinary API &amp; Storage Configuration
                  </h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                    Configure your Cloudinary credentials for media upload, auto-thumbnails, and CDN delivery.
                  </p>
                </div>
                <div>
                  <span
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: isCloudinarySet ? '#e8f5e9' : '#fff3e0',
                      color: isCloudinarySet ? '#2e7d32' : '#e65100',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{isCloudinarySet ? '🟢' : '🟡'}</span>
                    {isCloudinarySet ? 'Cloudinary Connected' : 'Local Storage Mode (Active)'}
                  </span>
                </div>
              </div>

              {!isCloudinarySet && (
                <div style={{ backgroundColor: '#fff8e1', border: '1px solid #ffe082', borderRadius: '4px', padding: '14px 18px', marginBottom: '20px', fontSize: '13px', color: '#795548' }}>
                  ℹ️ <strong>Notice:</strong> Media uploads currently save directly to local server storage (<code>/public/uploads/</code>). To enable cloud delivery and responsive CDN transforms, paste your Cloudinary credentials below and click <strong>Save Cloudinary Settings</strong>.
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Cloud Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. konnect-marketing"
                    value={settings.cloudinary_cloud_name || ''}
                    onChange={(e) => setSettings({ ...settings, cloudinary_cloud_name: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Upload Preset (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. konnect_preset"
                    value={settings.cloudinary_upload_preset || ''}
                    onChange={(e) => setSettings({ ...settings, cloudinary_upload_preset: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    API Key <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 123456789012345"
                    value={settings.cloudinary_api_key || ''}
                    onChange={(e) => setSettings({ ...settings, cloudinary_api_key: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    API Secret <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="e.g. abcdefghijklmnopqrstuvwxyz"
                    value={settings.cloudinary_api_secret || ''}
                    onChange={(e) => setSettings({ ...settings, cloudinary_api_secret: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '12px 30px',
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
                {saving ? 'Saving...' : 'Save Cloudinary Settings'}
              </button>
            </form>
          )}

          {/* Structured SEO Tab */}
          {activeTab === 'seo' && (
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #eaeaea', padding: '30px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                Global Organization Schema (JSON-LD)
              </h3>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Structured Data JSON-LD Schema (Injected on all public pages)
                </label>
                <textarea
                  rows={10}
                  value={settings.global_organization_schema || ''}
                  onChange={(e) => setSettings({ ...settings, global_organization_schema: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    backgroundColor: '#fafafa',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '12px 30px',
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
                {saving ? 'Saving...' : 'Save SEO Schema'}
              </button>
            </form>
          )}

          {/* Security / Password Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} style={{ backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #eaeaea', padding: '30px', maxWidth: '600px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                Change Super Admin Password
              </h3>

              {passwordMessage && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    backgroundColor: passwordMessage.type === 'success' ? '#e8f5e9' : '#ffebee',
                    color: passwordMessage.type === 'success' ? '#2e7d32' : '#c62828',
                    border: `1px solid ${passwordMessage.type === 'success' ? '#a5d6a7' : '#ffcdd2'}`,
                  }}
                >
                  {passwordMessage.text}
                </div>
              )}

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Current Password <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  New Password (min 6 characters) <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Confirm New Password <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
              </div>

              <button
                type="submit"
                disabled={passwordSaving}
                style={{
                  padding: '12px 30px',
                  backgroundColor: 'var(--ast-global-color-0)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: passwordSaving ? 'not-allowed' : 'pointer',
                }}
              >
                {passwordSaving ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
