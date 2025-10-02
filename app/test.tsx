import React from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useAuthStore } from "../src/store/authStore";
import { useSafeAreaStyles } from "../src/hooks/useSafeAreaStyles";
import { useRouter } from "expo-router";

export default function TestScreen() {
  const { session, signOut, isAuthenticated } = useAuthStore();
  const safeAreaStyles = useSafeAreaStyles();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('[TestScreen] Sign out successful, redirecting to login');
      router.replace('/auth/login');
    } catch (error) {
      console.error('[TestScreen] Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return (
    <View style={safeAreaStyles.containerWithBottomPadding}>
      <View style={styles.container}>
      <Text style={styles.title}>Test Screen</Text>
      <Text style={styles.subtitle}>If you can see this, the app is working!</Text>
      
      <View style={styles.authSection}>
        <Text style={styles.sectionTitle}>Authentication Status</Text>
        <Text style={styles.statusText}>
          Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
        </Text>
        
        {session && (
          <>
            <Text style={styles.userInfo}>Email: {session.user.email}</Text>
            <Text style={styles.userInfo}>ID: {session.user.id}</Text>
            {session.user.name && (
              <Text style={styles.userInfo}>Name: {session.user.name}</Text>
            )}
            {session.user.plan && (
              <Text style={styles.userInfo}>Plan: {session.user.plan}</Text>
            )}
            {session.user.isPaid !== undefined && (
              <Text style={styles.userInfo}>Paid: {session.user.isPaid ? 'Yes' : 'No'}</Text>
            )}
          </>
        )}
        
        {isAuthenticated && (
          <Pressable style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </Pressable>
        )}
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 40,
  },
  authSection: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  statusText: {
    fontSize: 16,
    color: "#4ade80",
    marginBottom: 12,
    textAlign: "center",
  },
  userInfo: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
