import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaStyles } from "../src/hooks/useSafeAreaStyles";
import { useTheme } from "../src/theme/ThemeContext";
import NewBudgetForm from "../components/NewBudgetForm";
import ProBadge from "../components/ProBadge";
import { ES } from "../src/lib/spanish";

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
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>{ES.createYourBudget}</Text>
            <ProBadge tone="dark" />
          </View>
          <Text style={styles.headerSubtitle}>Configura tu plan financiero</Text>
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
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
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
