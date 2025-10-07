import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useUpdateBudget } from "../src/api/hooks/useBudgets";
import { useDemoUser } from "../src/api/hooks/useDemoUser";

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

export default function BudgetSetupSection({ budget, categories }: BudgetSetupSectionProps) {
  const { data: demoUser } = useDemoUser();
  const updateBudget = useUpdateBudget();
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [newTotal, setNewTotal] = useState(budget.totalBudgeted.toString());

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
          <Text style={[styles.summaryValue, { color: "#ef4444" }]}>
            ${totalSpent.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Remaining</Text>
          <Text style={[
            styles.summaryValue, 
            { color: remaining >= 0 ? "#4ade80" : "#ef4444" }
          ]}>
            ${remaining.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 16,
  },
  budgetCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  budgetLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  editButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  editContainer: {
    flexDirection: "row",
    gap: 8,
  },
  cancelButton: {
    backgroundColor: "#94a3b8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  budgetAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
});
