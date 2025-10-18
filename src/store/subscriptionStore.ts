import { create } from 'zustand';
import { SUBSCRIPTION_PLANS, SubscriptionPlan, SubscriptionState, SubscriptionActions } from '../types/subscription';
import { useAuthStore } from './authStore';
import { revenueCatService, ENTITLEMENT_IDS, type PurchasesPackage } from '../lib/revenueCat';
import { logDev } from '../lib/devUtils';

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

  completePurchase: async (packageToPurchase?: PurchasesPackage) => {
    const { selectedPlan } = get();
    
    try {
      if (packageToPurchase) {
        // Real RevenueCat purchase
        logDev('[Subscription] Starting RevenueCat purchase for package:', packageToPurchase.identifier);
        
        const result = await revenueCatService.purchasePackage(packageToPurchase);
        
        if (result.success && result.customerInfo) {
          // Check if user now has pro access
          const hasProAccess = await revenueCatService.hasActiveEntitlement(ENTITLEMENT_IDS.PRO);
          
          if (hasProAccess) {
            // Update auth store with pro plan
            const authStore = useAuthStore.getState();
            if (authStore.session) {
              authStore.updateUserPlan('pro');
            }
            
            set({ isPurchasing: false, isModalVisible: false, purchaseError: null });
            logDev('[Subscription] RevenueCat purchase completed successfully');
          } else {
            set({ 
              isPurchasing: false, 
              purchaseError: 'Purchase completed but pro access not granted. Please contact support.' 
            });
          }
        } else {
          set({ 
            isPurchasing: false, 
            purchaseError: result.error || 'Purchase failed. Please try again.' 
          });
        }
      } else {
        // Fallback to mock purchase for development
        set({ isPurchasing: false, isModalVisible: false });
        
        const authStore = useAuthStore.getState();
        if (authStore.session) {
          authStore.updateUserPlan('pro');
        }
        
        logDev(`[Subscription] Mock purchase completed for ${selectedPlan?.displayName}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Purchase failed. Please try again.';
      set({ isPurchasing: false, purchaseError: errorMessage });
      logDev('[Subscription] Purchase failed:', error);
    }
  },

  setPurchaseError: (error: string | null) => {
    set({ purchaseError: error, isPurchasing: false });
  },

  restorePurchases: async () => {
    set({ isPurchasing: true, purchaseError: null });
    
    try {
      logDev('[Subscription] Starting RevenueCat restore purchases...');
      
      const result = await revenueCatService.restorePurchases();
      
      if (result.success && result.customerInfo) {
        // Check if user has pro access after restore
        const hasProAccess = await revenueCatService.hasActiveEntitlement(ENTITLEMENT_IDS.PRO);
        
        if (hasProAccess) {
          // Update auth store with pro plan
          const authStore = useAuthStore.getState();
          if (authStore.session) {
            authStore.updateUserPlan('pro');
          }
          
          logDev('[Subscription] RevenueCat restore completed successfully - user has pro access');
        } else {
          logDev('[Subscription] RevenueCat restore completed - no active subscriptions found');
        }
        
        set({ isPurchasing: false, purchaseError: null });
      } else {
        set({ 
          isPurchasing: false, 
          purchaseError: result.error || 'Failed to restore purchases. Please try again.' 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to restore purchases. Please try again.';
      set({ 
        isPurchasing: false, 
        purchaseError: errorMessage 
      });
      logDev('[Subscription] Restore failed:', error);
    }
  }
}));
