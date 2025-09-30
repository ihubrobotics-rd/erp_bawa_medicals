"use client"

import { useState } from "react"
import { AlertTriangle, Phone, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { StockAlert } from "@/types/medical"

const mockStockAlerts: StockAlert[] = [
  {
    id: "1",
    medicineId: "3",
    medicine: {
      id: "3",
      name: "Cetirizine 10mg Tablet",
      brand: "Generic",
      genericName: "Cetirizine",
      category: "Medicines",
      subcategory: "Allergy",
      price: 25,
      mrp: 30,
      discount: 17,
      stock: 0,
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
    customerName: "Rajesh Kumar",
    customerPhone: "+91 9876543210",
    salesPersonId: "sales1",
    status: "pending",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    medicineId: "2",
    medicine: {
      id: "2",
      name: "Dolo 650 Tablet",
      brand: "Dolo",
      genericName: "Paracetamol",
      category: "Medicines",
      subcategory: "Pain Relief",
      price: 30,
      mrp: 35,
      discount: 14,
      stock: 15,
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
    customerName: "Priya Sharma",
    customerPhone: "+91 9876543211",
    salesPersonId: "sales1",
    status: "notified",
    createdAt: "2024-01-14T14:20:00Z",
    notifiedAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "3",
    medicineId: "4",
    medicine: {
      id: "4",
      name: "Amoxicillin 500mg Capsule",
      brand: "Generic",
      genericName: "Amoxicillin",
      category: "Medicines",
      subcategory: "Antibiotics",
      price: 120,
      mrp: 150,
      discount: 20,
      stock: 8,
      minStock: 20,
      description: "Antibiotic for bacterial infections",
      dosage: "1 capsule three times daily",
      packSize: "strip of 10 capsules",
      manufacturer: "Various",
      expiryDate: "2025-08-31",
      batchNumber: "AM011",
      prescription: true,
      images: ["/placeholder.svg"],
      tags: ["antibiotic", "prescription", "infection"],
      isActive: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    },
    customerName: "Amit Patel",
    customerPhone: "+91 9876543212",
    salesPersonId: "sales2",
    status: "completed",
    createdAt: "2024-01-12T16:45:00Z",
    notifiedAt: "2024-01-13T10:00:00Z",
  },
]

export function StockAlertsList() {
  const [selectedTab, setSelectedTab] = useState("pending")

  const filteredAlerts = mockStockAlerts.filter((alert) => {
    if (selectedTab === "all") return true
    return alert.status === selectedTab
  })

  const handleNotifyCustomer = (alertId: string) => {
    console.log("Notifying customer for alert:", alertId)
    // TODO: Implement WhatsApp notification
  }

  const handleMarkCompleted = (alertId: string) => {
    console.log("Marking alert as completed:", alertId)
    // TODO: Implement alert completion
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "notified":
        return <Phone className="w-4 h-4 text-blue-600" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary" as const
      case "notified":
        return "default" as const
      case "completed":
        return "outline" as const
      default:
        return "outline" as const
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Stock Alert Notifications</h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{mockStockAlerts.filter((a) => a.status === "pending").length} Pending</Badge>
          <Badge variant="default">{mockStockAlerts.filter((a) => a.status === "notified").length} Notified</Badge>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="notified">Notified</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No alerts found</h3>
                <p className="text-muted-foreground">
                  {selectedTab === "all" ? "No stock alerts have been created yet." : `No ${selectedTab} alerts found.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert) => (
              <Card key={alert.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getStatusIcon(alert.status)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{alert.medicine.name}</h4>
                          <Badge variant="outline">{alert.medicine.brand}</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>
                            <strong>Customer:</strong> {alert.customerName} | {alert.customerPhone}
                          </p>
                          <p>
                            <strong>Current Stock:</strong> {alert.medicine.stock} units (Min: {alert.medicine.minStock}
                            )
                          </p>
                          <p>
                            <strong>Created:</strong> {new Date(alert.createdAt).toLocaleDateString()}{" "}
                            {new Date(alert.createdAt).toLocaleTimeString()}
                          </p>
                          {alert.notifiedAt && (
                            <p>
                              <strong>Notified:</strong> {new Date(alert.notifiedAt).toLocaleDateString()}{" "}
                              {new Date(alert.notifiedAt).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(alert.status)}>{alert.status.toUpperCase()}</Badge>

                      {alert.status === "pending" && alert.medicine.stock > 0 && (
                        <Button size="sm" onClick={() => handleNotifyCustomer(alert.id)}>
                          <Phone className="w-3 h-3 mr-1" />
                          Notify
                        </Button>
                      )}

                      {alert.status === "notified" && (
                        <Button size="sm" variant="outline" onClick={() => handleMarkCompleted(alert.id)}>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
