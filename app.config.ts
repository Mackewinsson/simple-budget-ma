import type { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "budgeting-mobile",
  slug: "budgeting-mobile",
  scheme: "budgetingmobile", // Use the original scheme that was working
  extra: {
    API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000", // Updated to match Next.js server
    GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET || "",
  },
});