import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserCurrency, updateUserCurrency } from "../users";

// Query keys
export const userKeys = {
  all: ["users"] as const,
  currency: () => [...userKeys.all, "currency"] as const,
};

// Get user currency
export const useUserCurrency = () => {
  return useQuery({
    queryKey: userKeys.currency(),
    queryFn: getUserCurrency,
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
