import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert, ScrollView, Switch } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserCurrency, useUpdateUserCurrency } from "../../src/api/hooks/useUsers";
import { useAuthStore } from "../../src/store/authStore";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/theme/ThemeContext";
import ProBadge from "../../components/ProBadge";
import { ES } from "../../src/lib/spanish";

function SettingsScreenContent() {
  const { session, signOut } = useAuthStore();
  const { data: currency, error: currencyError } = useUserCurrency();
  const updateCurrency = useUpdateUserCurrency();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, themeMode, isDark, setThemeMode } = useTheme();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const styles = createStyles(theme);

  const handleSignOut = () => {
    Alert.alert(
      ES.signOut,
      ES.signOutConfirm,
      [
        { text: ES.cancel, style: "cancel" },
        { 
          text: ES.signOut, 
          style: "destructive", 
          onPress: async () => {
            try {
              await signOut();
              console.log('[Settings] Sign out successful, redirecting to login');
              router.replace('/auth/login');
            } catch (error) {
              console.error('[Settings] Sign out error:', error);
              Alert.alert(ES.error, 'Error al cerrar sesión');
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
      "Eliminar Todos los Datos",
      "Esto eliminará todos tus presupuestos, categorías y gastos. Esta acción no se puede deshacer.",
      [
        { text: ES.cancel, style: "cancel" },
        { 
          text: "Eliminar Datos", 
          style: "destructive", 
          onPress: () => {
            Alert.alert(ES.comingSoon, "La eliminación de datos estará disponible en una futura actualización.");
          }
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      ES.exportData,
      "Exporta los datos de tu presupuesto a un archivo.",
      [
        { text: ES.cancel, style: "cancel" },
        { 
          text: ES.export, 
          onPress: () => {
            Alert.alert(ES.comingSoon, ES.exportComingSoon);
          }
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      ES.aboutPresuSimple,
      ES.aboutMessage,
      [{ text: ES.done }]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient
        colors={[theme.primary, theme.primaryDark || theme.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>{ES.settings}</Text>
            <ProBadge tone="light" />
          </View>
          <View style={styles.profileBadge}>
            <Ionicons name="person-circle-outline" size={24} color={theme.onPrimaryMuted} />
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: 32 }}
      >

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{ES.account}</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="person-outline" size={20} color={theme.textMuted} />
            <Text style={styles.settingLabel}>Nombre</Text>
          </View>
          <Text style={styles.settingValue}>{session?.user?.name || ES.loading}</Text>
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="mail-outline" size={20} color={theme.textMuted} />
            <Text style={styles.settingLabel}>{ES.email}</Text>
          </View>
          <Text style={styles.settingValue}>{session?.user?.email || ES.loading}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{ES.preferences}</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="cash-outline" size={20} color={theme.textMuted} />
            <Text style={styles.settingLabel}>{ES.currency}</Text>
          </View>
          <View style={styles.currencyContainer}>
            <Pressable
              style={[styles.currencyButton, (currency || "USD") === "USD" && styles.currencyButtonActive]}
              onPress={() => handleCurrencyChange("USD")}
            >
              <Text style={[styles.currencyButtonText, (currency || "USD") === "USD" && styles.currencyButtonTextActive]}>
                USD
              </Text>
            </Pressable>
            <Pressable
              style={[styles.currencyButton, (currency || "USD") === "EUR" && styles.currencyButtonActive]}
              onPress={() => handleCurrencyChange("EUR")}
            >
              <Text style={[styles.currencyButtonText, (currency || "USD") === "EUR" && styles.currencyButtonTextActive]}>
                EUR
              </Text>
            </Pressable>
            <Pressable
              style={[styles.currencyButton, (currency || "USD") === "GBP" && styles.currencyButtonActive]}
              onPress={() => handleCurrencyChange("GBP")}
            >
              <Text style={[styles.currencyButtonText, (currency || "USD") === "GBP" && styles.currencyButtonTextActive]}>
                GBP
              </Text>
            </Pressable>
          </View>
        </View>

        {/* <View style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <Ionicons name="notifications-outline" size={20} color={theme.textMuted} />
          <Text style={styles.settingLabel}>Notifications</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: theme.border, true: theme.primary }}
          thumbColor={theme.onPrimary}
        />
      </View> */}

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name={isDark ? "moon" : "sunny-outline"} size={20} color={theme.textSecondary} />
            <Text style={styles.settingLabel}>{ES.theme}</Text>
          </View>
          <View style={styles.themeButtons}>
            <Pressable
              style={[styles.themeButton, themeMode === "light" && styles.themeButtonActive]}
              onPress={() => setThemeMode("light")}
            >
              <Ionicons name="sunny-outline" size={16} color={themeMode === "light" ? theme.onPrimary : theme.textSecondary} />
            </Pressable>
            <Pressable
              style={[styles.themeButton, themeMode === "system" && styles.themeButtonActive]}
              onPress={() => setThemeMode("system")}
            >
              <Ionicons name="phone-portrait-outline" size={16} color={themeMode === "system" ? theme.onPrimary : theme.textSecondary} />
            </Pressable>
            <Pressable
              style={[styles.themeButton, themeMode === "dark" && styles.themeButtonActive]}
              onPress={() => setThemeMode("dark")}
            >
              <Ionicons name="moon-outline" size={16} color={themeMode === "dark" ? theme.onPrimary : theme.textSecondary} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <Pressable style={styles.actionButton} onPress={handleExportData}>
          <Ionicons name="download-outline" size={20} color={theme.onPrimary} />
          <Text style={styles.actionButtonText}>Export Data</Text>
        </Pressable>

        <Pressable style={[styles.actionButton, styles.dangerButton]} onPress={handleClearData}>
          <Ionicons name="trash-outline" size={20} color={theme.onPrimary} />
          <Text style={styles.actionButtonText}>Clear All Data</Text>
        </Pressable>
      </View> */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{ES.about}</Text>

        <Pressable style={styles.aboutButton} onPress={handleAbout}>
          <View style={styles.aboutLeft}>
            <Ionicons name="information-circle-outline" size={20} color={theme.textMuted} />
            <Text style={styles.aboutButtonText}>{ES.aboutPresuSimple}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </Pressable>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="code-outline" size={20} color={theme.textMuted} />
            <Text style={styles.settingLabel}>{ES.version}</Text>
          </View>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
      </View>

        <View style={styles.section}>
          <Pressable style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color={theme.onPrimary} />
            <Text style={styles.signOutButtonText}>{ES.signOut}</Text>
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
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.onPrimary,
      letterSpacing: 0.3,
    },
    profileBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.onPrimarySubtle,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.onPrimaryBorder,
    },
    scrollContent: {
      paddingHorizontal: 16,
      backgroundColor: theme.background,
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
      color: theme.onPrimary,
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
      color: theme.onPrimary,
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
    planContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    upgradeButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 12,
      marginTop: 8,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    upgradeButtonText: {
      flex: 1,
      color: theme.surface,
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
    manageButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.cardBackground,
      padding: 16,
      borderRadius: 12,
      marginTop: 8,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    manageButtonText: {
      flex: 1,
      color: theme.primary,
      fontSize: 16,
      fontWeight: "500",
      marginLeft: 8,
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
      color: theme.onPrimary,
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
