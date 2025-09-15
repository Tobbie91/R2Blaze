// src/pages/ProductDetail.tsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../components/supabase'
import { useCart } from '../store/cart'

const ngn = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

const ProductDetail: React.FC = () => {
  const { id, slug } = useParams()  // Get the product id and slug from the URL
  const { addToCart } = useCart()

  const [product, setProduct] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      // Fetch the product using either ID or slug
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .or(`slug.eq.${slug}`)
        .single()  // Since you expect a single product result

      if (error) {
        console.error('Error fetching product:', error)
      } else {
        setProduct(data)
      }
      setLoading(false)
    }

    fetchProduct()
  }, [id, slug])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!product) {
    return (
      <div>
        <p>Product not found!</p>
        <Link to="/products">Back to Products</Link>
      </div>
    )
  }

  const price = ngn.format(product.price)
  const oldPrice = product.compare_at_price ? ngn.format(product.compare_at_price) : null

  const handleAddToCart = () => {
      addToCart({
        id: product.id,
        name: product.name,
        slug: product.slug, // Ensure you add slug here
        price: product.price,
        qty: 1,
        images: product.images,
      });
      
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-[4/5]">
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-lg">{product.description}</p>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{price}</span>
            {oldPrice && (
              <span className="text-sm text-gray-500 line-through">{oldPrice}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="px-6 py-3 bg-emerald-700 text-white rounded-md"
          >
            Add to Cart
          </button>

          <Link
            to="/cart"
            className="px-6 py-3 bg-emerald-500 text-white rounded-md"
          >
            Go to Cart
          </Link>
        </div>
      </div>

      <div>
        <Link to="/products" className="text-emerald-700 hover:underline">
          ← Back to Products
        </Link>
      </div>
    </div>
  )
}

export default ProductDetail


