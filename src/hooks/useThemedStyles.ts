import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

// Common themed styles that can be reused across components
export const useThemedStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    // Text styles
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 16,
    },
    text: {
      fontSize: 16,
      color: theme.text,
    },
    textSecondary: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    textMuted: {
      fontSize: 12,
      color: theme.textMuted,
    },

    // Card styles
    card: {
      backgroundColor: theme.cardBackground,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: theme.shadowOpacity,
      shadowRadius: 4,
      elevation: 2,
    },
    cardLarge: {
      backgroundColor: theme.cardBackground,
      padding: 20,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.shadowOpacity * 1.5,
      shadowRadius: 8,
      elevation: 3,
    },

    // Button styles
    primaryButton: {
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    primaryButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    successButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    successButtonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
    },
    dangerButton: {
      backgroundColor: theme.error,
    },

    // Badge styles
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceSecondary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      gap: 6,
      borderWidth: 1,
      borderColor: theme.border,
    },
    badgeText: {
      fontSize: 13,
      color: theme.textSecondary,
      fontWeight: '500',
    },

    // Input styles
    input: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 12,
      fontSize: 16,
      color: theme.text,
    },

    // Loading/Empty states
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
      gap: 16,
    },
  });
};
