import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useUpdateBudget } from "../src/api/hooks/useBudgets";
import { useDemoUser } from "../src/api/hooks/useDemoUser";
import { useTheme } from "../src/theme/ThemeContext";
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOW } from "../src/theme/layout";

interface Budget {
  _id: string;
  month: number;
  year: number;
  totalBudgeted: number;
  totalAvailable: number;
  user: string;
}

interface Category {
  _id?: string;
  id?: string;
  name: string;
  budgeted: number;
  spent: number;
  budgetId: string;
}

interface BudgetSetupSectionProps {
  budget: Budget;
  categories: Category[];
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: theme.text,
    marginBottom: SPACING.lg,
  },
  budgetCard: {
    backgroundColor: theme.cardBackground,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    shadowColor: theme.shadow,
    ...SHADOW.lg,
    shadowOpacity: theme.shadowOpacity * 1.5,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  budgetLabel: {
    fontSize: FONT_SIZES.md,
    color: theme.textSecondary,
  },
  editButton: {
    backgroundColor: theme.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.md,
  },
  editButtonText: {
    color: theme.buttonText,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  editContainer: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  cancelButton: {
    backgroundColor: theme.textSecondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.md,
  },
  cancelButtonText: {
    color: theme.buttonText,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  saveButton: {
    backgroundColor: theme.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.md,
  },
  saveButtonText: {
    color: theme.buttonText,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  budgetAmount: {
    fontSize: FONT_SIZES.huge,
    fontWeight: FONT_WEIGHTS.bold,
    color: theme.text,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  summaryCard: {
    backgroundColor: theme.cardBackground,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.cardBorder,
    shadowColor: theme.shadow,
    ...SHADOW.md,
    shadowOpacity: theme.shadowOpacity,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.xs,
    color: theme.textSecondary,
    marginBottom: SPACING.xs,
  },
  summaryValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: theme.text,
  },
});

export default function BudgetSetupSection({ budget, categories }: BudgetSetupSectionProps) {
  const { data: demoUser } = useDemoUser();
  const updateBudget = useUpdateBudget();
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [newTotal, setNewTotal] = useState(budget.totalBudgeted.toString());
  const { theme } = useTheme();

  const handleUpdateTotal = async () => {
    if (!demoUser?._id) return;

    const newTotalAmount = parseFloat(newTotal);
    if (isNaN(newTotalAmount) || newTotalAmount < 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    try {
      await updateBudget.mutateAsync({
        id: budget._id,
        updates: {
          totalBudgeted: newTotalAmount,
          totalAvailable: newTotalAmount - (budget.totalBudgeted - budget.totalAvailable),
        },
      });
      setIsEditingTotal(false);
      Alert.alert("Success", "Budget updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update budget");
    }
  };

  const handleCancelEdit = () => {
    setNewTotal(budget.totalBudgeted.toString());
    setIsEditingTotal(false);
  };

  // Calculate totals
  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = totalBudgeted - totalSpent;

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budget Setup</Text>
      
      <View style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <Text style={styles.budgetLabel}>Total Budget</Text>
          {isEditingTotal ? (
            <View style={styles.editContainer}>
              <Pressable style={styles.cancelButton} onPress={handleCancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleUpdateTotal}>
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.editButton} onPress={() => setIsEditingTotal(true)}>
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
          )}
        </View>
        
        {isEditingTotal ? (
          <Text style={styles.budgetAmount}>${newTotal}</Text>
        ) : (
          <Text style={styles.budgetAmount}>${budget.totalBudgeted.toFixed(2)}</Text>
        )}
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Budgeted</Text>
          <Text style={styles.summaryValue}>${totalBudgeted.toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Spent</Text>
          <Text style={[styles.summaryValue, { color: theme.error }]}>
            ${totalSpent.toFixed(2)}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Remaining</Text>
          <Text style={[
            styles.summaryValue,
            { color: remaining >= 0 ? theme.success : theme.error }
          ]}>
            ${remaining.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}
