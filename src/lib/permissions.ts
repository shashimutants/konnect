export type Role = 'SUPER_ADMIN' | 'EDITOR' | 'AUTHOR';

export type Action =
  | 'pages:create'
  | 'pages:edit'
  | 'pages:publish'
  | 'pages:delete'
  | 'pages:seo'
  | 'media:upload'
  | 'media:delete'
  | 'menus:manage'
  | 'schemas:manage'
  | 'users:manage'
  | 'settings:manage'
  | 'revisions:restore';

export interface AdminNavLink {
  href: string;
  label: string;
  icon: string;
}

interface NavItemConfig extends AdminNavLink {
  requiredAction?: Action;
}

/**
 * Role-Based Access Control (RBAC) permission definitions
 */
const ROLE_PERMISSIONS: Record<Role, readonly Action[]> = {
  SUPER_ADMIN: [
    'pages:create',
    'pages:edit',
    'pages:publish',
    'pages:delete',
    'pages:seo',
    'media:upload',
    'media:delete',
    'menus:manage',
    'schemas:manage',
    'users:manage',
    'settings:manage',
    'revisions:restore',
  ],
  EDITOR: [
    'pages:create',
    'pages:edit',
    'pages:publish',
    'pages:seo',
    'media:upload',
    'media:delete',
    'menus:manage',
    'schemas:manage',
    'revisions:restore',
  ],
  AUTHOR: [
    'pages:create',
    'pages:edit',
    'media:upload',
  ],
};

/**
 * Navigation items and their required permissions for the admin sidebar
 */
export const ADMIN_NAV_LINKS: readonly NavItemConfig[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/pages', label: 'Pages & Sections', icon: '📄' },
  { href: '/admin/schemas', label: 'Section Schemas', icon: '🎨', requiredAction: 'schemas:manage' },
  { href: '/admin/menus', label: 'Navigation Menus', icon: '🧭', requiredAction: 'menus:manage' },
  { href: '/admin/media', label: 'Media Library', icon: '🖼️', requiredAction: 'media:upload' },
  { href: '/admin/users', label: 'Users & Roles', icon: '👥', requiredAction: 'users:manage' },
  { href: '/admin/settings', label: 'Global Settings', icon: '⚙️', requiredAction: 'settings:manage' },
];

/**
 * Check if a given role has permission to perform a specific action
 */
export function hasPermission(role: string, action: Action): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role as Role];
  if (!permissions) return false;
  return permissions.includes(action);
}

/**
 * Ensure the current session has permission for a specific action.
 * Throws an Error if session is null or the role lacks permission.
 */
export function requirePermission(
  session: { role: string } | null | undefined,
  action: Action
): void {
  if (!session || !session.role || !hasPermission(session.role, action)) {
    throw new Error('Unauthorized: Insufficient permissions');
  }
}

/**
 * Returns filtered admin navigation links based on user role permissions
 */
export function getVisibleNavLinks(
  role: string
): Array<{ href: string; label: string; icon: string }> {
  return ADMIN_NAV_LINKS.filter((item) => {
    if (!item.requiredAction) return true;
    return hasPermission(role, item.requiredAction);
  }).map(({ href, label, icon }) => ({ href, label, icon }));
}
