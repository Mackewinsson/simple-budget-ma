import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/theme/ThemeContext';
import { useSubscriptionStore } from '../src/store/subscriptionStore';
import { SUBSCRIPTION_PLANS } from '../src/types/subscription';
import SubscriptionPlanCard from './SubscriptionPlanCard';
import FeatureList from './FeatureList';
import { trackUpgradeModalViewed, trackPlanSelected, trackPurchaseInitiated, trackPurchaseCompleted, trackPurchaseFailed } from '../src/lib/analytics';

interface UpgradeModalProps {
  featureContext?: string;
}

export default function UpgradeModal({ featureContext }: UpgradeModalProps) {
  const { theme } = useTheme();
  
  const {
    isModalVisible,
    selectedPlan,
    isPurchasing,
    purchaseError,
    hideUpgradeModal,
    selectPlan,
    startPurchase,
    completePurchase,
    setPurchaseError,
    restorePurchases
  } = useSubscriptionStore();

  const styles = createStyles(theme);

  // Track modal view when it becomes visible
  React.useEffect(() => {
    if (isModalVisible) {
      trackUpgradeModalViewed(featureContext);
    }
  }, [isModalVisible, featureContext]);

  const handleClose = () => {
    hideUpgradeModal();
  };

  const handlePurchase = async () => {
    if (!selectedPlan) return;

    try {
      startPurchase();
      trackPurchaseInitiated(selectedPlan.id, selectedPlan.displayName, selectedPlan.price);
      
      // Mock purchase flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      completePurchase();
      trackPurchaseCompleted(selectedPlan.id, selectedPlan.displayName, selectedPlan.price);
      
      Alert.alert(
        'Welcome to Pro!',
        `You've successfully upgraded to ${selectedPlan.displayName}. Enjoy all the premium features!`,
        [{ text: 'Get Started', style: 'default' }]
      );
    } catch (error) {
      const errorMessage = 'Purchase failed. Please try again.';
      setPurchaseError(errorMessage);
      trackPurchaseFailed(selectedPlan.id, errorMessage);
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
    <Modal
      visible={isModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons name="sparkles" size={24} color={theme.primary} />
            <Text style={styles.title}>Upgrade to Pro</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {featureContext && (
            <Text style={styles.contextText}>
              Unlock {featureContext} and all Pro features
            </Text>
          )}

          {/* Plan Selection */}
          <View style={styles.plansContainer}>
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
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Pro Features</Text>
            <FeatureList features={selectedPlan?.features || []} />
          </View>
        </ScrollView>

        {/* Purchase Button */}
        <View style={styles.purchaseContainer}>
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
      </View>
    </Modal>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.cardBorder,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.text,
    marginLeft: 8,
  },
  closeButton: {
    padding: 4,
  },
  contextText: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 24,
    marginTop: 20,
    textAlign: 'center',
  },
  plansContainer: {
    marginBottom: 24,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 12,
  },
  purchaseContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.cardBorder,
    backgroundColor: theme.background,
  },
  errorText: {
    color: theme.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
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
