import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaStyles } from "../src/hooks/useSafeAreaStyles";
import { useTheme } from "../src/theme/ThemeContext";
import NewBudgetForm from "../components/NewBudgetForm";

export default function CreateBudgetScreen() {
  const router = useRouter();
  const safeAreaStyles = useSafeAreaStyles();
  const { theme } = useTheme();


  const styles = createStyles(theme);

  return (
    <View style={[safeAreaStyles.container, styles.container]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Create Budget</Text>
          <Text style={styles.headerSubtitle}>Set up your financial plan</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <NewBudgetForm />
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.background,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.cardBorder,
    backgroundColor: theme.background,
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
