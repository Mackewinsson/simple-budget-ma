import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getCategories, 
  getCategoriesByBudget, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "../categories";
import type { Category } from "../../lib/api";

// Query keys
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (userId: string) => [...categoryKeys.lists(), userId] as const,
  byBudget: (budgetId: string) => [...categoryKeys.all, "byBudget", budgetId] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

// Get categories for a user
export const useCategories = (userId: string) => {
  return useQuery({
    queryKey: categoryKeys.list(userId),
    queryFn: () => getCategories(userId),
    enabled: !!userId,
  });
};

// Get categories for a budget
export const useCategoriesByBudget = (budgetId: string) => {
  return useQuery({
    queryKey: categoryKeys.byBudget(budgetId),
    queryFn: () => getCategoriesByBudget(budgetId),
    enabled: !!budgetId,
  });
};

// Create category mutation
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (data, variables) => {
      // Invalidate and refetch category queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.byBudget(variables.budgetId) });
      console.log("Category created successfully");
    },
    onError: (error) => {
      console.error("Failed to create category:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
    },
  });
};

// Update category mutation
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Category> }) =>
      updateCategory(id, updates),
    onSuccess: (data, variables) => {
      // Invalidate all category queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      console.log("Category updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update category:", error);
      console.error("Failed to update category");
    },
  });
};

// Delete category mutation
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      console.log("Category deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete category:", error);
      console.error("Failed to delete category");
    },
  });
};
