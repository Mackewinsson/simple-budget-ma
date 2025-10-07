import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCategoriesByBudget } from "../src/api/hooks/useCategories";
import { useAuthStore } from "../src/store/authStore";
import { useBudget } from "../src/api/hooks/useBudgets";
import { useTheme } from "../src/theme/ThemeContext";
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOW } from "../src/theme/layout";
import NewCategoryForm from "./NewCategoryForm";

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
  categoryCard: {
    backgroundColor: theme.cardBackground,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    shadowColor: theme.shadow,
    ...SHADOW.md,
    shadowOpacity: theme.shadowOpacity,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  categoryName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.medium,
    color: theme.text,
  },
  categoryAmount: {
    fontSize: FONT_SIZES.md,
    color: theme.textSecondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.surfaceSecondary,
    borderRadius: BORDER_RADIUS.sm - 1,
    marginBottom: SPACING.sm,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.success,
    borderRadius: BORDER_RADIUS.sm - 1,
  },
  remainingText: {
    fontSize: FONT_SIZES.xs,
    color: theme.textSecondary,
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
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const { theme } = useTheme();

  const handleAddCategory = () => {
    setShowCategoryForm(true);
  };

  const styles = createStyles(theme);

  const renderCategory = ({ item }: { item: Category }) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryAmount}>
          ${item.budgeted} / ${item.spent}
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${Math.min((item.spent / item.budgeted) * 100, 100)}%` }
          ]} 
        />
      </View>
      <Text style={styles.remainingText}>
        ${item.budgeted - item.spent} remaining
      </Text>
    </View>
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
