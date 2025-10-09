import React, { useEffect } from 'react';
import { useRouter } from "expo-router";
import { useAuthStore } from "../src/store/authStore";
import LoadingScreen from "../components/LoadingScreen";

export default function Index() {
  const { session, loading, isAuthenticated, loadSession } = useAuthStore();
  const router = useRouter();

  console.log('[Index] Auth state:', { loading, isAuthenticated, hasSession: !!session });

  // Load session on app start
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Use useEffect to handle navigation programmatically
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !session) {
        console.log('[Index] Not authenticated, navigating to login');
        router.replace('/auth/login');
      } else {
        console.log('[Index] Authenticated, navigating to main app');
        // Add a small delay to ensure state is fully updated
        setTimeout(() => {
          router.replace('/(tabs)/transactions');
        }, 100);
      }
    }
  }, [loading, isAuthenticated, session, router]);

  if (loading) {
    console.log('[Index] Still loading, showing loading screen');
    return <LoadingScreen />;
  }

  // Show loading while navigation is happening
  return <LoadingScreen />;
}