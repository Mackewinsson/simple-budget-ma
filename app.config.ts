import type { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Simple Budget",
  slug: "budgeting-mobile",
  owner: "mackewinsson",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  scheme: "budgetingmobile",
  privacy: "public",
  description: "A simple and intuitive budgeting app to help you manage your finances.",
  
  ios: {
    bundleIdentifier: "com.mackewinsson.budgetingmobile",
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
    package: "com.mackewinsson.budgetingmobile",
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
    API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000",
    GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET || "",
    GOOGLE_EXPO_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID || "",
    GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "",
    GOOGLE_ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "",
    GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "",
    EXPO_PROJECT_NAME_FOR_PROXY: process.env.EXPO_PUBLIC_PROJECT_NAME_FOR_PROXY || "@mackewinsson/simple-budget",
    REVENUECAT_API_KEY_IOS: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS || "",
    eas: {
      projectId: "e4ba31e1-acfd-4050-bf55-a26bdd9f5c86"
    }
  },
});