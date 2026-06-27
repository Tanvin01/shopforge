import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { sendOrderConfirmationEmail } from "@/lib/mailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

// Stripe requires raw body for webhook signature verification
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("[STRIPE_WEBHOOK] Signature verification failed:", err.message);
    return NextResponse.json({ error: "Webhook signature invalid" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await fulfillOrder(session);
      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      await db.order.updateMany({
        where: { stripePaymentIntentId: intent.id },
        data: { status: "PAYMENT_FAILED" },
      });
      break;
    }

    case "charge.dispute.created": {
      const dispute = event.data.object as Stripe.Dispute;
      console.warn("[STRIPE_WEBHOOK] Dispute created:", dispute.id);
      // TODO: flag order for review
      break;
    }

    default:
      console.log(`[STRIPE_WEBHOOK] Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function fulfillOrder(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    console.error("[FULFILL_ORDER] No orderId in session metadata");
    return;
  }

  const order = await db.order.update({
    where: { id: orderId },
    data: {
      status: "CONFIRMED",
      stripePaymentIntentId: session.payment_intent as string,
      paidAt: new Date(),
    },
    include: {
      items: { include: { product: true } },
      user: true,
    },
  });

  // Decrement inventory
  await Promise.all(
    order.items.map((item) =>
      db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    )
  );

  // Send confirmation email
  await sendOrderConfirmationEmail(order.user.email!, order);

  console.log(`✅ Order fulfilled: ${orderId}`);
}
