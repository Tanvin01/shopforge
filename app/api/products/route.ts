import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '20')
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') ?? 'popular'
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')

  try {
    // In production, use Prisma:
    // const where: Prisma.ProductWhereInput = { status: 'ACTIVE' }
    // if (category) where.category = category
    // if (search) where.name = { contains: search, mode: 'insensitive' }
    // if (minPrice || maxPrice) where.price = {}
    // if (minPrice) where.price = { ...where.price, gte: Number(minPrice) }
    // if (maxPrice) where.price = { ...where.price, lte: Number(maxPrice) }

    // Mock data
    const products = Array.from({ length: 24 }, (_, i) => ({
      id: `prod_${i + 1}`,
      slug: `product-${i + 1}`,
      name: [
        'Premium Wireless Headphones', 'Ergonomic Desk Chair', 'Smart Watch Series X',
        'Mechanical Keyboard', 'USB-C Hub 7-in-1', 'Standing Desk Converter',
        'Noise Cancelling Earbuds', 'LED Monitor 27"', 'Webcam 4K Pro',
        'Blue Light Glasses', 'Laptop Stand Aluminum', 'Mouse Pad XL',
        'Coffee Maker Deluxe', 'Air Purifier HEPA', 'Yoga Mat Premium',
        'Resistance Bands Set', 'Water Bottle 40oz', 'Protein Shaker',
        'Kindle Paperwhite', 'Portable Charger 20k', 'LED Desk Lamp',
        'Posture Corrector', 'Electric Toothbrush', 'Bamboo Cutting Board',
      ][i],
      description: 'High quality product with premium materials and excellent build quality.',
      price: [79.99, 249, 199, 149, 49.99, 89, 129, 399, 99, 29.99, 59, 19.99, 89, 199, 39, 24.99, 34.99, 19.99, 139, 49.99, 44.99, 24.99, 79, 34.99][i],
      compareAtPrice: i % 3 === 0 ? undefined : undefined,
      currency: 'USD',
      images: [],
      category: ['Electronics', 'Furniture', 'Electronics', 'Electronics', 'Electronics', 'Furniture', 'Electronics', 'Electronics', 'Electronics', 'Accessories', 'Accessories', 'Accessories', 'Kitchen', 'Home', 'Sports', 'Sports', 'Sports', 'Sports', 'Books', 'Electronics', 'Home', 'Health', 'Health', 'Kitchen'][i],
      tags: ['popular'],
      stock: Math.floor(Math.random() * 200) + 10,
      sku: `SKU-${(i + 1).toString().padStart(3, '0')}`,
      rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 500) + 5,
      featured: i < 4,
      status: 'ACTIVE' as const,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    }))

    const filtered = products.filter((p) => {
      if (category && p.category !== category) return false
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      if (minPrice && p.price < Number(minPrice)) return false
      if (maxPrice && p.price > Number(maxPrice)) return false
      return true
    })

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price
      if (sort === 'price_desc') return b.price - a.price
      if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return b.reviewCount - a.reviewCount // popular
    })

    const start = (page - 1) * limit
    const paginated = sorted.slice(start, start + limit)

    return NextResponse.json({
      data: paginated,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    })
  } catch (error) {
    console.error('[GET /api/products]', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.name || !body.price) {
      return NextResponse.json({ message: 'name and price are required' }, { status: 400 })
    }

    // In production: const product = await prisma.product.create({ data: body })
    const product = {
      id: `prod_${Date.now()}`,
      ...body,
      status: 'DRAFT',
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('[POST /api/products]', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
