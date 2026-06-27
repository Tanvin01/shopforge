"use client";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart";
import { useRouter } from "next/navigation";
export default function CartDrawer() {
  const { items, isOpen, toggleCart, updateQty, removeItem, totalPrice } = useCartStore();
  const router = useRouter();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={toggleCart} />
      <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-700 flex flex-col h-full">
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 className="font-bold text-white flex items-center gap-2"><ShoppingBag className="w-5 h-5" />Cart ({items.length})</h2>
          <button onClick={toggleCart} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 && <p className="text-slate-500 text-center py-8">Your cart is empty</p>}
          {items.map(item => (
            <div key={item.productId} className="flex gap-3 bg-slate-800 rounded-xl p-3">
              <div className="w-16 h-16 bg-slate-700 rounded-lg" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{item.name}</p>
                <p className="text-blue-400 text-sm">${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQty(item.productId, item.quantity-1)} className="w-6 h-6 bg-slate-600 rounded flex items-center justify-center"><Minus className="w-3 h-3 text-white" /></button>
                  <span className="text-white text-sm">{item.quantity}</span>
                  <button onClick={() => updateQty(item.productId, item.quantity+1)} className="w-6 h-6 bg-slate-600 rounded flex items-center justify-center"><Plus className="w-3 h-3 text-white" /></button>
                </div>
              </div>
              <button onClick={() => removeItem(item.productId)} className="text-slate-500 hover:text-red-400"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-700">
            <div className="flex justify-between text-white font-semibold mb-4"><span>Total</span><span>${totalPrice().toFixed(2)}</span></div>
            <button onClick={() => { toggleCart(); router.push("/checkout"); }} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl">Proceed to Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}
