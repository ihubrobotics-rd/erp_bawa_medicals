"use client"

import type React from "react"

import { useAuth } from "@/hooks/useAuth"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { OfflineIndicator } from "@/components/ui/offline-indicator"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <OfflineIndicator />
      <div className="flex">
        <Sidebar className="fixed left-0 top-0 h-full border-r bg-background" />
        <div className="flex-1 ml-64">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
