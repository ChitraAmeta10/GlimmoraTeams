/**
 * Backend API base URL (no trailing slash). Override with ``NEXT_PUBLIC_API_BASE_URL``.
 */
export function getApiBaseUrl(): string {
  const raw =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL
      ? process.env.NEXT_PUBLIC_API_BASE_URL
      : "http://localhost:8000/api/v1";
  return raw.replace(/\/$/, "");
}

/** Bearer token set after login (API or Swagger paste). */
export const ACCESS_TOKEN_STORAGE_KEY = "glimmora_access_token";

/** Optional; stored when `/auth/login` or MFA completion returns a refresh token. */
export const REFRESH_TOKEN_STORAGE_KEY = "glimmora_refresh_token";

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function storeSessionTokens(accessToken: string, refreshToken?: string | null): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  }
}

export function clearSessionTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}
