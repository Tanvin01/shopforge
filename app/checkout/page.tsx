"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/cart";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, shippingAddress: { country: "US" } }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (e: any) {
      toast.error(e.message);
      setLoading(false);
    }
  };

  if (!items.length) { router.push("/products"); return null; }

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-8">Checkout</h1>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-white mb-4">Order Summary</h2>
          {items.map(item => (
            <div key={item.productId} className="flex justify-between text-sm py-2 border-b border-slate-800">
              <span className="text-slate-300">{item.name} x{item.quantity}</span>
              <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-white pt-3">
            <span>Total</span><span>${totalPrice().toFixed(2)}</span>
          </div>
        </div>
        <button onClick={handleCheckout} disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors">
          {loading ? "Redirecting to Stripe..." : "Pay with Stripe"}
        </button>
      </div>
    </div>
  );
}
