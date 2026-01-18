import client from './client';
import { FeatureFlagsResponse } from '../types/featureFlags';
import { ENV } from '../lib/env';

export interface FeatureFlagsRequest {
  platform: 'mobile' | 'web';
}

export interface FeatureFlagsError {
  error: string;
  status?: number;
}

/**
 * Fetch feature flags from the server
 * @param platform - Platform requesting feature flags ('mobile' or 'web')
 * @returns Promise<FeatureFlagsResponse | null>
 */
export const fetchFeatureFlags = async (
  platform: 'mobile' | 'web' = 'mobile'
): Promise<FeatureFlagsResponse | null> => {
  try {
    const timestamp = new Date().toISOString();
    console.log('=== FEATURE FLAGS API REQUEST ===');
    console.log('[FeatureFlags API] Timestamp:', timestamp);
    console.log('[FeatureFlags API] Fetching feature flags for platform:', platform);
    console.log('[FeatureFlags API] Base URL:', ENV.API_BASE_URL);
    console.log('[FeatureFlags API] Full URL:', `${ENV.API_BASE_URL}/api/features?platform=${platform}`);
    console.log('[FeatureFlags API] Request params:', { platform });
    console.log('[FeatureFlags API] Making API call...');
    
    const response = await client.get<FeatureFlagsResponse>('/api/features', {
      params: { platform }
    });
    
    // Enhanced logging for feature flags response
    const responseTimestamp = new Date().toISOString();
    console.log('=== FEATURE FLAGS API RESPONSE ===');
    console.log('[FeatureFlags API] Response timestamp:', responseTimestamp);
    console.log('[FeatureFlags API] Response status:', response.status);
    console.log('[FeatureFlags API] Response headers:', response.headers);
    console.log('[FeatureFlags API] Full response data:', JSON.stringify(response.data, null, 2));
    console.log('[FeatureFlags API] Features object:', response.data?.features);
    console.log('[FeatureFlags API] User type:', response.data?.userType);
    console.log('[FeatureFlags API] User ID:', response.data?.userId);
    console.log('[FeatureFlags API] Platform:', response.data?.platform);
    
    // Log specific feature flags for debugging
    if (response.data?.features) {
      console.log('[FeatureFlags API] Individual feature flags:');
      Object.entries(response.data.features).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
    }
    console.log('=== END FEATURE FLAGS API RESPONSE ===');
    
    return response.data;
  } catch (error: any) {
    console.error('=== FEATURE FLAGS API ERROR ===');
    console.error('[FeatureFlags API] Error fetching feature flags:', error);
    console.error('[FeatureFlags API] Error message:', error.message);
    console.error('[FeatureFlags API] Error code:', error.code);
    
    if (error.response) {
      console.error('[FeatureFlags API] Response status:', error.response.status);
      console.error('[FeatureFlags API] Response data:', error.response.data);
      console.error('[FeatureFlags API] Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('[FeatureFlags API] Request made but no response received:', error.request);
    } else {
      console.error('[FeatureFlags API] Error setting up request:', error.message);
    }
    console.error('=== END FEATURE FLAGS API ERROR ===');
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      console.log('[FeatureFlags API] Unauthorized - user not authenticated, using default features');
      // Return null instead of throwing - 401 is expected when not logged in
      return null;
    } else if (error.response?.status === 400) {
      console.log('[FeatureFlags API] Bad request - platform parameter required');
      throw new Error('Platform parameter is required');
    } else if (error.response?.status === 404) {
      console.log('[FeatureFlags API] User not found');
      throw new Error('User not found');
    } else if (error.response?.status >= 500) {
      console.log('[FeatureFlags API] Server error');
      throw new Error('Failed to get features');
    } else {
      // Network or other errors
      throw new Error('Network error - please check your connection');
    }
  }
};

/**
 * Check if a specific feature is enabled
 * @param features - Feature flags object
 * @param featureKey - Key of the feature to check
 * @param fallback - Fallback value if feature is not found
 * @returns boolean
 */
export const isFeatureEnabled = (
  features: Record<string, boolean>,
  featureKey: string,
  fallback: boolean = false
): boolean => {
  return features[featureKey] === true || fallback;
};

/**
 * Get user type from feature flags response
 * @param response - Feature flags response
 * @returns User type or null
 */
export const getUserType = (response: FeatureFlagsResponse | null): 'free' | 'pro' | 'admin' | null => {
  return response?.userType || null;
};

/**
 * Get user ID from feature flags response
 * @param response - Feature flags response
 * @returns User ID or null
 */
export const getUserId = (response: FeatureFlagsResponse | null): string | null => {
  return response?.userId || null;
};
