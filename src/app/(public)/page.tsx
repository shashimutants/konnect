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

// ISR: Revalidate every hour, but can be instantly purged via revalidateTag
export const revalidate = 3600;

async function getHomePage(includeDrafts: boolean) {
  const whereClause: any = { isHome: true };
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

const getCachedHomePage = unstable_cache(
  async () => getHomePage(false),
  ['home-page'],
  { tags: ['page-home', 'pages'], revalidate: 3600 }
);

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCachedHomePage();
  const settings = await getSiteSettings();

  if (!page) {
    return {
      title: 'Konnect Marketing USA',
      description: 'One partner. Every channel. Every state.',
    };
  }

  return buildPageMetadata(page, settings);
}

export default async function HomePage() {
  const draft = await draftMode();
  const isPreview = draft.isEnabled;

  const page = isPreview
    ? await getHomePage(true)
    : await getCachedHomePage();

  if (!page) {
    notFound();
  }

  const settings = await getSiteSettings();
  const schema = buildJsonLdSchema(page, settings);

  return (
    <>
      {isPreview && <PreviewBanner slug="" />}
      <JsonLdSchema schema={schema} />
      <BlockRenderer blocks={page.blocks} />
    </>
  );
}
