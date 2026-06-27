import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export async function createPaymentIntent(amount: number, currency = 'usd', metadata?: Record<string, string>) {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  })
}

export async function createCheckoutSession(params: {
  lineItems: Array<{ price: string; quantity: number }>
  successUrl: string
  cancelUrl: string
  customerId?: string
  metadata?: Record<string, string>
}) {
  return stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: params.lineItems,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer: params.customerId,
    metadata: params.metadata,
    shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'AU'] },
    automatic_tax: { enabled: true },
  })
}
