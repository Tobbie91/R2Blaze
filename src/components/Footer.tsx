import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: send `email` to your backend/provider (Mailchimp, Resend, etc.)
    setEmail("");
  }

  return (
    <footer className="relative mt-16">
      {/* Soft gradient backdrop */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(800px_300px_at_80%_0%,rgba(16,185,129,0.12),transparent_60%)]" />

      {/* Top CTA band (optional) */}
      <div className="bg-neutral-900 text-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 text-center text-sm">
          Join the club — get early access & offers.
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-neutral-950 text-neutral-200 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand / About */}
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="/images/donlogo.webp"
                  alt="R2blaze"
                  className="h-10 w-auto rounded-md"
                />
                <span className="text-lg font-semibold tracking-tight">R2blaze</span>
              </div>
              <p className="mt-4 text-sm text-neutral-400 leading-relaxed">
                Curated timepieces & accessories — authentic brands, fair prices, fast delivery.
              </p>

              {/* Payments row (monochrome) */}
              <div className="mt-6 flex items-center gap-3 opacity-80">
                {/* Simple SVG placeholders; replace with real icons if you like */}
                {/* <span className="inline-flex h-6 w-10 items-center justify-center rounded bg-white/5 ring-1 ring-white/10 text-[10px]">
                  VISA
                </span>
                <span className="inline-flex h-6 w-10 items-center justify-center rounded bg-white/5 ring-1 ring-white/10 text-[10px]">
                  MC
                </span>
                <span className="inline-flex h-6 w-10 items-center justify-center rounded bg-white/5 ring-1 ring-white/10 text-[10px]">
                  Verve
                </span> */}
                <span className="inline-flex h-6 px-2 items-center justify-center rounded bg-white/5 ring-1 ring-white/10 text-[10px]">
                  Paystack
                </span>
                
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-neutral-100">
                Shop
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-neutral-400">
                <li><Link className="hover:text-white transition" to="/products">All Products</Link></li>
                <li><Link className="hover:text-white transition" to="/products?new=true">New Arrivals</Link></li>
                <li><Link className="hover:text-white transition" to="/products?sale=true">Sale</Link></li>
                <li><Link className="hover:text-white transition" to="/brands">Brands</Link></li>
              </ul>

              <h4 className="mt-8 text-sm font-semibold tracking-wide text-neutral-100">
                Company
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-neutral-400">
                <li><Link className="hover:text-white transition" to="/about">About</Link></li>
                <li><Link className="hover:text-white transition" to="/contact">Contact</Link></li>
                <li><Link className="hover:text-white transition" to="/policies">Policies</Link></li>
              </ul>
            </div>

            {/* Contact / WhatsApp */}
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-neutral-100">
                Support
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-neutral-400">
                <li>
                  <a className="hover:text-white transition" href="mailto:Dblazing22@gmail.com">
                    Dblazing22@gmail.com
                  </a>
                </li>
                <li>
                  <a className="hover:text-white transition" href="tel:+2347018239270">
                    +234 701 823 9270
                  </a>
                </li>
              </ul>

              <a
                href="https://wa.me/2347018239270"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 transition shadow-[0_0_0_0_rgba(16,185,129,0.45)] hover:shadow-[0_0_24px_2px_rgba(16,185,129,0.25)]"
              >
                Chat on WhatsApp
              </a>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-neutral-100">
                Newsletter
              </h4>
              <p className="mt-4 text-sm text-neutral-400">
                Be first to know about drops & deals.
              </p>
              <form onSubmit={handleEmailSubmit} className="mt-4 flex items-center gap-2">
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20 ring-1 ring-white/10"
                >
                  Join
                </button>
              </form>

              {/* Socials */}
              <div className="mt-6 flex items-center gap-4">
                <a
                  href="https://instagram.com/R2blazewristwatchh"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition"
                >
                  {/* Instagram glyph */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm6.5-.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@r2blazewristwatch"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition"
                >
                  {/* TikTok glyph */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
                    <path d="M14 3c.4 2.3 1.8 4 4 4V9c-1.8 0-3.3-.5-4.5-1.5V15a6 6 0 1 1-6-6c.4 0 .8 0 1.2.1V11a3.9 3.9 0 0 0-1.2-.2A3 3 0 1 0 11 14V3h3Z" />
                  </svg>
                </a>
                <a
                  href="https://www.snapchat.com/add/donblazing"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Snapchat"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition"
                >
                  {/* Ghost glyph */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
                    <path d="M12 2c4 0 7 3.2 7 7.2 0 1.4-.4 2.6-.9 3.6.7.4 1.6.7 2.5.9-.3 1.2-1.4 2.3-3.4 2.2-.6 0-1.1-.1-1.6-.2-.7.8-2.1 1.7-3.6 1.7s-2.9-.9-3.6-1.7c-.5.1-1 .2-1.6.2-2 .1-3.1-1-3.4-2.2.9-.2 1.8-.5 2.5-.9-.5-1-.9-2.2-.9-3.6C5 5.2 8 2 12 2Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500">
              &copy; {new Date().getFullYear()} R2blaze. All rights reserved.
            </p>
            <div className="mt-2">
    <Link
      to="/admin/login"
      className="text-gray-400 hover:text-emerald-700 hover:underline"
      rel="nofollow"
    >
      Team Login
    </Link>
  </div>
            <div className="flex items-center gap-6 text-xs text-neutral-400">
              <Link className="hover:text-white transition" to="/policies#privacy">Privacy</Link>
              <Link className="hover:text-white transition" to="/policies#terms">Terms</Link>
              <Link className="hover:text-white transition" to="/policies#shipping">Shipping</Link>
              <Link className="hover:text-white transition" to="/policies#returns">Returns</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
