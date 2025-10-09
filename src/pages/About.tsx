import React from "react";
import { Link } from "react-router-dom";
import don from "../assets/images/don.jpeg"

export default function About() {
  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_400px_at_100%_-10%,rgba(16,185,129,0.06),transparent_60%)]">
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-neutral-900" />
        <div
          className="absolute inset-0 -z-10 opacity-50"
          style={{ background: "radial-gradient(900px 400px at 80% 10%, #10B98155, transparent 60%)" }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              About <span className="text-emerald-300">R2blaze</span>
            </h1>
            <p className="mt-4 text-lg text-white/80">
              We curate original, durable timepieces—backed by personal service, fair pricing,
              and fast delivery across Nigeria.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-500 transition shadow-[0_0_0_0_rgba(16,185,129,0.45)] hover:shadow-[0_0_24px_2px_rgba(16,185,129,0.25)]"
              >
                Shop Watches
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-5 py-2.5 font-medium text-white hover:bg-white/20 transition"
              >
                Talk to Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { k: "4.8★", v: "Average Rating" },
            { k: "10k+", v: "Orders Delivered" },
            { k: "50+", v: "Brands Stocked" },
            { k: "7-day", v: "Easy Returns" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-emerald-700">{s.k}</div>
              <div className="text-xs text-gray-500 mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
              A modern watch house, built on trust
            </h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Founded in 2023, R2blaze began with a simple promise: <b>authentic watches,
              clear pricing, and human support</b>. Today, we partner with trusted suppliers and
              makers to bring you everyday pieces and statement models, each vetted for quality,
              warranty, and long-term durability.
            </p>
            <p className="mt-3 text-gray-700 leading-relaxed">
              Whether you’re buying your first timepiece or adding to a collection, our team helps
              you choose confidently—with fast shipping and attentive after-sales care.
            </p>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-gray-200 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1600&auto=format&fit=crop"
                alt="Watch detail"
                className="w-full h-full object-cover max-h-[460px]"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/40 to-transparent text-white text-sm">
                Everyday durability • Thoughtful design • Genuine materials
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
        <h3 className="text-xl font-semibold text-gray-900">What we stand for</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Authenticity",
              text:
                "Only original products from verified sources. Warranties honored; no compromises.",
            },
            {
              title: "Fair Pricing",
              text:
                "Direct relationships and lean ops mean better value premium without the markup.",
            },
            {
              title: "Care & Support",
              text:
                "From WhatsApp advice to after sales service, we’re here long after checkout.",
            },
          ].map((v, i) => (
            <div key={i} className="rounded-2xl bg-white ring-1 ring-gray-200 p-5 shadow-sm">
              <div className="text-emerald-700 font-semibold">{v.title}</div>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h3 className="text-xl font-semibold text-gray-900">Our journey</h3>
        <ol className="mt-6 relative border-s border-gray-200">
          {[
            {
              date: "2023",
              h: "R2blaze is founded",
              p: "We launch online with a small but mighty catalog focused on everyday watches.",
            },
            {
              date: "2024",
              h: "More brands, faster shipping",
              p: "We expand our selection and streamline logistics across Nigeria.",
            },
            {
              date: "Today",
              h: "Community & curation",
              p: "We keep the focus on quality, authenticity, and helpful service.",
            },
          ].map((t, i) => (
            <li key={i} className="mb-8 ms-4">
              <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-emerald-600" />
              <time className="text-xs text-gray-500">{t.date}</time>
              <h4 className="text-base font-semibold text-gray-900">{t.h}</h4>
              <p className="text-sm text-gray-700 mt-1">{t.p}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FOUNDER NOTE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl bg-white ring-1 ring-gray-200 p-6 md:p-8 shadow-sm grid md:grid-cols-[auto_1fr] gap-6 items-center">
          <img
            // src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800&auto=format&fit=crop"
            src={don}
            alt="Founder"
            className="h-20 w-20 rounded-full object-cover ring-2 ring-emerald-200"
          />
          <div>
            <p className="text-gray-800 leading-relaxed">
              “We built R2blaze for people who care about what’s on their wrist and how it’s made.
              Thank you for trusting us with your time.”
            </p>
            <div className="mt-2 text-sm text-gray-500">— The R2blaze Team</div>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-3xl bg-neutral-900 text-neutral-100 overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: "radial-gradient(800px 300px at 80% 0%, #10B98188, transparent 60%)" }}
          />
          <div className="relative p-6 md:p-10">
            <div className="md:flex md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h3 className="text-2xl font-semibold">Join our journey</h3>
                <p className="mt-2 text-sm text-neutral-300">
                  Explore new arrivals, limited drops, and everyday classics—delivered fast, backed by our team.
                </p>
              </div>
              <div className="mt-5 md:mt-0 flex gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-500 transition"
                >
                  Shop Now
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-5 py-2.5 font-medium text-white hover:bg-white/20 transition"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOT NOTE */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <p className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} R2blaze. All rights reserved.
        </p>
      </div>
    </div>
  );
}

