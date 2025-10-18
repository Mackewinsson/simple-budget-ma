import Purchases, { 
  PurchasesOffering, 
  PurchasesPackage, 
  CustomerInfo,
  PurchasesError,
  LOG_LEVEL
} from 'react-native-purchases';
import Constants from 'expo-constants';
import { logDev } from './devUtils';

// RevenueCat Configuration
const REVENUECAT_API_KEY_IOS = Constants.expoConfig?.extra?.REVENUECAT_API_KEY_IOS;

// Product IDs (these should match your App Store Connect products)
export const PRODUCT_IDS = {
  PRO_MONTHLY: 'com.simplebudget.pro.monthly',
  PRO_YEARLY: 'com.simplebudget.pro.yearly',
} as const;

// Entitlement IDs (these should match your RevenueCat dashboard)
export const ENTITLEMENT_IDS = {
  PRO: 'pro',
} as const;

// Offering IDs (these should match your RevenueCat dashboard)
export const OFFERING_IDS = {
  DEFAULT: 'default',
} as const;

export interface RevenueCatConfig {
  apiKey: string;
  userId?: string;
  debugLogsEnabled?: boolean;
}

export interface PurchaseResult {
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}

export interface RestoreResult {
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}

class RevenueCatService {
  private isInitialized = false;
  private isInitializing = false;

  /**
   * Initialize RevenueCat SDK
   */
  async initialize(config?: RevenueCatConfig): Promise<boolean> {
    if (this.isInitialized) {
      logDev('[RevenueCat] Already initialized');
      return true;
    }

    if (this.isInitializing) {
      logDev('[RevenueCat] Initialization in progress...');
      return false;
    }

    try {
      this.isInitializing = true;
      
      const apiKey = config?.apiKey || REVENUECAT_API_KEY_IOS;
      
      if (!apiKey) {
        throw new Error('RevenueCat API key not found. Please set EXPO_PUBLIC_REVENUECAT_API_KEY_IOS in your environment variables.');
      }

      logDev('[RevenueCat] Initializing with API key:', apiKey.substring(0, 10) + '...');

      // Configure RevenueCat
      await Purchases.configure({
        apiKey,
        appUserID: config?.userId,
      });

      // Enable debug logs in development
      if (__DEV__ || config?.debugLogsEnabled) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
        logDev('[RevenueCat] Debug logs enabled');
      }

      // Set user ID if provided
      if (config?.userId) {
        await Purchases.logIn(config.userId);
        logDev('[RevenueCat] User logged in:', config.userId);
      }

      this.isInitialized = true;
      this.isInitializing = false;
      
      logDev('[RevenueCat] Initialization successful');
      return true;

    } catch (error) {
      this.isInitializing = false;
      logDev('[RevenueCat] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Get current customer info
   */
  async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const customerInfo = await Purchases.getCustomerInfo();
      logDev('[RevenueCat] Customer info retrieved:', {
        userId: customerInfo.originalAppUserId,
        activeSubscriptions: customerInfo.activeSubscriptions,
        entitlements: Object.keys(customerInfo.entitlements.active),
      });
      
      return customerInfo;
    } catch (error) {
      logDev('[RevenueCat] Failed to get customer info:', error);
      return null;
    }
  }

  /**
   * Get available offerings
   */
  async getOfferings(): Promise<PurchasesOffering[] | null> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const offerings = await Purchases.getOfferings();
      logDev('[RevenueCat] Offerings retrieved:', {
        current: offerings.current?.identifier,
        available: Object.keys(offerings.all),
      });
      
