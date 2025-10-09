import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getExpenses, 
  createExpense, 
  updateExpense, 
  deleteExpense 
} from "../expenses";
import type { Expense } from "../../lib/api";
import { logError, categorizeError } from "../../lib/errorUtils";

// Query keys
export const expenseKeys = {
  all: ["expenses"] as const,
  lists: () => [...expenseKeys.all, "list"] as const,
  list: (userId: string) => [...expenseKeys.lists(), userId] as const,
  details: () => [...expenseKeys.all, "detail"] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
};

// Get expenses for a user
export const useExpenses = (userId: string) => {
  return useQuery({
    queryKey: expenseKeys.list(userId),
    queryFn: () => getExpenses(userId),
    enabled: !!userId,
  });
};

// Create expense mutation with optimistic updates
export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onMutate: async (newExpense) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: expenseKeys.lists() });

      // Snapshot previous value
      const previousExpenses = queryClient.getQueryData(expenseKeys.lists());

      // Optimistically update the cache
      queryClient.setQueryData(expenseKeys.lists(), (old: any) => {
        if (!old) return old;
        return [
          ...old,
          { 
            ...newExpense, 
            _id: `temp-${Date.now()}`, 
            isOptimistic: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
      });

      return { previousExpenses };
    },
    onSuccess: (data, variables) => {
      // Update cache with real data from server
      queryClient.setQueryData(expenseKeys.lists(), (old: any) => {
        if (!old) return old;
        return old.map((expense: any) => 
          expense.isOptimistic && expense.description === variables.description
            ? { ...data, isOptimistic: false }
            : expense
        );
      });
      
      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      console.log("Expense created successfully");
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update on error
      if (context?.previousExpenses) {
        queryClient.setQueryData(expenseKeys.lists(), context.previousExpenses);
      }
      
      logError("Expense Creation", error);
      const errorInfo = categorizeError(error);
      console.error("Failed to create expense:", errorInfo.message);
    },
    onSettled: () => {
      // Ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
    },
  });
};

// Update expense mutation with optimistic updates
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Expense> }) =>
      updateExpense(id, updates),
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: expenseKeys.lists() });

      // Snapshot previous value
      const previousExpenses = queryClient.getQueryData(expenseKeys.lists());

      // Optimistically update the cache
      queryClient.setQueryData(expenseKeys.lists(), (old: any) => {
        if (!old) return old;
        return old.map((expense: any) => 
          expense._id === id 
            ? { ...expense, ...updates, isOptimistic: true }
            : expense
        );
      });

      return { previousExpenses };
    },
    onSuccess: (data, variables) => {
      // Update cache with real data from server
      queryClient.setQueryData(expenseKeys.lists(), (old: any) => {
        if (!old) return old;
        return old.map((expense: any) => 
          expense._id === variables.id 
            ? { ...data, isOptimistic: false }
            : expense
        );
      });
      
      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      console.log("Expense updated successfully");
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update on error
      if (context?.previousExpenses) {
        queryClient.setQueryData(expenseKeys.lists(), context.previousExpenses);
      }
      
      logError("Expense Update", error);
      const errorInfo = categorizeError(error);
      console.error("Failed to update expense:", errorInfo.message);
    },
    onSettled: () => {
      // Ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
    },
  });
};

// Delete expense mutation with optimistic updates
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: expenseKeys.lists() });

      // Snapshot previous value
      const previousExpenses = queryClient.getQueryData(expenseKeys.lists());

      // Optimistically remove from cache
      queryClient.setQueryData(expenseKeys.lists(), (old: any) => {
        if (!old) return old;
        return old.filter((expense: any) => expense._id !== id);
      });

      return { previousExpenses };
    },
    onSuccess: (_, id) => {
      // Remove from cache (already done optimistically)
      queryClient.removeQueries({ queryKey: expenseKeys.detail(id) });
      
      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      console.log("Expense deleted successfully");
    },
    onError: (error, id, context) => {
      // Rollback optimistic update on error
      if (context?.previousExpenses) {
        queryClient.setQueryData(expenseKeys.lists(), context.previousExpenses);
      }
      
      logError("Expense Delete", error);
      const errorInfo = categorizeError(error);
      console.error("Failed to delete expense:", errorInfo.message);
    },
    onSettled: () => {
      // Ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
    },
  });
};
