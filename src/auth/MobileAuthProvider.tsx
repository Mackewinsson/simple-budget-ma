import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useMobileAuth, MobileSession, MobileUser } from './useMobileAuth';

interface AuthContextType {
  session: MobileSession | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  isAuthenticated: false,
});

export function MobileAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<MobileSession | null>(null);
  const [loading, setLoading] = useState(true);
  const { signIn: mobileSignIn, signOut: mobileSignOut, getStoredToken } = useMobileAuth();

  // Load session from storage on app start
  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const token = await getStoredToken();
      if (token) {
        // Create a basic session object with the stored token
        // In a real app, you might want to decode the JWT to get user info
        const session: MobileSession = {
          user: {
            id: 'user-id', // You could decode this from the JWT
            email: 'user@example.com', // You could decode this from the JWT
            name: 'User', // You could decode this from the JWT
          },
          token,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
        setSession(session);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    try {
      setLoading(true);
      const newSession = await mobileSignIn();
      if (newSession) {
        setSession(newSession);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await mobileSignOut();
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        loading, 
        signIn, 
        signOut, 
        isAuthenticated: !!session 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a MobileAuthProvider');
  }
  return context;
};
