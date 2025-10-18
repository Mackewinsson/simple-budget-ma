import { fetchFeatureFlags, isFeatureEnabled, getUserType, getUserId } from '../api/featureFlags';
import { FeatureFlagsResponse, FeatureFlagServiceConfig } from '../types/featureFlags';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * FeatureFlagService class for advanced feature flag management
 * Provides a service-oriented approach for feature flag operations
 */
export class FeatureFlagService {
  private baseUrl: string;
  private features: Record<string, boolean> = {};
  private userType: 'free' | 'pro' | 'admin' | null = null;
  private userId: string | null = null;
  private lastFetch: number | null = null;
  private refreshInterval: number;
  private fallbackFeatures: Record<string, boolean>;
  private autoRefreshTimer: NodeJS.Timeout | null = null;

  constructor(config: FeatureFlagServiceConfig) {
    this.baseUrl = config.baseUrl;
    this.refreshInterval = config.refreshInterval;
    this.fallbackFeatures = config.fallbackFeatures;
  }

  /**
   * Fetch feature flags from the server
   * @param authToken - JWT authentication token
   * @returns Promise<FeatureFlagsResponse | null>
   */
  async fetchFeatures(authToken: string): Promise<FeatureFlagsResponse | null> {
    try {
      console.log('[FeatureFlagService] Fetching feature flags...');
      
      const response = await fetchFeatureFlags('mobile');
      
      if (response) {
        console.log('[FeatureFlagService] Feature flags fetched successfully:', response);
        
        // Update local state
        this.features = response.features;
        this.userType = response.userType;
        this.userId = response.userId;
        this.lastFetch = Date.now();
        
        // Store locally for offline use
        await this.storeLocally(response);
        
        return response;
      } else {
        throw new Error('No response received from feature flags API');
      }
    } catch (error: any) {
      console.error('[FeatureFlagService] Error fetching feature flags:', error);
      
      // Try to load from local storage as fallback
      const localData = await this.loadFromLocal();
      if (localData) {
        return localData;
      }
      
      // Use fallback features if all else fails
      this.features = this.fallbackFeatures;
      return null;
    }
  }

  /**
   * Check if a feature is enabled
   * @param featureKey - Key of the feature to check
   * @param fallback - Fallback value if feature is not found
   * @returns boolean
   */
  isFeatureEnabled(featureKey: string, fallback: boolean = false): boolean {
    return isFeatureEnabled(this.features, featureKey, fallback);
  }

  /**
   * Get user type
   * @returns User type or null
   */
  getUserType(): 'free' | 'pro' | 'admin' | null {
    return this.userType;
  }

  /**
   * Get user ID
   * @returns User ID or null
   */
  getUserId(): string | null {
    return this.userId;
  }

  /**
   * Get all features
   * @returns Features object
   */
  getFeatures(): Record<string, boolean> {
    return { ...this.features };
  }

  /**
   * Get last fetch timestamp
   * @returns Last fetch timestamp or null
   */
  getLastFetch(): number | null {
    return this.lastFetch;
  }

  /**
   * Check if data is stale (older than refresh interval)
   * @returns boolean indicating if data is stale
   */
  isDataStale(): boolean {
    if (!this.lastFetch) return true;
    return Date.now() - this.lastFetch > this.refreshInterval;
  }

  /**
   * Start auto-refresh of feature flags
   * @param authToken - JWT authentication token
   * @returns Cleanup function to stop auto-refresh
   */
  startAutoRefresh(authToken: string): () => void {
    console.log('[FeatureFlagService] Starting auto-refresh...');
    
    this.autoRefreshTimer = setInterval(async () => {
      console.log('[FeatureFlagService] Auto-refreshing feature flags...');
      await this.fetchFeatures(authToken);
    }, this.refreshInterval);

    // Return cleanup function
    return () => {
      console.log('[FeatureFlagService] Stopping auto-refresh...');
      if (this.autoRefreshTimer) {
        clearInterval(this.autoRefreshTimer);
        this.autoRefreshTimer = null;
      }
    };
  }

  /**
   * Stop auto-refresh
   */
  stopAutoRefresh(): void {
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer);
      this.autoRefreshTimer = null;
      console.log('[FeatureFlagService] Auto-refresh stopped');
    }
  }

  /**
   * Store feature flags locally for offline use
   * @param data - Feature flags response data
   */
  async storeLocally(data: FeatureFlagsResponse): Promise<void> {
    try {
      console.log('[FeatureFlagService] Storing feature flags locally...');
      await AsyncStorage.setItem('feature_flags', JSON.stringify(data));
      console.log('[FeatureFlagService] Feature flags stored locally successfully');
    } catch (error) {
      console.error('[FeatureFlagService] Error storing feature flags locally:', error);
    }
  }

  /**
   * Load feature flags from local storage
   * @returns Feature flags response or null
   */
  async loadFromLocal(): Promise<FeatureFlagsResponse | null> {
    try {
      console.log('[FeatureFlagService] Loading feature flags from local storage...');
      const stored = await AsyncStorage.getItem('feature_flags');
      
      if (stored) {
        const data: FeatureFlagsResponse = JSON.parse(stored);
        console.log('[FeatureFlagService] Loaded feature flags from local storage:', data);
        
        // Update local state
        this.features = data.features || this.fallbackFeatures;
        this.userType = data.userType || null;
        this.userId = data.userId || null;
        this.lastFetch = Date.now();
        
        return data;
      } else {
        console.log('[FeatureFlagService] No local feature flags found');
        return null;
      }
    } catch (error) {
      console.error('[FeatureFlagService] Error loading feature flags from local storage:', error);
      return null;
    }
  }

  /**
   * Clear local storage
   */
  async clearLocalStorage(): Promise<void> {
    try {
      await AsyncStorage.removeItem('feature_flags');
      console.log('[FeatureFlagService] Local storage cleared');
    } catch (error) {
      console.error('[FeatureFlagService] Error clearing local storage:', error);
    }
  }

  /**
   * Reset service state
   */
  reset(): void {
    this.features = this.fallbackFeatures;
    this.userType = null;
    this.userId = null;
    this.lastFetch = null;
    this.stopAutoRefresh();
    console.log('[FeatureFlagService] Service state reset');
  }
}

// Default configuration
const defaultConfig: FeatureFlagServiceConfig = {
  baseUrl: 'https://www.simple-budget.pro',
  refreshInterval: 30000, // 30 seconds
  fallbackFeatures: {
    new_dashboard: false,
    advanced_analytics: false,
    mobile_dark_mode: true,
    offline_sync: true,
    ai_assistant: false,
    premium_features: false,
    ai_budgeting: false,
    transaction_text_input: false,
    export_csv: true,
    manual_budget: true,
    unlimited_categories: true,
    priority_support: false,
    new_checkout_flow: false,
    mobile_offline_sync: true,
    pro_features: false,
    aa: true, // Test feature flag - set to true for testing
  },
};

// Export singleton instance
export const featureFlagService = new FeatureFlagService(defaultConfig);
