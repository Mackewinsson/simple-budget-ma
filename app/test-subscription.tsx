import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../src/theme/ThemeContext';
import { useSubscriptionStore } from '../src/store/subscriptionStore';
import { useAuthStore } from '../src/store/authStore';

export default function TestSubscriptionScreen() {
  const { theme } = useTheme();
  const { showUpgradeModal } = useSubscriptionStore();
  const { session, updateUserPlan, isProUser } = useAuthStore();
  const styles = createStyles(theme);

  const handleTestModal = () => {
    showUpgradeModal();
  };

  const handleMockUpgrade = () => {
    updateUserPlan('pro');
    Alert.alert('Success', 'User upgraded to Pro!');
  };

  const handleMockDowngrade = () => {
    updateUserPlan('free');
    Alert.alert('Success', 'User downgraded to Free!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscription Test Screen</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Status</Text>
        <Text style={styles.statusText}>
          Plan: {session?.user?.plan || 'free'}
        </Text>
        <Text style={styles.statusText}>
          Is Pro: {isProUser() ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.statusText}>
          Is Paid: {session?.user?.isPaid ? 'Yes' : 'No'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Actions</Text>
        
        <TouchableOpacity style={styles.button} onPress={handleTestModal}>
          <Text style={styles.buttonText}>Show Upgrade Modal</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleMockUpgrade}>
          <Text style={styles.buttonText}>Mock Upgrade to Pro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleMockDowngrade}>
          <Text style={styles.buttonText}>Mock Downgrade to Free</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  button: {
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});
