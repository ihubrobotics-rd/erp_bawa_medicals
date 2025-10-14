"use client"

import { useState } from "react"
import { Search, Plus, AlertTriangle, Package, TrendingDown, TrendingUp, Filter, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StockHeader } from "@/components/layout/stock-header"
import { StockTable } from "@/components/stock/stock-table"
import { AddStockForm } from "@/components/stock/add-stock-form"
import { StockAlertsList } from "@/components/stock/stock-alerts-list"
import { LowStockReport } from "@/components/stock/low-stock-report"
import type { Medicine } from "@/types/medical"
import { AddStockFlow } from "@/components/stock/AddStockFlow"

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
    stock: 15, // Low stock
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
  {
    id: "4",
    name: "Vicks VapoRub",
    brand: "Vicks",
    genericName: "Menthol Ointment",
    category: "Personal Care",
    subcategory: "Cold & Cough",
    price: 85,
    mrp: 95,
    discount: 11,
    stock: 80,
    minStock: 15,
    description: "Relief from cold and cough symptoms",
    dosage: "Apply externally as needed",
    packSize: "jar of 50ml",
    manufacturer: "P&G",
    expiryDate: "2025-09-30",
    batchNumber: "VK009",
    prescription: false,
    images: ["/vicks-vaporub.jpg"],
    tags: ["cold", "cough", "menthol"],
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
]

export default function StockManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [showAddStockForm, setShowAddStockForm] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
    const [showAddStockFlow, setShowAddStockFlow] = useState(false) // Add new state


  const filteredMedicines = mockMedicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.brand.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || medicine.category.toLowerCase() === categoryFilter

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && medicine.stock <= medicine.minStock && medicine.stock > 0) ||
      (stockFilter === "out" && medicine.stock === 0) ||
      (stockFilter === "good" && medicine.stock > medicine.minStock)

    return matchesSearch && matchesCategory && matchesStock
  })

  const totalMedicines = mockMedicines.length
  const lowStockCount = mockMedicines.filter((m) => m.stock <= m.minStock && m.stock > 0).length
  const outOfStockCount = mockMedicines.filter((m) => m.stock === 0).length
  const totalStockValue = mockMedicines.reduce((sum, m) => sum + m.stock * m.price, 0)

  const handleAddStock = (medicine: Medicine) => {
    setSelectedMedicine(medicine)
    setShowAddStockForm(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <StockHeader />

      <div className="container mx-auto px-4 py-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMedicines}</div>
              <p className="text-xs text-muted-foreground">Active medicines</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <TrendingDown className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{lowStockCount}</div>
              <p className="text-xs text-muted-foreground">Need restocking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
              <p className="text-xs text-muted-foreground">Urgent attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalStockValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total inventory value</p>
            </CardContent>
          </Card>
        </div>

           <div className="flex justify-end mb-4">
            <Button onClick={() => setShowAddStockFlow(true)}>
                <Camera className="w-4 h-4 mr-2" />
                Add Stock via Camera
            </Button>
        </div>

        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="add-medicine">Add Medicine</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search medicines by name, brand, or generic name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="medicines">Medicines</SelectItem>
                    <SelectItem value="personal care">Personal Care</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Stock Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stock</SelectItem>
                    <SelectItem value="good">Good Stock</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                    <SelectItem value="out">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>

            {/* Stock Table */}
            <StockTable medicines={filteredMedicines} onAddStock={handleAddStock} />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <StockAlertsList />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <LowStockReport medicines={mockMedicines} />
          </TabsContent>

          <TabsContent value="add-medicine" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Medicine</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Add new medicines to your inventory. Fill in all required details including stock information.
                </p>
                <Button onClick={() => setShowAddStockForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Medicine
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {showAddStockFlow && <AddStockFlow onClose={() => setShowAddStockFlow(false)} />}

      {/* Add Stock Form Modal */}
      {showAddStockForm && (
        <AddStockForm
          medicine={selectedMedicine}
          onClose={() => {
            setShowAddStockForm(false)
            setSelectedMedicine(null)
          }}
        />
      )}
    </div>
  )
}
