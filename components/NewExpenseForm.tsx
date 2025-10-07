import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateExpense } from "../src/api/hooks/useExpenses";
import { useAuthStore } from "../src/store/authStore";
import { useBudget } from "../src/api/hooks/useBudgets";
import { useCategoriesByBudget } from "../src/api/hooks/useCategories";
import { useTheme } from "../src/theme/ThemeContext";

const expenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  type: z.enum(["expense", "income"]),
  categoryId: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export default function NewExpenseForm() {
  const { session } = useAuthStore();
  const { data: budget } = useBudget(session?.user?.id || "");
  const { data: categories = [] } = useCategoriesByBudget(budget?._id || "");
  const createExpense = useCreateExpense();
  const { theme } = useTheme();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  const styles = createStyles(theme);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: "expense",
      categoryId: "",
      date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    },
  });

  const selectedCategoryId = watch("categoryId");
  const selectedType = watch("type");
  const selectedDate = watch("date");

  const selectedCategory = categories.find(cat => cat._id === selectedCategoryId);

  const onSubmit = async (data: ExpenseFormData) => {
    if (!session?.user?.id) {
      Alert.alert("Error", "Please log in to add transactions");
      return;
    }

    if (!budget?._id) {
      Alert.alert("Error", "No budget found. Please create a budget first.");
      return;
    }

    try {
      await createExpense.mutateAsync({
        user: session.user.id,
        budget: budget._id,
        categoryId: data.categoryId,
        amount: data.amount,
        description: data.description,
        date: data.date,
        type: data.type,
      });

      reset();
      Alert.alert("Success", "Transaction added successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to add transaction");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {/* Amount Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Amount</Text>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={(text) => onChange(parseFloat(text) || 0)}
                value={value.toString()}
                placeholder="0.00"
                keyboardType="numeric"
              />
            )}
          />
          {errors.amount && (
            <Text style={styles.error}>{errors.amount.message}</Text>
          )}
        </View>

        {/* Type Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Type</Text>
          <Pressable
            style={styles.selectButton}
            onPress={() => setShowTypeModal(true)}
          >
            <View style={styles.selectContent}>
              <Ionicons
                name={selectedType === "expense" ? "arrow-up-circle" : "arrow-down-circle"}
                size={16}
                color={selectedType === "expense" ? theme.error : theme.success}
              />
              <Text style={[
                styles.selectText,
                { color: selectedType === "expense" ? theme.error : theme.success }
              ]}>
                {selectedType === "expense" ? "Expense" : "Income"}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={16} color={theme.textMuted} />
          </Pressable>
          {errors.type && (
            <Text style={styles.error}>{errors.type.message}</Text>
          )}
        </View>
      </View>

      {/* Description Field */}
      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="What was this transaction for?"
            />
          )}
        />
        {errors.description && (
          <Text style={styles.error}>{errors.description.message}</Text>
        )}
      </View>

      <View style={styles.grid}>
        {/* Category Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <Pressable
            style={styles.selectButton}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={[
              styles.selectText,
              { color: selectedCategory ? theme.text : theme.textMuted }
            ]}>
              {selectedCategory ? selectedCategory.name : "Select a category"}
            </Text>
            <Ionicons name="chevron-down" size={16} color={theme.textMuted} />
          </Pressable>
          {errors.categoryId && (
            <Text style={styles.error}>{errors.categoryId.message}</Text>
          )}
        </View>

        {/* Date Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Date</Text>
          <Pressable
            style={styles.selectButton}
            onPress={() => setShowDateModal(true)}
          >
            <Text style={styles.selectText}>
              {formatDate(selectedDate)}
            </Text>
            <Ionicons name="calendar-outline" size={16} color={theme.textMuted} />
          </Pressable>
          {errors.date && (
            <Text style={styles.error}>{errors.date.message}</Text>
          )}
        </View>
      </View>

      {/* Submit Button */}
      <Pressable
        style={[styles.button, createExpense.isPending && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={createExpense.isPending}
      >
        <Ionicons name="add" size={20} color={theme.surface} style={styles.buttonIcon} />
        <Text style={styles.buttonText}>
          {createExpense.isPending ? "Adding..." : "Add Transaction"}
        </Text>
      </Pressable>

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <Pressable onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </Pressable>
            </View>
            <ScrollView style={styles.modalList}>
              {categories.map((category) => (
                <Pressable
                  key={category._id}
                  style={[
                    styles.modalItem,
                    selectedCategoryId === category._id && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setValue("categoryId", category._id);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    selectedCategoryId === category._id && styles.modalItemTextSelected
                  ]}>
                    {category.name}
                  </Text>
                  {selectedCategoryId === category._id && (
                    <Ionicons name="checkmark" size={20} color={theme.primary} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Type Selection Modal */}
      <Modal
        visible={showTypeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Type</Text>
              <Pressable onPress={() => setShowTypeModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </Pressable>
            </View>
            <View style={styles.modalList}>
              <Pressable
                style={[
                  styles.modalItem,
                  selectedType === "expense" && styles.modalItemSelected
                ]}
                onPress={() => {
                  setValue("type", "expense");
                  setShowTypeModal(false);
                }}
              >
                <View style={styles.modalItemContent}>
                  <Ionicons name="arrow-up-circle" size={20} color={theme.error} />
                  <Text style={[
                    styles.modalItemText,
                    { color: theme.error },
                    selectedType === "expense" && styles.modalItemTextSelected
                  ]}>
                    Expense
                  </Text>
                </View>
                {selectedType === "expense" && (
                  <Ionicons name="checkmark" size={20} color={theme.primary} />
                )}
              </Pressable>
              <Pressable
                style={[
                  styles.modalItem,
                  selectedType === "income" && styles.modalItemSelected
                ]}
                onPress={() => {
                  setValue("type", "income");
                  setShowTypeModal(false);
                }}
              >
                <View style={styles.modalItemContent}>
                  <Ionicons name="arrow-down-circle" size={20} color={theme.success} />
                  <Text style={[
                    styles.modalItemText,
                    { color: theme.success },
                    selectedType === "income" && styles.modalItemTextSelected
                  ]}>
                    Income
                  </Text>
                </View>
                {selectedType === "income" && (
                  <Ionicons name="checkmark" size={20} color={theme.primary} />
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Selection Modal */}
      <Modal
        visible={showDateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <Pressable onPress={() => setShowDateModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </Pressable>
            </View>
            <View style={styles.dateInputContainer}>
              <TextInput
                style={styles.dateInput}
                value={selectedDate}
                onChangeText={(text) => setValue("date", text)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.textMuted}
              />
              <Text style={styles.dateHelpText}>
                Enter date in YYYY-MM-DD format
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },
  grid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  field: {
    flex: 1,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: theme.text,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: theme.surfaceSecondary,
    color: theme.text,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  selectButton: {
    backgroundColor: theme.surfaceSecondary,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  selectText: {
    fontSize: 16,
    color: theme.text,
  },
  error: {
    color: theme.error,
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: theme.textMuted,
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    color: theme.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  modalItemSelected: {
    backgroundColor: theme.primary + "20",
  },
  modalItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalItemText: {
    fontSize: 16,
    color: theme.text,
  },
  modalItemTextSelected: {
    color: theme.primary,
    fontWeight: "600",
  },
  dateInputContainer: {
    padding: 20,
  },
  dateInput: {
    backgroundColor: theme.surfaceSecondary,
    color: theme.text,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 8,
  },
  dateHelpText: {
    fontSize: 12,
    color: theme.textMuted,
  },
});
