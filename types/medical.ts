export interface Medicine {
  id: string
  name: string
  brand: string
  genericName: string
  category: string
  subcategory: string
  price: number
  mrp: number
  discount: number
  stock: number
  minStock: number
  description: string
  dosage: string
  packSize: string
  manufacturer: string
  expiryDate: string
  batchNumber: string
  prescription: boolean
  images: string[]
  tags: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  parentId?: string
  children?: Category[]
  icon?: string
  image?: string
  description?: string
  isActive: boolean
}

export interface CartItem {
  medicineId: string
  medicine: Medicine
  quantity: number
  price: number
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  total: number
  createdAt: string
  updatedAt: string
}

export interface StockAlert {
  id: string
  medicineId: string
  medicine: Medicine
  customerName: string
  customerPhone: string
  salesPersonId: string
  status: "pending" | "notified" | "completed"
  createdAt: string
  notifiedAt?: string
}

export interface Order {
  id: string
  customerId: string
  items: CartItem[]
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed"
  deliveryAddress: string
  createdAt: string
  updatedAt: string
}

export type UserRole = "customer" | "sales" | "admin" | "stock_manager"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  isActive: boolean
  createdAt: string
}
