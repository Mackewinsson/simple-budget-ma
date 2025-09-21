import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useExpenses } from "../../src/api/hooks/useExpenses";
import { useBudget } from "../../src/api/hooks/useBudgets";
import { useCategories } from "../../src/api/hooks/useCategories";
import { useAuthStore } from "../../src/store/authStore";
import { useDeleteExpense } from "../../src/api/hooks/useExpenses";
import NewExpenseForm from "../../components/NewExpenseForm";
import DailySpendingTracker from "../../components/DailySpendingTracker";

function TransactionsScreenContent() {
  const { session } = useAuthStore();
  const { data: budget, isLoading: budgetLoading } = useBudget(session?.user?.id || "");
  const { data: categories = [], isLoading: categoriesLoading } = useCategories(session?.user?.id || "");
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses(session?.user?.id || "");
  const deleteExpense = useDeleteExpense();
  
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
    <View style={styles.expenseCard}>
      <View style={styles.expenseHeader}>
        <Text style={styles.expenseDescription}>{item.description}</Text>
        <Pressable 
          style={styles.deleteButton}
          onPress={() => handleDeleteExpense(item._id, item.description)}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </Pressable>
      </View>
      <Text style={[
        styles.expenseAmount,
        { color: item.type === "expense" ? "#ef4444" : "#4ade80" }
      ]}>
        {item.type === "expense" ? "-" : "+"}${item.amount.toFixed(2)}
      </Text>
      <Text style={styles.expenseDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      
      {budget && (
        <DailySpendingTracker 
          budget={budget}
          categories={categories}
          expenses={expenses}
        />
      )}
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Add Transaction</Text>
          <Pressable 
            style={styles.addButton}
            onPress={() => setShowExpenseForm(!showExpenseForm)}
          >
            <Text style={styles.addButtonText}>
              {showExpenseForm ? "Cancel" : "+ Add"}
            </Text>
          </Pressable>
        </View>
        
        {showExpenseForm && <NewExpenseForm />}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <FlatList
          data={expenses || []}
          keyExtractor={(item) => item._id}
          renderItem={renderExpense}
          style={styles.list}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}

export default function TransactionsScreen() {
  return <TransactionsScreenContent />;
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
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
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#4ade80",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  list: {
    flex: 1,
  },
  expenseCard: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  expenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  expenseDescription: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 12,
    color: "#888",
  },
});