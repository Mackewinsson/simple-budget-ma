import { useAuthStore } from '../store/authStore';
import { useFeatureFlags } from './useFeatureFlags';
import { FEATURES, FeatureKey } from '../lib/features';
import { trackFeatureAccessDenied } from '../lib/analytics';
import { FEATURE_FLAG_KEYS } from '../types/featureFlags';

export interface FeatureAccess {
  hasAccess: boolean;
  showUpgradeModal: () => void;
  isFeatureFlagEnabled: boolean;
  isProUser: boolean;
}

// Mapping from feature keys to feature flag keys
const FEATURE_TO_FLAG_MAPPING: Record<FeatureKey, string> = {
  aiBudgeting: FEATURE_FLAG_KEYS.AI_BUDGETING,
  transactionTextInput: FEATURE_FLAG_KEYS.TRANSACTION_TEXT_INPUT,
  exportCSV: FEATURE_FLAG_KEYS.EXPORT_CSV,
  manualBudget: FEATURE_FLAG_KEYS.MANUAL_BUDGET,
  advancedAnalytics: FEATURE_FLAG_KEYS.ADVANCED_ANALYTICS,
  unlimitedCategories: FEATURE_FLAG_KEYS.UNLIMITED_CATEGORIES,
  prioritySupport: FEATURE_FLAG_KEYS.PRIORITY_SUPPORT,
};

export const useFeatureAccess = (featureKey: FeatureKey): FeatureAccess => {
  const { session } = useAuthStore();
  const { isFeatureEnabled, isProUser } = useFeatureFlags();

  // Get the corresponding feature flag key
  const featureFlagKey = FEATURE_TO_FLAG_MAPPING[featureKey];

  // Check if feature flag is enabled
  const isFeatureFlagEnabled = featureFlagKey ? isFeatureEnabled(featureFlagKey, false) : false;

  // Check if user has pro plan (legacy check)
  const isProUserLegacy = session?.user?.plan === "pro" || session?.user?.isPaid === true;

  // Check if user is pro user (from feature flags)
  const isProUserFromFlags = isProUser();

  // Determine access: feature flag enabled OR pro user
  const hasAccess = isFeatureFlagEnabled || isProUserFromFlags || isProUserLegacy;

  const showUpgradeModal = (featureContext?: string) => {
    const feature = FEATURES[featureKey];
    trackFeatureAccessDenied(featureKey);
    console.log(`[FeatureAccess] Feature requires upgrade: ${feature.label}`);
    // TODO: Show upgrade UI if needed
  };

  return {
    hasAccess,
    showUpgradeModal,
    isFeatureFlagEnabled,
    isProUser: isProUserFromFlags || isProUserLegacy
  };
};
