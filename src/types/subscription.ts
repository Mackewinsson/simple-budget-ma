export interface SubscriptionPlan {
  id: string;
  name: 'monthly' | 'yearly';
  displayName: string;
  price: number;
  priceString: string;
  duration: string;
  savings?: string;
  features: string[];
  isPopular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'pro_monthly',
    name: 'monthly',
    displayName: 'Pro Monthly',
    price: 4.99,
    priceString: '$4.99',
    duration: '/month',
    features: [
      'AI Budget Creation',
      'Text-to-Transaction Input',
      'Advanced Analytics',
      'Priority Support',
      'Unlimited Categories',
      'CSV Export'
    ]
  },
  {
    id: 'pro_yearly', 
    name: 'yearly',
    displayName: 'Pro Yearly',
    price: 49.99,
    priceString: '$49.99',
    duration: '/year',
    savings: 'Save $10/year',
    isPopular: true,
    features: [
      'AI Budget Creation',
      'Text-to-Transaction Input',
      'Advanced Analytics',
      'Priority Support',
      'Unlimited Categories',
      'CSV Export'
    ]
  }
];

export interface SubscriptionState {
  isModalVisible: boolean;
  selectedPlan: SubscriptionPlan | null;
  isPurchasing: boolean;
  purchaseError: string | null;
}

export interface SubscriptionActions {
  showUpgradeModal: (featureContext?: string) => void;
  hideUpgradeModal: () => void;
  selectPlan: (plan: SubscriptionPlan) => void;
  startPurchase: () => void;
  completePurchase: (packageToPurchase?: any) => Promise<void>; // PurchasesPackage type
  setPurchaseError: (error: string | null) => void;
  restorePurchases: () => Promise<void>;
}
