/**
 * Utility to compress and optimize images before uploading.
 * Works natively in all modern mobile and desktop browsers using HTML5 Canvas.
 */

const MAX_DIMENSION = 1920; // 1920px is crisp on all mobile & desktop screens
const QUALITY = 0.82;       // 82% quality reduces file size by ~85-90% with zero visible loss
const MAX_ALLOWED_SIZE = 5 * 1024 * 1024; // 5 MB

export async function compressImage(file) {
  // 1. If it's not an image (or if it's an SVG/GIF), return as-is
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    if (file.size > MAX_ALLOWED_SIZE) {
      throw new Error(`"${file.name}" is over 5 MB. Please choose a smaller file.`);
    }
    return file;
  }

  // 2. If file is already under 500 KB, no heavy compression is needed
  if (file.size <= 500 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = objectUrl;

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let width = img.width;
      let height = img.height;

      // Scale down dimensions if width or height exceeds 1920px
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }

      // Draw to an off-screen canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Convert canvas back to Blob/File (JPEG at 82% quality)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return resolve(file); // Fallback to original if conversion fails
          }

          // Check if even after compression it exceeds 5 MB
          if (blob.size > MAX_ALLOWED_SIZE) {
            return reject(new Error(`"${file.name}" is too large (over 5 MB). Please choose a different photo.`));
          }

          // Create a new File object with the original name
          try {
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '.jpg'),
              { type: 'image/jpeg', lastModified: Date.now() }
            );
            resolve(compressedFile);
          } catch (e) {
            blob.name = file.name.replace(/\.[^/.]+$/, '.jpg');
            blob.lastModified = Date.now();
            resolve(blob);
          }
        },
        'image/jpeg',
        QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to process "${file.name}".`));
    };
  });
}