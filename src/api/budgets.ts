import client from "./client";
import type { Budget } from "../lib/api";
import { mockBudget } from "./mockData";

export const listBudgets = async (userId: string): Promise<Budget[]> => {
  const { data } = await client.get(`/api/budgets?user=${userId}`);
  return data;
};

export const getBudget = async (userId: string): Promise<Budget | null> => {
  try {
    const { data } = await client.get(`/api/budgets?user=${userId}`);
    return data[0] || null;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};

export const createBudget = async (budgetData: {
  month: number;
  year: number;
  totalBudgeted: number;
  totalAvailable: number;
  user: string;
}): Promise<Budget> => {
  const { data } = await client.post("/api/budgets", budgetData);
  return data;
};

export const updateBudget = async (
  id: string,
  updates: Partial<Budget>
): Promise<Budget> => {
  const { data } = await client.put(`/api/budgets/${id}`, updates);
  return data;
};

export const deleteBudget = async (id: string): Promise<void> => {
  await client.delete(`/api/budgets/${id}`);
};

export const resetBudget = async (userId: string): Promise<void> => {
  await client.post("/api/budgets/reset", { userId });
};
