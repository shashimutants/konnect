import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('x-revalidate-secret');
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!expectedSecret || authHeader !== expectedSecret) {
    return NextResponse.json(
      { error: 'Invalid or missing revalidation secret.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { tag, path, tags } = body;

    const revalidated: string[] = [];

    if (tag) {
      revalidateTag(tag);
      revalidated.push(`tag:${tag}`);
    }

    if (tags && Array.isArray(tags)) {
      for (const t of tags) {
        revalidateTag(t);
        revalidated.push(`tag:${t}`);
      }
    }

    if (path) {
      revalidatePath(path);
      revalidated.push(`path:${path}`);
    }

    return NextResponse.json({
      revalidated: true,
      targets: revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    );
  }
}
