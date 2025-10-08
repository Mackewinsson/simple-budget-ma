import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../src/store/authStore';
import { useSafeAreaStyles } from '../src/hooks/useSafeAreaStyles';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';

export default function LoginForm() {
  const [email, setEmail] = useState('mackewinsson@gmail.com');
  const [password, setPassword] = useState('MobilePass123!');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, loading } = useAuthStore();
  const safeAreaStyles = useSafeAreaStyles();
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      console.log('[LoginForm] Attempting login...');
      await signIn(email.trim(), password);
      console.log('[LoginForm] Login successful!');
      console.log('[LoginForm] Navigating to main app...');
      router.replace('/(tabs)/budgets');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <View style={safeAreaStyles.containerWithBottomPadding}>
      <View style={styles.container}>
        <View style={styles.form}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Enter your credentials to continue</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={theme.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={theme.textMuted}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        <Pressable 
          style={[styles.button, (isLoading || loading) && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading || loading}
        >
          {(isLoading || loading) ? (
            <ActivityIndicator color={theme.onPrimary} />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </Pressable>

        {/* Google login removed */}
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    form: {
      width: '100%',
      maxWidth: 400,
      gap: 16,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 16,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: 4,
    },
    label: {
      fontSize: 16,
      color: theme.text,
      marginBottom: 8,
      fontWeight: '500',
    },
    input: {
      backgroundColor: theme.surfaceSecondary,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: theme.text,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 24,
    },
    buttonDisabled: {
      backgroundColor: theme.textMuted,
    },
    buttonText: {
      color: theme.onPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
  });
