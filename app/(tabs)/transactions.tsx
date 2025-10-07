import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView, Pressable, Alert, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useExpenses } from "../../src/api/hooks/useExpenses";
import { useBudget } from "../../src/api/hooks/useBudgets";
import { useCategoriesByBudget } from "../../src/api/hooks/useCategories";
import { useAuthStore } from "../../src/store/authStore";
import { useDeleteExpense } from "../../src/api/hooks/useExpenses";
import { useSafeAreaStyles } from "../../src/hooks/useSafeAreaStyles";
import { useTheme } from "../../src/theme/ThemeContext";
import { FONT_SIZES, FONT_WEIGHTS } from "../../src/theme/layout";
import NewExpenseForm from "../../components/NewExpenseForm";
import AITransactionInput from "../../components/AITransactionInput";

function TransactionsScreenContent() {
  const { session } = useAuthStore();
  const router = useRouter();
  const { data: budget, isLoading: budgetLoading } = useBudget(session?.user?.id || "");
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesByBudget(budget?._id || "");
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses(session?.user?.id || "");
  const deleteExpense = useDeleteExpense();
  const safeAreaStyles = useSafeAreaStyles();
  const { theme } = useTheme();

  const isLoading = budgetLoading || categoriesLoading || expensesLoading;
  const [activeTab, setActiveTab] = useState<'add' | 'ai' | 'history'>('add');
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Redirect to budget creation if no budget exists
  useEffect(() => {
    if (!isLoading && !budget && session?.user?.id) {
      router.replace("/create-budget");
    }
  }, [budget, isLoading, session?.user?.id, router]);

  const styles = createStyles(theme);

  // Calculate available to spend
  // Filter expenses to only include those from the current budget
  const currentBudgetExpenses = expenses.filter(expense => expense.budget === budget?._id);
  
  // Debug logging
  console.log('Transactions Debug:', {
    budget: budget?._id,
    categoriesCount: categories.length,
    categoriesLoading,
    budgetLoading,
    hasCategories: categories.length > 0,
    currentBudgetExpenses: currentBudgetExpenses.length
  });
  const totalSpent = currentBudgetExpenses.reduce((sum, expense) => {
    return sum + (expense.type === "expense" ? expense.amount : -expense.amount);
  }, 0);
  
  // Use budget's totalAvailable instead of calculating from categories
  const remaining = budget?.totalAvailable || 0;

  // Filter expenses based on search term and date range
  const filteredExpenses = currentBudgetExpenses.filter((expense) => {
    const category = categories.find(
      (cat) => cat._id === expense.categoryId || cat.id === expense.categoryId
    );
    const searchLower = searchTerm.toLowerCase();

    // Text search
    const matchesSearch =
      expense.description.toLowerCase().includes(searchLower) ||
      category?.name.toLowerCase().includes(searchLower);

    // Date range filter
    let matchesDateRange = true;
    if (startDate && endDate) {
      const expenseDate = new Date(expense.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      matchesDateRange = expenseDate >= start && expenseDate <= end;
    }

    return matchesSearch && matchesDateRange;
  });

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

  const renderExpense = ({ item }: { item: any }) => {
    const category = categories.find(
      (cat) => cat._id === item.categoryId || cat.id === item.categoryId
    );
    
    return (
      <Pressable style={styles.expenseCard}>
        <View style={styles.expenseLeft}>
          <View style={styles.expenseDetails}>
            <Text style={styles.expenseDescription}>
              {item.description || `${item.type === "expense" ? "Expense" : "Income"} for ${category?.name || "Unknown"}`}
            </Text>
            <Text style={styles.expenseDate}>
              {category?.name || "Unknown"} • {new Date(item.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
          </View>
        </View>
        <View style={styles.expenseRight}>
          <View style={styles.amountContainer}>
            <Ionicons
              name={item.type === "expense" ? "arrow-up-circle" : "arrow-down-circle"}
              size={16}
              color={item.type === "expense" ? theme.error : theme.success}
            />
            <Text style={[
              styles.expenseAmount,
              { color: item.type === "expense" ? theme.error : theme.success }
            ]}>
              ${item.amount.toFixed(2)}
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <Pressable
              style={styles.actionButton}
              onPress={() => handleDeleteExpense(item._id, item.description)}
            >
              <Ionicons name="trash-outline" size={16} color={theme.textMuted} />
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Transaction History</Text>
          <Text style={styles.subtitle}>Track your daily income and expenses</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={[
            styles.availableAmount,
            { color: remaining < 0 ? theme.error : theme.text }
          ]}>
            ${remaining.toFixed(2)}
          </Text>
          <Text style={styles.availableLabel}>Available to Spend</Text>
        </View>
      </View>

      {/* Expand/Collapse Button */}
      <View style={styles.expandButtonContainer}>
        <Pressable
          style={styles.expandButton}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={theme.text}
          />
        </Pressable>
      </View>

      {/* Tabs - Only show if categories exist and not loading */}
      {budget && !categoriesLoading && categories.length > 0 && (
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, activeTab === 'add' && styles.activeTab]}
            onPress={() => setActiveTab('add')}
          >
            <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>
              Add Transaction
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'ai' && styles.activeTab]}
            onPress={() => setActiveTab('ai')}
          >
            <Text style={[styles.tabText, activeTab === 'ai' && styles.activeTabText]}>
              AI Quick Input
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'history' && styles.activeTab]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
              Transaction History
            </Text>
          </Pressable>
        </View>
      )}

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {/* No Categories State */}
        {budget && !categoriesLoading && categories.length === 0 && (
          <View style={styles.noCategoriesContainer}>
            <View style={styles.noCategoriesIcon}>
              <Ionicons name="folder-outline" size={48} color={theme.textMuted} />
            </View>
            <Text style={styles.noCategoriesTitle}>No Categories Yet</Text>
            <Text style={styles.noCategoriesMessage}>
              You need to create budget categories before you can add transactions. 
              Each transaction must be assigned to a category.
            </Text>
            <Pressable
              style={styles.createCategoriesButton}
              onPress={() => router.push("/(tabs)/budgets")}
            >
              <Ionicons name="add-circle" size={20} color={theme.surface} style={styles.buttonIcon} />
              <Text style={styles.createCategoriesButtonText}>
                Create Categories
              </Text>
            </Pressable>
          </View>
        )}

        {/* Normal Content - Only show if categories exist and not loading */}
        {budget && !categoriesLoading && categories.length > 0 && (
          <>
            {activeTab === 'add' && (
              <NewExpenseForm />
            )}

            {activeTab === 'ai' && (
              <AITransactionInput budgetId={budget._id} />
            )}

            {activeTab === 'history' && (
          <View style={[
            styles.historyContainer,
            { height: isExpanded ? 500 : 300 }
          ]}>
            {/* Search and Filters */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={16} color={theme.textMuted} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  placeholderTextColor={theme.textMuted}
                />
              </View>
              
              <View style={styles.dateFilterContainer}>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.dateLabel}>Start Date</Text>
                  <TextInput
                    style={styles.dateInput}
                    placeholder="YYYY-MM-DD"
                    value={startDate}
                    onChangeText={setStartDate}
                    placeholderTextColor={theme.textMuted}
                  />
                </View>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.dateLabel}>End Date</Text>
                  <TextInput
                    style={styles.dateInput}
                    placeholder="YYYY-MM-DD"
                    value={endDate}
                    onChangeText={setEndDate}
                    placeholderTextColor={theme.textMuted}
                  />
                </View>
              </View>
            </View>

            {/* Transaction List */}
            <ScrollView style={styles.transactionList} showsVerticalScrollIndicator={false}>
              {filteredExpenses.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    {currentBudgetExpenses.length === 0 ? "No transactions yet" : "No transactions found matching your search."}
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={filteredExpenses}
                  keyExtractor={(item) => item._id}
                  renderItem={renderExpense}
                  scrollEnabled={false}
                />
              )}
            </ScrollView>
          </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

export default function TransactionsScreen() {
  return <TransactionsScreenContent />;
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: FONT_SIZES.lg,
    color: theme.textSecondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: theme.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: theme.textSecondary,
  },
  availableAmount: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 2,
  },
  availableLabel: {
    fontSize: FONT_SIZES.xs,
    color: theme.textSecondary,
  },
  expandButtonContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: theme.shadowOpacity,
    shadowRadius: 2,
    elevation: 1,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5", // Light gray background
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "#ffffff", // White background for selected tab
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    color: "#666666", // Gray text for unselected tabs
  },
  activeTabText: {
    color: "#000000", // Black text for selected tab
    fontWeight: FONT_WEIGHTS.semibold,
    fontSize: FONT_SIZES.xs, // Keep same font size
  },
  tabContent: {
    paddingHorizontal: 16,
  },
  historyContainer: {
    overflow: "hidden",
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: FONT_SIZES.lg,
    color: theme.text,
  },
  dateFilterContainer: {
    flexDirection: "row",
    gap: 12,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: FONT_SIZES.xs,
    color: theme.text,
    marginBottom: 4,
    fontWeight: FONT_WEIGHTS.medium,
  },
  dateInput: {
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: FONT_SIZES.md,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.border,
  },
  transactionList: {
    flex: 1,
  },
  expenseCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.cardBackground,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },
  expenseLeft: {
    flex: 1,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: FONT_SIZES.lg,
    color: theme.text,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: FONT_SIZES.sm,
    color: theme.textSecondary,
  },
  expenseRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  expenseAmount: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: FONT_SIZES.lg,
    color: theme.textSecondary,
    textAlign: "center",
  },
  // No categories state styles
  noCategoriesContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  noCategoriesIcon: {
    marginBottom: 24,
  },
  noCategoriesTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: theme.text,
    marginBottom: 12,
    textAlign: "center",
  },
  noCategoriesMessage: {
    fontSize: FONT_SIZES.lg,
    color: theme.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  createCategoriesButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  createCategoriesButtonText: {
    color: theme.surface,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  buttonIcon: {
    marginRight: 4,
  },
});