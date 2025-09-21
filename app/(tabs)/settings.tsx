import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert, ScrollView, Switch } from "react-native";
import { useUserCurrency, useUpdateUserCurrency } from "../../src/api/hooks/useUsers";
import { useAuthStore } from "../../src/store/authStore";
import { useRouter } from "expo-router";

function SettingsScreenContent() {
  const { session, signOut } = useAuthStore();
  const { data: currency } = useUserCurrency();
  const updateCurrency = useUpdateUserCurrency();
  const router = useRouter();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive", 
          onPress: async () => {
            try {
              await signOut();
              console.log('[Settings] Sign out successful, redirecting to login');
              router.replace('/auth/login');
            } catch (error) {
              console.error('[Settings] Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        },
      ]
    );
  };

  const handleCurrencyChange = (newCurrency: string) => {
    updateCurrency.mutate(newCurrency);
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all your budgets, categories, and expenses. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear Data", 
          style: "destructive", 
          onPress: () => {
            Alert.alert("Feature Coming Soon", "Data clearing will be available in a future update.");
          }
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      "Export Data",
      "Export your budget data to a file.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Export", 
          onPress: () => {
            Alert.alert("Feature Coming Soon", "Data export will be available in a future update.");
          }
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      "About Simple Budget Mobile",
      "Version 1.0.0\n\nA mobile companion to your Simple Budget web app. All data is synced with your web account.\n\nBuilt with React Native and Expo.",
      [{ text: "OK" }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Name</Text>
          <Text style={styles.settingValue}>{session?.user?.name || "Loading..."}</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Email</Text>
          <Text style={styles.settingValue}>{session?.user?.email || "Loading..."}</Text>
        </View>
        <Pressable style={[styles.button, styles.signOutButton]} onPress={handleSignOut}>
          <Text style={[styles.buttonText, styles.signOutButtonText]}>Sign Out</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Currency</Text>
          <View style={styles.currencyContainer}>
            <Pressable 
              style={[styles.currencyButton, currency === "USD" && styles.currencyButtonActive]}
              onPress={() => handleCurrencyChange("USD")}
            >
              <Text style={[styles.currencyButtonText, currency === "USD" && styles.currencyButtonTextActive]}>
                USD
              </Text>
            </Pressable>
            <Pressable 
              style={[styles.currencyButton, currency === "EUR" && styles.currencyButtonActive]}
              onPress={() => handleCurrencyChange("EUR")}
            >
              <Text style={[styles.currencyButtonText, currency === "EUR" && styles.currencyButtonTextActive]}>
                EUR
              </Text>
            </Pressable>
            <Pressable 
              style={[styles.currencyButton, currency === "GBP" && styles.currencyButtonActive]}
              onPress={() => handleCurrencyChange("GBP")}
            >
              <Text style={[styles.currencyButtonText, currency === "GBP" && styles.currencyButtonTextActive]}>
                GBP
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#333", true: "#4ade80" }}
            thumbColor={notificationsEnabled ? "#fff" : "#888"}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: "#333", true: "#4ade80" }}
            thumbColor={darkModeEnabled ? "#fff" : "#888"}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <Pressable style={[styles.button, styles.exportButton]} onPress={handleExportData}>
          <Text style={styles.buttonText}>Export Data</Text>
        </Pressable>
        
        <Pressable style={[styles.button, styles.clearButton]} onPress={handleClearData}>
          <Text style={[styles.buttonText, styles.clearButtonText]}>Clear All Data</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <Pressable style={styles.button} onPress={handleAbout}>
          <Text style={styles.buttonText}>About Simple Budget Mobile</Text>
        </Pressable>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

export default function SettingsScreen() {
  return <SettingsScreenContent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  settingValue: {
    fontSize: 14,
    color: "#888",
  },
  button: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  exportButton: {
    backgroundColor: "#4ade80",
  },
  clearButton: {
    backgroundColor: "#ef4444",
  },
  clearButtonText: {
    color: "#fff",
  },
  signOutButton: {
    backgroundColor: "#ef4444",
  },
  signOutButtonText: {
    color: "#fff",
  },
  currencyContainer: {
    flexDirection: "row",
    gap: 8,
  },
  currencyButton: {
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  currencyButtonActive: {
    backgroundColor: "#4ade80",
  },
  currencyButtonText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
  },
  currencyButtonTextActive: {
    color: "#000",
  },
});