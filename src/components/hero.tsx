
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

type Slide = {
  title: string
  text?: string
  ctaText?: string
  ctaHref?: string
  imageUrl: string
  imageAlt?: string
}

// Optional: fit into box without cropping (Cloudinary)
function cldFit(url: string, w = 1200, h = 700) {
  try {
    if (!/res\.cloudinary\.com/.test(url)) return url
    return url.replace('/upload/', `/upload/f_auto,q_auto,c_fit,w_${w},h_${h}/`)
  } catch { return url }
}

const DEFAULT_SLIDES: Slide[] = [
  {
    title: 'Timepieces for Every Moment',
    text: 'Premium watches that fit your style and budget.',
    ctaText: 'Shop now',
    ctaHref: '/products',
    imageUrl: 'https://res.cloudinary.com/dpuencehw/image/upload/v1759440848/esjt8zmhlmkdd2x14yq5.jpg',
    imageAlt: 'Elegant watch close-up on wrist'
  },
  {
    title: 'New Arrivals Every Week',
    text: 'Fresh drops from trusted brands—be the first to own them.',
    ctaText: 'Shop now',
    ctaHref: '/products',
    imageUrl: 'https://res.cloudinary.com/dpuencehw/image/upload/v1759445690/xvcehcldukakj7icp4sc.jpg',
    imageAlt: 'Display of latest watch models'
  },
  {
    title: 'Authenticity Guaranteed',
    text: 'Original brands, warranty-backed, and hassle-free returns.',
    ctaText: 'Shop now',
    ctaHref: '/products',
    imageUrl: 'https://res.cloudinary.com/dpuencehw/image/upload/v1759441108/i9i1zsrtjbjaonbrkkt5.jpg',
    imageAlt: 'Watch details showing craftsmanship'
  },
]


export default function Hero({ slides = DEFAULT_SLIDES }: { slides?: Slide[] }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [slides.length])

  // preload next
  useEffect(() => {
    const next = slides[(idx + 1) % slides.length]?.imageUrl
    if (next) new Image().src = next
  }, [idx, slides])

  const s = slides[idx]

  return (
    <section className="bg-neutral-900 text-white">
      <div className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
          {/* LEFT: text */}
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              {s.title}
            </h1>
            {s.text && (
              <p className="mt-3 md:mt-4 text-gray-200 md:text-lg">
                {s.text}
              </p>
            )}
            {s.ctaHref && (
              <Link
                to={s.ctaHref}
                className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-md bg-emerald-700 hover:bg-emerald-800"
              >
                {s.ctaText ?? 'Shop'}
              </Link>
            )}
            {/* Dots */}
            <div className="mt-6 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    i === idx ? 'bg-white' : 'bg-white/60 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: image */}
          <div className="w-full md:w-1/2 order-1 md:order-2">
            {/* Aspect box so the image has a nice area; object-contain prevents crop */}
            <div className="relative w-full aspect-[4/3] md:aspect-[16/10] bg-black/30 rounded-xl overflow-hidden">
              <img
                src={cldFit(s.imageUrl, 1400, 900)}
                alt={s.imageAlt ?? ''}
                className="absolute inset-0 w-full h-full object-contain"
                loading="eager"
                decoding="async"
              />
              {/* subtle edge vignette so it blends on light images */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
