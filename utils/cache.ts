import type { QueryClient } from "@tanstack/react-query"

// Cache utilities for offline support
export class CacheManager {
  private static instance: CacheManager
  private queryClient: QueryClient | null = null

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  setQueryClient(client: QueryClient) {
    this.queryClient = client
  }

  // Cache data to localStorage for offline access
  cacheData(key: string, data: any, ttl: number = 24 * 60 * 60 * 1000) {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now(),
        ttl,
      }
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem))
    } catch (error) {
      console.warn("Failed to cache data:", error)
    }
  }

  // Retrieve cached data
  getCachedData(key: string) {
    try {
      const cached = localStorage.getItem(`cache_${key}`)
      if (!cached) return null

      const cacheItem = JSON.parse(cached)
      const now = Date.now()

      if (now - cacheItem.timestamp > cacheItem.ttl) {
        localStorage.removeItem(`cache_${key}`)
        return null
      }

      return cacheItem.data
    } catch (error) {
      console.warn("Failed to retrieve cached data:", error)
      return null
    }
  }

  // Clear expired cache entries
  clearExpiredCache() {
    try {
      const keys = Object.keys(localStorage).filter((key) => key.startsWith("cache_"))
      const now = Date.now()

      keys.forEach((key) => {
        try {
          const cached = localStorage.getItem(key)
          if (cached) {
            const cacheItem = JSON.parse(cached)
            if (now - cacheItem.timestamp > cacheItem.ttl) {
              localStorage.removeItem(key)
            }
          }
        } catch (error) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.warn("Failed to clear expired cache:", error)
    }
  }

  // Sync cached mutations when back online
  async syncPendingMutations() {
    if (!this.queryClient) return

    try {
      const pendingMutations = this.getCachedData("pending_mutations") || []

      for (const mutation of pendingMutations) {
        try {
          // Retry the mutation
          await this.queryClient
            .getMutationCache()
            .build(this.queryClient, mutation.options)
            .execute(mutation.variables)
        } catch (error) {
          console.warn("Failed to sync mutation:", error)
        }
      }

      // Clear synced mutations
      localStorage.removeItem("cache_pending_mutations")
    } catch (error) {
      console.warn("Failed to sync pending mutations:", error)
    }
  }
}

export const cacheManager = CacheManager.getInstance()
