import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Phone } from "lucide-react";
import { useCart } from "../store/cart";
import { STORE } from "../config";

export default function Navbar() {
  const itemCount = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const panelRef = useRef<HTMLDivElement | null>(null);

  // close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // add soft shadow when scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = (isActive: boolean) =>
    [
      "px-3 py-2 rounded-md text-sm font-medium transition-[color,background,box-shadow]",
      "hover:bg-emerald-50 hover:text-emerald-800",
      isActive ? "text-emerald-700" : "text-gray-700",
    ].join(" ");

  return (
    <header
      className={[
        "sticky top-0 z-40 border-b",
        "bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60",
        scrolled ? "shadow-sm border-gray-200" : "border-transparent",
      ].join(" ")}
      role="banner"
    >
      {/* Announcement (optional; hide if you don’t need) */}
      <div className="hidden md:block text-center text-xs text-gray-600 py-1">
        Free delivery on orders over ₦150,000 • 7-day returns
      </div>

      <nav
        className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-2 md:py-3 flex items-center justify-between"
        aria-label="Primary"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0" aria-label={`${STORE.name} home`}>
          <img
            src="/images/donlogo.webp"
            alt={`${STORE.name} logo`}
            className="h-12 sm:h-14 md:h-16 w-auto object-contain"
            loading="eager"
            decoding="async"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={({ isActive }) => linkClass(isActive)}>Home</NavLink>
          <NavLink to="/products" className={({ isActive }) => linkClass(isActive)}>Shop</NavLink>
          <NavLink to="/about" className={({ isActive }) => linkClass(isActive)}>About</NavLink>
          <NavLink to="/policies" className={({ isActive }) => linkClass(isActive)}>Policies</NavLink>
          <NavLink to="/contact" className={({ isActive }) => linkClass(isActive)}>Contact Us</NavLink>

          {/* Right actions */}
          <div className="ml-2 flex items-center gap-1">
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 px-2 py-2 rounded-md hover:bg-emerald-50"
              aria-label="Open cart"
              title="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 rounded-full bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 leading-none
                             shadow ring-1 ring-white animate-[pop_160ms_ease-out]"
                >
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Optional quick WhatsApp contact */}
            <a
              href="https://wa.me/2347018239270"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm text-gray-900 hover:bg-gray-50"
            >
              <Phone className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Mobile actions */}
        <div className="md:hidden flex items-center gap-1">
          <Link to="/cart" className="relative p-2 rounded-md hover:bg-emerald-50" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 text-[10px] leading-none bg-emerald-600 text-white rounded-full px-1.5 py-0.5 shadow ring-1 ring-white">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-md hover:bg-emerald-50"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className={[
          "md:hidden overflow-hidden border-t bg-white transition-[max-height,opacity] duration-300 ease-out",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-2">
          <div className="flex flex-col gap-1">
            {[
              { to: "/", label: "Home" },
              { to: "/products", label: "Shop" },
              { to: "/about", label: "About" },
              { to: "/policies", label: "Policies" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `block ${linkClass(isActive)} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500`
                }
              >
                {l.label}
              </NavLink>
            ))}

            {/* Quick info row */}
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border p-2 text-center text-gray-700 bg-white">Free delivery ₦150k+</div>
              <div className="rounded-lg border p-2 text-center text-gray-700 bg-white">7-day returns</div>
            </div>

            {/* Contact shortcuts */}
            <div className="mt-2 flex gap-2">
              <a
                href="https://wa.me/2347018239270"
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-white text-sm font-medium hover:bg-emerald-700"
              >
                <Phone className="h-4 w-4 mr-1.5" /> WhatsApp
              </a>
              <Link
                to="/cart"
                className="flex-1 inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile menu (click to close) */}
      {open && (
        <button
          aria-hidden
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
        />
      )}
    </header>
  );
}

/* tiny pop animation */
declare global {
  interface CSSStyleDeclaration {
    [key: `--${string}`]: string | undefined;
  }
}
