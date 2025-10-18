import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFeatureFlags, useFeatureFlag, useProAccess } from '../src/hooks/useFeatureFlags';
import { useFeatureAccess } from '../src/hooks/useFeatureAccess';
import { useTheme } from '../src/theme/ThemeContext';
import { FEATURE_FLAG_KEYS } from '../src/types/featureFlags';

/**
 * Example component demonstrating how to use the feature flag system
 * This component shows various ways to check feature flags and handle feature access
 */
export default function FeatureFlagExample() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // Method 1: Using the comprehensive useFeatureFlags hook
  const {
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
    getUserType,
    getUserId,
    isProUser,
    isFreeUser,
    isAdminUser,
    loading,
    error,
    features,
    lastFetch,
    refreshFeatures,
    clearError,
  } = useFeatureFlags();

  // Method 2: Using the specific useFeatureFlag hook
  const isNewDashboardEnabledSpecific = useFeatureFlag(FEATURE_FLAG_KEYS.NEW_DASHBOARD, false);
  const isAiAssistantEnabledSpecific = useFeatureFlag(FEATURE_FLAG_KEYS.AI_ASSISTANT, false);

  // Method 3: Using the useProAccess hook
  const hasProAccess = useProAccess();

  // Method 4: Using the existing useFeatureAccess hook (backward compatibility)
  const aiBudgetingAccess = useFeatureAccess('aiBudgeting');
  const advancedAnalyticsAccess = useFeatureAccess('advancedAnalytics');

  const handleRefreshFeatures = async () => {
    try {
      await refreshFeatures();
    } catch (error) {
      console.error('Error refreshing features:', error);
    }
  };

  const formatLastFetch = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Feature Flag System Demo</Text>
      
      {/* Loading and Error States */}
      {loading && <Text style={styles.loading}>Loading feature flags...</Text>}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.clearButton} onPress={clearError}>
            <Text style={styles.clearButtonText}>Clear Error</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* User Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Information</Text>
        <Text style={styles.infoText}>User Type: {getUserType() || 'Unknown'}</Text>
        <Text style={styles.infoText}>User ID: {getUserId() || 'Unknown'}</Text>
        <Text style={styles.infoText}>Is Pro User: {isProUser() ? 'Yes' : 'No'}</Text>
        <Text style={styles.infoText}>Is Free User: {isFreeUser() ? 'Yes' : 'No'}</Text>
        <Text style={styles.infoText}>Is Admin User: {isAdminUser() ? 'Yes' : 'No'}</Text>
        <Text style={styles.infoText}>Has Pro Access: {hasProAccess ? 'Yes' : 'No'}</Text>
        <Text style={styles.infoText}>Last Fetch: {formatLastFetch(lastFetch)}</Text>
      </View>

      {/* Feature Flag Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feature Flag Status</Text>
        
        <View style={styles.featureRow}>
          <Text style={styles.featureLabel}>New Dashboard:</Text>
          <Text style={[styles.featureStatus, isNewDashboardEnabled() ? styles.enabled : styles.disabled]}>
            {isNewDashboardEnabled() ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.featureRow}>
          <Text style={styles.featureLabel}>Advanced Analytics:</Text>
          <Text style={[styles.featureStatus, isAdvancedAnalyticsEnabled() ? styles.enabled : styles.disabled]}>
            {isAdvancedAnalyticsEnabled() ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.featureRow}>
          <Text style={styles.featureLabel}>Mobile Dark Mode:</Text>
          <Text style={[styles.featureStatus, isMobileDarkModeEnabled() ? styles.enabled : styles.disabled]}>
            {isMobileDarkModeEnabled() ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.featureRow}>
          <Text style={styles.featureLabel}>Offline Sync:</Text>
          <Text style={[styles.featureStatus, isOfflineSyncEnabled() ? styles.enabled : styles.disabled]}>
            {isOfflineSyncEnabled() ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.featureRow}>
          <Text style={styles.featureLabel}>AI Assistant:</Text>
          <Text style={[styles.featureStatus, isAiAssistantEnabled() ? styles.enabled : styles.disabled]}>
            {isAiAssistantEnabled() ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.featureRow}>
          <Text style={styles.featureLabel}>Premium Features:</Text>
          <Text style={[styles.featureStatus, isPremiumFeaturesEnabled() ? styles.enabled : styles.disabled]}>
            {isPremiumFeaturesEnabled() ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.featureRow}>
          <Text style={styles.featureLabel}>AI Budgeting:</Text>
          <Text style={[styles.featureStatus, isAiBudgetingEnabled() ? styles.enabled : styles.disabled]}>
            {isAiBudgetingEnabled() ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.featureRow}>
          <Text style={styles.featureLabel}>Transaction Text Input:</Text>
          <Text style={[styles.featureStatus, isTransactionTextInputEnabled() ? styles.enabled : styles.disabled]}>
            {isTransactionTextInputEnabled() ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.featureRow}>
          <Text style={styles.featureLabel}>Export CSV:</Text>
          <Text style={[styles.featureStatus, isExportCsvEnabled() ? styles.enabled : styles.disabled]}>
            {isExportCsvEnabled() ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.featureRow}>
          <Text style={styles.featureLabel}>Manual Budget:</Text>
          <Text style={[styles.featureStatus, isManualBudgetEnabled() ? styles.enabled : styles.disabled]}>
            {isManualBudgetEnabled() ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.featureRow}>
          <Text style={styles.featureLabel}>Unlimited Categories:</Text>
          <Text style={[styles.featureStatus, isUnlimitedCategoriesEnabled() ? styles.enabled : styles.disabled]}>
            {isUnlimitedCategoriesEnabled() ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.featureRow}>
          <Text style={styles.featureLabel}>Priority Support:</Text>
          <Text style={[styles.featureStatus, isPrioritySupportEnabled() ? styles.enabled : styles.disabled]}>
            {isPrioritySupportEnabled() ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.featureRow}>
          <Text style={styles.featureLabel}>New Checkout Flow:</Text>
          <Text style={[styles.featureStatus, isNewCheckoutFlowEnabled() ? styles.enabled : styles.disabled]}>
            {isNewCheckoutFlowEnabled() ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.featureRow}>
          <Text style={styles.featureLabel}>Mobile Offline Sync:</Text>
          <Text style={[styles.featureStatus, isMobileOfflineSyncEnabled() ? styles.enabled : styles.disabled]}>
            {isMobileOfflineSyncEnabled() ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.featureRow}>
          <Text style={styles.featureLabel}>Pro Features:</Text>
          <Text style={[styles.featureStatus, isProFeaturesEnabled() ? styles.enabled : styles.disabled]}>
            {isProFeaturesEnabled() ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
      </View>

      {/* Specific Hook Examples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specific Hook Examples</Text>
        <Text style={styles.infoText}>
          New Dashboard (specific hook): {isNewDashboardEnabledSpecific ? 'Enabled' : 'Disabled'}
        </Text>
        <Text style={styles.infoText}>
          AI Assistant (specific hook): {isAiAssistantEnabledSpecific ? 'Enabled' : 'Disabled'}
        </Text>
      </View>

      {/* Legacy Feature Access Examples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legacy Feature Access</Text>
        <Text style={styles.infoText}>
          AI Budgeting Access: {aiBudgetingAccess.hasAccess ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.infoText}>
          AI Budgeting Feature Flag: {aiBudgetingAccess.isFeatureFlagEnabled ? 'Enabled' : 'Disabled'}
        </Text>
        <Text style={styles.infoText}>
          AI Budgeting Pro User: {aiBudgetingAccess.isProUser ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.infoText}>
          Advanced Analytics Access: {advancedAnalyticsAccess.hasAccess ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.infoText}>
          Advanced Analytics Feature Flag: {advancedAnalyticsAccess.isFeatureFlagEnabled ? 'Enabled' : 'Disabled'}
        </Text>
        <Text style={styles.infoText}>
          Advanced Analytics Pro User: {advancedAnalyticsAccess.isProUser ? 'Yes' : 'No'}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefreshFeatures}>
          <Text style={styles.refreshButtonText}>Refresh Feature Flags</Text>
        </TouchableOpacity>
      </View>

      {/* Raw Features Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Raw Features Data</Text>
        <Text style={styles.rawData}>{JSON.stringify(features, null, 2)}</Text>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  loading: {
    fontSize: theme.fontSizes.md,
    color: theme.text,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: theme.spacing.md,
  },
  errorContainer: {
    backgroundColor: theme.errorBackground,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.fontSizes.md,
    color: theme.errorText,
    marginBottom: theme.spacing.sm,
  },
  clearButton: {
    backgroundColor: theme.errorText,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  clearButtonText: {
    color: theme.background,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
  },
  section: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.cardBackground,
    borderRadius: theme.borderRadius.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.semibold,
    color: theme.text,
    marginBottom: theme.spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  featureLabel: {
    fontSize: theme.fontSizes.md,
    color: theme.text,
    flex: 1,
  },
  featureStatus: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.medium,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  enabled: {
    backgroundColor: theme.successBackground,
    color: theme.successText,
  },
  disabled: {
    backgroundColor: theme.errorBackground,
    color: theme.errorText,
  },
  infoText: {
    fontSize: theme.fontSizes.md,
    color: theme.text,
    marginBottom: theme.spacing.sm,
  },
  refreshButton: {
    backgroundColor: theme.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: theme.background,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.medium,
  },
  rawData: {
    fontSize: theme.fontSizes.sm,
    color: theme.textSecondary,
    fontFamily: 'monospace',
    backgroundColor: theme.background,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
});
