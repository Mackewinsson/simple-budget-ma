import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../src/query/queryClient";
import GlobalLoadingIndicator from "../components/GlobalLoadingIndicator";
import { ThemeProvider, useTheme } from "../src/theme/ThemeContext";
import { useBackgroundSync } from "../src/hooks/useBackgroundSync";
import UpgradeModal from "../components/UpgradeModal";
import RevenueCatProvider from "../components/RevenueCatProvider";

function AppContent() {
  // Initialize background sync inside QueryClientProvider
  useBackgroundSync();

  return (
    <>
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ title: "Sign In" }} />
        <Stack.Screen name="test" options={{ title: "Test" }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="upgrade" options={{ title: "Upgrade to Pro" }} />
      </Stack>
      <GlobalLoadingIndicator />
      <UpgradeModal />
    </>
  );
}

function RootLayoutContent() {
  const { theme } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <RevenueCatProvider>
            <AppContent />
          </RevenueCatProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}