import React, { useMemo } from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../src/store/authStore";
import { useTheme } from "../src/theme/ThemeContext";

type ProBadgeTone = "light" | "dark";

interface ProBadgeProps {
  tone?: ProBadgeTone;
  style?: StyleProp<ViewStyle>;
  showLabel?: boolean;
}

const getVariantStyles = (theme: any, tone: ProBadgeTone) => {
  if (tone === "light") {
    return {
      container: {
        backgroundColor: theme.onPrimarySubtle,
        borderColor: theme.onPrimaryBorder,
      },
      color: theme.onPrimary,
    };
  }

  return {
    container: {
      backgroundColor: theme.primaryLight,
      borderColor: theme.primaryDark,
    },
    color: theme.primaryDark,
  };
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      borderWidth: 1,
      gap: 6,
    },
    label: {
      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 0.6,
    },
  });

export default function ProBadge({
  tone = "dark",
  style,
  showLabel = true,
}: ProBadgeProps) {
  const { session } = useAuthStore();
  const { theme } = useTheme();
  const isPro =
    session?.user?.plan && session.user.plan.toLowerCase() === "pro";

  const styles = useMemo(() => createStyles(theme), [theme]);
  const variant = useMemo(() => getVariantStyles(theme, tone), [theme, tone]);

  if (!isPro) {
    return null;
  }

  return (
    <View style={[styles.container, variant.container, style]}>
      <Ionicons name="sparkles" size={14} color={variant.color} />
      {showLabel && (
        <Text style={[styles.label, { color: variant.color }]}>PRO</Text>
      )}
    </View>
  );
}
