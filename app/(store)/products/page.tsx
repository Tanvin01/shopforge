import React from 'react'
import type { Product, PaginatedResponse } from '@/types'
import { ProductCard } from '@/components/store/ProductCard'
import { formatPrice } from '@/lib/utils'

async function getProducts(): Promise<{ data: Product[]; total: number }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products?limit=24`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return { data: [], total: 0 }
    return res.json()
  } catch {
    return { data: [], total: 0 }
  }
}

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Sports', 'Beauty']
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export default async function ProductsPage() {
  const { data: products, total } = await getProducts()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="w-full lg:w-56 flex-shrink-0">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <a
                    key={cat}
                    href={cat === 'All' ? '/products' : `/products?category=${cat}`}
                    className="block rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-2">
                {[
                  { label: 'Under $25', max: 25 },
                  { label: '$25 – $50', min: 25, max: 50 },
                  { label: '$50 – $100', min: 50, max: 100 },
                  { label: 'Over $100', min: 100 },
                ].map(({ label, min, max }) => (
                  <label key={label} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                    <input type="checkbox" className="accent-orange-500" />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Rating</h3>
              {[4, 3, 2, 1].map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer mb-1.5">
                  <input type="checkbox" className="accent-orange-500" />
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className={`h-3.5 w-3.5 ${i < r ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">& up</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">{total} products</p>
            <select className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
