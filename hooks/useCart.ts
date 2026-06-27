'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Cart, CartItem, Product, ProductVariant } from '@/types'

interface CartStore extends Cart {
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart: () => void
}

function calcSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const base = item.product.price + (item.variant?.priceModifier ?? 0)
    return sum + base * item.quantity
  }, 0)
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      itemCount: 0,

      addItem(product, quantity = 1, variant) {
        const items = get().items
        const key = variant ? variant.id : product.id
        const existing = items.find((i) =>
          i.productId === product.id && (variant ? i.variantId === variant.id : !i.variantId),
        )

        let updated: CartItem[]
        if (existing) {
          updated = items.map((i) =>
            (variant ? i.variantId === variant.id : i.productId === product.id && !i.variantId)
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          )
        } else {
          updated = [
            ...items,
            { productId: product.id, product, quantity, variantId: variant?.id, variant },
          ]
        }

        set({
          items: updated,
          subtotal: calcSubtotal(updated),
          itemCount: updated.reduce((s, i) => s + i.quantity, 0),
        })
      },

      removeItem(productId, variantId) {
        const updated = get().items.filter((i) =>
          variantId ? i.variantId !== variantId : i.productId !== productId,
        )
        set({ items: updated, subtotal: calcSubtotal(updated), itemCount: updated.reduce((s, i) => s + i.quantity, 0) })
      },

      updateQuantity(productId, quantity, variantId) {
        if (quantity <= 0) {
          get().removeItem(productId, variantId)
          return
        }
        const updated = get().items.map((i) =>
          (variantId ? i.variantId === variantId : i.productId === productId) ? { ...i, quantity } : i,
        )
        set({ items: updated, subtotal: calcSubtotal(updated), itemCount: updated.reduce((s, i) => s + i.quantity, 0) })
      },

      clearCart() {
        set({ items: [], subtotal: 0, itemCount: 0 })
      },
    }),
    { name: 'shopforge-cart' },
  ),
)
