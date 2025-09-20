import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple Budget</Text>
      <ActivityIndicator size="large" color="#4ade80" style={styles.spinner} />
      <Text style={styles.subtitle}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
