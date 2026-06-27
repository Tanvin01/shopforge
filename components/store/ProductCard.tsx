"use client";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "@/lib/cart";
import toast from "react-hot-toast";
interface Product { id: string; name: string; slug: string; price: number; compareAt?: number|null; images: string[]; reviews: { rating: number }[]; }
export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem);
  const avg = product.reviews.length ? (product.reviews.reduce((s,r) => s+r.rating,0)/product.reviews.length).toFixed(1) : null;
  return (
    <div className="group bg-slate-900 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition-all">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square bg-slate-800 flex items-center justify-center text-slate-600 text-4xl">
          {product.images[0] ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" /> : "🛍"}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.slug}`}><h3 className="font-medium text-white text-sm truncate hover:text-blue-400">{product.name}</h3></Link>
        {avg && <div className="flex items-center gap-1 mt-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /><span className="text-xs text-slate-400">{avg} ({product.reviews.length})</span></div>}
        <div className="flex items-center justify-between mt-3">
          <div><span className="text-white font-semibold">${product.price.toFixed(2)}</span>
            {product.compareAt && <span className="text-slate-500 text-xs line-through ml-1">${product.compareAt.toFixed(2)}</span>}
          </div>
          <button onClick={() => { addItem({ productId: product.id, name: product.name, price: product.price, quantity: 1, image: product.images[0] }); toast.success("Added to cart"); }}
            className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">
            <ShoppingCart className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
