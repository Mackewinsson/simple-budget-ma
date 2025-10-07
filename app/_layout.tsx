import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../src/query/queryClient";
import GlobalLoadingIndicator from "../components/GlobalLoadingIndicator";
import { ThemeProvider, useTheme } from "../src/theme/ThemeContext";

function RootLayoutContent() {
  const { theme } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.background }
          }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ title: "Sign In" }} />
            <Stack.Screen name="test" options={{ title: "Test" }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <GlobalLoadingIndicator />
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