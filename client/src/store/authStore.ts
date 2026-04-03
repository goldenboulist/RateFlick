import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

const TOKEN_KEY = "token";
const REFRESH_KEY = "refreshToken";

interface AuthState {
  user: User | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_KEY, refreshToken);
        set({ user });
      },
      setAccessToken: (token) => {
        localStorage.setItem(TOKEN_KEY, token);
      },
      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        set({ user: null });
      },
      getAccessToken: () => localStorage.getItem(TOKEN_KEY),
      getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
    }),
    {
      name: "rateflick-auth",
      partialize: (s) => ({ user: s.user }),
    }
  )
);
