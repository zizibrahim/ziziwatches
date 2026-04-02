import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartProduct } from "./cartStore";

interface WishlistStore {
  items: CartProduct[];
  addItem: (product: CartProduct) => void;
  removeItem: (productId: string) => void;
  toggle: (product: CartProduct) => void;
  isWished: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        if (!get().isWished(product.id)) {
          set((s) => ({ items: [...s.items, product] }));
        }
      },
      removeItem: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== productId) })),
      toggle: (product) => {
        get().isWished(product.id)
          ? get().removeItem(product.id)
          : get().addItem(product);
      },
      isWished: (productId) => get().items.some((i) => i.id === productId),
    }),
    { name: "ziziwatches-wishlist" }
  )
);
