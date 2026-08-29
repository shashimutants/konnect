'use client';

import React, { useState, useEffect } from 'react';
import { getUsersList, createUserAction, updateUserAction, toggleUserStatusAction, deleteUserAction } from '@/actions/users';
import { adminResetPasswordAction, getCurrentUserSession } from '@/actions/auth';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentSessionUser, setCurrentSessionUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Create user form
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EDITOR');
  const [saving, setSaving] = useState(false);

  // Edit user modal
  const [editModalUser, setEditModalUser] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('EDITOR');
  const [editSaving, setEditSaving] = useState(false);

  // Reset password modal
  const [resetModalUser, setResetModalUser] = useState<any | null>(null);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetSaving, setResetSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [list, session] = await Promise.all([
        getUsersList(),
        getCurrentUserSession(),
      ]);
      setUsers(list);
      setCurrentSessionUser(session);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await createUserAction({ email, name, password, role });
    setSaving(false);

    if (res.success) {
      setEmail('');
      setName('');
      setPassword('');
      loadData();
      alert('User account created successfully.');
    } else {
      alert(res.error || 'Failed to create user.');
    }
  }

  async function handleUpdateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!editModalUser) return;

    setEditSaving(true);
    const res = await updateUserAction({
      userId: editModalUser.id,
      name: editName,
      email: editEmail,
      role: editRole,
    });
    setEditSaving(false);

    if (res.success) {
      alert('User details updated successfully.');
      setEditModalUser(null);
      loadData();
    } else {
      alert(res.error || 'Failed to update user.');
    }
  }

  async function handleToggleStatus(userId: string, currentStatus: boolean) {
    if (currentSessionUser?.userId === userId) {
      alert('Security restriction: You cannot deactivate your own logged-in account.');
      return;
    }
    const res = await toggleUserStatusAction(userId, !currentStatus);
    if (res.success) {
      loadData();
    } else {
      alert(res.error || 'Failed to change status.');
    }
  }

  async function handleDelete(userId: string) {
    if (currentSessionUser?.userId === userId) {
      alert('Security restriction: You cannot delete your own logged-in account.');
      return;
    }
    if (!confirm('Are you sure you want to permanently delete this user account?')) return;
    const res = await deleteUserAction(userId);
    if (res.success) {
      loadData();
    } else {
      alert(res.error || 'Failed to delete user.');
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!resetModalUser) return;

    setResetSaving(true);
    const res = await adminResetPasswordAction(resetModalUser.id, resetNewPassword);
    setResetSaving(false);

    if (res.success) {
      alert(res.message || 'Password reset successfully.');
      setResetModalUser(null);
      setResetNewPassword('');
    } else {
      alert(res.error || 'Failed to reset password.');
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 6px', color: '#111' }}>
          Users &amp; Access Control (RBAC)
        </h1>
        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
          Manage admin team accounts, edit profiles, assign roles, and change passwords.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '25px' }}>
        {/* User Table */}
        <div style={{ backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #eaeaea', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading users...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #eaeaea', textAlign: 'left', color: '#666', fontSize: '12px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 20px' }}>Name</th>
                  <th style={{ padding: '14px 20px' }}>Email</th>
                  <th style={{ padding: '14px 20px' }}>Role</th>
                  <th style={{ padding: '14px 20px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = currentSessionUser?.userId === u.id;
                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f5f5f5', backgroundColor: isSelf ? '#fafcff' : '#ffffff' }}>
                      <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{u.name}</span>
                          {isSelf && (
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                backgroundColor: '#e3f2fd',
                                color: '#1976d2',
                                padding: '2px 6px',
                                borderRadius: '3px',
                              }}
                            >
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#666' }}>{u.email}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            backgroundColor: u.role === 'SUPER_ADMIN' ? 'rgba(236,75,70,0.1)' : '#f0f0f0',
                            color: u.role === 'SUPER_ADMIN' ? 'var(--ast-global-color-0)' : '#333',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: 600,
                            backgroundColor: u.isActive ? '#e8f5e9' : '#ffebee',
                            color: u.isActive ? '#2e7d32' : '#c62828',
                          }}
                        >
                          {u.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          {/* Edit Details */}
                          <button
                            onClick={() => {
                              setEditModalUser(u);
                              setEditName(u.name);
                              setEditEmail(u.email);
                              setEditRole(u.role);
                            }}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#f5f5f5',
                              border: '1px solid #ddd',
                              borderRadius: '3px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              color: '#333',
                            }}
                            title="Edit user details"
                          >
                            ✏️ Edit
                          </button>

                          {/* Reset Password */}
                          <button
                            onClick={() => {
                              setResetModalUser(u);
                              setResetNewPassword('');
                            }}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#f5f5f5',
                              border: '1px solid #ddd',
                              borderRadius: '3px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              color: '#333',
                            }}
                            title="Change / reset password"
                          >
                            🔑 Key
                          </button>

                          {/* Toggle Status (Disabled for self) */}
                          <button
                            onClick={() => handleToggleStatus(u.id, u.isActive)}
                            disabled={isSelf}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: isSelf ? '#f0f0f0' : '#f5f5f5',
                              color: isSelf ? '#aaa' : '#333',
                              border: '1px solid #ddd',
                              borderRadius: '3px',
                              fontSize: '11px',
                              cursor: isSelf ? 'not-allowed' : 'pointer',
                            }}
                            title={isSelf ? 'You cannot deactivate your own account' : (u.isActive ? 'Disable user' : 'Enable user')}
                          >
                            {u.isActive ? 'Disable' : 'Enable'}
                          </button>

                          {/* Delete (Disabled for self) */}
                          <button
                            onClick={() => handleDelete(u.id)}
                            disabled={isSelf}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: isSelf ? '#f0f0f0' : '#ffebee',
                              color: isSelf ? '#aaa' : '#c62828',
                              border: 'none',
                              borderRadius: '3px',
                              fontSize: '11px',
                              cursor: isSelf ? 'not-allowed' : 'pointer',
                              fontWeight: 600,
                            }}
                            title={isSelf ? 'You cannot delete your own account' : 'Delete user'}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Create User Form */}
        <div style={{ backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #eaeaea', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 18px' }}>+ Create Admin User</h3>
          <form onSubmit={handleCreateUser}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Assigned Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
              >
                <option value="SUPER_ADMIN">Super Admin (Full Control)</option>
                <option value="EDITOR">Editor (Manage Pages &amp; Media)</option>
                <option value="AUTHOR">Author (Draft Content Only)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'var(--ast-global-color-0)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Creating User...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>

      {/* Edit User Modal */}
      {editModalUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '30px',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700 }}>
              Edit User: {editModalUser.name}
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#666' }}>
              Update name, email, or role assignment.
            </p>

            <form onSubmit={handleUpdateUser}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Assigned Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  disabled={currentSessionUser?.userId === editModalUser.id}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                >
                  <option value="SUPER_ADMIN">Super Admin (Full Control)</option>
                  <option value="EDITOR">Editor (Manage Pages &amp; Media)</option>
                  <option value="AUTHOR">Author (Draft Content Only)</option>
                </select>
                {currentSessionUser?.userId === editModalUser.id && (
                  <span style={{ fontSize: '11px', color: '#888', marginTop: '4px', display: 'block' }}>
                    Note: You cannot demote your own Super Admin role.
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setEditModalUser(null)}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'var(--ast-global-color-0)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: editSaving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {editSaving ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetModalUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '30px',
              width: '100%',
              maxWidth: '450px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700 }}>
              Reset Password for {resetModalUser.name}
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#666' }}>
              Enter a new password for {resetModalUser.email}.
            </p>

            <form onSubmit={handleResetPassword}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetSaving}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'var(--ast-global-color-0)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: resetSaving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {resetSaving ? 'Resetting...' : 'Save New Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
