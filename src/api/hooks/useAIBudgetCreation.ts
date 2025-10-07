import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBudget } from '../budgets';
import { createCategory } from '../categories';
import client from '../client';

export interface AIBudgetCreationRequest {
  description: string;
  userId: string;
  month: number;
  year: number;
}

export interface AIBudgetCreationResponse {
  income: number;
  categories: Array<{
    name: string;
    amount: number;
    sectionName: string;
  }>;
}

export interface AIBudgetCreationResult {
  budget: any;
  categories: any[];
}

export const useAIBudgetCreation = () => {
  const queryClient = useQueryClient();

  const createBudgetFromAI = useMutation({
    mutationFn: async ({ description, userId, month, year }: AIBudgetCreationRequest): Promise<AIBudgetCreationResult> => {
      console.log('[AI Budget Creation] Starting AI budget creation...');
      
      // Step 1: Call AI endpoint to parse the description
      const aiResponse = await client.post<AIBudgetCreationResponse>('/api/budgets/ai-create', {
        description,
        userId,
      });

      console.log('[AI Budget Creation] AI response received:', aiResponse.data);

      const { income, categories } = aiResponse.data;

      // Step 2: Create the budget
      const budgetData = {
        month,
        year,
        totalBudgeted: 0, // Start with 0 budgeted to categories
        totalAvailable: income, // All income is available to budget
        user: userId,
      };

      console.log('[AI Budget Creation] Creating budget with data:', budgetData);
      const budget = await createBudget(budgetData);
      console.log('[AI Budget Creation] Budget created:', budget);

      // Step 3: Create categories
      const createdCategories = [];
      for (const categoryData of categories) {
        console.log('[AI Budget Creation] Creating category:', categoryData);
        const category = await createCategory({
          name: categoryData.name,
          budgeted: categoryData.amount,
          budgetId: budget._id,
        });
        createdCategories.push(category);
        console.log('[AI Budget Creation] Category created:', category);
      }

      return {
        budget,
        categories: createdCategories,
      };
    },
    onSuccess: (data) => {
      console.log('[AI Budget Creation] Success! Budget and categories created:', data);
      
      // Invalidate and refetch budget and category queries
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('[AI Budget Creation] Error:', error);
    },
  });

  return {
    createBudgetFromAI: createBudgetFromAI.mutateAsync,
    isProcessing: createBudgetFromAI.isPending,
    error: createBudgetFromAI.error,
  };
};
