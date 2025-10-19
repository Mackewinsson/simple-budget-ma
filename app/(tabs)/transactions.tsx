import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView, Pressable, Alert, TextInput, RefreshControl } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useExpenses } from "../../src/api/hooks/useExpenses";
import { useBudget } from "../../src/api/hooks/useBudgets";
import { useCategoriesByBudget } from "../../src/api/hooks/useCategories";
import { useAuthStore } from "../../src/store/authStore";
import { useDeleteExpense } from "../../src/api/hooks/useExpenses";
import { useTheme } from "../../src/theme/ThemeContext";
import { FONT_SIZES, FONT_WEIGHTS } from "../../src/theme/layout";
import { useFeatureFlags } from "../../src/hooks/useFeatureFlags";
import { FEATURE_FLAG_KEYS } from "../../src/types/featureFlags";
import NewExpenseForm from "../../components/NewExpenseForm";
import AITransactionInput from "../../components/AITransactionInput";
import BeautifulLoadingOverlay from "../../components/BeautifulLoadingOverlay";
import ProBadge from "../../components/ProBadge";

function TransactionsScreenContent() {
  const { session } = useAuthStore();
  const router = useRouter();
  const { data: budget, isLoading: budgetLoading, refetch: refetchBudget } = useBudget(session?.user?.id || "");
  const { data: categories = [], isLoading: categoriesLoading, refetch: refetchCategories } = useCategoriesByBudget(budget?._id || "");
  const { data: expenses = [], isLoading: expensesLoading, refetch: refetchExpenses } = useExpenses(session?.user?.id || "");
  const deleteExpense = useDeleteExpense();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { isFeatureEnabled } = useFeatureFlags();

  // Check if AI features are enabled via 'aa' feature flag
  const isAIEnabled = isFeatureEnabled(FEATURE_FLAG_KEYS.AA, false);

  const isLoading = budgetLoading || categoriesLoading || expensesLoading;
  const [activeTab, setActiveTab] = useState<'add' | 'ai' | 'history'>('add');
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Redirect to budget creation if no budget exists
  useEffect(() => {
    console.log('[Transactions] Budget check:', {
      isLoading,
      hasBudget: !!budget,
      budgetId: budget?._id,
      hasSession: !!session?.user?.id,
      userId: session?.user?.id
    });
    
    if (!isLoading && !budget && session?.user?.id) {
      console.log('[Transactions] No budget found, redirecting to create-budget');
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

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refetch all data - this will trigger the global loading indicator
      await Promise.all([
        refetchBudget(),
        refetchCategories(),
        refetchExpenses(),
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
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
      <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Loading Overlay for Pull-to-Refresh */}
      <BeautifulLoadingOverlay
        visible={isRefreshing}
        title="Refreshing..."
        subtitle="Getting latest data"
        iconName="refresh"
      />
      {/* Header */}
      <LinearGradient
        colors={[theme.primary, theme.primaryDark || theme.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.title}>Transactions</Text>
              <ProBadge tone="light" />
            </View>
            <Text style={styles.subtitle}>Manage your finances</Text>
          </View>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available to Spend</Text>
            <View style={styles.balanceRow}>
              <Ionicons name="wallet-outline" size={24} color={theme.surface} />
              <Text style={styles.balanceAmount}>
                ${remaining.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

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
          {isAIEnabled && (
            <Pressable
              style={[styles.tab, activeTab === 'ai' && styles.activeTab]}
              onPress={() => setActiveTab('ai')}
            >
              <Text style={[styles.tabText, activeTab === 'ai' && styles.activeTabText]}>
                AI Quick Input
              </Text>
            </Pressable>
          )}
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

            {isAIEnabled && activeTab === 'ai' && (
              <AITransactionInput budgetId={budget._id} />
            )}

            {activeTab === 'history' && (
          <View style={styles.historyContainer}>
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
            <ScrollView 
              style={styles.transactionList} 
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                  tintColor="transparent"
                  colors={['transparent']}
                  progressBackgroundColor="transparent"
                  title=""
                  titleColor="transparent"
                  progressViewOffset={0}
                />
              }
              contentContainerStyle={{ flexGrow: 1 }}
            >
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
    </View>
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
  headerGradient: {
    paddingBottom: 24,
    paddingHorizontal: 20,
    marginBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    gap: 16,
  },
  headerContent: {
    gap: 4,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: FONT_WEIGHTS.bold,
    color: theme.onPrimary,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: theme.onPrimaryMuted,
    fontWeight: FONT_WEIGHTS.medium,
  },
  balanceCard: {
    backgroundColor: theme.onPrimarySubtle,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.onPrimaryBorder,
  },
  balanceLabel: {
    fontSize: FONT_SIZES.sm,
    color: theme.onPrimaryMuted,
    fontWeight: FONT_WEIGHTS.medium,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: FONT_WEIGHTS.bold,
    color: theme.onPrimary,
    letterSpacing: -0.5,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: theme.backgroundSecondary,
    borderRadius: 10,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: theme.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14, // Increased padding
    paddingHorizontal: 12, // Reduced horizontal padding to fit better
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44, // Ensure minimum touch target
  },
  activeTab: {
    backgroundColor: theme.surface,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: theme.shadowOpacity,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: theme.textSecondary,
    textAlign: "center",
    lineHeight: 16,
  },
  activeTabText: {
    color: theme.text,
    fontWeight: FONT_WEIGHTS.semibold,
    fontSize: FONT_SIZES.sm,
    textAlign: "center",
    lineHeight: 16,
  },
  tabContent: {
    paddingHorizontal: 16,
    flex: 1, // Ensure tab content takes available space
    backgroundColor: theme.background,
  },
  historyContainer: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: theme.background,
  },
  searchContainer: {
    marginBottom: 20, // Increased margin for better spacing
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16, // Increased margin
    minHeight: 48, // Ensure consistent height
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: FONT_SIZES.lg,
    color: theme.text,
    minHeight: 24, // Ensure text doesn't get cut off
  },
  dateFilterContainer: {
    flexDirection: "row",
    gap: 16, // Increased gap between date inputs
    marginTop: 8, // Add top margin for better separation
  },
  dateInputContainer: {
    flex: 1,
    minWidth: 120, // Ensure minimum width to prevent overlap
  },
  dateLabel: {
    fontSize: FONT_SIZES.sm, // Increased from xs to sm for better readability
    color: theme.text,
    marginBottom: 6, // Increased margin
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
    minHeight: 48, // Ensure consistent height with search input
  },
  transactionList: {
    flex: 1,
    minHeight: 200,
    backgroundColor: theme.background,
  },
  expenseCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.cardBackground,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12, // Increased margin for better separation
    borderWidth: 1,
    borderColor: theme.cardBorder,
    minHeight: 72, // Ensure consistent card height
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
    gap: 12, // Increased gap for better spacing
    minWidth: 100, // Ensure minimum width for amount and action buttons
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
