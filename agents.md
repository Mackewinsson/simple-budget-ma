# 🤖 AI Agent Context Guide - PresuSimple

> **Last Updated**: January 2026  
> **Read Time**: ~25 minutes  
> **Purpose**: Complete context for AI assistants working on this codebase

This document provides comprehensive context for AI assistants. **Read this file first** before making any changes to understand the architecture, patterns, conventions, and pitfalls.

---

## 📱 Project Identity

| Property | Value |
|----------|-------|
| **App Name** | PresuSimple ("Presupuesto Simple" = Simple Budget) |
| **Platform** | React Native with Expo SDK 54 |
| **Language** | TypeScript (strict mode) |
| **UI Language** | Spanish (all user-facing strings) |
| **Backend** | Next.js API server (separate repo: `simple-budget`) |
| **Bundle ID** | `com.presusimple.app` |
| **Target Users** | Spanish-speaking users managing personal finances |

### App Purpose
A mobile budgeting app that helps users:
1. Create monthly budgets (manually or with AI)
2. Track expenses and income by category
3. View financial reports and analytics
4. Manage subscription to Pro features

---

## 🏗️ Architecture Deep Dive

### Directory Structure
```
budgeting-mobile/
├── app/                          # 📱 EXPO ROUTER (file-based routing)
│   ├── _layout.tsx               # Root: Theme → Gesture → SafeArea → Query providers
│   ├── index.tsx                 # Entry point: auth check → redirect
│   ├── auth/
│   │   └── login.tsx             # Login screen with email/password
│   ├── create-budget.tsx         # Budget creation wizard
│   ├── test.tsx                  # Development test screen
│   └── (tabs)/                   # Tab navigator group
│       ├── _layout.tsx           # Tab bar configuration
│       ├── transactions.tsx      # Main expense/income tracking
│       ├── budgets.tsx           # Budget overview, categories
│       ├── reports.tsx           # Financial analytics
│       └── settings.tsx          # User preferences, theme, logout
│
├── components/                    # 🧩 REUSABLE UI COMPONENTS
│   ├── form-fields/              # Form input components
│   │   ├── AmountInput.tsx       # Currency input with $ prefix
│   │   ├── DatePickerField.tsx   # Date selection
│   │   ├── DescriptionInput.tsx  # Text input for descriptions
│   │   ├── FormField.tsx         # react-hook-form Controller wrapper
│   │   └── index.ts              # Barrel export
│   ├── NewExpenseForm.tsx        # Create expense/income form
│   ├── NewBudgetForm.tsx         # Budget creation (manual + AI)
│   ├── NewCategoryForm.tsx       # Add category to budget
│   ├── CategoryList.tsx          # Display/manage categories
│   ├── CategoryItem.tsx          # Single category display
│   ├── ErrorScreen.tsx           # Full-screen error states
│   ├── LoadingScreen.tsx         # Full-screen loading
│   ├── BeautifulLoadingOverlay.tsx # Overlay loading indicator
│   ├── GlobalLoadingIndicator.tsx # Query-based loading overlay
│   ├── AITransactionInput.tsx    # AI-powered transaction entry
│   ├── AILoading.tsx             # AI processing animation
│   ├── ProBadge.tsx              # Subscription status badge
│   ├── Picker.tsx                # Custom dropdown picker
│   └── Summary.tsx               # Budget summary display
│
├── src/
│   ├── api/                       # 🌐 API LAYER
│   │   ├── client.ts             # Axios instance + interceptors
│   │   ├── auth.ts               # Login/logout functions
│   │   ├── budgets.ts            # Budget CRUD
│   │   ├── categories.ts         # Category CRUD
│   │   ├── expenses.ts           # Expense CRUD
│   │   ├── users.ts              # User operations
│   │   ├── featureFlags.ts       # Feature flag fetching
│   │   ├── demo.ts               # Demo user operations
│   │   ├── mockData.ts           # Mock data for development
│   │   └── hooks/                # React Query hooks
│   │       ├── useBudgets.ts     # Budget queries/mutations
│   │       ├── useCategories.ts  # Category queries/mutations
│   │       ├── useExpenses.ts    # Expense queries/mutations
│   │       ├── useUsers.ts       # User queries
│   │       ├── useAIBudgetCreation.ts # AI budget creation
│   │       ├── useDemoUser.ts    # Demo user hook
│   │       └── index.ts          # Barrel export
│   │
│   ├── hooks/                     # 🪝 CUSTOM HOOKS
│   │   ├── useFeatureFlags.ts    # Feature flag access
│   │   ├── useFeatureAccess.ts   # Feature + subscription access
│   │   ├── useNetworkStatus.ts   # Online/offline detection
│   │   ├── useBackgroundSync.ts  # Background data refresh
│   │   ├── useTokenExpiration.ts # JWT expiry monitoring
│   │   ├── useQueryLoading.ts    # Query loading states
│   │   ├── useSpecificQueryLoading.ts # Specific query loading
│   │   ├── usePrefetchData.ts    # Data prefetching
│   │   ├── useSafeAreaStyles.ts  # Safe area utilities
│   │   └── useThemedStyles.ts    # Theme-aware styles
│   │
│   ├── store/                     # 📦 ZUSTAND STORES
│   │   ├── authStore.ts          # Authentication state
│   │   └── featureFlagStore.ts   # Feature flags state
│   │
│   ├── lib/                       # 🔧 UTILITIES
│   │   ├── env.ts                # Environment configuration
│   │   ├── api.ts                # Type definitions + legacy API
│   │   ├── errorUtils.ts         # Error categorization
│   │   ├── analytics.ts          # Event tracking
│   │   ├── spanish.ts            # UI translations (ES)
│   │   ├── features.ts           # Feature definitions
│   │   ├── featureFlagService.ts # Feature flag service
│   │   ├── devUtils.ts           # Development utilities
│   │   ├── reactotron.ts         # Reactotron config
│   │   ├── i18n.ts               # Internationalization
│   │   ├── theme.ts              # Legacy theme utilities
│   │   ├── openai-functions.ts   # OpenAI function definitions
│   │   ├── openai-prompts.ts     # AI prompt templates
│   │   ├── openai-transaction-functions.ts
│   │   └── openai-transaction-prompts.ts
│   │
│   ├── theme/                     # 🎨 THEMING
│   │   ├── ThemeContext.tsx      # Theme provider + hook
│   │   ├── colors.ts             # Light/dark theme definitions
│   │   └── layout.ts             # Spacing, fonts, sizes
│   │
│   ├── types/                     # 📝 TYPE DEFINITIONS
│   │   ├── featureFlags.ts       # Feature flag types
│   │   ├── subscription.ts       # Subscription plan types
│   │   └── mongoose.d.ts         # MongoDB type overrides
│   │
│   └── query/                     # ⚡ TANSTACK QUERY
│       └── queryClient.ts        # Query client configuration
│
├── assets/                        # 🖼️ IMAGES & ICONS
├── scripts/                       # 🛠️ BUILD SCRIPTS
└── [config files]                 # App, EAS, TypeScript configs
```

