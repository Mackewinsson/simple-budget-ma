import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoadingScreen() {
  const insets = useSafeAreaInsets();
  const styles = createStyles();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <Text style={styles.title}>Simple Budget</Text>
        <ActivityIndicator size="large" color="#4CAF50" style={styles.spinner} />
        <Text style={styles.subtitle}>Loading...</Text>
      </View>
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      paddingHorizontal: 20,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: 28,
    },
    spinner: {
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 18,
      color: '#666666',
    },
  });
