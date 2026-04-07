import { getApiBaseUrl } from "./config";

export interface ReviewerDashboardPayload {
  assignedTaskCount: number;
  pendingEvidenceReviews: number;
  completedLast30Days: number;
  evidenceRecommendationsAccept: number;
  evidenceRecommendationsRework: number;
  evidenceApprovalRatePercent: number | null;
}

export interface ReviewerQueueItem {
  id: string;
  title: string;
  status: string;
  assignedAt: string | null;
  taskKind?: string;
  relatedId?: string;
  notes?: string;
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
  if (wrapped && typeof wrapped === "object" && "data" in wrapped) {
    return wrapped.data;
  }
  throw new Error("Unexpected response shape");
}

export async function fetchReviewerDashboard(
  accessToken: string
): Promise<ReviewerDashboardPayload> {
  const res = await fetch(`${getApiBaseUrl()}/reviewer/dashboard`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  return parseBaseResponse<ReviewerDashboardPayload>(res);
}

export async function fetchReviewerProjects(
  accessToken: string
): Promise<ReviewerQueueItem[]> {
  const res = await fetch(`${getApiBaseUrl()}/reviewer/projects`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  return parseBaseResponse<ReviewerQueueItem[]>(res);
}

export async function fetchAuthMe(accessToken: string): Promise<{
  firstName?: string;
  lastName?: string;
  email?: string;
}> {
  const res = await fetch(`${getApiBaseUrl()}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  return parseBaseResponse(res);
}
