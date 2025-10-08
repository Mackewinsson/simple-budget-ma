import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "../src/theme/ThemeContext";
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOW } from "../src/theme/layout";

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
  user: string;
  budget: string;
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
  const { theme } = useTheme();

  // Calculate totals (matching simple-budget logic)
  const totalSpent = expenses.reduce((sum, expense) => {
    return sum + (expense.type === "expense" ? expense.amount : -expense.amount);
  }, 0);

  const remaining = budget?.totalAvailable || 0;
  const totalBudgeted = budget?.totalBudgeted || 0;

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Daily Spending Tracker</Text>
          <Text style={styles.subtitle}>Track your daily expenses</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text
            style={[
              styles.remainingAmount,
              { color: remaining < 0 ? theme.error : theme.success }
            ]}
          >
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
              <Text style={[styles.summaryValue, { color: theme.error }]}>
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
                          backgroundColor: percentage > 100 ? theme.error : theme.success
                        }
                      ]}
                    />
                  </View>
                  
                  <Text
                    style={[
                      styles.categoryRemaining,
                      { color: categoryRemaining >= 0 ? theme.success : theme.error }
                    ]}
                  >
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

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    shadowColor: theme.shadow,
    ...SHADOW.lg,
    shadowOpacity: theme.shadowOpacity * 1.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.lg,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: theme.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: theme.textSecondary,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  remainingAmount: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  remainingLabel: {
    fontSize: FONT_SIZES.xs,
    color: theme.textSecondary,
    marginTop: SPACING.xs / 2,
  },
  expandButton: {
    backgroundColor: theme.surfaceSecondary,
    padding: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: theme.border,
  },
  expandButtonText: {
    color: theme.text,
    fontSize: FONT_SIZES.md,
    fontWeight: "500",
  },
  expandedContent: {
    gap: SPACING.lg,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  summaryCard: {
    backgroundColor: theme.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.border,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.xs,
    color: theme.textSecondary,
    marginBottom: SPACING.xs,
  },
  summaryValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: theme.text,
  },
  categoryBreakdown: {
    gap: SPACING.md,
  },
  breakdownTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: theme.text,
    marginBottom: SPACING.sm,
  },
  categoryItem: {
    backgroundColor: theme.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: theme.border,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  categoryName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: theme.text,
  },
  categoryAmount: {
    fontSize: FONT_SIZES.xs,
    color: theme.textSecondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.surfaceSecondary,
    borderRadius: BORDER_RADIUS.sm - 1,
    marginBottom: SPACING.xs + 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  categoryRemaining: {
    fontSize: 12,
    fontWeight: "500",
  },
});
