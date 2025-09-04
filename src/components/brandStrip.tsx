import { Link } from 'react-router-dom'

export default function BrandStrip({ brands }: { brands: string[] }) {
    const top8 = brands.slice(0, 8)
  return (
<div className="w-full">
  <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
    {top8.map((b) => (
      <Link
        key={b}
        to={`/products?brand=${encodeURIComponent(b)}`}
        className="block w-full text-center px-3 py-2 rounded-full border text-sm hover:border-black"
      >
        {b}
      </Link>
    ))}
  </div>
</div>
  
  
  )
}
