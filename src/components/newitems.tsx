import { useCatalog } from '../store/catalog'
import ProductCard from './ProductCard'

type NewItemsProps = {
  limit: number
}

export default function NewItems({ limit }: NewItemsProps) {
  const products = useCatalog(s => s.products)

  // Get the most recent products, sorted by the most recent added
  const newArrivals = products.slice(0, limit)

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {newArrivals.map(p => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  )
}
