import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQty: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;

  // Computed
  totalItems: () => number;
  totalPrice: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        isOpen: false,

        addItem: (newItem) =>
          set((state) => {
            const existing = state.items.find(
              (i) => i.productId === newItem.productId && i.variant === newItem.variant
            );
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.productId === newItem.productId && i.variant === newItem.variant
                    ? { ...i, quantity: i.quantity + newItem.quantity }
                    : i
                ),
              };
            }
            return { items: [...state.items, newItem] };
          }),

        removeItem: (productId, variant) =>
          set((state) => ({
            items: state.items.filter(
              (i) => !(i.productId === productId && i.variant === variant)
            ),
          })),

        updateQty: (productId, quantity, variant) => {
          if (quantity <= 0) {
            get().removeItem(productId, variant);
            return;
          }
          set((state) => ({
            items: state.items.map((i) =>
              i.productId === productId && i.variant === variant
                ? { ...i, quantity }
                : i
            ),
          }));
        },

        clearCart: () => set({ items: [] }),

        toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

        totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

        totalPrice: () =>
          get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

        subtotal: () => get().totalPrice(),
      }),
      {
        name: "shopforge-cart",
        // Only persist items, not UI state
        partialize: (state) => ({ items: state.items }),
      }
    ),
    { name: "CartStore" }
  )
);
