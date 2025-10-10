export const FEATURES = {
  aiBudgeting: {
    label: "AI Budget Creation",
    description: "Create personalized budgets using natural language with AI assistance",
    plans: ["pro"],
    icon: "sparkles"
  },
  transactionTextInput: {
    label: "Text-to-Transaction Input",
    description: "Convert text descriptions into transactions with AI",
    plans: ["pro"],
    icon: "text"
  },
  exportCSV: {
    label: "CSV Export",
    description: "Export your budget data to CSV format for external analysis",
    plans: ["free", "pro"],
    icon: "download"
  },
  manualBudget: {
    label: "Manual Budget Setup",
    description: "Create budgets manually with categories and sections",
    plans: ["free", "pro"],
    icon: "create"
  },
  advancedAnalytics: {
    label: "Advanced Analytics",
    description: "Detailed spending insights, trends, and visual charts",
    plans: ["pro"],
    icon: "analytics"
  },
  unlimitedCategories: {
    label: "Unlimited Categories",
    description: "Create unlimited budget categories for detailed tracking",
    plans: ["free", "pro"],
    icon: "list"
  },
  prioritySupport: {
    label: "Priority Support",
    description: "Get priority customer support with faster response times",
    plans: ["pro"],
    icon: "headset"
  }
} as const;

export type FeatureKey = keyof typeof FEATURES; 