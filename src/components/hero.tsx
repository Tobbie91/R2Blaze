import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

type Slide = {
  title: string
  text?: string
  ctaText?: string
  ctaHref?: string
  videoUrl?: string  // Add video URL property
}

const DEFAULT_SLIDES: Slide[] = [
  {
    title: 'Genuine. Affordable. Stylish.',
    text: 'Curated watches from global brands.',
    ctaText: 'Shop now',
    ctaHref: '/products',
    videoUrl: 'https://res.cloudinary.com/dpuencehw/video/upload/v1756944550/don30_xeqi2p.mp4'  // Cloudinary video URL
  },
  {
    title: 'New arrivals weekly',
    text: 'Fresh styles for him & her.',
    ctaText: 'Explore',
    ctaHref: '/products',
    videoUrl: 'https://res.cloudinary.com/dpuencehw/video/upload/v1756944516/don29_z5gwhl.mp4'  // Another video URL (optional)
  },
]

export default function Hero({ slides = DEFAULT_SLIDES }: { slides?: Slide[] }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [slides.length])

  const s = slides[idx]

  return (
    <div className="relative h-[560px] overflow-hidden">
      {/* Video background */}
      {s.videoUrl && (
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={s.videoUrl} type="video/mp4" />
        </video>
      )}

      <div className="absolute inset-0 bg-black/40" /> {/* Overlay to darken the video */}

      <div className="relative h-full flex items-center justify-center text-center text-white">
        <div className="p-8 sm:p-12 text-white max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{s.title}</h1>
          {s.text && <p className="text-gray-200 mb-4">{s.text}</p>}
          {s.ctaHref && (
            <Link to={s.ctaHref} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-700 text-white hover:bg-emerald-800">
              {s.ctaText ?? 'Shop'}
            </Link>
          )}
        </div>
      </div>

      {/* Dots for navigation */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-2 w-2 rounded-full ${i === idx ? 'bg-white' : 'bg-white/60'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
