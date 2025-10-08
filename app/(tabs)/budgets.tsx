import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBudget } from "../../src/api/hooks/useBudgets";
import { useCategoriesByBudget } from "../../src/api/hooks/useCategories";
import { useExpenses } from "../../src/api/hooks/useExpenses";
import { useAuthStore } from "../../src/store/authStore";
import { useTheme } from "../../src/theme/ThemeContext";
import CategoryList from "../../components/CategoryList";
import BudgetSetupSection from "../../components/BudgetSetupSection";

function BudgetsScreenContent() {
  const { session } = useAuthStore();
  const router = useRouter();
  const { data: budget, isLoading: budgetLoading, error: budgetError } = useBudget(session?.user?.id || "");
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategoriesByBudget(budget?._id || "");
  const { data: expenses = [], isLoading: expensesLoading, error: expensesError } = useExpenses(session?.user?.id || "");
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  // Redirect to budget creation if no budget exists
  useEffect(() => {
    if (!budgetLoading && !budget && session?.user?.id) {
      router.replace("/create-budget");
    }
  }, [budget, budgetLoading, session?.user?.id, router]);
  
  const isLoading = budgetLoading || categoriesLoading || expensesLoading;
  const hasError = budgetError || categoriesError || expensesError;


  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
        <View style={styles.loadingContainer}>
          <Ionicons name="wallet-outline" size={48} color="#475569" />
          <Text style={styles.loadingText}>Loading your budget...</Text>
        </View>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorTitle}>Error loading data</Text>
          <Text style={styles.errorText}>Please try again later</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.primary, theme.primaryDark || theme.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Budgets</Text>
          {budget && (
            <View style={styles.budgetBadge}>
              <Ionicons name="calendar-outline" size={16} color="rgba(255, 255, 255, 0.9)" />
              <Text style={styles.budgetPeriod}>
                {budget.month && budget.year ? `${budget.month}/${budget.year}` : 'Monthly'}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContent}>
        {budget && (
          <>
            <BudgetSetupSection
              budget={budget}
              categories={categories}
            />

            <CategoryList />
          </>
        )}
      </ScrollView>
    </View>
  );
}

export default function BudgetsScreen() {
  return <BudgetsScreenContent />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#64748b",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ef4444",
    marginTop: 12,
  },
  errorText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 8,
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
    fontSize: 28,
    fontWeight: "bold",
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  budgetBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  budgetPeriod: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: "500",
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  budgetCard: {
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
  budgetAmount: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0f172a",
  },
  budgetLabel: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
});