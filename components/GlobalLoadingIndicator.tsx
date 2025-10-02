import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface GlobalLoadingIndicatorProps {
  showBackgroundFetching?: boolean;
  showMutations?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export default function GlobalLoadingIndicator({ 
  showBackgroundFetching = true,
  showMutations = true,
  position = 'top-right'
}: GlobalLoadingIndicatorProps) {
  const insets = useSafeAreaInsets();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  
  const isLoading = (showBackgroundFetching && isFetching > 0) || (showMutations && isMutating > 0);

  if (!isLoading) {
    return null;
  }

  const getPositionStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      zIndex: 1000,
    };

    switch (position) {
      case 'top-left':
        return {
          ...baseStyle,
          top: insets.top + 10,
          left: 20,
        };
      case 'top-right':
        return {
          ...baseStyle,
          top: insets.top + 10,
          right: 20,
        };
      case 'bottom-left':
        return {
          ...baseStyle,
          bottom: insets.bottom + 10,
          left: 20,
        };
      case 'bottom-right':
        return {
          ...baseStyle,
          bottom: insets.bottom + 10,
          right: 20,
        };
      default:
        return {
          ...baseStyle,
          top: insets.top + 10,
          right: 20,
        };
    }
  };

  return (
    <View style={[styles.container, getPositionStyle()]}>
      <ActivityIndicator size="small" color="#4ade80" />
      {isMutating > 0 && (
        <Text style={styles.text}>Saving...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
});
