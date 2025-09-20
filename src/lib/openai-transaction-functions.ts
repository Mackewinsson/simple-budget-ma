export const transactionFunctionSchema = {
  name: "extract_transactions",
  description: "Extracts a list of transactions from natural language input",
  parameters: {
    type: "object",
    properties: {
      transactions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            description: { type: "string" },
            amount: { type: "number" },
            type: { type: "string", enum: ["expense", "income"] },
            category: { type: "string" },
            suggestedCategories: { 
              type: "array", 
              items: { type: "string" },
              description: "Optional: Suggested better category names if the chosen category is not ideal"
            }
          },
          required: ["description", "amount", "type", "category"]
        }
      }
    },
    required: ["transactions"]
  }
} as const;

export type ExtractTransactionsResponse = {
  transactions: Array<{
    description: string;
    amount: number;
    type: "expense" | "income";
    category: string;
    suggestedCategories?: string[];
  }>;
}; 