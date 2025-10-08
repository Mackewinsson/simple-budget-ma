import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBudget } from "../../src/api/hooks/useBudgets";
import { useCategories } from "../../src/api/hooks/useCategories";
import { useExpenses } from "../../src/api/hooks/useExpenses";
import { useAuthStore } from "../../src/store/authStore";
import { useTheme } from "../../src/theme/ThemeContext";
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOW } from "../../src/theme/layout";

function ReportsScreenContent() {
  const { session } = useAuthStore();
  const { data: budget, isLoading: budgetLoading } = useBudget(session?.user?.id || "");
  const { data: categories = [], isLoading: categoriesLoading } = useCategories(session?.user?.id || "");
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses(session?.user?.id || "");
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const isLoading = budgetLoading || categoriesLoading || expensesLoading;

  const styles = createStyles(theme);

  const handleExportData = () => {
    Alert.alert(
      "Export Data",
      "Export functionality will be available in a future update.",
      [{ text: "OK" }]
    );
  };

  const handleGenerateReport = () => {
    Alert.alert(
      "Generate Report",
      "Report generation will be available in a future update.",
      [{ text: "OK" }]
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
        <View style={styles.loadingContainer}>
          <Ionicons name="bar-chart-outline" size={48} color={theme.textSecondary} />
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      </View>
    );
  }

  if (!budget) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
        <View style={styles.emptyContainer}>
          <Ionicons name="bar-chart-outline" size={64} color={theme.textSecondary} />
          <Text style={styles.emptyTitle}>No reports yet</Text>
          <Text style={styles.emptyText}>Create a budget first to view your financial reports</Text>
        </View>
      </View>
    );
  }

  // Calculate analytics (matching simple-budget logic)
  const totalBudgetedInCategories = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalBudget = totalBudgetedInCategories + (budget?.totalAvailable || 0);
  const totalSpent = expenses.reduce((sum, expense) => {
    return sum + (expense.type === "expense" ? expense.amount : -expense.amount);
  }, 0);
  const remaining = budget?.totalAvailable || 0;
  const spendingPercentage = totalBudgetedInCategories > 0 ? (totalSpent / totalBudgetedInCategories) * 100 : 0;

  // Calculate monthly spending
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && 
           expenseDate.getFullYear() === currentYear &&
           expense.type === "expense";
  });
  const monthlySpending = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Top spending categories
  const categorySpending = categories.map(category => {
    const categoryExpenses = expenses.filter(exp => 
      exp.categoryId === category._id && exp.type === "expense"
    );
    const spent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      name: category.name,
      spent,
      budgeted: category.budgeted,
      percentage: category.budgeted > 0 ? (spent / category.budgeted) * 100 : 0
    };
  }).sort((a, b) => b.spent - a.spent);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.primary, theme.primaryDark || theme.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Reports</Text>
          <View style={styles.periodBadge}>
            <Ionicons name="time-outline" size={16} color={theme.onPrimaryMuted} />
            <Text style={styles.periodText}>This month</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContent}>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget Overview</Text>
        <View style={styles.overviewGrid}>
          <View style={styles.overviewCard}>
            <Ionicons name="wallet-outline" size={24} color={theme.primary} />
            <Text style={styles.overviewLabel}>Budgeted</Text>
            <Text style={styles.overviewValue}>${totalBudget.toFixed(2)}</Text>
          </View>
          <View style={styles.overviewCard}>
            <Ionicons name="trending-down-outline" size={24} color={theme.error} />
            <Text style={styles.overviewLabel}>Spent</Text>
            <Text style={[styles.overviewValue, { color: theme.error }]}>
              ${totalSpent.toFixed(2)}
            </Text>
          </View>
          <View style={styles.overviewCard}>
            <Ionicons name="cash-outline" size={24} color={remaining >= 0 ? theme.success : theme.error} />
            <Text style={styles.overviewLabel}>Remaining</Text>
            <Text style={[
              styles.overviewValue,
              { color: remaining >= 0 ? theme.success : theme.error }
            ]}>
              ${remaining.toFixed(2)}
            </Text>
          </View>
          <View style={styles.overviewCard}>
            <Ionicons name="pie-chart-outline" size={24} color={theme.primary} />
            <Text style={styles.overviewLabel}>Usage</Text>
            <Text style={styles.overviewValue}>{spendingPercentage.toFixed(1)}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Monthly Spending</Text>
          <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
        </View>
        <View style={styles.monthlyCard}>
          <Text style={styles.monthlyAmount}>${monthlySpending.toFixed(2)}</Text>
          <Text style={styles.monthlyLabel}>
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          <Text style={styles.monthlyTransactions}>{monthlyExpenses.length} transactions</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Spending Categories</Text>
        {categorySpending.length === 0 ? (
          <View style={styles.emptyCategories}>
            <Ionicons name="albums-outline" size={40} color={theme.textSecondary} />
            <Text style={styles.emptyCategoriesText}>No spending data yet</Text>
          </View>
        ) : (
          categorySpending.slice(0, 5).map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryRank}>#{index + 1}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <Text style={styles.categorySpent}>${category.spent.toFixed(2)}</Text>
              </View>
              <View style={styles.categoryProgress}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(category.percentage, 100)}%`,
                        backgroundColor: category.percentage > 100 ? theme.error : category.percentage > 80 ? theme.warning : theme.success
                      }
                    ]}
                  />
                </View>
                <Text style={[
                  styles.categoryPercentage,
                  { color: category.percentage > 100 ? theme.error : theme.textSecondary }
                ]}>
                  {category.percentage.toFixed(1)}%
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <Pressable style={styles.actionButton} onPress={handleExportData}>
            <Ionicons name="download-outline" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Export Data</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={handleGenerateReport}>
            <Ionicons name="document-text-outline" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Generate Report</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

export default function ReportsScreen() {
  return <ReportsScreenContent />;
}

const createStyles = (theme: any) => StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.lg,
  },
  loadingText: {
    fontSize: FONT_SIZES.lg,
    color: theme.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.xxl,
    gap: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: theme.text,
  },
  emptyText: {
    fontSize: FONT_SIZES.base,
    color: theme.textSecondary,
    textAlign: "center",
  },
  headerGradient: {
    paddingBottom: 24,
    paddingHorizontal: 20,
    marginBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: FONT_SIZES.huge,
    fontWeight: FONT_WEIGHTS.bold,
    color: theme.onPrimary,
    letterSpacing: 0.3,
  },
  periodBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.onPrimarySubtle,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.xl,
    gap: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: theme.onPrimaryBorder,
  },
  periodText: {
    fontSize: FONT_SIZES.sm,
    color: theme.onPrimaryMuted,
    fontWeight: FONT_WEIGHTS.medium,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 16,
  },
  overviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  overviewCard: {
    backgroundColor: theme.cardBackground,
    padding: 16,
    borderRadius: 12,
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: theme.shadowOpacity,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewLabel: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.text,
  },
  monthlyCard: {
    backgroundColor: theme.cardBackground,
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.cardBorder,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: theme.shadowOpacity,
    shadowRadius: 4,
    elevation: 2,
  },
  monthlyAmount: {
    fontSize: 36,
    fontWeight: "700",
    color: theme.success,
    marginBottom: 8,
  },
  monthlyLabel: {
    fontSize: 15,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  monthlyTransactions: {
    fontSize: 13,
    color: theme.textTertiary,
  },
  categoryItem: {
    backgroundColor: theme.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: theme.shadowOpacity,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryRank: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.textTertiary,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.text,
  },
  categorySpent: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.success,
  },
  categoryProgress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  categoryPercentage: {
    fontSize: 13,
    fontWeight: "600",
    minWidth: 50,
    textAlign: "right",
  },
  emptyCategories: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyCategoriesText: {
    fontSize: 15,
    color: theme.textSecondary,
  },
  actionButton: {
    flexDirection: "row",
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "600",
  },
});