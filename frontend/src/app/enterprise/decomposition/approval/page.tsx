"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Clock,
  Layers,
  DollarSign,
  ArrowRight,
  Network,
  Zap,
  ClipboardCheck,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import { Badge } from "@/components/ui";
import { mockPlans } from "@/mocks/data/enterprise-projects";
import type { DecompositionPlan, PlanStatus } from "@/types/enterprise";

/* ── Status badge config ── */
const statusBadge: Record<
  PlanStatus,
  { variant: "beige" | "gold" | "teal" | "forest" | "brown"; label: string }
> = {
  draft: { variant: "beige", label: "Draft" },
  pending_review: { variant: "gold", label: "Pending Review" },
  approved: { variant: "teal", label: "Approved" },
  in_progress: { variant: "forest", label: "In Progress" },
  completed: { variant: "brown", label: "Completed" },
};

/* ── Complexity badge config ── */
const complexityConfig: Record<
  string,
  { variant: "forest" | "teal" | "gold" | "brown"; label: string }
> = {
  low: { variant: "forest", label: "Low" },
  medium: { variant: "teal", label: "Medium" },
  high: { variant: "gold", label: "High" },
  critical: { variant: "brown", label: "Critical" },
};

/* ── Stat card ── */
function MiniStat({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex items-center gap-4 rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 hover:shadow-lg transition-all"
    >
      <div
        className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
          accent
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[22px] font-bold text-brown-900 tracking-tight leading-none">
          {value}
        </p>
        <p className="text-[11px] text-beige-500 font-medium mt-1">{label}</p>
      </div>
    </motion.div>
  );
}

/* ── Plan approval card ── */
function ApprovalCard({ plan }: { plan: DecompositionPlan }) {
  const status = statusBadge[plan.status];
  const complexity = complexityConfig[plan.complexity];
  const updatedDate = new Date(plan.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const cost = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 0,
  }).format(plan.estimatedCost);

  const isPending = plan.status === "pending_review";

  return (
    <motion.div variants={fadeUp}>
      <Link
        href={`/enterprise/decomposition/${plan.id}/approve`}
        className="group block"
      >
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border bg-white/70 backdrop-blur-sm p-5 hover:shadow-xl hover:shadow-brown-100/20 hover:-translate-y-0.5 transition-all duration-300",
            isPending
              ? "border-gold-200/60 bg-gradient-to-r from-gold-50/30 to-white/70"
              : "border-beige-200/50"
          )}
        >
          {/* Left icon accent */}
          <div
            className={cn(
              "hidden sm:flex w-12 h-12 rounded-xl bg-gradient-to-br items-center justify-center shrink-0 transition-colors",
              isPending
                ? "from-gold-100 to-gold-200 group-hover:from-gold-200 group-hover:to-gold-300"
                : "from-teal-50 to-teal-100 group-hover:from-teal-100 group-hover:to-teal-200"
            )}
          >
            {isPending ? (
              <ClipboardCheck className="w-5 h-5 text-gold-700" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-teal-600" />
            )}
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-[14px] font-bold text-brown-900 group-hover:text-brown-700 transition-colors truncate">
                {plan.title}
              </h3>
              <Badge variant={status.variant} size="sm" dot>
                {status.label}
              </Badge>
              <Badge variant={complexity.variant} size="sm">
                {complexity.label}
              </Badge>
            </div>
            <p className="text-[11px] text-beige-500 mt-1.5">
              SOW: {plan.sowId} &middot; Updated {updatedDate}
            </p>
          </div>

          {/* Metrics inline */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="text-center hidden md:block">
              <p className="text-[16px] font-bold text-brown-800">
                {plan.totalTasks}
              </p>
              <p className="text-[10px] text-beige-500">Tasks</p>
            </div>
            <div className="hidden lg:block w-px h-8 bg-beige-200" />
            <div className="text-center hidden lg:block">
              <p className="text-[16px] font-bold text-brown-800">
                {plan.estimatedHours.toLocaleString()}h
              </p>
              <p className="text-[10px] text-beige-500">Hours</p>
            </div>
            <div className="hidden lg:block w-px h-8 bg-beige-200" />
            <div className="text-center hidden md:block">
              <p className="text-[16px] font-bold text-teal-700">{cost}</p>
              <p className="text-[10px] text-beige-500">Est. Cost</p>
            </div>

            {/* CTA indicator */}
            <div
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all",
                isPending
                  ? "bg-gold-100 text-gold-800 group-hover:bg-gold-200"
                  : "bg-teal-100 text-teal-700 group-hover:bg-teal-200"
              )}
            >
              {isPending ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  Review
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  View
                </>
              )}
            </div>

            <ArrowRight className="w-4 h-4 text-beige-300 group-hover:text-brown-500 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ==============================================================
   PLAN APPROVAL QUEUE PAGE
   ============================================================== */
