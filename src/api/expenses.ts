import client from "./client";
import type { Expense } from "../lib/api";
import { mockExpenses } from "./mockData";

export const getExpenses = async (userId: string): Promise<Expense[]> => {
  const { data } = await client.get(`/api/expenses?user=${userId}`);
  return data;
};

export const createExpense = async (expenseData: {
  user: string;
  budget: string;
  categoryId: string;
  amount: number;
  description: string;
  date: string;
  type: "expense" | "income";
}): Promise<Expense> => {
  const { data } = await client.post("/api/expenses", expenseData);
  return data;
};

export const updateExpense = async (
  id: string,
  updates: Partial<Expense>
): Promise<Expense> => {
  const { data } = await client.put(`/api/expenses/${id}`, updates);
  return data;
};

export const deleteExpense = async (id: string): Promise<void> => {
  await client.delete(`/api/expenses/${id}`);
};
