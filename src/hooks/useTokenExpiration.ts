import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'expo-router';

export const useTokenExpiration = () => {
  const { session, checkTokenExpiration, isTokenExpiringSoon: isTokenExpiringSoonMethod } = useAuthStore();
  const router = useRouter();
  const checkInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!session) {
      // Clear interval if no session
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
        checkInterval.current = null;
      }
      return;
    }

    // Check token expiration every 5 minutes (less aggressive)
    checkInterval.current = setInterval(() => {
      const expired = checkTokenExpiration();
      if (expired) {
        // Token expired, redirect to login
        console.log('[useTokenExpiration] Token expired, redirecting to login');
        router.replace('/auth/login');
      }
    }, 300000); // Check every 5 minutes instead of every minute

    // Cleanup on unmount
    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, [session, checkTokenExpiration, router]);

  return {
    isTokenExpiringSoon: isTokenExpiringSoonMethod(),
    session
  };
};
