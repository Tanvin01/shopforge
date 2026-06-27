# ShopForge — Full-Stack E-Commerce Platform

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

A production-ready e-commerce platform with Stripe Checkout, inventory management, order tracking, and an admin dashboard.

## ✨ Features

- **Product Catalog** — Rich product pages with image galleries, variants (size/colour), and SEO metadata
- **Stripe Payments** — Secure checkout with Stripe Elements + webhooks for order fulfilment
- **Cart & Wishlist** — Persistent cart (Zustand + localStorage sync) and user wishlists
- **Order Management** — Full order lifecycle: placed → confirmed → shipped → delivered
- **Admin Dashboard** — Product CRUD, inventory alerts, revenue analytics
- **Discount Codes** — Coupon system with percentage and fixed-amount discounts
- **Reviews & Ratings** — Verified purchase reviews with star ratings
- **Email Receipts** — Automated transactional emails via Resend
- **ISR** — Incremental Static Regeneration for product pages (blazing fast)

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma 5 |
| Payments | Stripe (Checkout + Webhooks) |
| Auth | NextAuth.js v5 |
| State | Zustand (cart) |
| Styling | Tailwind CSS |
| Email | Resend |
| Deployment | Vercel + Supabase |

## 🗂 Project Structure

```
shopforge/
├── app/
│   ├── (store)/
│   │   ├── page.tsx              # Homepage / featured products
│   │   ├── products/
│   │   │   ├── page.tsx          # Product listing with filters
│   │   │   └── [slug]/page.tsx   # Product detail (ISR)
│   │   ├── cart/page.tsx
│   │   └── checkout/page.tsx
│   ├── (admin)/
│   │   └── admin/
│   │       ├── products/page.tsx
│   │       ├── orders/page.tsx
│   │       └── analytics/page.tsx
│   └── api/
│       ├── stripe/webhook/route.ts
│       └── checkout/session/route.ts
├── components/
│   ├── store/
│   ├── admin/
│   └── ui/
├── lib/
│   ├── stripe.ts
│   ├── db.ts
│   └── cart.ts
└── prisma/schema.prisma
```

## 💳 Stripe Integration

```typescript
// Checkout session creation
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: cartItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: { name: item.name, images: [item.image] },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  })),
  success_url: `${baseUrl}/orders/{CHECKOUT_SESSION_ID}`,
  cancel_url: `${baseUrl}/cart`,
});

// Webhook handler for fulfilment
export async function POST(req: Request) {
  const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  if (event.type === 'checkout.session.completed') {
    await fulfillOrder(event.data.object);
  }
}
```

## 🚀 Getting Started

```bash
git clone https://github.com/Tanvin01/shopforge.git
cd shopforge
npm install
cp .env.example .env.local
npx prisma db push
npx prisma db seed
npm run dev
```

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
RESEND_API_KEY="re_..."
```
