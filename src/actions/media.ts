'use server';

import { db } from '@/lib/db';
import { uploadToCloudinary, cloudinary } from '@/lib/cloudinary';
import { getCurrentSession } from '@/lib/auth';
import { requirePermission } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

export async function getMediaGallery(search?: string, folder?: string) {
  const whereClause: any = {};

  if (search) {
    whereClause.OR = [
      { filename: { contains: search } },
      { altText: { contains: search } },
      { caption: { contains: search } },
    ];
  }

  if (folder && folder !== 'all') {
    whereClause.folder = folder;
  }

  return db.media.findMany({
    where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      uploadedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export const getMediaLibrary = getMediaGallery;

export async function uploadMediaAction(formData: FormData) {
  const session = await getCurrentSession();
  if (!session) return { error: 'Unauthorized.' };

  const file = formData.get('file') as File;
  const altText = (formData.get('altText') as string) || '';
  const caption = (formData.get('caption') as string) || '';
  const folder = (formData.get('folder') as string) || 'general';

  if (!file || file.size === 0) {
    return { error: 'Please select a valid image file.' };
  }

  // Max 10MB file size limit
  if (file.size > 10 * 1024 * 1024) {
    return { error: 'Image file must be under 10MB.' };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await uploadToCloudinary(
      buffer,
      folder ? `konnect_cms/${folder}` : 'konnect_cms',
      file.name
    );

    const uploadedById = session.userId || null;
    const mimeType = file.type || (uploadResult.format ? `image/${uploadResult.format}` : 'image/jpeg');

    const mediaRecord = await db.media.create({
      data: {
        publicId: uploadResult.publicId,
        url: uploadResult.secureUrl,
        thumbnailUrl: uploadResult.thumbnailUrl || null,
        mediumUrl: uploadResult.mediumUrl || null,
        filename: file.name,
        format: uploadResult.format,
        mimeType,
        size: uploadResult.size,
        width: uploadResult.width,
        height: uploadResult.height,
        altText,
        caption,
        folder,
        uploadedById,
      },
    });

    revalidatePath('/admin/media');
    return { success: true, media: mediaRecord };
  } catch (err: any) {
    console.error('Media upload error:', err);
    return { error: err.message || 'Failed to upload image.' };
  }
}

export async function deleteMediaAction(id: string) {
  const session = await getCurrentSession();
  if (!session) return { error: 'Unauthorized.' };

  requirePermission(session, 'media:delete');

  const media = await db.media.findUnique({ where: { id } });
  if (!media) return { error: 'Media not found.' };

  try {
    if (media.publicId.startsWith('local_')) {
      const filename = media.publicId.replace('local_', '');
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } else {
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(media.publicId);
    }
  } catch (e) {
    console.warn('Could not remove physical asset, removing DB record anyway.');
  }

  await db.media.delete({ where: { id } });
  revalidatePath('/admin/media');
  return { success: true };
}
