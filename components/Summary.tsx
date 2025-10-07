import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useBudget } from "../src/api/hooks/useBudgets";
import { useCategories } from "../src/api/hooks/useCategories";
import { useExpenses } from "../src/api/hooks/useExpenses";
import { useDemoUser } from "../src/api/hooks/useDemoUser";
import { useTheme } from "../src/theme/ThemeContext";
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOW } from "../src/theme/layout";

export default function Summary() {
  const { data: demoUser } = useDemoUser();
  const { data: budget } = useBudget(demoUser?._id || "");
  const { data: categories = [] } = useCategories(demoUser?._id || "");
  const { data: expenses = [] } = useExpenses(demoUser?._id || "");
  const { theme } = useTheme();

  // Calculate totals
  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = expenses.reduce((sum, expense) => {
    return sum + (expense.type === "expense" ? expense.amount : -expense.amount);
  }, 0);
  const remaining = totalBudgeted - totalSpent;

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budget Summary</Text>
      
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

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Remaining</Text>
          <Text style={[
            styles.summaryValue,
            { color: remaining >= 0 ? theme.success : theme.error }
          ]}>
            ${remaining.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Categories</Text>
          <Text style={styles.summaryValue}>{categories.length}</Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: theme.text,
    marginBottom: SPACING.lg,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
  },
  summaryCard: {
    backgroundColor: theme.cardBackground,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.cardBorder,
    shadowColor: theme.shadow,
    ...SHADOW.md,
    shadowOpacity: theme.shadowOpacity,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.xs,
    color: theme.textSecondary,
    marginBottom: SPACING.xs,
  },
  summaryValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: theme.text,
  },
});
