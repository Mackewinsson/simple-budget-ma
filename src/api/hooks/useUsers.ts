import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserCurrency, updateUserCurrency } from "../users";
import { useAuthStore } from "../../store/authStore";

// Query keys
export const userKeys = {
  all: ["users"] as const,
  currency: () => [...userKeys.all, "currency"] as const,
};

// Get user currency
export const useUserCurrency = () => {
  const { isAuthenticated, session } = useAuthStore();
  
  return useQuery({
    queryKey: userKeys.currency(),
    queryFn: getUserCurrency,
    enabled: isAuthenticated && !!session?.token, // Only run if user is authenticated AND has a token
    retry: false, // Don't retry on failure to avoid multiple 401s
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
};

// Update user currency mutation
export const useUpdateUserCurrency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserCurrency,
    onSuccess: () => {
      // Invalidate currency query
      queryClient.invalidateQueries({ queryKey: userKeys.currency() });
      console.log("Currency updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update currency:", error);
      console.error("Failed to update currency");
    },
  });
};
