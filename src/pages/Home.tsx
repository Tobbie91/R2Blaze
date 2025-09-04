import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Hero from '../components/hero'
import BrandStrip from '../components/brandStrip'
import Section from '../components/section'
import NewItems from '../components/newitems'
import Highlights from '../components/highlights'
import { useCatalog } from '../store/catalog'
import FullBleed from '../components/FullBleed'

export default function Home() {
  const products = useCatalog(s => s.products)      
  const featured = products.slice(0, 8)               
  const brands = Array.from(new Set(products.map(p => p.brand))).slice(0, 50)

  return (
    <div className="space-y-10">
      <FullBleed>   <Hero /></FullBleed>
   
      <Section title="Shop by brand">
        <BrandStrip brands={brands} />
      </Section>
      <Section
        title="New arrivals"
        action={<Link to="/products" className="text-emerald-700 hover:underline">View all</Link>}
      >
        <NewItems limit={8} />
      </Section>
      <Section title="Featured">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </Section>
      <Highlights />
    </div>
  )
}



