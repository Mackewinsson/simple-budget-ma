import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../src/auth/MobileAuthProvider';

export default function LoginScreen() {
  const { signIn, loading } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert(
        'Sign In Failed',
        'There was an error signing in. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Simple Budget</Text>
        <Text style={styles.subtitle}>
          Sign in to manage your finances and track your spending
        </Text>
        
        <Pressable 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Continue with Google</Text>
          )}
        </Pressable>
        
        <Text style={styles.disclaimer}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
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
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#4ade80',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});
