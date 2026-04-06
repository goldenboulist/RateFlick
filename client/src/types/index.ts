export interface User {
  id: string;
  email: string;
}

export interface Entry {
  id: string;
  userId: string;
  title: string;
  rating: number;
  genres: string[];
  description: string | null;
  posterUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ThemeId =
  | "dark"
  | "light"
  | "red"
  | "purple"
  | "forest"
  | "gold"
  | "ocean"
  | "coral-reef"
  | "warm-sunset";
