import React from 'react'
import { notFound } from 'next/navigation'
import type { Product, Review } from '@/types'
import { ProductGallery } from '@/components/store/ProductGallery'
import { ReviewList } from '@/components/store/ReviewList'
import { formatPrice, getDiscountPercent } from '@/lib/utils'

interface PageProps { params: { slug: string } }

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products/${slug}`, { next: { revalidate: 300 } })
    if (res.status === 404) return null
    return res.json()
  } catch { return null }
}

const MOCK_REVIEWS: Review[] = [
  { id: 'r1', productId: 'p1', userId: 'u1', userName: 'Alex M.', rating: 5, title: 'Absolutely love these!', body: 'Sound quality is incredible, battery lasts forever. Best purchase I\'ve made this year.', verified: true, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r2', productId: 'p1', userId: 'u2', userName: 'Sarah K.', rating: 4, title: 'Great headphones, minor quibbles', body: 'Really good noise cancellation. The ear cups could be a bit more comfortable for long sessions but overall great.', verified: true, createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'r3', productId: 'p1', userId: 'u3', userName: 'Marcus T.', rating: 5, title: 'Worth every penny', body: 'Coming from cheap earbuds this is a revelation. Clear highs, punchy bass. Very happy.', verified: false, createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
]

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  const discount = product.compareAtPrice ? getDiscountPercent(product.price, product.compareAtPrice) : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Gallery */}
        <div>
          <ProductGallery images={product.images} alt={product.name} />
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className={`h-4 w-4 ${s <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.rating} ({product.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-sm font-bold text-red-600">-{discount}%</span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Color</p>
              <div className="flex gap-2">
                {product.variants.map((v) => (
                  <button key={v.id} className="rounded-lg border-2 border-orange-500 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-orange-500 transition-colors">
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to cart */}
          <div className="flex gap-3">
            <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden">
              <button className="flex h-10 w-10 items-center justify-center hover:bg-gray-50">–</button>
              <span className="w-10 text-center text-sm font-medium">1</span>
              <button className="flex h-10 w-10 items-center justify-center hover:bg-gray-50">+</button>
            </div>
            <button
              disabled={product.stock === 0}
              className="flex-1 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {product.stock > 0 && product.stock < 20 && (
            <p className="text-sm text-red-600">⚠ Only {product.stock} left in stock</p>
          )}

          <div className="text-xs text-gray-400 space-y-1 pt-2 border-t">
            <p>SKU: {product.sku}</p>
            <p>Free shipping on orders over $75</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="border-t pt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
        <ReviewList reviews={MOCK_REVIEWS} averageRating={product.rating} reviewCount={product.reviewCount} />
      </div>
    </div>
  )
}
