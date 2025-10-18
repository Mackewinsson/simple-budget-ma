import { useEffect, useCallback, useRef } from 'react';
import { useFeatureFlagStore } from '../store/featureFlagStore';
import { useAuthStore } from '../store/authStore';
import { FEATURE_FLAG_KEYS, FeatureFlagKey } from '../types/featureFlags';

export interface UseFeatureFlagsReturn {
  // Feature flag checks
  isFeatureEnabled: (featureKey: string, fallback?: boolean) => boolean;
  isNewDashboardEnabled: () => boolean;
  isAdvancedAnalyticsEnabled: () => boolean;
  isMobileDarkModeEnabled: () => boolean;
  isOfflineSyncEnabled: () => boolean;
  isAiAssistantEnabled: () => boolean;
  isPremiumFeaturesEnabled: () => boolean;
  isAiBudgetingEnabled: () => boolean;
  isTransactionTextInputEnabled: () => boolean;
  isExportCsvEnabled: () => boolean;
  isManualBudgetEnabled: () => boolean;
  isUnlimitedCategoriesEnabled: () => boolean;
  isPrioritySupportEnabled: () => boolean;
  isNewCheckoutFlowEnabled: () => boolean;
  isMobileOfflineSyncEnabled: () => boolean;
  isProFeaturesEnabled: () => boolean;
  isAaEnabled: () => boolean;

  // User info
  getUserType: () => 'free' | 'pro' | 'admin' | null;
  getUserId: () => string | null;
  isProUser: () => boolean;
  isFreeUser: () => boolean;
  isAdminUser: () => boolean;

  // State
  loading: boolean;
  error: string | null;
  features: Record<string, boolean>;
  lastFetch: number | null;

  // Actions
  refreshFeatures: () => Promise<void>;
  clearError: () => void;
}

/**
 * Hook for accessing feature flags in React components
 * Automatically fetches feature flags on mount and provides auto-refresh
 */
