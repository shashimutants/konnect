import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();

  const returnUrl = request.nextUrl.searchParams.get('returnUrl') || '/';
  return NextResponse.redirect(new URL(returnUrl, request.url));
}
