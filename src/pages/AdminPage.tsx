// src/pages/AdminPage.tsx

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../components/supabase";

type Product = {
  id: string;
  name: string;
  slug?: string | null;
  price?: number | null;
  prev_price?: number | null;
  created_at?: string;
  updated_at?: string;
};

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [counts, setCounts] = useState<{ products: number; images: number } | null>(null);
  const [jump, setJump] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();
  const PAGE_SIZE = 8;
const [hasMore, setHasMore] = useState(true);
const [loadingMore, setLoadingMore] = useState(false);

useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        // totals
        const { count: prodCount, error: c1 } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });
        if (c1) throw c1;
  
        const { count: imgCount, error: c2 } = await supabase
          .from("product_images")
          .select("*", { count: "exact", head: true });
        if (c2) throw c2;
  
        // first page
        const { data: recents, error: r1 } = await supabase
          .from("products")
          .select("id,name,slug,price,prev_price,created_at,updated_at")
          .order("updated_at", { ascending: false })
          .order("created_at", { ascending: false })
          .range(0, PAGE_SIZE - 1);
  
        if (r1) throw r1;
  
        if (!alive) return;
        setCounts({ products: prodCount ?? 0, images: imgCount ?? 0 });
        const list = recents ?? [];
        setProducts(list);
        setHasMore((prodCount ?? 0) > list.length);
      } catch (e: any) {
        if (!alive) return;
        setErr(e.message || String(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);
  
  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setErr(null);
    try {
      const from = products.length;
      const to = from + PAGE_SIZE - 1;
  
      const { data, error, count } = await supabase
        .from("products")
        .select("id,name,slug,price,prev_price,created_at,updated_at", { count: "exact" })
        .order("updated_at", { ascending: false })
        .order("created_at", { ascending: false })
        .range(from, to);
  
      if (error) throw error;
  
      const more = data ?? [];
      setProducts(prev => [...prev, ...more]);
      const total = count ?? (counts?.products ?? 0);
      setHasMore(from + more.length < total);
    } catch (e: any) {
      setErr(e.message || String(e));
    } finally {
      setLoadingMore(false);
    }
  }
  

//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       setLoading(true);
//       setErr(null);
//       try {
//         // totals
//         const { count: prodCount, error: c1 } = await supabase
//           .from("products")
//           .select("*", { count: "exact", head: true });
//         if (c1) throw c1;

//         const { count: imgCount, error: c2 } = await supabase
//           .from("product_images")
//           .select("*", { count: "exact", head: true });
//         if (c2) throw c2;

//         // recent products (latest 8) — no gender selected
//         const { data: recents, error: r1 } = await supabase
//           .from("products")
//           .select("id,name,slug,price,prev_price,created_at,updated_at")
//           .order("updated_at", { ascending: false })
//           .order("created_at", { ascending: false })
//           .limit(8);
//         if (r1) throw r1;

//         if (!alive) return;
//         setCounts({ products: prodCount ?? 0, images: imgCount ?? 0 });
//         setProducts(recents ?? []);
//       } catch (e: any) {
//         if (!alive) return;
//         setErr(e.message || String(e));
//       } finally {
//         if (alive) setLoading(false);
//       }
//     })();
//     return () => {
//       alive = false;
//     };
//   }, []);

  const totalValue = useMemo(() => {
    const sum = products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
    return sum;
  }, [products]);

  const ngn = useMemo(
    () => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }),
    []
  );

  function goCreateProduct() {
    navigate("/admin/uploader/new");
  }

  function jumpTo() {
    const v = jump.trim();
    if (!v) return;
    navigate(`/admin/uploader/${encodeURIComponent(v)}`);
  }



  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-emerald-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Manage products, images, and content</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/products" className="rounded-lg border px-3 py-2 text-sm">
            View all products
          </Link>
          <button
            onClick={goCreateProduct}
            className="rounded-lg bg-emerald-700 px-3 py-2 text-sm text-white hover:bg-emerald-800"
          >
            + Create New product
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/admin/login";
            }}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Quick actions + search */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CardStat
            label="Products"
            value={loading ? "…" : String(counts?.products ?? 0)}
            hint="Total items in catalog"
          />
       
          <CardStat
            label="Value (last 8)"
            value={loading ? "…" : ngn.format(totalValue)}
            hint="Sum of visible prices"
          />
        </div>

        {/* Jump to product */}
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-sm font-medium mb-2">Jump to product</div>
          <input
            value={jump}
            onChange={(e) => setJump(e.target.value)}
            placeholder="Enter product ID or slug"
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <button
            onClick={jumpTo}
            className="mt-3 w-full rounded-lg bg-emerald-700 px-3 py-2 text-sm text-white hover:bg-emerald-800"
          >
            Open editor
          </button>
          <p className="mt-2 text-xs text-gray-500">
            Tip: paste the product ID from your products table, or its slug.
          </p>
        </div>
      </section>

      {/* Recent products */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-emerald-900">Recent products</h2>
          <button
  onClick={loadMore}
  disabled={!hasMore || loadingMore}
  className="text-sm text-emerald-700 hover:underline disabled:opacity-50"
>
  {loadingMore ? "Loading…" : hasMore ? "Show more" : "All loaded"}
</button>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border bg-white">
          {loading ? (
            <div className="p-6 text-sm text-gray-500">Loading…</div>
          ) : products.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">No products yet.</div>
          ) : (
            <ul className="divide-y">
              {products.map((p) => (
                <li key={p.id} className="grid grid-cols-12 gap-3 px-4 py-3">
                  <div className="col-span-6 md:col-span-6">
                    <div className="font-medium text-gray-900 truncate">{p.name}</div>
                    <div className="text-xs text-gray-500 truncate">{p.slug || "—"}</div>
                  </div>
                  <div className="col-span-3 md:col-span-3 text-sm text-gray-900">
                    {p.price != null ? ngn.format(Number(p.price)) : "—"}
                    {p.prev_price ? (
                      <span className="ml-1 text-xs text-gray-400 line-through">
                        {ngn.format(Number(p.prev_price))}
                      </span>
                    ) : null}
                  </div>
                  <div className="col-span-3 md:col-span-3 text-xs text-gray-500">
                    {p.updated_at
                      ? new Date(p.updated_at).toLocaleString()
                      : p.created_at
                      ? new Date(p.created_at).toLocaleString()
                      : "—"}
                  </div>
                  <div className="col-span-12 md:col-span-12 mt-2 md:mt-0 text-right">
                  <Link
  to={`/admin/uploader/${encodeURIComponent(p.id)}`}
  className="inline-flex items-center rounded border px-2.5 py-1.5 text-xs"
>
  Edit
</Link>
                    <Link
                      to={`/admin/products/${encodeURIComponent(p.id)}/images`}
                      className="ml-2 inline-flex items-center rounded border px-2.5 py-1.5 text-xs"
                    >
                      Images
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
         {!loading && products.length > 0 && (
  <div className="p-4 text-center border-t">
    <button
      onClick={loadMore}
      disabled={!hasMore || loadingMore}
      className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
    >
      {loadingMore ? "Loading…" : hasMore ? "Show more products" : "No more products"}
    </button>
  </div>
)}
 
        </div>

        {err && (
          <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        )}
      </section>

      {/* Shortcuts */}
      <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AdminShortcut
          title="Manage products"
          desc="See product items"
          to="/products"
        />
        <AdminShortcut
          title="Upload images"
          desc="Organize gallery per product"
          to="/admin/uploader/new"
        />
        <AdminShortcut title="View site" desc="Open storefront homepage" to="/" />
      </section>
    </div>
  );
}

function CardStat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  );
}

function AdminShortcut({ title, desc, to }: { title: string; desc: string; to: string }) {
  return (
    <Link to={to} className="rounded-2xl border bg-white p-4 hover:shadow-sm transition">
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <div className="text-xs text-gray-500 mt-1">{desc}</div>
    </Link>
  );
}
