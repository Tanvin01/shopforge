'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, subtotal, itemCount, updateQuantity, removeItem } = useCart()

  const tax = subtotal * 0.08
  const shipping = subtotal >= 75 ? 0 : 9.99
  const total = subtotal + tax + shipping

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <svg className="mx-auto h-20 w-20 text-gray-200 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/products" className="inline-flex items-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-colors">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart ({itemCount} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.variantId ?? item.productId} className="flex gap-5 rounded-xl border border-gray-200 p-5">
              <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                {item.product.images[0] ? (
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-300">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <Link href={`/products/${item.product.slug}`} className="font-medium text-gray-900 hover:text-orange-600">
                      {item.product.name}
                    </Link>
                    {item.variant && (
                      <p className="text-sm text-gray-500">{item.variant.name}: {item.variant.value}</p>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900 ml-4">
                    {formatPrice((item.product.price + (item.variant?.priceModifier ?? 0)) * item.quantity)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                      className="flex h-8 w-8 items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
                    >–</button>
                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                      className="flex h-8 w-8 items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-gray-200 p-6 h-fit space-y-4">
          <h2 className="font-semibold text-gray-900">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Estimated Tax</span><span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-gray-900 pt-3 border-t">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>
          {subtotal < 75 && (
            <p className="text-xs text-orange-600 bg-orange-50 rounded-lg p-3">
              Add {formatPrice(75 - subtotal)} more for free shipping!
            </p>
          )}
          <Link
            href="/checkout"
            className="block w-full rounded-lg bg-orange-500 hover:bg-orange-600 py-3 text-center text-sm font-semibold text-white transition-colors"
          >
            Proceed to Checkout
          </Link>
          <Link href="/products" className="block text-center text-sm text-gray-500 hover:text-gray-700">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
