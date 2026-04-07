"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  History,
  TrendingUp,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Star,
  Timer,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Search,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import { Badge, Button, Input } from "@/components/ui";
import { MetricRing } from "@/components/enterprise/metric-ring";
import { toast } from "@/lib/stores/toast-store";

/* ══════════════════════════════════════════
   F4 — Review History / Acceptance Logs
   Table of decisions with export functionality
   ══════════════════════════════════════════ */

/* ── Mock review history ── */
const reviewHistory = [
  {
    id: "rh-001",
    deliverableId: "del-003",
    deliverable: "Monorepo Infrastructure",
    project: "Enterprise Resource Planning Platform",
    decision: "approved" as const,
    reviewer: "Priya Nair",
    reviewerInitials: "PN",
    date: "2026-03-01T09:00:00Z",
    score: 4.8,
    notes: "Excellent setup with comprehensive CI/CD.",
  },
  {
    id: "rh-002",
    deliverableId: "del-005",
    deliverable: "Design System Components",
    project: "Mobile Banking App Redesign",
    decision: "approved" as const,
    reviewer: "Priya Nair",
    reviewerInitials: "PN",
    date: "2026-03-02T10:00:00Z",
    score: 4.9,
    notes: "Beautiful and accessible components.",
  },
  {
    id: "rh-003",
    deliverableId: "del-004",
    deliverable: "Authentication Service",
    project: "Enterprise Resource Planning Platform",
    decision: "rework" as const,
    reviewer: "Arjun Kumar",
    reviewerInitials: "AK",
    date: "2026-03-05T15:00:00Z",
    score: 3.2,
    notes: "MFA flow needs refinement for edge cases.",
  },
  {
    id: "rh-004",
    deliverableId: "del-007",
    deliverable: "API Gateway Configuration",
    project: "CRM Integration Module",
    decision: "approved" as const,
    reviewer: "Priya Nair",
    reviewerInitials: "PN",
    date: "2026-02-28T14:00:00Z",
    score: 4.5,
    notes: "Clean configuration with proper rate limiting.",
  },
  {
    id: "rh-005",
    deliverableId: "del-008",
    deliverable: "Payment Processing Module",
    project: "E-Commerce Platform Migration",
    decision: "approved" as const,
    reviewer: "Arjun Kumar",
    reviewerInitials: "AK",
    date: "2026-01-18T11:30:00Z",
    score: 4.7,
    notes: "Solid implementation with proper error handling.",
  },
  {
    id: "rh-006",
    deliverableId: "del-009",
    deliverable: "User Session Management",
    project: "Enterprise Resource Planning Platform",
    decision: "rejected" as const,
    reviewer: "Priya Nair",
    reviewerInitials: "PN",
    date: "2026-02-22T16:45:00Z",
    score: 2.1,
    notes: "Critical security vulnerability in token refresh logic.",
  },
  {
    id: "rh-007",
    deliverableId: "del-010",
    deliverable: "Database Migration Scripts",
    project: "E-Commerce Platform Migration",
    decision: "approved" as const,
    reviewer: "Arjun Kumar",
    reviewerInitials: "AK",
    date: "2026-01-12T08:00:00Z",
    score: 4.6,
    notes: "Well-structured idempotent migrations.",
  },
  {
    id: "rh-008",
    deliverableId: "del-011",
    deliverable: "CI/CD Pipeline Setup",
    project: "Enterprise Resource Planning Platform",
    decision: "rework" as const,
    reviewer: "Priya Nair",
    reviewerInitials: "PN",
    date: "2026-02-25T10:15:00Z",
    score: 3.5,
    notes: "Missing staging environment configuration.",
  },
];

const decisionConfig: Record<
  string,
  { variant: "forest" | "danger" | "brown"; label: string; icon: typeof CheckCircle2 }
