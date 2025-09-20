import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { ENV } from "../lib/env";

WebBrowser.maybeCompleteAuthSession();

export interface MobileUser {
  id: string;
  email?: string;
  name?: string;
}

export interface MobileSession {
  user: MobileUser;
  token: string;
  expires: string;
}

export function useMobileAuth() {
  const signIn = async (): Promise<MobileSession | null> => {
    return new Promise((resolve, reject) => {
      // Build NextAuth signin URL with callback to our /mobile/finish route
      const finish = `${ENV.API_BASE_URL}/api/mobile/finish?redirect=myapp://auth/callback`;
      const signinUrl = `${ENV.API_BASE_URL}/api/auth/signin?callbackUrl=${encodeURIComponent(finish)}`;

      console.log('Opening signin URL:', signinUrl);

      const sub = Linking.addEventListener("url", async ({ url }) => {
        try {
          console.log('Received deep link:', url);
          const parsed = Linking.parse(url);
          const code = parsed.queryParams?.code as string | undefined;
          
          if (!code) {
            console.error('No code found in deep link');
            reject(new Error('No authentication code received'));
            return;
          }

          console.log('Exchanging code for JWT:', code);
          
          // Exchange code for JWT token
          const { data } = await axios.get(`${ENV.API_BASE_URL}/api/mobile/exchange`, { 
            params: { code } 
          });

          if (!data.token) {
            throw new Error('No token received from exchange');
          }

          console.log('JWT token received, length:', data.token.length);

          // Store the JWT token securely
          await SecureStore.setItemAsync("auth_token", data.token);

          // Create session object
          const session: MobileSession = {
            user: {
              id: data.user?.id || 'unknown',
              email: data.user?.email,
            },
            token: data.token,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          };

          resolve(session);
        } catch (error) {
          console.error('Error in auth flow:', error);
          reject(error);
        } finally {
          WebBrowser.dismissBrowser();
          sub.remove();
        }
      });

      // Open the authentication session
      WebBrowser.openAuthSessionAsync(signinUrl, "myapp://auth/callback")
        .catch((error) => {
          console.error('Error opening auth session:', error);
          sub.remove();
          reject(error);
        });
    });
  };

  const signOut = async (): Promise<void> => {
    try {
      // Clear the stored JWT token
      await SecureStore.deleteItemAsync("auth_token");
      
      // Optionally call the web signout endpoint
      try {
        await axios.post(`${ENV.API_BASE_URL}/api/auth/signout`);
      } catch (error) {
        console.log('Web signout failed (this is okay):', error);
      }
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const getStoredToken = async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync("auth_token");
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  };

  const isAuthenticated = async (): Promise<boolean> => {
    const token = await getStoredToken();
    return token !== null;
  };

  return { 
    signIn, 
    signOut, 
    getStoredToken, 
    isAuthenticated 
  };
}
