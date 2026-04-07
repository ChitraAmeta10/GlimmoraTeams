"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileStack,
  ArrowUpRight,
  ChevronRight,
  Calendar,
  User2,
  TrendingUp,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, scaleIn } from "@/lib/utils/motion-variants";
import { Badge, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { MetricRing } from "@/components/enterprise/metric-ring";
import { mockDeliverables, mockProjects } from "@/mocks/data/enterprise-projects";

const statusConfig: Record<
  string,
  { variant: "gold" | "forest" | "danger" | "brown"; icon: typeof Clock; label: string }
> = {
  pending: { variant: "gold", icon: Clock, label: "Pending" },
  approved: { variant: "forest", icon: CheckCircle2, label: "Approved" },
  rejected: { variant: "danger", icon: XCircle, label: "Rejected" },
  rework: { variant: "brown", icon: RotateCcw, label: "Rework" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getProjectTitle(projectId: string): string {
  return mockProjects.find((p) => p.id === projectId)?.title ?? projectId;
}

/* ── Deliverable Card ── */
function DeliverableCard({
  deliverable,
}: {
  deliverable: (typeof mockDeliverables)[0];
}) {
  const config = statusConfig[deliverable.status];
  const StatusIcon = config.icon;
  const project = getProjectTitle(deliverable.projectId);

  return (
    <motion.div variants={scaleIn}>
      <Link
        href={`/enterprise/review/${deliverable.id}`}
        className="block group"
      >
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 hover:shadow-lg hover:shadow-brown-100/20 hover:-translate-y-0.5 transition-all duration-300">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-semibold text-brown-900 truncate group-hover:text-brown-700 transition-colors">
                {deliverable.title}
              </h3>
              <p className="text-[12px] text-beige-500 mt-0.5 truncate">
                {project}
              </p>
            </div>
            <Badge variant={config.variant} size="sm" dot>
              {config.label}
            </Badge>
          </div>

          {/* Evidence + meta */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100/60 flex items-center justify-center shrink-0">
              <FileStack className="w-5 h-5 text-teal-600" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] text-beige-600">
                <User2 className="w-3 h-3" />
                <span className="font-medium">{deliverable.submittedBy}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-beige-600">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(deliverable.submittedAt)}</span>
                <span className="text-beige-300">|</span>
                <span className="text-teal-600 font-medium">
                  {deliverable.evidenceFiles} files
                </span>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between pt-3 border-t border-beige-100/60">
            <span className="text-[10px] text-beige-400">
              {formatRelativeDate(deliverable.submittedAt)}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-brown-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Review
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* Reviewer notes (if previously reviewed) */}
          {deliverable.reviewerNotes && (
            <div className="mt-3 p-2.5 rounded-xl bg-beige-50/80 border border-beige-100/60">
              <p className="text-[11px] text-beige-600 italic leading-relaxed line-clamp-2">
                &ldquo;{deliverable.reviewerNotes}&rdquo;
              </p>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function ReviewQueuePage() {
  const pendingCount = mockDeliverables.filter(
    (d) => d.status === "pending"
  ).length;
  const approvedThisWeek = mockDeliverables.filter(
    (d) => d.status === "approved"
  ).length;
  const avgReviewTime = 4.2;
  const acceptanceRate = 72;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-6"
    >
      {/* Page Header */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brown-500 to-brown-600 flex items-center justify-center shadow-md shadow-brown-500/20">
            <ClipboardCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-brown-900 tracking-tight font-heading">
                Deliverable Review
              </h1>
              <Badge variant="gradient-gold" size="md">
                {pendingCount} Pending
              </Badge>
            </div>
            <p className="text-sm text-beige-600 mt-0.5">
              Review submitted deliverables, provide feedback, and approve work.
            </p>
          </div>
        </div>
        <Link href="/enterprise/review/history">
          <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-[1.5px] border-brown-300 text-brown-600 text-sm font-semibold hover:border-brown-500 hover:bg-brown-50 transition-all">
            <Clock className="w-4 h-4" />
            Review History
          </button>
        </Link>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {[
          {
            label: "Pending Reviews",
            value: pendingCount.toString(),
            icon: Clock,
            accent: "text-gold-600",
            bg: "bg-gold-50",
            ring: "gold" as const,
          },
          {
            label: "Approved This Week",
            value: approvedThisWeek.toString(),
            icon: CheckCircle2,
            accent: "text-forest-600",
            bg: "bg-forest-50",
            ring: "forest" as const,
          },
          {
            label: "Avg Review Time",
            value: `${avgReviewTime}h`,
            icon: Timer,
            accent: "text-teal-600",
            bg: "bg-teal-50",
            ring: "teal" as const,
          },
          {
            label: "Acceptance Rate",
            value: `${acceptanceRate}%`,
            icon: TrendingUp,
            accent: "text-brown-600",
            bg: "bg-brown-50",
            ring: "brown" as const,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center",
                      stat.bg
                    )}
                  >
                    <stat.icon className={cn("w-3.5 h-3.5", stat.accent)} />
                  </div>
                  <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <p className="text-2xl font-bold text-brown-900 tracking-tight">
                  {stat.value}
                </p>
              </div>
              <MetricRing
                value={
                  stat.label === "Acceptance Rate"
                    ? acceptanceRate
                    : stat.label === "Pending Reviews"
                      ? (pendingCount / mockDeliverables.length) * 100
                      : stat.label === "Approved This Week"
                        ? (approvedThisWeek / mockDeliverables.length) * 100
                        : 65
                }
                size={52}
                strokeWidth={4}
                color={stat.ring}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Filter Tabs + Deliverable Cards */}
      <motion.div variants={fadeUp}>
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            {([
              { value: "pending", label: "Pending", icon: Clock, badgeCls: "bg-gold-100 text-gold-700" },
              { value: "approved", label: "Approved", icon: CheckCircle2, badgeCls: "bg-forest-100 text-forest-700" },
              { value: "rejected", label: "Rejected", icon: XCircle, badgeCls: "bg-brown-100 text-brown-700" },
              { value: "rework", label: "Rework", icon: RotateCcw, badgeCls: "bg-brown-100 text-brown-700" },
            ] as const).map((tab) => {
              const count = mockDeliverables.filter((d) => d.status === tab.value).length;
              return (
                <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                  <span className={cn("ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold", tab.badgeCls)}>
                    {count}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {(["pending", "approved", "rejected", "rework"] as const).map(
            (status) => (
              <TabsContent key={status} value={status}>
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                  {mockDeliverables
                    .filter((d) => d.status === status)
                    .map((deliverable) => (
                      <DeliverableCard
                        key={deliverable.id}
                        deliverable={deliverable}
                      />
                    ))}
                  {mockDeliverables.filter((d) => d.status === status)
                    .length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16">
                      <div className="w-14 h-14 rounded-2xl bg-beige-100 flex items-center justify-center mb-3">
                        <ClipboardCheck className="w-6 h-6 text-beige-400" />
                      </div>
                      <p className="text-sm font-medium text-beige-500">
                        No {status} deliverables
                      </p>
                    </div>
                  )}
                </motion.div>
              </TabsContent>
            )
          )}
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
