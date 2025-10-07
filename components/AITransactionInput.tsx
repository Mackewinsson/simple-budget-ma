import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../src/store/authStore";
import { useTheme } from "../src/theme/ThemeContext";

interface AITransactionInputProps {
  budgetId: string;
}

export default function AITransactionInput({ budgetId }: AITransactionInputProps) {
  const { session } = useAuthStore();
  const { theme } = useTheme();
  const [description, setDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const styles = createStyles(theme);

  const handleParse = async () => {
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a transaction description");
      return;
    }

    if (description.length > 500) {
      Alert.alert("Error", "Description is too long. Please keep it under 500 characters.");
      return;
    }

    if (!session?.user?.id) {
      Alert.alert("Error", "You must be signed in to add transactions");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For now, just show a placeholder message
      Alert.alert(
        "AI Processing",
        "AI transaction parsing is coming soon! For now, please use the manual transaction form.",
        [{ text: "OK" }]
      );

    } catch (error) {
      console.error("Failed to parse transactions:", error);
      Alert.alert("Error", "Failed to parse transactions. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="sparkles" size={24} color={theme.primary} style={styles.titleIcon} />
          <Text style={styles.title}>AI Magic</Text>
          <Ionicons name="flash" size={20} color={theme.warning} style={styles.flashIcon} />
        </View>
        <Text style={styles.subtitle}>
          Describe your transactions in natural language and let AI parse them automatically
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textArea}
          placeholder="Example: 'Bought coffee for $4.50 and lunch for $12.80 at the cafe'"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholderTextColor={theme.textMuted}
          editable={!isProcessing}
        />
        <View style={styles.characterCount}>
          <Text style={styles.characterCountText}>
            {description.length}/500 characters
          </Text>
          <Text style={styles.statusText}>
            {description.length < 3 ? 'Need more detail' : 'Ready to parse'}
          </Text>
        </View>
      </View>

      <Pressable
        style={[
          styles.button,
          (!description.trim() || isProcessing) && styles.buttonDisabled
        ]}
        onPress={handleParse}
        disabled={!description.trim() || isProcessing}
      >
        {isProcessing ? (
          <>
            <Ionicons name="hourglass-outline" size={20} color={theme.surface} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>AI is working...</Text>
          </>
        ) : (
          <>
            <Ionicons name="sparkles" size={20} color={theme.surface} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Transform with AI</Text>
          </>
        )}
      </Pressable>

      <View style={styles.examplesContainer}>
        <Text style={styles.examplesTitle}>
          <Ionicons name="sparkles" size={16} color={theme.primary} /> Try these examples:
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.examplesScroll}>
          <Text style={styles.exampleText}>
            "Bought coffee for $4.50 and lunch for $12.80" → Two food expenses
          </Text>
          <Text style={styles.exampleText}>
            "Paid rent $1200 and took Uber $15" → Rent and transportation
          </Text>
          <Text style={styles.exampleText}>
            "Received salary $3000 and freelance $500" → Two income sources
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
    flex: 1,
  },
  flashIcon: {
    marginLeft: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.border,
    minHeight: 100,
    textAlignVertical: "top",
  },
  characterCount: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  characterCountText: {
    fontSize: 12,
    color: theme.textMuted,
  },
  statusText: {
    fontSize: 12,
    color: theme.textMuted,
  },
  button: {
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: theme.textMuted,
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    color: theme.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  examplesContainer: {
    marginTop: 8,
  },
  examplesTitle: {
    fontSize: 14,
    color: theme.text,
    marginBottom: 12,
    fontWeight: "500",
  },
  examplesScroll: {
    flexDirection: "row",
  },
  exampleText: {
    fontSize: 13,
    color: theme.textSecondary,
    backgroundColor: theme.backgroundSecondary,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    marginRight: 12,
    minWidth: 280,
  },
});