> = {
  approved: { variant: "forest", label: "Approved", icon: CheckCircle2 },
  rejected: { variant: "danger", label: "Rejected", icon: XCircle },
  rework: { variant: "brown", label: "Rework", icon: RotateCcw },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ── Mini sparkline bar chart ── */
function MiniTrend({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[2px] h-[24px]">
      {data.map((v, i) => (
        <div
          key={i}
          className={cn("flex-1 rounded-t-[2px] transition-all", color)}
          style={{ height: `${(v / max) * 100}%`, opacity: 0.5 + (i / data.length) * 0.5 }}
        />
      ))}
    </div>
  );
}

/* ── CSV Export ── */
function exportCSV(data: typeof reviewHistory) {
  const headers = ["Deliverable", "Project", "Reviewer", "Decision", "Date", "Score", "Notes"];
  const rows = data.map((r) => [
    r.deliverable,
    r.project,
    r.reviewer,
    r.decision,
    r.date,
    r.score.toString(),
    `"${r.notes}"`,
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `review-history-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ══════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════ */
export default function ReviewHistoryPage() {
  const [search, setSearch] = React.useState("");
  const [decisionFilter, setDecisionFilter] = React.useState<string | null>(null);
  const [projectFilter, setProjectFilter] = React.useState<string | null>(null);

  const projects = [...new Set(reviewHistory.map((r) => r.project))];

  const filtered = React.useMemo(() => {
    return reviewHistory.filter((r) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !r.deliverable.toLowerCase().includes(q) &&
          !r.project.toLowerCase().includes(q) &&
          !r.reviewer.toLowerCase().includes(q) &&
          !r.notes.toLowerCase().includes(q)
        )
          return false;
      }
      if (decisionFilter && r.decision !== decisionFilter) return false;
      if (projectFilter && r.project !== projectFilter) return false;
      return true;
    });
  }, [search, decisionFilter, projectFilter]);

  const approvedCount = reviewHistory.filter((r) => r.decision === "approved").length;
  const reworkCount = reviewHistory.filter((r) => r.decision === "rework").length;
  const avgScore =
    reviewHistory.reduce((sum, r) => sum + r.score, 0) / reviewHistory.length;
  const acceptanceRate = Math.round(
    (approvedCount / reviewHistory.length) * 100
  );
  const reworkRate = Math.round((reworkCount / reviewHistory.length) * 100);

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-6"
    >
      {/* Breadcrumb */}
      <motion.div variants={fadeUp} className="flex items-center gap-2 text-sm">
        <Link
          href="/enterprise/review"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Review Queue
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-beige-400" />
        <span className="text-beige-500">History</span>
      </motion.div>

      {/* Header with Export */}
      <motion.div variants={fadeUp} className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brown-500 to-brown-600 flex items-center justify-center shadow-md shadow-brown-500/20">
            <History className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brown-900 tracking-tight font-heading">
              Review History
            </h1>
            <p className="text-sm text-beige-600">
              Track review decisions, quality scores, and trends over time.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => exportCSV(filtered)}
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toast.info("Export PDF", "PDF export requires backend integration.")}
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </Button>
        </div>
      </motion.div>

      {/* Quality Metrics */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {/* Avg Score */}
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gold-50 flex items-center justify-center">
              <Star className="w-3.5 h-3.5 text-gold-600" />
            </div>
            <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
              Avg Score
            </span>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-brown-900 tracking-tight">
              {avgScore.toFixed(1)}
            </p>
            <MiniTrend
              data={[3.8, 4.1, 4.5, 4.2, 4.7, 4.3]}
              color="bg-gold-400"
            />
          </div>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3 text-forest-600" />
            <span className="text-[10px] font-medium text-forest-600">
              +0.3 this month
            </span>
          </div>
        </div>

        {/* Acceptance Rate */}
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-forest-50 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-forest-600" />
            </div>
            <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
              Acceptance Rate
            </span>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-brown-900 tracking-tight">
              {acceptanceRate}%
            </p>
            <MetricRing
              value={acceptanceRate}
              size={44}
              strokeWidth={3.5}
              color="forest"
            />
          </div>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3 text-forest-600" />
            <span className="text-[10px] font-medium text-forest-600">
              +5% from last month
            </span>
          </div>
        </div>

        {/* Rework Rate */}
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-brown-50 flex items-center justify-center">
              <RotateCcw className="w-3.5 h-3.5 text-brown-600" />
            </div>
            <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
              Rework Rate
            </span>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-brown-900 tracking-tight">
              {reworkRate}%
            </p>
            <MiniTrend
              data={[28, 22, 30, 25, 18, 25]}
              color="bg-brown-400"
            />
          </div>
          <div className="flex items-center gap-1 mt-1">
            <ArrowDownRight className="w-3 h-3 text-forest-600" />
            <span className="text-[10px] font-medium text-forest-600">
              -3% from last month
            </span>
          </div>
        </div>

        {/* Review Turnaround */}
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
              <Timer className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
              Turnaround
            </span>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-brown-900 tracking-tight">
              4.2h
            </p>
            <MetricRing
              value={72}
              size={44}
              strokeWidth={3.5}
              color="teal"
              label="SLA"
            />
          </div>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3 text-forest-600" />
            <span className="text-[10px] font-medium text-forest-600">
              Within 8h SLA
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Filters ── */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4"
      >
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              icon={<Search className="w-4 h-4" />}
              placeholder="Search by deliverable, project, reviewer, or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          {/* Decision filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-semibold text-beige-500 uppercase tracking-wider mr-1">
              Decision:
            </span>
            <button
              onClick={() => setDecisionFilter(null)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all",
                !decisionFilter
                  ? "bg-brown-500 text-white border-brown-500"
                  : "bg-white/60 text-brown-600 border-beige-200 hover:border-beige-300"
              )}
            >
              All
            </button>
            {(["approved", "rework", "rejected"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDecisionFilter(decisionFilter === d ? null : d)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all capitalize",
                  decisionFilter === d
                    ? "bg-brown-500 text-white border-brown-500"
                    : "bg-white/60 text-brown-600 border-beige-200 hover:border-beige-300"
                )}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Project filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-semibold text-beige-500 uppercase tracking-wider mr-1">
              Project:
            </span>
            <button
              onClick={() => setProjectFilter(null)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all",
                !projectFilter
                  ? "bg-teal-500 text-white border-teal-500"
                  : "bg-white/60 text-brown-600 border-beige-200 hover:border-beige-300"
              )}
            >
              All
            </button>
            {projects.map((p) => (
              <button
                key={p}
                onClick={() => setProjectFilter(projectFilter === p ? null : p)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all truncate max-w-[180px]",
                  projectFilter === p
                    ? "bg-teal-500 text-white border-teal-500"
                    : "bg-white/60 text-brown-600 border-beige-200 hover:border-beige-300"
                )}
              >
                {p.length > 25 ? p.slice(0, 22) + "..." : p}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* History Table */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-beige-200/50 bg-white/60 backdrop-blur-sm overflow-hidden"
      >
        {/* Table header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-beige-100 text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
          <div className="col-span-3">Deliverable</div>
          <div className="col-span-2">Project</div>
          <div className="col-span-1 text-center">Decision</div>
          <div className="col-span-2">Reviewer</div>
          <div className="col-span-1 text-center">Date</div>
          <div className="col-span-1 text-center">Score</div>
          <div className="col-span-2">Notes</div>
        </div>

        {/* Table rows */}
        {filtered.map((review) => {
          const config = decisionConfig[review.decision];
          const DecisionIcon = config.icon;

          return (
            <div
              key={review.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-3.5 border-b border-beige-100/60 last:border-b-0 hover:bg-beige-50/40 transition-colors group"
            >
              {/* Deliverable */}
              <div className="col-span-3 min-w-0">
                <p className="text-[13px] font-medium text-brown-800 truncate">
                  {review.deliverable}
                </p>
                <p className="text-[10px] text-beige-400 md:hidden mt-0.5">
                  {review.project}
                </p>
              </div>

              {/* Project */}
              <div className="col-span-2 hidden md:flex items-center min-w-0">
                <p className="text-[12px] text-beige-600 truncate">
                  {review.project}
                </p>
              </div>

              {/* Decision */}
              <div className="col-span-1 flex items-center justify-center">
                <Badge variant={config.variant} size="sm" dot>
                  {config.label}
                </Badge>
              </div>

              {/* Reviewer */}
              <div className="col-span-2 hidden md:flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brown-400 to-brown-500 flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                  {review.reviewerInitials}
                </div>
                <span className="text-[12px] text-brown-700 truncate">
                  {review.reviewer}
                </span>
              </div>

              {/* Date */}
              <div className="col-span-1 hidden md:flex items-center justify-center">
                <span className="text-[11px] text-beige-500">
                  {formatDate(review.date)}
                </span>
              </div>

              {/* Score */}
              <div className="col-span-1 flex items-center justify-center gap-1">
                <Star
                  className={cn(
                    "w-3 h-3",
                    review.score >= 4
                      ? "fill-gold-400 text-gold-400"
                      : review.score >= 3
                        ? "fill-gold-300 text-gold-300"
                        : "fill-beige-300 text-beige-300"
                  )}
                />
                <span
                  className={cn(
                    "text-[12px] font-bold",
                    review.score >= 4
                      ? "text-brown-800"
                      : review.score >= 3
                        ? "text-beige-600"
                        : "text-beige-400"
                  )}
                >
                  {review.score.toFixed(1)}
                </span>
              </div>

              {/* Notes */}
              <div className="col-span-2 hidden md:flex items-center">
                <p className="text-[10px] text-beige-500 line-clamp-2 leading-relaxed">
                  {review.notes}
                </p>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <History className="w-8 h-8 text-beige-300 mb-2" />
            <p className="text-sm text-beige-500">No matching reviews found</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
