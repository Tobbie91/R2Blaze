import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Hero from '../components/hero'
import BrandStrip from '../components/brandStrip'
import Section from '../components/section'
import NewItems from '../components/newitems'
import Highlights from '../components/highlights'
import FullBleed from '../components/FullBleed'
import { supabase } from '../components/supabase'

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    (async () => {
      console.log('SUPABASE_URL?', import.meta.env.VITE_SUPABASE_URL)
      const { data, error } = await supabase.from('products').select('id, name').limit(3)
      console.log('test products →', { data, error })
    })()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*')
      if (error) {
        console.error('Error fetching products:', error)
      } else {
        setProducts(data ?? [])
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  // --- hooks must be called every render (no early return above this line) ---

  const normalizeBrand = (b: unknown) =>
    String(b ?? '')
      .normalize('NFKC')
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase()

  const brands = useMemo(() => {
    const seen = new Set<string>()
    const list: string[] = []
    for (const p of products) {
      const raw = typeof p.brand === 'string' ? p.brand : ''
      const norm = normalizeBrand(raw)
      if (!norm || seen.has(norm)) continue
      seen.add(norm)
      const display = raw.trim().replace(/\s+/g, ' ')
      list.push(display)
    }
    return list.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).slice(0, 50)
  }, [products])

  const featured = useMemo(() => products.slice(0, 8), [products])

  // safe to early-return now (after hooks)
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-10">
      <FullBleed>
        <Hero />
      </FullBleed>

      <Section title="Shop by brand">
  <BrandStrip brands={brands} max={10} />
</Section>


      <Section
        title="New arrivals"
        action={<Link to="/products" className="text-emerald-700 hover:underline">View all</Link>}
      >
        <NewItems limit={8} />
      </Section>

      <Section title="Featured">
        {/* <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((p: any) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div> */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
          {/* Display each product card */}
        </div>
      </Section>

      <Highlights />
    </div>
  )
}


