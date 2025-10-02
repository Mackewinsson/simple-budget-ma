import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useBudget } from "../../src/api/hooks/useBudgets";
import { useCategories } from "../../src/api/hooks/useCategories";
import { useExpenses } from "../../src/api/hooks/useExpenses";
import { useAuthStore } from "../../src/store/authStore";
import { useSafeAreaStyles } from "../../src/hooks/useSafeAreaStyles";
import NewBudgetForm from "../../components/NewBudgetForm";
import CategoryList from "../../components/CategoryList";
import Summary from "../../components/Summary";
import BudgetSetupSection from "../../components/BudgetSetupSection";

function BudgetsScreenContent() {
  const { session } = useAuthStore();
  const { data: budget, isLoading: budgetLoading, error: budgetError } = useBudget(session?.user?.id || "");
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories(session?.user?.id || "");
  const { data: expenses = [], isLoading: expensesLoading, error: expensesError } = useExpenses(session?.user?.id || "");
  const safeAreaStyles = useSafeAreaStyles();
  
  const isLoading = budgetLoading || categoriesLoading || expensesLoading;
  const hasError = budgetError || categoriesError || expensesError;


  if (isLoading) {
    return (
      <View style={safeAreaStyles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your budget...</Text>
        </View>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={safeAreaStyles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Error loading data. Please try again.</Text>
          <Text style={styles.errorText}>Error: {JSON.stringify(hasError)}</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={safeAreaStyles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Budget Overview</Text>
      </View>
      
      <Summary />
      
      {!budget ? (
        <View style={styles.noBudgetContainer}>
          <Text style={styles.noBudgetText}>No budget found. Create one to get started!</Text>
          <NewBudgetForm />
        </View>
      ) : (
        <>
          <BudgetSetupSection 
            budget={budget}
            categories={categories}
          />
          
          <CategoryList />
        </>
      )}
    </ScrollView>
  );
}

export default function BudgetsScreen() {
  return <BudgetsScreenContent />;
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
    color: "#888",
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 8,
    textAlign: "center",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  noBudgetContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  noBudgetText: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
    textAlign: "center",
  },
  budgetCard: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  budgetAmount: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  budgetLabel: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
});