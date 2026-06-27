import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') ?? 'usr_demo'

    // In production: fetch from prisma with auth
    const orders = [
      {
        id: 'ord_1',
        userId,
        status: 'DELIVERED',
        subtotal: 199.99,
        tax: 16,
        shipping: 0,
        total: 215.99,
        currency: 'USD',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        trackingNumber: '1Z999AA10123456784',
        items: [
          {
            id: 'oi_1',
            orderId: 'ord_1',
            productId: 'prod_1',
            product: { id: 'prod_1', name: 'Premium Wireless Headphones', images: [], slug: 'premium-wireless-headphones' },
            quantity: 1,
            unitPrice: 79.99,
            total: 79.99,
          },
        ],
        shippingAddress: {
          fullName: 'Jane Smith',
          line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'US',
        },
      },
    ]

    return NextResponse.json({ data: orders, total: orders.length })
  } catch (error) {
    console.error('[GET /api/orders]', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
