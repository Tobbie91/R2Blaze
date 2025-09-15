// Product.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../components/supabase';
import { useCart } from '../store/cart';

const Product = () => {
  const { id } = useParams();  // Get the id from the URL
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)  // Match the product by ID
        .single();  // Fetch a single result

      if (error) {
        console.error('Error fetching product:', error);
      } else {
        setProduct(data);  // Set the product data if no error
      }

      setLoading(false);
    };

    fetchProduct();  // Fetch the product when component mounts
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found!</div>;  // Handle case when no product is found
  }

  const price = Number(product.price);
  const ngn = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' });

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug, // Ensure you add slug here
      price: product.price,
      qty: 1,
      images: product.images,
    });
    
  };

  return (
    <div className="product-detail grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Product Image Grid */}
      <div className="product-image grid grid-cols-2 gap-4">
        {product.images?.map((image: string, index: number) => (
          <img
            key={index}
            src={image}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        ))}
      </div>

      {/* Product Details */}
      <div className="product-info space-y-5">
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <p className="text-lg">{product.description}</p>
        <p className="text-xl font-semibold">Price: {ngn.format(price)}</p>
        {product.prev_price && (
          <p className="text-lg text-gray-400 line-through">Previous Price: {ngn.format(product.prev_price)}</p>
        )}

        <div className="space-x-4">
          <button onClick={handleAddToCart} className="px-6 py-3 bg-emerald-700 text-white rounded-md">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;