### Provider Hierarchy (Critical!)
```tsx
// app/_layout.tsx - Order matters!
<ThemeProvider>                    // 1. Theme (colors, dark mode)
  <GestureHandlerRootView>         // 2. Gestures (required by RN)
    <SafeAreaProvider>             // 3. Safe areas (notches, etc.)
      <QueryClientProvider>        // 4. React Query
        <AppContent />             // 5. App + loading indicator
      </QueryClientProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
</ThemeProvider>
```

---

## 🔧 Tech Stack Reference

### Core Dependencies

| Package | Version | Purpose | Usage |
|---------|---------|---------|-------|
| `expo` | ~54.0.9 | Development platform | CLI, dev client, builds |
| `expo-router` | ^6.0.7 | File-based routing | Navigation, deep links |
| `react` | 19.1.0 | UI framework | Components, hooks |
| `react-native` | 0.81.4 | Mobile framework | Native components |
| `typescript` | ~5.9.2 | Type safety | Static typing |

### State & Data

| Package | Version | Purpose | Usage |
|---------|---------|---------|-------|
| `zustand` | ^5.0.8 | Global state | Auth, feature flags |
| `@tanstack/react-query` | ^5.89.0 | Server state | API data, caching |
| `axios` | ^1.12.2 | HTTP client | API requests |
| `react-hook-form` | ^7.63.0 | Form state | Form handling |
| `zod` | ^3.25.76 | Validation | Schema validation |

### Storage & Security

| Package | Purpose | Data Type |
|---------|---------|-----------|
| `expo-secure-store` | Encrypted storage | Auth tokens, sensitive data |
| `@react-native-async-storage/async-storage` | General storage | Preferences, cache |
| `react-native-mmkv` | Fast KV storage | Feature flags, temp data |

### UI Components

| Package | Purpose |
|---------|---------|
| `@expo/vector-icons` | Ionicons icons |
| `expo-linear-gradient` | Gradient backgrounds |
| `react-native-safe-area-context` | Safe area handling |
| `react-native-gesture-handler` | Touch gestures |
| `@react-native-community/datetimepicker` | Date selection |
| `@react-native-picker/picker` | Dropdown pickers |

