import { Link, NavLink } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../store/cart'
import { STORE } from '../config'

export default function Navbar() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0))
  const link = (isActive: boolean) =>
    `px-3 py-2 rounded-md transition hover:bg-green-100 hover:text-green-700 ${isActive ? 'text-green-700' : ''}`

  return (
    <header className="sticky top-0 z-40 bg-white/80 ">
      {/* Let content define height instead of hard-coding h-16 */}
      <nav className="container mx-auto max-w-6xl px-4 py-2 md:py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            src="/images/donlogo.webp"
            alt={`${STORE.name} logo`}
            className="h-16 md:h-20 lg:h-24 max-h-[20vh] w-auto object-contain block"
            loading="eager"
            decoding="async"
          />
          {/* <span className="font-bold text-xl md:text-2xl">{STORE.name}</span> */}
        </Link>

        <div className="flex items-center gap-2">
        <NavLink to="/" className={({isActive}) => link(isActive)}>Home</NavLink>
          <NavLink to="/products" className={({isActive}) => link(isActive)}>Shop</NavLink>
          <NavLink to="/about" className={({isActive}) => link(isActive)}>About</NavLink>
          <NavLink to="/policies" className={({isActive}) => link(isActive)}>Policies</NavLink>
          <NavLink to="/cart" className="relative px-2 py-2 rounded-md hover:bg-green-100">
            <ShoppingCart />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-green-600 text-white rounded-full px-1">{count}</span>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  )
}


