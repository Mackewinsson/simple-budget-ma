import { useState, useEffect } from 'react';

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
    // Simple network status check using fetch
    const checkNetworkStatus = async () => {
      try {
        // Try to fetch a small resource to check connectivity
        const response = await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
        });
        setNetworkStatus({
          isConnected: true,
          isOffline: false,
        });
      } catch (error) {
        setNetworkStatus({
          isConnected: false,
          isOffline: true,
        });
      }
    };

    // Check network status on mount
    checkNetworkStatus();

    // Set up periodic checks
    const interval = setInterval(checkNetworkStatus, 30000); // Check every 30 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  return networkStatus;
}
