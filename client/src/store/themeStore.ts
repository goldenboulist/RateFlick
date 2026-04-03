import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeId } from "../types";

interface ThemeState {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (theme) => set({ theme }),
    }),
    { name: "rateflick-theme" }
  )
);
