import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCategoriesByBudget } from "../src/api/hooks/useCategories";
import { useAuthStore } from "../src/store/authStore";
import { useBudget } from "../src/api/hooks/useBudgets";
import { useExpenses } from "../src/api/hooks/useExpenses";
import { useTheme } from "../src/theme/ThemeContext";
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOW } from "../src/theme/layout";
import NewCategoryForm from "./NewCategoryForm";
import CategoryItem from "./CategoryItem";

interface Category {
  _id?: string;
  id?: string;
  name: string;
  budgeted: number;
  spent: number;
  budgetId: string;
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: theme.text,
  },
  addButton: {
    backgroundColor: theme.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: theme.success,
    ...SHADOW.md,
    shadowOpacity: 0.2,
  },
  addButtonText: {
    color: theme.buttonText,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  list: {
    flex: 1,
  },
  emptyStateContainer: {
    backgroundColor: theme.cardBackground,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.cardBorder,
    shadowColor: theme.shadow,
    ...SHADOW.md,
    shadowOpacity: theme.shadowOpacity,
  },
  emptyStateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  emptyStateText: {
    fontSize: FONT_SIZES.md,
    color: theme.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  emptyStateButton: {
    backgroundColor: theme.success,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: theme.success,
    ...SHADOW.md,
    shadowOpacity: 0.2,
  },
  emptyStateButtonText: {
    color: theme.buttonText,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
});

export default function CategoryList() {
  const { session } = useAuthStore();
  const { data: budget } = useBudget(session?.user?.id || "");
  const { data: categories = [], isLoading } = useCategoriesByBudget(budget?._id || "");
  const { data: expenses = [] } = useExpenses(session?.user?.id || "");
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const { theme } = useTheme();

  const handleAddCategory = () => {
    setShowCategoryForm(true);
  };

  const styles = createStyles(theme);

  const renderCategory = ({ item }: { item: Category }) => (
    <CategoryItem 
      category={item} 
      totalAvailable={budget?.totalAvailable || 0}
      expenses={expenses}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Categories</Text>
        <Text>Loading categories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        {categories.length > 0 && (
          <Pressable style={styles.addButton} onPress={handleAddCategory}>
            <Text style={styles.addButtonText}>+ Add Category</Text>
          </Pressable>
        )}
      </View>
      
      {showCategoryForm ? (
        <NewCategoryForm 
          onComplete={() => setShowCategoryForm(false)}
          onCancel={() => setShowCategoryForm(false)}
        />
      ) : categories.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyStateIcon}>
            <Ionicons name="grid-outline" size={24} color={theme.textSecondary} />
          </View>
          <Text style={styles.emptyStateText}>
            No categories yet. Add your first category below.
          </Text>
          <Pressable style={styles.emptyStateButton} onPress={handleAddCategory}>
            <Text style={styles.emptyStateButtonText}>+ Add Category</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id || item.id || Math.random().toString()}
          renderItem={renderCategory}
          style={styles.list}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}
