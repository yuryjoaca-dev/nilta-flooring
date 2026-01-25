// src/utils/cloudinary.js

/**
 * Optimizes a Cloudinary image URL with transformations for faster loading
 * - Auto-format: converts to WebP/AVIF when supported
 * - Auto quality: reduces file size intelligently
 * - Resizes images to reasonable dimensions
 * - Adds progressive loading
 *
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - Transformation options
 * @returns {string} Optimized URL
 */
export function optimizeCloudinaryUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return url;

  // Only optimize Cloudinary URLs
  if (!url.includes('cloudinary.com')) return url;

  const {
    width = 800,           // Default max width for product images
    quality = 'auto:good', // Auto quality (good balance)
    format = 'auto',       // Auto format (WebP/AVIF when supported)
    crop = 'limit',        // Don't upscale, only downscale if needed
    fetchFormat = 'auto',  // Additional format optimization
  } = options;

  // Build transformation string
  const transformations = [
    `w_${width}`,
    `q_${quality}`,
    `f_${format}`,
    `c_${crop}`,
    'fl_progressive',      // Progressive loading
    'dpr_auto',            // Auto device pixel ratio
  ].join(',');

  // Insert transformations into Cloudinary URL
  // Cloudinary URLs look like: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{path}
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    // Check if there are already transformations
    const existingTransformations = parts[1].split('/')[0];
    if (existingTransformations && !existingTransformations.includes('.')) {
      // Already has transformations, replace them
      const pathParts = parts[1].split('/');
      pathParts[0] = transformations;
      return `${parts[0]}/upload/${pathParts.join('/')}`;
    } else {
      // No transformations, add them
      return `${parts[0]}/upload/${transformations}/${parts[1]}`;
    }
  }

  // If URL format is unexpected, return original
  return url;
}

/**
 * Get optimized thumbnail (smaller size for grid views)
 */
export function getCloudinaryThumbnail(url) {
  return optimizeCloudinaryUrl(url, {
    width: 400,
    quality: 'auto:good',
  });
}

/**
 * Get optimized image for detail view (larger size)
 */
export function getCloudinaryDetailImage(url) {
  return optimizeCloudinaryUrl(url, {
    width: 1200,
    quality: 'auto:best',
  });
}
