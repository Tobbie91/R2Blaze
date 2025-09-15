import { useEffect, useState } from 'react'
import { supabase } from '../components/supabase'
import ProductCard from './ProductCard'

type Product = Record<string, any>

export default function NewItems({ limit = 8 }: { limit?: number }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) console.error('Error fetching products:', error)
      setProducts(data || [])
      setLoading(false)
    })()
  }, [limit])

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: limit }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white shadow-sm p-3 animate-pulse"
          >
            <div className="aspect-[4/5] w-full rounded-xl bg-gray-200" />
            <div className="mt-3 h-4 w-3/4 bg-gray-200 rounded" />
            <div className="mt-2 h-3 w-1/3 bg-gray-200 rounded" />
            <div className="mt-3 h-5 w-24 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  )
}
