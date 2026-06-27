import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest) {
  try {
    // In production, aggregate from DB:
    // const [revenue, orders, products, customers] = await Promise.all([
    //   prisma.order.aggregate({ _sum: { total: true } }),
    //   prisma.order.count(),
    //   prisma.product.count({ where: { status: 'ACTIVE' } }),
    //   prisma.user.count({ where: { role: 'CUSTOMER' } }),
    // ])

    const stats = {
      totalRevenue: 48250.75,
      revenueChange: 12.4,
      totalOrders: 342,
      ordersChange: 8.1,
      totalProducts: 156,
      totalCustomers: 1204,
      topProducts: [
        { product: { id: 'p1', name: 'Premium Wireless Headphones', images: [], slug: 'headphones' }, sales: 89, revenue: 7119.11 },
        { product: { id: 'p2', name: 'Smart Watch Series X', images: [], slug: 'watch' }, sales: 52, revenue: 10348 },
        { product: { id: 'p3', name: 'USB-C Hub 7-in-1', images: [], slug: 'hub' }, sales: 134, revenue: 6693.66 },
      ],
      recentOrders: [
        { id: 'ord_1', status: 'DELIVERED', total: 215.99, createdAt: new Date().toISOString() },
        { id: 'ord_2', status: 'PROCESSING', total: 89.00, createdAt: new Date().toISOString() },
        { id: 'ord_3', status: 'SHIPPED', total: 349.99, createdAt: new Date().toISOString() },
      ],
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('[GET /api/admin/stats]', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