---

## 📊 Data Models (Complete)

### Budget
```typescript
interface Budget {
  _id: string;              // MongoDB ObjectId
  month: number;            // 1-12
  year: number;             // e.g., 2026
  totalBudgeted: number;    // Total budget amount
  totalAvailable: number;   // Remaining after expenses
  user: string;             // User ID (MongoDB ObjectId)
  createdAt?: string;       // ISO date string
  updatedAt?: string;       // ISO date string
}
```

### Category
```typescript
interface Category {
  _id?: string;             // MongoDB ObjectId (primary)
  id?: string;              // Alternative ID (some APIs use this)
  name: string;             // Category name (e.g., "Rent", "Food")
  budgeted: number;         // Allocated amount
  spent: number;            // Amount spent (calculated)
  budgetId: string;         // Parent budget ID
}

// ⚠️ IMPORTANT: Always check BOTH _id AND id when comparing categories
// Some API responses use _id, others use id
```

### Expense
```typescript
interface Expense {
  _id: string;              // MongoDB ObjectId
  user: string;             // User ID
  budget: string;           // Budget ID
  categoryId: string;       // Category ID
  amount: number;           // Transaction amount (always positive)
  description: string;      // User-provided description
  date: string;             // ISO date string (YYYY-MM-DD)
  type: "expense" | "income"; // Transaction type
  createdAt?: string;
  updatedAt?: string;
}
```

### User (from Auth)
```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  plan?: 'free' | 'pro';    // Subscription tier
  isPaid?: boolean;         // Alternative to plan check
  trialEnd?: string;        // ISO date for trial expiry
}
```

### Session
```typescript
interface Session {
  user: User;
  token: string;            // JWT token
  expires: string;          // ISO date string
}
```

---

## 🎨 Theming System (Complete)

### Using Theme in Components
```typescript
import { useTheme } from '../src/theme/ThemeContext';

function MyComponent() {
  const { theme, isDark, themeMode, setThemeMode } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello</Text>
    </View>
  );
}

// ALWAYS use createStyles pattern for themed components
const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.background,
    padding: theme.spacing?.md ?? 12,
  },
  text: {
    color: theme.text,
    fontSize: FONT_SIZES.lg,
  },
});
```

### Theme Colors Reference
```typescript
// Light Theme
const lightTheme = {
  // Backgrounds
  background: '#f8fafc',         // Main app background
  backgroundSecondary: '#f1f5f9', // Secondary sections
  surface: '#ffffff',            // Cards, elevated content
  surfaceSecondary: '#f1f5f9',   // Input backgrounds
  
  // Text
  text: '#0f172a',               // Primary text
  textSecondary: '#475569',      // Secondary text
  textMuted: '#64748b',          // Disabled/hint text
  textTertiary: '#94a3b8',       // Very subtle text
  
  // Primary (Indigo brand color)
  primary: '#6366f1',            // Main brand color
  primaryDark: '#4f46e5',        // Hover/pressed states
  primaryLight: '#818cf8',       // Highlights
  
  // On Primary (text/icons on primary backgrounds)
  onPrimary: '#ffffff',          // Text on primary
  onPrimaryMuted: 'rgba(255, 255, 255, 0.9)',
  onPrimarySubtle: 'rgba(255, 255, 255, 0.2)',
  onPrimaryBorder: 'rgba(255, 255, 255, 0.3)',
  
  // Semantic Colors
  success: '#10b981',            // Income, positive
  successDark: '#059669',
  successLight: '#34d399',
  
  error: '#ef4444',              // Expenses, errors
  errorDark: '#dc2626',
  errorLight: '#f87171',
  
  warning: '#f59e0b',            // Warnings
  warningDark: '#d97706',
  warningLight: '#fbbf24',
  
  // Borders
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  cardBorder: '#e2e8f0',
  
  // Tab Bar
  tabBarBackground: '#ffffff',
  tabBarBorder: '#e2e8f0',
  tabBarActive: '#6366f1',
  tabBarInactive: '#64748b',
  
  // Shadows
  shadow: '#000000',
  shadowOpacity: 0.05,
};

// Dark theme swaps values appropriately
// Primary becomes lighter, backgrounds become darker, etc.
```

