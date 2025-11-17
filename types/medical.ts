export type Role = {
  id: number
  name: string
  description?: string
  is_active: boolean
  created_at?: string
}

export type User = {
  id: number
  username: string
  email: string
  mobile: string
  role: number
  role_name?: string
  permissions?: string[]
  is_active: boolean
  created_at?: string
  updated_at?: string
  avatar?: string
}

export type Medicine = {
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

export type StockAlertStatus = "pending" | "notified" | "completed"

export type StockAlert = {
  id: string
  medicineId: string
  medicine: Medicine
  customerName: string
  customerPhone: string
  salesPersonId: string
  status: StockAlertStatus
  createdAt: string
  notifiedAt?: string
}

export type Tax = {
  id: number
  name: string
  rate: number
  isActive: boolean
  createdAt: string
}
