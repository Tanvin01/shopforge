import React from 'react'
import { formatPrice } from '@/lib/utils'
import type { AdminStats } from '@/types'

interface StatsGridProps {
  stats: AdminStats
}

function StatCard({
  label, value, change, icon, prefix,
}: {
  label: string
  value: number
  change: number
  icon: React.ReactNode
  prefix?: string
}) {
  const isPos = change >= 0
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {prefix}{typeof value === 'number' && !prefix ? value.toLocaleString() : ''}
            {prefix === '$' ? formatPrice(value).replace('$', '') : ''}
            {!prefix ? value.toLocaleString() : ''}
          </p>
          <div className="mt-1.5 flex items-center gap-1">
            <span className={`text-xs font-medium ${isPos ? 'text-green-600' : 'text-red-500'}`}>
              {isPos ? '↑' : '↓'} {Math.abs(change)}%
            </span>
            <span className="text-xs text-gray-400">vs last month</span>
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
          {icon}
        </div>
      </div>
    </div>
  )
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Revenue"
        value={stats.totalRevenue}
        change={stats.revenueChange}
        prefix="$"
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />
      <StatCard
        label="Total Orders"
        value={stats.totalOrders}
        change={stats.ordersChange}
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        }
      />
      <StatCard
        label="Products"
        value={stats.totalProducts}
        change={0}
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        }
      />
      <StatCard
        label="Customers"
        value={stats.totalCustomers}
        change={5}
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
      />
    </div>
  )
}
