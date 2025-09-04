import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../data/products'

export type CartItem = {
  id: string
  name: string
  slug: string
  price: number
  image: string
  qty: number
}

type CartState = {
  items: CartItem[]
  add: (p: Product, qty?: number) => void
  remove: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (p, qty = 1) => {
        const items = [...get().items]
        const idx = items.findIndex((i) => i.id === p.id)
        if (idx >= 0) items[idx].qty += qty
        else items.push({ id: p.id, name: p.name, slug: p.slug, price: p.price, image: p.images[0], qty })
        set({ items })
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQty: (id, qty) => set({ items: get().items.map((i) => (i.id === id ? { ...i, qty } : i)) }),
      clear: () => set({ items: [] }),
    }),
    { name: 'watchstore_cart' }
  )
)
