import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getBudget, 
  createBudget, 
  updateBudget, 
  deleteBudget, 
  resetBudget 
} from "../budgets";
import type { Budget } from "../../lib/api";

// Query keys
export const budgetKeys = {
  all: ["budgets"] as const,
  lists: () => [...budgetKeys.all, "list"] as const,
  list: (userId: string) => [...budgetKeys.lists(), userId] as const,
  details: () => [...budgetKeys.all, "detail"] as const,
  detail: (id: string) => [...budgetKeys.details(), id] as const,
};

// Get budget for a user
export const useBudget = (userId: string) => {
  return useQuery({
    queryKey: budgetKeys.list(userId),
    queryFn: () => getBudget(userId),
    enabled: !!userId,
  });
};

// Create budget mutation
export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBudget,
    onSuccess: (data, variables) => {
      // Invalidate and refetch budget queries
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
      // TODO: Replace toast with React Native alternative
      console.log("Budget created successfully");
    },
    onError: (error) => {
      console.error("Failed to create budget:", error);
      // TODO: Replace toast with React Native alternative
      console.error("Failed to create budget");
    },
  });
};

// Update budget mutation
export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Budget> }) =>
      updateBudget(id, updates),
    onSuccess: (data, variables) => {
      // Force refetch all budget queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      
      // Also refetch any specific budget queries
      queryClient.refetchQueries({ queryKey: budgetKeys.detail(variables.id) });
      queryClient.refetchQueries({ queryKey: budgetKeys.lists() });
      
      console.log("Budget updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update budget:", error);
      console.error("Failed to update budget");
    },
  });
};

// Delete budget mutation
export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudget,
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: budgetKeys.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
      console.log("Budget deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete budget:", error);
      console.error("Failed to delete budget");
    },
  });
};

// Reset budget mutation
export const useResetBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetBudget,
    onSuccess: (data, userId) => {
      // Invalidate all related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });

      // Force refetch the budget to get updated totals
      queryClient.refetchQueries({ queryKey: budgetKeys.list(userId) });

      console.log("Budget reset successfully");
    },
    onError: (error) => {
      console.error("Failed to reset budget:", error);
      console.error("Failed to reset budget");
    },
  });
};
