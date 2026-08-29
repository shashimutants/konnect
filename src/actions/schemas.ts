'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentSession } from '@/lib/auth';
import { requirePermission } from '@/lib/permissions';

const sectionTemplateSchema = z.object({
  name: z.string().min(2, 'Schema template name is required'),
  category: z.string().default('General'),
  description: z.string().optional(),
  blockType: z.string().min(1, 'Block type is required'),
  thumbnailUrl: z.string().optional(),
  defaultContentJson: z.string(),
  defaultAnimationJson: z.string().optional(),
});

export async function getSectionTemplates(category?: string) {
  return db.sectionTemplate.findMany({
    where: category && category !== 'All' ? { category } : undefined,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getSectionTemplateById(id: string) {
  return db.sectionTemplate.findUnique({
    where: { id },
  });
}

export async function createSectionTemplateAction(data: {
  name: string;
  category: string;
  description?: string;
  blockType: string;
  thumbnailUrl?: string;
  defaultContentJson: string;
  defaultAnimationJson?: string;
}) {
  try {
    const session = await getCurrentSession();
    requirePermission(session, 'schemas:manage');
    
    const validated = sectionTemplateSchema.parse(data);
    const template = await db.sectionTemplate.create({
      data: {
        name: validated.name,
        category: validated.category,
        description: validated.description || '',
        blockType: validated.blockType,
        thumbnailUrl: validated.thumbnailUrl || '',
        defaultContentJson: validated.defaultContentJson,
        defaultAnimationJson: validated.defaultAnimationJson || JSON.stringify({ type: 'fade-in', duration: 'normal', delay: 0 }),
      },
    });

    revalidatePath('/admin/schemas');
    return { success: true, templateId: template.id };
  } catch (e: any) {
    if (e.message?.includes('Unauthorized') || e.message?.includes('Insufficient')) {
      return { success: false, error: 'Unauthorized: Insufficient permissions' };
    }
    return { success: false, error: e.message || 'Failed to create section template' };
  }
}

export async function updateSectionTemplateAction(
  id: string,
  data: {
    name: string;
    category: string;
    description?: string;
    blockType: string;
    thumbnailUrl?: string;
    defaultContentJson: string;
    defaultAnimationJson?: string;
  }
) {
  try {
    const session = await getCurrentSession();
    requirePermission(session, 'schemas:manage');
    
    const validated = sectionTemplateSchema.parse(data);
    await db.sectionTemplate.update({
      where: { id },
      data: {
        name: validated.name,
        category: validated.category,
        description: validated.description || '',
        blockType: validated.blockType,
        thumbnailUrl: validated.thumbnailUrl || '',
        defaultContentJson: validated.defaultContentJson,
        defaultAnimationJson: validated.defaultAnimationJson || JSON.stringify({ type: 'fade-in', duration: 'normal', delay: 0 }),
      },
    });

    revalidatePath('/admin/schemas');
    return { success: true };
  } catch (e: any) {
    if (e.message?.includes('Unauthorized') || e.message?.includes('Insufficient')) {
      return { success: false, error: 'Unauthorized: Insufficient permissions' };
    }
    return { success: false, error: e.message || 'Failed to update section template' };
  }
}

export async function deleteSectionTemplateAction(id: string) {
  try {
    const session = await getCurrentSession();
    requirePermission(session, 'schemas:manage');
    
    await db.sectionTemplate.delete({
      where: { id },
    });
    revalidatePath('/admin/schemas');
    return { success: true };
  } catch (e: any) {
    if (e.message?.includes('Unauthorized') || e.message?.includes('Insufficient')) {
      return { success: false, error: 'Unauthorized: Insufficient permissions' };
    }
    return { success: false, error: e.message || 'Failed to delete section template' };
  }
}
