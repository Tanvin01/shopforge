'use client'

import React, { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'

interface AddressForm {
  fullName: string
  email: string
  line1: string
  line2: string
  city: string
  state: string
  postalCode: string
  country: string
}

const initialAddress: AddressForm = {
  fullName: '', email: '', line1: '', line2: '',
  city: '', state: '', postalCode: '', country: 'US',
}

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart()
  const [address, setAddress] = useState<AddressForm>(initialAddress)
  const [errors, setErrors] = useState<Partial<AddressForm>>({})
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping')

  const tax = subtotal * 0.08
  const shipping = subtotal > 75 ? 0 : 9.99
  const total = subtotal + tax + shipping

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAddress((p) => ({ ...p, [name]: value }))
    if (errors[name as keyof AddressForm]) {
      setErrors((p) => ({ ...p, [name]: undefined }))
    }
  }

  const validateShipping = (): boolean => {
    const e: Partial<AddressForm> = {}
    if (!address.fullName.trim()) e.fullName = 'Required'
    if (!address.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) e.email = 'Valid email required'
    if (!address.line1.trim()) e.line1 = 'Required'
    if (!address.city.trim()) e.city = 'Required'
    if (!address.state.trim()) e.state = 'Required'
    if (!address.postalCode.trim()) e.postalCode = 'Required'
    if (Object.keys(e).length) { setErrors(e); return false }
    return true
  }

  const handleStripeCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, address }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, name, type = 'text', placeholder, half }: {
    label: string; name: keyof AddressForm; type?: string; placeholder?: string; half?: boolean
  }) => (
    <div className={half ? 'flex-1' : 'w-full'}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={address[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors[name] ? 'border-red-400' : 'border-gray-300'}`}
      />
      {errors[name] && <p className="mt-0.5 text-xs text-red-500">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Shipping Information</h2>
          <div className="space-y-4">
            <Field label="Full Name" name="fullName" placeholder="Jane Smith" />
            <Field label="Email" name="email" type="email" placeholder="jane@example.com" />
            <Field label="Address Line 1" name="line1" placeholder="123 Main St" />
            <Field label="Address Line 2 (optional)" name="line2" placeholder="Apt, suite, etc." />
            <div className="flex gap-3">
              <Field label="City" name="city" placeholder="New York" half />
              <Field label="State" name="state" placeholder="NY" half />
            </div>
            <div className="flex gap-3">
              <Field label="Postal Code" name="postalCode" placeholder="10001" half />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  name="country"
                  value={address.country}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => { if (validateShipping()) handleStripeCheckout() }}
          disabled={loading || items.length === 0}
          className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 px-6 py-3.5 text-base font-semibold text-white transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          )}
          {loading ? 'Redirecting to Stripe...' : `Pay ${formatPrice(total)}`}
        </button>
      </div>

      {/* Order summary */}
      <div className="rounded-xl border border-gray-200 p-5 h-fit space-y-4">
        <h3 className="font-semibold text-gray-900">Order Summary</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {items.map((item) => (
            <div key={item.variantId ?? item.productId} className="flex justify-between text-sm">
              <span className="text-gray-600 truncate pr-2">
                {item.product.name} × {item.quantity}
              </span>
              <span className="font-medium flex-shrink-0">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax (8%)</span><span>{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>
        </div>
        {subtotal < 75 && (
          <p className="text-xs text-gray-500">
            Add {formatPrice(75 - subtotal)} more for free shipping!
          </p>
        )}
      </div>
    </div>
  )
}
