import { useAuthStore } from "../store/authStore";

const BASE = import.meta.env.VITE_API_URL ?? "/api";

async function refreshAccessToken(): Promise<string | null> {
  const refresh = useAuthStore.getState().getRefreshToken();
  if (!refresh) return null;
  const res = await fetch(`${BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: refresh }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { accessToken: string };
  useAuthStore.getState().setAccessToken(data.accessToken);
  return data.accessToken;
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
  retried = false
): Promise<T> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });
  if (
    res.status === 401 &&
    !retried &&
    path !== "/auth/refresh" &&
    token
  ) {
    const newToken = await refreshAccessToken();
    if (newToken) return apiFetch<T>(path, options, true);
    useAuthStore.getState().logout();
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err.message === "string" ? err.message : "Erreur serveur"
    );
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function apiFetchLogout(): Promise<void> {
  const token = localStorage.getItem("token");
  await fetch(`${BASE}/auth/logout`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
