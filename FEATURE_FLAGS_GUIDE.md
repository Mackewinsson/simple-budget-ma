# Feature Flags Implementation Guide

This guide explains how to use the feature flag system implemented in the budgeting mobile app. The system allows for dynamic feature control, A/B testing, and gradual rollouts without requiring app updates.

## Overview

The feature flag system consists of several components:

1. **API Integration** (`src/api/featureFlags.ts`) - Handles communication with the feature flags API
2. **Zustand Store** (`src/store/featureFlagStore.ts`) - Manages feature flag state
3. **React Hooks** (`src/hooks/useFeatureFlags.ts`) - Provides easy access to feature flags in components
4. **Service Class** (`src/lib/featureFlagService.ts`) - Advanced feature flag management
5. **TypeScript Types** (`src/types/featureFlags.ts`) - Type definitions

## Quick Start

### Basic Usage in Components

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { useFeatureFlags } from '../src/hooks/useFeatureFlags';

export default function MyComponent() {
  const { isNewDashboardEnabled, isAiAssistantEnabled, isProUser } = useFeatureFlags();

  return (
    <View>
      {/* Conditional rendering based on feature flags */}
      {isNewDashboardEnabled() ? (
        <NewDashboard />
      ) : (
        <OldDashboard />
      )}
      
      {/* Show premium features only if enabled */}
      {isAiAssistantEnabled() && (
        <AiAssistant />
      )}
      
      {/* User type based features */}
      {isProUser() && (
        <ProOnlyFeatures />
      )}
    </View>
  );
}
```

### Using Specific Feature Flags

```typescript
import { useFeatureFlag } from '../src/hooks/useFeatureFlags';
import { FEATURE_FLAG_KEYS } from '../src/types/featureFlags';

export default function AnotherComponent() {
  const isNewFeatureEnabled = useFeatureFlag(FEATURE_FLAG_KEYS.NEW_FEATURE, false);
  
  return (
    <View>
      {isNewFeatureEnabled && <NewFeatureComponent />}
    </View>
  );
}
```

### Using Pro Access Hook

```typescript
import { useProAccess } from '../src/hooks/useFeatureFlags';

