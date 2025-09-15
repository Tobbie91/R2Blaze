// src/components/ProductCard.tsx
import React from 'react'
import { Link } from 'react-router-dom'

const ngn = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

const toNumber = (v: any) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

const getImageList = (images: any): string[] => {
  if (Array.isArray(images)) return images
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images)
      if (Array.isArray(parsed)) return parsed
    } catch {
      if (images.startsWith('http')) return [images]
    }
  }
  return []
}

const firstOr = (arr: string[], fallback = '') => (arr && arr.length ? arr[0] : fallback)

const clampStyles: React.CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}

const ProductCard = ({ p }: { p: any }) => {
  const imgs = getImageList(p.images)
  const img = firstOr(imgs, '')
  const brand = p.brand || ''
  const name = p.name || ''

  const price = toNumber(p.price)
  const old =
    Math.max(
      toNumber(p.compare_at_price),
      toNumber(p.oldPrice),
      toNumber(p.formerPrice),
      toNumber(p.msrp),
    ) || 0

  const hasOld = old > 0 && price > 0 && old > price
  const discount = hasOld ? Math.round(((old - price) / old) * 100) : 0

  // Ensure each product links to its detailed page using p.slug
  const productSlug = p.slug ? p.slug.replace(/\s+/g, '-').toLowerCase() : '' // Using slug from p

  return (
   
    <Link to={`/products/${p.id}`}  // Link to product detail page
      className="group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Product Image */}
      <div className="relative">
        <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100">
          {img ? (
            <img
              src={img}
              alt={name || brand || 'Product'}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
              No image
            </div>
          )}
        </div>

        {hasOld && (
          <div className="absolute left-2 top-2 rounded-full bg-red-600/90 px-2.5 py-1 text-[11px] font-bold text-white">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        {brand && (
          <div className="text-[11px] uppercase tracking-wide text-gray-500">
            {brand}
          </div>
        )}

        <h3
          className="mt-1 text-sm md:text-base font-medium text-gray-900 leading-snug"
          style={clampStyles}
          title={name}
        >
          {name}
        </h3>

        {/* Price row */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-semibold">
            {price > 0 ? ngn.format(price) : '—'}
          </span>
          {hasOld && (
            <span className="text-sm text-gray-500 line-through">
              {ngn.format(old)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
