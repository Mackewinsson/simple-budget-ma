import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/theme/ThemeContext';

interface FeatureListProps {
  features: string[];
  showIcons?: boolean;
  style?: any;
}

export default function FeatureList({ features, showIcons = true, style }: FeatureListProps) {
  const { theme } = useTheme();

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, style]}>
      {features.map((feature, index) => (
        <View key={index} style={styles.featureItem}>
          <View style={styles.checkmarkContainer}>
            <Ionicons 
              name="checkmark-circle" 
              size={20} 
              color={theme.success} 
            />
          </View>
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  checkmarkContainer: {
    marginRight: 12,
    width: 20,
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
    fontWeight: '500',
  },
});
