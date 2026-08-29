import React from 'react';
import { db } from '@/lib/db';
import { getSiteSettings } from '@/actions/settings';
import { buildPageMetadata, buildJsonLdSchema } from '@/lib/seo';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import JsonLdSchema from '@/components/seo/JsonLdSchema';
import PreviewBanner from '@/components/PreviewBanner';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import { unstable_cache } from 'next/cache';
import type { Metadata } from 'next';

// ISR: Revalidate every hour, instantly purged via revalidateTag
export const revalidate = 3600;

interface DynamicPageProps {
  params: {
    slug: string[];
  };
}

async function getPageBySlug(slugPath: string, includeDrafts: boolean) {
  const whereClause: any = { slug: slugPath };
  if (!includeDrafts) {
    whereClause.status = 'PUBLISHED';
  }
  return db.page.findFirst({
    where: whereClause,
    include: {
      blocks: {
        where: includeDrafts ? undefined : { isVisible: true },
        orderBy: { orderIndex: 'asc' },
      },
    },
  });
}

function getCachedPage(slugPath: string) {
  return unstable_cache(
    async () => getPageBySlug(slugPath, false),
    [`page-${slugPath}`],
    { tags: [`page-${slugPath}`, 'pages'], revalidate: 3600 }
  )();
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const slugPath = params.slug.join('/');
  const page = await getCachedPage(slugPath);
  const settings = await getSiteSettings();

  if (!page) {
    return {
      title: 'Page Not Found | Konnect Marketing USA',
    };
  }

  // Build base metadata
  const metadata = buildPageMetadata(page, settings);

  // Add hreflang alternates if this page has locale siblings
  if (page.localeGroupId) {
    const siblings = await db.page.findMany({
      where: {
        localeGroupId: page.localeGroupId,
        status: 'PUBLISHED',
        id: { not: page.id },
      },
      select: { slug: true, language: true },
    });

    if (siblings.length > 0) {
      const languages: Record<string, string> = {};
      languages[page.language] = `/${page.slug}`;
      for (const sibling of siblings) {
        languages[sibling.language] = `/${sibling.slug}`;
      }
      (metadata as any).alternates = {
        ...(metadata as any).alternates,
        languages,
      };
    }
  }

  return metadata;
}

export default async function DynamicCatchAllPage({ params }: DynamicPageProps) {
  const slugPath = params.slug.join('/');
  const draft = await draftMode();
  const isPreview = draft.isEnabled;

  const page = isPreview
    ? await getPageBySlug(slugPath, true)
    : await getCachedPage(slugPath);

  if (!page) {
    notFound();
  }

  const settings = await getSiteSettings();
  const schema = buildJsonLdSchema(page, settings);

  return (
    <>
      {isPreview && <PreviewBanner slug={page.slug} />}
      <JsonLdSchema schema={schema} />
      <BlockRenderer blocks={page.blocks} />
    </>
  );
}
