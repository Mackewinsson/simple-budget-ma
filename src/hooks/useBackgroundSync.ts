import { useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';

export function useBackgroundSync() {
  const queryClient = useQueryClient();
  const { session } = useAuthStore();

  const syncCriticalData = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      // Only refetch queries that are stale and not currently fetching
      await queryClient.refetchQueries({
        predicate: (query) => {
          const isStale = Date.now() - (query.state.dataUpdatedAt || 0) > 5 * 60 * 1000; // 5 minutes
          const isNotFetching = !query.state.fetchStatus || query.state.fetchStatus !== 'fetching';
          const isUserData = query.queryKey.includes(session.user.id);
          const isCriticalData = query.queryKey.some(key => 
            typeof key === 'string' && ['budgets', 'expenses', 'categories'].includes(key)
          );
          
          return isStale && isNotFetching && isUserData && isCriticalData;
        }
      });
      
      console.log('[Background Sync] Critical data synced successfully');
    } catch (error) {
      console.log('[Background Sync] Error syncing data:', error);
    }
  }, [queryClient, session?.user?.id]);

  useEffect(() => {
    let syncInterval: NodeJS.Timeout;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // Sync immediately when app becomes active
        syncCriticalData();
        
        // Set up periodic sync while app is active
        syncInterval = setInterval(syncCriticalData, 2 * 60 * 1000); // Every 2 minutes
      } else {
        // Clear interval when app goes to background
        if (syncInterval) {
          clearInterval(syncInterval);
        }
      }
    };

    // Set up app state listener
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Initial sync if app is already active
    if (AppState.currentState === 'active') {
      syncCriticalData();
      syncInterval = setInterval(syncCriticalData, 2 * 60 * 1000);
    }

    return () => {
      subscription?.remove();
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, [syncCriticalData]);

  return { syncCriticalData };
}
