'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { usePathname } from 'next/navigation';
import { getCurrentUserSession } from '@/actions/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>({
    name: 'Admin',
    role: 'SUPER_ADMIN',
  });
  const pathname = usePathname();

  useEffect(() => {
    async function fetchSession() {
      try {
        const session = await getCurrentUserSession();
        if (session) {
          setUser({ name: session.name, role: session.role });
        }
      } catch (err) {
        console.error('Failed to fetch user session:', err);
      }
    }
    fetchSession();
  }, []);

  // Do not render admin shell on /admin/login
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9f9fb' }}>
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={user?.role || 'SUPER_ADMIN'}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, marginLeft: '260px' }} className="admin-main-content">
        <AdminHeader
          userName={user?.name || 'Admin'}
          userRole={user?.role || 'SUPER_ADMIN'}
          onMenuToggle={() => setSidebarOpen(true)}
        />
        <main style={{ flex: 1, padding: '30px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
