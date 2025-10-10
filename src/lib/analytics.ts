// Analytics helper for tracking subscription events
// Currently using console.log for mock implementation
// In production, integrate with your preferred analytics service (Firebase, Mixpanel, etc.)

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class Analytics {
  private static instance: Analytics;
  
  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  private track(event: AnalyticsEvent): void {
    // Mock implementation - replace with real analytics service
    console.log(`[Analytics] ${event.event}`, {
      ...event.properties,
      timestamp: event.timestamp || Date.now()
    });
  }

  // Subscription-related events
  upgradeModalViewed(context?: string): void {
    this.track({
      event: 'upgrade_modal_viewed',
      properties: { context }
    });
  }

  planSelected(planId: string, planName: string): void {
    this.track({
      event: 'plan_selected',
      properties: { planId, planName }
    });
  }

  purchaseInitiated(planId: string, planName: string, price: number): void {
    this.track({
      event: 'purchase_initiated',
      properties: { planId, planName, price }
    });
  }

  purchaseCompleted(planId: string, planName: string, price: number): void {
    this.track({
      event: 'purchase_completed',
      properties: { planId, planName, price }
    });
  }

  purchaseFailed(planId: string, error: string): void {
    this.track({
      event: 'purchase_failed',
      properties: { planId, error }
    });
  }

  restorePurchasesInitiated(): void {
    this.track({
      event: 'restore_purchases_initiated'
    });
  }

  restorePurchasesCompleted(): void {
    this.track({
      event: 'restore_purchases_completed'
    });
  }

  restorePurchasesFailed(error: string): void {
    this.track({
      event: 'restore_purchases_failed',
      properties: { error }
    });
  }

  upgradeScreenViewed(): void {
    this.track({
      event: 'upgrade_screen_viewed'
    });
  }

  featureAccessDenied(featureKey: string): void {
    this.track({
      event: 'feature_access_denied',
      properties: { featureKey }
    });
  }

  // General app events
  appOpened(): void {
    this.track({
      event: 'app_opened'
    });
  }

  userSignedIn(method: string): void {
    this.track({
      event: 'user_signed_in',
      properties: { method }
    });
  }

  userSignedOut(): void {
    this.track({
      event: 'user_signed_out'
    });
  }
}

// Export singleton instance
export const analytics = Analytics.getInstance();

// Convenience functions for common events
export const trackUpgradeModalViewed = (context?: string) => 
  analytics.upgradeModalViewed(context);

export const trackPlanSelected = (planId: string, planName: string) => 
  analytics.planSelected(planId, planName);

export const trackPurchaseInitiated = (planId: string, planName: string, price: number) => 
  analytics.purchaseInitiated(planId, planName, price);

export const trackPurchaseCompleted = (planId: string, planName: string, price: number) => 
  analytics.purchaseCompleted(planId, planName, price);

export const trackPurchaseFailed = (planId: string, error: string) => 
  analytics.purchaseFailed(planId, error);

export const trackFeatureAccessDenied = (featureKey: string) => 
  analytics.featureAccessDenied(featureKey);
