import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { budgetKeys } from '../api/hooks/useBudgets';
import { expenseKeys } from '../api/hooks/useExpenses';
import { categoryKeys } from '../api/hooks/useCategories';
import { getBudget, listBudgets } from '../api/budgets';
import { getExpenses } from '../api/expenses';
import { getCategories } from '../api/categories';

export function usePrefetchData() {
  const queryClient = useQueryClient();
  
  const prefetchUserData = useCallback(async (userId: string) => {
    try {
      // Prefetch budget data
      await queryClient.prefetchQuery({
        queryKey: budgetKeys.list(userId),
        queryFn: () => listBudgets(userId),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });

      // Prefetch expenses data
      await queryClient.prefetchQuery({
        queryKey: expenseKeys.list(userId),
        queryFn: () => getExpenses(userId),
        staleTime: 5 * 60 * 1000,
      });

      console.log('[Prefetch] User data prefetched successfully');
    } catch (error) {
      console.log('[Prefetch] Error prefetching user data:', error);
    }
  }, [queryClient]);

  const prefetchBudgetCategories = useCallback(async (budgetId: string) => {
    try {
      await queryClient.prefetchQuery({
        queryKey: categoryKeys.list(budgetId),
        queryFn: () => getCategories(budgetId),
        staleTime: 5 * 60 * 1000,
      });

      console.log('[Prefetch] Budget categories prefetched successfully');
    } catch (error) {
      console.log('[Prefetch] Error prefetching budget categories:', error);
    }
  }, [queryClient]);

  return { 
    prefetchUserData, 
    prefetchBudgetCategories 
  };
}
