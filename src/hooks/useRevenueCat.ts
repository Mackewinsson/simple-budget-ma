import { useState, useEffect, useCallback } from 'react';
import { 
  revenueCatService, 
  ENTITLEMENT_IDS, 
  OFFERING_IDS,
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
  type PurchaseResult,
  type RestoreResult
} from '../lib/revenueCat';
import { logDev } from '../lib/devUtils';

export interface RevenueCatState {
  // Initialization
  isInitialized: boolean;
  isInitializing: boolean;
  
  // Customer info
  customerInfo: CustomerInfo | null;
  isLoadingCustomerInfo: boolean;
  
  // Offerings
  offerings: PurchasesOffering[];
  currentOffering: PurchasesOffering | null;
  isLoadingOfferings: boolean;
  
  // Entitlements
  hasProAccess: boolean;
  activeEntitlements: string[];
  
  // Purchase state
  isPurchasing: boolean;
  purchaseError: string | null;
  
  // Restore state
  isRestoring: boolean;
  restoreError: string | null;
}

export interface RevenueCatActions {
  // Initialization
  initialize: (userId?: string) => Promise<boolean>;
  
  // Customer info
  refreshCustomerInfo: () => Promise<void>;
  
  // Offerings
  refreshOfferings: () => Promise<void>;
  
  // Purchases
  purchasePackage: (packageToPurchase: PurchasesPackage) => Promise<PurchaseResult>;
  
  // Restore
  restorePurchases: () => Promise<RestoreResult>;
  
  // User management
  setUserId: (userId: string) => Promise<void>;
  logOut: () => Promise<void>;
  
  // Error handling
  clearErrors: () => void;
}

export interface UseRevenueCatReturn extends RevenueCatState, RevenueCatActions {}

