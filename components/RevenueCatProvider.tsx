import React, { useEffect } from 'react';
import { useRevenueCat } from '../src/hooks/useRevenueCat';
import { useAuthStore } from '../src/store/authStore';
import { logDev } from '../src/lib/devUtils';

interface RevenueCatProviderProps {
  children: React.ReactNode;
}

export default function RevenueCatProvider({ children }: RevenueCatProviderProps) {
  const { initialize, isInitialized, isInitializing } = useRevenueCat();
  const { session } = useAuthStore();

  useEffect(() => {
    const initializeRevenueCat = async () => {
      if (!isInitialized && !isInitializing) {
        try {
          logDev('[RevenueCatProvider] Initializing RevenueCat...');
          
          // Initialize with user ID if available
          const userId = session?.user?.id;
          const success = await initialize(userId);
          
          if (success) {
            logDev('[RevenueCatProvider] RevenueCat initialized successfully');
          } else {
            logDev('[RevenueCatProvider] RevenueCat initialization failed');
          }
        } catch (error) {
          logDev('[RevenueCatProvider] RevenueCat initialization error:', error);
        }
      }
    };

    initializeRevenueCat();
  }, [initialize, isInitialized, isInitializing, session?.user?.id]);

  // Re-initialize when user changes
  useEffect(() => {
    if (isInitialized && session?.user?.id) {
      logDev('[RevenueCatProvider] User changed, re-initializing RevenueCat with new user ID');
      initialize(session.user.id);
    }
  }, [session?.user?.id, initialize, isInitialized]);

  return <>{children}</>;
}
