import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCatalog } from '../store/catalog';
import { useCart } from '../store/cart';  // Hook to manage cart state

const Product = () => {
  const { slug } = useParams();  // Get slug from URL
  const products = useCatalog(s => s.products);  // Fetch products from store
  const { addToCart } = useCart();  // Access the addToCart method from the cart store
  const product = products.find(p => p.slug === slug);  // Find the product by slug

  if (!product) {
    return <div>Product not found!</div>;  // Handle product not found
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],  // Assuming the first image is the main image
      qty: 1,  // Default quantity is 1
    });
  };

  return (
    <div className="product-detail grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Product Image */}
      <div className="product-image">
        {product.images?.map((image, index) => (
          <img key={index} src={image} alt={product.name} className="w-full h-auto object-cover" />
        ))}
      </div>

      {/* Product Details */}
      <div className="product-info space-y-5">
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <p className="text-lg">{product.description}</p>
        <p className="text-xl font-semibold">Price: ₦{product.price}</p>
        {product.prevPrice && (
          <p className="text-lg text-gray-400 line-through">Previous Price: ₦{product.prevPrice}</p>
        )}

        {/* Add to Cart Button */}
        <div className="space-x-4">
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
    </div>
  );
};

export default Product;




