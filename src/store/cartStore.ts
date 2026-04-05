import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartProduct {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  nameAr: string;
  price: number;
  image: string;
  sku: string;
  coffretPrice?: number | null;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
  packaging: "simple" | "coffret";
  packagingPrice: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: CartProduct, quantity?: number, packaging?: "simple" | "coffret") => void;
  removeItem: (productId: string, packaging?: "simple" | "coffret") => void;
  updateQuantity: (productId: string, quantity: number, packaging?: "simple" | "coffret") => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

const itemKey = (productId: string, packaging: "simple" | "coffret") =>
  `${productId}__${packaging}`;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, packaging = "simple") => {
        const packagingPrice =
          packaging === "coffret" ? (product.coffretPrice ?? 0) : 0;
        set((state) => {
          const existing = state.items.find(
            (item) => itemKey(item.product.id, item.packaging) === itemKey(product.id, packaging)
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                itemKey(item.product.id, item.packaging) === itemKey(product.id, packaging)
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, quantity, packaging, packagingPrice }] };
        });
      },

      removeItem: (productId, packaging = "simple") => {
        set((state) => ({
          items: state.items.filter(
            (item) => itemKey(item.product.id, item.packaging) !== itemKey(productId, packaging)
          ),
        }));
      },

      updateQuantity: (productId, quantity, packaging = "simple") => {
        if (quantity <= 0) {
          get().removeItem(productId, packaging);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            itemKey(item.product.id, item.packaging) === itemKey(productId, packaging)
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + (item.product.price + item.packagingPrice) * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "ziziwatches-cart",
    }
  )
);
