import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/theme/ThemeContext';
import { FONT_SIZES, FONT_WEIGHTS } from '../src/theme/layout';

interface BeautifulLoadingOverlayProps {
  visible: boolean;
  title: string;
  subtitle: string;
  iconName: keyof typeof Ionicons.glyphMap;
  showOverlay?: boolean;
}

export default function BeautifulLoadingOverlay({ 
  visible, 
  title, 
  subtitle, 
  iconName,
  showOverlay = true
}: BeautifulLoadingOverlayProps) {
  const { theme } = useTheme();
  
  // Animation values
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Spin animation
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );

      // Breathing scale animation
      const scaleAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );

      spinAnimation.start();
      scaleAnimation.start();

      return () => {
        spinAnimation.stop();
        scaleAnimation.stop();
      };
    }
  }, [visible, spinValue, scaleValue]);

  if (!visible) {
    return null;
  }

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const styles = createStyles(theme);

  return (
    <View style={styles.overlay}>
      <View style={styles.loadingCard}>
        <Animated.View 
          style={[
            styles.iconContainer,
            {
              transform: [
                { rotate: spin },
                { scale: scaleValue }
              ]
            }
          ]}
        >
          <View style={styles.iconBackground}>
            <Ionicons 
              name={iconName} 
              size={24} 
              color={theme.primary} 
            />
          </View>
        </Animated.View>
        <Text style={styles.loadingText}>{title}</Text>
        <Text style={styles.loadingSubtext}>{subtitle}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingCard: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.shadow || '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: theme.border || 'rgba(255, 255, 255, 0.1)',
    minWidth: 200,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.primary + '15', // 15% opacity
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: theme.text,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    marginBottom: 4,
    textAlign: 'center',
  },
  loadingSubtext: {
    color: theme.textSecondary,
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
