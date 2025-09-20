import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jsonMMKV } from "./_persist";

type AuthState = {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setUserId: (userId: string | null) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      isAuthenticated: false,
      setToken: (token) => set({ 
        token, 
        isAuthenticated: !!token 
      }),
      setUserId: (userId) => set({ userId }),
      logout: () => set({ 
        token: null, 
        userId: null, 
        isAuthenticated: false 
      }),
    }),
    { 
      name: "auth", 
      storage: jsonMMKV() 
    }
  )
);
