'use server';

import { db } from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/permissions';

export async function createRevisionSnapshot(pageId: string, changeNote?: string) {
  const session = await getCurrentSession();
  const createdById = session?.userId;

  const page = await db.page.findUnique({
    where: { id: pageId },
    include: {
      blocks: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  });

  if (!page) {
    throw new Error('Page not found');
  }

  const snapshotJson = JSON.stringify(page);

  const maxRevision = await db.pageRevision.aggregate({
    where: { pageId },
    _max: {
      revisionNum: true,
    },
  });

  const nextRevisionNum = (maxRevision._max.revisionNum || 0) + 1;

  const revision = await db.pageRevision.create({
    data: {
      pageId,
      revisionNum: nextRevisionNum,
      snapshotJson,
      changeNote,
      createdById,
    },
  });

  const totalRevisions = await db.pageRevision.count({
    where: { pageId },
  });

  if (totalRevisions > 50) {
    const revisionsToKeep = await db.pageRevision.findMany({
      where: { pageId },
      orderBy: { revisionNum: 'desc' },
      take: 50,
      select: { id: true },
    });

    const keepIds = revisionsToKeep.map((r) => r.id);

    await db.pageRevision.deleteMany({
      where: {
        pageId,
        id: { notIn: keepIds },
      },
    });
  }

  return revision;
}

export async function getPageRevisions(pageId: string) {
  const revisions = await db.pageRevision.findMany({
    where: { pageId },
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  return revisions;
}

export async function restoreRevision(revisionId: string) {
  const session = await getCurrentSession();
  requirePermission(session, 'revisions:restore');

  const revision = await db.pageRevision.findUnique({
    where: { id: revisionId },
    include: { page: true },
  });

  if (!revision) {
    throw new Error('Revision not found');
  }

  const snapshot = JSON.parse(revision.snapshotJson);

  // Backup current state
  await createRevisionSnapshot(revision.pageId, 'Auto-backup before restore');

  // Delete all current ContentBlocks
  await db.contentBlock.deleteMany({
    where: { pageId: revision.pageId },
  });

  // Recreate blocks from snapshot
  if (snapshot.blocks && snapshot.blocks.length > 0) {
    await db.contentBlock.createMany({
      data: snapshot.blocks.map((block: any) => ({
        pageId: revision.pageId,
        blockType: block.blockType,
        contentJson: block.contentJson,
        orderIndex: block.orderIndex,
        isVisible: block.isVisible,
        animationType: block.animationType,
        animationDuration: block.animationDuration,
        animationDelay: block.animationDelay,
      })),
    });
  }

  // Update page metadata
  await db.page.update({
    where: { id: revision.pageId },
    data: {
      title: snapshot.title,
      slug: snapshot.slug,
      status: snapshot.status,
      template: snapshot.template,
      language: snapshot.language,
      isHome: snapshot.isHome,
      seoTitle: snapshot.seoTitle,
      seoDescription: snapshot.seoDescription,
      focusKeywords: snapshot.focusKeywords,
      canonicalUrl: snapshot.canonicalUrl,
      ogTitle: snapshot.ogTitle,
      ogDescription: snapshot.ogDescription,
      ogImageUrl: snapshot.ogImageUrl,
      twitterCard: snapshot.twitterCard,
      robotsIndex: snapshot.robotsIndex,
      robotsFollow: snapshot.robotsFollow,
      schemaType: snapshot.schemaType,
      customSchemaJson: snapshot.customSchemaJson,
      publishedAt: snapshot.publishedAt ? new Date(snapshot.publishedAt) : null,
    },
  });

  revalidatePath(`/admin/pages/${revision.pageId}`);
  revalidatePath(`/admin/pages/${revision.pageId}/revisions`);

  if (snapshot.slug) {
    revalidatePath(`/${snapshot.slug === 'home' ? '' : snapshot.slug}`);
  }

  return { success: true };
}
