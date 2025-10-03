// src/utils/cloudinary.ts
// Small, dependency-free helpers for Cloudinary image URLs.

export type CloudinaryAsset = {
  public_id?: string
  secure_url?: string
  version?: number | string
  format?: string
  // width/height/bytes/etc are fine to keep too if you store them
}

export type TransformOpts = {
  w?: number
  h?: number
  crop?: 'fill' | 'fit' | 'thumb' | 'scale' | 'crop'
  g?: 'auto' | 'center' | 'faces'
  q?: 'auto' | number
  f?: 'auto' | 'jpg' | 'png' | 'webp' | 'avif'
  dpr?: 'auto' | number
  bg?: string            // e.g. 'white' or 'rgb:ffffff'
  r?: number | string    // radius
  raw?: string           // extra raw transformation, e.g. 'e_sharpen:50'
  version?: number | string // explicit version override (usually from asset.version)
}

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dpuencehw'
const PLACEHOLDER = '/images/placeholder.webp'

const ABSOLUTE_RE = /^(https?:)?\/\//i

function buildTransform(opts?: TransformOpts): string {
  if (!opts) return ''
  const t: string[] = []
  if (opts.crop) t.push(`c_${opts.crop}`)
  if (opts.w) t.push(`w_${opts.w}`)
  if (opts.h) t.push(`h_${opts.h}`)
  if (opts.g) t.push(`g_${opts.g}`)
  if (opts.q !== undefined) t.push(`q_${opts.q}`)
  if (opts.f) t.push(`f_${opts.f}`)
  if (opts.dpr !== undefined) t.push(`dpr_${opts.dpr}`)
  if (opts.bg) t.push(`b_${opts.bg}`)
  if (opts.r !== undefined) t.push(`r_${opts.r}`)
  if (opts.raw) t.push(opts.raw)
  return t.length ? t.join(',') + '/' : ''
}

/**
 * Build a Cloudinary URL from a public_id.
 * Example: cldUrl('product-images/foo', { w: 800, h: 800, crop: 'fill', q: 'auto', f: 'auto' })
 */
export function cldUrl(publicId: string, opts?: TransformOpts): string {
  if (!publicId) return PLACEHOLDER
  const t = buildTransform(opts)
  const v = opts?.version ? `v${opts.version}/` : ''
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${t}${v}${publicId}`
}

/**
 * Resolve any image input (string or asset object) to a Cloudinary URL.
 * If a transformation is requested, we prefer using public_id (+ version) when available.
 */
export function resolveCloudinarySrc(
  img: CloudinaryAsset | string | null | undefined,
  opts?: TransformOpts
): string {
  if (!img) return PLACEHOLDER

  // If it's already a URL or data URI, and no transform requested → use it
  if (typeof img === 'string') {
    if (ABSOLUTE_RE.test(img) || img.startsWith('data:image/')) return img
    // Otherwise treat as public_id
    return cldUrl(img, opts)
  }

  // Object input
  const { public_id, secure_url, version } = img

  // Prefer transforming via public_id (so we can apply w/h/crop/q/f/etc.)
  if (public_id) return cldUrl(public_id, { ...opts, version: opts?.version ?? version })

  // If no public_id but we have a secure_url:
  // - If no transform requested → return it
  // - If transform requested → we can’t transform without public_id, so return original
  if (secure_url) return secure_url

  return PLACEHOLDER
}

/**
 * Generate a width-based srcset for responsive images.
 * Example:
 *   const src = resolveCloudinarySrc(asset, { w: 600, h: 600, crop: 'fill', g: 'auto', q: 'auto', f: 'auto' })
 *   const srcSet = toSrcSet(asset, [320,480,768,1024], { h: 600, crop: 'fill', g: 'auto', q: 'auto', f: 'auto' })
 */
export function toSrcSet(
  img: CloudinaryAsset | string,
  widths: number[],
  baseOpts?: Omit<TransformOpts, 'w'>
): string {
  return widths
    .map((w) => `${resolveCloudinarySrc(img, { ...baseOpts, w })} ${w}w`)
    .join(', ')
}
