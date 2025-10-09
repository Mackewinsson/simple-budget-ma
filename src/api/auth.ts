import client from "./client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    plan?: string;
    isPaid?: boolean;
    trialEnd?: string;
  };
  token: string;
  expires?: string; // Optional since API doesn't always return it
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const { data } = await client.post('/api/mobile-login', credentials);
  return data;
};

export const logout = async (): Promise<void> => {
  await client.post('/api/auth/logout');
};

// Google auth code exchange (expo-auth-session -> backend)
export interface GoogleExchangeParams {
  code: string;
  redirectUri: string;
}

export interface GoogleUser {
  id: string;
  email?: string;
  name?: string;
  image?: string;
}

export interface GoogleExchangeResponse {
  user: GoogleUser;
  accessToken?: string; // some backends return accessToken
  token?: string;       // normalize to token
  expires: string;
}

export const exchangeGoogleCode = async (
  params: GoogleExchangeParams
): Promise<LoginResponse> => {
  const { data } = await client.post<GoogleExchangeResponse>(
    '/api/auth/callback/google',
    params
  );

  const normalizedToken = (data as any).token ?? (data as any).accessToken;

  return {
    user: {
      id: data.user.id,
      email: data.user.email || '',
      name: data.user.name || data.user.email || 'google-user',
    },
    token: normalizedToken,
    expires: data.expires,
  };
};

