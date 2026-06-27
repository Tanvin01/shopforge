import React from 'react'
import type { Review } from '@/types'
import { formatDate } from '@/lib/utils'

interface ReviewListProps {
  reviews: Review[]
  averageRating: number
  reviewCount: number
}

function StarBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-4">{star}</span>
      <svg className="h-3 w-3 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full bg-yellow-400" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
    </div>
  )
}

export function ReviewList({ reviews, averageRating, reviewCount }: ReviewListProps) {
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-xl border border-gray-200 bg-gray-50">
        <div className="text-center">
          <p className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
          <div className="mt-1 flex justify-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg
                key={s}
                className={`h-4 w-4 ${s <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-200'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="mt-1 text-sm text-gray-500">{reviewCount} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5 min-w-0">
          {distribution.map(({ star, count }) => (
            <StarBar key={star} star={star} count={count} total={reviewCount} />
          ))}
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-5 last:border-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                      {review.userName[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{review.userName}</p>
                      {review.verified && (
                        <span className="text-xs text-green-600 font-medium">✓ Verified purchase</span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(review.createdAt)}</span>
              </div>

              <div className="mt-2 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    className={`h-3.5 w-3.5 ${s <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {review.title && (
                <p className="mt-2 text-sm font-semibold text-gray-900">{review.title}</p>
              )}
              <p className="mt-1 text-sm text-gray-600 leading-relaxed">{review.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