export const useRevenueCat = (): UseRevenueCatReturn => {
  // State
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoadingCustomerInfo, setIsLoadingCustomerInfo] = useState(false);
  const [offerings, setOfferings] = useState<PurchasesOffering[]>([]);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(false);
  const [hasProAccess, setHasProAccess] = useState(false);
  const [activeEntitlements, setActiveEntitlements] = useState<string[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  // Initialize RevenueCat
  const initialize = useCallback(async (userId?: string): Promise<boolean> => {
    if (isInitialized || isInitializing) {
      return isInitialized;
    }

    try {
      setIsInitializing(true);
      setPurchaseError(null);
      setRestoreError(null);

      logDev('[useRevenueCat] Initializing RevenueCat...');
      
      const success = await revenueCatService.initialize({
        userId,
        debugLogsEnabled: __DEV__,
      });

      if (success) {
        setIsInitialized(true);
        logDev('[useRevenueCat] RevenueCat initialized successfully');
        
        // Load initial data
        await Promise.all([
          refreshCustomerInfo(),
          refreshOfferings(),
        ]);
      }

      return success;
    } catch (error) {
      logDev('[useRevenueCat] Initialization failed:', error);
      setPurchaseError(error instanceof Error ? error.message : 'Failed to initialize RevenueCat');
      return false;
    } finally {
      setIsInitializing(false);
    }
  }, [isInitialized, isInitializing]);

  // Refresh customer info
  const refreshCustomerInfo = useCallback(async (): Promise<void> => {
    try {
      setIsLoadingCustomerInfo(true);
      setPurchaseError(null);
      setRestoreError(null);

      logDev('[useRevenueCat] Refreshing customer info...');
      
      const info = await revenueCatService.getCustomerInfo();
      setCustomerInfo(info);

      if (info) {
        // Check pro access
        const proAccess = await revenueCatService.hasActiveEntitlement(ENTITLEMENT_IDS.PRO);
        setHasProAccess(proAccess);

        // Get active entitlements
        const entitlements = await revenueCatService.getActiveEntitlements();
        setActiveEntitlements(entitlements);

        logDev('[useRevenueCat] Customer info refreshed:', {
          userId: info.originalAppUserId,
          hasProAccess: proAccess,
          activeEntitlements: entitlements,
        });
      }
    } catch (error) {
      logDev('[useRevenueCat] Failed to refresh customer info:', error);
      setPurchaseError(error instanceof Error ? error.message : 'Failed to load customer info');
    } finally {
      setIsLoadingCustomerInfo(false);
    }
  }, []);

  // Refresh offerings
  const refreshOfferings = useCallback(async (): Promise<void> => {
    try {
      setIsLoadingOfferings(true);
      setPurchaseError(null);
      setRestoreError(null);

      logDev('[useRevenueCat] Refreshing offerings...');
      
      const [allOfferings, current] = await Promise.all([
        revenueCatService.getOfferings(),
        revenueCatService.getCurrentOffering(),
      ]);

      setOfferings(allOfferings || []);
      setCurrentOffering(current);

      logDev('[useRevenueCat] Offerings refreshed:', {
        totalOfferings: allOfferings?.length || 0,
        currentOffering: current?.identifier,
      });
    } catch (error) {
      logDev('[useRevenueCat] Failed to refresh offerings:', error);
      setPurchaseError(error instanceof Error ? error.message : 'Failed to load offerings');
    } finally {
      setIsLoadingOfferings(false);
    }
  }, []);

  // Purchase package
  const purchasePackage = useCallback(async (packageToPurchase: PurchasesPackage): Promise<PurchaseResult> => {
    try {
      setIsPurchasing(true);
      setPurchaseError(null);

      logDev('[useRevenueCat] Starting purchase for package:', packageToPurchase.identifier);
      
      const result = await revenueCatService.purchasePackage(packageToPurchase);

      if (result.success && result.customerInfo) {
        // Update customer info
        setCustomerInfo(result.customerInfo);
        
        // Update pro access
        const proAccess = await revenueCatService.hasActiveEntitlement(ENTITLEMENT_IDS.PRO);
        setHasProAccess(proAccess);

        // Update active entitlements
        const entitlements = await revenueCatService.getActiveEntitlements();
        setActiveEntitlements(entitlements);

        logDev('[useRevenueCat] Purchase successful:', {
          packageId: packageToPurchase.identifier,
          hasProAccess: proAccess,
          activeEntitlements: entitlements,
        });
      } else {
        setPurchaseError(result.error || 'Purchase failed');
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Purchase failed';
      setPurchaseError(errorMessage);
      logDev('[useRevenueCat] Purchase failed:', error);
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsPurchasing(false);
    }
  }, []);

  // Restore purchases
  const restorePurchases = useCallback(async (): Promise<RestoreResult> => {
    try {
      setIsRestoring(true);
      setRestoreError(null);

      logDev('[useRevenueCat] Restoring purchases...');
      
      const result = await revenueCatService.restorePurchases();

      if (result.success && result.customerInfo) {
        // Update customer info
        setCustomerInfo(result.customerInfo);
        
        // Update pro access
        const proAccess = await revenueCatService.hasActiveEntitlement(ENTITLEMENT_IDS.PRO);
        setHasProAccess(proAccess);

        // Update active entitlements
        const entitlements = await revenueCatService.getActiveEntitlements();
        setActiveEntitlements(entitlements);

        logDev('[useRevenueCat] Restore successful:', {
          hasProAccess: proAccess,
          activeEntitlements: entitlements,
        });
      } else {
        setRestoreError(result.error || 'Failed to restore purchases');
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to restore purchases';
      setRestoreError(errorMessage);
      logDev('[useRevenueCat] Restore failed:', error);
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsRestoring(false);
    }
  }, []);

  // Set user ID
  const setUserId = useCallback(async (userId: string): Promise<void> => {
    try {
      logDev('[useRevenueCat] Setting user ID:', userId);
      
      const info = await revenueCatService.setUserId(userId);
      if (info) {
        setCustomerInfo(info);
        
        // Update pro access
        const proAccess = await revenueCatService.hasActiveEntitlement(ENTITLEMENT_IDS.PRO);
        setHasProAccess(proAccess);

        // Update active entitlements
        const entitlements = await revenueCatService.getActiveEntitlements();
        setActiveEntitlements(entitlements);
      }
    } catch (error) {
      logDev('[useRevenueCat] Failed to set user ID:', error);
      setPurchaseError(error instanceof Error ? error.message : 'Failed to set user ID');
    }
  }, []);

  // Log out
  const logOut = useCallback(async (): Promise<void> => {
    try {
      logDev('[useRevenueCat] Logging out...');
      
      const info = await revenueCatService.logOut();
      if (info) {
        setCustomerInfo(info);
        setHasProAccess(false);
        setActiveEntitlements([]);
      }
    } catch (error) {
      logDev('[useRevenueCat] Failed to log out:', error);
      setPurchaseError(error instanceof Error ? error.message : 'Failed to log out');
    }
  }, []);

  // Clear errors
  const clearErrors = useCallback((): void => {
    setPurchaseError(null);
    setRestoreError(null);
  }, []);

  // Auto-initialize on mount
  useEffect(() => {
    if (!isInitialized && !isInitializing) {
      initialize();
    }
  }, [initialize, isInitialized, isInitializing]);

  return {
    // State
    isInitialized,
    isInitializing,
    customerInfo,
    isLoadingCustomerInfo,
    offerings,
    currentOffering,
    isLoadingOfferings,
    hasProAccess,
    activeEntitlements,
    isPurchasing,
    purchaseError,
    isRestoring,
    restoreError,
    
    // Actions
    initialize,
    refreshCustomerInfo,
    refreshOfferings,
    purchasePackage,
    restorePurchases,
    setUserId,
    logOut,
    clearErrors,
  };
};
