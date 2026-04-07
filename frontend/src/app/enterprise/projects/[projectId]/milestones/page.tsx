"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Flag,
  Layers,
  ListChecks,
  Package,
  Target,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import { Badge, Progress } from "@/components/ui";
import { mockProjects, mockMilestones, mockTasks } from "@/mocks/data/enterprise-projects";
import type { Milestone, MilestoneStatus } from "@/types/enterprise";

/* ── Milestone status config ── */
const msConfig: Record<
  MilestoneStatus,
  {
    label: string;
    badge: "beige" | "teal" | "forest" | "danger";
    dot: string;
    line: string;
    progress: "brown" | "teal" | "forest" | "gold";
    icon: React.ElementType;
    ring: string;
  }
> = {
  upcoming: {
    label: "Upcoming",
    badge: "beige",
    dot: "bg-beige-300 border-beige-200",
    line: "bg-beige-200",
    progress: "brown",
    icon: Clock,
    ring: "ring-beige-100",
  },
  in_progress: {
    label: "In Progress",
    badge: "teal",
    dot: "bg-teal-500 border-teal-200",
    line: "bg-teal-300",
    progress: "teal",
    icon: Zap,
    ring: "ring-teal-100",
  },
  completed: {
    label: "Completed",
    badge: "forest",
    dot: "bg-forest-500 border-forest-200",
    line: "bg-forest-400",
    progress: "forest",
    icon: CheckCircle2,
    ring: "ring-forest-100",
  },
  overdue: {
    label: "Overdue",
    badge: "danger",
    dot: "bg-[var(--danger)] border-gold-200",
    line: "bg-beige-200",
    progress: "gold",
    icon: Flag,
    ring: "ring-gold-100",
  },
};

