import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../src/theme/ThemeContext";
import { FONT_SIZES, FONT_WEIGHTS } from "../../src/theme/layout";

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  error?: string;
  label?: string;
  placeholder?: string;
}

export default function AmountInput({
  value,
  onChange,
  onBlur,
  error,
  label = "Amount",
  placeholder = "0.00"
}: AmountInputProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const formatCurrency = (text: string) => {
    // Remove non-numeric characters except decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit to 2 decimal places
    if (parts[1]?.length > 2) {
      return parts[0] + '.' + parts[1].slice(0, 2);
    }

    return cleaned;
  };

  const handleChangeText = (text: string) => {
    const formatted = formatCurrency(text);
    onChange(parseFloat(formatted) || 0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputContainerError]}>
        <Ionicons name="cash-outline" size={20} color={theme.textMuted} style={styles.icon} />
        <TextInput
          style={styles.input}
          onBlur={onBlur}
          onChangeText={handleChangeText}
          value={value > 0 ? value.toString() : ''}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          keyboardType="decimal-pad"
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: 'center',
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    minHeight: 48,
    height: 48,
    paddingHorizontal: 12,
  },
  inputContainerError: {
    borderColor: theme.error,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: theme.text,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: 24,
  },
  error: {
    color: theme.error,
    fontSize: FONT_SIZES.xs,
    marginTop: 4,
    lineHeight: 16,
  },
});
