// src/utils/cloudinary.ts
export function resolveCloudinarySrc(
    img: { secure_url?: string; public_id?: string } | string
  ): string {
    if (!img) return '/images/placeholder.webp';
  
    // If you passed a plain string in your Product.images[]
    if (typeof img === 'string') {
      // Already a full URL or data URL → use it
      if (/^https?:\/\//i.test(img) || img.startsWith('data:image/')) return img;
      // If someone accidentally stored a public_id only:
      const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dpuencehw';
      return `https://res.cloudinary.com/${cloud}/image/upload/${img}`;
    }
  
    // Object shape
    if (img.secure_url) return img.secure_url;
    if (img.public_id) {
      const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dpuencehw';
      return `https://res.cloudinary.com/${cloud}/image/upload/${img.public_id}`;
    }
    return '/images/placeholder.webp';
  }
  