'use client'

import React, { useState } from 'react'
import type { Product } from '@/types'
import { slugify } from '@/lib/utils'

interface ProductFormProps {
  product?: Partial<Product>
  onSubmit: (data: Partial<Product>) => Promise<void>
  onCancel: () => void
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [form, setForm] = useState({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    compareAtPrice: product?.compareAtPrice?.toString() ?? '',
    category: product?.category ?? '',
    stock: product?.stock?.toString() ?? '',
    sku: product?.sku ?? '',
    tags: product?.tags?.join(', ') ?? '',
    status: product?.status ?? 'DRAFT',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((p) => {
      const updated: typeof p = { ...p, [name]: value }
      if (name === 'name' && !product?.slug) {
        updated.slug = slugify(value)
      }
      return updated
    })
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Valid price required'
    if (!form.sku.trim()) e.sku = 'SKU is required'
    if (Object.keys(e).length) { setErrors(e); return false }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await onSubmit({
        name: form.name,
        slug: form.slug || slugify(form.name),
        description: form.description,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        category: form.category,
        stock: Number(form.stock) || 0,
        sku: form.sku,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        status: form.status as Product['status'],
      })
    } finally {
      setLoading(false)
    }
  }

  const inputCls = (name: string) =>
    `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors[name] ? 'border-red-400' : 'border-gray-300'}`

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
          <input name="name" value={form.name} onChange={handleChange} className={inputCls('name')} placeholder="e.g. Wireless Headphones" />
          {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input name="slug" value={form.slug} onChange={handleChange} className={inputCls('slug')} placeholder="auto-generated" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          placeholder="Describe the product..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD) *</label>
          <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} className={inputCls('price')} placeholder="29.99" />
          {errors.price && <p className="text-xs text-red-500 mt-0.5">{errors.price}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Compare At Price</label>
          <input name="compareAtPrice" type="number" step="0.01" value={form.compareAtPrice} onChange={handleChange} className={inputCls('compareAtPrice')} placeholder="49.99" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
          <input name="sku" value={form.sku} onChange={handleChange} className={inputCls('sku')} placeholder="WH-001-BLK" />
          {errors.sku && <p className="text-xs text-red-500 mt-0.5">{errors.sku}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
          <input name="stock" type="number" value={form.stock} onChange={handleChange} className={inputCls('stock')} placeholder="100" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input name="category" value={form.category} onChange={handleChange} className={inputCls('category')} placeholder="Electronics" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
        <input name="tags" value={form.tags} onChange={handleChange} className={inputCls('tags')} placeholder="wireless, audio, premium" />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          {loading ? 'Saving...' : (product?.id ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  )
}
