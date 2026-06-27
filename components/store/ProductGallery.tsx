'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  alt: string
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center">
        <svg className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative aspect-square rounded-xl border border-gray-200 overflow-hidden bg-gray-50 cursor-zoom-in"
        onClick={() => setZoomed(!zoomed)}
      >
        <Image
          src={images[activeIdx]}
          alt={alt}
          fill
          className={cn('object-cover transition-transform duration-300', zoomed && 'scale-150')}
          priority
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIdx((p) => Math.max(0, p - 1)) }}
              disabled={activeIdx === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white disabled:opacity-30 transition-all"
            >
              <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIdx((p) => Math.min(images.length - 1, p + 1)) }}
              disabled={activeIdx === images.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white disabled:opacity-30 transition-all"
            >
              <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={cn(
                'relative h-16 w-16 flex-shrink-0 rounded-lg border-2 overflow-hidden transition-all',
                activeIdx === i ? 'border-orange-500 shadow-sm' : 'border-gray-200 hover:border-gray-400',
              )}
            >
              <Image src={src} alt={`${alt} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
