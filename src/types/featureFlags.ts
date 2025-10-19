export interface FeatureFlagsResponse {
  features: Record<string, boolean>;
  userType: 'free' | 'pro' | 'admin';
  platform: 'mobile' | 'web';
  userId: string;
}

export interface FeatureFlagServiceConfig {
  baseUrl: string;
  refreshInterval: number;
  fallbackFeatures: Record<string, boolean>;
}

export interface FeatureFlagState {
  features: Record<string, boolean>;
  userType: 'free' | 'pro' | 'admin' | null;
  userId: string | null;
  lastFetch: number | null;
  loading: boolean;
  error: string | null;
}

export interface FeatureFlagActions {
  fetchFeatures: (authToken: string) => Promise<FeatureFlagsResponse | null>;
  isFeatureEnabled: (featureKey: string, fallback?: boolean) => boolean;
  getUserType: () => 'free' | 'pro' | 'admin' | null;
  getUserId: () => string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  startAutoRefresh: (authToken: string) => () => void;
  stopAutoRefresh: () => void;
  loadFromLocal: () => Promise<void>;
  storeLocally: (data: FeatureFlagsResponse) => Promise<void>;
}

export type FeatureFlagStore = FeatureFlagState & FeatureFlagActions;

// Common feature flag keys used in the app
export const FEATURE_FLAG_KEYS = {
  NEW_DASHBOARD: 'new_dashboard',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  MOBILE_DARK_MODE: 'mobile_dark_mode',
  OFFLINE_SYNC: 'offline_sync',
  AI_ASSISTANT: 'ai_assistant',
  PREMIUM_FEATURES: 'premium_features',
  AI_BUDGETING: 'ai_budgeting',
  TRANSACTION_TEXT_INPUT: 'transaction_text_input',
  EXPORT_CSV: 'export_csv',
  MANUAL_BUDGET: 'manual_budget',
  UNLIMITED_CATEGORIES: 'unlimited_categories',
  PRIORITY_SUPPORT: 'priority_support',
  NEW_CHECKOUT_FLOW: 'new_checkout_flow',
  MOBILE_OFFLINE_SYNC: 'mobile_offline_sync',
  PRO_FEATURES: 'pro_features',
  AA: 'aa', // AI features flag
  EE: 'ee', // Export data flag
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAG_KEYS;
