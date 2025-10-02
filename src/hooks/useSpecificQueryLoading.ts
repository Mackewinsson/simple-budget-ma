import { useIsFetching, useIsMutating } from '@tanstack/react-query';

export const useSpecificQueryLoading = (queryKey?: string[]) => {
  const isFetching = useIsFetching(queryKey ? { queryKey } : undefined);
  const isMutating = useIsMutating(queryKey ? { queryKey } : undefined);
  
  return {
    isFetching: isFetching > 0,
    isMutating: isMutating > 0,
    isLoading: isFetching > 0 || isMutating > 0,
    fetchingCount: isFetching,
    mutatingCount: isMutating,
  };
};

// Convenience hooks for common query patterns
export const useBudgetLoading = () => useSpecificQueryLoading(['budgets']);
export const useExpensesLoading = () => useSpecificQueryLoading(['expenses']);
export const useCategoriesLoading = () => useSpecificQueryLoading(['categories']);
