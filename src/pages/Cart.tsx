import { Link } from 'react-router-dom';
import { useCart } from '../store/cart';  // Hook for managing cart items
import { NGN } from '../utils/money';

export default function Cart() {
  const { items, updateQty, remove } = useCart();  // Get cart items and methods from the store
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);  // Calculate total price

  const handleProceedToCheckout = () => {
    // Save the cart items to localStorage before navigating to the checkout page
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  if (!items.length) {
    return (
      <div className="text-center">
        <p>Your cart is empty.</p>
        <Link to="/products" className="mt-4 inline-block px-4 py-2 rounded bg-green-600 text-white">
          Shop products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-3">
        {items.map((i) => (
          <div key={i.id} className="flex gap-3 items-center border rounded-xl p-3">
            <img src={i.images[0]} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <div className="font-medium">{i.name}</div>
              <div className="text-sm text-gray-600">{NGN.format(i.price)}</div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={i.qty}
                  onChange={(e) => updateQty(i.id, Math.max(1, Number(e.target.value)))}
                  className="w-20 border rounded px-2 py-1"
                />
                <button className="text-red-600 text-sm" onClick={() => remove(i.id)}>
                  Remove
                </button>
              </div>
            </div>
            <div className="font-semibold">{NGN.format(i.price * i.qty)}</div>
          </div>
        ))}
      </div>

      <aside className="border rounded-xl p-4 h-fit">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span className="font-semibold">{NGN.format(total)}</span>
        </div>
        <Link
          to="/checkout"
          onClick={handleProceedToCheckout}  // Handle storing cart items in localStorage
          className="mt-3 block text-center px-4 py-2 rounded bg-green-600 text-white"
        >
          Proceed to Checkout
        </Link>
      </aside>
    </div>
  );
}
