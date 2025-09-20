import client from "./client";
import type { Category } from "../lib/api";
import { mockCategories } from "./mockData";

export const getCategories = async (userId: string): Promise<Category[]> => {
  const { data } = await client.get(`/api/categories?user=${userId}`);
  return data;
};

export const getCategoriesByBudget = async (budgetId: string): Promise<Category[]> => {
  const { data } = await client.get(`/api/categories?budget=${budgetId}`);
  return data;
};

export const createCategory = async (categoryData: {
  name: string;
  budgeted: number;
  budgetId: string;
  userId: string;
}): Promise<Category> => {
  const { data } = await client.post("/api/categories", categoryData);
  return data;
};

export const updateCategory = async (
  id: string,
  updates: Partial<Category>
): Promise<Category> => {
  const { data } = await client.put(`/api/categories/${id}`, updates);
  return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await client.delete(`/api/categories/${id}`);
};
