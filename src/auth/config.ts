import Constants from 'expo-constants';

export interface AuthConfig {
  google: {
    clientId: string;
    redirectUri: string;
  };
  api: {
    baseUrl: string;
  };
}

export const authConfig: AuthConfig = {
  google: {
    clientId: Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID as string || '',
    redirectUri: 'budgetingmobile://auth',
  },
  api: {
    baseUrl: Constants.expoConfig?.extra?.API_BASE_URL as string || 'http://localhost:3001',
  },
};

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

export interface Session {
  user: User;
  accessToken: string;
  expires: string;
}