import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useBudget } from "../../src/api/hooks/useBudgets";
import { useCategories } from "../../src/api/hooks/useCategories";
import { useExpenses } from "../../src/api/hooks/useExpenses";
import { useAuthStore } from "../../src/store/authStore";

function ReportsScreenContent() {
  const { session } = useAuthStore();
  const { data: budget, isLoading: budgetLoading } = useBudget(session?.user?.id || "");
  const { data: categories = [], isLoading: categoriesLoading } = useCategories(session?.user?.id || "");
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses(session?.user?.id || "");
  
  const isLoading = budgetLoading || categoriesLoading || expensesLoading;

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
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      </View>
    );
  }

  if (!budget) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.title}>Reports</Text>
          <Text style={styles.emptyText}>Create a budget first to view reports</Text>
        </View>
      </View>
    );
  }

  // Calculate analytics
  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = expenses.reduce((sum, expense) => {
    return sum + (expense.type === "expense" ? expense.amount : -expense.amount);
  }, 0);
  const remaining = totalBudgeted - totalSpent;
  const spendingPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reports & Analytics</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget Overview</Text>
        <View style={styles.overviewGrid}>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Total Budgeted</Text>
            <Text style={styles.overviewValue}>${totalBudgeted.toFixed(2)}</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Total Spent</Text>
            <Text style={[styles.overviewValue, { color: "#ef4444" }]}>
              ${totalSpent.toFixed(2)}
            </Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Remaining</Text>
            <Text style={[
              styles.overviewValue, 
              { color: remaining >= 0 ? "#4ade80" : "#ef4444" }
            ]}>
              ${remaining.toFixed(2)}
            </Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Spending %</Text>
            <Text style={styles.overviewValue}>{spendingPercentage.toFixed(1)}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly Spending</Text>
        <View style={styles.monthlyCard}>
          <Text style={styles.monthlyAmount}>${monthlySpending.toFixed(2)}</Text>
          <Text style={styles.monthlyLabel}>
            Spent in {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Spending Categories</Text>
        {categorySpending.slice(0, 5).map((category, index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categorySpent}>${category.spent.toFixed(2)}</Text>
            </View>
            <View style={styles.categoryProgress}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${Math.min(category.percentage, 100)}%`,
                      backgroundColor: category.percentage > 100 ? "#ef4444" : "#4ade80"
                    }
                  ]} 
                />
              </View>
              <Text style={styles.categoryPercentage}>
                {category.percentage.toFixed(1)}%
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.actionsContainer}>
          <Pressable style={styles.actionButton} onPress={handleExportData}>
            <Text style={styles.actionButtonText}>Export Data</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={handleGenerateReport}>
            <Text style={styles.actionButtonText}>Generate Report</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

export default function ReportsScreen() {
  return <ReportsScreenContent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  overviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  overviewCard: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 8,
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
  },
  overviewLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  monthlyCard: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  monthlyAmount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#4ade80",
    marginBottom: 4,
  },
  monthlyLabel: {
    fontSize: 14,
    color: "#888",
  },
  categoryItem: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  categorySpent: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4ade80",
  },
  categoryProgress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  categoryPercentage: {
    fontSize: 12,
    color: "#888",
    minWidth: 40,
    textAlign: "right",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    backgroundColor: "#4ade80",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
});