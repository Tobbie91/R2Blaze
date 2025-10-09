import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../components/supabase";
import { useCart } from "../store/cart";

type Prod = {
  id: string | number;
  name: string;
  slug?: string | null;
  description?: string | null;
  price: number | string;
  prev_price?: number | string | null;
  images?: string[] | string | null;
  brand?: string | null;
  sku?: string | null;
  gender?: string | null;
  material?: string | null;
  weight?: string | number | null;
  water_resistance?: string | null;
  battery?: string | null;
  features?: string[] | string | null;
  functions?: string | string[] | null;
  created_at?: string | null;
  [k: string]: any;
};

const currencyNGN = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" });

function parseArrayish(input?: unknown): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof input === "string") {
    try {
      const j = JSON.parse(input);
      if (Array.isArray(j)) return j.map(String).map((s) => s.trim()).filter(Boolean);
    } catch {}
    return input.split(/[•,\n;]/g).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function toArrayImages(anyImages?: string[] | string | null): string[] {
  if (!anyImages) return [];
  if (Array.isArray(anyImages)) return anyImages.filter(Boolean) as string[];
  try {
    const j = JSON.parse(String(anyImages));
    if (Array.isArray(j)) return j.filter(Boolean) as string[];
  } catch {}
  return [String(anyImages)];
}

export default function Product() {
  const { handle } = useParams(); // can be slug or id
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Prod | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [tab, setTab] = useState<"desc" | "specs">("desc");
  const [related, setRelated] = useState<Prod[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`id.eq.${handle},slug.eq.${handle}`)
        .maybeSingle();
      if (error) console.error("Product fetch error:", error);
      setProduct((data as Prod) ?? null);
      setActiveIdx(0);
      setLoading(false);
    })();
  }, [handle]);

  useEffect(() => {
    (async () => {
      if (!product?.brand) {
        setRelated([]);
        return;
      }
      const { data, error } = await supabase
        .from("products")
        .select("id,name,slug,price,prev_price,images,brand,created_at")
        .neq("id", product.id)
        .eq("brand", product.brand) // exact brand match for cleaner curation
        .order("created_at", { ascending: false })
        .limit(4);
      if (error) {
        console.warn("Related fetch error:", error);
        setRelated([]);
        return;
      }
      setRelated((data as Prod[]) ?? []);
    })();
  }, [product?.id, product?.brand]);

  const images = useMemo(() => toArrayImages(product?.images), [product]);
  const mainImage = images[activeIdx] ?? "https://placehold.co/1000x1000?text=No+Image";
  const price = Number(product?.price ?? 0);
  const prev = product?.prev_price != null ? Number(product.prev_price) : undefined;
  const onSale = !!prev && prev > price;
  const discount = onSale ? Math.round(((prev - price) / prev) * 100) : 0;

  const features = useMemo(() => {
    const primary = parseArrayish(product?.features);
    return primary.length ? primary : parseArrayish(product?.functions);
  }, [product]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    const idStr = String(product.id);
    addToCart({
      id: idStr,
      name: product.name,
      slug: product.slug || idStr,
      price: Number(price),
      qty: 1,
      images: images,
    });
  }, [addToCart, product, price, images]);

  const handleBuyNow = useCallback(() => {
    handleAddToCart();
    navigate("/cart");
  }, [handleAddToCart, navigate]);

  // keyboard gallery nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!images.length) return;
      if (e.key === "ArrowRight") setActiveIdx((i) => Math.min(i + 1, images.length - 1));
      if (e.key === "ArrowLeft") setActiveIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);

  if (loading) return <div className="py-24 text-center">Loading…</div>;
  if (!product) return <div className="py-24 text-center">Product not found.</div>;

  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_400px_at_100%_-10%,rgba(16,185,129,0.06),transparent_60%)]">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500 overflow-hidden">
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <Link to="/" className="hover:text-emerald-700">Home</Link>
            <span>›</span>
            <Link to="/products" className="hover:text-emerald-700">Products</Link>
            <span>›</span>
            <span className="text-gray-700 break-words">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start *:min-w-0">
          {/* LEFT: Gallery */}
          <div className="lg:sticky lg:top-24">
            <div className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-gray-200 shadow-sm">
              <div className="aspect-[4/4] md:aspect-[4/3] w-full bg-gray-50">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="block w-full h-full object-contain transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
              {onSale && (
                <div className="absolute left-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow">
                  -{discount}%
                </div>
              )}
              {product.brand && (
                <div className="absolute right-3 top-3 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  {product.brand}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="mt-4 overflow-hidden">
              <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border transition 
                      ${i === activeIdx ? "border-emerald-600 ring-2 ring-emerald-200" : "border-gray-200 hover:border-gray-300"}`}
                    aria-label={`View image ${i + 1}`}
                    title={`Image ${i + 1}`}
                  >
                    <img src={src} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
                {!images.length && (
                  <div className="text-xs text-gray-500">No images provided.</div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Purchase panel */}
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight break-words">
              {product.name}
            </h1>

            {/* Price row */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="text-2xl font-semibold text-gray-900">{currencyNGN.format(price)}</div>
              {onSale && (
                <>
                  <div className="text-sm line-through text-gray-400">{currencyNGN.format(prev!)}</div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Save {currencyNGN.format(prev! - price)}
                  </span>
                </>
              )}
            </div>

            {/* Short desc */}
            {product.description && (
              <p className="mt-3 text-gray-700 leading-relaxed line-clamp-4">{product.description}</p>
            )}

            {/* CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBuyNow}
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 text-white font-medium shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
              >
                Buy It Now
              </button>
              <button
                onClick={handleAddToCart}
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
              >
                Add to Cart
              </button>
            </div>

            {/* Trust row */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
              <div className="rounded-xl border bg-white p-3 text-center">Free delivery over ₦150k</div>
              <div className="rounded-xl border bg-white p-3 text-center">7-day returns</div>
              <div className="rounded-xl border bg-white p-3 text-center">Secure checkout</div>
            </div>

            {/* Tabs */}
            <div className="mt-8">
              <div className="flex gap-2 border-b border-gray-200">
                <button
                  onClick={() => setTab("desc")}
                  className={`px-3 py-2 text-sm font-medium ${
                    tab === "desc" ? "text-emerald-700 border-b-2 border-emerald-600" : "text-gray-500"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setTab("specs")}
                  className={`px-3 py-2 text-sm font-medium ${
                    tab === "specs" ? "text-emerald-700 border-b-2 border-emerald-600" : "text-gray-500"
                  }`}
                >
                  Specifications
                </button>
              </div>

              {tab === "desc" ? (
                <div className="pt-4">
                  {product.description ? (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                      {product.description}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm">No description available.</p>
                  )}

                  {features.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-emerald-900">Features</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {features.map((f, i) => (
                          <span
                            key={`${f}-${i}`}
                            className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 break-words"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <section className="pt-4 rounded-2xl">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    {product.brand && (<><dt className="text-gray-500">Brand</dt><dd className="text-gray-800 break-words">{product.brand}</dd></>)}
                    {product.sku && (<><dt className="text-gray-500">SKU</dt><dd className="text-gray-800 break-words">{product.sku}</dd></>)}
                    {product.gender && (<><dt className="text-gray-500">Gender</dt><dd className="text-gray-800 break-words">{product.gender}</dd></>)}
                    {product.material && (<><dt className="text-gray-500">Case &amp; Band</dt><dd className="text-gray-800 break-words">{product.material}</dd></>)}
                    {product.weight && (<><dt className="text-gray-500">Weight</dt><dd className="text-gray-800 break-words">{product.weight}</dd></>)}
                    {product.water_resistance && (<><dt className="text-gray-500">Water Resistance</dt><dd className="text-gray-800 break-words">{product.water_resistance}</dd></>)}
                    {product.battery && (<><dt className="text-gray-500">Battery Life</dt><dd className="text-gray-800 break-words">{product.battery}</dd></>)}
                  </dl>

                  {/* Fallback functions list */}
                  {parseArrayish(product.functions).length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-emerald-900">Functions</h3>
                      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 space-y-1">
                        {parseArrayish(product.functions).map((f, i) => (
                          <li key={i} className="break-words">{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* Meta */}
            <div className="mt-6 text-xs text-gray-500">
              {product.sku && <div className="break-words">SKU: {product.sku}</div>}
              {product.created_at && (
                <div className="break-words">Added: {new Date(product.created_at).toLocaleDateString()}</div>
              )}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">You may also like</h2>
              {product?.brand && (
                <span className="text-xs text-gray-500">Brand: {product.brand}</span>
              )}
            </div>

            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((r) => {
                const imgs = toArrayImages(r.images);
                const cover = imgs[0] ?? "https://placehold.co/600x600?text=No+Image";
                const handle = encodeURIComponent(String(r.slug || r.id)); // ✅ slug first, fallback to id

                return (
                  <li key={r.id}>
                    <Link to={`/products/${handle}`} className="block group" aria-label={`Open ${r.name}`}>
                      <div className="aspect-square w-full overflow-hidden rounded-xl border bg-white">
                        <img
                          src={cover}
                          alt={r.name}
                          className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="mt-2">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">{r.name}</div>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{currencyNGN.format(Number(r.price || 0))}</span>
                          {r.prev_price && Number(r.prev_price) > Number(r.price || 0) && (
                            <span className="text-xs text-gray-400 line-through">
                              {currencyNGN.format(Number(r.prev_price))}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
