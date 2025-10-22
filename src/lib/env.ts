import Constants from "expo-constants";

// Type-safe environment configuration
export interface EnvironmentConfig {
  ENV: string;
  API_BASE_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_EXPO_CLIENT_ID: string;
  GOOGLE_IOS_CLIENT_ID: string;
  GOOGLE_ANDROID_CLIENT_ID: string;
  GOOGLE_WEB_CLIENT_ID: string;
  FEATURE_FLAGS_URL: string;
  ANALYTICS_ENABLED: boolean;
  ANALYTICS_DEBUG: boolean;
  DEBUG_MODE: boolean;
  LOG_LEVEL: string;
}

// Get environment configuration from Expo Constants
const getEnvConfig = (): EnvironmentConfig => {
  const extra = Constants.expoConfig?.extra as any;
  
  return {
    ENV: extra?.ENV || "development",
    API_BASE_URL: extra?.API_BASE_URL || "http://localhost:3000",
    GOOGLE_CLIENT_ID: extra?.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: extra?.GOOGLE_CLIENT_SECRET || "",
    GOOGLE_EXPO_CLIENT_ID: extra?.GOOGLE_EXPO_CLIENT_ID || "",
    GOOGLE_IOS_CLIENT_ID: extra?.GOOGLE_IOS_CLIENT_ID || "",
    GOOGLE_ANDROID_CLIENT_ID: extra?.GOOGLE_ANDROID_CLIENT_ID || "",
    GOOGLE_WEB_CLIENT_ID: extra?.GOOGLE_WEB_CLIENT_ID || "",
    FEATURE_FLAGS_URL: extra?.FEATURE_FLAGS_URL || "http://localhost:3000/api/feature-flags",
    ANALYTICS_ENABLED: extra?.ANALYTICS_ENABLED || false,
    ANALYTICS_DEBUG: extra?.ANALYTICS_DEBUG || false,
    DEBUG_MODE: extra?.DEBUG_MODE || false,
    LOG_LEVEL: extra?.LOG_LEVEL || "info",
  };
};

// Export the environment configuration
export const ENV = getEnvConfig();

// Environment validation
export const validateEnvironment = (): void => {
  const requiredVars = [
    'API_BASE_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_EXPO_CLIENT_ID',
  ];

  const missingVars = requiredVars.filter(varName => {
    const value = ENV[varName as keyof EnvironmentConfig];
    return !value || value === '';
  });

  if (missingVars.length > 0 && ENV.ENV === 'production') {
    console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

// Environment-specific utilities
export const isDevelopment = (): boolean => ENV.ENV === 'development';
export const isStaging = (): boolean => ENV.ENV === 'staging';
export const isProduction = (): boolean => ENV.ENV === 'production';

// Log environment info in development
if (isDevelopment()) {
  console.log('🔧 Environment Configuration:', {
    ENV: ENV.ENV,
    API_BASE_URL: ENV.API_BASE_URL,
    DEBUG_MODE: ENV.DEBUG_MODE,
    LOG_LEVEL: ENV.LOG_LEVEL,
  });
}
