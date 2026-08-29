'use client';

import React, { useState, useEffect } from 'react';
import { getMenusWithItems, saveMenuItemAction, deleteMenuItemAction, reorderMenuItemsAction } from '@/actions/menus';

export default function AdminMenusPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMenus();
  }, []);

  async function loadMenus() {
    setLoading(true);
    const list = await getMenusWithItems();
    setMenus(list);
    if (list.length > 0 && !activeMenuId) {
      setActiveMenuId(list[0].id);
    }
    setLoading(false);
  }

  const activeMenu = menus.find((m) => m.id === activeMenuId);

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!activeMenuId || !newItemTitle || !newItemUrl) return;

    setSaving(true);
    const orderIndex = activeMenu?.items?.length || 0;
    const res = await saveMenuItemAction({
      menuId: activeMenuId,
      title: newItemTitle,
      url: newItemUrl,
      orderIndex,
    });
    setSaving(false);

    if (res.success) {
      setNewItemTitle('');
      setNewItemUrl('');
      loadMenus();
    } else {
      alert(res.error || 'Failed to add menu item.');
    }
  }

  async function handleDeleteItem(id: string) {
    if (!confirm('Delete this menu item?')) return;
    const res = await deleteMenuItemAction(id);
    if (res.success) {
      loadMenus();
    }
  }

  async function handleMove(index: number, direction: 'up' | 'down') {
    if (!activeMenu) return;
    const items = [...activeMenu.items];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;

    const temp = items[index];
    items[index] = items[target];
    items[target] = temp;

    await reorderMenuItemsAction(items.map((i) => i.id));
    loadMenus();
  }

  return (
    <div>
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 6px', color: '#111' }}>
          Navigation &amp; Mega-Menu Builder
        </h1>
        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
          Manage global header links, multi-tier mega-menus, and footer link columns.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading menus...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '25px' }}>
          {/* Menu Selector Sidebar */}
          <div style={{ backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #eaeaea', padding: '20px' }}>
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#888', letterSpacing: '1px', margin: '0 0 15px' }}>
              Menu Locations
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {menus.map((menu) => (
                <li key={menu.id} style={{ marginBottom: '8px' }}>
                  <button
                    onClick={() => setActiveMenuId(menu.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 14px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: activeMenuId === menu.id ? 'var(--ast-global-color-0)' : '#f9f9f9',
                      color: activeMenuId === menu.id ? '#fff' : '#333',
                      fontWeight: activeMenuId === menu.id ? 600 : 500,
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    {menu.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Active Menu Items List & Add Form */}
          <div style={{ backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #eaeaea', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>
                {activeMenu?.name} Items ({activeMenu?.items?.length || 0})
              </h2>
            </div>

            {/* List of items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
              {activeMenu?.items?.map((item: any, idx: number) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    backgroundColor: '#fafafa',
                    border: '1px solid #eee',
                    borderRadius: '4px',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: '#222' }}>{item.title}</span>
                    <span style={{ marginLeft: '12px', fontSize: '12px', color: '#888' }}>{item.url}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      style={{ padding: '4px 8px', background: '#fff', border: '1px solid #ddd', borderRadius: '3px', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                    >
                      ▲
                    </button>
                    <button
                      disabled={idx === (activeMenu?.items?.length || 0) - 1}
                      onClick={() => handleMove(idx, 'down')}
                      style={{ padding: '4px 8px', background: '#fff', border: '1px solid #ddd', borderRadius: '3px', cursor: idx === (activeMenu?.items?.length || 0) - 1 ? 'not-allowed' : 'pointer' }}
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      style={{ padding: '4px 10px', backgroundColor: '#ffebee', color: '#c62828', border: 'none', borderRadius: '3px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Item Form */}
            <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '6px', border: '1px solid #eee' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 15px' }}>+ Add Menu Link</h3>
              <form onSubmit={handleAddItem} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Link Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Case Studies"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Target URL</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. /portfolio or https://..."
                    value={newItemUrl}
                    onChange={(e) => setNewItemUrl(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'var(--ast-global-color-0)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {saving ? 'Adding...' : 'Add Link'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
