import { SignJWT, jwtVerify } from 'jose';

const FALLBACK_SECRET = 'konnect-secret-key-change-in-production';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || FALLBACK_SECRET;
  return new TextEncoder().encode(secret);
}

export interface PreviewTokenPayload {
  slug: string;
  pageId: string;
  purpose?: string;
  [key: string]: unknown;
}

/**
 * Creates a signed JWT preview token for draft pages, valid for 1 hour.
 *
 * @param slug - The page slug to preview
 * @param pageId - The database ID of the page
 * @returns Signed JWT string
 */
export async function generatePreviewToken(slug: string, pageId: string): Promise<string> {
  const secret = getJwtSecret();
  return new SignJWT({ slug, pageId, purpose: 'preview' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);
}

/**
 * Verifies a draft preview JWT token and extracts the slug and pageId claims.
 * Returns null if the token is invalid, expired, or was not issued for preview.
 *
 * @param token - The signed JWT preview token string
 * @returns Object with slug and pageId if valid, or null if verification fails
 */
export async function verifyPreviewToken(
  token: string
): Promise<{ slug: string; pageId: string } | null> {
  if (!token || typeof token !== 'string') {
    return null;
  }

  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);

    if (
      payload.purpose !== 'preview' ||
      typeof payload.slug !== 'string' ||
      typeof payload.pageId !== 'string'
    ) {
      return null;
    }

    return {
      slug: payload.slug,
      pageId: payload.pageId,
    };
  } catch (error) {
    return null;
  }
}
