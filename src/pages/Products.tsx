import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "../components/supabase";
import ProductCard from "../components/ProductCard"; // or your Pro card

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  strap: "metal" | "leather" | "rubber" | "silicon" | "fabric";
  price: number;
  prev_price?: number | null;
  images: string[] | null;
  description?: string | null;
  created_at?: string;
};

export default function Products() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();

  const [q, setQ] = useState(() => params.get("q") ?? "");
  const brandParam = params.get("brand") ?? "";
  const sortParam = params.get("sort") ?? "new"; 
  const [visible, setVisible] = useState(12);


  useEffect(() => { setVisible(12); }, [q, brandParam, sortParam]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id, slug, name, brand, strap, price, prev_price, images, description, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase fetch error:", error);
        setProducts([]);
      } else {
        const normalized = (data ?? []).map((p) => ({
          ...p,
          images: Array.isArray(p.images) ? p.images : [],
        })) as ProductRow[];
        setProducts(normalized);
      }
      setLoading(false);
    })();
  }, []);

  // --- helpers ---
  const normalizeBrand = (b: unknown) =>
    String(b ?? "")
      .normalize("NFKC")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();

  const normalizedBrandParam = useMemo(
    () => normalizeBrand(brandParam),
    [brandParam]
  );

  // Dedupe safeguard
  const deduped = useMemo(() => {
    const map = new Map<string, ProductRow>();
    for (const p of products) map.set(p.id, p);
    return Array.from(map.values());
  }, [products]);

  // Filter + sort
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const base = deduped.filter((p) => {
      const byBrand = normalizedBrandParam
        ? normalizeBrand(p.brand) === normalizedBrandParam
        : true;
      const byText =
        !term ||
        p.name?.toLowerCase().includes(term) ||
        (p.brand ?? "").toLowerCase().includes(term);
      return byBrand && byText;
    });

    switch (sortParam) {
      case "price-asc":
        return [...base].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      case "price-desc":
        return [...base].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      default: // "new"
        return [...base].sort(
          (a, b) =>
            new Date(b.created_at ?? 0).getTime() -
            new Date(a.created_at ?? 0).getTime()
        );
    }
  }, [deduped, q, normalizedBrandParam, sortParam]);

  const show = filtered.slice(0, visible);

  // Unique brands, pretty labels
  const brands = useMemo(() => {
    const map = new Map<string, string>(); // norm -> display
    for (const p of products) {
      const raw = typeof p.brand === "string" ? p.brand : "";
      const norm = normalizeBrand(raw);
      if (!norm) continue;
      if (!map.has(norm)) {
        const display = raw.trim().replace(/\s+/g, " ");
        map.set(norm, display);
      }
    }
    return Array.from(map.entries())
      .sort((a, b) =>
        a[1].localeCompare(b[1], undefined, { sensitivity: "base" })
      )
      .map(([norm, display]) => ({ norm, display }));
  }, [products]);

  // --- UI ---

  // Loading skeleton grid
  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(1000px_400px_at_100%_-10%,rgba(16,185,129,0.06),transparent_60%)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <HeaderBar
            q={q}
            setQ={(val) => {
              setQ(val);
              const next = new URLSearchParams(params);
              if (val) next.set("q", val); else next.delete("q");
              setParams(next, { replace: true });
            }}
            sortParam={sortParam}
            setSort={(val) => {
              const next = new URLSearchParams(params);
              next.set("sort", val);
              setParams(next, { replace: true });
            }}
            resultCount={0}
            activeBrand={normalizedBrandParam}
            clearBrand={() => {
              const next = new URLSearchParams(params);
              next.delete("brand");
              setParams(next, { replace: true });
            }}
          />

          <BrandChips
            brands={brands}
            q={q}
            normalizedBrandParam={normalizedBrandParam}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm p-3 animate-pulse"
              >
                <div className="aspect-[4/5] w-full rounded-xl bg-gray-200" />
                <div className="mt-3 h-4 w-3/4 bg-gray-200 rounded" />
                <div className="mt-2 h-3 w-1/3 bg-gray-200 rounded" />
                <div className="mt-3 h-5 w-24 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_400px_at_100%_-10%,rgba(16,185,129,0.06),transparent_60%)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Sticky / glass filter bar */}
        <HeaderBar
          q={q}
          setQ={(val) => {
            setQ(val);
            const next = new URLSearchParams(params);
            if (val) next.set("q", val); else next.delete("q");
            setParams(next, { replace: true });
          }}
          sortParam={sortParam}
          setSort={(val) => {
            const next = new URLSearchParams(params);
            next.set("sort", val);
            setParams(next, { replace: true });
          }}
          resultCount={filtered.length}
          activeBrand={normalizedBrandParam}
          clearBrand={() => {
            const next = new URLSearchParams(params);
            next.delete("brand");
            setParams(next, { replace: true });
          }}
        />

        {/* glassy brand chips */}
        <BrandChips
          brands={brands}
          q={q}
          normalizedBrandParam={normalizedBrandParam}
        />

        {/* result grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {show.map(p => {
    const handle = p.slug || String(p.id);
    return (
      <Link key={p.id} to={`/products/${encodeURIComponent(handle)}`}>
        <ProductCard p={{ ...p, prevPrice: p.prev_price ?? undefined } as any} />
      </Link>
    );
  })}
</div>

        {!filtered.length && (
          <EmptyState q={q} />
        )}

        {visible < filtered.length && (
          <div className="flex justify-center">
            <button
              className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white/90 backdrop-blur hover:bg-white shadow-sm hover:shadow-md transition"
              onClick={() => setVisible((v) => v + 12)}
            >
              View more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- subcomponents ---------- */

// sticky header + search + sort + counts
function HeaderBar({
  q,
  setQ,
  sortParam,
  setSort,
  resultCount,
  activeBrand,
  clearBrand,
}: {
  q: string;
  setQ: (v: string) => void;
  sortParam: string;
  setSort: (v: string) => void;
  resultCount: number;
  activeBrand: string;
  clearBrand: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 lg:-mx-8 bg-white/70 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">All Products</h1>
            <p className="text-sm text-gray-500">
              {resultCount.toLocaleString()} item{resultCount === 1 ? "" : "s"}
              {activeBrand && (
                <>
                  {" "}• brand: <span className="font-medium text-gray-700">{activeBrand}</span>{" "}
                  <button onClick={clearBrand} className="ml-2 text-emerald-700 hover:underline">
                    clear
                  </button>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* search */}
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name or brand…"
                className="w-[260px] rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Search products"
              />
              {/* icon */}
              <svg
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
              >
                <path d="M10 3a7 7 0 1 1-4.95 11.95l-2.6 2.6 1.4 1.4 2.6-2.6A7 7 0 0 1 10 3Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"/>
              </svg>
            </div>

            {/* sort */}
            <select
              value={sortParam}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Sort products"
            >
              <option value="new">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// glassy chips with edge fades + wrap fallback
function BrandChips({
  brands,
  q,
  normalizedBrandParam,
}: {
  brands: { norm: string; display: string }[];
  q: string;
  normalizedBrandParam: string;
}) {
  return (
    <div className="relative">
      {/* edge fades for scroll overflow */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent rounded-l" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent rounded-r" />

      <div
        className="flex gap-2 overflow-x-auto px-1 -mx-1 snap-x snap-mandatory"
        style={{ scrollPaddingLeft: 8, scrollPaddingRight: 8 }}
      >
        <Pill
          to={`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`}
          active={!normalizedBrandParam}
          label="All brands"
        />

        {brands.map((b) => (
          <Pill
            key={b.norm}
            to={`/products?brand=${encodeURIComponent(b.display)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            active={normalizedBrandParam === b.norm}
            label={b.display}
          />
        ))}
      </div>
    </div>
  );
}

function Pill({ to, active, label }: { to: string; active: boolean; label: string }) {
  return (
    <Link
      to={to}
      className={`shrink-0 snap-start px-3.5 py-1.5 rounded-full border text-xs sm:text-[13px]
      transition-colors shadow-sm ${
        active
          ? "bg-emerald-600 text-white border-emerald-600"
          : "bg-white/70 text-gray-700 border-gray-200 hover:bg-white"
      }`}
      aria-label={`Filter ${label}`}
      title={label}
    >
      {label}
    </Link>
  );
}

function EmptyState({ q }: { q: string }) {
  
  return (
    <div className="text-center py-16">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/60">
        {/* magnifier */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 3a7 7 0 1 1-4.95 11.95l-2.6 2.6 1.4 1.4 2.6-2.6A7 7 0 0 1 10 3Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"/>
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">No results</h3>
      <p className="mt-1 text-sm text-gray-500">
        {q ? <>We couldn’t find items matching “<span className="font-medium">{q}</span>”.</> : "Try adjusting your filters."}
      </p>
      <div className="mt-6">
      <Link
          to="/products"
          className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
        >
          Reset filters
        </Link>
      </div>
    </div>
  );
}
