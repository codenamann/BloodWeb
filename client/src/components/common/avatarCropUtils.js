/**
 * Utility functions for Avatar Canvas cropping and compression
 */

export function getCroppedAvatarBlob(image, scale, pos, viewSize = 260, outputSize = 400) {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Smooth image scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Clip circular if desired or keep square with centered crop
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // View ratio
      const ratio = outputSize / viewSize;

      // Base dimension maintaining aspect ratio
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

      // Center offset + user pan
      const centerX = (outputSize - drawW) / 2 + pos.x * ratio;
      const centerY = (outputSize - drawH) / 2 + pos.y * ratio;

      ctx.drawImage(image, centerX, centerY, drawW, drawH);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob failed'));
        },
        'image/webp',
        0.9
      );
    } catch (err) {
      reject(err);
    }
  });
}
