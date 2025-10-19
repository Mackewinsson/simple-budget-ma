import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useBudgetsCollection, useCreateBudget } from "../src/api/hooks/useBudgets";
import { useAuthStore } from "../src/store/authStore";
import { useAIBudgetCreation } from "../src/api/hooks/useAIBudgetCreation";
import { useTheme } from "../src/theme/ThemeContext";
import { useFeatureFlags } from "../src/hooks/useFeatureFlags";
import { FEATURE_FLAG_KEYS } from "../src/types/featureFlags";
import AILoading from "./AILoading";
import { useFeatureAccess } from "../src/hooks/useFeatureAccess";
import CustomPicker from "./Picker";
import ErrorScreen from "./ErrorScreen";
import { categorizeError, logError } from "../src/lib/errorUtils";
import { useNetworkStatus } from "../src/hooks/useNetworkStatus";

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = Math.max(2020, CURRENT_YEAR - 5);
const MAX_YEAR = Math.min(2030, CURRENT_YEAR + 5);

const formatBudgetPeriod = (month: number, year: number) => {
  const monthName = MONTH_NAMES[month] || `Month ${month}`;
  return `${monthName} ${year}`;
};

const budgetSchema = z.object({
  totalBudgeted: z.coerce
    .number()
    .min(0.01, "Budget amount must be greater than 0")
    .refine((value) => Number.isFinite(value), "Budget amount must be a valid number"),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().refine(
    (value) => value >= MIN_YEAR && value <= MAX_YEAR,
    `Year must be between ${MIN_YEAR} and ${MAX_YEAR}`,
  ),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

export default function NewBudgetForm() {
  const { session } = useAuthStore();
  const router = useRouter();
  const { theme } = useTheme();
  const { isFeatureEnabled } = useFeatureFlags();
  const createBudget = useCreateBudget();
  const {
    data: existingBudgets = [],
    isLoading: budgetsLoading,
    error: budgetsError,
    refetch: refetchExistingBudgets,
  } = useBudgetsCollection(session?.user?.id || "", {
    enabled: !!session?.user?.id,
  });
  const existingBudgetPeriods = useMemo(() => {
    return new Set(
      existingBudgets
        .filter((budget) => budget?.month && budget?.year)
        .map((budget) => `${budget.month}-${budget.year}`)
    );
  }, [existingBudgets]);
  const { createBudgetFromAI, isProcessing: isAICreating } = useAIBudgetCreation();
  const { hasAccess, showUpgradeModal } = useFeatureAccess('aiBudgeting');
  const { isOffline } = useNetworkStatus();

  // Check if AI features are enabled via 'aa' feature flag
  const isAIEnabled = isFeatureEnabled(FEATURE_FLAG_KEYS.AA, false);
  
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');
  const [aiDescription, setAiDescription] = useState('');
  const [currentStep, setCurrentStep] = useState<'analyzing' | 'parsing' | 'creating' | 'complete'>('analyzing');
  const [errorState, setErrorState] = useState<{
    show: boolean;
    type: 'network' | 'server' | 'validation' | 'auth' | 'generic';
    title: string;
    message: string;
    onRetry?: () => void;
  } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const styles = createStyles(theme);
  const defaultMonth = Math.min(Math.max(new Date().getMonth() + 1, 1), 12);
  const defaultYear = Math.min(Math.max(CURRENT_YEAR, MIN_YEAR), MAX_YEAR);
  const yearOptions = useMemo(() => {
    const range = Math.max(0, MAX_YEAR - MIN_YEAR + 1);
    return Array.from({ length: range }, (_, index) => MIN_YEAR + index);
  }, []);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(timeoutId);
  }, [successMessage]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      totalBudgeted: 0,
      month: defaultMonth,
      year: defaultYear,
    },
  });

  const handleError = (error: any, context: string) => {
    console.log('[NewBudgetForm] handleError called with:', { context, error });
    logError(context, error);
    const errorInfo = categorizeError(error);
    console.log('[NewBudgetForm] Error info:', errorInfo);
    setSuccessMessage(null);
    
    setErrorState({
      show: true,
      type: errorInfo.type,
      title: errorInfo.title,
      message: errorInfo.message,
      onRetry: errorInfo.canRetry ? () => {
        setErrorState(null);
        // Retry the last action based on context
        if (context === 'Manual Budget Creation') {
          handleSubmit(onSubmit)();
        } else if (context === 'AI Budget Creation') {
          handleAIBudgetCreation();
        } else if (context === 'Existing Budget Lookup') {
          refetchExistingBudgets();
        }
      } : undefined,
    });
    console.log('[NewBudgetForm] Error state set:', { show: true, type: errorInfo.type });
  };

  const onSubmit = async (data: BudgetFormData) => {
    setSuccessMessage(null);
    // Check network connectivity first
    if (isOffline) {
      setErrorState({
        show: true,
        type: 'network',
        title: 'No Internet Connection',
        message: 'Please check your internet connection and try again.',
        onRetry: () => setErrorState(null),
      });
      return;
    }

    if (!session?.user?.id) {
      setErrorState({
        show: true,
        type: 'auth',
        title: 'Authentication Required',
        message: 'Please log in to create a budget',
        onRetry: () => {
          setErrorState(null);
          router.replace('/auth/login');
        },
      });
      return;
    }

    if (budgetsLoading) {
      setErrorState({
        show: true,
        type: 'generic',
        title: 'Almost Ready',
        message: 'We are still loading your existing budgets. Please try again in a moment.',
        onRetry: () => setErrorState(null),
      });
      return;
    }

    if (budgetsError) {
      handleError(budgetsError, 'Existing Budget Lookup');
      return;
    }

    const normalizedTotal = Math.round((data.totalBudgeted + Number.EPSILON) * 100) / 100;
    if (!Number.isFinite(normalizedTotal)) {
      setErrorState({
        show: true,
        type: 'validation',
        title: 'Invalid Budget Amount',
        message: 'Please enter a valid number for your budget amount.',
        onRetry: () => setErrorState(null),
      });
      return;
    }

    if (normalizedTotal <= 0) {
      setErrorState({
        show: true,
        type: 'validation',
        title: 'Invalid Budget Amount',
        message: 'Please enter a budget amount greater than 0',
        onRetry: () => setErrorState(null),
      });
      return;
    }

    if (normalizedTotal > 1000000) {
      setErrorState({
        show: true,
        type: 'validation',
        title: 'Budget Amount Too Large',
        message: 'Please enter a budget amount less than $1,000,000',
        onRetry: () => setErrorState(null),
      });
      return;
    }

    const periodKey = `${data.month}-${data.year}`;
    if (existingBudgetPeriods.has(periodKey)) {
      setErrorState({
        show: true,
        type: 'validation',
        title: 'Budget Already Exists',
        message: `You already have a budget for ${formatBudgetPeriod(data.month, data.year)}. Try updating that budget instead.`,
        onRetry: () => setErrorState(null),
      });
      return;
    }

    try {
      const result = await createBudget.mutateAsync({
        month: data.month,
        year: data.year,
        totalBudgeted: normalizedTotal,
        totalAvailable: normalizedTotal, // Initially, all budgeted amount is available
        user: session.user.id,
      });

      console.log('[NewBudgetForm] Budget created successfully:', result);
      reset();
      setSuccessMessage('Budget created successfully');
      refetchExistingBudgets();
      
      // Navigate to transactions screen after successful creation
      console.log('[NewBudgetForm] Navigating to transactions screen...');
      // Add a small delay to ensure cache invalidation completes
      setTimeout(() => {
        router.push("/(tabs)/transactions");
      }, 1000);
      
    } catch (error) {
      console.log('[NewBudgetForm] Caught error in onSubmit:', error);
      handleError(error, 'Manual Budget Creation');
    }
  };

  const handleAIBudgetCreation = async () => {
    setSuccessMessage(null);
    // Check network connectivity first
    if (isOffline) {
      setErrorState({
        show: true,
        type: 'network',
        title: 'No Internet Connection',
        message: 'Please check your internet connection and try again.',
        onRetry: () => setErrorState(null),
      });
      return;
    }

    // Check if user has pro access
    if (!hasAccess) {
      showUpgradeModal();
      return;
    }

    if (!session?.user?.id) {
      setErrorState({
        show: true,
        type: 'auth',
        title: 'Authentication Required',
        message: 'Please log in to create a budget',
        onRetry: () => {
          setErrorState(null);
          router.replace('/auth/login');
        },
      });
      return;
    }

    if (!aiDescription.trim()) {
      setErrorState({
        show: true,
        type: 'validation',
        title: 'Description Required',
        message: 'Please enter a budget description',
        onRetry: () => setErrorState(null),
      });
      return;
    }

    if (aiDescription.trim().length < 10) {
      setErrorState({
        show: true,
        type: 'validation',
        title: 'Description Too Short',
        message: 'Please provide a more detailed description (at least 10 characters)',
        onRetry: () => setErrorState(null),
      });
      return;
    }

    if (aiDescription.trim().length > 1000) {
      setErrorState({
        show: true,
        type: 'validation',
        title: 'Description Too Long',
        message: 'Please keep your description under 1000 characters',
        onRetry: () => setErrorState(null),
      });
      return;
    }

    if (budgetsLoading) {
      setErrorState({
        show: true,
        type: 'generic',
        title: 'Almost Ready',
        message: 'We are still loading your existing budgets. Please try again in a moment.',
        onRetry: () => setErrorState(null),
      });
      return;
    }

    if (budgetsError) {
      handleError(budgetsError, 'Existing Budget Lookup');
      return;
    }

    const aiMonth = defaultMonth;
    const aiYear = defaultYear;
    const aiPeriodKey = `${aiMonth}-${aiYear}`;
    if (existingBudgetPeriods.has(aiPeriodKey)) {
      setErrorState({
        show: true,
        type: 'validation',
        title: 'Budget Already Exists',
        message: `You already have a budget for ${formatBudgetPeriod(aiMonth, aiYear)}. Delete or update the existing budget before creating a new one with AI.`,
        onRetry: () => setErrorState(null),
      });
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
        month: aiMonth,
        year: aiYear,
      });

      setCurrentStep('complete');
      setTimeout(() => {
        setAiDescription('');
        setCurrentStep('analyzing');
        setSuccessMessage(`Budget created with AI! Created ${result.categories.length} categories.`);
        refetchExistingBudgets();
        
        console.log('[NewBudgetForm] AI Budget created successfully:', result);
        
        // Navigate to transactions screen after successful creation
        console.log('[NewBudgetForm] Navigating to transactions screen after AI creation...');
        // Add a small delay to ensure cache invalidation completes
        setTimeout(() => {
          router.push("/(tabs)/transactions");
        }, 1000);
        
      }, 1000);
      
    } catch (error: any) {
      console.log('[NewBudgetForm] Caught error in handleAIBudgetCreation:', error);
      setCurrentStep('analyzing');
      handleError(error, 'AI Budget Creation');
    }
  };

  // Show error screen if there's an error
  if (errorState?.show) {
    console.log('[NewBudgetForm] Rendering error screen with state:', errorState);
    return (
      <ErrorScreen
        title={errorState.title}
        message={errorState.message}
        errorType={errorState.type}
        onRetry={errorState.onRetry}
        onGoBack={() => setErrorState(null)}
        showRetry={!!errorState.onRetry}
        showGoBack={true}
      />
    );
  }

  return (
    <View style={styles.container}>
      <AILoading isProcessing={isAICreating} currentStep={currentStep} />
      
      {successMessage && (
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={20} color={theme.successDark} style={styles.successIcon} />
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}
      
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
        {isAIEnabled && (
          <Pressable
            style={[styles.tab, activeTab === 'ai' && styles.activeTab]}
            onPress={() => {
              if (!hasAccess) {
                showUpgradeModal();
                return;
              }
              setActiveTab('ai');
            }}
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
        )}
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
                  keyboardType="decimal-pad"
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
                render={({ field: { onChange, value } }) => (
                  <CustomPicker
                    label="Year"
                    value={value}
                    onValueChange={onChange}
                    items={yearOptions.map((year) => ({
                      label: year.toString(),
                      value: year,
                    }))}
                    placeholder="Select year"
                    error={errors.year?.message}
                  />
                )}
              />
            </View>
          </View>

          <Pressable
            style={[
              styles.button,
              (createBudget.isPending || budgetsLoading) && styles.buttonDisabled
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={createBudget.isPending || budgetsLoading}
          >
            <Text style={styles.buttonText}>
              {budgetsLoading
                ? "Checking budgets..."
                : createBudget.isPending
                  ? "Creating..."
                  : "Create Budget"}
            </Text>
          </Pressable>
        </View>
      )}

      {/* AI Tab Content */}
      {isAIEnabled && activeTab === 'ai' && (
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
            disabled={!aiDescription.trim() || isAICreating || budgetsLoading}
          >
            <Ionicons name="sparkles" size={20} color={theme.surface} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>
              {budgetsLoading
                ? "Checking budgets..."
                : isAICreating
                  ? "Creating with AI..."
                  : "Create Budget with AI"}
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
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.successLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.success,
    gap: 8,
  },
  successText: {
    flex: 1,
    fontSize: 14,
    color: theme.successDark,
    fontWeight: "500",
  },
  successIcon: {
    marginRight: 4,
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
