import { getApiBaseUrl } from "./config";

export type AuthLoginUser = {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isMfaEnabled?: boolean;
};

export type LoginSuccess = {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in?: number;
  user: AuthLoginUser;
};

export type LoginMfaRequired = {
  mfa_required: true;
  email: string;
};

function formatHttpError(body: unknown): string {
  if (typeof body === "object" && body !== null && "detail" in body) {
    const d = (body as { detail: unknown }).detail;
    if (typeof d === "string") return d;
    if (Array.isArray(d)) {
      return d
        .map((x) =>
          typeof x === "object" && x !== null && "msg" in x
            ? String((x as { msg: unknown }).msg)
            : String(x)
        )
        .join("; ");
    }
  }
  return "Request failed";
}

async function readJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

/** ``POST /auth/login`` — either tokens + user, or ``mfa_required`` (step 2). */
export async function postAuthLogin(payload: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<LoginSuccess | LoginMfaRequired> {
  const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      rememberMe: payload.rememberMe ?? false,
    }),
    cache: "no-store",
  });
  const data = (await readJson(res)) as Record<string, unknown>;
  if (!res.ok) {
    throw new Error(formatHttpError(data) || `Login failed (${res.status})`);
  }
  if (data.mfa_required === true && typeof data.email === "string") {
    return { mfa_required: true, email: data.email };
  }
  if (typeof data.access_token === "string" && typeof data.refresh_token === "string") {
    const user = (data.user && typeof data.user === "object" ? data.user : {}) as AuthLoginUser;
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      token_type: typeof data.token_type === "string" ? data.token_type : undefined,
      expires_in: typeof data.expires_in === "number" ? data.expires_in : undefined,
      user,
    };
  }
  throw new Error("Unexpected login response from server.");
}

/** ``POST /auth/mfa/verify`` — TOTP after ``mfa_required``. */
export async function postAuthMfaTotp(payload: {
  email: string;
  code: string;
  rememberMe?: boolean;
}): Promise<LoginSuccess> {
  const res = await fetch(`${getApiBaseUrl()}/auth/mfa/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: payload.email,
      code: payload.code,
      rememberMe: payload.rememberMe ?? false,
    }),
    cache: "no-store",
  });
  const data = (await readJson(res)) as Record<string, unknown>;
  if (!res.ok) {
    throw new Error(formatHttpError(data) || `MFA failed (${res.status})`);
  }
  if (typeof data.access_token === "string" && typeof data.refresh_token === "string") {
    const user = (data.user && typeof data.user === "object" ? data.user : {}) as AuthLoginUser;
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user,
    };
  }
  throw new Error("Unexpected MFA response from server.");
}

/** ``POST /auth/mfa/recovery`` — one-time recovery code after ``mfa_required``. */
export async function postAuthMfaRecovery(payload: {
  email: string;
  recoveryCode: string;
  rememberMe?: boolean;
}): Promise<LoginSuccess> {
  const res = await fetch(`${getApiBaseUrl()}/auth/mfa/recovery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: payload.email,
      recoveryCode: payload.recoveryCode.trim(),
      rememberMe: payload.rememberMe ?? false,
    }),
    cache: "no-store",
  });
  const data = (await readJson(res)) as Record<string, unknown>;
  if (!res.ok) {
    throw new Error(formatHttpError(data) || `Recovery login failed (${res.status})`);
  }
  if (typeof data.access_token === "string" && typeof data.refresh_token === "string") {
    const user = (data.user && typeof data.user === "object" ? data.user : {}) as AuthLoginUser;
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user,
    };
  }
  throw new Error("Unexpected recovery response from server.");
}
