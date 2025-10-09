import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../store/cart";

// Optional: if you have a UUID lib, use it. Otherwise a tiny ref helper:
function makeRef(prefix = "r2b"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  images: string[];
};

const API_BASE =
  import.meta.env.VITE_R2BLAZE_API_BASE ||
  "https://r2blaze-ofphn67zr-oluwatobi-s-projects.vercel.app";

export default function Checkout() {
  const navigate = useNavigate();
  const { items } = useCart() as { items: CartItem[] };

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
  });

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalNaira = useMemo(
    () => items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 0), 0),
    [items]
  );

  if (!items?.length) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        Your cart is empty. Please add items before checking out.
      </div>
    );
  }

  // --- helpers ---
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  function validate(): string | null {
    if (!shippingInfo.name.trim()) return "Please enter your full name.";
    if (!shippingInfo.address.trim()) return "Please enter your delivery address.";
    if (!shippingInfo.email.trim() || !/^\S+@\S+\.\S+$/.test(shippingInfo.email))
      return "Please enter a valid email.";
    if (totalNaira < 100) return "Order total must be at least ₦100.";
    return null;
  }

  async function startPaystack() {
    setError(null);
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    setPlacing(true);
    try {
      const reference = makeRef("r2b");
      const payload = {
        email: shippingInfo.email.trim(),
        amountNaira: totalNaira, // server converts to kobo
        reference,
        items: items.map((it) => ({
          id: it.id,
          name: it.name,
          qty: it.qty,
          price: it.price,
        })),
        metadata: {
          customer: {
            name: shippingInfo.name.trim(),
            address: shippingInfo.address.trim(),
            email: shippingInfo.email.trim(),
            phone: shippingInfo.phone.trim(),
          },
          source: "r2blaze-web-preview",
        },
      };

      const r = await fetch(`${API_BASE}/api/paystack-init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await r.json();
      if (!r.ok) {
        throw new Error(data?.error || "Failed to initialize Paystack");
      }

      // Redirect to Paystack checkout
      window.location.href = data.authorization_url as string;
    } catch (e: any) {
      setError(e?.message || "Something went wrong starting Paystack.");
      setPlacing(false);
    }
  }

  return (
    <div className="checkout-container bg-gray-50 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold text-center text-green-600 mb-8">
        Checkout
      </h2>

      {/* Order Summary */}
      <div className="order-summary bg-white p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {item.images?.[0] && (
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">
                  ₦{item.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Qty: {item.qty}</p>
              </div>
            </div>
            <p className="font-semibold text-lg">
              ₦{(item.price * item.qty).toLocaleString()}
            </p>
          </div>
        ))}
        <div className="flex justify-between font-semibold text-lg mt-4 border-t pt-4">
          <span>Total</span>
          <span>₦{totalNaira.toLocaleString()}</span>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="shipping-info bg-white p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={shippingInfo.name}
          onChange={handleShippingChange}
          className="w-full p-4 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="text"
          name="address"
          placeholder="Street Address"
          value={shippingInfo.address}
          onChange={handleShippingChange}
          className="w-full p-4 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={shippingInfo.phone}
          onChange={handleShippingChange}
          autoComplete="tel"
          inputMode="tel"
          pattern="^[0-9+\\-\\s()]*$"
          className="w-full p-4 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={shippingInfo.email}
          onChange={handleShippingChange}
          className="w-full p-4 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      {/* Payment (Paystack only) */}
      <div className="payment-info bg-white p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-semibold mb-4">Payment Method</h3>

        {/* Hidden field if you submit to backend */}
        <input type="hidden" name="paymentMethod" value="paystack" />

        <div className="flex items-start gap-3">
          <span className="mt-1 inline-flex h-5 w-5 rounded-full border-2 border-emerald-600">
            <span className="m-[3px] inline-block h-3 w-3 rounded-full bg-emerald-600" />
          </span>
          <div>
            <p className="font-medium text-lg">Pay securely online (Paystack)</p>
            <p className="text-sm text-gray-500">
              Cards • Bank • USSD • Transfers (processed by Paystack)
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 p-3">
          {error}
        </div>
      )}

      {/* Action */}
      <div className="text-center">
        <button
          onClick={startPaystack}
          disabled={placing}
          className="w-full py-4 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none disabled:opacity-60"
        >
          {placing ? "Starting Paystack..." : "Pay Now with Paystack"}
        </button>
      </div>
    </div>
  );
}
