"use client"

import { useState } from "react"
import { Save, Bell, Database, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export function SystemSettings() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "MediCare Pharmacy",
    siteDescription: "Your trusted online pharmacy",
    contactEmail: "support@medicare.com",
    contactPhone: "+91 1800-123-4567",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    stockAlerts: true,
    orderNotifications: true,

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,

    // Business Settings
    taxRate: 18,
    deliveryCharge: 50,
    freeDeliveryThreshold: 500,
    returnPeriod: 7,
  })

  const handleSave = (section: string) => {
    console.log("Saving settings for section:", section, settings)
    // TODO: Implement settings save
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">System Settings</h3>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings((prev) => ({ ...prev, siteName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings((prev) => ({ ...prev, contactEmail: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings((prev) => ({ ...prev, siteDescription: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings((prev) => ({ ...prev, contactPhone: e.target.value }))}
                />
              </div>

              <Button onClick={() => handleSave("general")}>
                <Save className="w-4 h-4 mr-2" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send notifications via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, emailNotifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, smsNotifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="stockAlerts">Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">Alert when stock is low</p>
                </div>
                <Switch
                  id="stockAlerts"
                  checked={settings.stockAlerts}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, stockAlerts: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="orderNotifications">Order Notifications</Label>
                  <p className="text-sm text-muted-foreground">Notify on new orders</p>
                </div>
                <Switch
                  id="orderNotifications"
                  checked={settings.orderNotifications}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, orderNotifications: checked }))}
                />
              </div>

              <Button onClick={() => handleSave("notifications")}>
                <Save className="w-4 h-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for admin users</p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, twoFactorAuth: checked }))}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings((prev) => ({ ...prev, sessionTimeout: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={settings.passwordExpiry}
                    onChange={(e) => setSettings((prev) => ({ ...prev, passwordExpiry: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("security")}>
                <Save className="w-4 h-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={settings.taxRate}
                    onChange={(e) => setSettings((prev) => ({ ...prev, taxRate: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryCharge">Delivery Charge (₹)</Label>
                  <Input
                    id="deliveryCharge"
                    type="number"
                    value={settings.deliveryCharge}
                    onChange={(e) => setSettings((prev) => ({ ...prev, deliveryCharge: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="freeDeliveryThreshold">Free Delivery Threshold (₹)</Label>
                  <Input
                    id="freeDeliveryThreshold"
                    type="number"
                    value={settings.freeDeliveryThreshold}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, freeDeliveryThreshold: Number(e.target.value) }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="returnPeriod">Return Period (days)</Label>
                  <Input
                    id="returnPeriod"
                    type="number"
                    value={settings.returnPeriod}
                    onChange={(e) => setSettings((prev) => ({ ...prev, returnPeriod: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("business")}>
                <Save className="w-4 h-4 mr-2" />
                Save Business Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
