import { Link, NavLink } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../store/cart'
import { STORE } from '../config'

export default function Navbar() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0))
  const link = (isActive: boolean) => `px-3 py-2 rounded-md transition hover:bg-green-100 hover:text-green-700 ${isActive ? 'text-green-700' : ''}`

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <nav className="container mx-auto max-w-6xl h-16 px-4 flex items-center justify-between">
        {/* Logo with a link to the homepage */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/images/donlogo.webp"  
            alt="Logo"
            className="h-8"  
          />
          <span className="font-bold text-lg">{STORE.name}</span>
        </Link>

        <div className="flex items-center gap-2">
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
