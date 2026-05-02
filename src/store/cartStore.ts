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
  variantColor?: string | null;
  variantColorHex?: string | null;
}

interface CartStore {
  items: CartItem[];
  addItem: (
    product: CartProduct,
    quantity?: number,
    packaging?: "simple" | "coffret",
    variant?: { color: string; colorHex?: string | null } | null
  ) => void;
  removeItem: (productId: string, packaging?: "simple" | "coffret", variantColor?: string | null) => void;
  updateQuantity: (productId: string, quantity: number, packaging?: "simple" | "coffret", variantColor?: string | null) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

const itemKey = (
  productId: string,
  packaging: "simple" | "coffret",
  variantColor?: string | null
) => `${productId}__${packaging}__${variantColor ?? ""}`;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, packaging = "simple", variant = null) => {
        const packagingPrice =
          packaging === "coffret" ? (product.coffretPrice ?? 0) : 0;
        const key = itemKey(product.id, packaging, variant?.color);
        set((state) => {
          const existing = state.items.find(
            (item) => itemKey(item.product.id, item.packaging, item.variantColor) === key
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                itemKey(item.product.id, item.packaging, item.variantColor) === key
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                product,
                quantity,
                packaging,
                packagingPrice,
                variantColor: variant?.color ?? null,
                variantColorHex: variant?.colorHex ?? null,
              },
            ],
          };
        });
      },

      removeItem: (productId, packaging = "simple", variantColor = null) => {
        const key = itemKey(productId, packaging, variantColor);
        set((state) => ({
          items: state.items.filter(
            (item) => itemKey(item.product.id, item.packaging, item.variantColor) !== key
          ),
        }));
      },

      updateQuantity: (productId, quantity, packaging = "simple", variantColor = null) => {
        if (quantity <= 0) {
          get().removeItem(productId, packaging, variantColor);
          return;
        }
        const key = itemKey(productId, packaging, variantColor);
        set((state) => ({
          items: state.items.map((item) =>
            itemKey(item.product.id, item.packaging, item.variantColor) === key
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
