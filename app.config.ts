import type { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "budgeting-mobile",
  slug: "budgeting-mobile",
  scheme: "budgetingmobile", // Use the original scheme that was working
  extra: {
    API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.1.69:3001", // Use your local IP or Vercel URL
    GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET || "",
    // Platform-specific Google OAuth client IDs (optional but recommended)
    GOOGLE_EXPO_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID || "",
    GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "",
    GOOGLE_ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "",
    GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "",
    // Optional: lock Expo proxy project name to avoid mismatched redirect (owner/slug)
    EXPO_PROJECT_NAME_FOR_PROXY: process.env.EXPO_PUBLIC_PROJECT_NAME_FOR_PROXY || "@mackewinsson/simple-budget",
  },
});