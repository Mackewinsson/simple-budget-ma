import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { ENV } from "../lib/env";
import Constants from "expo-constants";

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
      // Build NextAuth signin URL with callback to our budget page, then we'll check for mobile auth
      // Use Expo development URL scheme for reliable deep linking
      // According to Expo docs: exp://127.0.0.1:8081 for localhost or exp://hostUri for network
      const expoUrl = Constants.expoConfig?.hostUri || '127.0.0.1:8081';
      const signinUrl = `${ENV.API_BASE_URL}/api/auth/signin?callbackUrl=${encodeURIComponent(`${ENV.API_BASE_URL}/budget`)}`;

      console.log('Expo URL being used:', expoUrl);
      console.log('API Base URL from ENV:', ENV.API_BASE_URL);
      console.log('Opening signin URL:', signinUrl);

      // Set up deep link listener BEFORE opening the browser
      const sub = Linking.addEventListener("url", async ({ url }) => {
        try {
          console.log('Received deep link:', url);
          console.log('Parsing deep link...');
          const parsed = Linking.parse(url);
          console.log('Parsed URL:', parsed);
          const code = parsed.queryParams?.code as string | undefined;
          console.log('Extracted code:', code);
          
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
      console.log('Opening WebBrowser with URL:', signinUrl);
      console.log('Expected redirect URL:', `${ENV.API_BASE_URL}/budget`);
      
      WebBrowser.openAuthSessionAsync(signinUrl, `${ENV.API_BASE_URL}/budget`)
        .then(async (result) => {
          console.log('WebBrowser result:', result);
          
          if (result.type === 'success') {
            console.log('WebBrowser auth completed successfully');
            sub.remove();
            
            // Now call our mobile finish route directly to get the JWT
            try {
              console.log('Calling mobile finish route...');
              const finishUrl = `${ENV.API_BASE_URL}/api/mobile/finish?redirect=exp://${expoUrl}/--/auth/callback`;
              const response = await fetch(finishUrl, {
                credentials: 'include' // Include cookies for session
              });
              
              if (response.ok) {
                console.log('Mobile finish route called successfully');
                // The response should be a redirect to our deep link
                // We'll let the deep link listener handle it
              } else {
                console.error('Mobile finish route failed:', response.status);
                reject(new Error('Failed to complete mobile authentication'));
              }
            } catch (error) {
              console.error('Error calling mobile finish route:', error);
              reject(error);
            }
          } else if (result.type === 'dismiss') {
            console.log('WebBrowser was dismissed by user');
            sub.remove();
            reject(new Error('Authentication was cancelled'));
          } else if (result.type === 'cancel') {
            console.log('WebBrowser was cancelled');
            sub.remove();
            reject(new Error('Authentication was cancelled'));
          }
        })
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
