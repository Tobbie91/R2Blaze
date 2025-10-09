// src/components/ProductCardPro.tsx
import React from "react";
import { Link } from "react-router-dom";

const ngn = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

const toNumber = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);

const getImageList = (images: any): string[] => {
  if (Array.isArray(images)) return images;
  if (typeof images === "string") {
    try { const parsed = JSON.parse(images); if (Array.isArray(parsed)) return parsed; } catch {}
    if (images.startsWith("http")) return [images];
  }
  return [];
};

const firstOr = (arr: string[], fallback = "") => (arr?.length ? arr[0] : fallback);

// Add Cloudinary quality & DPR bump
const cldEnhance = (url: string) =>
  /res\.cloudinary\.com/.test(url)
    ? url.replace("/upload/", "/upload/f_auto,q_auto,dpr_2.0/") // crisp & lean
    : url;

const clamp2: React.CSSProperties = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

export default function ProductCardPro({ p }: { p: any }) {
  const imgs = getImageList(p.images);
  const img = cldEnhance(firstOr(imgs));
  const brand = p.brand || "";
  const name = p.name || "";
  const price = toNumber(p.price);
  const old =
    Math.max(
      toNumber(p.compare_at_price),
      toNumber(p.oldPrice),
      toNumber(p.formerPrice),
      toNumber(p.msrp)
    ) || 0;
  const hasOld = old > 0 && price > 0 && old > price;
  const discount = hasOld ? Math.round(((old - price) / old) * 100) : 0;

  const slug = (p.slug || String(p.id)).toString().trim().toLowerCase().replace(/\s+/g, "-");

  return (
    <Link
      to={`/products/${slug}`}
      className="group rounded-2xl border border-gray-200/80 bg-white/90 backdrop-blur
                 shadow-sm hover:shadow-md hover:border-emerald-200 transition overflow-hidden"
    >
      <div className="relative">
        <div className="aspect-[4/5] w-full overflow-hidden bg-gray-50">
          {img ? (
            <img
              src={img}
              alt={name || brand || "Product"}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
              No image
            </div>
          )}
        </div>

        {hasOld && (
          <div className="absolute left-2 top-2 rounded-full bg-red-600 text-white shadow
                          px-2.5 py-1 text-[11px] font-bold">
            {discount}% OFF
          </div>
        )}

        {/* subtle ring on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-emerald-200/0 transition group-hover:ring-4 group-hover:ring-emerald-200/40" />
      </div>

      <div className="p-3">
        {brand && (
          <div className="text-[11px] uppercase tracking-wide text-gray-500">{brand}</div>
        )}
        <h3 className="mt-1 text-sm md:text-base font-medium text-gray-900 leading-snug" style={clamp2} title={name}>
          {name}
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-semibold">{price > 0 ? ngn.format(price) : "—"}</span>
          {hasOld && <span className="text-sm text-gray-500 line-through">{ngn.format(old)}</span>}
        </div>
      </div>
    </Link>
  );
}
