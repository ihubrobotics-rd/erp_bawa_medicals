"use client"

import type React from "react"

import { useState } from "react"
import { X, ShoppingCart, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Medicine } from "@/types/medical"

interface CustomerOrderFormProps {
  medicine?: Medicine | null
  onClose: () => void
}

export function CustomerOrderForm({ medicine, onClose }: CustomerOrderFormProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    quantity: 1,
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating customer order:", {
      medicine: medicine?.name,
      total: medicine ? medicine.price * formData.quantity : 0,
      ...formData,
    })
    // TODO: Implement order creation
    onClose()
  }

  const total = medicine ? medicine.price * formData.quantity : 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Create Customer Order
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          {medicine && (
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{medicine.name}</h4>
                  <p className="text-sm text-muted-foreground">{medicine.packSize}</p>
                </div>
                <Badge variant={medicine.stock > medicine.minStock ? "default" : "destructive"}>
                  {medicine.stock > 0 ? `${medicine.stock} in stock` : "Out of stock"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold">₹{medicine.price}</span>
                {medicine.mrp > medicine.price && (
                  <span className="text-sm text-muted-foreground line-through">MRP ₹{medicine.mrp}</span>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                placeholder="Enter customer name"
                required
              />
            </div>

            <div>
              <Label htmlFor="customerPhone">Customer Phone</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData((prev) => ({ ...prev, customerPhone: e.target.value }))}
                placeholder="+91 9876543210"
                required
              />
            </div>

            <div>
              <Label htmlFor="customerAddress">Delivery Address</Label>
              <Textarea
                id="customerAddress"
                value={formData.customerAddress}
                onChange={(e) => setFormData((prev) => ({ ...prev, customerAddress: e.target.value }))}
                placeholder="Enter delivery address"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setFormData((prev) => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) || 1 }))}
                  className="text-center w-20"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setFormData((prev) => ({ ...prev, quantity: prev.quantity + 1 }))}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Order Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special instructions..."
                rows={2}
              />
            </div>

            {medicine && (
              <div className="p-3 bg-primary/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-lg font-bold">₹{total}</span>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Create Order
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