export default function ProComponent() {
  const hasProAccess = useProAccess();
  
  return (
    <View>
      {hasProAccess ? (
        <ProFeatures />
      ) : (
        <UpgradePrompt />
      )}
    </View>
  );
}
```

## Available Feature Flags

The following feature flags are available in the system:

| Feature Flag Key | Description | Default Value |
|------------------|-------------|---------------|
| `new_dashboard` | New dashboard design | `false` |
| `advanced_analytics` | Advanced analytics features | `false` |
| `mobile_dark_mode` | Mobile dark mode support | `true` |
| `offline_sync` | Offline synchronization | `true` |
| `ai_assistant` | AI assistant features | `false` |
| `premium_features` | Premium feature access | `false` |
| `ai_budgeting` | AI-powered budget creation | `false` |
| `transaction_text_input` | Text-to-transaction input | `false` |
| `export_csv` | CSV export functionality | `true` |
| `manual_budget` | Manual budget creation | `true` |
| `unlimited_categories` | Unlimited budget categories | `true` |
| `priority_support` | Priority customer support | `false` |
| `new_checkout_flow` | New checkout flow design | `false` |
| `mobile_offline_sync` | Mobile-specific offline sync | `true` |
| `pro_features` | Pro user features | `false` |

## Hook Reference

### `useFeatureFlags()`

The main hook that provides access to all feature flag functionality.

**Returns:**
- `isFeatureEnabled(featureKey, fallback)` - Check if a specific feature is enabled
- `isNewDashboardEnabled()` - Check if new dashboard is enabled
- `isAdvancedAnalyticsEnabled()` - Check if advanced analytics is enabled
- `isMobileDarkModeEnabled()` - Check if mobile dark mode is enabled
- `isOfflineSyncEnabled()` - Check if offline sync is enabled
- `isAiAssistantEnabled()` - Check if AI assistant is enabled
- `isPremiumFeaturesEnabled()` - Check if premium features are enabled
- `isAiBudgetingEnabled()` - Check if AI budgeting is enabled
- `isTransactionTextInputEnabled()` - Check if transaction text input is enabled
- `isExportCsvEnabled()` - Check if CSV export is enabled
- `isManualBudgetEnabled()` - Check if manual budget is enabled
- `isUnlimitedCategoriesEnabled()` - Check if unlimited categories is enabled
- `isPrioritySupportEnabled()` - Check if priority support is enabled
- `isNewCheckoutFlowEnabled()` - Check if new checkout flow is enabled
- `isMobileOfflineSyncEnabled()` - Check if mobile offline sync is enabled
- `isProFeaturesEnabled()` - Check if pro features are enabled
- `getUserType()` - Get user type ('free', 'pro', 'admin')
- `getUserId()` - Get user ID
- `isProUser()` - Check if user is pro
- `isFreeUser()` - Check if user is free
- `isAdminUser()` - Check if user is admin
- `loading` - Loading state
- `error` - Error state
- `features` - Raw features object
- `lastFetch` - Last fetch timestamp
- `refreshFeatures()` - Manually refresh feature flags
- `clearError()` - Clear error state

### `useFeatureFlag(featureKey, fallback)`

Check a specific feature flag.

**Parameters:**
- `featureKey` - The feature flag key to check
- `fallback` - Fallback value if feature is not found (default: `false`)

**Returns:** `boolean` - Whether the feature is enabled

### `useProAccess()`

Check if user has pro access (combines feature flags and user type).

**Returns:** `boolean` - Whether user has pro access

## Backward Compatibility

The existing `useFeatureAccess` hook has been updated to work with the new feature flag system while maintaining backward compatibility.

```typescript
import { useFeatureAccess } from '../src/hooks/useFeatureAccess';

