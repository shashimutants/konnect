'use server';

import { db } from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function getSiteSettings() {
  const settingsList = await db.siteSetting.findMany();
  const map: Record<string, string> = {};
  for (const s of settingsList) {
    map[s.key] = s.value;
  }
  return map;
}

export async function updateSiteSettingsAction(settingsMap: Record<string, string>) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return { error: 'Unauthorized. Only Super Admins can update site settings.' };
  }

  for (const [key, value] of Object.entries(settingsMap)) {
    await db.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  revalidatePath('/', 'layout');
  revalidateTag('settings');
  return { success: true };
}
