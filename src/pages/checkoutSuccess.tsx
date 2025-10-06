import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
// If you have a cart store, import it to clear after success
import { useCart } from "../store/cart";

const API_BASE =
  import.meta.env.VITE_R2BLAZE_API_BASE ||
  "https://r2blaze-kywfiom78-oluwatobi-s-projects.vercel.app"; // your preview API

type VerifyResponse = { ok: boolean; data?: any; error?: string };

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const ref = params.get("ref") || "";
  const tries = useRef(0);
  const { clear } = useCart?.() || { clear: () => {} };

  type State = "checking" | "ok" | "pending" | "fail";
  const [state, setState] = useState<State>(ref ? "checking" : "fail");
  const [details, setDetails] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  // Load order snapshot if we saved it
  const orderSnapshot = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("r2b_last_order");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  async function checkOnce() {
    if (!ref) return setState("fail");
    try {
      const r = await fetch(`${API_BASE}/api/paystack-verify?reference=${encodeURIComponent(ref)}`);
      const data: VerifyResponse = await r.json();
      if (!r.ok) throw new Error(data?.error || "Verify failed");

      setDetails(data?.data || null);

      if (data.ok) {
        setState("ok");
        // Clear cart once we know it's paid
        try { clear?.(); } catch {}
        // You can also clear the snapshot now if you want
        // sessionStorage.removeItem("r2b_last_order");
      } else {
        // Paystack may return statuses like 'abandoned' or 'failed'
        const status = data?.data?.status || "pending";
        setState(status === "failed" ? "fail" : "pending");
      }
    } catch (e: any) {
      setErr(e?.message || "Unable to verify payment.");
      setState("pending"); // allow polling; webhook might still be on the way
    }
  }

  useEffect(() => {
    if (!ref) return;

    // Initial check
    checkOnce();

    // Poll up to ~30s (10 tries x 3s) while pending
    const id = setInterval(() => {
      if (state === "ok" || state === "fail") {
        clearInterval(id);
        return;
      }
      if (tries.current >= 10) {
        clearInterval(id);
        return;
      }
      tries.current += 1;
      checkOnce();
    }, 3000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6 mt-6">
      <h1 className="text-2xl font-semibold mb-3">Payment Status</h1>

      {!ref && (
        <div className="rounded-md bg-red-50 border border-red-200 text-red-700 p-3 mb-4">
          Missing reference. Please check your link.
        </div>
      )}

      {state === "checking" && (
        <div className="rounded-md bg-amber-50 border border-amber-200 text-amber-800 p-3 mb-4">
          Confirming your payment… please wait.
        </div>
      )}

      {state === "pending" && (
        <div className="rounded-md bg-amber-50 border border-amber-200 text-amber-800 p-3 mb-4">
          We’re still waiting for confirmation. This can take a few seconds if the webhook is delayed.
          {err && <div className="text-sm text-amber-900 mt-2">Note: {err}</div>}
        </div>
      )}

      {state === "ok" && (
        <div className="rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 mb-4">
          Payment successful! 🎉 Your order has been confirmed.
        </div>
      )}

      {state === "fail" && (
        <div className="rounded-md bg-red-50 border border-red-200 text-red-700 p-3 mb-4">
          We couldn’t confirm this payment. If you were charged, don’t worry—our system will reconcile
          shortly. Please contact support with your reference.
        </div>
      )}

      {/* Reference + actions */}
      {ref && (
        <div className="mb-6">
          <div className="text-sm text-gray-600">Reference:</div>
          <div className="flex items-center gap-2 mt-1">
            <code className="px-2 py-1 bg-gray-100 rounded text-gray-800">{ref}</code>
            <button
              onClick={() => navigator.clipboard.writeText(ref)}
              className="px-2 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* Summary (from sessionStorage snapshot) */}
      {orderSnapshot && (
        <div className="border rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-2">Order Summary</h2>
          <div className="text-sm text-gray-700">
            <div><span className="font-medium">Name:</span> {orderSnapshot.name}</div>
            <div><span className="font-medium">Email:</span> {orderSnapshot.email}</div>
            <div><span className="font-medium">Address:</span> {orderSnapshot.address}</div>
          </div>
          <ul className="mt-3 space-y-1">
            {orderSnapshot.items?.map((it: any, i: number) => (
              <li key={i} className="flex justify-between text-sm">
                <span>{it.name} × {it.qty}</span>
                <span>₦{(it.price * it.qty).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between font-semibold border-t pt-2">
            <span>Total</span>
            <span>₦{Number(orderSnapshot.total || 0).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Next steps */}
      {state === "ok" ? (
        <div className="flex gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="inline-flex items-center justify-center px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
          >
            View Orders
          </Link>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
          >
            Refresh Status
          </button>
          <a
            href="https://wa.me/2347018239270"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 rounded bg-slate-800 text-white hover:bg-slate-900"
          >
            Contact Support
          </a>
        </div>
      )}
    </div>
  );
}
