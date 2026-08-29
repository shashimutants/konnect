import { v2 as cloudinary } from 'cloudinary';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export interface CloudinaryUploadResult {
  publicId: string;
  secureUrl: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  format: string;
  size: number;
  width: number;
  height: number;
  isLocal?: boolean;
}

/**
 * Resolve Cloudinary credentials from DB SiteSettings first, then .env
 */
export async function getCloudinaryCredentials() {
  try {
    const settings = await db.siteSetting.findMany({
      where: {
        key: {
          in: [
            'cloudinary_cloud_name',
            'cloudinary_api_key',
            'cloudinary_api_secret',
            'cloudinary_upload_preset',
          ],
        },
      },
    });

    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }

    const cloudName = map['cloudinary_cloud_name'] || process.env.CLOUDINARY_CLOUD_NAME || '';
    const apiKey = map['cloudinary_api_key'] || process.env.CLOUDINARY_API_KEY || '';
    const apiSecret = map['cloudinary_api_secret'] || process.env.CLOUDINARY_API_SECRET || '';

    const isConfigured =
      Boolean(cloudName && apiKey && apiSecret) &&
      apiKey !== 'your_api_key' &&
      apiSecret !== 'your_api_secret' &&
      !apiKey.startsWith('your_');

    return {
      cloudName,
      apiKey,
      apiSecret,
      isConfigured,
    };
  } catch (err) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
    const apiKey = process.env.CLOUDINARY_API_KEY || '';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || '';
    const isConfigured =
      Boolean(cloudName && apiKey && apiSecret) &&
      apiKey !== 'your_api_key' &&
      apiSecret !== 'your_api_secret' &&
      !apiKey.startsWith('your_');

    return {
      cloudName,
      apiKey,
      apiSecret,
      isConfigured,
    };
  }
}

/**
 * Upload a file buffer. If Cloudinary credentials are valid, uploads to Cloudinary.
 * Otherwise, seamlessly stores locally in public/uploads/ so media uploads always work!
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = 'konnect',
  originalFilename: string = 'upload.jpg'
): Promise<CloudinaryUploadResult> {
  const config = await getCloudinaryCredentials();

  if (config.isConfigured) {
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
      secure: true,
    });

    try {
      return await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
            eager: [
              { width: 300, height: 200, crop: 'fill', quality: 'auto', format: 'auto' },
              { width: 800, crop: 'limit', quality: 'auto', format: 'auto' },
            ],
            eager_async: false,
          },
          (error, result) => {
            if (error || !result) {
              return reject(error || new Error('Cloudinary upload failed.'));
            }
            resolve({
              publicId: result.public_id,
              secureUrl: result.secure_url,
              thumbnailUrl: result.eager?.[0]?.secure_url || result.secure_url,
              mediumUrl: result.eager?.[1]?.secure_url || result.secure_url,
              format: result.format || 'jpg',
              size: result.bytes,
              width: result.width,
              height: result.height,
              isLocal: false,
            });
          }
        );

        uploadStream.end(fileBuffer);
      });
    } catch (cloudErr: any) {
      console.warn('Cloudinary upload failed, falling back to local storage:', cloudErr.message);
    }
  }

  // Fallback to local storage (in public/uploads/)
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const ext = path.extname(originalFilename) || '.jpg';
  const cleanBase = path.basename(originalFilename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const uniqueName = `${cleanBase}_${Date.now()}${ext}`;
  const filePath = path.join(uploadsDir, uniqueName);

  await fs.promises.writeFile(filePath, fileBuffer);

  const localUrl = `/uploads/${uniqueName}`;

  return {
    publicId: `local_${uniqueName}`,
    secureUrl: localUrl,
    thumbnailUrl: localUrl,
    mediumUrl: localUrl,
    format: ext.replace('.', '') || 'jpg',
    size: fileBuffer.length,
    width: 1200,
    height: 800,
    isLocal: true,
  };
}

/**
 * Generate an auto-optimized Cloudinary image delivery URL with auto format and quality
 */
export function getOptimizedImageUrl(
  publicIdOrUrl: string,
  options: { width?: number; height?: number; crop?: string; quality?: string } = {}
): string {
  if (!publicIdOrUrl) return '';
  if (publicIdOrUrl.startsWith('/uploads/') || publicIdOrUrl.startsWith('local_')) {
    return publicIdOrUrl.startsWith('local_') ? `/uploads/${publicIdOrUrl.replace('local_', '')}` : publicIdOrUrl;
  }
  if (publicIdOrUrl.startsWith('http') && !publicIdOrUrl.includes('res.cloudinary.com')) {
    return publicIdOrUrl;
  }

  const publicId = publicIdOrUrl.includes('res.cloudinary.com')
    ? publicIdOrUrl.substring(publicIdOrUrl.lastIndexOf('/') + 1)
    : publicIdOrUrl;

  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: options.quality || 'auto',
    width: options.width,
    height: options.height,
    crop: options.crop || 'fill',
    secure: true,
  });
}

export { cloudinary };
