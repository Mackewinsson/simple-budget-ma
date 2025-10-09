import React from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { useAuthStore } from "../src/store/authStore";
import { useFeatureAccess } from "../src/hooks/useFeatureAccess";
import { useTheme } from "../src/theme/ThemeContext";

export default function FeatureTestScreen() {
  const { session } = useAuthStore();
  const { theme } = useTheme();
  const { hasAccess: hasAIBudgeting, showUpgradeModal: showAIBudgetingUpgrade } = useFeatureAccess('aiBudgeting');
  const { hasAccess: hasAITransaction, showUpgradeModal: showAITransactionUpgrade } = useFeatureAccess('transactionTextInput');

  const styles = createStyles(theme);

  const testAIBudgeting = () => {
    if (!hasAIBudgeting) {
      showAIBudgetingUpgrade();
    } else {
      Alert.alert("Success", "You have access to AI Budgeting!");
    }
  };

  const testAITransaction = () => {
    if (!hasAITransaction) {
      showAITransactionUpgrade();
    } else {
      Alert.alert("Success", "You have access to AI Transaction Input!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feature Access Test</Text>
      
      <View style={styles.userInfo}>
        <Text style={styles.label}>Current User:</Text>
        <Text style={styles.value}>{session?.user?.email || "Not logged in"}</Text>
        <Text style={styles.label}>Plan:</Text>
        <Text style={styles.value}>{session?.user?.plan || "No plan"}</Text>
        <Text style={styles.label}>Is Paid:</Text>
        <Text style={styles.value}>{session?.user?.isPaid ? "Yes" : "No"}</Text>
      </View>

      <View style={styles.featureSection}>
        <Text style={styles.sectionTitle}>AI Features Test</Text>
        
        <Pressable style={styles.button} onPress={testAIBudgeting}>
          <Text style={styles.buttonText}>
            Test AI Budgeting {hasAIBudgeting ? "✅" : "🔒"}
          </Text>
        </Pressable>

        <Pressable style={styles.button} onPress={testAITransaction}>
          <Text style={styles.buttonText}>
            Test AI Transaction {hasAITransaction ? "✅" : "🔒"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>Instructions:</Text>
        <Text style={styles.instructionText}>
          1. If you see 🔒, you should get an upgrade modal when clicking
        </Text>
        <Text style={styles.instructionText}>
          2. If you see ✅, you should get a success message
        </Text>
        <Text style={styles.instructionText}>
          3. Pro users (plan: "pro") should have access to both features
        </Text>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 20,
    textAlign: "center",
  },
  userInfo: {
    backgroundColor: theme.cardBackground,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.text,
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  featureSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 16,
  },
  button: {
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  buttonText: {
    color: theme.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  instructions: {
    backgroundColor: theme.backgroundSecondary,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
});
