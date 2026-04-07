"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  RotateCcw,
  ArrowUpRight,
  Star,
  Timer,
} from "lucide-react";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardContent,
  StatCard,
  Badge,
  Button,
  Progress,
  Avatar,
  AvatarFallback,
} from "@/components/ui";
import {
  getStoredAccessToken,
  ACCESS_TOKEN_STORAGE_KEY,
} from "@/lib/api/config";
import {
  fetchAuthMe,
  fetchReviewerDashboard,
  fetchReviewerProjects,
  type ReviewerDashboardPayload,
  type ReviewerQueueItem,
} from "@/lib/api/reviewer";

function initials(first?: string, last?: string, email?: string): string {
  if (first || last) {
    return `${(first || "").slice(0, 1)}${(last || "").slice(0, 1)}`.toUpperCase() || "?";
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "?";
}

function displayName(me: { firstName?: string; lastName?: string; email?: string } | null): string {
  if (!me) return "Reviewer";
  const n = [me.firstName, me.lastName].filter(Boolean).join(" ");
  return n || me.email || "Reviewer";
}

export default function MentorDashboardPage() {
  const [token, setToken] = useState<string | null>(null);
  const [me, setMe] = useState<{ firstName?: string; lastName?: string; email?: string } | null>(null);
  const [dash, setDash] = useState<ReviewerDashboardPayload | null>(null);
  const [queue, setQueue] = useState<ReviewerQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (t: string) => {
    setLoading(true);
    setError(null);
    try {
      const [d, q, profile] = await Promise.all([
        fetchReviewerDashboard(t),
        fetchReviewerProjects(t),
        fetchAuthMe(t).catch(() => null),
      ]);
      setDash(d);
      setQueue(q);
      setMe(profile);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load reviewer data.");
      setDash(null);
      setQueue([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = getStoredAccessToken();
    setToken(t);
    if (t) void load(t);
    else {
      setLoading(false);
    }
  }, [load]);

  const openItems = queue.filter((x) => x.status !== "completed");
  const name = displayName(me);
  const urgentHint =
    dash && dash.pendingEvidenceReviews > 0
      ? `${dash.pendingEvidenceReviews} evidence pending`
      : "All clear";

  const accept = dash?.evidenceRecommendationsAccept ?? 0;
  const rework = dash?.evidenceRecommendationsRework ?? 0;
  const totalDecisions = accept + rework;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-brown-950">
          Reviewer Dashboard
        </h1>
        <p className="text-sm text-beige-600 mt-1">
          {loading && token ? (
            "Loading your workspace…"
          ) : !token ? (
            <>
              Sign in and store your access token in{" "}
              <code className="text-xs bg-beige-100 px-1 rounded">localStorage</code> as{" "}
              <code className="text-xs bg-beige-100 px-1 rounded">{ACCESS_TOKEN_STORAGE_KEY}</code>{" "}
              (or set <code className="text-xs bg-beige-100 px-1 rounded">NEXT_PUBLIC_API_BASE_URL</code>) to
              load live data from the API.
            </>
          ) : error ? (
            <span className="text-amber-700">{error}</span>
          ) : (
            <>
              Welcome back, {name}. You have {openItems.length} open assignment
              {openItems.length === 1 ? "" : "s"} in your queue.
            </>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          variant="gradient-forest"
          label="Open assignments"
          value={dash ? String(dash.assignedTaskCount) : "—"}
          change={token && !error ? urgentHint : undefined}
          changeType="neutral"
          icon={<ClipboardCheck className="w-5 h-5 text-white/80" />}
        />
        <StatCard
          variant="glass"
          label="Pending evidence"
          value={dash ? String(dash.pendingEvidenceReviews) : "—"}
          changeType="neutral"
          subtitle="Needs ACCEPT/REWORK"
          icon={<Timer className="w-5 h-5 text-forest-600" />}
        />
        <StatCard
          variant="glass"
          label="Completed (30d)"
          value={dash ? String(dash.completedLast30Days) : "—"}
          changeType="positive"
          subtitle="Assignments closed"
          icon={<CheckCircle2 className="w-5 h-5 text-teal-600" />}
        />
        <StatCard
          variant="glass"
          label="Evidence approval rate"
          value={
            dash?.evidenceApprovalRatePercent != null
              ? `${dash.evidenceApprovalRatePercent}%`
              : "—"
          }
          change={
            totalDecisions > 0 ? `${rework} rework` : undefined
          }
          changeType="neutral"
          icon={<Star className="w-5 h-5 text-gold-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2" hover="none">
          <GlassCardHeader>
            <div className="flex items-center justify-between">
              <GlassCardTitle>Review queue</GlassCardTitle>
              <Button variant="ghost" size="sm" type="button" disabled={!token || !!error}>
                View Full Queue <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </GlassCardHeader>
          <GlassCardContent>
            {loading && token ? (
              <p className="text-sm text-beige-600 py-8 text-center">Loading queue…</p>
            ) : !token ? (
              <p className="text-sm text-beige-600 py-8 text-center">
                No API token — queue data is unavailable.
              </p>
            ) : openItems.length === 0 ? (
              <p className="text-sm text-beige-600 py-8 text-center">Your queue is empty.</p>
            ) : (
              <div className="space-y-3">
                {openItems.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-beige-100 hover:border-forest-200 hover:bg-forest-50/30 transition-all"
                  >
                    <Avatar size="sm">
                      <AvatarFallback>
                        {initials(undefined, undefined, item.title)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-semibold text-sm text-brown-900 truncate">
                          {item.title}
                        </p>
                        <Badge variant="forest" size="sm">
                          {item.taskKind || "task"}
                        </Badge>
                        <Badge variant={item.status === "pending" ? "gold" : "forest"} size="sm">
                          {item.status}
                        </Badge>
                        {item.taskKind === "evidence_review" && (
                          <Badge variant="danger" size="sm" dot>
                            Evidence
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-beige-600">
                        {item.relatedId && <span>Ref: {item.relatedId}</span>}
                        {item.notes && <span className="truncate">{item.notes}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Clock className="w-3.5 h-3.5 text-beige-400" />
                      <span className="text-xs font-semibold text-beige-600">
                        {item.assignedAt
                          ? new Date(item.assignedAt).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCardContent>
        </GlassCard>

        <GlassCard hover="none">
          <GlassCardHeader>
            <GlassCardTitle>Evidence recommendations</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="space-y-4">
              {[
                {
                  label: "Accepted",
                  count: accept,
                  total: Math.max(totalDecisions, 1),
                  color: "gradient-forest" as const,
                  icon: CheckCircle2,
                },
                {
                  label: "Rework requested",
                  count: rework,
                  total: Math.max(totalDecisions, 1),
                  color: "gold" as const,
                  icon: RotateCcw,
                },
              ].map((metric) => (
                <div key={metric.label} className="p-3 rounded-xl bg-beige-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <metric.icon className="w-4 h-4 text-beige-500" />
                      <p className="text-sm font-medium text-brown-800">{metric.label}</p>
                    </div>
                    <p className="text-sm font-bold text-brown-900">{metric.count}</p>
                  </div>
                  <Progress
                    value={Math.round((metric.count / metric.total) * 100)}
                    size="sm"
                    variant={metric.color}
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-forest-500 to-teal-600 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">
                Approval rate (evidence)
              </p>
              <p className="font-heading text-3xl font-bold">
                {dash?.evidenceApprovalRatePercent != null
                  ? `${dash.evidenceApprovalRatePercent}%`
                  : "—"}
              </p>
              <p className="text-xs text-white/60 mt-1">
                Based on ACCEPT vs REWORK recommendations you recorded
              </p>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  );
}
