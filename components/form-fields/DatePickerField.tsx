import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Modal, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent, DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useTheme } from "../../src/theme/ThemeContext";
import { FONT_SIZES, FONT_WEIGHTS } from "../../src/theme/layout";

interface DatePickerFieldProps {
  value: string; // ISO date string (YYYY-MM-DD)
  onChange: (value: string) => void;
  error?: string;
  label?: string;
}

export default function DatePickerField({
  value,
  onChange,
  error,
  label = "Date"
}: DatePickerFieldProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [isIOSPickerVisible, setIsIOSPickerVisible] = useState(false);
  const [iosTempDate, setIOSTempDate] = useState(new Date());

  const getValidDate = (dateString: string) => {
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) {
      return new Date();
    }
    return parsed;
  };

  const formatDate = (dateString: string) => {
    const date = getValidDate(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleAndroidDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      const iso = date.toISOString().split("T")[0];
      onChange(iso);
    }
  };

  const handleDatePress = () => {
    const currentDate = getValidDate(value);

    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        mode: "date",
        value: currentDate,
        is24Hour: true,
        onChange: handleAndroidDateChange,
      });
      return;
    }

    setIOSTempDate(currentDate);
    setIsIOSPickerVisible(true);
  };

  const handleIOSPickerChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setIOSTempDate(date);
    }
  };

  const closeIOSPicker = () => {
    setIsIOSPickerVisible(false);
  };

  const confirmIOSDate = () => {
    const iso = iosTempDate.toISOString().split("T")[0];
    onChange(iso);
    setIsIOSPickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={[styles.selectButton, error && styles.selectButtonError]}
        onPress={handleDatePress}
      >
        <Ionicons name="calendar-outline" size={20} color={theme.textMuted} />
        <Text style={styles.selectText}>
          {formatDate(value)}
        </Text>
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}

      {Platform.OS === "ios" && (
        <Modal
          visible={isIOSPickerVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeIOSPicker}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Date</Text>
                <Pressable onPress={closeIOSPicker}>
                  <Ionicons name="close" size={24} color={theme.text} />
                </Pressable>
              </View>
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={iosTempDate}
                  mode="date"
                  display="spinner"
                  onChange={handleIOSPickerChange}
                  style={styles.iosPicker}
                />
              </View>
              <View style={styles.modalActions}>
                <Pressable style={styles.modalActionButton} onPress={closeIOSPicker}>
                  <Text style={styles.modalActionText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.modalActionButton} onPress={confirmIOSDate}>
                  <Text style={styles.modalActionText}>Done</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  selectButton: {
    backgroundColor: theme.surfaceSecondary,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 48,
    height: 48,
  },
  selectButtonError: {
    borderColor: theme.error,
  },
  selectText: {
    fontSize: FONT_SIZES.lg,
    color: theme.text,
    lineHeight: 24,
    flex: 1,
  },
  error: {
    color: theme.error,
    fontSize: FONT_SIZES.xs,
    marginTop: 4,
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.cardBorder,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: theme.text,
  },
  pickerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iosPicker: {
    width: "100%",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  modalActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalActionText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: theme.primary,
  },
});
