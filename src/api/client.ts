import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { ENV } from "../lib/env";

const client = axios.create({ 
  baseURL: ENV.API_BASE_URL, 
  timeout: 15000 
});

client.interceptors.request.use(async (config) => {
  try {
    // Get JWT token from secure store (mobile auth)
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      // Token expired or invalid, clear stored token
      try {
        await SecureStore.deleteItemAsync('auth_token');
        console.log('Cleared expired auth token');
      } catch (clearError) {
        console.error('Error clearing auth token:', clearError);
      }
    }
    return Promise.reject(error);
  }
);

export default client;