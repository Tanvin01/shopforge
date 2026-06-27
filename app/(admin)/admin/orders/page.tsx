import React from 'react'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Order } from '@/types'

const MOCK_ORDERS: Order[] = [
  { id: 'ord_001', userId: 'u1', status: 'DELIVERED', subtotal: 199.99, tax: 16, shipping: 0, total: 215.99, currency: 'USD', items: [], shippingAddress: { fullName: 'Alice J.', line1: '', city: 'NYC', state: 'NY', postalCode: '10001', country: 'US' }, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ord_002', userId: 'u2', status: 'SHIPPED', subtotal: 89, tax: 7.12, shipping: 0, total: 96.12, currency: 'USD', items: [], shippingAddress: { fullName: 'Bob S.', line1: '', city: 'Austin', state: 'TX', postalCode: '78701', country: 'US' }, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ord_003', userId: 'u3', status: 'PROCESSING', subtotal: 349.99, tax: 28, shipping: 0, total: 377.99, currency: 'USD', items: [], shippingAddress: { fullName: 'Carol M.', line1: '', city: 'LA', state: 'CA', postalCode: '90001', country: 'US' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ord_004', userId: 'u4', status: 'PENDING', subtotal: 49.99, tax: 4, shipping: 9.99, total: 63.98, currency: 'USD', items: [], shippingAddress: { fullName: 'Dave R.', line1: '', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'US' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ord_005', userId: 'u5', status: 'CANCELLED', subtotal: 129, tax: 10.32, shipping: 0, total: 139.32, currency: 'USD', items: [], shippingAddress: { fullName: 'Eve L.', line1: '', city: 'Seattle', state: 'WA', postalCode: '98101', country: 'US' }, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString() },
]

const STATUS_COLORS: Record<Order['status'], string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600',
  REFUNDED: 'bg-yellow-100 text-yellow-700',
}

export default function AdminOrdersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <div className="flex items-center gap-2">
          <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">Export CSV</button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Order</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">Customer</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">Date</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Total</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_ORDERS.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4 font-mono text-xs text-gray-500">{order.id}</td>
                <td className="px-5 py-4 hidden md:table-cell text-gray-600">{order.shippingAddress.fullName}</td>
                <td className="px-5 py-4 hidden lg:table-cell text-gray-600">{formatDate(order.createdAt)}</td>
                <td className="px-5 py-4">
                  <select
                    defaultValue={order.status}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium border-0 cursor-pointer ${STATUS_COLORS[order.status]}`}
                  >
                    {Object.keys(STATUS_COLORS).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-4 text-right font-semibold text-gray-900">{formatPrice(order.total)}</td>
                <td className="px-5 py-4 text-right">
                  <a href={`/admin/orders/${order.id}`} className="text-xs text-orange-600 hover:text-orange-500 font-medium">View</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
