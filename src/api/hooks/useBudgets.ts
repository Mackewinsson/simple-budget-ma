import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getBudget, 
  listBudgets,
  createBudget, 
  updateBudget, 
  deleteBudget, 
  resetBudget 
} from "../budgets";
import type { Budget } from "../../lib/api";
import { logError, categorizeError } from "../../lib/errorUtils";

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

// Get all budgets for a user (used for duplicate/period checks)
export const useBudgetsCollection = (
  userId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery<Budget[]>({
    queryKey: [...budgetKeys.list(userId), "collection"],
    queryFn: () => listBudgets(userId),
    enabled: !!userId && (options?.enabled ?? true),
  });
};

// Create budget mutation with optimistic updates
export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBudget,
    onMutate: async (newBudget) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: budgetKeys.lists() });

      // Snapshot previous value
      const previousBudgets = queryClient.getQueryData(budgetKeys.lists());

      // Optimistically update the cache
      const optimisticBudget = {
        ...newBudget,
        _id: `temp-${Date.now()}`,
        isOptimistic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      queryClient.setQueryData(budgetKeys.list(newBudget.user), optimisticBudget);
      queryClient.setQueryData(budgetKeys.lists(), (old: any) => {
        if (!old) return [optimisticBudget];
        return [...old, optimisticBudget];
      });

      return { previousBudgets };
    },
    onSuccess: (data, variables) => {
      // Update cache with real data from server
      queryClient.setQueryData(budgetKeys.list(variables.user), data);
      queryClient.setQueryData(budgetKeys.lists(), (old: any) => {
        if (!old) return [data];
        return old.map((budget: any) => 
          budget.isOptimistic && budget.user === variables.user
            ? { ...data, isOptimistic: false }
            : budget
        );
      });
      
      console.log("Budget created successfully");
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update on error
      if (context?.previousBudgets) {
        queryClient.setQueryData(budgetKeys.lists(), context.previousBudgets);
        queryClient.removeQueries({ queryKey: budgetKeys.list(variables.user) });
      }
      
      logError("Budget Creation", error);
      const errorInfo = categorizeError(error);
      console.error("Failed to create budget:", errorInfo.message);
    },
    onSettled: () => {
      // Ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
    },
  });
};

// Update budget mutation with optimistic updates
export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Budget> }) =>
      updateBudget(id, updates),
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: budgetKeys.all });

      // Snapshot previous values
      const previousBudgets = queryClient.getQueryData(budgetKeys.lists());
      const previousBudget = queryClient.getQueryData(budgetKeys.detail(id));

      // Optimistically update the cache
      queryClient.setQueryData(budgetKeys.detail(id), (old: any) => 
        old ? { ...old, ...updates, isOptimistic: true } : old
      );
      
      queryClient.setQueryData(budgetKeys.lists(), (old: any) => {
        if (!old) return old;
        return old.map((budget: any) => 
          budget._id === id 
            ? { ...budget, ...updates, isOptimistic: true }
            : budget
        );
      });

      return { previousBudgets, previousBudget };
    },
    onSuccess: (data, variables) => {
      // Update cache with real data from server
      queryClient.setQueryData(budgetKeys.detail(variables.id), { ...data, isOptimistic: false });
      queryClient.setQueryData(budgetKeys.lists(), (old: any) => {
        if (!old) return old;
        return old.map((budget: any) => 
          budget._id === variables.id 
            ? { ...data, isOptimistic: false }
            : budget
        );
      });
      
      console.log("Budget updated successfully");
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update on error
      if (context?.previousBudgets) {
        queryClient.setQueryData(budgetKeys.lists(), context.previousBudgets);
      }
      if (context?.previousBudget) {
        queryClient.setQueryData(budgetKeys.detail(variables.id), context.previousBudget);
      }
      
      logError("Budget Update", error);
      const errorInfo = categorizeError(error);
      console.error("Failed to update budget:", errorInfo.message);
    },
    onSettled: () => {
      // Ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
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
      logError("Budget Delete", error);
      const errorInfo = categorizeError(error);
      console.error("Failed to delete budget:", errorInfo.message);
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
      logError("Budget Reset", error);
      const errorInfo = categorizeError(error);
      console.error("Failed to reset budget:", errorInfo.message);
    },
  });
};
