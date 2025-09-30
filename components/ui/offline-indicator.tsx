"use client"

import { useOffline } from "@/hooks/useOffline"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WifiOff, Wifi } from "lucide-react"

export function OfflineIndicator() {
  const { isOffline, wasOffline } = useOffline()

  if (!isOffline && !wasOffline) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Alert variant={isOffline ? "destructive" : "default"}>
        {isOffline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
        <AlertDescription>
          {isOffline
            ? "You're offline. Changes will be synced when connection is restored."
            : "Connection restored. Syncing data..."}
        </AlertDescription>
      </Alert>
    </div>
  )
}
