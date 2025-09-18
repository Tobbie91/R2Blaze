import { useEffect, useState } from 'react'
import { supabase } from '../components/supabase'

// 1) Type your rows (adjust to match your table exactly)
type Product = {
  id: string;   // or number, depending on your schema
  name: string;
  // price?: number;
  // image_url?: string;
};

export default function AdminProducts() {
  // 2) Give state an explicit type
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Fetch products from Supabase
  useEffect(() => {
    (async () => {
      try {
        // 3) Be explicit with selected columns (helps typing)
        const { data, error } = await supabase
          .from('products')
          .select('id,name')

        if (error) throw error
        setProducts(data ?? []) // data is Product[] | null
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to fetch products'
        setErrorMsg(msg)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Delete a product
  const deleteProduct = async (id: Product['id']) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      setErrorMsg(error.message)
      return
    }
    // 4) prev is Product[], so product has id/name types
    setProducts(prev => prev.filter(product => product.id !== id))
  }

  if (loading) return <p>Loading...</p>
  if (errorMsg) return <p className="text-red-600">{errorMsg}</p>

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name}{' '}
            <button onClick={() => deleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
