import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/theme/ThemeContext';
import { useSubscriptionStore } from '../src/store/subscriptionStore';
import { SUBSCRIPTION_PLANS } from '../src/types/subscription';
import SubscriptionPlanCard from '../components/SubscriptionPlanCard';
import FeatureList from '../components/FeatureList';

export default function UpgradeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = createStyles(theme, insets);

  const {
    selectedPlan,
    isPurchasing,
    purchaseError,
    selectPlan,
    startPurchase,
    completePurchase,
    setPurchaseError,
    restorePurchases
  } = useSubscriptionStore();

  const handlePurchase = async () => {
    if (!selectedPlan) return;

    try {
      startPurchase();
      
      // Mock purchase flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      completePurchase();
      
      Alert.alert(
        'Welcome to Pro!',
        `You've successfully upgraded to ${selectedPlan.displayName}. Enjoy all the premium features!`,
        [{ 
          text: 'Get Started', 
          style: 'default',
          onPress: () => router.back()
        }]
      );
    } catch (error) {
      setPurchaseError('Purchase failed. Please try again.');
    }
  };

  const handleRestorePurchases = async () => {
    try {
      await restorePurchases();
      Alert.alert('Success', 'Purchases restored successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Ionicons name="sparkles" size={24} color={theme.primary} />
          <Text style={styles.title}>Upgrade to Pro</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Unlock Premium Features</Text>
          <Text style={styles.heroSubtitle}>
            Get access to AI-powered budgeting, advanced analytics, and priority support
          </Text>
        </View>

        {/* Plan Selection */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          {SUBSCRIPTION_PLANS.map((plan) => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan?.id === plan.id}
              onSelect={selectPlan}
            />
          ))}
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Pro Features</Text>
          <FeatureList features={selectedPlan?.features || []} />
        </View>

        {/* Purchase Section */}
        <View style={styles.purchaseSection}>
          {purchaseError && (
            <Text style={styles.errorText}>{purchaseError}</Text>
          )}
          
          <TouchableOpacity
            style={[styles.purchaseButton, isPurchasing && styles.purchaseButtonDisabled]}
            onPress={handlePurchase}
            disabled={isPurchasing || !selectedPlan}
          >
            <Text style={styles.purchaseButtonText}>
              {isPurchasing ? 'Processing...' : `Start ${selectedPlan?.displayName}`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestorePurchases}
            disabled={isPurchasing}
          >
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any, insets: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: insets.top,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.cardBorder,
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.text,
    marginLeft: 8,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroSection: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  plansSection: {
    marginBottom: 32,
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 16,
  },
  purchaseSection: {
    paddingBottom: 32,
  },
  errorText: {
    color: theme.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  purchaseButton: {
    backgroundColor: theme.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  purchaseButtonDisabled: {
    backgroundColor: theme.textMuted,
  },
  purchaseButtonText: {
    color: theme.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  restoreButtonText: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
