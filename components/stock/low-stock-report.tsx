"use client"

import { AlertTriangle, Download, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Medicine } from "@/types/medical"

interface LowStockReportProps {
  medicines: Medicine[]
}

export function LowStockReport({ medicines }: LowStockReportProps) {
  const lowStockMedicines = medicines.filter((m) => m.stock <= m.minStock)
  const criticalStockMedicines = medicines.filter((m) => m.stock === 0)
  const warningStockMedicines = medicines.filter((m) => m.stock > 0 && m.stock <= m.minStock)

  const totalStockValue = lowStockMedicines.reduce((sum, m) => sum + m.stock * m.price, 0)
  const potentialLoss = criticalStockMedicines.reduce((sum, m) => sum + m.minStock * m.price, 0)

  const handleDownloadReport = () => {
    console.log("Downloading low stock report")
    // TODO: Implement report download
  }

  const getStockSeverity = (medicine: Medicine) => {
    if (medicine.stock === 0) return { level: "Critical", variant: "destructive" as const, color: "text-red-600" }
    if (medicine.stock <= medicine.minStock * 0.5)
      return { level: "Very Low", variant: "secondary" as const, color: "text-orange-600" }
    return { level: "Low", variant: "outline" as const, color: "text-yellow-600" }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Low Stock Report</h3>
        <Button onClick={handleDownloadReport}>
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockMedicines.length}</div>
            <p className="text-xs text-muted-foreground">Items need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical (Out of Stock)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalStockMedicines.length}</div>
            <p className="text-xs text-muted-foreground">Immediate action required</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning Level</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningStockMedicines.length}</div>
            <p className="text-xs text-muted-foreground">Below minimum threshold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Loss</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{potentialLoss.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From out of stock items</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Table */}
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Items ({lowStockMedicines.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {lowStockMedicines.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">All items are well stocked!</h3>
              <p className="text-muted-foreground">No medicines are currently below minimum stock levels.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Shortage</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Value Impact</TableHead>
                  <TableHead>Expiry Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockMedicines.map((medicine) => {
                  const severity = getStockSeverity(medicine)
                  const shortage = Math.max(0, medicine.minStock - medicine.stock)
                  const valueImpact = shortage * medicine.price

                  return (
                    <TableRow key={medicine.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{medicine.name}</div>
                          <div className="text-sm text-muted-foreground">{medicine.genericName}</div>
                        </div>
                      </TableCell>
                      <TableCell>{medicine.brand}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${severity.color}`}>{medicine.stock}</span>
                      </TableCell>
                      <TableCell>{medicine.minStock}</TableCell>
                      <TableCell>
                        <span className="font-medium text-red-600">{shortage}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={severity.variant}>{severity.level}</Badge>
                      </TableCell>
                      <TableCell>₹{valueImpact.toLocaleString()}</TableCell>
                      <TableCell>{new Date(medicine.expiryDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
