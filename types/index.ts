export interface ProductVariant {
  id: string
  name: string
  value: string
  stock: number
  priceModifier?: number
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  currency: string
  images: string[]
  category: string
  tags: string[]
  stock: number
  sku: string
  variants?: ProductVariant[]
  rating: number
  reviewCount: number
  featured: boolean
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  productId: string
  product: Product
  quantity: number
  variantId?: string
  variant?: ProductVariant
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  itemCount: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: string
  shippingAddress: Address
  stripePaymentIntentId?: string
  trackingNumber?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product: Pick<Product, 'id' | 'name' | 'images' | 'slug'>
  quantity: number
  unitPrice: number
  total: number
}

export interface Address {
  fullName: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  title: string
  body: string
  verified: boolean
  createdAt: string
}

export interface AdminStats {
  totalRevenue: number
  revenueChange: number
  totalOrders: number
  ordersChange: number
  totalProducts: number
  totalCustomers: number
  topProducts: Array<{ product: Product; sales: number; revenue: number }>
  recentOrders: Order[]
}
