
import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCardPro"; 
import Hero from "../components/hero";
import BrandStrip from "../components/brandStrip";
// import Section from "../components/Section";
import NewItems from "../components/newitems";
import Highlights from "../components/highlights";
import FullBleed from "../components/FullBleed";
import Section, { Page } from "../components/Page";
import { supabase } from "../components/supabase";
import { BrandChips, ProductRow } from "./Products";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   (async () => {
  //     const { data, error } = await supabase.from("products").select("*").limit(24);
  //     if (error) console.error(error);
  //     setProducts(data ?? []);
  //     setLoading(false);
  //   })();
  // }, []);

  // const normalizeBrand = (b: unknown) =>
  //   String(b ?? "")
  //     .normalize("NFKC")
  //     .trim()
  //     .replace(/\s+/g, " ")
  //     .toLowerCase();

  // const brands = useMemo(() => {
  //   const seen = new Set<string>();
  //   const list: string[] = [];
  //   for (const p of products) {
  //     const raw = typeof p.brand === "string" ? p.brand : "";
  //     const norm = normalizeBrand(raw);
  //     if (!norm || seen.has(norm)) continue;
  //     seen.add(norm);
  //     const display = raw.trim().replace(/\s+/g, " ");
  //     list.push(display);
  //   }
  //   return list
  //     .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
  //     .slice(0, 20);
  // }, [products]);
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

  return (
    <Page>
      <div className="space-y-16 md:space-y-20 py-6 md:py-10">
        <FullBleed>
          <Hero />
        </FullBleed>

        <Section title="Shop by brand" subtitle="Discover signatures from our favorite makers">

          <BrandChips
            brands={brands}
            q={q}
            normalizedBrandParam={normalizedBrandParam}
          />
        </Section>

        <Section
          title="New arrivals"
          subtitle="Fresh drops curated weekly"
          action={
            <Link to="/products" className="text-emerald-700 hover:underline">
              View all
            </Link>
          }
        >
          <NewItems limit={8} />
        </Section>
        <Section title="Featured" subtitle="Editor’s picks for you">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(loading ? Array.from({ length: 8 }) : products.slice(0, 8)).map((p: any, i) =>
              loading ? (
                <div key={i} className="rounded-2xl border border-gray-200 bg-white shadow-sm p-3 animate-pulse">
                  <div className="aspect-[4/5] w-full rounded-xl bg-gray-200" />
                  <div className="mt-3 h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="mt-2 h-3 w-1/3 bg-gray-200 rounded" />
                </div>
              ) : (
                <ProductCard key={p.id} p={p} />
              )
            )}
          </div>
        </Section>

        <Highlights />
      </div>
    </Page>
  );
}
