import { useState, useEffect } from 'react'
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
  const [products, setProducts] = useState<any[]>([]);  // State to store products
  const [loading, setLoading] = useState<boolean>(true);  // Loading state

  useEffect(() => {
    (async () => {
      console.log('SUPABASE_URL?', import.meta.env.VITE_SUPABASE_URL)
      const { data, error } = await supabase.from('products').select('id, name').limit(3)
      console.log('test products →', { data, error })
    })()
  }, [])
  
  useEffect(() => {
    // Fetch products from Supabase when the component mounts
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')  // Reference the 'products' table in Supabase
        .select('*');  // Fetch all columns

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data);  // Set products to state
      }
      setLoading(false);  // Set loading to false after data is fetched
    };

    fetchProducts();  // Call the function to fetch products
  }, []);

  // Show loading state while fetching
  if (loading) {
    return <div>Loading...</div>;
  }

  const featured = products.slice(0, 8);  // Select the first 8 products
  const brands = Array.from(new Set(products.map((p: any) => p.brand))).slice(0, 50);  // Extract unique brands

  return (
    <div className="space-y-10">
      <FullBleed>   
        <Hero />
      </FullBleed>
   
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
        {/* <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((p: any) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div> */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />  // Display each product card
        ))}
      </div>
      </Section>
      <Highlights />
    </div>
  )
}




