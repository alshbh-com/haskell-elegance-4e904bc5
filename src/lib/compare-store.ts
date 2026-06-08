import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CompareItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compare_price: number | null;
  image?: string;
};

type CompareState = {
  items: CompareItem[];
  toggle: (item: CompareItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
};

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) => {
        const exists = get().items.find((i) => i.id === item.id);
        if (exists) {
          set({ items: get().items.filter((i) => i.id !== item.id) });
        } else {
          if (get().items.length >= 4) return;
          set({ items: [...get().items, item] });
        }
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      clear: () => set({ items: [] }),
      has: (id) => !!get().items.find((i) => i.id === id),
    }),
    { name: "haskell_compare" },
  ),
);
