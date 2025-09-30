"use client"

import type React from "react"

import { useState } from "react"
import { X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Medicine } from "@/types/medical"

interface StockAlertFormProps {
  medicine?: Medicine | null
  onClose: () => void
}

export function StockAlertForm({ medicine, onClose }: StockAlertFormProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating stock alert:", {
      medicine: medicine?.name,
      ...formData,
    })
    // TODO: Implement stock alert creation
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Stock Alert Request
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          {medicine && (
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <h4 className="font-medium">{medicine.name}</h4>
              <p className="text-sm text-muted-foreground">Current Stock: {medicine.stock} units</p>
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
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Create Alert
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
