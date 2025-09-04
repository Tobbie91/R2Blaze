import { Link } from 'react-router-dom'
import type { Product } from '../store/catalog' // Use the store’s Product type
import { NGN } from '../utils/money'

// Function to create image URL with optimization options (Cloudinary)
const thumb = (url: string, w = 800) =>
  url?.includes('/upload/') ? url.replace('/upload/', `/upload/f_auto,q_auto,w_${w}/`) : url

export default function ProductCard({ p }: { p: Product }) {
  const img = p.images?.[0] ?? '/images/placeholder.webp'  // Default image if no product image
  return (
    <div className="group border rounded-xl overflow-hidden bg-white">
      <Link to={`/products/${p.slug}`}>
        <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
          <img
            src={thumb(img)}  // Optimized image URL
            alt={p.name || 'Product Image'}  // Alt text for accessibility
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        </div>
        <div className="p-3">
          <div className="text-sm text-gray-500">{p.brand}</div>
          <div className="font-medium">{p.name}</div>
          <div className="mt-1">
            <span className="font-semibold">{NGN.format(p.price)}</span> {/* Display product price */}
            {p.prevPrice && (
              <span className="ml-2 text-gray-400 line-through">
                {NGN.format(p.prevPrice)}  {/* Display previous price with strikethrough */}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
