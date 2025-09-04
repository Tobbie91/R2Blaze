import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCatalog } from '../store/catalog'

const ProductDetail = () => {
  const { slug } = useParams();  // Get the product slug from the URL
  const products = useCatalog(s => s.products);  // Get products from the store
  const product = products.find(p => p.slug === slug);  // Find the product by slug
  
  const navigate = useNavigate();  // Use navigate instead of history

  if (!product) {
    return <div>Product not found!</div>;  // Handle product not found
  }

  const handleCheckout = () => {
    // Navigate to the checkout page with the selected product's details
    navigate(`/checkout?productId=${product.id}`);
  }

  return (
    <div className="product-detail">
      <div className="product-images">
        {product.images.map((image, index) => (
          <img key={index} src={image} alt={product.name} className="product-image" />
        ))}
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>Price: ₦{product.price}</p>
        
        {/* Checkout button */}
        <button onClick={handleCheckout} className="checkout-button">
          Checkout
        </button>
      </div>
    </div>
  )
}

export default ProductDetail;

