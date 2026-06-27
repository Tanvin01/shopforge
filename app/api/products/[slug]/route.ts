import { NextRequest, NextResponse } from 'next/server'

interface Params { params: { slug: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    // In production: const product = await prisma.product.findUnique({ where: { slug: params.slug } })
    const product = {
      id: 'prod_1',
      slug: params.slug,
      name: 'Premium Wireless Headphones',
      description: 'Experience audio like never before with our premium wireless headphones. Featuring 40mm drivers, active noise cancellation, and 30-hour battery life.',
      price: 79.99,
      compareAtPrice: 129.99,
      currency: 'USD',
      images: [],
      category: 'Electronics',
      tags: ['wireless', 'audio', 'noise-cancelling'],
      stock: 45,
      sku: 'WH-001-BLK',
      variants: [
        { id: 'var_1', name: 'Color', value: 'Black', stock: 25, priceModifier: 0 },
        { id: 'var_2', name: 'Color', value: 'White', stock: 20, priceModifier: 0 },
      ],
      rating: 4.6,
      reviewCount: 234,
      featured: true,
      status: 'ACTIVE' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch (error) {
    console.error('[GET /api/products/:slug]', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json()
    // In production: validate admin session, then update
    const updated = { slug: params.slug, ...body, updatedAt: new Date().toISOString() }
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    // In production: await prisma.product.update({ where: { slug: params.slug }, data: { status: 'ARCHIVED' } })
    return NextResponse.json({ message: 'Product archived', slug: params.slug })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
