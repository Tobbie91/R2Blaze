import React from "react";
import { Link } from "react-router-dom";

export default function Policies() {
  const lastUpdated = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_400px_at_100%_-10%,rgba(16,185,129,0.06),transparent_60%)]">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-neutral-900" />
        <div
          className="absolute inset-0 -z-10 opacity-50"
          style={{ background: "radial-gradient(900px 400px at 80% 10%, #10B98155, transparent 60%)" }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Policies</h1>
            <p className="mt-3 text-white/80">
              Please review how we handle privacy, terms, shipping, and returns.
            </p>
            <p className="mt-1 text-sm text-white/60">Last updated: {lastUpdated}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid lg:grid-cols-[260px,1fr] gap-8 lg:gap-12 items-start">
          {/* TOC (sticky on desktop) */}
          <aside className="lg:sticky lg:top-24">
            <nav aria-label="Table of contents" className="rounded-2xl bg-white/90 backdrop-blur ring-1 ring-gray-200 p-4">
              <div className="text-sm font-semibold text-gray-900">On this page</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a className="text-gray-700 hover:text-emerald-700" href="#privacy">Privacy Policy</a></li>
                <li><a className="text-gray-700 hover:text-emerald-700" href="#terms">Terms & Conditions</a></li>
                <li><a className="text-gray-700 hover:text-emerald-700" href="#returns">Return Policy</a></li>
                <li><a className="text-gray-700 hover:text-emerald-700" href="#shipping">Shipping Policy</a></li>
                <li><a className="text-gray-700 hover:text-emerald-700" href="#faq">FAQ</a></li>
                <li><a className="text-gray-700 hover:text-emerald-700" href="#contact">Need Help?</a></li>
              </ul>
            </nav>
          </aside>

          {/* Main content */}
          <article className="space-y-10">
            {/* Privacy */}
            <section id="privacy" className="scroll-mt-28">
              <header className="mb-3">
                <h2 className="text-2xl font-semibold text-gray-900">Privacy Policy</h2>
                <p className="text-sm text-gray-500">How we collect, use, and protect your data.</p>
              </header>

              <div className="rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm p-6">
                <p className="text-gray-700">
                  At R2blaze, we prioritize the protection of your personal data. This summary explains what we collect
                  and how we use it.
                </p>
                <ul className="mt-4 space-y-2 text-gray-700 list-disc list-inside">
                  <li>
                    <b>Data Collection</b>: We collect details such as your name, email, address, and payment info when
                    you create an account or place an order.
                  </li>
                  <li>
                    <b>Data Usage</b>: Your data enables order processing, delivery updates, promotions (opt-in), and
                    customer support.
                  </li>
                  <li>
                    <b>Security</b>: We use encryption and industry-standard protocols to protect your information.
                  </li>
                  <li>
                    <b>Your Rights</b>: You can access, correct, or delete your data by contacting our support team.
                  </li>
                </ul>
                <p className="mt-4 text-sm text-gray-500">
                  For questions, see <a href="#contact" className="text-emerald-700 hover:underline">Contact</a>.
                </p>
              </div>
            </section>

            {/* Terms */}
            <section id="terms" className="scroll-mt-28">
              <header className="mb-3">
                <h2 className="text-2xl font-semibold text-gray-900">Terms & Conditions</h2>
                <p className="text-sm text-gray-500">Using our website and services.</p>
              </header>

              <div className="rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm p-6">
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li>
                    <b>Product Availability</b>: Items are subject to availability; prices may change without notice.
                  </li>
                  <li>
                    <b>Order Cancellation</b>: We may cancel orders due to payment issues or stock constraints. You will
                    be notified and refunded where applicable.
                  </li>
                  <li>
                    <b>Intellectual Property</b>: Site content is owned by R2blaze. Unauthorised use is prohibited.
                  </li>
                  <li>
                    <b>Limitation of Liability</b>: We are not liable for indirect or consequential damages arising from
                    use of our services.
                  </li>
                </ul>
              </div>
            </section>

            {/* Returns */}
            <section id="returns" className="scroll-mt-28">
              <header className="mb-3">
                <h2 className="text-2xl font-semibold text-gray-900">Return Policy</h2>
                <p className="text-sm text-gray-500">How returns and refunds work.</p>
              </header>

              <div className="rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm p-6">
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li>
                    <b>Eligibility</b>: Items must be unused, in original packaging, with all tags/accessories.
                  </li>
                  <li>
                    <b>Window</b>: Contact us within <b>5 days</b> of delivery to initiate a return.
                  </li>
                  <li>
                    <b>Process</b>: Reach us on WhatsApp or email with your order number and reason. We’ll share the
                    return address and steps.
                  </li>
                  <li>
                    <b>Refunds</b>: Issued to the original payment method within <b>5 business days</b> after inspection.
                  </li>
                  <li>
                    <b>Exclusions</b>: Personalised, worn, or clearance items may be ineligible.
                  </li>
                </ul>
              </div>
            </section>

            {/* Shipping */}
            <section id="shipping" className="scroll-mt-28">
              <header className="mb-3">
                <h2 className="text-2xl font-semibold text-gray-900">Shipping Policy</h2>
                <p className="text-sm text-gray-500">Delivery methods, costs, and timelines.</p>
              </header>

              <div className="rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm p-6">
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li>
                    <b>Methods</b>: Standard, expedited, and express options at checkout.
                  </li>
                  <li>
                    <b>Costs</b>: Calculated by destination and order weight/size.
                  </li>
                  <li>
                    <b>Processing</b>: Orders typically process within <b>3 business days</b>. Tracking is provided when
                    shipped.
                  </li>
                  <li>
                    <b>International</b>: Duties/taxes may apply and are the recipient’s responsibility.
                  </li>
                </ul>
              </div>
            </section>

            {/* FAQ (collapsible without extra deps) */}
            <section id="faq" className="scroll-mt-28">
              <header className="mb-3">
                <h2 className="text-2xl font-semibold text-gray-900">Frequently Asked Questions</h2>
                <p className="text-sm text-gray-500">Quick answers to common questions.</p>
              </header>

              <div className="space-y-3">
                <details className="group rounded-2xl bg-white ring-1 ring-gray-200 p-5 shadow-sm">
                  <summary className="cursor-pointer select-none text-gray-900 font-medium flex items-center justify-between">
                    How do I track my order?
                    <span className="ml-3 text-gray-400 group-open:rotate-180 transition">▾</span>
                  </summary>
                  <p className="mt-2 text-gray-700">
                    Once shipped, we’ll send a tracking link via email/WhatsApp. You can also check your Orders page.
                  </p>
                </details>

                <details className="group rounded-2xl bg-white ring-1 ring-gray-200 p-5 shadow-sm">
                  <summary className="cursor-pointer select-none text-gray-900 font-medium flex items-center justify-between">
                    Can I change or cancel my order?
                    <span className="ml-3 text-gray-400 group-open:rotate-180 transition">▾</span>
                  </summary>
                  <p className="mt-2 text-gray-700">
                    If your order hasn’t shipped yet, contact us ASAP and we’ll help update or cancel it.
                  </p>
                </details>

                <details className="group rounded-2xl bg-white ring-1 ring-gray-200 p-5 shadow-sm">
                  <summary className="cursor-pointer select-none text-gray-900 font-medium flex items-center justify-between">
                    What’s covered under returns?
                    <span className="ml-3 text-gray-400 group-open:rotate-180 transition">▾</span>
                  </summary>
                  <p className="mt-2 text-gray-700">
                    Eligible items in original condition/packaging within 5 days of delivery (see Return Policy above).
                  </p>
                </details>
              </div>
            </section>

            {/* Contact */}
            <section id="contact" className="scroll-mt-28">
              <header className="mb-3">
                <h2 className="text-2xl font-semibold text-gray-900">Need Help?</h2>
                <p className="text-sm text-gray-500">We’re here to assist.</p>
              </header>

              <div className="rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm p-6">
                <p className="text-gray-700">
                  For any policy questions or support with an order, reach us on WhatsApp or email.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://wa.me/2347018239270"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-white font-medium hover:bg-emerald-500 transition"
                  >
                    Chat on WhatsApp
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-900 font-medium hover:bg-gray-50 transition"
                  >
                  Email Support
                  </Link>
             
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-900 font-medium hover:bg-gray-50 transition"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </section>

            {/* Footer note links (deep links align with your TOC ids) */}
            <div className="text-sm text-gray-500">
              Quick links:{" "}
              <Link className="text-emerald-700 hover:underline" to="/policies#privacy">Privacy</Link>{" "}
              •{" "}
              <Link className="text-emerald-700 hover:underline" to="/policies#terms">Terms</Link>{" "}
              •{" "}
              <Link className="text-emerald-700 hover:underline" to="/policies#returns">Returns</Link>{" "}
              •{" "}
              <Link className="text-emerald-700 hover:underline" to="/policies#shipping">Shipping</Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
