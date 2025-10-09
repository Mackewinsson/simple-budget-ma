import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/theme/ThemeContext';

interface OptimisticIndicatorProps {
  isOptimistic?: boolean;
  children: React.ReactNode;
}

export default function OptimisticIndicator({ isOptimistic, children }: OptimisticIndicatorProps) {
  const { theme } = useTheme();

  if (!isOptimistic) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      {children}
      <View style={[styles.indicator, { backgroundColor: theme.warning }]}>
        <Ionicons name="sync" size={12} color={theme.surface} />
        <Text style={[styles.text, { color: theme.surface }]}>Syncing...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    zIndex: 1,
  },
  text: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
});
