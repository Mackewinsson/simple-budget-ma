import { create } from 'zustand';
import { SUBSCRIPTION_PLANS, SubscriptionPlan, SubscriptionState, SubscriptionActions } from '../types/subscription';
import { useAuthStore } from './authStore';

interface SubscriptionStore extends SubscriptionState, SubscriptionActions {}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  // State
  isModalVisible: false,
  selectedPlan: SUBSCRIPTION_PLANS[1], // Default to yearly plan
  isPurchasing: false,
  purchaseError: null,

  // Actions
  showUpgradeModal: () => {
    set({ isModalVisible: true, purchaseError: null });
  },

  hideUpgradeModal: () => {
    set({ isModalVisible: false, purchaseError: null });
  },

  selectPlan: (plan: SubscriptionPlan) => {
    set({ selectedPlan: plan, purchaseError: null });
  },

  startPurchase: () => {
    set({ isPurchasing: true, purchaseError: null });
  },

  completePurchase: () => {
    const { selectedPlan } = get();
    set({ isPurchasing: false, isModalVisible: false });
    
    // Mock purchase completion - update user plan
    const authStore = useAuthStore.getState();
    if (authStore.session) {
      authStore.updateUserPlan('pro');
    }
    
    console.log(`[Subscription] Mock purchase completed for ${selectedPlan?.displayName}`);
  },

  setPurchaseError: (error: string | null) => {
    set({ purchaseError: error, isPurchasing: false });
  },

  restorePurchases: async () => {
    set({ isPurchasing: true });
    
    try {
      // Mock restore purchases
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, this would check with App Store/Google Play
      console.log('[Subscription] Mock restore purchases completed');
      
      set({ isPurchasing: false });
    } catch (error) {
      set({ 
        isPurchasing: false, 
        purchaseError: 'Failed to restore purchases. Please try again.' 
      });
    }
  }
}));
