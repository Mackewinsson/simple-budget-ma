import type { ConfigContext, ExpoConfig } from "@expo/config";

// Get environment from process.env or default to development
const ENV = process.env.EXPO_PUBLIC_ENV || "development";

// ============================================
// ENVIRONMENT-SPECIFIC CONFIGURATION
// URLs are defined here, secrets in .env.local
// ============================================
const ENVIRONMENT_CONFIG = {
  development: {
    name: "PresuSimple (Dev)",
    apiBaseUrl: "http://localhost:3000",
    analyticsEnabled: false,
    analyticsDebug: true,
    debugMode: true,
    logLevel: "debug",
  },
  staging: {
    name: "PresuSimple (Staging)",
    apiBaseUrl: "https://www.presusimple.com", // Same as prod for now
    analyticsEnabled: true,
    analyticsDebug: false,
    debugMode: false,
    logLevel: "warn",
  },
  production: {
    name: "PresuSimple",
    apiBaseUrl: "https://www.presusimple.com",
    analyticsEnabled: true,
    analyticsDebug: false,
    debugMode: false,
    logLevel: "error",
  },
} as const;

type EnvironmentKey = keyof typeof ENVIRONMENT_CONFIG;

const getEnvironmentConfig = (env: string) => {
  const envKey = (env in ENVIRONMENT_CONFIG ? env : "development") as EnvironmentKey;
  return ENVIRONMENT_CONFIG[envKey];
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const envConfig = getEnvironmentConfig(ENV);
  
  // Allow env var override for API URL (useful for testing)
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || envConfig.apiBaseUrl;
  const featureFlagsUrl = process.env.EXPO_PUBLIC_FEATURE_FLAGS_URL || `${apiBaseUrl}/api/feature-flags`;
  
  return {
    ...config,
    name: envConfig.name,
    slug: "presusimple",
    owner: "mackewinsson",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    scheme: "presusimple",
    description: "A simple and intuitive budgeting app to help you manage your finances.",
    
    ios: {
      bundleIdentifier: "com.presusimple.app",
      supportsTablet: true,
      buildNumber: "1",
      infoPlist: {
        NSUserTrackingUsageDescription: "We use tracking to provide you with personalized features and improve your experience.",
        ITSAppUsesNonExemptEncryption: false,
        NSCameraUsageDescription: "This app does not use the camera.",
        NSPhotoLibraryUsageDescription: "This app does not access your photo library.",
        NSLocationWhenInUseUsageDescription: "This app does not use your location."
      }
    },

    android: {
      package: "com.presusimple.app",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },

    plugins: [
      "expo-secure-store",
      "expo-dev-client"
    ],
    
    extra: {
      // Environment
      ENV,
      
      // API URLs (from environment config, can be overridden via env var)
      API_BASE_URL: apiBaseUrl,
      FEATURE_FLAGS_URL: featureFlagsUrl,
      
      // Google OAuth (from .env.local - secrets)
      GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "",
      GOOGLE_CLIENT_SECRET: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET || "",
      GOOGLE_EXPO_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID || "",
      GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "",
      GOOGLE_ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "",
      GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "",
      
      // Environment-specific settings (from config above)
      ANALYTICS_ENABLED: envConfig.analyticsEnabled,
      ANALYTICS_DEBUG: envConfig.analyticsDebug,
      DEBUG_MODE: envConfig.debugMode,
      LOG_LEVEL: envConfig.logLevel,
      
      // EAS
      EXPO_PROJECT_NAME_FOR_PROXY: process.env.EXPO_PUBLIC_PROJECT_NAME_FOR_PROXY || "@mackewinsson/presusimple",
      eas: {
        projectId: "77abe935-0d1a-42ea-bae4-470f978f8d3b"
      }
    },
  };
};
