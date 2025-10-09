import { useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export interface NetworkStatus {
  isConnected: boolean;
  isOffline: boolean;
}

export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isOffline: false,
  });

  useEffect(() => {
    let isMounted = true;

    // Simple network status check using fetch
    const checkNetworkStatus = async () => {
      try {
        // Try to fetch a small resource to check connectivity
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (isMounted) {
          setNetworkStatus({
            isConnected: true,
            isOffline: false,
          });
        }
      } catch (error) {
        if (isMounted) {
          setNetworkStatus({
            isConnected: false,
            isOffline: true,
          });
        }
      }
    };

    // Check network status on mount
    checkNetworkStatus();

    // Only check when app becomes active, not every 30 seconds
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkNetworkStatus();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, []);

  return networkStatus;
}
