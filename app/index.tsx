import React from 'react';
import { Redirect } from "expo-router";
import { useAuth } from "../src/auth/MobileAuthProvider";
import LoadingScreen from "../components/LoadingScreen";

export default function Index() {
  const { session, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !session) {
    return <Redirect href="/debug-auth" />; // Temporarily redirect to debug screen
  }

  return <Redirect href="/(tabs)/budgets" />;
}