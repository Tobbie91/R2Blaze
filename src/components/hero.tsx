import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

type Slide = {
  title: string;
  text?: string;
  ctaText?: string;
  ctaHref?: string;
  imageUrl: string;
  imageAlt?: string;
  badge?: string;
};

// Optional: fit into box without cropping (Cloudinary)
function cldFit(url: string, w = 1400, h = 900) {
  try {
    if (!/res\.cloudinary\.com/.test(url)) return url;
    return url.replace("/upload/", `/upload/f_auto,q_auto,c_fit,w_${w},h_${h}/`);
  } catch {
    return url;
  }
}

const DEFAULT_SLIDES: Slide[] = [
  {
    title: "Timepieces for Every Moment",
    text: "Premium watches that fit your style and budget.",
    ctaText: "Shop now",
    ctaHref: "/products",
    imageUrl:
      "https://res.cloudinary.com/dpuencehw/image/upload/v1759440848/esjt8zmhlmkdd2x14yq5.jpg",
    imageAlt: "Elegant watch close-up on wrist",
    badge: "Editor’s pick",
  },
  {
    title: "New Arrivals Every Week",
    text: "Fresh drops from trusted brands—be the first to own them.",
    ctaText: "Explore",
    ctaHref: "/products",
    imageUrl:
      "https://res.cloudinary.com/dpuencehw/image/upload/v1759445690/xvcehcldukakj7icp4sc.jpg",
    imageAlt: "Display of latest watch models",
    badge: "New in",
  },
  {
    title: "Authenticity Guaranteed",
    text: "Original brands, warranty-backed, and hassle-free returns.",
    ctaText: "Discover",
    ctaHref: "/products",
    imageUrl:
      "https://res.cloudinary.com/dpuencehw/image/upload/v1759441108/i9i1zsrtjbjaonbrkkt5.jpg",
    imageAlt: "Watch details showing craftsmanship",
    badge: "Guaranteed",
  },
];

export default function Hero({ slides = DEFAULT_SLIDES }: { slides?: Slide[] }) {
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const intervalMs = 5000;

  // Preload neighbors
  const nextIndex = useMemo(() => (idx + 1) % slides.length, [idx, slides.length]);
  useEffect(() => {
    const next = slides[nextIndex]?.imageUrl;
    if (next) {
      const img = new Image();
      img.src = next;
    }
  }, [nextIndex, slides]);

  // Autoplay (respect hover & reduced motion)
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hover || prefersReduced) return;

    let p = 0;
    setProgress(0);
    const tick = 50; // ms
    const id = setInterval(() => {
      p += (tick / intervalMs) * 100;
      if (p >= 100) {
        setIdx((i) => (i + 1) % slides.length);
        p = 0;
      }
      setProgress(p);
    }, tick);
    return () => clearInterval(id);
  }, [hover, slides.length, idx]);

  // Keyboard arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % slides.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + slides.length) % slides.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length]);

  // Touch swipe
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => (touchStartX.current = e.touches[0].clientX);
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current == null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const threshold = 40;
      if (dx > threshold) setIdx((i) => (i - 1 + slides.length) % slides.length);
      else if (dx < -threshold) setIdx((i) => (i + 1) % slides.length);
      touchStartX.current = null;
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [slides.length]);

  const s = slides[idx];

  return (
    <section
      className="relative isolate text-white"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Background layers */}
      <div className="absolute inset-0 -z-10 bg-neutral-900" />
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{ background: "radial-gradient(900px 380px at 80% 15%, #10B98155, transparent 60%)" }}
      />

      <div
        ref={containerRef}
        className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-16 grid md:grid-cols-2 gap-8 md:gap-12 items-center"
      >
        {/* LEFT: Copy */}
        <div className="order-2 md:order-1">
          {s.badge && (
            <span className="inline-flex items-center rounded-full bg-emerald-600/20 ring-1 ring-emerald-400/40 text-emerald-200 px-2.5 py-1 text-xs font-semibold">
              {s.badge}
            </span>
          )}
          <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight tracking-tight">
            {s.title}
          </h1>
          {s.text && <p className="mt-3 md:mt-4 text-white/80 md:text-lg">{s.text}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {s.ctaHref && (
              <Link
                to={s.ctaHref}
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-medium shadow-[0_0_0_0_rgba(16,185,129,0.45)] hover:shadow-[0_0_22px_2px_rgba(16,185,129,0.25)] transition"
              >
                {s.ctaText ?? "Shop"}
              </Link>
            )}
            <button
              onClick={() => setIdx((i) => (i + 1) % slides.length)}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-sm"
              aria-label="Next slide"
            >
              Next →
            </button>
          </div>

          {/* Dots */}
          <div className="mt-6 flex gap-2" role="tablist" aria-label="Hero slides">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                role="tab"
                aria-selected={i === idx}
                aria-label={`Go to slide ${i + 1}`}
                className={[
                  "h-2.5 w-2.5 rounded-full transition",
                  i === idx ? "bg-white" : "bg-white/60 hover:bg-white/80",
                ].join(" ")}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1 w-40 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/80 transition-[width] duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* RIGHT: Visual */}
        <div className="order-1 md:order-2">
          <div className="relative w-full aspect-[4/3] md:aspect-[16/10] bg-black/20 rounded-2xl overflow-hidden ring-1 ring-white/10">
            <img
              src={cldFit(s.imageUrl, 1600, 1000)}
              alt={s.imageAlt ?? ""}
              className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 will-change-transform hover:scale-[1.02]"
              loading="eager"
              decoding="async"
            />
            {/* vignette */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent" />

            {/* Arrows (overlay for mouse users) */}
            <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-3">
              <button
                onClick={() => setIdx((i) => (i - 1 + slides.length) % slides.length)}
                className="rounded-full bg-white/15 hover:bg-white/25 text-white h-9 w-9 grid place-items-center"
                aria-label="Previous slide"
                title="Previous"
              >
                ‹
              </button>
              <button
                onClick={() => setIdx((i) => (i + 1) % slides.length)}
                className="rounded-full bg-white/15 hover:bg-white/25 text-white h-9 w-9 grid place-items-center"
                aria-label="Next slide"
                title="Next"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom divider */}
      <div className="h-px w-full bg-white/10" />
    </section>
  );
}
