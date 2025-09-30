"use client"

import { useState } from "react"
import { Download, TrendingUp, Users, Package, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const reportTypes = [
  {
    id: "sales",
    name: "Sales Report",
    description: "Revenue, orders, and sales performance",
    icon: TrendingUp,
  },
  {
    id: "users",
    name: "User Report",
    description: "User registrations, activity, and demographics",
    icon: Users,
  },
  {
    id: "inventory",
    name: "Inventory Report",
    description: "Stock levels, low stock alerts, and medicine catalog",
    icon: Package,
  },
  {
    id: "orders",
    name: "Order Report",
    description: "Order status, fulfillment, and customer orders",
    icon: ShoppingCart,
  },
]

const mockSalesData = [
  { month: "Jan 2024", revenue: 125000, orders: 450, customers: 89 },
  { month: "Feb 2024", revenue: 142000, orders: 523, customers: 102 },
  { month: "Mar 2024", revenue: 138000, orders: 498, customers: 95 },
  { month: "Apr 2024", revenue: 156000, orders: 567, customers: 118 },
]

export function ReportsSection() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-3-months")
  const [selectedReport, setSelectedReport] = useState("sales")

  const handleDownloadReport = (reportType: string) => {
    console.log("Downloading report:", reportType, "for period:", selectedPeriod)
    // TODO: Implement report download
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Reports & Analytics</h3>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={selectedReport} onValueChange={setSelectedReport}>
        <TabsList className="grid w-full grid-cols-4">
          {reportTypes.map((report) => (
            <TabsTrigger key={report.id} value={report.id}>
              <report.icon className="w-4 h-4 mr-2" />
              {report.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹5,61,000</div>
                <p className="text-xs text-muted-foreground">+12% from previous period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,038</div>
                <p className="text-xs text-muted-foreground">+8% from previous period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">404</div>
                <p className="text-xs text-muted-foreground">+15% from previous period</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Monthly Performance</CardTitle>
              <Button onClick={() => handleDownloadReport("sales")}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSalesData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{data.month}</h4>
                      <p className="text-sm text-muted-foreground">{data.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₹{data.revenue.toLocaleString()}</div>
                      <p className="text-sm text-muted-foreground">{data.customers} customers</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Analytics</CardTitle>
              <Button onClick={() => handleDownloadReport("users")}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User analytics and demographics will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Inventory Analytics</CardTitle>
              <Button onClick={() => handleDownloadReport("inventory")}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Inventory reports and stock analytics will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Order Analytics</CardTitle>
              <Button onClick={() => handleDownloadReport("orders")}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Order analytics and fulfillment reports will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
