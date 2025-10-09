import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: { 
    queries: { 
      staleTime: 5 * 60 * 1000, // 5 minutes instead of 30 seconds
      gcTime: 10 * 60 * 1000, // 10 minutes garbage collection time (replaces cacheTime)
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Don't refetch on mount if data is fresh
      refetchOnReconnect: true, // Refetch when network reconnects
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    }
  },
});
