
import { Link } from 'react-router-dom'

export default function BrandStrip({
  brands,
  max = 12,               // control how many you show
}: { brands: string[]; max?: number }) {
  const list = brands.slice(0, max)

  return (
    <div className="relative">
      {/* fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent" />

      <div
        className="flex gap-2 overflow-x-auto px-1 -mx-1 snap-x snap-mandatory"
        style={{ scrollPaddingLeft: 8, scrollPaddingRight: 8 }}
      >
        {list.map((b) => (
          <Link
            key={b.toLowerCase().trim()} // stable key
            to={`/products?brand=${encodeURIComponent(b)}`}
            className="shrink-0 snap-start px-3 py-1.5 rounded-full border border-gray-200 text-gray-600
                       text-xs sm:text-[13px] hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800
                       transition-colors"
            aria-label={`Shop ${b}`}
            title={b}
          >
            {b}
          </Link>
        ))}
      </div>
    </div>
  )
}
