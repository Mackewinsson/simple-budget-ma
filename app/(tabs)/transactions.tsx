import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useExpenses } from "../../src/api/hooks/useExpenses";
import { useBudget } from "../../src/api/hooks/useBudgets";
import { useCategories } from "../../src/api/hooks/useCategories";
import { useAuthStore } from "../../src/store/authStore";
import { useDeleteExpense } from "../../src/api/hooks/useExpenses";
import { useSafeAreaStyles } from "../../src/hooks/useSafeAreaStyles";
import NewExpenseForm from "../../components/NewExpenseForm";
import DailySpendingTracker from "../../components/DailySpendingTracker";

function TransactionsScreenContent() {
  const { session } = useAuthStore();
  const { data: budget, isLoading: budgetLoading } = useBudget(session?.user?.id || "");
  const { data: categories = [], isLoading: categoriesLoading } = useCategories(session?.user?.id || "");
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses(session?.user?.id || "");
  const deleteExpense = useDeleteExpense();
  const safeAreaStyles = useSafeAreaStyles();
  
  const isLoading = budgetLoading || categoriesLoading || expensesLoading;
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const handleDeleteExpense = (expenseId: string, description: string) => {
    Alert.alert(
      "Delete Transaction",
      `Are you sure you want to delete "${description}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => deleteExpense.mutate(expenseId)
        },
      ]
    );
  };

  const renderExpense = ({ item }: { item: any }) => (
    <Pressable style={styles.expenseCard}>
      <View style={styles.expenseLeft}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: item.type === "expense" ? "#ef444410" : "#4ade8010" }
        ]}>
          <Ionicons
            name={item.type === "expense" ? "arrow-down" : "arrow-up"}
            size={20}
            color={item.type === "expense" ? "#ef4444" : "#4ade80"}
          />
        </View>
        <View style={styles.expenseDetails}>
          <Text style={styles.expenseDescription}>{item.description}</Text>
          <Text style={styles.expenseDate}>
            {new Date(item.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>
      </View>
      <View style={styles.expenseRight}>
        <Text style={[
          styles.expenseAmount,
          { color: item.type === "expense" ? "#ef4444" : "#4ade80" }
        ]}>
          {item.type === "expense" ? "-" : "+"}${item.amount.toFixed(2)}
        </Text>
        <Pressable
          style={styles.deleteButton}
          onPress={() => handleDeleteExpense(item._id, item.description)}
        >
          <Ionicons name="trash-outline" size={16} color="#9ca3af" />
        </Pressable>
      </View>
    </Pressable>
  );

  if (isLoading) {
    return (
      <View style={safeAreaStyles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={safeAreaStyles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Transactions</Text>
          <Text style={styles.subtitle}>{expenses.length} total transactions</Text>
        </View>
        <Pressable
          style={styles.addButtonHeader}
          onPress={() => setShowExpenseForm(!showExpenseForm)}
        >
          <Ionicons
            name={showExpenseForm ? "close" : "add"}
            size={24}
            color="#fff"
          />
        </Pressable>
      </View>

      {budget && (
        <DailySpendingTracker
          budget={budget}
          categories={categories}
          expenses={expenses}
        />
      )}

      {showExpenseForm && (
        <View style={styles.formContainer}>
          <NewExpenseForm />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {expenses.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color="#4b5563" />
            <Text style={styles.emptyStateText}>No transactions yet</Text>
            <Text style={styles.emptyStateSubtext}>Add your first transaction to get started</Text>
          </View>
        ) : (
          <FlatList
            data={expenses || []}
            keyExtractor={(item) => item._id}
            renderItem={renderExpense}
            style={styles.list}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScrollView>
  );
}

export default function TransactionsScreen() {
  return <TransactionsScreenContent />;
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#64748b",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  addButtonHeader: {
    backgroundColor: "#6366f1",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  expenseCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  expenseLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "500",
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 13,
    color: "#64748b",
  },
  expenseRight: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  deleteButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 8,
  },
});