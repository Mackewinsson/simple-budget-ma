import axios, { InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";
import { ENV } from "../lib/env";

// Extend Axios config to include metadata
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: { startTime: number };
}

// Import Reactotron for API monitoring
let reactotron: any = null;
if (__DEV__) {
  try {
    reactotron = require('../lib/reactotron').default;
  } catch (error) {
    console.log('Reactotron not available:', error);
  }
}

const client = axios.create({ 
  baseURL: ENV.API_BASE_URL, 
  timeout: 30000 // Increased timeout to 30 seconds
});

client.interceptors.request.use(async (config: ExtendedAxiosRequestConfig) => {
  try {
    const fullUrl = (config.baseURL || '') + (config.url || '');
    console.log('[API Client] Making request to:', fullUrl);
    console.log('[API Client] Full URL:', config.url);
    console.log('[API Client] Base URL:', config.baseURL);
    
    // Add timing metadata
    config.metadata = { startTime: Date.now() };
    
    // Log to Reactotron
    if (reactotron) {
      reactotron.apisauce?.('REQUEST', {
        method: config.method?.toUpperCase(),
        url: fullUrl,
        headers: config.headers,
        data: config.data,
        params: config.params,
      });
    }
    
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
    
    // Log to Reactotron
    if (reactotron) {
      const config = response.config as ExtendedAxiosRequestConfig;
      reactotron.apisauce?.('RESPONSE', {
        method: config.method?.toUpperCase(),
        url: (config.baseURL || '') + (config.url || ''),
        status: response.status,
        headers: response.headers,
        data: response.data,
        duration: Date.now() - (config.metadata?.startTime || Date.now()),
      });
    }
    
    return response;
  },
  async (error) => {
    console.log('[API Client] Request error:', error.message);
    console.log('[API Client] Error code:', error.code);
    console.log('[API Client] Error config:', error.config?.url);
    
    // Log error to Reactotron
    if (reactotron && error.config) {
      const config = error.config as ExtendedAxiosRequestConfig;
      reactotron.apisauce?.('ERROR', {
        method: config.method?.toUpperCase(),
        url: (config.baseURL || '') + (config.url || ''),
        status: error.response?.status,
        headers: error.response?.headers,
        data: error.response?.data,
        error: error.message,
        duration: Date.now() - (config.metadata?.startTime || Date.now()),
      });
    }
    
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