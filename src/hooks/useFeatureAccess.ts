import { useAuthStore } from '../store/authStore';
import { FEATURES, FeatureKey } from '../lib/features';
import { Alert } from 'react-native';

export interface FeatureAccess {
  hasAccess: boolean;
  showUpgradeModal: () => void;
}

export const useFeatureAccess = (featureKey: FeatureKey): FeatureAccess => {
  const { session } = useAuthStore();
  
  // Check if user has pro plan
  const hasAccess = session?.user?.plan === "pro";
  
  const showUpgradeModal = () => {
    const feature = FEATURES[featureKey];
    Alert.alert(
      "Pro Feature",
      `This is a Pro feature! Upgrade to Pro to unlock ${feature.label.toLowerCase()}. ${feature.description}`,
      [
        {
          text: "Maybe Later",
          style: "cancel"
        },
        {
          text: "Upgrade to Pro",
          style: "default",
          onPress: () => {
            // TODO: Navigate to upgrade screen or open upgrade modal
            console.log('Navigate to upgrade screen');
          }
        }
      ]
    );
  };

  return {
    hasAccess,
    showUpgradeModal
  };
};
