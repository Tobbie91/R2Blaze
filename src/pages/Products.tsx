import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../components/supabase'
import ProductCard from '../components/ProductCard'

type ProductRow = {
  id: string
  slug: string
  name: string
  brand: string
  strap: 'metal'|'leather'|'rubber'|'silicon'|'fabric'
  price: number
  prev_price?: number | null
  images: string[] | null
  description?: string | null
}

export default function Products() {
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useSearchParams()

  const [q, setQ] = useState(() => params.get('q') ?? '')
  const brandParam = params.get('brand') ?? ''
  const [visible, setVisible] = useState(12)

  useEffect(() => { setVisible(12) }, [q, brandParam])

  useEffect(() => {
    (async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('id, slug, name, brand, strap, price, prev_price, images, description')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase fetch error:', error)
        setProducts([])
      } else {
        // normalize: make sure images is always an array
        const normalized = (data ?? []).map(p => ({
          ...p,
          images: Array.isArray(p.images) ? p.images : [],
        })) as ProductRow[]
        setProducts(normalized)
      }
      setLoading(false)
    })()
  }, [])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return products.filter(p => {
      const byBrand = brandParam ? p.brand?.toLowerCase() === brandParam.toLowerCase() : true
      const byText = !term || p.name?.toLowerCase().includes(term) || p.brand?.toLowerCase().includes(term)
      return byBrand && byText
    })
  }, [products, q, brandParam])

  const show = filtered.slice(0, visible)
  const brands = useMemo(
    () => Array.from(new Set(products.map(p => p.brand).filter(Boolean))).sort(),
    [products]
  )

  if (loading) return <div>Loading…</div>

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">All Products</h1>
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            const next = new URLSearchParams(params)
            if (e.target.value) next.set('q', e.target.value); else next.delete('q')
            setParams(next, { replace: true })
          }}
          placeholder="Search by name or brand…"
          className="border rounded px-3 py-2 w-full sm:w-[280px]"
        />
      </div>

      <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
        <Link
          to="/products"
          className={`inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm ${
            !brandParam ? 'bg-emerald-700 text-white border-emerald-700' : 'hover:border-black'
          }`}
        >
          All brands
        </Link>
        {brands.map(b => (
          <Link
            key={b}
            to={`/products?brand=${encodeURIComponent(b)}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
            className={`inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm ${
              brandParam.toLowerCase() === b.toLowerCase()
                ? 'bg-emerald-700 text-white border-emerald-700'
                : 'hover:border-black'
            }`}
          >
            {b}
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {show.map(p => (
          <ProductCard
            key={p.id}
            p={{
              ...p,
              // if your ProductCard expects prevPrice (camelCase)
              prevPrice: p.prev_price ?? undefined,
            } as any}
          />
        ))}
      </div>

      {!filtered.length && (
        <div className="text-center text-gray-600 py-10">No products match your search.</div>
      )}

      {visible < filtered.length && (
        <div className="flex justify-center">
          <button className="px-4 py-2 rounded-md border hover:bg-gray-50" onClick={() => setVisible(v => v + 12)}>
            View more
          </button>
        </div>
      )}
    </div>
  )
}
