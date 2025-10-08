import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCreateBudget } from "../src/api/hooks/useBudgets";
import { useAuthStore } from "../src/store/authStore";
import { useAIBudgetCreation } from "../src/api/hooks/useAIBudgetCreation";
import { useTheme } from "../src/theme/ThemeContext";
import AILoading from "./AILoading";
import CustomPicker from "./Picker";

const budgetSchema = z.object({
  totalBudgeted: z.coerce.number().min(0.01, "Budget amount must be greater than 0"),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2020).max(2030),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

export default function NewBudgetForm() {
  const { session } = useAuthStore();
  const router = useRouter();
  const { theme } = useTheme();
  const createBudget = useCreateBudget();
  const { createBudgetFromAI, isProcessing: isAICreating } = useAIBudgetCreation();
  
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');
  const [aiDescription, setAiDescription] = useState('');
  const [currentStep, setCurrentStep] = useState<'analyzing' | 'parsing' | 'creating' | 'complete'>('analyzing');

  const styles = createStyles(theme);

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
    if (!session?.user?.id) {
      Alert.alert("Error", "Please log in to create a budget");
      return;
    }

    try {
      await createBudget.mutateAsync({
        month: data.month,
        year: data.year,
        totalBudgeted: data.totalBudgeted,
        totalAvailable: data.totalBudgeted, // Initially, all budgeted amount is available
        user: session.user.id,
      });

      reset();
      Alert.alert("Success", "Budget created successfully", [
        {
          text: "OK",
          onPress: () => {
            // Always redirect to budget tab after successful creation
            router.replace("/(tabs)/budgets");
          }
        }
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to create budget");
    }
  };

  const handleAIBudgetCreation = async () => {
    if (!session?.user?.id) {
      Alert.alert("Error", "Please log in to create a budget");
      return;
    }

    if (!aiDescription.trim()) {
      Alert.alert("Error", "Please enter a budget description");
      return;
    }

    if (aiDescription.trim().length < 10) {
      Alert.alert("Error", "Please provide a more detailed description (at least 10 characters)");
      return;
    }

    try {
      setCurrentStep('analyzing');
      
      // Simulate step progression
      setTimeout(() => setCurrentStep('parsing'), 1500);
      setTimeout(() => setCurrentStep('creating'), 3000);
      
      const result = await createBudgetFromAI({
        description: aiDescription,
        userId: session.user.id,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });

      setCurrentStep('complete');
      setTimeout(() => {
        setAiDescription('');
        setCurrentStep('analyzing');
        Alert.alert("Success", `Budget created successfully with AI! Created ${result.categories.length} categories.`, [
          {
            text: "OK",
            onPress: () => {
              // Always redirect to budget tab after successful creation
              router.replace("/(tabs)/budgets");
            }
          }
        ]);
      }, 1000);
      
    } catch (error: any) {
      console.error("AI Budget Creation Error:", error);
      setCurrentStep('analyzing');
      
      let errorMessage = "Failed to create budget with AI";
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <AILoading isProcessing={isAICreating} currentStep={currentStep} />
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="sparkles" size={24} color={theme.success} style={styles.titleIcon} />
          <Text style={styles.title}>Create Your Budget</Text>
        </View>
        <Text style={styles.subtitle}>Choose how you'd like to create your budget</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'manual' && styles.activeTab]}
          onPress={() => setActiveTab('manual')}
        >
          <Text style={[styles.tabText, activeTab === 'manual' && styles.activeTabText]}>
            Manual Setup
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'ai' && styles.activeTab]}
          onPress={() => setActiveTab('ai')}
        >
          <Ionicons
            name="sparkles"
            size={16}
            color={activeTab === 'ai' ? theme.onPrimary : theme.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'ai' && styles.activeTabText]}>
            AI Assistant
          </Text>
        </Pressable>
      </View>

      {/* Manual Tab Content */}
      {activeTab === 'manual' && (
        <View style={styles.tabContent}>
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
              <Controller
                control={control}
                name="month"
                render={({ field: { onChange, value } }) => (
                  <CustomPicker
                    label="Month"
                    value={value}
                    onValueChange={onChange}
                    items={[
                      { label: "January", value: 1 },
                      { label: "February", value: 2 },
                      { label: "March", value: 3 },
                      { label: "April", value: 4 },
                      { label: "May", value: 5 },
                      { label: "June", value: 6 },
                      { label: "July", value: 7 },
                      { label: "August", value: 8 },
                      { label: "September", value: 9 },
                      { label: "October", value: 10 },
                      { label: "November", value: 11 },
                      { label: "December", value: 12 }
                    ]}
                    placeholder="Select month"
                    error={errors.month?.message}
                  />
                )}
              />
            </View>

            <View style={[styles.field, styles.halfField]}>
              <Controller
                control={control}
                name="year"
                render={({ field: { onChange, value } }) => {
                  const currentYear = new Date().getFullYear();
                  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
                  
                  return (
                    <CustomPicker
                      label="Year"
                      value={value}
                      onValueChange={onChange}
                      items={years.map(year => ({
                        label: year.toString(),
                        value: year
                      }))}
                      placeholder="Select year"
                      error={errors.year?.message}
                    />
                  );
                }}
              />
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
      )}

      {/* AI Tab Content */}
      {activeTab === 'ai' && (
        <View style={styles.tabContent}>
          <View style={styles.field}>
            <Text style={styles.label}>Describe your budget</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={aiDescription}
              onChangeText={setAiDescription}
              placeholder="Example: I make 5000. Rent 2000, food 1000, the rest is savings."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.characterCount}>
              <Text style={styles.characterCountText}>
                {aiDescription.length}/1000 characters
              </Text>
              <Text style={styles.characterCountText}>
                {aiDescription.length < 10 ? 'Need more detail' : 'Good description'}
              </Text>
            </View>
          </View>

          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>Examples:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.examplesScroll}>
              <View style={styles.examplesList}>
                <Text style={styles.exampleText}>
                  "I make 5000. Rent 2000, food 1000, the rest is savings."
                </Text>
                <Text style={styles.exampleText}>
                  "My income is 3000. I spend 1200 on rent, 800 on food, 300 on transport, and save the rest."
                </Text>
                <Text style={styles.exampleText}>
                  "I earn 6000 monthly. 2500 for rent, 1000 for food, 500 for utilities, and the rest goes to savings."
                </Text>
              </View>
            </ScrollView>
          </View>

          <Pressable
            style={[styles.button, styles.aiButton, (!aiDescription.trim() || isAICreating) && styles.buttonDisabled]}
            onPress={handleAIBudgetCreation}
            disabled={!aiDescription.trim() || isAICreating}
          >
            <Ionicons name="sparkles" size={20} color={theme.surface} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>
              {isAICreating ? "Creating with AI..." : "Create Budget with AI"}
            </Text>
          </Pressable>
        </View>
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
  header: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: theme.backgroundSecondary,
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    gap: 6,
  },
  activeTab: {
    backgroundColor: theme.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.textSecondary,
  },
  activeTabText: {
    color: theme.onPrimary,
  },
  tabContent: {
    // Content styles
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
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  characterCount: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  characterCountText: {
    fontSize: 12,
    color: theme.textMuted,
  },
  examplesContainer: {
    marginBottom: 20,
  },
  examplesTitle: {
    fontSize: 14,
    color: theme.text,
    marginBottom: 12,
    fontWeight: "500",
  },
  examplesScroll: {
    // ScrollView styles
  },
  examplesList: {
    gap: 12,
  },
  exampleText: {
    fontSize: 13,
    color: theme.textSecondary,
    backgroundColor: theme.backgroundSecondary,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    marginRight: 12,
    minWidth: 280,
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
  },
  aiButton: {
    backgroundColor: theme.primary,
  },
  buttonDisabled: {
    backgroundColor: theme.textMuted,
  },
  buttonIcon: {
    // Icon styles
  },
  buttonText: {
    color: theme.surface,
    fontSize: 16,
    fontWeight: "600",
  },
});
