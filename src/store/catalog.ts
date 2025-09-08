// src/store/catalog.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  strap: 'metal' | 'leather' | 'rubber' | 'silicon' | 'fabric';
  price: number;
  prevPrice?: number;
  images: string[];       // store full URLs (preferred)
  description?: string;
};

type CatalogState = {
  products: Product[];
  add: (p: Product) => void;
  update: (id: string, patch: Partial<Product>) => void;
  remove: (id: string) => void;
  replaceAll: (items: Product[]) => void;       // for Import / seeding
  hydrateFromSeed: () => Promise<void>;         // optional auto-seed
};

const KEY = 'r2blaze_catalog';

export const useCatalog = create<CatalogState>()(
  persist(
    (set, get) => ({
      products: [],

      add: (p) => set({ products: [p, ...get().products] }),

      update: (id, patch) =>
        set({
          products: get().products.map((x) =>
            x.id === id ? { ...x, ...patch } : x
          ),
        }),

      remove: (id) =>
        set({
          products: get().products.filter((x) => x.id !== id),
        }),

      replaceAll: (items) => set({ products: items }),

      // Try to auto-load /public/r2blaze_catalog.json when empty
      hydrateFromSeed: async () => {
        if (get().products.length > 0) return;
        try {
          const res = await fetch('/r2blaze_catalog.json', { cache: 'no-store' });
          if (!res.ok) return;
          const data = await res.json();
          if (Array.isArray(data)) {
            set({ products: data as Product[] });
          }
        } catch (_) {
          // ignore
        }
      },
    }),
    {
      name: KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // You can migrate older shapes here if needed
    }
  )
);
