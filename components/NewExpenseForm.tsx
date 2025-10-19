import React from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateExpense } from "../src/api/hooks/useExpenses";
import { useAuthStore } from "../src/store/authStore";
import { useBudget } from "../src/api/hooks/useBudgets";
import { useCategoriesByBudget } from "../src/api/hooks/useCategories";
import { useTheme } from "../src/theme/ThemeContext";
import { FONT_SIZES, FONT_WEIGHTS } from "../src/theme/layout";
import CustomPicker from "./Picker";
import { AmountInput, DescriptionInput, DatePickerField, FormField } from "./form-fields";
import { ES } from "../src/lib/spanish";

const expenseSchema = z.object({
  description: z.string().min(1, ES.required),
  amount: z.coerce.number().min(0.01, ES.greaterThanZero),
  type: z.enum(["expense", "income"]),
  categoryId: z.string().min(1, ES.required),
  date: z.string().min(1, ES.required),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export default function NewExpenseForm() {
  const { session } = useAuthStore();
  const { data: budget } = useBudget(session?.user?.id || "");
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesByBudget(budget?._id || "");

  // Debug logging
  console.log("Categories data:", categories);
  console.log("Categories loading:", categoriesLoading);
  console.log("Budget ID:", budget?._id);
  const createExpense = useCreateExpense();
  const { theme } = useTheme();

  const styles = createStyles(theme);

  const {
    control,
    handleSubmit,
    reset,
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

  const onSubmit = async (data: ExpenseFormData) => {
    if (!session?.user?.id) {
      Alert.alert(ES.error, "Por favor inicia sesión para agregar transacciones");
      return;
    }

    if (!budget?._id) {
      Alert.alert(ES.error, "No se encontró presupuesto. Por favor crea un presupuesto primero.");
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
      Alert.alert(ES.success, "Transacción agregada exitosamente");
    } catch (error) {
      Alert.alert(ES.error, "Error al agregar transacción");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {/* Amount Field */}
        <FormField
          control={control}
          name="amount"
          render={({ value, onChange, onBlur, error }) => (
            <AmountInput
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={error}
            />
          )}
        />

        {/* Type Field */}
        <View style={styles.field}>
          <FormField
            control={control}
            name="type"
            render={({ value, onChange, error }) => (
              <CustomPicker
                label={ES.type}
                value={value}
                onValueChange={onChange}
                items={[
                  { label: ES.expense, value: "expense" },
                  { label: ES.income, value: "income" }
                ]}
                placeholder="Seleccionar tipo"
                error={error}
              />
            )}
          />
        </View>
      </View>

      {/* Description Field */}
      <View style={styles.fullWidthField}>
        <FormField
          control={control}
          name="description"
          render={({ value, onChange, onBlur, error }) => (
            <DescriptionInput
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={error}
            />
          )}
        />
      </View>

      <View style={styles.grid}>
        {/* Category Field */}
        <View style={styles.field}>
          <FormField
            control={control}
            name="categoryId"
            render={({ value, onChange, error }) => {
              if (categoriesLoading) {
                return (
                  <CustomPicker
                    label={ES.category}
                    value=""
                    onValueChange={() => {}}
                    items={[{ label: "Cargando categorías...", value: "" }]}
                    placeholder={ES.loading}
                    error={error}
                  />
                );
              }

              const categoryItems = categories.length > 0
                ? categories.map(category => ({
                    label: category.name,
                    value: category._id || category.id || category.name
                  }))
                : [{ label: "No hay categorías disponibles", value: "" }];

              return (
                <CustomPicker
                  label={ES.category}
                  value={value}
                  onValueChange={onChange}
                  items={categoryItems}
                  placeholder={categories.length > 0 ? "Seleccionar una categoría" : "Crear categorías primero"}
                  error={error}
                />
              );
            }}
          />
        </View>

        {/* Date Field */}
        <FormField
          control={control}
          name="date"
          render={({ value, onChange, error }) => (
            <DatePickerField
              value={value}
              onChange={onChange}
              error={error}
            />
          )}
        />
      </View>

      {/* Submit Button */}
      <Pressable
        style={[styles.button, createExpense.isPending && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={createExpense.isPending}
      >
        <Ionicons name="add" size={20} color={theme.surface} style={styles.buttonIcon} />
        <Text style={styles.buttonText}>
          {createExpense.isPending ? "Agregando..." : ES.addTransaction}
        </Text>
      </Pressable>
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
    gap: 16,
  },
  grid: {
    flexDirection: "row",
    gap: 12,
  },
  field: {
    flex: 1,
  },
  fullWidthField: {
    width: '100%',
  },
  button: {
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: theme.textMuted,
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    color: theme.surface,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
  },
});
