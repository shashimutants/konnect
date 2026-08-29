'use server';

import { db } from '@/lib/db';
import { PageFormSchema, ContentBlockSchema } from '@/lib/validations';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getCurrentSession } from '@/lib/auth';
import { createRevisionSnapshot } from '@/actions/revisions';
import { requirePermission } from '@/lib/permissions';

export async function getPagesList() {
  return db.page.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: {
        select: { blocks: true },
      },
    },
  });
}

export async function getPageWithBlocks(id: string) {
  return db.page.findUnique({
    where: { id },
    include: {
      blocks: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  });
}

export async function createPageAction(data: any) {
  const session = await getCurrentSession();
  if (!session) return { error: 'Unauthorized.' };

  const parsed = PageFormSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || 'Invalid page data.' };
  }

  const language = parsed.data.language || 'en-US';
  const existingSlug = await db.page.findFirst({
    where: { slug: parsed.data.slug, language },
  });

  if (existingSlug) {
    return { error: 'A page with this slug already exists for this language.' };
  }

  const newPage = await db.page.create({
    data: {
      ...parsed.data,
      publishedAt: parsed.data.status === 'PUBLISHED' ? new Date() : null,
    },
  });

  revalidatePath('/');
  revalidatePath(`/${newPage.slug}`);
  revalidatePath('/sitemap.xml');
  revalidateTag('pages');
  revalidateTag('sitemap');
  revalidateTag(`page-${newPage.slug}`);
  return { success: true, pageId: newPage.id };
}

export async function updatePageAction(id: string, data: any) {
  const session = await getCurrentSession();
  if (!session) return { error: 'Unauthorized.' };

  const parsed = PageFormSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || 'Invalid page data.' };
  }

  const existingPage = await db.page.findUnique({ where: { id } });
  if (existingPage && existingPage.status !== parsed.data.status && (parsed.data.status === 'PUBLISHED' || parsed.data.status === 'DRAFT')) {
    requirePermission(session, 'pages:publish');
  }

  const updateLanguage = parsed.data.language || existingPage?.language || 'en-US';
  const existingSlug = await db.page.findFirst({
    where: {
      slug: parsed.data.slug,
      language: updateLanguage,
      NOT: { id },
    },
  });

  if (existingSlug) {
    return { error: 'Another page already uses this slug for this language.' };
  }

  await createRevisionSnapshot(id, 'Page settings updated');

  const updatedPage = await db.page.update({
    where: { id },
    data: {
      ...parsed.data,
      publishedAt: parsed.data.status === 'PUBLISHED' ? new Date() : null,
    },
  });

  revalidatePath('/');
  revalidatePath(`/${updatedPage.slug}`);
  revalidatePath('/sitemap.xml');
  revalidateTag('pages');
  revalidateTag('sitemap');
  revalidateTag(`page-${updatedPage.slug}`);
  if (updatedPage.isHome) revalidateTag('page-home');
  return { success: true, page: updatedPage };
}

export async function deletePageAction(id: string) {
  const session = await getCurrentSession();
  if (!session || session.role === 'AUTHOR') return { error: 'Unauthorized.' };

  requirePermission(session, 'pages:delete');

  const page = await db.page.findUnique({ where: { id } });
  if (!page) return { error: 'Page not found.' };

  await db.page.delete({ where: { id } });

  revalidatePath('/');
  revalidatePath(`/${page.slug}`);
  revalidatePath('/sitemap.xml');
  revalidateTag('pages');
  revalidateTag('sitemap');
  revalidateTag(`page-${page.slug}`);
  if (page.isHome) revalidateTag('page-home');
  return { success: true };
}

/**
 * Dynamic Section / Block Management Actions
 */
export async function saveContentBlockAction(data: {
  id?: string;
  pageId: string;
  blockType: string;
  orderIndex: number;
  contentJson: string;
  isVisible: boolean;
  animationType?: string | null;
  animationDuration?: string | null;
  animationDelay?: number | null;
}) {
  const session = await getCurrentSession();
  if (!session) return { error: 'Unauthorized.' };

  const parsed = ContentBlockSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || 'Invalid block data.' };
  }

  let block;
  if (data.id) {
    await createRevisionSnapshot(parsed.data.pageId, 'Content block modified');
    block = await db.contentBlock.update({
      where: { id: data.id },
      data: {
        blockType: parsed.data.blockType,
        orderIndex: parsed.data.orderIndex,
        contentJson: parsed.data.contentJson,
        isVisible: parsed.data.isVisible,
        animationType: parsed.data.animationType ?? 'fade-in',
        animationDuration: parsed.data.animationDuration ?? 'normal',
        animationDelay: parsed.data.animationDelay ?? 0,
      },
    });
  } else {
    await createRevisionSnapshot(parsed.data.pageId, 'Content block added');
    block = await db.contentBlock.create({
      data: {
        pageId: parsed.data.pageId,
        blockType: parsed.data.blockType,
        orderIndex: parsed.data.orderIndex,
        contentJson: parsed.data.contentJson,
        isVisible: parsed.data.isVisible,
        animationType: parsed.data.animationType ?? 'fade-in',
        animationDuration: parsed.data.animationDuration ?? 'normal',
        animationDelay: parsed.data.animationDelay ?? 0,
      },
    });
  }

  const page = await db.page.findUnique({ where: { id: block.pageId } });
  if (page) {
    revalidatePath(`/${page.slug === 'home' ? '' : page.slug}`);
    revalidateTag(`page-${page.slug}`);
    if (page.isHome) revalidateTag('page-home');
  }

  return { success: true, block };
}

