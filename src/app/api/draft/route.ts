import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verifyPreviewToken } from '@/lib/preview';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const slug = request.nextUrl.searchParams.get('slug') || '';

  if (!token) {
    return NextResponse.json(
      { error: 'Missing preview token. Access denied.' },
      { status: 401 }
    );
  }

  // Verify the signed preview token
  const claims = await verifyPreviewToken(token);
  if (!claims) {
    return NextResponse.json(
      { error: 'Invalid or expired preview token. Please request a new preview link.' },
      { status: 403 }
    );
  }

  // Enable Next.js Draft Mode (sets __prerender_bypass cookie)
  const draft = await draftMode();
  draft.enable();

  // Determine redirect URL based on locale + slug
  const targetSlug = claims.slug || slug;
  const redirectUrl = targetSlug === 'home' || targetSlug === '' ? '/' : `/${targetSlug}`;

  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
