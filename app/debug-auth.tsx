import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';
import { useMobileAuth } from '../src/auth/useMobileAuth';

export default function DebugAuthScreen() {
  const [deepLinkUrl, setDeepLinkUrl] = useState<string>('');
  const { signIn } = useMobileAuth();
  
  const expoUrl = Constants.expoConfig?.hostUri || '127.0.0.1:8081';
  const testDeepLinkUrl = `exp://${expoUrl}/--/auth/callback?code=test-code-123`;

  useEffect(() => {
    // Listen for deep links
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('Deep link received:', url);
      setDeepLinkUrl(url);
      Alert.alert('Deep Link Received', url);
    });

    // Check if app was opened with a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial deep link:', url);
        setDeepLinkUrl(url);
      }
    });

    return () => subscription?.remove();
  }, []);

  const handleSignIn = async () => {
    try {
      console.log('Starting sign in...');
      await signIn();
      Alert.alert('Success', 'Authentication completed!');
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const testDeepLink = () => {
    console.log('Testing deep link:', testDeepLinkUrl);
    Linking.openURL(testDeepLinkUrl);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Auth Screen</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deep Link Status</Text>
        <Text style={styles.urlText}>
          {deepLinkUrl || 'No deep link received yet'}
        </Text>
        <Text style={styles.sectionTitle}>Test URL:</Text>
        <Text style={styles.urlText}>
          {testDeepLinkUrl}
        </Text>
      </View>

      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Test Sign In</Text>
        </Pressable>
        
        <Pressable style={[styles.button, styles.testButton]} onPress={testDeepLink}>
          <Text style={styles.buttonText}>Test Deep Link</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  section: {
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  urlText: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  buttons: {
    gap: 16,
  },
  button: {
    backgroundColor: '#4ade80',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
