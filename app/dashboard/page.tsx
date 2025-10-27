"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/roles";
import {
  Users,
  Package,
  FileText,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data - replace with actual API calls
const mockStats = {
  [UserRole.SUPER_ADMIN]: [
    {
      title: "Total Users",
      value: "2,350",
      icon: Users,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Total Revenue",
      value: "$45,231",
      icon: DollarSign,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Active Products",
      value: "1,234",
      icon: Package,
      trend: { value: -2, isPositive: false },
    },
    {
      title: "Pending Orders",
      value: "89",
      icon: ShoppingCart,
      trend: { value: 15, isPositive: true },
    },
  ],
  [UserRole.ADMIN]: [
    {
      title: "Total Employees",
      value: "156",
      icon: UserCheck,
      trend: { value: 5, isPositive: true },
    },
    {
      title: "Active Products",
      value: "1,234",
      icon: Package,
      trend: { value: -2, isPositive: false },
    },
    {
      title: "Monthly Revenue",
      value: "$12,345",
      icon: DollarSign,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Customer Satisfaction",
      value: "94%",
      icon: TrendingUp,
      trend: { value: 3, isPositive: true },
    },
  ],
  [UserRole.SALES]: [
    {
      title: "My Sales",
      value: "$8,234",
      icon: DollarSign,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Active Leads",
      value: "45",
      icon: Users,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Closed Deals",
      value: "23",
      icon: FileText,
      trend: { value: 15, isPositive: true },
    },
    {
      title: "Target Progress",
      value: "78%",
      icon: TrendingUp,
      trend: { value: 5, isPositive: true },
    },
  ],
  [UserRole.EMPLOYEE]: [
    {
      title: "Tasks Completed",
      value: "34",
      icon: FileText,
      trend: { value: 10, isPositive: true },
    },
    {
      title: "Hours Logged",
      value: "156",
      icon: TrendingUp,
      trend: { value: 2, isPositive: true },
    },
    {
      title: "Projects Active",
      value: "8",
      icon: Package,
      trend: { value: 0, isPositive: true },
    },
    {
      title: "Team Rating",
      value: "4.8",
      icon: Users,
      trend: { value: 5, isPositive: true },
    },
  ],
  [UserRole.CUSTOMER]: [
    {
      title: "Total Orders",
      value: "12",
      icon: ShoppingCart,
      trend: { value: 20, isPositive: true },
    },
    {
      title: "Total Spent",
      value: "$2,345",
      icon: DollarSign,
      trend: { value: 15, isPositive: true },
    },
    {
      title: "Loyalty Points",
      value: "1,250",
      icon: TrendingUp,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Saved Items",
      value: "8",
      icon: Package,
      trend: { value: 0, isPositive: true },
    },
  ],
};

export default function DashboardPage() {
  const { user } = useAuth();

  // When rendering before the client has hydrated the auth state, show a
  // lightweight loading placeholder instead of returning `null`. Returning
  // `null` can cause an apparent blank page on SSR-hosted deployments.
  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-48">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = (mockStats as any)[user.role] || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Here's what's happening with your
            business today.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat: any, index: number) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
            />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent activities and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.role === UserRole.SALES && (
                  <>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          New lead from Acme Corp
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Deal closed with TechStart Inc
                        </p>
                        <p className="text-xs text-muted-foreground">
                          5 hours ago
                        </p>
                      </div>
                    </div>
                  </>
                )}
                {user.role === UserRole.ADMIN && (
                  <>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          New employee onboarded
                        </p>
                        <p className="text-xs text-muted-foreground">
                          1 hour ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          System backup completed
                        </p>
                        <p className="text-xs text-muted-foreground">
                          3 hours ago
                        </p>
                      </div>
                    </div>
                  </>
                )}
                {user.role === UserRole.CUSTOMER && (
                  <>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Order #1234 shipped
                        </p>
                        <p className="text-xs text-muted-foreground">
                          1 day ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          New product recommendation
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 days ago
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for your role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user.role === UserRole.SALES && (
                  <>
                    <button className="w-full text-left p-2 hover:bg-muted rounded-md text-sm">
                      Create New Lead
                    </button>
                    <button className="w-full text-left p-2 hover:bg-muted rounded-md text-sm">
                      Generate Quote
                    </button>
                    <button className="w-full text-left p-2 hover:bg-muted rounded-md text-sm">
                      View Pipeline
                    </button>
                  </>
                )}
                {user.role === UserRole.ADMIN && (
                  <>
                    <button className="w-full text-left p-2 hover:bg-muted rounded-md text-sm">
                      Add New User
                    </button>
                    <button className="w-full text-left p-2 hover:bg-muted rounded-md text-sm">
                      View Reports
                    </button>
                    <button className="w-full text-left p-2 hover:bg-muted rounded-md text-sm">
                      System Settings
                    </button>
                  </>
                )}
                {user.role === UserRole.CUSTOMER && (
                  <>
                    <button className="w-full text-left p-2 hover:bg-muted rounded-md text-sm">
                      Browse Products
                    </button>
                    <button className="w-full text-left p-2 hover:bg-muted rounded-md text-sm">
                      Track Orders
                    </button>
                    <button className="w-full text-left p-2 hover:bg-muted rounded-md text-sm">
                      Contact Support
                    </button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
