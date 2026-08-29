import { Metadata } from 'next';

export interface SeoPageData {
  title: string;
  slug: string;
  language?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  focusKeywords?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
  twitterCard?: string | null;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  schemaType?: string | null;
  customSchemaJson?: string | null;
}

export interface SiteSettingsMap {
  [key: string]: string;
}

/**
 * Generate Next.js dynamic metadata for any page from database fields
 */
export function buildPageMetadata(
  page: SeoPageData,
  settings: SiteSettingsMap = {}
): Metadata {
  const siteName = settings.site_name || 'Konnect Marketing USA';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://konnectmarketingusa.com';
  
  const title = page.seoTitle || page.title ? `${page.seoTitle || page.title} | ${siteName}` : siteName;
  const description = page.seoDescription || settings.site_tagline || 'One partner. Every channel. Every state.';
  const canonical = page.canonicalUrl || `${siteUrl}/${page.slug === 'home' || page.slug === '' ? '' : page.slug}`;
  const ogImage = page.ogImageUrl || '/images/bg-01-free-img.jpg';
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return {
    title,
    description,
    keywords: page.focusKeywords ? page.focusKeywords.split(',').map((k) => k.trim()) : undefined,
    alternates: {
      canonical,
      languages: {
        [page.language || 'en-US']: canonical,
      },
    },
    robots: {
      index: page.robotsIndex !== false,
      follow: page.robotsFollow !== false,
    },
    openGraph: {
      title: page.ogTitle || title,
      description: page.ogDescription || description,
      url: canonical,
      siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
      type: 'website',
      locale: page.language || 'en_US',
    },
    twitter: {
      card: (page.twitterCard as 'summary_large_image' | 'summary') || 'summary_large_image',
      title: page.ogTitle || title,
      description: page.ogDescription || description,
      images: [ogImageUrl],
    },
  };
}

/**
 * Generate Structured JSON-LD Data for SEO
 */
export function buildJsonLdSchema(
  page: SeoPageData,
  settings: SiteSettingsMap = {}
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://konnectmarketingusa.com';
  const canonical = page.canonicalUrl || `${siteUrl}/${page.slug === 'home' || page.slug === '' ? '' : page.slug}`;

  // If user provided a custom JSON-LD schema override in CMS
  if (page.customSchemaJson) {
    try {
      return JSON.parse(page.customSchemaJson);
    } catch (e) {
      console.error('Invalid custom JSON-LD schema on page:', page.slug);
    }
  }

  // Base Organization schema
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'MarketingAgency',
    name: settings.site_name || 'Konnect Marketing USA',
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    telephone: settings.contact_phone || '929-242-6868',
    email: settings.contact_email || 'contact@konnectmarketingusa.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'New York',
      addressRegion: 'NY',
      addressCountry: 'US',
    },
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      ...(page.slug && page.slug !== 'home'
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: page.title,
              item: canonical,
            },
          ]
        : []),
    ],
  };

  // Page specific schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': page.schemaType || 'WebPage',
    name: page.title,
    description: page.seoDescription || settings.site_tagline,
    url: canonical,
    inLanguage: page.language || 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: settings.site_name || 'Konnect Marketing USA',
      url: siteUrl,
    },
  };

  return [orgSchema, webPageSchema, breadcrumbSchema];
}
