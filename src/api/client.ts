import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { ENV } from "../lib/env";

const client = axios.create({ 
  baseURL: ENV.API_BASE_URL, 
  timeout: 15000 
});

client.interceptors.request.use(async (config) => {
  try {
    // Get token from secure store (simple auth)
    const session = await SecureStore.getItemAsync('simple_auth_session');
    if (session) {
      const parsedSession = JSON.parse(session);
      if (parsedSession.token) {
        config.headers.Authorization = `Bearer ${parsedSession.token}`;
      }
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return config;
});

// Add response interceptor to handle auth errors
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear stored session
      try {
        await SecureStore.deleteItemAsync('simple_auth_session');
        console.log('Cleared expired auth session');
      } catch (clearError) {
        console.error('Error clearing auth session:', clearError);
      }
    }
    return Promise.reject(error);
  }
);

export default client;