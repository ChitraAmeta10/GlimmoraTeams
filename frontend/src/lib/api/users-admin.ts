import { getApiBaseUrl } from "./config";

/** Matches ``CreateReviewerResponse.model_dump(by_alias=True)``. */
export type ReviewerLifecycleStatus = "ACTIVE" | "INVITED" | "EXPIRED";

export interface CreateReviewerResult {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  designation: string;
  department: string;
  username: string;
  language: string;
  timeZone: string;
  status: ReviewerLifecycleStatus;
  role: string;
  requiresPasswordChange: boolean;
  isFirstLogin: boolean;
  temporary_password: string;
}

interface BaseResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}

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

async function parseBaseResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Invalid JSON (${res.status})`);
  }
  if (!res.ok) {
    throw new Error(formatHttpError(body) || `Request failed (${res.status})`);
  }
  const wrapped = body as BaseResponse<T>;
  if (wrapped && typeof wrapped === "object" && "data" in wrapped && wrapped.data !== undefined) {
    return wrapped.data as T;
  }
  throw new Error("Unexpected response shape");
}

function normalizeCreateReviewerData(raw: CreateReviewerResult): CreateReviewerResult {
  const ext = raw as CreateReviewerResult & { temporaryPassword?: string };
  const pw = ext.temporary_password || ext.temporaryPassword;
  if (!pw) {
    throw new Error("Server did not return a temporary password.");
  }
  return { ...ext, temporary_password: pw };
}

export type CreateReviewerPayload = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  designation: string;
  department: string;
  username: string;
  language: string;
  timeZone: string;
  status: ReviewerLifecycleStatus;
};

/**
 * Platform admin only: ``POST /users`` creates a reviewer and returns a one-time temporary password.
 */
export async function createReviewerUser(
  accessToken: string,
  payload: CreateReviewerPayload
): Promise<CreateReviewerResult> {
  const res = await fetch(`${getApiBaseUrl()}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
      designation: payload.designation,
      department: payload.department,
      username: payload.username,
      language: payload.language,
      timeZone: payload.timeZone,
      status: payload.status,
    }),
    cache: "no-store",
  });
  const data = await parseBaseResponse<CreateReviewerResult>(res);
  return normalizeCreateReviewerData(data);
}
