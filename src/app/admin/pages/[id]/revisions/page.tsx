'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPageRevisions, restoreRevision } from '@/actions/revisions';

interface RevisionsPageProps {
  params: {
    id: string;
  };
}

export default function RevisionsPage({ params }: RevisionsPageProps) {
  const [revisions, setRevisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    loadRevisions();
  }, [params.id]);

  async function loadRevisions() {
    setLoading(true);
    try {
      const data = await getPageRevisions(params.id);
      setRevisions(data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function handleRestore(revisionId: string) {
    if (!confirm('Are you sure you want to restore this version? This will overwrite the current page content.')) return;
    
    setRestoring(revisionId);
    try {
      const res = await restoreRevision(revisionId);
      if (res.success) {
        alert('Version restored successfully!');
        window.location.reload();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to restore version.');
    }
    setRestoring(null);
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading version history...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <Link href={`/admin/pages/${params.id}`} style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
            &larr; Back to Page Editor
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '6px 0 0', color: '#111' }}>
            Version History
          </h1>
        </div>
      </div>

      {revisions.length === 0 ? (
        <div style={{ backgroundColor: '#fff', padding: '50px 20px', textAlign: 'center', borderRadius: '6px', border: '1px solid #eaeaea' }}>
          <h3>No Revisions Found</h3>
          <p style={{ color: '#666' }}>This page does not have any saved versions yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {revisions.map((rev, index) => {
            const isCurrent = index === 0;
            return (
              <div
                key={rev.id}
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #eaeaea',
                  borderRadius: '6px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, backgroundColor: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>
                      v{rev.revisionNum}
                    </span>
                    {isCurrent && (
                      <span
                        style={{
                          fontSize: '11px',
                          backgroundColor: 'rgba(236,75,70,0.1)',
                          color: 'var(--ast-global-color-0)',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontWeight: 600,
                        }}
                      >
                        Current
                      </span>
                    )}
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
                      {rev.createdBy?.name || 'Unknown Author'}
                    </span>
                    <span style={{ fontSize: '13px', color: '#888' }}>
                      {new Date(rev.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {rev.changeNote && (
                    <div style={{ fontSize: '14px', color: '#555' }}>
                      Note: {rev.changeNote}
                    </div>
                  )}
                </div>

                {!isCurrent && (
                  <button
                    onClick={() => handleRestore(rev.id)}
                    disabled={restoring === rev.id}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#fff',
                      color: 'var(--ast-global-color-0)',
                      border: '1px solid var(--ast-global-color-0)',
                      borderRadius: '4px',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: restoring === rev.id ? 'not-allowed' : 'pointer',
                      opacity: restoring === rev.id ? 0.7 : 1,
                    }}
                  >
                    {restoring === rev.id ? 'Restoring...' : 'Restore This Version'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
