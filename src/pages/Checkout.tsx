// import { FormEvent, useMemo, useState } from 'react'
// import { useCart } from '../store/cart'
// import BankPanel from '../components/BankPanel'
// import { buildWhatsAppOrderText, whatsappCheckoutURL } from '../utils/whatsapp'

// export default function Checkout() {
//   const { items } = useCart()
//   const [name, setName] = useState('')
//   const [phone, setPhone] = useState('')
//   const [address, setAddress] = useState('')
//   const [note, setNote] = useState('')

//   const disabled = useMemo(() => !name || !phone || !address || items.length===0, [name, phone, address, items])

//   const onSubmit = (e: FormEvent) => {
//     e.preventDefault()
//     const text = buildWhatsAppOrderText({ customer: { name, phone, address }, items, note })
//     const url = whatsappCheckoutURL(text)
//     window.open(url, '_blank')
//   }

//   if (!items.length) return <div>Your cart is empty.</div>

//   return (
//     <div className="grid md:grid-cols-3 gap-6">
//       <form onSubmit={onSubmit} className="md:col-span-2 space-y-3">
//         <h1 className="text-2xl font-semibold mb-2">Checkout</h1>
//         <div className="grid sm:grid-cols-2 gap-3">
//           <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} className="border rounded px-3 py-2" />
//           <input placeholder="Phone (WhatsApp)" value={phone} onChange={e=>setPhone(e.target.value)} className="border rounded px-3 py-2" />
//         </div>
//         <input placeholder="Delivery address" value={address} onChange={e=>setAddress(e.target.value)} className="border rounded px-3 py-2 w-full" />
//         <textarea placeholder="Order note (optional)" value={note} onChange={e=>setNote(e.target.value)} className="border rounded px-3 py-2 w-full min-h-[100px]" />

//         <BankPanel />

//         <button disabled={disabled} className={`px-4 py-2 rounded text-white ${disabled ? 'bg-gray-400' : 'bg-green-600'}`}>
//           Pay via Transfer & WhatsApp
//         </button>
//         <p className="text-xs text-gray-600">This opens WhatsApp with your order details so our team can confirm delivery.</p>
//       </form>

//       <aside className="border rounded-xl p-4 h-fit">
//         <h2 className="font-semibold mb-2">Order summary</h2>
//         <div className="space-y-2 max-h-[50vh] overflow-auto pr-2">
//           {items.map(i => (
//             <div key={i.id} className="flex justify-between text-sm">
//               <div>{i.qty} × {i.name}</div>
//               <div>₦{(i.price * i.qty).toLocaleString('en-NG')}</div>
//             </div>
//           ))}
//         </div>
//         <div className="mt-3 flex justify-between font-semibold">
//           <span>Total</span>
//           <span>₦{items.reduce((s,i)=>s+i.qty*i.price,0).toLocaleString('en-NG')}</span>
//         </div>
//       </aside>
//     </div>
//   )
// }

import  { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCatalog } from '../store/catalog'

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();  // Use navigate instead of history

  const productId = new URLSearchParams(location.search).get('productId');  // Get the product ID from the URL
  const products = useCatalog(s => s.products);  // Get products from your store

  const product = products.find(p => p.id === productId);  // Find the selected product

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    email: '',
  });

  if (!product) {
    return <div>Product not found for checkout!</div>;
  }

  const handlePlaceOrder = () => {
    // Handle order placement (you can integrate payment gateway here)
    alert('Order placed successfully!');
    // Redirect to a confirmation page or homepage
    navigate('/');
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="order-summary">
        <h3>Order Summary</h3>
        <div>
          <h4>{product.name}</h4>
          <p>{product.description}</p>
          <p>Price: ₦{product.price}</p>
        </div>
      </div>

      <div className="shipping-info">
        <h3>Shipping Information</h3>
        <input
          type="text"
          placeholder="Full Name"
          value={shippingInfo.name}
          onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Address"
          value={shippingInfo.address}
          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={shippingInfo.email}
          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
        />
      </div>

      {/* Payment information can be added here */}
      <div className="payment-info">
        <h3>Payment Information</h3>
        {/* Add your payment gateway integration here */}
      </div>

      <button onClick={handlePlaceOrder} className="place-order-button">
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
