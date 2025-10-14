"use client"
import { MoreHorizontal, Plus, Edit, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Medicine } from "@/types/medical"

interface StockTableProps {
  medicines: Medicine[]
  onAddStock: (medicine: Medicine) => void
}

export function StockTable({ medicines, onAddStock }: StockTableProps) {
  const getStockStatus = (medicine: Medicine) => {
    if (medicine.stock === 0) return { status: "Out of Stock", variant: "destructive" as const }
    if (medicine.stock <= medicine.minStock) return { status: "Low Stock", variant: "secondary" as const }
    return { status: "In Stock", variant: "default" as const }
  }

  const getStockColor = (medicine: Medicine) => {
    if (medicine.stock === 0) return "text-red-600"
    if (medicine.stock <= medicine.minStock) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Management ({medicines.length} items)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicine</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Min Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicines.map((medicine) => {
              const stockStatus = getStockStatus(medicine)
              return (
                <TableRow key={medicine.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{medicine.name}</div>
                      <div className="text-sm text-muted-foreground">{medicine.genericName}</div>
                    </div>
                  </TableCell>
                  <TableCell>{medicine.brand}</TableCell>
                  <TableCell>{medicine.category}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${getStockColor(medicine)}`}>{medicine.stock}</span>
                  </TableCell>
                  <TableCell>{medicine.minStock}</TableCell>
                  <TableCell>
                    <Badge variant={stockStatus.variant}>{stockStatus.status}</Badge>
                  </TableCell>
                  <TableCell>{medicine.batchNumber}</TableCell>
                  {/* FIX: Enforce a consistent date format */}
                  <TableCell>
                    {new Date(medicine.expiryDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onAddStock(medicine)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Stock
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Medicine
                        </DropdownMenuItem>
                        {medicine.stock <= medicine.minStock && (
                          <DropdownMenuItem>
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Create Alert
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}