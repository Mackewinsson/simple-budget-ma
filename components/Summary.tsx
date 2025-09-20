import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useBudget } from "../src/api/hooks/useBudgets";
import { useCategories } from "../src/api/hooks/useCategories";
import { useExpenses } from "../src/api/hooks/useExpenses";
import { useDemoUser } from "../src/api/hooks/useDemoUser";

export default function Summary() {
  const { data: demoUser } = useDemoUser();
  const { data: budget } = useBudget(demoUser?._id || "");
  const { data: categories = [] } = useCategories(demoUser?._id || "");
  const { data: expenses = [] } = useExpenses(demoUser?._id || "");

  // Calculate totals
  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = expenses.reduce((sum, expense) => {
    return sum + (expense.type === "expense" ? expense.amount : -expense.amount);
  }, 0);
  const remaining = totalBudgeted - totalSpent;

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
          <Text style={[styles.summaryValue, { color: "#ef4444" }]}>
            ${totalSpent.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Remaining</Text>
          <Text style={[
            styles.summaryValue, 
            { color: remaining >= 0 ? "#4ade80" : "#ef4444" }
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

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summaryCard: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 8,
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});
