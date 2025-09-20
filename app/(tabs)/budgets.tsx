import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useBudget } from "../../src/api/hooks/useBudgets";
import { useCategories } from "../../src/api/hooks/useCategories";
import { useExpenses } from "../../src/api/hooks/useExpenses";
import { useAuth } from "../../src/auth/MobileAuthProvider";
import { useResetBudget } from "../../src/api/hooks/useBudgets";
import NewBudgetForm from "../../components/NewBudgetForm";
import CategoryList from "../../components/CategoryList";
import Summary from "../../components/Summary";
import BudgetSetupSection from "../../components/BudgetSetupSection";

function BudgetsScreenContent() {
  const { session } = useAuth();
  const { data: budget, isLoading: budgetLoading, error: budgetError } = useBudget(session?.user?.id || "");
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories(session?.user?.id || "");
  const { data: expenses = [], isLoading: expensesLoading, error: expensesError } = useExpenses(session?.user?.id || "");
  const resetBudget = useResetBudget();
  
  const isLoading = budgetLoading || categoriesLoading || expensesLoading;
  const hasError = budgetError || categoriesError || expensesError;

  const handleResetBudget = () => {
    if (!session?.user?.id) return;
    
    Alert.alert(
      "Reset Budget",
      "This will clear all expenses and reset spent amounts. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reset", 
          style: "destructive", 
          onPress: () => resetBudget.mutate(session.user.id)
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your budget...</Text>
        </View>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Error loading data. Please try again.</Text>
          <Text style={styles.errorText}>Error: {JSON.stringify(hasError)}</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Budget Overview</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{session?.user?.name}</Text>
          <Text style={styles.userEmail}>{session?.user?.email}</Text>
        </View>
        {budget && (
          <Pressable style={styles.resetButton} onPress={handleResetBudget}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </Pressable>
        )}
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
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 8,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  userEmail: {
    fontSize: 12,
    color: "#888",
  },
  resetButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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