/* ── Expandable Milestone Card ── */
function MilestoneCard({
  milestone,
  isLast,
}: {
  milestone: Milestone;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = React.useState(milestone.status === "in_progress");
  const config = msConfig[milestone.status];
  const Icon = config.icon;

  /* Mock tasks for this milestone */
  const milestoneTasks = mockTasks.slice(0, milestone.tasksTotal).map((t, i) => ({
    ...t,
    title: i < milestone.tasksCompleted
      ? `${t.title} (Done)`
      : t.title,
    isDone: i < milestone.tasksCompleted,
  }));

  return (
    <div className="flex gap-4 md:gap-6">
      {/* Vertical line + dot */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={cn(
            "w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 bg-white transition-all ring-4",
            config.dot,
            config.ring
          )}
        >
          <Icon
            className={cn(
              "w-4.5 h-4.5",
              milestone.status === "upcoming" ? "text-beige-400" : "text-white"
            )}
          />
        </div>
        {!isLast && (
          <div className={cn("w-0.5 flex-1 mt-1 min-h-[20px]", config.line)} />
        )}
      </div>

      {/* Card content */}
      <motion.div
        variants={fadeUp}
        className={cn(
          "flex-1 rounded-2xl border bg-white/70 backdrop-blur-sm p-5 mb-4 hover:shadow-lg transition-all cursor-pointer",
          milestone.status === "in_progress"
            ? "border-teal-200/80 hover:shadow-teal-100/25"
            : milestone.status === "completed"
            ? "border-forest-200/50 hover:shadow-forest-100/15"
            : milestone.status === "overdue"
            ? "border-gold-200/50 hover:shadow-gold-100/15"
            : "border-beige-200/50 hover:shadow-brown-100/15"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[15px] font-bold text-brown-900">
                {milestone.title}
              </h3>
              <Badge variant={config.badge} size="sm" dot>
                {config.label}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <span className="text-[11px] text-beige-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Due {new Date(milestone.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
              <span className="text-[11px] text-beige-500 flex items-center gap-1">
                <ListChecks className="w-3 h-3" />
                {milestone.tasksCompleted}/{milestone.tasksTotal} tasks
              </span>
              <span className="text-[11px] text-beige-500 flex items-center gap-1">
                <Package className="w-3 h-3" />
                {milestone.deliverables} deliverables
              </span>
              <span className="text-[11px] text-beige-500 flex items-center gap-1">
                <Target className="w-3 h-3" />
                ${(milestone.budget / 1000).toFixed(0)}k budget
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-[18px] font-bold text-brown-900 tracking-tight leading-none">
                {milestone.progress}%
              </p>
            </div>
            <button
              className="w-7 h-7 rounded-lg bg-beige-100 flex items-center justify-center text-beige-500 hover:bg-beige-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <Progress value={milestone.progress} size="sm" variant={config.progress} />
        </div>

        {/* Expanded task list */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-beige-100/80 space-y-2">
                <p className="text-[10px] text-beige-500 font-medium uppercase tracking-wider mb-2">
                  Tasks
                </p>
                {milestoneTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-beige-50/60 transition-colors"
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                        task.isDone
                          ? "bg-forest-500 text-white"
                          : "border-2 border-beige-300"
                      )}
                    >
                      {task.isDone && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-[12px] truncate",
                          task.isDone
                            ? "text-beige-500 line-through"
                            : "text-brown-800 font-medium"
                        )}
                      >
                        {task.title.replace(" (Done)", "")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-[9px] font-bold px-1.5 py-0.5 rounded-md",
                          task.priority === "critical"
                            ? "bg-gold-50 text-[var(--danger)]"
                            : task.priority === "high"
                            ? "bg-gold-50 text-gold-700"
                            : "bg-beige-100 text-beige-600"
                        )}
                      >
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-beige-400 font-mono">
                        {task.estimatedHours}h
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MILESTONES PAGE
   ══════════════════════════════════════════ */
export default function MilestonesPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const project = mockProjects.find((p) => p.id === projectId) ?? mockProjects[0];
  const milestones = mockMilestones.filter((m) => m.projectId === project.id);

  /* Summary counts */
  const completed = milestones.filter((m) => m.status === "completed").length;
  const inProgress = milestones.filter((m) => m.status === "in_progress").length;
  const upcoming = milestones.filter((m) => m.status === "upcoming").length;
  const overdue = milestones.filter((m) => m.status === "overdue").length;

  const summaryCards = [
    { label: "Total", value: milestones.length, icon: Layers, color: "from-brown-400 to-brown-600" },
    { label: "Completed", value: completed, icon: CheckCircle2, color: "from-forest-400 to-forest-600" },
    { label: "In Progress", value: inProgress, icon: Zap, color: "from-teal-400 to-teal-600" },
    { label: "Upcoming", value: upcoming + overdue, icon: Clock, color: "from-gold-400 to-gold-600" },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-6"
    >
      {/* Back link */}
      <motion.div variants={fadeUp}>
        <Link
          href={`/enterprise/projects/${project.id}`}
          className="inline-flex items-center gap-1.5 text-[12px] text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to {project.title}
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em]">
          Milestones
        </h1>
        <p className="text-[13px] text-beige-500 mt-1">
          {project.title} — Delivery milestone breakdown and task tracking.
        </p>
      </motion.div>

      {/* Summary row */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 flex items-center gap-3"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shrink-0",
                stat.color
              )}
            >
              <stat.icon className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[22px] font-bold text-brown-900 tracking-tight leading-none">
                {stat.value}
              </p>
              <p className="text-[10px] text-beige-500 mt-0.5 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Overall progress */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] font-semibold text-brown-700">
            Overall Progress
          </span>
          <span className="text-[12px] font-mono font-bold text-brown-800">
            {milestones.length > 0
              ? Math.round(milestones.reduce((s, m) => s + m.progress, 0) / milestones.length)
              : 0}%
          </span>
        </div>
        <div className="h-3 rounded-full bg-beige-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-forest-400 via-teal-500 to-forest-600 transition-all duration-700"
            style={{
              width: `${
                milestones.length > 0
                  ? Math.round(milestones.reduce((s, m) => s + m.progress, 0) / milestones.length)
                  : 0
              }%`,
            }}
          />
        </div>
        {/* Milestone legend */}
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          {milestones.map((ms) => {
            const cfg = msConfig[ms.status];
            return (
              <div key={ms.id} className="flex items-center gap-1.5">
                <span className={cn("w-2.5 h-2.5 rounded-full", cfg.dot.split(" ")[0])} />
                <span className="text-[10px] text-beige-600">{ms.title}</span>
                <span className="text-[10px] font-mono font-bold text-brown-700">{ms.progress}%</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Milestone Vertical Timeline */}
      <motion.div variants={stagger} className="relative">
        {milestones.map((milestone, i) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            isLast={i === milestones.length - 1}
          />
        ))}

        {milestones.length === 0 && (
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-beige-100 flex items-center justify-center mx-auto mb-4">
              <Layers className="w-7 h-7 text-beige-400" />
            </div>
            <h3 className="text-[16px] font-bold text-brown-900">No Milestones Yet</h3>
            <p className="text-[13px] text-beige-500 mt-1">
              Milestones will appear here once the project plan is decomposed.
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