### Layout Constants
```typescript
// src/theme/layout.ts - Import these instead of hardcoding values!

export const SPACING = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32
};

export const FONT_SIZES = {
  xs: 12, sm: 13, md: 14, base: 15, lg: 16, xl: 18, 
  xxl: 20, xxxl: 24, huge: 28, massive: 36
};

export const FONT_WEIGHTS = {
  regular: '400', medium: '500', semibold: '600', bold: '700'
};

export const BORDER_RADIUS = {
  sm: 4, md: 8, lg: 12, xl: 16, full: 9999
};

export const ICON_SIZES = {
  xs: 16, sm: 20, md: 24, lg: 32, xl: 48, xxl: 64
};

export const SHADOW = {
  sm: { shadowOffset: { width: 0, height: 1 }, shadowRadius: 2, elevation: 1 },
  md: { shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
  lg: { shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 3 },
};
```

---

## 🌐 API Layer (Complete)

### Client Configuration
```typescript
// src/api/client.ts
const client = axios.create({ 
  baseURL: ENV.API_BASE_URL,   // From environment
  timeout: 30000               // 30 seconds
});

// Request Interceptor: Auto-injects auth token
client.interceptors.request.use(async (config) => {
  const session = await SecureStore.getItemAsync('auth_session');
  if (session) {
    const { token } = JSON.parse(session);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handles 401 (session expired)
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('auth_session');
      Alert.alert('Session Expired', 'Please log in again.');
    }
    return Promise.reject(error);
  }
);
```

### Query Keys Convention
```typescript
// Consistent query key patterns for cache management

// Budgets
export const budgetKeys = {
  all: ["budgets"] as const,
  lists: () => [...budgetKeys.all, "list"] as const,
  list: (userId: string) => [...budgetKeys.lists(), userId] as const,
  details: () => [...budgetKeys.all, "detail"] as const,
  detail: (id: string) => [...budgetKeys.details(), id] as const,
};

// Categories
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (userId: string) => [...categoryKeys.lists(), userId] as const,
  byBudget: (budgetId: string) => [...categoryKeys.all, "byBudget", budgetId] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

// Expenses
export const expenseKeys = {
  all: ["expenses"] as const,
  lists: () => [...expenseKeys.all, "list"] as const,
  list: (userId: string) => [...expenseKeys.lists(), userId] as const,
  details: () => [...expenseKeys.all, "detail"] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
};
```

### Query Hook Pattern
```typescript
// Standard query hook structure
export const useExpenses = (userId: string) => {
  return useQuery({
    queryKey: expenseKeys.list(userId),
    queryFn: () => getExpenses(userId),
    enabled: !!userId,  // Only fetch when userId exists
    staleTime: 5 * 60 * 1000,  // 5 minutes
  });
};
```

### Mutation with Optimistic Updates
```typescript
// Complete pattern for mutations with optimistic updates
export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    
    // Step 1: Optimistic update BEFORE API call
    onMutate: async (newExpense) => {
      // Cancel outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({ queryKey: expenseKeys.lists() });

      // Snapshot previous value for rollback
      const previousExpenses = queryClient.getQueryData(expenseKeys.lists());

      // Optimistically add to cache with temporary ID
      queryClient.setQueryData(expenseKeys.lists(), (old: any) => {
        if (!old) return old;
        return [
          ...old,
          { 
            ...newExpense, 
            _id: `temp-${Date.now()}`,  // Temporary ID
            isOptimistic: true,          // Mark as optimistic
            createdAt: new Date().toISOString(),
          }
        ];
      });

      return { previousExpenses };  // Context for rollback
    },
    
    // Step 2: Update cache with real server response
    onSuccess: (data, variables) => {
      queryClient.setQueryData(expenseKeys.lists(), (old: any) => {
        if (!old) return old;
        return old.map((expense: any) => 
          expense.isOptimistic && expense.description === variables.description
            ? { ...data, isOptimistic: false }  // Replace with real data
            : expense
        );
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    
    // Step 3: Rollback on error
    onError: (error, variables, context) => {
      if (context?.previousExpenses) {
        queryClient.setQueryData(expenseKeys.lists(), context.previousExpenses);
      }
      logError("Expense Creation", error);
    },
    
    // Step 4: Always refetch to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
    },
  });
};
```

### API Endpoints Reference
```typescript
// Authentication
POST /api/mobile-login           // Login with email/password
POST /api/auth/logout            // Logout
POST /api/auth/callback/google   // Google OAuth callback

// Budgets
GET  /api/budgets?user={userId}  // List user's budgets
POST /api/budgets                // Create budget
PUT  /api/budgets/{id}           // Update budget
DELETE /api/budgets/{id}         // Delete budget
POST /api/budgets/reset          // Reset budget (clear expenses)

// Categories
GET  /api/categories?user={userId}     // List by user
GET  /api/categories?budget={budgetId} // List by budget
POST /api/categories             // Create category
PUT  /api/categories/{id}        // Update category
DELETE /api/categories/{id}      // Delete category

// Expenses
GET  /api/expenses?user={userId} // List user's expenses
POST /api/expenses               // Create expense
PUT  /api/expenses/{id}          // Update expense
DELETE /api/expenses/{id}        // Delete expense

// Feature Flags
GET  /api/feature-flags?platform=mobile // Get feature flags

// Users
GET  /api/users/currency         // Get user currency preference
PUT  /api/users/currency         // Update currency preference
```

