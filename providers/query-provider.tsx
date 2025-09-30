"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"
import { cacheManager } from "@/utils/cache"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors
              if (error?.response?.status >= 400 && error?.response?.status < 500) {
                return false
              }
              return failureCount < 3
            },
            queryFn: async (context) => {
              try {
                // Try to fetch from network first
                const response = await fetch(context.queryKey.join("/"))
                if (!response.ok) throw new Error("Network response was not ok")
                const data = await response.json()

                // Cache successful responses
                cacheManager.cacheData(context.queryKey.join("_"), data)
                return data
              } catch (error) {
                // If network fails, try to get from cache
                const cachedData = cacheManager.getCachedData(context.queryKey.join("_"))
                if (cachedData) {
                  return cachedData
                }
                throw error
              }
            },
          },
          mutations: {
            retry: false,
            onError: (error, variables, context) => {
              // If offline, queue mutation for later sync
              if (!navigator.onLine) {
                const pendingMutations = cacheManager.getCachedData("pending_mutations") || []
                pendingMutations.push({
                  variables,
                  context,
                  timestamp: Date.now(),
                })
                cacheManager.cacheData("pending_mutations", pendingMutations)
              }
            },
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
