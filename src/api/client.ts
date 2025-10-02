import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { ENV } from "../lib/env";

const client = axios.create({ 
  baseURL: ENV.API_BASE_URL, 
  timeout: 30000 // Increased timeout to 30 seconds
});

client.interceptors.request.use(async (config) => {
  try {
    console.log('[API Client] Making request to:', config.baseURL + config.url);
    console.log('[API Client] Full URL:', config.url);
    console.log('[API Client] Base URL:', config.baseURL);
    
    // Get token from secure store (auth)
    const session = await SecureStore.getItemAsync('auth_session');
    if (session) {
      const parsedSession = JSON.parse(session);
      if (parsedSession.token) {
        config.headers.Authorization = `Bearer ${parsedSession.token}`;
        console.log('[API Client] Added auth token to request');
      }
    } else {
      console.log('[API Client] No auth session found');
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return config;
});

// Add response interceptor to handle auth errors
client.interceptors.response.use(
  (response) => {
    console.log('[API Client] Response received:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.log('[API Client] Request error:', error.message);
    console.log('[API Client] Error code:', error.code);
    console.log('[API Client] Error config:', error.config?.url);
    
    if (error.response?.status === 401) {
      // Token expired or invalid, clear stored session
      try {
        await SecureStore.deleteItemAsync('auth_session');
        console.log('Cleared expired auth session');
      } catch (clearError) {
        console.error('Error clearing auth session:', clearError);
      }
    }
    return Promise.reject(error);
  }
);

export default client;