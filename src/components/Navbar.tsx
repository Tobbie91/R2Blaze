import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../store/cart";
import { STORE } from "../config";

export default function Navbar() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const [open, setOpen] = useState(false);
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

  const link = (isActive: boolean) =>
    `px-3 py-2 rounded-md transition hover:bg-green-100 hover:text-green-700 ${
      isActive ? "text-green-700" : "text-gray-700"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <nav className="mx-auto max-w-6xl px-3 sm:px-4 md:px-6 py-2 md:py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
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
          <NavLink to="/" className={({ isActive }) => link(isActive)}>
            Home
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => link(isActive)}>
            Shop
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => link(isActive)}>
            About
          </NavLink>
          <NavLink to="/policies" className={({ isActive }) => link(isActive)}>
            Policies
          </NavLink>

          <NavLink to="/cart" className="relative ml-2 px-2 py-2 rounded-md hover:bg-green-100">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] leading-none bg-green-600 text-white rounded-full px-1.5 py-0.5">
                {count}
              </span>
            )}
          </NavLink>
        </div>

        {/* Mobile actions */}
        <div className="md:hidden flex items-center gap-1">
          <Link to="/cart" className="relative p-2 rounded-md hover:bg-green-100">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 text-[10px] leading-none bg-green-600 text-white rounded-full px-1.5 py-0.5">
                {count}
              </span>
            )}
          </Link>
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-md hover:bg-green-100"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet (slide-down) */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className={`md:hidden overflow-hidden border-b border-t bg-white transition-[max-height,opacity] duration-300 ease-out ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-6xl px-3 sm:px-4 md:px-6 py-2">
          <div className="flex flex-col gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block ${link(isActive)}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `block ${link(isActive)}`
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block ${link(isActive)}`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/policies"
              className={({ isActive }) =>
                `block ${link(isActive)}`
              }
            >
              Policies
            </NavLink>

            {/* Optional: promo / contact row */}
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border p-2 text-center text-gray-700">
                Free delivery ₦150k+
              </div>
              <div className="rounded-lg border p-2 text-center text-gray-700">
                7-day returns
              </div>
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

