import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateCategory } from "../src/api/hooks/useCategories";
import { useAuthStore } from "../src/store/authStore";
import { useBudget } from "../src/api/hooks/useBudgets";
import { useTheme } from "../src/theme/ThemeContext";
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from "../src/theme/layout";

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
  const { session } = useAuthStore();
  const { data: budget } = useBudget(session?.user?.id || "");
  const createCategory = useCreateCategory();
  const { theme } = useTheme();

  const styles = createStyles(theme);

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
    if (!session?.user?.id) {
      Alert.alert("Error", "Please log in to create categories");
      return;
    }

    if (!budget?._id) {
      Alert.alert("Error", "No budget found. Please create a budget first.");
      return;
    }

    try {
      await createCategory.mutateAsync({
        name: data.name,
        budgeted: data.budgeted,
        budgetId: budget._id,
        userId: session.user.id,
      });

      reset();
      Alert.alert("Success", "Category created successfully");
      onComplete?.();
    } catch (error) {
      console.error("Category creation error:", error);
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
              placeholderTextColor={theme.textMuted}
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
              placeholderTextColor={theme.textMuted}
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

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    padding: SPACING.lg,
    backgroundColor: theme.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.shadowOpacity,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: theme.text,
    marginBottom: SPACING.lg,
  },
  field: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.md,
    color: theme.text,
    marginBottom: SPACING.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  input: {
    backgroundColor: theme.surfaceSecondary,
    color: theme.text,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    fontSize: FONT_SIZES.lg,
    borderWidth: 1,
    borderColor: theme.border,
  },
  error: {
    color: theme.error,
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  buttonRow: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  button: {
    backgroundColor: theme.primary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: theme.textMuted,
  },
  buttonText: {
    color: theme.onPrimary,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  cancelButton: {
    backgroundColor: theme.surfaceSecondary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cancelButtonText: {
    color: theme.text,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
  },
});
