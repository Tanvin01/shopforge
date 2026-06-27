import React from 'react'
import type { Product } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products?limit=50`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return data.data ?? []
  } catch { return [] }
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button className="flex items-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors">
          + Add Product
        </button>
      </div>

      {/* Search & filter bar */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="search"
          placeholder="Search products..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
          <option value="">All status</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Product</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">Category</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Price</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">Stock</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-gray-900 truncate max-w-xs">{product.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">SKU: {product.sku}</p>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell text-gray-600">{product.category}</td>
                <td className="px-5 py-4 text-right font-medium text-gray-900">{formatPrice(product.price)}</td>
                <td className="px-5 py-4 text-right hidden lg:table-cell">
                  <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    product.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    product.status === 'DRAFT' ? 'bg-gray-100 text-gray-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded">Edit</button>
                    <button className="text-xs text-red-500 hover:text-red-600 px-2 py-1 hover:bg-red-50 rounded">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
