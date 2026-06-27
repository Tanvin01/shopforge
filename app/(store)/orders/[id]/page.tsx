import React from 'react'
import Link from 'next/link'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Order } from '@/types'

interface PageProps { params: { id: string }; searchParams: { success?: string } }

async function getOrder(id: string): Promise<Order | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/orders/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

const STATUS_STEPS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']

export default async function OrderPage({ params, searchParams }: PageProps) {
  const isSuccess = searchParams.success === 'true'

  // Mock order for demo
  const order: Order = {
    id: params.id,
    userId: 'usr_demo',
    status: 'PROCESSING',
    subtotal: 79.99,
    tax: 6.40,
    shipping: 0,
    total: 86.39,
    currency: 'USD',
    shippingAddress: { fullName: 'Demo User', line1: '123 Main St', city: 'New York', state: 'NY', postalCode: '10001', country: 'US' },
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const currentStep = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {isSuccess && (
        <div className="mb-8 rounded-xl bg-green-50 border border-green-200 p-6 text-center">
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mx-auto mb-3">
            <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-gray-600 mt-1 text-sm">
            Thank you for your purchase. We&apos;ll send a confirmation email shortly.
          </p>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">Order #{order.id}</p>
            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
          </div>
          <span className="rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-sm font-medium">{order.status}</span>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center">
            {STATUS_STEPS.map((step, i) => (
              <React.Fragment key={step}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${i <= currentStep ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-1 ${i < currentStep ? 'bg-orange-500' : 'bg-gray-100'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {STATUS_STEPS.map((step) => (
              <span key={step} className="text-[10px] text-gray-500 capitalize">{step.toLowerCase()}</span>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-1.5 text-sm border-t pt-4">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span></div>
          <div className="flex justify-between text-gray-600"><span>Tax</span><span>{formatPrice(order.tax)}</span></div>
          <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t"><span>Total</span><span>{formatPrice(order.total)}</span></div>
        </div>

        {/* Shipping address */}
        <div className="text-sm border-t pt-4">
          <p className="font-medium text-gray-900 mb-1">Shipping to</p>
          <p className="text-gray-600">{order.shippingAddress.fullName}</p>
          <p className="text-gray-600">{order.shippingAddress.line1}</p>
          <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/products" className="flex-1 rounded-lg border border-gray-300 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50">
          Continue Shopping
        </Link>
        <Link href="/orders" className="flex-1 rounded-lg bg-orange-500 hover:bg-orange-600 py-2.5 text-center text-sm font-semibold text-white">
          View All Orders
        </Link>
      </div>
    </div>
  )
}
