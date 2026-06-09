import { create } from "zustand";
import { persist } from "zustand/middleware";
import { trackPixelEvent } from "@/lib/pixel-tracking";
import { logEvent } from "@/lib/analytics";

export type CartItem = {
  product_id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  add: (item: CartItem) => void;
  remove: (product_id: string, size?: string, color?: string) => void;
  updateQty: (product_id: string, qty: number, size?: string, color?: string) => void;
  clear: () => void;
  toggle: (open?: boolean) => void;
  total: () => number;
  count: () => number;
};

const sameLine = (a: CartItem, p: string, s?: string, c?: string) =>
  a.product_id === p && (a.size ?? "") === (s ?? "") && (a.color ?? "") === (c ?? "");

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      add: (item) => {
        trackPixelEvent("AddToCart", {
          content_ids: [item.product_id],
          content_name: item.name,
          content_type: "product",
          value: item.price * item.quantity,
          currency: "EGP",
        });
        logEvent("add_to_cart", { product_id: item.product_id, metadata: { name: item.name, qty: item.quantity, price: item.price } });
        set((state) => {
          const existing = state.items.find((i) => sameLine(i, item.product_id, item.size, item.color));
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameLine(i, item.product_id, item.size, item.color)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },
      remove: (p, s, c) =>
        set((state) => ({ items: state.items.filter((i) => !sameLine(i, p, s, c)) })),
      updateQty: (p, qty, s, c) =>
        set((state) => ({
          items: state.items.map((i) =>
            sameLine(i, p, s, c) ? { ...i, quantity: Math.max(1, qty) } : i,
          ),
        })),
      clear: () => set({ items: [] }),
      toggle: (open) => set((s) => ({ isOpen: open ?? !s.isOpen })),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "haskell-cart" },
  ),
);
