import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface Budget {
  _id: string;
  month: number;
  year: number;
  totalBudgeted: number;
  totalAvailable: number;
  user: string;
}

interface Category {
  _id?: string;
  id?: string;
  name: string;
  budgeted: number;
  spent: number;
  budgetId: string;
}

interface Expense {
  _id: string;
  categoryId: string;
  amount: number;
  description: string;
  date: string;
  type: "expense" | "income";
}

interface DailySpendingTrackerProps {
  budget: Budget;
  categories: Category[];
  expenses: Expense[];
}

export default function DailySpendingTracker({ budget, categories, expenses }: DailySpendingTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate totals
  const totalSpent = expenses.reduce((sum, expense) => {
    return sum + (expense.type === "expense" ? expense.amount : -expense.amount);
  }, 0);
  
  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const remaining = totalBudgeted - totalSpent;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Daily Spending Tracker</Text>
          <Text style={styles.subtitle}>Track your daily expenses</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[
            styles.remainingAmount,
            { color: remaining < 0 ? "#ef4444" : "#4ade80" }
          ]}>
            ${remaining.toFixed(2)}
          </Text>
          <Text style={styles.remainingLabel}>Available to Spend</Text>
        </View>
      </View>

      <Pressable
        style={styles.expandButton}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.expandButtonText}>
          {isExpanded ? "Show Less" : "Show Details"}
        </Text>
      </Pressable>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Budgeted</Text>
              <Text style={styles.summaryValue}>${totalBudgeted.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Spent</Text>
              <Text style={[styles.summaryValue, { color: "#ef4444" }]}>
                ${totalSpent.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.categoryBreakdown}>
            <Text style={styles.breakdownTitle}>Category Breakdown</Text>
            {categories.map((category) => {
              const categoryExpenses = expenses.filter(exp => exp.categoryId === category._id);
              const categorySpent = categoryExpenses.reduce((sum, exp) => 
                sum + (exp.type === "expense" ? exp.amount : -exp.amount), 0
              );
              const categoryRemaining = category.budgeted - categorySpent;
              const percentage = category.budgeted > 0 ? (categorySpent / category.budgeted) * 100 : 0;

              return (
                <View key={category._id || category.id} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryAmount}>
                      ${categorySpent.toFixed(2)} / ${category.budgeted.toFixed(2)}
                    </Text>
                  </View>
                  
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: percentage > 100 ? "#ef4444" : "#4ade80"
                        }
                      ]} 
                    />
                  </View>
                  
                  <Text style={[
                    styles.categoryRemaining,
                    { color: categoryRemaining >= 0 ? "#4ade80" : "#ef4444" }
                  ]}>
                    ${categoryRemaining.toFixed(2)} remaining
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111",
    borderRadius: 8,
    margin: 16,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  remainingAmount: {
    fontSize: 20,
    fontWeight: "700",
  },
  remainingLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  expandButton: {
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 16,
  },
  expandButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  expandedContent: {
    gap: 16,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  categoryBreakdown: {
    gap: 12,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  categoryItem: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 6,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  categoryAmount: {
    fontSize: 12,
    color: "#888",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  categoryRemaining: {
    fontSize: 12,
    fontWeight: "500",
  },
});
