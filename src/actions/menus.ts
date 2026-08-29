'use server';

import { db } from '@/lib/db';
import { MenuItemSchema } from '@/lib/validations';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getCurrentSession } from '@/lib/auth';
import { requirePermission } from '@/lib/permissions';

export async function getMenusWithItems() {
  return db.menu.findMany({
    include: {
      items: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  });
}

export async function getMenuByLocation(locationSlug: string) {
  return db.menu.findUnique({
    where: { locationSlug },
    include: {
      items: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  });
}

export async function saveMenuItemAction(data: any) {
  const session = await getCurrentSession();
  if (!session) return { error: 'Unauthorized.' };
  try {
    requirePermission(session, 'menus:manage');
  } catch (e: any) {
    return { error: e.message || 'Unauthorized: Insufficient permissions' };
  }

  const parsed = MenuItemSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || 'Invalid menu item data.' };
  }

  let item;
  if (data.id) {
    item = await db.menuItem.update({
      where: { id: data.id },
      data: parsed.data,
    });
  } else {
    item = await db.menuItem.create({
      data: parsed.data,
    });
  }

  revalidatePath('/', 'layout');
  revalidateTag('menus');
  return { success: true, item };
}

export async function deleteMenuItemAction(id: string) {
  const session = await getCurrentSession();
  if (!session) return { error: 'Unauthorized.' };
  try {
    requirePermission(session, 'menus:manage');
  } catch (e: any) {
    return { error: e.message || 'Unauthorized: Insufficient permissions' };
  }

  await db.menuItem.delete({ where: { id } });
  revalidatePath('/', 'layout');
  revalidateTag('menus');
  return { success: true };
}

export async function reorderMenuItemsAction(itemIds: string[]) {
  const session = await getCurrentSession();
  if (!session) return { error: 'Unauthorized.' };
  try {
    requirePermission(session, 'menus:manage');
  } catch (e: any) {
    return { error: e.message || 'Unauthorized: Insufficient permissions' };
  }

  await db.$transaction(
    itemIds.map((id, index) =>
      db.menuItem.update({
        where: { id },
        data: { orderIndex: index },
      })
    )
  );

  revalidatePath('/', 'layout');
  revalidateTag('menus');
  return { success: true };
}
