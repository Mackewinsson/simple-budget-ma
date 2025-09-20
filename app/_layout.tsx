import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { MobileAuthProvider } from "../src/auth/MobileAuthProvider";
import { queryClient } from "../src/query/queryClient";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <MobileAuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="auth/login" options={{ title: "Sign In" }} />
              <Stack.Screen name="debug-auth" options={{ title: "Debug Auth" }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </MobileAuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}