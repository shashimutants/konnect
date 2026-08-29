import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://konnectmarketingusa.com';

  const publishedPages = await db.page.findMany({
    where: { status: 'PUBLISHED', robotsIndex: true },
    select: {
      slug: true,
      isHome: true,
      updatedAt: true,
    },
  });

  return publishedPages.map((page) => ({
    url: `${siteUrl}/${page.isHome || page.slug === 'home' ? '' : page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: page.isHome ? 'daily' : 'weekly',
    priority: page.isHome ? 1.0 : 0.8,
  }));
}
