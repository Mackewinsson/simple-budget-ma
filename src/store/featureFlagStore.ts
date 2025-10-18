import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchFeatureFlags, isFeatureEnabled, getUserType, getUserId } from '../api/featureFlags';
import { FeatureFlagStore, FeatureFlagsResponse } from '../types/featureFlags';

// Custom storage for AsyncStorage (non-sensitive data)
const asyncStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(name);
    } catch (error) {
      console.error('[FeatureFlagStore] Error getting item from async storage:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      console.error('[FeatureFlagStore] Error setting item in async storage:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      console.error('[FeatureFlagStore] Error removing item from async storage:', error);
    }
  },
};

// Default fallback features for offline use
const DEFAULT_FEATURES: Record<string, boolean> = {
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
  aa: false, // Test feature flag - set to false for testing
};

export const useFeatureFlagStore = create<FeatureFlagStore>()(
  persist(
    (set, get) => ({
      // State
      features: DEFAULT_FEATURES,
      userType: null,
      userId: null,
      lastFetch: null,
      loading: false,
      error: null,

      // Actions
      fetchFeatures: async (authToken: string): Promise<FeatureFlagsResponse | null> => {
        try {
          console.log('[FeatureFlagStore] Fetching feature flags...');
          console.log('[FeatureFlagStore] Auth token provided:', !!authToken);
          console.log('[FeatureFlagStore] Auth token length:', authToken?.length || 0);
          set({ loading: true, error: null });

          const response = await fetchFeatureFlags('mobile');
          
          if (response) {
            console.log('[FeatureFlagStore] Feature flags fetched successfully:', response);
            console.log('[FeatureFlagStore] AA feature flag from API:', response.features.aa);
            
            // Update state
            set({
              features: response.features,
              userType: response.userType,
              userId: response.userId,
              lastFetch: Date.now(),
              loading: false,
              error: null,
            });

            // Store locally for offline use
            await get().storeLocally(response);
            
            console.log('[FeatureFlagStore] State updated, AA feature flag now:', get().features.aa);
            
            return response;
          } else {
            throw new Error('No response received from feature flags API');
          }
        } catch (error: any) {
          console.error('[FeatureFlagStore] Error fetching feature flags:', error);
          
          const errorMessage = error.message || 'Failed to fetch feature flags';
          set({ 
            loading: false, 
            error: errorMessage 
          });

          // Try to load from local storage as fallback
          await get().loadFromLocal();
          
          return null;
        }
      },

      isFeatureEnabled: (featureKey: string, fallback: boolean = false): boolean => {
        const { features } = get();
        return isFeatureEnabled(features, featureKey, fallback);
      },

      getUserType: (): 'free' | 'pro' | 'admin' | null => {
        return get().userType;
      },

      getUserId: (): string | null => {
        return get().userId;
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      startAutoRefresh: (authToken: string) => {
        const refreshInterval = 30000; // 30 seconds
        
        const intervalId = setInterval(async () => {
          console.log('[FeatureFlagStore] Auto-refreshing feature flags...');
          await get().fetchFeatures(authToken);
        }, refreshInterval);

        // Return cleanup function
        return () => {
          console.log('[FeatureFlagStore] Stopping auto-refresh');
          clearInterval(intervalId);
        };
      },

      stopAutoRefresh: () => {
        // This will be handled by the cleanup function returned from startAutoRefresh
        console.log('[FeatureFlagStore] Auto-refresh stop requested');
      },

      loadFromLocal: async (): Promise<void> => {
        try {
          console.log('[FeatureFlagStore] Loading feature flags from local storage...');
          const stored = await AsyncStorage.getItem('feature_flags');
          
          if (stored) {
            const data: FeatureFlagsResponse = JSON.parse(stored);
            console.log('[FeatureFlagStore] Loaded feature flags from local storage:', data);
            console.log('[FeatureFlagStore] AA feature flag from local storage:', data.features?.aa);
            
            set({
              features: data.features || DEFAULT_FEATURES,
              userType: data.userType || null,
              userId: data.userId || null,
              lastFetch: Date.now(),
            });
            
            console.log('[FeatureFlagStore] Local storage loaded, AA feature flag now:', get().features.aa);
          } else {
            console.log('[FeatureFlagStore] No local feature flags found, using defaults');
            set({
              features: DEFAULT_FEATURES,
              userType: null,
              userId: null,
              lastFetch: null,
            });
          }
        } catch (error) {
          console.error('[FeatureFlagStore] Error loading feature flags from local storage:', error);
          set({
            features: DEFAULT_FEATURES,
            userType: null,
            userId: null,
            lastFetch: null,
          });
        }
      },

      storeLocally: async (data: FeatureFlagsResponse): Promise<void> => {
        try {
          console.log('[FeatureFlagStore] Storing feature flags locally...');
          await AsyncStorage.setItem('feature_flags', JSON.stringify(data));
          console.log('[FeatureFlagStore] Feature flags stored locally successfully');
        } catch (error) {
          console.error('[FeatureFlagStore] Error storing feature flags locally:', error);
        }
      },
    }),
    {
      name: 'feature-flag-storage',
      storage: createJSONStorage(() => asyncStorage),
      partialize: (state) => ({
        features: state.features,
        userType: state.userType,
        userId: state.userId,
        lastFetch: state.lastFetch,
      }),
    }
  )
);
