import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUpdateCategory, useDeleteCategory } from "../src/api/hooks/useCategories";
import { useTheme } from "../src/theme/ThemeContext";
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOW } from "../src/theme/layout";

interface Category {
  _id?: string;
  id?: string;
  name: string;
  budgeted: number;
  spent: number;
  budgetId: string;
}

interface Expense {
  _id: string;
  user: string;
  budget: string;
  categoryId: string;
  amount: number;
  description: string;
  date: string;
  type: "expense" | "income";
}

interface CategoryItemProps {
  category: Category;
  totalAvailable: number;
  expenses: Expense[];
}

const createStyles = (theme: any) => StyleSheet.create({
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
    flex: 1,
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
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  editButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  editButtonText: {
    color: theme.onPrimary,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  deleteButton: {
    backgroundColor: theme.error,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  deleteButtonText: {
    color: theme.onPrimary,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surfaceSecondary,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  nameInput: {
    flex: 1,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.medium,
    color: theme.text,
    paddingVertical: SPACING.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: theme.textSecondary,
    paddingVertical: SPACING.xs,
    textAlign: "right",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  saveButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  saveButtonText: {
    color: theme.onPrimary,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  cancelButton: {
    backgroundColor: theme.textSecondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  cancelButtonText: {
    color: theme.onPrimary,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
});

export default function CategoryItem({ category, totalAvailable, expenses }: CategoryItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const [editBudgeted, setEditBudgeted] = useState(category.budgeted.toString());
  const { theme } = useTheme();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  // Calculate spent amount dynamically from expenses (matching simple-budget logic)
  const spent = expenses
    .filter((exp) => exp.categoryId === (category._id || category.id))
    .reduce((sum, exp) => {
      if (exp.type === "expense") return sum + exp.amount;
      if (exp.type === "income") return sum - exp.amount;
      return sum;
    }, 0);

  const handleStartEdit = () => {
    setEditName(category.name);
    setEditBudgeted(category.budgeted.toString());
    setIsEditing(true);
  };

  const handleSave = async () => {
    const trimmedName = editName.trim();
    const budgetAmount = parseFloat(editBudgeted);
    
    if (trimmedName === "") {
      Alert.alert("Error", "Please enter a category name");
      return;
    }

    if (isNaN(budgetAmount) || budgetAmount < 0) {
      Alert.alert("Error", "Budgeted amount cannot be negative");
      return;
    }

    const budgetDiff = budgetAmount - category.budgeted;
    if (budgetDiff > totalAvailable) {
      Alert.alert(
        "Error", 
        `Cannot increase budget by more than available amount ($${totalAvailable.toFixed(2)})`
      );
      return;
    }

    try {
      await updateCategory.mutateAsync({
        id: category._id || category.id || "",
        updates: { name: trimmedName, budgeted: budgetAmount },
      });
      setIsEditing(false);
      Alert.alert("Success", "Category updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update category");
    }
  };

  const handleCancel = () => {
    setEditName(category.name);
    setEditBudgeted(category.budgeted.toString());
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCategory.mutateAsync(category._id || category.id || "");
              Alert.alert("Success", "Category deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete category");
            }
          },
        },
      ]
    );
  };

  const styles = createStyles(theme);

  if (isEditing) {
    return (
      <View style={styles.categoryCard}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.nameInput}
            value={editName}
            onChangeText={setEditName}
            placeholder="Category name"
            autoFocus={true}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="cash-outline" size={16} color={theme.textSecondary} />
          <TextInput
            style={styles.amountInput}
            value={editBudgeted}
            onChangeText={setEditBudgeted}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <View style={styles.editContainer}>
          <Pressable style={styles.editButton} onPress={handleStartEdit}>
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryAmount}>
          ${spent.toFixed(2)} / ${category.budgeted.toFixed(2)}
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${Math.min((spent / category.budgeted) * 100, 100)}%` }
          ]} 
        />
      </View>
      <Text style={styles.remainingText}>
        ${(category.budgeted - spent).toFixed(2)} remaining
      </Text>
    </View>
  );
}
