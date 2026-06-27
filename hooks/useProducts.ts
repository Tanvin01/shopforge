'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Product } from '@/types'

interface ProductFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular'
  page?: number
  limit?: number
}

interface UseProductsResult {
  products: Product[]
  total: number
  totalPages: number
  loading: boolean
  error: string | null
  filters: ProductFilters
  setFilters: (f: ProductFilters) => void
}

export function useProducts(initial: ProductFilters = {}): UseProductsResult {
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, limit: 20, ...initial })
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch_ = useCallback(async (f: ProductFilters) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      Object.entries(f).forEach(([k, v]) => v !== undefined && params.set(k, String(v)))
      const res = await fetch(`/api/products?${params}`)
      if (!res.ok) throw new Error('Failed to load products')
      const data = await res.json()
      setProducts(data.data ?? data)
      setTotal(data.total ?? 0)
      setTotalPages(data.totalPages ?? 1)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch_(filters) }, [filters, fetch_])

  return { products, total, totalPages, loading, error, filters, setFilters }
}