---

## 🔐 Authentication Flow

### Login Flow
```
1. User opens app → app/index.tsx
2. loadSession() from authStore
3. Check SecureStore for 'auth_session'
4. If session exists and not expired:
   → Navigate to /(tabs)/transactions
5. If no session or expired:
   → Navigate to /auth/login
6. User enters credentials
7. POST /api/mobile-login
8. Store session in SecureStore
9. Update authStore state
10. Navigate to main app
```

### Auth Store Methods
```typescript
const {
  session,           // Current session or null
  loading,           // Auth loading state
  isAuthenticated,   // Boolean auth check
  
  signIn,            // (email, password) => Promise
  signOut,           // () => Promise
  loadSession,       // Load from storage
  
  checkTokenExpiration,  // Returns true if expired
  isTokenExpiringSoon,   // Returns true if <5 min left
  clearExpiredSession,   // Clear invalid session
  
  updateUserPlan,    // (plan) => void
  isProUser,         // () => boolean
} = useAuthStore();
```

### Session Storage
```typescript
// Session stored in SecureStore under 'auth_session'
{
  user: { id, email, name, plan, isPaid, trialEnd },
  token: "eyJhbGciOiJIUzI1NiIs...",  // JWT
  expires: "2026-02-10T12:00:00.000Z"
}
```

---

## 🚩 Feature Flags System

### Architecture
```
Backend API → Feature Flag Store → useFeatureFlags Hook → Components
                    ↓
            AsyncStorage (offline cache)
```

### Feature Flag Keys
```typescript
export const FEATURE_FLAG_KEYS = {
  // Core Features
  NEW_DASHBOARD: 'new_dashboard',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  MOBILE_DARK_MODE: 'mobile_dark_mode',
  OFFLINE_SYNC: 'offline_sync',
  
  // AI Features
  AI_ASSISTANT: 'ai_assistant',
  AI_BUDGETING: 'ai_budgeting',
  TRANSACTION_TEXT_INPUT: 'transaction_text_input',
  AA: 'aa',  // Master AI features flag
  
  // Pro Features
  PREMIUM_FEATURES: 'premium_features',
  EXPORT_CSV: 'export_csv',
  UNLIMITED_CATEGORIES: 'unlimited_categories',
  PRIORITY_SUPPORT: 'priority_support',
  PRO_FEATURES: 'pro_features',
  EE: 'ee',  // Export features flag
  
  // Other
  MANUAL_BUDGET: 'manual_budget',
  NEW_CHECKOUT_FLOW: 'new_checkout_flow',
  MOBILE_OFFLINE_SYNC: 'mobile_offline_sync',
};
```

### Default Fallback Values
```typescript
// Used when offline or API fails
const DEFAULT_FEATURES = {
  mobile_dark_mode: true,    // Always enable dark mode
  offline_sync: true,        // Always enable offline
  manual_budget: true,       // Always enable manual
  export_csv: true,          // Enable CSV for all
  unlimited_categories: true,
  
  // Pro features disabled by default
  ai_budgeting: false,
  transaction_text_input: false,
  advanced_analytics: false,
  aa: false,
  premium_features: false,
};
```

### Usage Patterns
```typescript
// In components:
const { isFeatureEnabled, isProUser } = useFeatureFlags();

// Check specific feature
if (isFeatureEnabled(FEATURE_FLAG_KEYS.AA)) {
  // Show AI features
}

// Check user tier
if (isProUser()) {
  // Show pro features
}

// Feature access with upgrade prompt
const { hasAccess, showUpgradeModal } = useFeatureAccess('aiBudgeting');
if (!hasAccess) {
  showUpgradeModal();
  return;
}
```

---

## 📝 Form Patterns

### Form Schema (Zod)
```typescript
import { z } from 'zod';
import { ES } from '../lib/spanish';

const expenseSchema = z.object({
  description: z.string().min(1, ES.required),
  amount: z.coerce.number().min(0.01, ES.greaterThanZero),
  type: z.enum(["expense", "income"]),
  categoryId: z.string().min(1, ES.required),
  date: z.string().min(1, ES.required),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;
```

