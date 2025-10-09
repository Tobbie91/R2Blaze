
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCardPro"; 
import Hero from "../components/hero";
import BrandStrip from "../components/brandStrip";
// import Section from "../components/Section";
import NewItems from "../components/newitems";
import Highlights from "../components/highlights";
import FullBleed from "../components/FullBleed";
import Section, { Page } from "../components/Page";
import { supabase } from "../components/supabase";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("products").select("*").limit(24);
      if (error) console.error(error);
      setProducts(data ?? []);
      setLoading(false);
    })();
  }, []);

  const normalizeBrand = (b: unknown) =>
    String(b ?? "")
      .normalize("NFKC")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();

  const brands = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const p of products) {
      const raw = typeof p.brand === "string" ? p.brand : "";
      const norm = normalizeBrand(raw);
      if (!norm || seen.has(norm)) continue;
      seen.add(norm);
      const display = raw.trim().replace(/\s+/g, " ");
      list.push(display);
    }
    return list
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
      .slice(0, 20);
  }, [products]);

  return (
    <Page>
      <div className="space-y-16 md:space-y-20 py-6 md:py-10">
        <FullBleed>
          <Hero />
        </FullBleed>

        <Section title="Shop by brand" subtitle="Discover signatures from our favorite makers">
          <BrandStrip brands={brands} max={14} />
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
