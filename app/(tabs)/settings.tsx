import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert, ScrollView, Switch } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserCurrency, useUpdateUserCurrency } from "../../src/api/hooks/useUsers";
import { useAuthStore } from "../../src/store/authStore";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/theme/ThemeContext";

function SettingsScreenContent() {
  const { session, signOut } = useAuthStore();
  const { data: currency } = useUserCurrency();
  const updateCurrency = useUpdateUserCurrency();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, themeMode, isDark, setThemeMode } = useTheme();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const styles = createStyles(theme);

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
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.primary, theme.primaryDark || theme.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.profileBadge}>
            <Ionicons name="person-circle-outline" size={24} color="rgba(255, 255, 255, 0.9)" />
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContent}>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="person-outline" size={20} color="#94a3b8" />
            <Text style={styles.settingLabel}>Name</Text>
          </View>
          <Text style={styles.settingValue}>{session?.user?.name || "Loading..."}</Text>
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="mail-outline" size={20} color="#94a3b8" />
            <Text style={styles.settingLabel}>Email</Text>
          </View>
          <Text style={styles.settingValue}>{session?.user?.email || "Loading..."}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="cash-outline" size={20} color="#94a3b8" />
            <Text style={styles.settingLabel}>Currency</Text>
          </View>
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
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={20} color="#94a3b8" />
            <Text style={styles.settingLabel}>Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#334155", true: "#3b82f6" }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name={isDark ? "moon" : "sunny-outline"} size={20} color={theme.textSecondary} />
            <Text style={styles.settingLabel}>Theme</Text>
          </View>
          <View style={styles.themeButtons}>
            <Pressable
              style={[styles.themeButton, themeMode === "light" && styles.themeButtonActive]}
              onPress={() => setThemeMode("light")}
            >
              <Ionicons name="sunny-outline" size={16} color={themeMode === "light" ? "#fff" : theme.textSecondary} />
            </Pressable>
            <Pressable
              style={[styles.themeButton, themeMode === "system" && styles.themeButtonActive]}
              onPress={() => setThemeMode("system")}
            >
              <Ionicons name="phone-portrait-outline" size={16} color={themeMode === "system" ? "#fff" : theme.textSecondary} />
            </Pressable>
            <Pressable
              style={[styles.themeButton, themeMode === "dark" && styles.themeButtonActive]}
              onPress={() => setThemeMode("dark")}
            >
              <Ionicons name="moon-outline" size={16} color={themeMode === "dark" ? "#fff" : theme.textSecondary} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <Pressable style={styles.actionButton} onPress={handleExportData}>
          <Ionicons name="download-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Export Data</Text>
        </Pressable>

        <Pressable style={[styles.actionButton, styles.dangerButton]} onPress={handleClearData}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Clear All Data</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <Pressable style={styles.aboutButton} onPress={handleAbout}>
          <View style={styles.aboutLeft}>
            <Ionicons name="information-circle-outline" size={20} color="#94a3b8" />
            <Text style={styles.aboutButtonText}>About Simple Budget Mobile</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#64748b" />
        </Pressable>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="code-outline" size={20} color="#94a3b8" />
            <Text style={styles.settingLabel}>Version</Text>
          </View>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
      </View>

        <View style={styles.section}>
          <Pressable style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

export default function SettingsScreen() {
  return <SettingsScreenContent />;
}

function createStyles(theme: any) {
  return StyleSheet.create({
    headerGradient: {
      paddingBottom: 24,
      paddingHorizontal: 20,
      marginBottom: 24,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },
    profileBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    scrollContent: {
      paddingHorizontal: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 12,
    },
    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.cardBackground,
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: theme.shadowOpacity,
      shadowRadius: 4,
      elevation: 2,
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    settingLabel: {
      fontSize: 16,
      color: theme.text,
      fontWeight: "500",
    },
    settingValue: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    currencyContainer: {
      flexDirection: "row",
      gap: 8,
    },
    currencyButton: {
      backgroundColor: theme.surfaceSecondary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    currencyButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    currencyButtonText: {
      color: theme.textSecondary,
      fontSize: 14,
      fontWeight: "600",
    },
    currencyButtonTextActive: {
      color: "#fff",
    },
    actionButton: {
      flexDirection: "row",
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginBottom: 12,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    dangerButton: {
      backgroundColor: theme.error,
      shadowColor: theme.error,
    },
    actionButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    aboutButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.cardBackground,
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: theme.shadowOpacity,
      shadowRadius: 4,
      elevation: 2,
    },
    aboutLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    aboutButtonText: {
      fontSize: 16,
      color: theme.text,
      fontWeight: "500",
    },
    signOutButton: {
      flexDirection: "row",
      backgroundColor: theme.error,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      shadowColor: theme.error,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    signOutButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    themeButtons: {
      flexDirection: "row",
      gap: 8,
    },
    themeButton: {
      backgroundColor: theme.surfaceSecondary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    themeButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
  });
}