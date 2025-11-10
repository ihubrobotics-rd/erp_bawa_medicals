"use client"

import { useState } from "react"
import { Search, Plus, AlertTriangle, Phone, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MedicineCard } from "@/components/medicine/medicine-card"
import { StockAlertForm } from "@/components/sales/stock-alert-form"
import { CustomerOrderForm } from "@/components/sales/customer-order-form"
import { SalesHeader } from "@/components/layout/sales-header"
import type { Medicine, StockAlert } from "@/types/medical"
import { SuperAdminHeader } from "@/components/layout/All-Privilege-Header"
import ProtectedRoute from "@/components/protected-route"

const mockMedicines: Medicine[] = [
  {
    id: "1",
    name: "Crocin Advance Tablet",
    brand: "Crocin",
    genericName: "Paracetamol",
    category: "Medicines",
    subcategory: "Pain Relief",
    price: 45,
    mrp: 50,
    discount: 10,
    stock: 200,
    minStock: 50,
    description: "Fast relief from headache and fever",
    dosage: "1-2 tablets every 4-6 hours",
    packSize: "strip of 15 tablets",
    manufacturer: "GSK",
    expiryDate: "2025-12-31",
    batchNumber: "CR007",
    prescription: false,
    images: ["/crocin-tablets.jpg"],
    tags: ["pain relief", "fever", "headache"],
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Dolo 650 Tablet",
    brand: "Dolo",
    genericName: "Paracetamol",
    category: "Medicines",
    subcategory: "Pain Relief",
    price: 30,
    mrp: 35,
    discount: 14,
    stock: 5, // Low stock
    minStock: 30,
    description: "Effective pain and fever relief",
    dosage: "1 tablet every 4-6 hours",
    packSize: "strip of 15 tablets",
    manufacturer: "Micro Labs",
    expiryDate: "2025-10-31",
    batchNumber: "DL008",
    prescription: false,
    images: ["/dolo-tablets.jpg"],
    tags: ["pain relief", "fever", "paracetamol"],
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "3",
    name: "Cetirizine 10mg Tablet",
    brand: "Generic",
    genericName: "Cetirizine",
    category: "Medicines",
    subcategory: "Allergy",
    price: 25,
    mrp: 30,
    discount: 17,
    stock: 0, // Out of stock
    minStock: 25,
    description: "Antihistamine for allergy relief",
    dosage: "1 tablet once daily",
    packSize: "strip of 10 tablets",
    manufacturer: "Various",
    expiryDate: "2025-11-30",
    batchNumber: "CT010",
    prescription: true,
    images: ["/cetirizine-tablets.png"],
    tags: ["allergy", "antihistamine", "prescription"],
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
]

const mockStockAlerts: StockAlert[] = [
  {
    id: "1",
    medicineId: "3",
    medicine: mockMedicines[2],
    customerName: "Rajesh Kumar",
    customerPhone: "+91 9876543210",
    salesPersonId: "sales1",
    status: "pending",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    medicineId: "2",
    medicine: mockMedicines[1],
    customerName: "Priya Sharma",
    customerPhone: "+91 9876543211",
    salesPersonId: "sales1",
    status: "notified",
    createdAt: "2024-01-14T14:20:00Z",
    notifiedAt: "2024-01-15T09:00:00Z",
  },
]

export default function SalesDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showStockAlertForm, setShowStockAlertForm] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)

  const filteredMedicines = mockMedicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || medicine.category.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const lowStockMedicines = mockMedicines.filter((m) => m.stock <= m.minStock)
  const outOfStockMedicines = mockMedicines.filter((m) => m.stock === 0)

  const handleCreateStockAlert = (medicine: Medicine) => {
    setSelectedMedicine(medicine)
    setShowStockAlertForm(true)
  }

  const handleCreateOrder = (medicine: Medicine) => {
    setSelectedMedicine(medicine)
    setShowOrderForm(true)
  }

  return (
  <ProtectedRoute allowedRoles={["sales"]}>
    <div className="min-h-screen bg-background">
      <SuperAdminHeader />
      <div className="container mx-auto px-4 py-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMedicines.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{lowStockMedicines.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{outOfStockMedicines.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Alerts</CardTitle>
              <Phone className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {mockStockAlerts.filter((a) => a.status === "pending").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="medicines" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="medicines">Medicine Catalog</TabsTrigger>
            <TabsTrigger value="stock-alerts">Stock Alerts</TabsTrigger>
            <TabsTrigger value="orders">Customer Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="medicines" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search medicines by name or generic name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={selectedCategory === "medicines" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("medicines")}
                  size="sm"
                >
                  Medicines
                </Button>
                <Button
                  variant={selectedCategory === "personal care" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("personal care")}
                  size="sm"
                >
                  Personal Care
                </Button>
              </div>
            </div>

            {/* Medicine Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMedicines.map((medicine) => (
                <div key={medicine.id} className="relative">
                  <MedicineCard medicine={medicine} onAddToCart={() => handleCreateOrder(medicine)} />

                  {/* Stock Status Overlay */}
                  {medicine.stock <= medicine.minStock && (
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant={medicine.stock === 0 ? "destructive" : "secondary"}
                        className={medicine.stock === 0 ? "bg-red-600" : "bg-yellow-600"}
                      >
                        {medicine.stock === 0 ? "Out of Stock" : "Low Stock"}
                      </Badge>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    {medicine.stock === 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCreateStockAlert(medicine)}
                        className="bg-white/90 backdrop-blur-sm"
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Alert
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stock-alerts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Stock Alert Requests</h3>
              <Button onClick={() => setShowStockAlertForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Alert
              </Button>
            </div>

            <div className="space-y-4">
              {mockStockAlerts.map((alert) => (
                <Card key={alert.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-medium">{alert.medicine.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Customer: {alert.customerName} | {alert.customerPhone}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Created: {new Date(alert.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            alert.status === "pending"
                              ? "secondary"
                              : alert.status === "notified"
                                ? "default"
                                : "outline"
                          }
                        >
                          {alert.status}
                        </Badge>

                        {alert.status === "pending" && (
                          <Button size="sm" variant="outline">
                            <Phone className="w-3 h-3 mr-1" />
                            Notify
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Customer Orders</h3>
              <Button onClick={() => setShowOrderForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
            </div>

            <Card>
              <CardContent className="p-8 text-center">
                <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">Start creating orders for your customers</p>
                <Button onClick={() => setShowOrderForm(true)}>Create First Order</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {showStockAlertForm && (
        <StockAlertForm
          medicine={selectedMedicine}
          onClose={() => {
            setShowStockAlertForm(false)
            setSelectedMedicine(null)
          }}
        />
      )}

      {showOrderForm && (
        <CustomerOrderForm
          medicine={selectedMedicine}
          onClose={() => {
            setShowOrderForm(false)
            setSelectedMedicine(null)
          }}
        />
      )}
    </div>
        </ProtectedRoute>
  )
}
