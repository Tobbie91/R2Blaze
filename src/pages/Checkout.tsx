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
  price: number; // in Naira
  qty: number;
  images: string[];
  // optional: slug, color, size, etc...
};

const API_BASE =
  import.meta.env.VITE_R2BLAZE_API_BASE ||
  "https://r2blaze-kywfiom78-oluwatobi-s-projects.vercel.app"; // fallback to your preview (test mode)

export default function Checkout() {
  const navigate = useNavigate();
  const { items } = useCart() as { items: CartItem[] };

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    email: "",
  });

  // "paystack" | "whatsapp" | "bankTransfer"
  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "whatsapp" | "bankTransfer">("paystack");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalNaira = useMemo(
    () => items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 0), 0),
    [items]
  );

  if (!items?.length) {
    return <div className="max-w-3xl mx-auto p-6">Your cart is empty. Please add items before checking out.</div>;
  }

  // --- helpers ---
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  function validate(): string | null {
    if (!shippingInfo.name.trim()) return "Please enter your full name.";
    if (!shippingInfo.address.trim()) return "Please enter your delivery address.";
    if (!shippingInfo.email.trim() || !/^\S+@\S+\.\S+$/.test(shippingInfo.email)) return "Please enter a valid email.";
    if (totalNaira < 100) return "Order total must be at least ₦100.";
    return null;
  }

  async function startPaystack() {
    setError(null);
    const problem = validate();
    if (problem) { setError(problem); return; }

    setPlacing(true);
    try {
      const reference = makeRef("r2b");
      // keep payload tidy; send a compact items list + customer meta
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

      // redirect to Paystack checkout
      window.location.href = data.authorization_url as string;
    } catch (e: any) {
      setError(e?.message || "Something went wrong starting Paystack.");
      setPlacing(false);
    }
  }

  function startWhatsApp() {
    setError(null);
    const problem = validate();
    if (problem) { setError(problem); return; }

    const orderLines = items
      .map((it) => `• ${it.name} — Qty ${it.qty} — ₦${(it.price * it.qty).toLocaleString()}`)
      .join("\n");

    const message = `
*Customer Details*
Name: ${shippingInfo.name}
Address: ${shippingInfo.address}
Email: ${shippingInfo.email}

*Order Details*
${orderLines}

Total: ₦${totalNaira.toLocaleString()}
Payment Method: WhatsApp
    `.trim();

    const encoded = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/2347018239270?text=${encoded}`;
    window.open(whatsappLink, "_blank");
    navigate("/order-confirmation", {
      state: {
        order: {
          items,
          shippingInfo,
          paymentMethod: "whatsapp",
        },
      },
    });
  }

  return (
    <div className="checkout-container bg-gray-50 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold text-center text-green-600 mb-8">Checkout</h2>

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
                <p className="text-sm text-gray-600">₦{item.price.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Qty: {item.qty}</p>
              </div>
            </div>
            <p className="font-semibold text-lg">₦{(item.price * item.qty).toLocaleString()}</p>
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
          type="email"
          name="email"
          placeholder="Email Address"
          value={shippingInfo.email}
          onChange={handleShippingChange}
          className="w-full p-4 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      {/* Payment Method */}
      <div className="payment-info bg-white p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-semibold mb-4">Payment Method</h3>

        <div className="space-y-2">
          <label className="block font-medium text-lg">
            <input
              type="radio"
              name="paymentMethod"
              value="paystack"
              checked={paymentMethod === "paystack"}
              onChange={() => setPaymentMethod("paystack")}
              className="mr-2"
            />
            Pay securely online (Paystack)
          </label>

          <label className="block font-medium text-lg">
            <input
              type="radio"
              name="paymentMethod"
              value="whatsapp"
              checked={paymentMethod === "whatsapp"}
              onChange={() => setPaymentMethod("whatsapp")}
              className="mr-2"
            />
            Pay via WhatsApp
          </label>

          <label className="block font-medium text-lg">
            <input
              type="radio"
              name="paymentMethod"
              value="bankTransfer"
              checked={paymentMethod === "bankTransfer"}
              onChange={() => setPaymentMethod("bankTransfer")}
              className="mr-2"
            />
            Bank Transfer
          </label>
        </div>

        {paymentMethod === "bankTransfer" && (
          <div className="bank-transfer mt-4 rounded-md border p-4">
            <h4 className="font-semibold text-lg mb-2">Bank Details</h4>
            <p>Bank Name: Stanbic Bank</p>
            <p>Account Name: Odeode Emmanuel Gbenga</p>
            <p>Account Number: 0034591441</p>
            <p className="text-sm text-gray-500 mt-2">
              After transfer, please send proof of payment to our WhatsApp so we can confirm and ship.
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 p-3">
          {error}
        </div>
      )}

      {/* Action Button */}
      <div className="text-center">
        {paymentMethod === "paystack" ? (
          <button
            onClick={startPaystack}
            disabled={placing}
            className="w-full py-4 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none disabled:opacity-60"
          >
            {placing ? "Starting Paystack..." : "Pay Now with Paystack"}
          </button>
        ) : paymentMethod === "whatsapp" ? (
          <button
            onClick={startWhatsApp}
            className="w-full py-4 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none"
          >
            Proceed via WhatsApp
          </button>
        ) : (
          <button
            onClick={() => navigate("/order-confirmation", {
              state: {
                order: {
                  items,
                  shippingInfo,
                  paymentMethod: "bankTransfer",
                },
              },
            })}
            className="w-full py-4 text-white bg-slate-700 rounded-lg hover:bg-slate-800 focus:outline-none"
          >
            Place Order (Bank Transfer)
          </button>
        )}
      </div>
    </div>
  );
}

