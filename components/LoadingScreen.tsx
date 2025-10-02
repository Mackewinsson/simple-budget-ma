import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaStyles } from '../src/hooks/useSafeAreaStyles';

export default function LoadingScreen() {
  const safeAreaStyles = useSafeAreaStyles();
  
  return (
    <View style={safeAreaStyles.containerWithBottomPadding}>
      <View style={styles.container}>
        <Text style={styles.title}>Simple Budget</Text>
        <ActivityIndicator size="large" color="#4ade80" style={styles.spinner} />
        <Text style={styles.subtitle}>Loading...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  spinner: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
});
