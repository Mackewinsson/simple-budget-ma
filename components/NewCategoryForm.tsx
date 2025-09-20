import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateCategory } from "../src/api/hooks/useCategories";
import { useDemoUser } from "../src/api/hooks/useDemoUser";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  budgeted: z.coerce.number().min(0.01, "Budget amount must be greater than 0"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface NewCategoryFormProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export default function NewCategoryForm({ onComplete, onCancel }: NewCategoryFormProps) {
  const { data: demoUser } = useDemoUser();
  const createCategory = useCreateCategory();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      budgeted: 0,
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    if (!demoUser?._id) {
      Alert.alert("Error", "User not loaded");
      return;
    }

    try {
      await createCategory.mutateAsync({
        name: data.name,
        budgeted: data.budgeted,
        budgetId: "demo-budget-123", // This would come from the current budget
        userId: demoUser._id,
      });

      reset();
      Alert.alert("Success", "Category created successfully");
      onComplete?.();
    } catch (error) {
      Alert.alert("Error", "Failed to create category");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Category</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Category Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter category name"
            />
          )}
        />
        {errors.name && (
          <Text style={styles.error}>{errors.name.message}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Budgeted Amount</Text>
        <Controller
          control={control}
          name="budgeted"
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
        {errors.budgeted && (
          <Text style={styles.error}>{errors.budgeted.message}</Text>
        )}
      </View>

      <View style={styles.buttonRow}>
        {onCancel && (
          <Pressable style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        )}
        
        <Pressable
          style={[styles.button, createCategory.isPending && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={createCategory.isPending}
        >
          <Text style={styles.buttonText}>
            {createCategory.isPending ? "Creating..." : "Add Category"}
          </Text>
        </Pressable>
      </View>
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
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    backgroundColor: "#4ade80",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  buttonDisabled: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#666",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
