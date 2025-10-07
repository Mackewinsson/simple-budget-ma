import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../src/theme/ThemeContext";

interface PickerItem {
  label: string;
  value: string | number;
}

interface PickerProps {
  label: string;
  value?: string | number | null;
  onValueChange: (value: string | number) => void;
  items: PickerItem[];
  placeholder?: string;
  error?: string;
  style?: any;
}

const PLACEHOLDER_VALUE = "__picker_placeholder__";

export default function CustomPicker({
  label,
  value,
  onValueChange,
  items,
  placeholder = "Select an option",
  error,
  style,
}: PickerProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [isOpen, setIsOpen] = useState(false);

  const validItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const selectedItem = useMemo(
    () => validItems.find(item => item.value === value),
    [validItems, value]
  );

  const [tempValue, setTempValue] = useState<string | number | typeof PLACEHOLDER_VALUE>(
    selectedItem ? selectedItem.value : PLACEHOLDER_VALUE
  );

  useEffect(() => {
    if (!isOpen) {
      setTempValue(selectedItem ? selectedItem.value : PLACEHOLDER_VALUE);
    }
  }, [selectedItem, isOpen]);

  const handleConfirm = () => {
    setIsOpen(false);
    if (tempValue === PLACEHOLDER_VALUE || tempValue === value) {
      return;
    }
    onValueChange(tempValue);
  };

  const handleOpen = () => {
    setTempValue(selectedItem ? selectedItem.value : PLACEHOLDER_VALUE);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTempValue(selectedItem ? selectedItem.value : PLACEHOLDER_VALUE);
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      
      <Pressable
        style={styles.pickerButton}
        onPress={handleOpen}
      >
        <Text style={[
          styles.pickerText,
          { color: selectedItem ? theme.text : theme.textMuted }
        ]}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color={theme.textMuted} />
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <Pressable onPress={handleClose}>
                <Ionicons name="close" size={24} color={theme.text} />
              </Pressable>
            </View>

            {validItems.length > 0 ? (
              <>
                <Picker
                  selectedValue={tempValue}
                  onValueChange={(itemValue) => setTempValue(itemValue)}
                  style={styles.nativePicker}
                  dropdownIconColor={theme.textMuted}
                >
                  <Picker.Item
                    label={placeholder}
                    value={PLACEHOLDER_VALUE}
                    enabled={false}
                    color={theme.textMuted}
                  />
                  {validItems.map((item, index) => (
                    <Picker.Item
                      key={`${item.value}-${index}`}
                      label={item.label}
                      value={item.value}
                      color={theme.text}
                    />
                  ))}
                </Picker>
                <View style={styles.modalActions}>
                  <Pressable style={styles.modalActionButton} onPress={handleClose}>
                    <Text style={styles.modalActionText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={styles.modalActionButton} onPress={handleConfirm}>
                    <Text style={styles.modalActionText}>Done</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No options available</Text>
                <Pressable style={styles.modalActionButton} onPress={handleClose}>
                  <Text style={styles.modalActionText}>Close</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: theme.text,
    marginBottom: 8,
    fontWeight: "500",
  },
  pickerButton: {
    backgroundColor: theme.surfaceSecondary,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 48,
    height: 48,
  },
  pickerText: {
    fontSize: 16,
    flex: 1,
  },
  error: {
    color: theme.error,
    fontSize: 12,
    marginTop: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
  },
  nativePicker: {
    width: "100%",
    color: theme.text,
    ...Platform.select({
      ios: { height: 220 },
      android: { height: 200 },
      default: { height: 220 },
    }),
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
  },
  modalActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.primary,
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
    gap: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: theme.textMuted,
  },
});
