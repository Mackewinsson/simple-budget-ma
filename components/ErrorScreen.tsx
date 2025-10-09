import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/theme/ThemeContext';

export interface ErrorScreenProps {
  title?: string;
  message?: string;
  errorType?: 'network' | 'server' | 'validation' | 'auth' | 'generic';
  onRetry?: () => void;
  onGoBack?: () => void;
  retryText?: string;
  showRetry?: boolean;
  showGoBack?: boolean;
}

export default function ErrorScreen({
  title = "Oops! Something went wrong",
  message = "We encountered an unexpected error. Please try again.",
  errorType = 'generic',
  onRetry,
  onGoBack,
  retryText = "Try Again",
  showRetry = true,
  showGoBack = true,
}: ErrorScreenProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const getErrorIcon = () => {
    switch (errorType) {
      case 'network':
        return 'wifi-outline';
      case 'server':
        return 'server-outline';
      case 'validation':
        return 'alert-circle-outline';
      case 'auth':
        return 'lock-closed-outline';
      default:
        return 'warning-outline';
    }
  };

  const getErrorColor = () => {
    switch (errorType) {
      case 'network':
        return theme.warning;
      case 'server':
        return theme.error;
      case 'validation':
        return theme.warning;
      case 'auth':
        return theme.error;
      default:
        return theme.error;
    }
  };

  const getDefaultMessage = () => {
    switch (errorType) {
      case 'network':
        return "Please check your internet connection and try again.";
      case 'server':
        return "Our servers are experiencing issues. Please try again in a few moments.";
      case 'validation':
        return "Please check your input and try again.";
      case 'auth':
        return "Your session has expired. Please log in again.";
      default:
        return message;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={getErrorIcon()} 
            size={64} 
            color={getErrorColor()} 
          />
        </View>
        
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{getDefaultMessage()}</Text>
        
        <View style={styles.buttonContainer}>
          {showRetry && onRetry && (
            <Pressable style={styles.retryButton} onPress={onRetry}>
              <Ionicons name="refresh" size={20} color={theme.surface} />
              <Text style={styles.retryButtonText}>{retryText}</Text>
            </Pressable>
          )}
          
          {showGoBack && onGoBack && (
            <Pressable style={styles.backButton} onPress={onGoBack}>
              <Ionicons name="arrow-back" size={20} color={theme.primary} />
              <Text style={styles.backButtonText}>Go Back</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  retryButton: {
    backgroundColor: theme.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  retryButtonText: {
    color: theme.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  backButtonText: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
