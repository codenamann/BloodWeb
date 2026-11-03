/**
 * Client-Side Image Optimization Utility
 * Optimizes images (profile photos, document scans) to WebP before upload.
 */

const MAX_DOC_DIMENSION = 1920; // Preserves fine print on medical docs while dropping multi-MB photos to ~200KB
const DOC_WEBP_QUALITY = 0.82;
const AVATAR_SIZE = 400;
const AVATAR_WEBP_QUALITY = 0.90;

/**
 * Loads a File/Blob into an HTMLImageElement
 */
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(new Error('Failed to load image for optimization: ' + err));
      img.src = reader.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a Canvas to a WebP (or fallback JPEG) Blob
 */
export function canvasToWebpBlob(canvas, quality = 0.85) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          // Fallback to jpeg if browser fails webp blob
          canvas.toBlob(
            (fallbackBlob) => {
              if (fallbackBlob) resolve(fallbackBlob);
              else reject(new Error('Failed to create image blob from canvas'));
            },
            'image/jpeg',
            quality
          );
        }
      },
      'image/webp',
      quality
    );
  });
}

/**
 * Optimizes a document file (PDFs pass through, images converted to optimized WebP)
 * @param {File} file
 * @param {Object} options
 * @returns {Promise<{ file: File, isOptimized: boolean, originalSize: number, finalSize: number }>}
 */
export async function optimizeDocumentFile(file, options = {}) {
  if (!file) return { file, isOptimized: false };

  // PDFs are documents, pass through untouched
  if (file.type === 'application/pdf') {
    return {
      file,
      isOptimized: false,
      originalSize: file.size,
      finalSize: file.size,
    };
  }

  // Only optimize image types
  if (!file.type.startsWith('image/')) {
    return { file, isOptimized: false, originalSize: file.size, finalSize: file.size };
  }

  try {
    const img = await loadImage(file);
    const maxDim = options.maxDimension || MAX_DOC_DIMENSION;
    const quality = options.quality || DOC_WEBP_QUALITY;

    let { width, height } = img;

    // Scale down if either dimension exceeds maxDim
    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await canvasToWebpBlob(canvas, quality);

    // Create a new File with .webp extension
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const optimizedFile = new File([blob], `${baseName}.webp`, {
      type: blob.type || 'image/webp',
      lastModified: Date.now(),
    });

    return {
      file: optimizedFile,
      isOptimized: true,
      originalSize: file.size,
      finalSize: optimizedFile.size,
    };
  } catch (err) {
    console.warn('[ImageOptimizer] Optimization failed, using original file:', err);
    return { file, isOptimized: false, originalSize: file.size, finalSize: file.size };
  }
}

/**
 * Optimizes an avatar image from user's cropped viewport
 */
export async function optimizeAvatarCrop(image, scale, pos, viewSize = 260) {
  const canvas = document.createElement('canvas');
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Failed to get canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Circular clip for clean rounded avatar
  ctx.beginPath();
  ctx.arc(AVATAR_SIZE / 2, AVATAR_SIZE / 2, AVATAR_SIZE / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  const ratio = AVATAR_SIZE / viewSize;
  const imgAspect = image.width / image.height;
  let baseW = viewSize;
  let baseH = viewSize;

  if (imgAspect > 1) {
    baseW = viewSize * imgAspect;
  } else {
    baseH = viewSize / imgAspect;
  }

  const drawW = baseW * scale * ratio;
  const drawH = baseH * scale * ratio;
  const centerX = (AVATAR_SIZE - drawW) / 2 + pos.x * ratio;
  const centerY = (AVATAR_SIZE - drawH) / 2 + pos.y * ratio;

  ctx.drawImage(image, centerX, centerY, drawW, drawH);

  return canvasToWebpBlob(canvas, AVATAR_WEBP_QUALITY);
}