export default function LegacyComponent() {
  const { hasAccess, showUpgradeModal, isFeatureFlagEnabled, isProUser } = useFeatureAccess('aiBudgeting');
  
  return (
    <View>
      {hasAccess ? (
        <AiBudgetingFeature />
      ) : (
        <TouchableOpacity onPress={showUpgradeModal}>
          <Text>Upgrade to Pro</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
```

## Advanced Usage

### Using the Service Class

For advanced scenarios, you can use the `FeatureFlagService` class directly:

```typescript
import { featureFlagService } from '../src/lib/featureFlagService';

// Initialize and fetch features
const response = await featureFlagService.fetchFeatures(authToken);

// Check features
const isEnabled = featureFlagService.isFeatureEnabled('new_dashboard', false);

// Get user info
const userType = featureFlagService.getUserType();
const userId = featureFlagService.getUserId();

// Start auto-refresh
const cleanup = featureFlagService.startAutoRefresh(authToken);

// Stop auto-refresh
cleanup();
```

### Manual Store Access

You can also access the Zustand store directly:

```typescript
import { useFeatureFlagStore } from '../src/store/featureFlagStore';

export default function AdvancedComponent() {
  const { features, fetchFeatures, isFeatureEnabled } = useFeatureFlagStore();
  
  // Use store methods directly
  const isEnabled = isFeatureEnabled('new_feature', false);
  
  return (
    <View>
      {/* Component content */}
    </View>
  );
}
```

## Error Handling

The system includes comprehensive error handling:

```typescript
import { useFeatureFlags } from '../src/hooks/useFeatureFlags';

export default function ErrorHandlingComponent() {
  const { loading, error, clearError, refreshFeatures } = useFeatureFlags();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
        <TouchableOpacity onPress={clearError}>
          <Text>Clear Error</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={refreshFeatures}>
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return <MainContent />;
}
```

## Offline Support

The system automatically stores feature flags locally and provides fallback values when offline:

- Feature flags are cached in AsyncStorage
- Fallback values are used when API is unavailable
- Local storage is automatically loaded on app startup
- Auto-refresh continues when connection is restored

## Best Practices

### 1. Use Specific Hooks When Possible

```typescript
// Good - specific and clear
const { isNewDashboardEnabled } = useFeatureFlags();
if (isNewDashboardEnabled()) {
  // Show new dashboard
}

// Also good - for one-off checks
const isEnabled = useFeatureFlag(FEATURE_FLAG_KEYS.NEW_DASHBOARD, false);
```

### 2. Provide Fallback Values

```typescript
// Always provide sensible fallbacks
const isEnabled = useFeatureFlag('new_feature', false); // Default to false for new features
const isEnabled = useFeatureFlag('existing_feature', true); // Default to true for existing features
```

### 3. Handle Loading States

```typescript
const { loading, isNewFeatureEnabled } = useFeatureFlags();

if (loading) {
  return <LoadingSpinner />;
}

return (
  <View>
    {isNewFeatureEnabled() && <NewFeature />}
  </View>
);
```

### 4. Use Feature Flags for A/B Testing

```typescript
const { isNewCheckoutFlowEnabled } = useFeatureFlags();

return (
  <View>
    {isNewCheckoutFlowEnabled() ? (
      <NewCheckoutFlow />
    ) : (
      <OldCheckoutFlow />
    )}
  </View>
);
```

### 5. Combine with User Type Checks

```typescript
const { isProUser, isPremiumFeaturesEnabled } = useFeatureFlags();

const showPremiumFeatures = isProUser() || isPremiumFeaturesEnabled();

return (
  <View>
    {showPremiumFeatures && <PremiumFeatures />}
  </View>
);
```

## Debugging

### Enable Debug Logging

The system includes comprehensive logging. In development mode, you can see:

- Feature flag fetch requests and responses
- Local storage operations
- Auto-refresh activities
- Error conditions

### Check Feature Flag Status

Use the `FeatureFlagExample` component to see all feature flags and their current values:

```typescript
import FeatureFlagExample from '../components/FeatureFlagExample';

// Add to your app for debugging
<FeatureFlagExample />
```

### Manual Testing

You can manually test feature flags by:

1. Checking the raw features object: `console.log(features)`
2. Verifying user type: `console.log(getUserType())`
3. Testing specific flags: `console.log(isFeatureEnabled('new_dashboard'))`

## API Integration

The system integrates with the feature flags API endpoint:

- **Endpoint**: `GET /api/features?platform=mobile`
- **Authentication**: JWT Bearer token
- **Response**: JSON with features, userType, platform, and userId
- **Error Handling**: Comprehensive error handling with fallbacks

## Performance Considerations

- Feature flags are cached locally for offline use
- Auto-refresh runs every 30 seconds (configurable)
- Zustand store provides efficient state management
- Hooks are optimized to prevent unnecessary re-renders

## Migration Guide

If you're migrating from the old feature access system:

1. **Replace `useFeatureAccess` calls** with `useFeatureFlags` where appropriate
2. **Update feature checks** to use the new hook methods
3. **Add fallback values** for better offline experience
4. **Test thoroughly** to ensure all features work as expected

The old `useFeatureAccess` hook continues to work and has been enhanced to use feature flags while maintaining backward compatibility.

## Troubleshooting

### Common Issues

1. **Feature flags not loading**: Check authentication and network connection
2. **Features not showing**: Verify feature flag keys and fallback values
3. **Auto-refresh not working**: Ensure the hook is properly mounted
4. **Offline issues**: Check local storage permissions

### Debug Steps

1. Check console logs for API requests and responses
2. Verify authentication token is valid
3. Test with the `FeatureFlagExample` component
4. Check network connectivity
5. Verify feature flag configuration on the server

## Support

For issues or questions about the feature flag system:

1. Check the console logs for error messages
2. Use the `FeatureFlagExample` component for debugging
3. Verify API endpoint configuration
4. Check authentication and user permissions
5. Review the feature flag configuration on the server
