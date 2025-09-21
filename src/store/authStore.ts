import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { login } from '../api/auth';
import client from '../api/client';

// Helper function to decode JWT token and get expiration
const getTokenExpiration = (token: string): string => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return new Date(exp).toISOString();
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    // Fallback to 7 days from now
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  }
};

// Custom storage for Expo SecureStore
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch (error) {
      console.error('Error getting item from secure storage:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error('Error setting item in secure storage:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error('Error removing item from secure storage:', error);
    }
  },
};

export interface User {
  id: string;
  email: string;
  name?: string;
  plan?: string;
  isPaid?: boolean;
  trialEnd?: string;
}

export interface Session {
  user: User;
  token: string;
  expires: string;
}

interface AuthState {
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadSession: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      loading: true,
      isAuthenticated: false,

      setLoading: (loading: boolean) => {
        console.log('[AuthStore] Setting loading:', loading);
        set({ loading });
      },

      loadSession: async () => {
        try {
          console.log('[AuthStore] Loading session from storage...');
          set({ loading: true });
          
          const storedSession = await SecureStore.getItemAsync('auth_session');
          if (storedSession) {
            const parsedSession = JSON.parse(storedSession);
            console.log('[AuthStore] Found stored session:', parsedSession);
            
            // Check if session is still valid
            if (new Date(parsedSession.expires) > new Date()) {
              set({ 
                session: parsedSession, 
                isAuthenticated: true,
                loading: false 
              });
              console.log('[AuthStore] Session is valid, setting authenticated state');
            } else {
              // Session expired, clear it
              console.log('[AuthStore] Session expired, clearing it');
              await SecureStore.deleteItemAsync('auth_session');
              set({ 
                session: null, 
                isAuthenticated: false,
                loading: false 
              });
            }
          } else {
            console.log('[AuthStore] No stored session found');
            set({ 
              session: null, 
              isAuthenticated: false,
              loading: false 
            });
          }
        } catch (error) {
          console.error('[AuthStore] Error loading session:', error);
          set({ 
            session: null, 
            isAuthenticated: false,
            loading: false 
          });
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          console.log('[AuthStore] Starting login process...');
          set({ loading: true });
          
          // Call the login endpoint
          const response = await login({ email, password });
          console.log('[AuthStore] Login response received:', response);
          
          // Calculate expiration from JWT token if not provided
          const expires = response.expires || getTokenExpiration(response.token);
          console.log('[AuthStore] Token expires at:', expires);
          
          const newSession: Session = {
            user: response.user,
            token: response.token,
            expires,
          };

          // Store session securely
          await SecureStore.setItemAsync('auth_session', JSON.stringify(newSession));
          
          set({ 
            session: newSession, 
            isAuthenticated: true,
            loading: false 
          });
          
          console.log('[AuthStore] Session stored and state updated:', newSession);
          console.log('[AuthStore] isAuthenticated set to: true');
        } catch (error) {
          console.error('[AuthStore] Error signing in:', error);
          set({ loading: false });
          throw error;
        }
      },

      signOut: async () => {
        try {
          console.log('[AuthStore] Signing out...');
          
          // Clear stored session
          await SecureStore.deleteItemAsync('auth_session');
          
          set({ 
            session: null, 
            isAuthenticated: false,
            loading: false 
          });
          
          // Optionally call your API to revoke the session
          const { session } = get();
          if (session?.token) {
            try {
              await client.post('/api/auth/logout');
            } catch (error) {
              console.error('[AuthStore] Error calling logout endpoint:', error);
            }
          }
        } catch (error) {
          console.error('[AuthStore] Error signing out:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ 
        session: state.session,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
