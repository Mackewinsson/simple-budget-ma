import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../src/store/authStore';
import { useSafeAreaStyles } from '../src/hooks/useSafeAreaStyles';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ES } from '../src/lib/spanish';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, loading } = useAuthStore();
  const safeAreaStyles = useSafeAreaStyles();
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(ES.error, 'Email y contraseña son requeridos');
      return;
    }

    try {
      setIsLoading(true);
      console.log('[LoginForm] Attempting login...');
      await signIn(email.trim(), password);
      console.log('[LoginForm] Login successful!');
      console.log('[LoginForm] Navigating to main app...');
      router.replace('/(tabs)/transactions');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión. Intenta de nuevo.';
      Alert.alert(ES.error, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <View style={safeAreaStyles.containerWithBottomPadding}>
      <View style={styles.container}>
        <View style={styles.form}>
        <Text style={styles.title}>{ES.signIn}</Text>
        <Text style={styles.subtitle}>Ingresa tus credenciales para continuar</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{ES.email}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Ingresa tu correo"
            placeholderTextColor={theme.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{ES.password}</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Ingresa tu contraseña"
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
            <Text style={styles.buttonText}>{ES.signIn}</Text>
          )}
        </Pressable>

        <Pressable 
          style={styles.linkContainer}
          onPress={() => router.push('/auth/register')}
          disabled={isLoading || loading}
        >
          <Text style={styles.linkText}>
            {ES.dontHaveAccount}{' '}
            <Text style={styles.link}>{ES.signUp}</Text>
          </Text>
        </Pressable>
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
    linkContainer: {
      marginTop: 16,
      alignItems: 'center',
    },
    linkText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    link: {
      color: theme.primary,
      fontWeight: '600',
    },
  });
