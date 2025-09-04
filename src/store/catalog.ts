// src/store/catalog.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Gender = 'male' | 'female' | 'unisex'
export type Strap = 'metal' | 'leather' | 'rubber' | 'silicon' | 'fabric'

export type Product = {
  id: string
  name: string
  slug: string
  brand: string
  strap: Strap
  gender: Gender
  price: number
  prevPrice?: number
  images: string[]
  description?: string
}

type CatalogState = {
  products: Product[]
  add: (p: Product) => void
  update: (id: string, patch: Partial<Product>) => void
  remove: (id: string) => void
  getBySlug: (slug: string) => Product | undefined
}

export const useCatalog = create<CatalogState>()(
  persist(
    (set, get) => ({
      // Initially, set products to empty array to prevent dummy data
      products: [],  // Empty list initially; can also use [] for real products
      add: (p) => set({ products: [p, ...get().products] }),
      update: (id, patch) =>
        set({ products: get().products.map(x => x.id === id ? { ...x, ...patch } : x) }),
      remove: (id) => set({ products: get().products.filter(x => x.id !== id) }),
      getBySlug: (slug) => get().products.find(p => p.slug === slug),
    }),
    { name: 'r2blaze_catalog' }
  )
)