### Form Hook Setup
```typescript
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
    categoryId: "",
    date: new Date().toISOString().split('T')[0],
  },
});
```

### FormField Wrapper Component
```typescript
// components/form-fields/FormField.tsx
// Wraps react-hook-form Controller for cleaner JSX

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
```

### Form Submission Pattern
```typescript
const onSubmit = async (data: ExpenseFormData) => {
  // 1. Validate session
  if (!session?.user?.id) {
    Alert.alert(ES.error, "Please log in");
    return;
  }

  // 2. Validate dependencies
  if (!budget?._id) {
    Alert.alert(ES.error, "No budget found");
    return;
  }

  try {
    // 3. Call mutation
    await createExpense.mutateAsync({
      user: session.user.id,
      budget: budget._id,
      ...data,
    });

    // 4. Reset form on success
    reset();
    Alert.alert(ES.success, "Transaction added");
  } catch (error) {
    // 5. Handle error
    Alert.alert(ES.error, "Failed to add transaction");
  }
};
```

---

## 🚨 Error Handling

### Error Categories
```typescript
interface ErrorInfo {
  type: 'network' | 'server' | 'validation' | 'auth' | 'generic';
  title: string;
  message: string;
  canRetry: boolean;
}

// Usage
const errorInfo = categorizeError(error);
if (errorInfo.canRetry) {
  // Show retry button
}
```

### ErrorScreen Component
```typescript
<ErrorScreen
  title="Connection Problem"
  message="Please check your internet connection."
  errorType="network"
  onRetry={() => refetch()}
  onGoBack={() => router.back()}
  showRetry={true}
  showGoBack={true}
/>
```

### Error Handling Pattern in Forms
```typescript
const [errorState, setErrorState] = useState<{
  show: boolean;
  type: 'network' | 'server' | 'validation' | 'auth' | 'generic';
  title: string;
  message: string;
  onRetry?: () => void;
} | null>(null);

const handleError = (error: any, context: string) => {
  logError(context, error);  // Log for debugging
  const errorInfo = categorizeError(error);
  
  setErrorState({
    show: true,
    type: errorInfo.type,
    title: errorInfo.title,
    message: errorInfo.message,
    onRetry: errorInfo.canRetry ? () => {
      setErrorState(null);
      // Retry logic
    } : undefined,
  });
};

// In render:
if (errorState?.show) {
  return (
    <ErrorScreen
      title={errorState.title}
      message={errorState.message}
      errorType={errorState.type}
      onRetry={errorState.onRetry}
      onGoBack={() => setErrorState(null)}
    />
  );
}
```

---

## 🗣️ Localization (Spanish)

### Usage
```typescript
import { ES } from '../lib/spanish';

// In JSX:
<Text>{ES.transactions}</Text>  // "Transacciones"
<Text>{ES.loading}</Text>       // "Cargando..."
<Text>{ES.months.january}</Text> // "Enero"
```

### String Categories
```typescript
const ES = {
  // Navigation
  home: 'Inicio',
  transactions: 'Transacciones',
  budgets: 'Presupuestos',
  reports: 'Reportes',
  settings: 'Configuración',
  
  // Actions
  add: 'Agregar',
  edit: 'Editar',
  delete: 'Eliminar',
  save: 'Guardar',
  cancel: 'Cancelar',
  create: 'Crear',
  
  // Financial
  budget: 'Presupuesto',
  expense: 'Gasto',
  income: 'Ingreso',
  category: 'Categoría',
  amount: 'Monto',
  
  // Messages
  loading: 'Cargando...',
  success: 'Éxito',
  error: 'Error',
  required: 'Campo requerido',
  greaterThanZero: 'Debe ser mayor que 0',
  
  // Months
  months: {
    january: 'Enero',
    february: 'Febrero',
    // ... etc
  },
};
```

### Adding New Translations
```typescript
// 1. Add to src/lib/spanish.ts
export const ES = {
  // ... existing
  myNewString: 'Mi nueva cadena',
};

// 2. Use in component
import { ES } from '../lib/spanish';
<Text>{ES.myNewString}</Text>
```

---

## 🔄 Navigation Patterns

### Screen-Level Redirect Pattern
```typescript
// Used in transactions.tsx and budgets.tsx
useEffect(() => {
  // Redirect to budget creation if no budget exists
  if (!isLoading && !budget && session?.user?.id) {
    router.replace("/create-budget");
  }
}, [budget, isLoading, session?.user?.id, router]);
```

