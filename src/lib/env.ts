import Constants from "expo-constants";

export const ENV = {
  API_BASE_URL: (Constants.expoConfig?.extra as any)?.API_BASE_URL as string || "https://www.presusimple.com",
};
