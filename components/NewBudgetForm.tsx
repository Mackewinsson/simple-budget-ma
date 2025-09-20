import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateBudget } from "../src/api/hooks/useBudgets";
import { useDemoUser } from "../src/api/hooks/useDemoUser";

const budgetSchema = z.object({
  totalBudgeted: z.coerce.number().min(0.01, "Budget amount must be greater than 0"),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2020).max(2030),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

export default function NewBudgetForm() {
  const { data: demoUser } = useDemoUser();
  const createBudget = useCreateBudget();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      totalBudgeted: 0,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
  });

  const onSubmit = async (data: BudgetFormData) => {
    if (!demoUser?._id) {
      Alert.alert("Error", "User not loaded");
      return;
    }

    try {
      await createBudget.mutateAsync({
        month: data.month,
        year: data.year,
        totalBudgeted: data.totalBudgeted,
        totalAvailable: data.totalBudgeted, // Initially, all budgeted amount is available
        user: demoUser._id,
      });

      reset();
      Alert.alert("Success", "Budget created successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to create budget");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Budget</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Total Budget Amount</Text>
        <Controller
          control={control}
          name="totalBudgeted"
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
        {errors.totalBudgeted && (
          <Text style={styles.error}>{errors.totalBudgeted.message}</Text>
        )}
      </View>

      <View style={styles.row}>
        <View style={[styles.field, styles.halfField]}>
          <Text style={styles.label}>Month</Text>
          <Controller
            control={control}
            name="month"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={(text) => onChange(parseInt(text) || 1)}
                value={value.toString()}
                placeholder="1-12"
                keyboardType="numeric"
              />
            )}
          />
          {errors.month && (
            <Text style={styles.error}>{errors.month.message}</Text>
          )}
        </View>

        <View style={[styles.field, styles.halfField]}>
          <Text style={styles.label}>Year</Text>
          <Controller
            control={control}
            name="year"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={(text) => onChange(parseInt(text) || new Date().getFullYear())}
                value={value.toString()}
                placeholder="2024"
                keyboardType="numeric"
              />
            )}
          />
          {errors.year && (
            <Text style={styles.error}>{errors.year.message}</Text>
          )}
        </View>
      </View>

      <Pressable
        style={[styles.button, createBudget.isPending && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={createBudget.isPending}
      >
        <Text style={styles.buttonText}>
          {createBudget.isPending ? "Creating..." : "Create Budget"}
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
    margin: 16,
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
  halfField: {
    flex: 1,
    marginRight: 8,
  },
  row: {
    flexDirection: "row",
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