### Tab Navigation Configuration
```typescript
// app/(tabs)/_layout.tsx
<Tabs screenOptions={{
  headerShown: false,
  tabBarActiveTintColor: theme.tabBarActive,
  tabBarInactiveTintColor: theme.tabBarInactive,
  tabBarStyle: {
    backgroundColor: theme.tabBarBackground,
    height: Platform.OS === "ios" ? 95 : 75,
    paddingBottom: Platform.OS === "ios" ? 30 : 15,
  },
}}>
  <Tabs.Screen name="transactions" ... />
  <Tabs.Screen name="budgets" ... />
  <Tabs.Screen name="reports" ... />
  <Tabs.Screen name="settings" ... />
</Tabs>
```

### Navigation Methods
```typescript
import { useRouter } from "expo-router";

const router = useRouter();

router.push("/(tabs)/transactions");   // Push to stack
router.replace("/auth/login");         // Replace (no back)
router.back();                         // Go back
```

---

## ⚡ Performance Patterns

### Query Client Configuration
```typescript
// src/query/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: { 
    queries: { 
      staleTime: 5 * 60 * 1000,        // 5 minutes
      gcTime: 10 * 60 * 1000,          // 10 min garbage collection
      refetchOnWindowFocus: false,      // Don't refetch on focus
      refetchOnMount: false,            // Don't refetch on mount if fresh
      refetchOnReconnect: true,         // Refetch on network reconnect
      retry: 2,                         // Retry failed requests twice
      retryDelay: attemptIndex => 
        Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    }
  },
});
```

### Background Sync
```typescript
// Syncs critical data when app becomes active
// Runs every 2 minutes while app is active
useBackgroundSync();  // In AppContent component
```

### FlatList Optimization
```typescript
<FlatList
  data={items}
  keyExtractor={(item) => item._id}
  renderItem={renderItem}
  scrollEnabled={false}  // When inside ScrollView
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

---

## 🐛 Debugging

### Console Log Prefixes
```
[AuthStore]        - Authentication events
[API Client]       - Network requests/responses
[Index]            - App entry navigation
[Transactions]     - Transaction screen logic
[NewBudgetForm]    - Budget creation flow
[useFeatureFlags]  - Feature flag checks
[FeatureFlagStore] - Feature flag state
[Background Sync]  - Background data refresh
```

### Common Debug Scenarios

**Auth Issues:**
```typescript
// Check stored session
const session = await SecureStore.getItemAsync('auth_session');
console.log('Stored session:', session);

// Check auth store state
const { session, isAuthenticated, loading } = useAuthStore.getState();
console.log({ session, isAuthenticated, loading });
```

**Query Issues:**
```typescript
// Check query state
const queryState = queryClient.getQueryState(['budgets', 'list', userId]);
console.log('Query state:', queryState);

// Force refetch
queryClient.invalidateQueries({ queryKey: ['budgets'] });
```

**Feature Flag Issues:**
```typescript
// Check feature flag state
const { features, userType } = useFeatureFlagStore.getState();
console.log('Features:', features);
console.log('User type:', userType);
```

---

## ⚠️ Common Pitfalls & Solutions

### 1. Category ID Mismatch
```typescript
// ❌ WRONG - Only checks _id
const category = categories.find(cat => cat._id === expense.categoryId);

// ✅ CORRECT - Checks both _id AND id
const category = categories.find(
  cat => cat._id === expense.categoryId || cat.id === expense.categoryId
);
```

### 2. Missing Auth Check
```typescript
// ❌ WRONG - No auth check
const { data } = useBudget(userId);

// ✅ CORRECT - Conditional query
const { data } = useBudget(session?.user?.id || "");
// Query hook should have: enabled: !!userId
```

### 3. Direct Style Values
```typescript
// ❌ WRONG - Hardcoded values
<View style={{ backgroundColor: '#ffffff', padding: 16 }}>

// ✅ CORRECT - Theme values
<View style={{ backgroundColor: theme.background, padding: SPACING.lg }}>
```

### 4. Missing Loading States
```typescript
// ❌ WRONG - No loading handling
const { data } = useExpenses(userId);
return <ExpenseList data={data} />;

// ✅ CORRECT - Handle all states
const { data, isLoading, error } = useExpenses(userId);
if (isLoading) return <LoadingScreen />;
if (error) return <ErrorScreen error={error} />;
return <ExpenseList data={data} />;
```

### 5. Hardcoded Strings
```typescript
// ❌ WRONG - English hardcoded
<Text>Loading...</Text>

