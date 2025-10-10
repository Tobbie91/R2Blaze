import { Helmet } from "react-helmet-async";

export default function SeoHome() {
  return (
    <Helmet>
      <title>R2Blaze Wristwatch — Premium Watches in Nigeria | Shop Men & Women</title>
      <meta name="description" content="R2Blaze offers premium men’s and women’s wristwatches at great prices. Fast delivery across Nigeria, secure checkout, and curated brands." />
      <link rel="canonical" href="https://www.r2blaze.com/" />
      <meta name="robots" content="index,follow,max-image-preview:large" />
      <meta name="theme-color" content="#000000" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="R2Blaze" />
      <meta property="og:title" content="R2Blaze Wristwatch — Premium Watches in Nigeria" />
      <meta property="og:description" content="Shop curated wristwatches for men & women. Fast delivery in Nigeria, secure checkout." />
      <meta property="og:url" content="https://www.r2blaze.com/" />
      <meta property="og:image" content="https://www.r2blaze.com/og/r2blaze-cover.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="R2Blaze Wristwatch — Premium Watches in Nigeria" />
      <meta name="twitter:description" content="Curated wristwatches. Fast delivery across Nigeria." />
      <meta name="twitter:image" content="https://www.r2blaze.com/og/r2blaze-cover.jpg" />

      <link rel="icon" href="/favicons/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" sizes="180x180" />
      <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="/favicons/favicon-192.png" sizes="192x192" />

      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://res.cloudinary.com" />
      <link rel="preconnect" href="https://api.r2blaze.com" />

      <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "R2Blaze",
          "url": "https://www.r2blaze.com/",
          "logo": "https://www.r2blaze.com/og/r2blaze-logo.png",
          "sameAs": [
            "https://www.instagram.com/r2blaze",
            "https://www.tiktok.com/@r2blaze",
            "https://www.linkedin.com/company/r2blaze"
          ]
        }
      `}</script>
      <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "url": "https://www.r2blaze.com/",
          "name": "R2Blaze Wristwatch",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.r2blaze.com/search?q={query}",
            "query-input": "required name=query"
          }
        }
      `}</script>
    </Helmet>
  );
}
