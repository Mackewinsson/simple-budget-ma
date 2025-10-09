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
import ProBadge from "../../components/ProBadge";

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

  const styles = createStyles(theme);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
        <View style={styles.loadingContainer}>
          <Ionicons name="wallet-outline" size={48} color={theme.textSecondary} />
          <Text style={styles.loadingText}>Loading your budget...</Text>
        </View>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.error} />
          <Text style={styles.errorTitle}>Error loading data</Text>
          <Text style={styles.errorText}>Please try again later</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient
        colors={[theme.primary, theme.primaryDark || theme.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Budgets</Text>
            <ProBadge tone="light" />
          </View>
          {budget && (
            <View style={styles.budgetBadge}>
              <Ionicons name="calendar-outline" size={16} color={theme.onPrimaryMuted} />
              <Text style={styles.budgetPeriod}>
                {budget.month && budget.year ? `${budget.month}/${budget.year}` : 'Monthly'}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
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

const createStyles = (theme: any) => StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.error,
    marginTop: 12,
  },
  errorText: {
    fontSize: 14,
    color: theme.textSecondary,
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.onPrimary,
    letterSpacing: 0.3,
  },
  budgetBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.onPrimarySubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: theme.onPrimaryBorder,
  },
  budgetPeriod: {
    fontSize: 13,
    color: theme.onPrimaryMuted,
    fontWeight: "500",
  },
  scrollContent: {
    paddingHorizontal: 16,
    backgroundColor: theme.background,
  },
  budgetCard: {
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
  budgetAmount: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.text,
  },
  budgetLabel: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 4,
  },
});
