import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export const PageFormSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  slug: z.string().min(1, 'Slug is required.').regex(/^[a-z0-9-_]+$/, 'Slug must only contain lowercase alphanumeric characters, dashes, or underscores.'),
  template: z.string().default('default'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).default('DRAFT'),
  language: z.string().default('en-US'),
  isHome: z.boolean().default(false),
  
  // SEO & Social
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  focusKeywords: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
  ogTitle: z.string().optional().nullable(),
  ogDescription: z.string().optional().nullable(),
  ogImageUrl: z.string().optional().nullable(),
  twitterCard: z.string().default('summary_large_image'),
  robotsIndex: z.boolean().default(true),
  robotsFollow: z.boolean().default(true),
  schemaType: z.string().default('WebPage'),
  customSchemaJson: z.string().optional().nullable(),
});

export const ContentBlockSchema = z.object({
  id: z.string().optional(),
  pageId: z.string(),
  blockType: z.string().min(1, 'Block type is required.'),
  orderIndex: z.number().int().default(0),
  contentJson: z.string().min(2, 'Block content must be valid JSON.'),
  isVisible: z.boolean().default(true),
  animationType: z.string().optional().nullable(),
  animationDuration: z.string().optional().nullable(),
  animationDelay: z.number().optional().nullable(),
});

export const MenuItemSchema = z.object({
  id: z.string().optional(),
  menuId: z.string(),
  parentId: z.string().optional().nullable(),
  title: z.string().min(1, 'Menu title is required.'),
  url: z.string().min(1, 'Menu URL is required.'),
  icon: z.string().optional().nullable(),
  badge: z.string().optional().nullable(),
  orderIndex: z.number().int().default(0),
});

export const SiteSettingsSchema = z.record(z.string());
