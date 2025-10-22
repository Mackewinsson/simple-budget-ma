import type { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "PresuSimple",
  slug: "presusimple",
  owner: "mackewinsson",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  scheme: "presusimple",
  privacy: "public",
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
    API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000",
    GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET || "",
    GOOGLE_EXPO_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID || "",
    GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "",
    GOOGLE_ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "",
    GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "",
    EXPO_PROJECT_NAME_FOR_PROXY: process.env.EXPO_PUBLIC_PROJECT_NAME_FOR_PROXY || "@mackewinsson/presusimple",
    eas: {
      projectId: "77abe935-0d1a-42ea-bae4-470f978f8d3b"
    }
  },
});