      return Object.values(offerings.all);
    } catch (error) {
      logDev('[RevenueCat] Failed to get offerings:', error);
      return null;
    }
  }

  /**
   * Get current offering
   */
  async getCurrentOffering(): Promise<PurchasesOffering | null> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;
      
      logDev('[RevenueCat] Current offering:', currentOffering?.identifier);
      return currentOffering || null;
    } catch (error) {
      logDev('[RevenueCat] Failed to get current offering:', error);
      return null;
    }
  }

  /**
   * Purchase a package
   */
  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<PurchaseResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      logDev('[RevenueCat] Starting purchase for package:', packageToPurchase.identifier);

      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      
      logDev('[RevenueCat] Purchase successful:', {
        packageId: packageToPurchase.identifier,
        productId: packageToPurchase.storeProduct.identifier,
        activeSubscriptions: customerInfo.activeSubscriptions,
      });

      return {
        success: true,
        customerInfo,
      };
    } catch (error) {
      const purchasesError = error as PurchasesError;
      
      logDev('[RevenueCat] Purchase failed:', {
        code: purchasesError.code,
        message: purchasesError.message,
        underlyingErrorMessage: purchasesError.underlyingErrorMessage,
      });

      // Handle user cancellation
      if (purchasesError.code === 'PURCHASES_ERROR_PURCHASE_CANCELLED') {
        return {
          success: false,
          error: 'Purchase was cancelled',
        };
      }

      return {
        success: false,
        error: purchasesError.message || 'Purchase failed',
      };
    }
  }

  /**
   * Restore purchases
   */
  async restorePurchases(): Promise<RestoreResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      logDev('[RevenueCat] Restoring purchases...');

      const customerInfo = await Purchases.restorePurchases();
      
      logDev('[RevenueCat] Purchases restored:', {
        userId: customerInfo.originalAppUserId,
        activeSubscriptions: customerInfo.activeSubscriptions,
        entitlements: Object.keys(customerInfo.entitlements.active),
      });

      return {
        success: true,
        customerInfo,
      };
    } catch (error) {
      const purchasesError = error as PurchasesError;
      
      logDev('[RevenueCat] Restore failed:', {
        code: purchasesError.code,
        message: purchasesError.message,
      });

      return {
        success: false,
        error: purchasesError.message || 'Failed to restore purchases',
      };
    }
  }

  /**
   * Check if user has active entitlement
   */
  async hasActiveEntitlement(entitlementId: string): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      if (!customerInfo) return false;

      const hasEntitlement = customerInfo.entitlements.active[entitlementId] !== undefined;
      logDev('[RevenueCat] Has active entitlement:', entitlementId, hasEntitlement);
      
      return hasEntitlement;
    } catch (error) {
      logDev('[RevenueCat] Failed to check entitlement:', error);
      return false;
    }
  }

  /**
   * Get active entitlements
   */
  async getActiveEntitlements(): Promise<string[]> {
    try {
      const customerInfo = await this.getCustomerInfo();
      if (!customerInfo) return [];

      const activeEntitlements = Object.keys(customerInfo.entitlements.active);
      logDev('[RevenueCat] Active entitlements:', activeEntitlements);
      
      return activeEntitlements;
    } catch (error) {
      logDev('[RevenueCat] Failed to get active entitlements:', error);
      return [];
    }
  }

  /**
   * Log out current user
   */
  async logOut(): Promise<CustomerInfo | null> {
    try {
      if (!this.isInitialized) {
        return null;
      }

      logDev('[RevenueCat] Logging out user...');
      const customerInfo = await Purchases.logOut();
      
      logDev('[RevenueCat] User logged out successfully');
      return customerInfo;
    } catch (error) {
      logDev('[RevenueCat] Failed to log out:', error);
      return null;
    }
  }

  /**
   * Set user ID
   */
  async setUserId(userId: string): Promise<CustomerInfo | null> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      logDev('[RevenueCat] Setting user ID:', userId);
      const customerInfo = await Purchases.logIn(userId);
      
      logDev('[RevenueCat] User ID set successfully');
      return customerInfo;
    } catch (error) {
      logDev('[RevenueCat] Failed to set user ID:', error);
      return null;
    }
  }

  /**
   * Get initialization status
   */
  getInitializationStatus(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const revenueCatService = new RevenueCatService();

// Export types
export type { PurchasesOffering, PurchasesPackage, CustomerInfo, PurchasesError };
