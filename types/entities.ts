export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  sku: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Employee {
  id: string
  name: string
  email: string
  position: string
  department: string
  salary: number
  hireDate: string
  isActive: boolean
  managerId?: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  customerId: string
  customerName: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue"
  dueDate: string
  createdAt: string
}

export interface InvoiceItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  company?: string
  isActive: boolean
  createdAt: string
}
