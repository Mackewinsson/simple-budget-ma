import { useAuthStore } from '../store/authStore';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { FEATURES, FeatureKey } from '../lib/features';
import { trackFeatureAccessDenied } from '../lib/analytics';

export interface FeatureAccess {
  hasAccess: boolean;
  showUpgradeModal: () => void;
}

export const useFeatureAccess = (featureKey: FeatureKey): FeatureAccess => {
  const { session } = useAuthStore();
  const { showUpgradeModal: openModal } = useSubscriptionStore();
  
  // Check if user has pro plan
  const hasAccess = session?.user?.plan === "pro" || session?.user?.isPaid === true;
  
  const showUpgradeModal = () => {
    const feature = FEATURES[featureKey];
    trackFeatureAccessDenied(featureKey);
    openModal();
    console.log(`[FeatureAccess] Showing upgrade modal for: ${feature.label}`);
  };

  return {
    hasAccess,
    showUpgradeModal
  };
};
