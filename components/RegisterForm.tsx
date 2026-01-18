import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../src/store/authStore';
import { useSafeAreaStyles } from '../src/hooks/useSafeAreaStyles';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { register } from '../src/api/auth';
import { ES } from '../src/lib/spanish';

// Client-side password validation (mirrors backend)
const validatePassword = (pwd: string): string[] => {
  const errors: string[] = [];
  if (pwd.length < 8) errors.push('Mínimo 8 caracteres');
  if (!/[A-Z]/.test(pwd)) errors.push('Una letra mayúscula');
  if (!/[a-z]/.test(pwd)) errors.push('Una letra minúscula');
  if (!/\d/.test(pwd)) errors.push('Un número');
  return errors;
};

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, loading } = useAuthStore();
  const safeAreaStyles = useSafeAreaStyles();
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRegister = async () => {
    // 1. Client-side validation
    if (!email.trim() || !password.trim()) {
      Alert.alert(ES.error, 'Email y contraseña son requeridos');
      return;
    }
    
    // 2. Password validation (match backend rules)
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      Alert.alert(ES.error, passwordErrors.join('\n'));
      return;
    }

    try {
      setIsLoading(true);
      
      // 3. Call register endpoint
      const response = await register({
        email: email.trim(),
        password,
        name: name.trim() || undefined,
      });
      
      console.log('[RegisterForm] Registration successful:', response.user.email);
      
      // 4. Auto sign-in after registration
      await signIn(email.trim(), password);
      
      // 5. Navigate to main app
      router.replace('/(tabs)/transactions');
      
    } catch (error: any) {
      console.error('[RegisterForm] Registration error:', error);
      
      // 6. Handle specific error codes
      if (error.response?.status === 409) {
        Alert.alert(ES.error, 'Este email ya está registrado');
      } else if (error.response?.status === 400) {
        const details = error.response?.data?.details;
        Alert.alert(ES.error, details?.join('\n') || 'Datos inválidos');
      } else {
        Alert.alert(ES.error, 'Error al crear cuenta. Intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={safeAreaStyles.containerWithBottomPadding}>
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.title}>{ES.createAccount}</Text>
          <Text style={styles.subtitle}>Crea tu cuenta para comenzar</Text>
          
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
              editable={!loading && !isLoading}
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
              editable={!loading && !isLoading}
            />
            <Text style={styles.hint}>{ES.passwordRequirements}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{ES.name} (opcional)</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ingresa tu nombre"
              placeholderTextColor={theme.textMuted}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!loading && !isLoading}
            />
          </View>

          <Pressable 
            style={[styles.button, (isLoading || loading) && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading || loading}
          >
            {(isLoading || loading) ? (
              <ActivityIndicator color={theme.onPrimary} />
            ) : (
              <Text style={styles.buttonText}>{ES.signUp}</Text>
            )}
          </Pressable>

          <Pressable 
            style={styles.linkContainer}
            onPress={() => router.push('/auth/login')}
            disabled={isLoading || loading}
          >
            <Text style={styles.linkText}>
              {ES.alreadyHaveAccount}{' '}
              <Text style={styles.link}>{ES.signIn}</Text>
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
    hint: {
      fontSize: 12,
      color: theme.textMuted,
      marginTop: 4,
      marginLeft: 4,
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
