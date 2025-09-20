// Mock data for demo purposes
export const mockBudget = {
  _id: "demo-budget-123",
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  totalBudgeted: 3000,
  totalAvailable: 2500,
  user: "demo-user-123",
};

export const mockCategories = [
  {
    _id: "cat-1",
    name: "Groceries",
    budgeted: 500,
    spent: 320,
    budgetId: "demo-budget-123",
  },
  {
    _id: "cat-2", 
    name: "Transportation",
    budgeted: 300,
    spent: 180,
    budgetId: "demo-budget-123",
  },
  {
    _id: "cat-3",
    name: "Entertainment",
    budgeted: 200,
    spent: 150,
    budgetId: "demo-budget-123",
  },
];

export const mockExpenses = [
  {
    _id: "exp-1",
    categoryId: "cat-1",
    amount: 85.50,
    description: "Whole Foods grocery shopping",
    date: "2024-01-15",
    type: "expense" as const,
  },
  {
    _id: "exp-2",
    categoryId: "cat-2",
    amount: 45.00,
    description: "Uber ride to airport",
    date: "2024-01-14",
    type: "expense" as const,
  },
  {
    _id: "exp-3",
    categoryId: "cat-3",
    amount: 25.00,
    description: "Movie tickets",
    date: "2024-01-13",
    type: "expense" as const,
  },
  {
    _id: "exp-4",
    categoryId: "cat-1",
    amount: 120.00,
    description: "Salary deposit",
    date: "2024-01-12",
    type: "income" as const,
  },
];
