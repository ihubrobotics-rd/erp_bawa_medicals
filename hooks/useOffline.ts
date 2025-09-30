"use client"

import { useState, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { cacheManager } from "@/utils/cache"

export function useOffline() {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    // Initialize cache manager with query client
    cacheManager.setQueryClient(queryClient)

    // Set initial online status
    setIsOnline(navigator.onLine)

    const handleOnline = async () => {
      setIsOnline(true)
      if (wasOffline) {
        // Sync pending mutations when back online
        await cacheManager.syncPendingMutations()
        // Refetch all queries to get latest data
        queryClient.refetchQueries()
        setWasOffline(false)
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(true)
    }

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Clean up expired cache on mount
    cacheManager.clearExpiredCache()

    // Set up periodic cache cleanup
    const cleanupInterval = setInterval(
      () => {
        cacheManager.clearExpiredCache()
      },
      60 * 60 * 1000,
    ) // Every hour

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(cleanupInterval)
    }
  }, [queryClient, wasOffline])

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline,
  }
}
