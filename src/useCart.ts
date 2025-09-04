import { create } from 'zustand';

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
};

export const useCart = create<CartState>((set) => ({
  items: [],
  addToCart: (item) => set((state) => ({ items: [...state.items, item] })),
  updateQty: (id, qty) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? { ...item, qty } : item
    ),
  })),
  remove: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),
}));
