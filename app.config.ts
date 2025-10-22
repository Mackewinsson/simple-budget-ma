import type { ConfigContext, ExpoConfig } from "@expo/config";

// Get environment from process.env or default to development
const ENV = process.env.EXPO_PUBLIC_ENV || "development";

// Environment-specific configurations
const getEnvironmentConfig = (env: string) => {
  const baseConfig = {
    name: "PresuSimple",
    slug: "presusimple",
    owner: "mackewinsson",
    version: "1.0.0",
    orientation: "portrait" as const,
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic" as const,
    scheme: "presusimple",
    privacy: "public" as const,
    description: "A simple and intuitive budgeting app to help you manage your finances.",
  };

  // Environment-specific overrides
  switch (env) {
    case "production":
      return {
        ...baseConfig,
        name: "PresuSimple",
        // Production-specific overrides can go here
      };
    case "staging":
      return {
        ...baseConfig,
        name: "PresuSimple (Staging)",
        // Staging-specific overrides can go here
      };
    case "development":
    default:
      return {
        ...baseConfig,
        name: "PresuSimple (Dev)",
        // Development-specific overrides can go here
      };
  }
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const envConfig = getEnvironmentConfig(ENV);
  
  return {
    ...config,
    ...envConfig,
    
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
      // Environment variables
      ENV,
      API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000",
      GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "",
      GOOGLE_CLIENT_SECRET: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET || "",
      GOOGLE_EXPO_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID || "",
      GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "",
      GOOGLE_ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "",
      GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "",
      FEATURE_FLAGS_URL: process.env.EXPO_PUBLIC_FEATURE_FLAGS_URL || "http://localhost:3000/api/feature-flags",
      ANALYTICS_ENABLED: process.env.EXPO_PUBLIC_ANALYTICS_ENABLED === "true",
      ANALYTICS_DEBUG: process.env.EXPO_PUBLIC_ANALYTICS_DEBUG === "true",
      DEBUG_MODE: process.env.EXPO_PUBLIC_DEBUG_MODE === "true",
      LOG_LEVEL: process.env.EXPO_PUBLIC_LOG_LEVEL || "info",
      EXPO_PROJECT_NAME_FOR_PROXY: process.env.EXPO_PUBLIC_PROJECT_NAME_FOR_PROXY || "@mackewinsson/presusimple",
      eas: {
        projectId: "77abe935-0d1a-42ea-bae4-470f978f8d3b"
      }
    },
  };
};