export async function reorderBlocksAction(pageId: string, blockIds: string[]) {
  const session = await getCurrentSession();
  if (!session) return { error: 'Unauthorized.' };

  // Update orderIndex for each block
  await db.$transaction(
    blockIds.map((id, index) =>
      db.contentBlock.update({
        where: { id },
        data: { orderIndex: index },
      })
    )
  );

  const page = await db.page.findUnique({ where: { id: pageId } });
  if (page) {
    revalidatePath(`/${page.slug === 'home' ? '' : page.slug}`);
    revalidateTag(`page-${page.slug}`);
    if (page.isHome) revalidateTag('page-home');
  }

  return { success: true };
}

export async function toggleBlockVisibilityAction(blockId: string, isVisible: boolean) {
  const session = await getCurrentSession();
  if (!session) return { error: 'Unauthorized.' };

  const block = await db.contentBlock.update({
    where: { id: blockId },
    data: { isVisible },
  });

  const page = await db.page.findUnique({ where: { id: block.pageId } });
  if (page) {
    revalidatePath(`/${page.slug === 'home' ? '' : page.slug}`);
    revalidateTag(`page-${page.slug}`);
    if (page.isHome) revalidateTag('page-home');
  }

  return { success: true, isVisible: block.isVisible };
}

export async function deleteContentBlockAction(blockId: string) {
  const session = await getCurrentSession();
  if (!session) return { error: 'Unauthorized.' };

  const blockCheck = await db.contentBlock.findUnique({ where: { id: blockId } });
  if (blockCheck) {
    await createRevisionSnapshot(blockCheck.pageId, 'Content block deleted');
  }

  const block = await db.contentBlock.delete({
    where: { id: blockId },
  });

  const page = await db.page.findUnique({ where: { id: block.pageId } });
  if (page) {
    revalidatePath(`/${page.slug === 'home' ? '' : page.slug}`);
    revalidateTag(`page-${page.slug}`);
    if (page.isHome) revalidateTag('page-home');
  }

  return { success: true };
}

export async function createTranslationAction(sourcePageId: string, targetLanguage: string) {
  const session = await getCurrentSession();
  if (!session) return { error: 'Unauthorized.' };

  // Fetch the source page with all blocks
  const sourcePage = await db.page.findUnique({
    where: { id: sourcePageId },
    include: { blocks: { orderBy: { orderIndex: 'asc' } } },
  });

  if (!sourcePage) return { error: 'Source page not found.' };

  // Check if translation already exists for this language
  const existing = await db.page.findFirst({
    where: { slug: sourcePage.slug, language: targetLanguage },
  });
  if (existing) return { error: `A ${targetLanguage} translation already exists for this slug.` };

  // Generate or reuse localeGroupId
  const localeGroupId = sourcePage.localeGroupId || sourcePage.id;

  // Update source page's localeGroupId if not set
  if (!sourcePage.localeGroupId) {
    await db.page.update({
      where: { id: sourcePageId },
      data: { localeGroupId },
    });
  }

  // Clone the page with new language
  const newPage = await db.page.create({
    data: {
      title: `${sourcePage.title} [${targetLanguage}]`,
      slug: sourcePage.slug,
      template: sourcePage.template,
      status: 'DRAFT',
      language: targetLanguage,
      localeGroupId,
      isHome: sourcePage.isHome,
      seoTitle: sourcePage.seoTitle,
      seoDescription: sourcePage.seoDescription,
      focusKeywords: sourcePage.focusKeywords,
      canonicalUrl: sourcePage.canonicalUrl,
      ogTitle: sourcePage.ogTitle,
      ogDescription: sourcePage.ogDescription,
      ogImageUrl: sourcePage.ogImageUrl,
      twitterCard: sourcePage.twitterCard,
      robotsIndex: sourcePage.robotsIndex,
      robotsFollow: sourcePage.robotsFollow,
      schemaType: sourcePage.schemaType,
      customSchemaJson: sourcePage.customSchemaJson,
    },
  });

  // Clone all content blocks
  for (const block of sourcePage.blocks) {
    await db.contentBlock.create({
      data: {
        pageId: newPage.id,
        blockType: block.blockType,
        orderIndex: block.orderIndex,
        contentJson: block.contentJson,
        isVisible: block.isVisible,
        animationType: block.animationType,
        animationDuration: block.animationDuration,
        animationDelay: block.animationDelay,
      },
    });
  }

  revalidatePath('/admin/pages');
  return { success: true, pageId: newPage.id };
}

export async function getPageTranslations(pageId: string) {
  const page = await db.page.findUnique({ where: { id: pageId } });
  if (!page || !page.localeGroupId) return [];
  return db.page.findMany({
    where: { localeGroupId: page.localeGroupId, id: { not: pageId } },
    select: { id: true, title: true, language: true, status: true, slug: true },
  });
}

export async function generatePreviewUrl(pageId: string) {
  const session = await getCurrentSession();
  if (!session) return { error: 'Unauthorized.' };

  const page = await db.page.findUnique({ where: { id: pageId } });
  if (!page) return { error: 'Page not found.' };

  const { generatePreviewToken } = await import('@/lib/preview');
  const token = await generatePreviewToken(page.slug, page.id);
  const previewUrl = `/api/draft?token=${encodeURIComponent(token)}&slug=${encodeURIComponent(page.slug)}`;
  return { success: true, previewUrl };
}