// ✅ CORRECT - Spanish from ES
<Text>{ES.loading}</Text>
```

### 6. Missing Query Invalidation
```typescript
// ❌ WRONG - No invalidation after mutation
onSuccess: (data) => {
  console.log("Success!");
},

// ✅ CORRECT - Invalidate related queries
onSuccess: (data) => {
  queryClient.invalidateQueries({ queryKey: ["budgets"] });
  queryClient.invalidateQueries({ queryKey: ["categories"] });
  queryClient.invalidateQueries({ queryKey: ["expenses"] });
},
```

---

## 📦 Subscription System

### Plan Types
```typescript
type PlanType = 'free' | 'pro';

// Pro features:
// - AI Budget Creation
// - Text-to-Transaction Input
// - Advanced Analytics
// - Priority Support
// - CSV Export (also available free)
```

### Subscription Plans
```typescript
const SUBSCRIPTION_PLANS = [
  {
    id: 'pro_monthly',
    name: 'monthly',
    displayName: 'Pro Monthly',
    price: 4.99,
    priceString: '$4.99',
    duration: '/month',
  },
  {
    id: 'pro_yearly',
    name: 'yearly',
    displayName: 'Pro Yearly',
    price: 49.99,
    priceString: '$49.99',
    duration: '/year',
    savings: 'Save $10/year',
    isPopular: true,
  },
];
```

### Checking Pro Status
```typescript
// Method 1: From auth store
const { isProUser } = useAuthStore();
if (isProUser()) { /* Pro features */ }

// Method 2: From feature flags
const { isProUser } = useFeatureFlags();
if (isProUser()) { /* Pro features */ }

// Method 3: Feature access hook
const { hasAccess, showUpgradeModal } = useFeatureAccess('aiBudgeting');
if (!hasAccess) {
  showUpgradeModal();
  return;
}
```

---

## 🧪 Testing Considerations

### Manual Testing Checklist
- [ ] Login flow (email/password)
- [ ] Budget creation (manual)
- [ ] Budget creation (AI - if enabled)
- [ ] Category creation
- [ ] Expense creation
- [ ] Income creation
- [ ] Expense deletion
- [ ] Theme switching (light/dark/system)
- [ ] Currency change (USD/EUR/GBP)
- [ ] Logout flow
- [ ] Offline behavior
- [ ] Pull-to-refresh
- [ ] Error states
- [ ] Loading states

### Type Checking
```bash
npx tsc --noEmit
```

### Metro Bundler Issues
```bash
npx expo start --clear
```

---

## 🚀 Build & Deploy

### Development
```bash
npm install
npm run start              # Start Expo dev server
npm run start:dev          # Development environment
npm run start:staging      # Staging environment
```

### Build Commands
```bash
# iOS
npm run build:dev:ios      # Development build
npm run build:staging:ios  # Staging build
npm run build:prod:ios     # Production build

# Android
npm run build:staging:android
npm run build:prod:android
```

### EAS Profiles
- `development` - Dev client with debugging
- `staging` - Internal testing (TestFlight/Internal)
- `preview` - Pre-release testing
- `production` - App Store/Play Store release

---

## 📚 Related Documentation

| File | Purpose |
|------|---------|
| `README.md` | Project overview, setup instructions |
| `.cursorrules` | Cursor-specific coding rules |
| `FEATURE_FLAGS_GUIDE.md` | Feature flag implementation |
| `THEMING_GUIDE.md` | Theme system documentation |
| `ERROR_HANDLING_GUIDE.md` | Error handling patterns |
| `SPANISH_TRANSLATION_GUIDE.md` | Localization guide |
| `TANSTACK_LOADING.md` | Loading state patterns |
| `DEV_BUILD_SETUP.md` | Development build setup |
| `PRODUCTION_CHECKLIST.md` | Release checklist |

---

## 💡 Quick Reference Card

### Must-Have Imports
```typescript
import { useTheme } from '../src/theme/ThemeContext';
import { ES } from '../src/lib/spanish';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../src/theme/layout';
import { useAuthStore } from '../src/store/authStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
```

### Component Template
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../src/theme/ThemeContext';
import { SPACING, FONT_SIZES } from '../src/theme/layout';
import { ES } from '../src/lib/spanish';

interface Props {
  title: string;
}

export default function MyComponent({ title }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.cardBackground,
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: theme.text,
  },
});
```

---

> **AI Assistant Tip**: When making changes, always:
> 1. Check for existing patterns in similar files
> 2. Use theme values, not hardcoded colors
> 3. Use ES.* for all user-facing strings
> 4. Handle loading and error states
> 5. Use the createStyles pattern for theming
> 6. Invalidate related queries after mutations
> 7. Test both light and dark modes
