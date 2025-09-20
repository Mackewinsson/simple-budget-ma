import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { authConfig, Session, User } from './config';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: authConfig.google.clientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: makeRedirectUri({
        scheme: 'budgetingmobile',
        path: 'auth',
      }),
    },
    {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    }
  );

  // Load session from storage on app start
  useEffect(() => {
    loadSession();
  }, []);

  // Handle auth response
  useEffect(() => {
    if (response?.type === 'success') {
      handleAuthResponse(response);
    }
  }, [response]);

  const loadSession = async () => {
    try {
      const storedSession = await SecureStore.getItemAsync('auth_session');
      if (storedSession) {
        const parsedSession = JSON.parse(storedSession);
        // Check if session is still valid
        if (new Date(parsedSession.expires) > new Date()) {
          setSession(parsedSession);
        } else {
          // Session expired, clear it
          await SecureStore.deleteItemAsync('auth_session');
        }
      }
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthResponse = async (response: any) => {
    try {
      // Exchange authorization code for tokens
      const tokenResponse = await fetch(`${authConfig.api.baseUrl}/api/auth/callback/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: response.params.code,
          redirectUri: authConfig.google.redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for tokens');
      }

      const { user, accessToken, expires } = await tokenResponse.json();
      
      const newSession: Session = {
        user,
        accessToken,
        expires,
      };

      // Store session securely
      await SecureStore.setItemAsync('auth_session', JSON.stringify(newSession));
      setSession(newSession);
    } catch (error) {
      console.error('Error handling auth response:', error);
    }
  };

  const signIn = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = async () => {
    try {
      // Clear stored session
      await SecureStore.deleteItemAsync('auth_session');
      setSession(null);
      
      // Optionally call your API to revoke the session
      if (session?.accessToken) {
        await fetch(`${authConfig.api.baseUrl}/api/auth/signout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
