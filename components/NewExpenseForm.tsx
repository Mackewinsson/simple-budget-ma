import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateExpense } from "../src/api/hooks/useExpenses";
import { useDemoUser } from "../src/api/hooks/useDemoUser";

const expenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  type: z.enum(["expense", "income"]),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export default function NewExpenseForm() {
  const { data: demoUser } = useDemoUser();
  const createExpense = useCreateExpense();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: "expense",
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    if (!demoUser?._id) {
      Alert.alert("Error", "User not loaded");
      return;
    }

    try {
      await createExpense.mutateAsync({
        user: demoUser._id,
        budget: "temp-budget-id", // This would come from the current budget
        categoryId: "temp-category-id", // This would come from a category selector
        amount: data.amount,
        description: data.description,
        date: new Date().toISOString(),
        type: data.type,
      });

      reset();
      Alert.alert("Success", "Expense created successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to create expense");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Expense</Text>

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
              placeholder="Enter description"
            />
          )}
        />
        {errors.description && (
          <Text style={styles.error}>{errors.description.message}</Text>
        )}
      </View>

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

      <Pressable
        style={[styles.button, createExpense.isPending && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={createExpense.isPending}
      >
        <Text style={styles.buttonText}>
          {createExpense.isPending ? "Creating..." : "Add Expense"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#111",
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  error: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#4ade80",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
