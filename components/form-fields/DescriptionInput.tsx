import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../src/theme/ThemeContext";
import { FONT_SIZES, FONT_WEIGHTS } from "../../src/theme/layout";

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  label?: string;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export default function DescriptionInput({
  value,
  onChange,
  onBlur,
  error,
  label = "Description",
  placeholder = "What was this transaction for?",
  multiline = false,
  numberOfLines = 1
}: DescriptionInputProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme, multiline);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputContainerError]}>
        <Ionicons name="document-text-outline" size={20} color={theme.textMuted} style={styles.icon} />
        <TextInput
          style={styles.input}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const createStyles = (theme: any, multiline: boolean) => StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: FONT_SIZES.md,
    color: theme.text,
    marginBottom: 8,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: multiline ? 12 : 0,
  },
  inputContainerError: {
    borderColor: theme.error,
  },
  icon: {
    marginRight: 8,
    marginTop: multiline ? 2 : 0,
  },
  input: {
    flex: 1,
    color: theme.text,
    fontSize: FONT_SIZES.lg,
    lineHeight: 24,
  },
  error: {
    color: theme.error,
    fontSize: FONT_SIZES.xs,
    marginTop: 4,
    lineHeight: 16,
  },
});