export default function PlanApprovalPage() {
  /* Filter to plans needing attention: pending_review or approved */
  const approvalPlans = mockPlans.filter(
    (p) => p.status === "pending_review" || p.status === "approved"
  );

  /* Summary stats */
  const pendingCount = approvalPlans.filter(
    (p) => p.status === "pending_review"
  ).length;
  const avgCost =
    approvalPlans.length > 0
      ? approvalPlans.reduce((s, p) => s + p.estimatedCost, 0) /
        approvalPlans.length
      : 0;
  const avgCostFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 0,
  }).format(avgCost);
  const totalTasks = approvalPlans.reduce((s, p) => s + p.totalTasks, 0);

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-6"
    >
      {/* Page header */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
      >
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em]">
              Plan Approval
            </h1>
          </div>
          <p className="text-[13px] text-beige-500 mt-1 max-w-lg">
            Review and approve decomposition plans before team formation begins.
            Plans pending review require your attention.
          </p>
        </div>
        <Link
          href="/enterprise/decomposition"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-beige-200 text-beige-600 text-[12px] font-medium hover:border-brown-300 hover:text-brown-600 transition-colors"
        >
          <Network className="w-3.5 h-3.5" />
          All Plans
        </Link>
      </motion.div>

      {/* Summary stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MiniStat
          label="Plans Pending"
          value={pendingCount}
          icon={ClipboardCheck}
          accent="bg-gold-100 text-gold-700"
        />
        <MiniStat
          label="Avg Estimated Cost"
          value={avgCostFormatted}
          icon={DollarSign}
          accent="bg-teal-100 text-teal-600"
        />
        <MiniStat
          label="Total Tasks"
          value={totalTasks}
          icon={Layers}
          accent="bg-brown-100 text-brown-600"
        />
      </div>

      {/* Queue section header */}
      <motion.div
        variants={fadeUp}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-brown-900">
            Approval Queue
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-gold-100 text-gold-700">
            {approvalPlans.length}
          </span>
        </div>
        <p className="text-[11px] text-beige-500">
          Sorted by status &middot; Pending first
        </p>
      </motion.div>

      {/* Plan cards list */}
      {approvalPlans.length > 0 ? (
        <motion.div variants={stagger} className="space-y-3">
          {/* Pending plans first, then approved */}
          {approvalPlans
            .sort((a, b) => {
              if (a.status === "pending_review" && b.status !== "pending_review")
                return -1;
              if (a.status !== "pending_review" && b.status === "pending_review")
                return 1;
              return (
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
              );
            })
            .map((plan) => (
              <ApprovalCard key={plan.id} plan={plan} />
            ))}
        </motion.div>
      ) : (
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-12 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-100 to-teal-100 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-forest-500" />
          </div>
          <h3 className="text-[16px] font-bold text-brown-900 mb-1.5">
            All caught up
          </h3>
          <p className="text-[13px] text-beige-500 max-w-sm mx-auto">
            No plans are currently awaiting approval. New plans will appear here
            once AI decomposition completes.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
