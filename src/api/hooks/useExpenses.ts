import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getExpenses, 
  createExpense, 
  updateExpense, 
  deleteExpense 
} from "../expenses";
import type { Expense } from "../../lib/api";

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

// Create expense mutation
export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: (data, variables) => {
      // Invalidate and refetch expense queries
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      // Also invalidate budget and category queries since expenses affect their totals
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      console.log("Expense created successfully");
    },
    onError: (error) => {
      console.error("Failed to create expense:", error);
      console.error("Failed to create expense");
    },
  });
};

// Update expense mutation
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Expense> }) =>
      updateExpense(id, updates),
    onSuccess: (data, variables) => {
      // Invalidate all expense queries
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      // Also invalidate budget and category queries
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      console.log("Expense updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update expense:", error);
      console.error("Failed to update expense");
    },
  });
};

// Delete expense mutation
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: expenseKeys.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      // Also invalidate budget and category queries
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      console.log("Expense deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete expense:", error);
      console.error("Failed to delete expense");
    },
  });
};