export const useFeatureFlags = (): UseFeatureFlagsReturn => {
  const {
    features,
    userType,
    userId,
    lastFetch,
    loading,
    error,
    fetchFeatures,
    isFeatureEnabled: storeIsFeatureEnabled,
    getUserType: storeGetUserType,
    getUserId: storeGetUserId,
    clearError,
    startAutoRefresh,
  } = useFeatureFlagStore();

  const { session, isAuthenticated } = useAuthStore();
  const autoRefreshCleanupRef = useRef<(() => void) | null>(null);

  // Initialize feature flags when user is authenticated
  useEffect(() => {
    const initializeFeatureFlags = async () => {
      if (isAuthenticated && session?.token) {
        console.log('[useFeatureFlags] Initializing feature flags for authenticated user');
        
        // Load from local storage first for immediate availability
        await useFeatureFlagStore.getState().loadFromLocal();
        
        // Then fetch fresh data from server
        await fetchFeatures(session.token);
        
        // Start auto-refresh
        if (autoRefreshCleanupRef.current) {
          autoRefreshCleanupRef.current();
        }
        autoRefreshCleanupRef.current = startAutoRefresh(session.token);
      } else {
        console.log('[useFeatureFlags] User not authenticated, loading default features');
        await useFeatureFlagStore.getState().loadFromLocal();
      }
    };

    initializeFeatureFlags();

    // Cleanup auto-refresh on unmount
    return () => {
      if (autoRefreshCleanupRef.current) {
        autoRefreshCleanupRef.current();
        autoRefreshCleanupRef.current = null;
      }
    };
  }, [isAuthenticated, session?.token, fetchFeatures, startAutoRefresh]);

  // Refresh features manually
  const refreshFeatures = useCallback(async () => {
    if (session?.token) {
      await fetchFeatures(session.token);
    }
  }, [session?.token, fetchFeatures]);

  // Feature flag checkers with specific fallbacks
  const isNewDashboardEnabled = useCallback(() => 
    storeIsFeatureEnabled(FEATURE_FLAG_KEYS.NEW_DASHBOARD, false), [storeIsFeatureEnabled]);
  
  const isAdvancedAnalyticsEnabled = useCallback(() => 
    storeIsFeatureEnabled(FEATURE_FLAG_KEYS.ADVANCED_ANALYTICS, false), [storeIsFeatureEnabled]);
  
  const isMobileDarkModeEnabled = useCallback(() => 
    storeIsFeatureEnabled(FEATURE_FLAG_KEYS.MOBILE_DARK_MODE, true), [storeIsFeatureEnabled]);
  
  const isOfflineSyncEnabled = useCallback(() => 
    storeIsFeatureEnabled(FEATURE_FLAG_KEYS.OFFLINE_SYNC, true), [storeIsFeatureEnabled]);
  
  const isAiAssistantEnabled = useCallback(() => 
    storeIsFeatureEnabled(FEATURE_FLAG_KEYS.AI_ASSISTANT, false), [storeIsFeatureEnabled]);
  
  const isPremiumFeaturesEnabled = useCallback(() => 
    storeIsFeatureEnabled(FEATURE_FLAG_KEYS.PREMIUM_FEATURES, false), [storeIsFeatureEnabled]);
  
  const isAiBudgetingEnabled = useCallback(() => 
    storeIsFeatureEnabled(FEATURE_FLAG_KEYS.AI_BUDGETING, false), [storeIsFeatureEnabled]);
  
  const isTransactionTextInputEnabled = useCallback(() => 
    storeIsFeatureEnabled(FEATURE_FLAG_KEYS.TRANSACTION_TEXT_INPUT, false), [storeIsFeatureEnabled]);
  
  const isExportCsvEnabled = useCallback(() => 
    storeIsFeatureEnabled(FEATURE_FLAG_KEYS.EXPORT_CSV, true), [storeIsFeatureEnabled]);
  
  const isManualBudgetEnabled = useCallback(() => 
    storeIsFeatureEnabled(FEATURE_FLAG_KEYS.MANUAL_BUDGET, true), [storeIsFeatureEnabled]);
  
  const isUnlimitedCategoriesEnabled = useCallback(() => 
    storeIsFeatureEnabled(FEATURE_FLAG_KEYS.UNLIMITED_CATEGORIES, true), [storeIsFeatureEnabled]);
  
  const isPrioritySupportEnabled = useCallback(() => 
    storeIsFeatureEnabled(FEATURE_FLAG_KEYS.PRIORITY_SUPPORT, false), [storeIsFeatureEnabled]);
  
  const isNewCheckoutFlowEnabled = useCallback(() => 
    storeIsFeatureEnabled(FEATURE_FLAG_KEYS.NEW_CHECKOUT_FLOW, false), [storeIsFeatureEnabled]);
  
  const isMobileOfflineSyncEnabled = useCallback(() => 
    storeIsFeatureEnabled(FEATURE_FLAG_KEYS.MOBILE_OFFLINE_SYNC, true), [storeIsFeatureEnabled]);
  
  const isProFeaturesEnabled = useCallback(() => 
    storeIsFeatureEnabled(FEATURE_FLAG_KEYS.PRO_FEATURES, false), [storeIsFeatureEnabled]);

  const isAaEnabled = useCallback(() => 
    storeIsFeatureEnabled(FEATURE_FLAG_KEYS.AA, false), [storeIsFeatureEnabled]);

  // User type checkers
  const isProUser = useCallback(() => {
    const type = storeGetUserType();
    return type === 'pro' || (session?.user?.plan === 'pro' || session?.user?.isPaid === true);
  }, [storeGetUserType, session?.user?.plan, session?.user?.isPaid]);

  const isFreeUser = useCallback(() => {
    const type = storeGetUserType();
    return type === 'free' || (!session?.user?.plan && !session?.user?.isPaid);
  }, [storeGetUserType, session?.user?.plan, session?.user?.isPaid]);

  const isAdminUser = useCallback(() => {
    const type = storeGetUserType();
    return type === 'admin';
  }, [storeGetUserType]);

  return {
    // Feature flag checks
    isFeatureEnabled: storeIsFeatureEnabled,
    isNewDashboardEnabled,
    isAdvancedAnalyticsEnabled,
    isMobileDarkModeEnabled,
    isOfflineSyncEnabled,
    isAiAssistantEnabled,
    isPremiumFeaturesEnabled,
    isAiBudgetingEnabled,
    isTransactionTextInputEnabled,
    isExportCsvEnabled,
    isManualBudgetEnabled,
    isUnlimitedCategoriesEnabled,
    isPrioritySupportEnabled,
    isNewCheckoutFlowEnabled,
    isMobileOfflineSyncEnabled,
    isProFeaturesEnabled,
    isAaEnabled,

    // User info
    getUserType: storeGetUserType,
    getUserId: storeGetUserId,
    isProUser,
    isFreeUser,
    isAdminUser,

    // State
    loading,
    error,
    features,
    lastFetch,

    // Actions
    refreshFeatures,
    clearError,
  };
};

/**
 * Hook for checking a specific feature flag
 * @param featureKey - The feature flag key to check
 * @param fallback - Fallback value if feature is not found
 * @returns boolean indicating if feature is enabled
 */
export const useFeatureFlag = (featureKey: string, fallback: boolean = false): boolean => {
  const { isFeatureEnabled } = useFeatureFlags();
  return isFeatureEnabled(featureKey, fallback);
};

/**
 * Hook for checking if user has access to pro features
 * @returns boolean indicating if user has pro access
 */
export const useProAccess = (): boolean => {
  const { isProUser, isProFeaturesEnabled } = useFeatureFlags();
  return isProUser() || isProFeaturesEnabled();
};
