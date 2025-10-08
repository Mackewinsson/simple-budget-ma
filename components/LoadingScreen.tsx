import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT_SIZES, FONT_WEIGHTS } from '../src/theme/layout';
import { useTheme } from '../src/theme/ThemeContext';

export default function LoadingScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <Text style={styles.title}>Simple Budget</Text>
        <ActivityIndicator size="large" color={theme.success} style={styles.spinner} />
        <Text style={styles.subtitle}>Loading...</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
    },
    title: {
      fontSize: FONT_SIZES.massive,
      fontWeight: FONT_WEIGHTS.bold,
      color: theme.text,
      marginBottom: 28,
    },
    spinner: {
      marginBottom: 16,
    },
    subtitle: {
      fontSize: FONT_SIZES.lg,
      color: theme.textSecondary,
    },
  });
