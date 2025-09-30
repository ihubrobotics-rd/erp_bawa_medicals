"use client"

import type React from "react"

import { useState } from "react"
import { X, Package, Calendar, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Medicine } from "@/types/medical"

interface AddStockFormProps {
  medicine?: Medicine | null
  onClose: () => void
}

export function AddStockForm({ medicine, onClose }: AddStockFormProps) {
  const [formData, setFormData] = useState({
    // Medicine details (for new medicine)
    name: medicine?.name || "",
    brand: medicine?.brand || "",
    genericName: medicine?.genericName || "",
    category: medicine?.category || "",
    subcategory: medicine?.subcategory || "",
    manufacturer: medicine?.manufacturer || "",

    // Stock details
    quantity: "",
    batchNumber: medicine?.batchNumber || "",
    expiryDate: medicine?.expiryDate || "",
    costPrice: "",
    sellingPrice: medicine?.price.toString() || "",
    mrp: medicine?.mrp.toString() || "",
    minStock: medicine?.minStock.toString() || "",

    // Additional details
    packSize: medicine?.packSize || "",
    dosage: medicine?.dosage || "",
    description: medicine?.description || "",
    notes: "",
  })

  const isNewMedicine = !medicine

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(isNewMedicine ? "Adding new medicine:" : "Adding stock to existing medicine:", formData)
    // TODO: Implement stock addition/medicine creation
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            {isNewMedicine ? "Add New Medicine" : `Add Stock: ${medicine.name}`}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {isNewMedicine && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Medicine Information</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Medicine Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter medicine name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="brand">Brand *</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                        placeholder="Enter brand name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="genericName">Generic Name</Label>
                      <Input
                        id="genericName"
                        value={formData.genericName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, genericName: e.target.value }))}
                        placeholder="Enter generic name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="manufacturer">Manufacturer</Label>
                      <Input
                        id="manufacturer"
                        value={formData.manufacturer}
                        onChange={(e) => setFormData((prev) => ({ ...prev, manufacturer: e.target.value }))}
                        placeholder="Enter manufacturer"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Medicines">Medicines</SelectItem>
                          <SelectItem value="Personal Care">Personal Care</SelectItem>
                          <SelectItem value="Nutrition">Nutrition</SelectItem>
                          <SelectItem value="Medical Devices">Medical Devices</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Input
                        id="subcategory"
                        value={formData.subcategory}
                        onChange={(e) => setFormData((prev) => ({ ...prev, subcategory: e.target.value }))}
                        placeholder="Enter subcategory"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="packSize">Pack Size</Label>
                      <Input
                        id="packSize"
                        value={formData.packSize}
                        onChange={(e) => setFormData((prev) => ({ ...prev, packSize: e.target.value }))}
                        placeholder="e.g., strip of 10 tablets"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dosage">Dosage</Label>
                      <Input
                        id="dosage"
                        value={formData.dosage}
                        onChange={(e) => setFormData((prev) => ({ ...prev, dosage: e.target.value }))}
                        placeholder="e.g., 1 tablet twice daily"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter medicine description"
                      rows={3}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Stock Information</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity to Add *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                    placeholder="Enter quantity"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="minStock">Minimum Stock Level</Label>
                  <Input
                    id="minStock"
                    type="number"
                    min="0"
                    value={formData.minStock}
                    onChange={(e) => setFormData((prev) => ({ ...prev, minStock: e.target.value }))}
                    placeholder="Enter minimum stock"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="batchNumber">Batch Number *</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="batchNumber"
                      value={formData.batchNumber}
                      onChange={(e) => setFormData((prev) => ({ ...prev, batchNumber: e.target.value }))}
                      placeholder="Enter batch number"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pricing Information</h3>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="costPrice">Cost Price (₹)</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costPrice}
                    onChange={(e) => setFormData((prev) => ({ ...prev, costPrice: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="sellingPrice">Selling Price (₹) *</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sellingPrice: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="mrp">MRP (₹) *</Label>
                  <Input
                    id="mrp"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.mrp}
                    onChange={(e) => setFormData((prev) => ({ ...prev, mrp: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes about this stock entry..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {isNewMedicine ? "Add Medicine & Stock" : "Add Stock"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
