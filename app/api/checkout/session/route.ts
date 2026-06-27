import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { items, shippingAddress } = await req.json();
  if (!items?.length) return NextResponse.json({ error: "No items" }, { status: 400 });

  const order = await db.order.create({
    data: {
      userId: session.user.id!,
      total: items.reduce((s: number, i: any) => s + i.price * i.quantity, 0),
      shippingAddress,
      items: { create: items.map((i: any) => ({ productId: i.productId, quantity: i.quantity, price: i.price })) },
    },
  });

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    metadata: { orderId: order.id },
    line_items: items.map((item: any) => ({
      price_data: { currency: "usd", product_data: { name: item.name, images: item.image ? [item.image] : [] }, unit_amount: Math.round(item.price * 100) },
      quantity: item.quantity,
    })),
    success_url: `${process.env.NEXTAUTH_URL}/orders/${order.id}?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
  });

  return NextResponse.json({ url: stripeSession.url });
}
