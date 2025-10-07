import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView, Modal, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DateTimePicker, { DateTimePickerEvent, DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useCreateExpense } from "../src/api/hooks/useExpenses";
import { useAuthStore } from "../src/store/authStore";
import { useBudget } from "../src/api/hooks/useBudgets";
import { useCategoriesByBudget } from "../src/api/hooks/useCategories";
import { useTheme } from "../src/theme/ThemeContext";
import CustomPicker from "./Picker";

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
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesByBudget(budget?._id || "");
  
  // Debug logging
  console.log("Categories data:", categories);
  console.log("Categories loading:", categoriesLoading);
  console.log("Budget ID:", budget?._id);
  const createExpense = useCreateExpense();
  const { theme } = useTheme();

  const [isIOSPickerVisible, setIsIOSPickerVisible] = useState(false);
  const [iosTempDate, setIOSTempDate] = useState(new Date());

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

  const selectedDate = watch("date");

  const getValidDate = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return new Date();
    }
    return parsed;
  };

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
    const date = getValidDate(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleAndroidDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (!date) {
      return;
    }

    const iso = date.toISOString().split("T")[0];
    setValue("date", iso, { shouldValidate: true, shouldTouch: true, shouldDirty: true });
  };

  const handleDatePress = () => {
    const currentDate = getValidDate(selectedDate);

    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        mode: "date",
        value: currentDate,
        is24Hour: true,
        onChange: handleAndroidDateChange,
      });
      return;
    }

    setIOSTempDate(currentDate);
    setIsIOSPickerVisible(true);
  };

  const handleIOSPickerChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setIOSTempDate(date);
    }
  };

  const closeIOSPicker = () => {
    setIsIOSPickerVisible(false);
  };

  const confirmIOSDate = () => {
    const iso = iosTempDate.toISOString().split("T")[0];
    setValue("date", iso, { shouldValidate: true, shouldTouch: true, shouldDirty: true });
    setIsIOSPickerVisible(false);
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
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <CustomPicker
                label="Type"
                value={value}
                onValueChange={onChange}
                items={[
                  { label: "Expense", value: "expense" },
                  { label: "Income", value: "income" }
                ]}
                placeholder="Select type"
                error={errors.type?.message}
              />
            )}
          />
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
          <Controller
            control={control}
            name="categoryId"
            render={({ field: { onChange, value } }) => {
              if (categoriesLoading) {
                return (
                  <CustomPicker
                    label="Category"
                    value=""
                    onValueChange={() => {}}
                    items={[{ label: "Loading categories...", value: "" }]}
                    placeholder="Loading..."
                    error={errors.categoryId?.message}
                  />
                );
              }
              
              const categoryItems = categories.length > 0 
                ? categories.map(category => ({
                    label: category.name,
                    value: category._id || category.id || category.name
                  }))
                : [{ label: "No categories available", value: "" }];
              
              return (
                <CustomPicker
                  label="Category"
                  value={value}
                  onValueChange={onChange}
                  items={categoryItems}
                  placeholder={categories.length > 0 ? "Select a category" : "Create categories first"}
                  error={errors.categoryId?.message}
                />
              );
            }}
          />
        </View>

        {/* Date Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Date</Text>
          <Pressable
            style={styles.selectButton}
            onPress={handleDatePress}
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


      {Platform.OS === "ios" && (
        <Modal
          visible={isIOSPickerVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeIOSPicker}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Date</Text>
                <Pressable onPress={closeIOSPicker}>
                  <Ionicons name="close" size={24} color={theme.text} />
                </Pressable>
              </View>
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={iosTempDate}
                  mode="date"
                  display="spinner"
                  onChange={handleIOSPickerChange}
                  style={styles.iosPicker}
                />
              </View>
              <View style={styles.modalActions}>
                <Pressable style={styles.modalActionButton} onPress={closeIOSPicker}>
                  <Text style={styles.modalActionText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.modalActionButton} onPress={confirmIOSDate}>
                  <Text style={styles.modalActionText}>Done</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
    minHeight: 48,
    height: 48,
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
  selectButton: {
    backgroundColor: theme.surfaceSecondary,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 48,
    height: 48,
  },
  selectText: {
    fontSize: 16,
    color: theme.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.cardBorder,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
  },
  pickerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iosPicker: {
    width: "100%",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  modalActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.primary,
  },
});
