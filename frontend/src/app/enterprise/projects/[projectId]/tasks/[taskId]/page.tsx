"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  FileCheck,
  Flag,
  Layers,
  ListChecks,
  RotateCcw,
  Timer,
  User2,
  Zap,
  ChevronRight,
  XCircle,
  Eye,
  Package,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, scaleIn } from "@/lib/utils/motion-variants";
import { Badge, GlassCard } from "@/components/ui";
import { MetricRing } from "@/components/enterprise/metric-ring";
import { StatusTimeline } from "@/components/enterprise/status-timeline";
import {
  mockProjects,
  mockTasks,
  mockTeams,
  mockMilestones,
  mockDeliverables,
} from "@/mocks/data/enterprise-projects";
import type { TaskStatus } from "@/types/enterprise";

/* ══════════════════════════════════════════════════════════════
   E3 — Task Status Tracking
   State machine lifecycle visualization with full transition history
   ══════════════════════════════════════════════════════════════ */

/* ── Status config ── */
const taskStatusConfig: Record<
  TaskStatus,
  {
    label: string;
    variant: "forest" | "teal" | "gold" | "brown" | "danger" | "beige";
    icon: React.ElementType;
  }
> = {
  backlog: { label: "Backlog", variant: "beige", icon: Circle },
  in_progress: { label: "In Progress", variant: "teal", icon: Zap },
  in_review: { label: "In Review", variant: "gold", icon: Eye },
  rework: { label: "Rework", variant: "brown", icon: RotateCcw },
  accepted: { label: "Accepted", variant: "forest", icon: CheckCircle2 },
  rejected: { label: "Rejected", variant: "danger", icon: XCircle },
};

const priorityConfig: Record<string, { label: string; variant: "brown" | "gold" | "teal" | "beige" }> = {
  critical: { label: "Critical", variant: "brown" },
  high: { label: "High", variant: "gold" },
  medium: { label: "Medium", variant: "teal" },
  low: { label: "Low", variant: "beige" },
};

/* ── State machine definition ── */
type StateMachineNode = {
  key: TaskStatus;
  label: string;
  icon: React.ElementType;
};

const STATE_MACHINE_NODES: StateMachineNode[] = [
  { key: "backlog", label: "Backlog", icon: Circle },
  { key: "in_progress", label: "In Progress", icon: Zap },
  { key: "in_review", label: "In Review", icon: Eye },
  { key: "rework", label: "Rework", icon: RotateCcw },
  { key: "accepted", label: "Accepted", icon: CheckCircle2 },
];

/* ── Mock state transition timestamps ── */
interface StateTransition {
  fromState: TaskStatus | "created";
  toState: TaskStatus;
  timestamp: string;
  actor: string;
  description: string;
}

function generateTransitions(currentStatus: TaskStatus): StateTransition[] {
  const baseDate = new Date("2026-02-25T09:00:00Z");
  const transitions: StateTransition[] = [];

  transitions.push({
    fromState: "created",
    toState: "backlog",
    timestamp: baseDate.toISOString(),
    actor: "APG Engine",
    description: "Task created from SOW decomposition and added to project backlog",
  });

  if (currentStatus === "backlog") return transitions;

  transitions.push({
    fromState: "backlog",
    toState: "in_progress",
    timestamp: new Date(baseDate.getTime() + 2 * 86400000).toISOString(),
    actor: "Contributor D-2M",
    description: "Contributor accepted assignment and began working on the task",
  });

  if (currentStatus === "in_progress") return transitions;

  transitions.push({
    fromState: "in_progress",
    toState: "in_review",
    timestamp: new Date(baseDate.getTime() + 8 * 86400000).toISOString(),
    actor: "Contributor D-2M",
    description: "Evidence pack submitted with 3 files for mentor review",
  });

  if (currentStatus === "in_review") return transitions;

  if (currentStatus === "rework") {
    transitions.push({
      fromState: "in_review",
      toState: "rework",
      timestamp: new Date(baseDate.getTime() + 10 * 86400000).toISOString(),
      actor: "Mentor R-4H",
      description: "Rework requested — acceptance criteria partially unmet, needs refinement",
    });
    return transitions;
  }

  if (currentStatus === "rejected") {
    transitions.push({
      fromState: "in_review",
      toState: "rejected",
      timestamp: new Date(baseDate.getTime() + 10 * 86400000).toISOString(),
      actor: "Mentor R-4H",
      description: "Submission rejected — does not meet quality threshold",
    });
    return transitions;
  }

  // accepted — full lifecycle
  transitions.push({
    fromState: "in_review",
    toState: "accepted",
    timestamp: new Date(baseDate.getTime() + 10 * 86400000).toISOString(),
    actor: "Mentor R-4H",
    description: "All acceptance criteria verified. Evidence approved and PoDL credential issued",
  });

  return transitions;
}

/* ── Mock state timestamps for the pipeline ── */
function getStateTimestamp(
  state: TaskStatus,
  transitions: StateTransition[]
): string | undefined {
  const t = transitions.find((tr) => tr.toState === state);
  return t?.timestamp;
}

/* ── Date formatters ── */
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtDateTime(d: string) {
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtRelativeTime(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours > 0) return `${hours}h ago`;
  return "Just now";
}

/* ── SLA calculation ── */
function getSLAInfo(dueDate: string) {
  const due = new Date(dueDate).getTime();
  const now = Date.now();
  const remaining = due - now;
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);

  if (remaining < 0)
    return { label: "Overdue", color: "text-red-600", bgColor: "bg-red-50", urgent: true, display: `${Math.abs(days)}d overdue` };
  if (days <= 2)
    return { label: "Urgent", color: "text-gold-700", bgColor: "bg-gold-50", urgent: true, display: `${days}d ${hours}h left` };
  return { label: "On Time", color: "text-forest-700", bgColor: "bg-forest-50", urgent: false, display: `${days}d left` };
}

/* ================================================================
   PAGE COMPONENT
   ================================================================ */
export default function TaskStatusTrackingPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const taskId = params.taskId as string;

  const project = mockProjects.find((p) => p.id === projectId) ?? mockProjects[0];
  const task = mockTasks.find((t) => t.id === taskId) ?? mockTasks[0];
  const team = mockTeams.find((t) => t.id === project.teamId);
  const milestone = mockMilestones.find((m) => m.id === task.milestoneId) ?? mockMilestones[0];
  const deliverable = mockDeliverables.find((d) => d.taskId === task.id);

  // Get assigned contributor
  const assignedMemberId = team?.taskAssignments?.[task.id];
  const assignedMember = team?.members.find((m) => m.id === assignedMemberId);

  // Generate transitions for the task
  const transitions = generateTransitions(task.status);

  // State for selected state node detail
  const [selectedState, setSelectedState] = React.useState<TaskStatus | null>(null);

  // Determine state phase for each node in the pipeline
  const completedStates = transitions.map((t) => t.toState);

  function nodePhase(stateKey: TaskStatus): "completed" | "current" | "future" {
    if (stateKey === task.status) return "current";
    if (completedStates.includes(stateKey) && stateKey !== task.status)
      return "completed";
    return "future";
  }

  // Due date mock (relative to task start)
  const dueDate = new Date(
    new Date("2026-02-25T09:00:00Z").getTime() + task.estimatedHours * 3600000 * 0.15
  ).toISOString();
  const sla = getSLAInfo(dueDate);

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* ── Back Link ── */}
      <motion.div variants={fadeUp}>
        <Link
          href={`/enterprise/projects/${project.id}`}
          className="inline-flex items-center gap-1.5 text-[12px] text-beige-600 hover:text-brown-700 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to {project.title}
        </Link>
      </motion.div>

      {/* ══════════════════════════════════════════
          TASK HEADER CARD
         ══════════════════════════════════════════ */}
      <motion.div variants={fadeUp}>
        <GlassCard className="relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-brown-50/40 via-transparent to-teal-50/20 pointer-events-none" />

          <div className="relative space-y-5">
            {/* Row 1: Title + Status badges */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-[24px] font-bold text-brown-950 tracking-tight leading-tight">
                    {task.title}
                  </h1>
                </div>
                <p className="text-[12px] text-beige-600 leading-relaxed max-w-2xl">
                  {task.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={taskStatusConfig[task.status].variant} size="md" dot>
                  {taskStatusConfig[task.status].label}
                </Badge>
                <Badge variant={priorityConfig[task.priority]?.variant ?? "beige"} size="sm">
                  <Flag className="w-3 h-3" />
                  {priorityConfig[task.priority]?.label ?? task.priority}
                </Badge>
              </div>
            </div>

            {/* Row 2: Metadata grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Contributor */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-beige-500 font-semibold">
                  Assigned To
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brown-400 to-brown-600 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">
                      {assignedMember?.avatar ?? "—"}
                    </span>
                  </div>
                  <span className="text-[12px] font-medium text-brown-800 truncate">
                    {assignedMember?.displayName ?? "Unassigned"}
                  </span>
                </div>
              </div>

              {/* Milestone */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-beige-500 font-semibold">
                  Milestone
                </p>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-500" />
                  <span className="text-[12px] font-medium text-brown-800 truncate">
                    {milestone?.title ?? "—"}
                  </span>
                </div>
              </div>

              {/* Estimated Hours */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-beige-500 font-semibold">
                  Est. Effort
                </p>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-beige-500" />
                  <span className="text-[12px] font-semibold text-brown-900">
                    {task.estimatedHours}h
                  </span>
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-beige-500 font-semibold">
                  Due Date
                </p>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-beige-500" />
                  <span className="text-[12px] font-medium text-brown-800">
                    {fmtDate(dueDate)}
                  </span>
                </div>
              </div>

              {/* SLA Timer */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-beige-500 font-semibold">
                  SLA Timer
                </p>
                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold",
                    sla.bgColor,
                    sla.color
                  )}
                >
                  <Timer className="w-3 h-3" />
                  {sla.display}
                </div>
              </div>

              {/* AI Confidence */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-beige-500 font-semibold">
                  AI Confidence
                </p>
                <MetricRing
                  value={task.aiConfidence}
                  size={44}
                  strokeWidth={4}
                  color={task.aiConfidence >= 90 ? "forest" : task.aiConfidence >= 80 ? "teal" : "gold"}
                />
              </div>
            </div>

            {/* Row 3: Skills required */}
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase tracking-wider text-beige-500 font-semibold">
                Required Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {task.skillsRequired.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gradient-to-r from-beige-100 to-beige-50 text-brown-700 border border-beige-200/60"
                  >
                    <Sparkles className="w-3 h-3 text-teal-500" />
                    {skill.name}
                    {skill.confidence && (
                      <span className="text-[9px] text-beige-500 ml-0.5">
                        {Math.round(skill.confidence * 100)}%
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* ══════════════════════════════════════════
          STATE MACHINE VISUALIZATION
         ══════════════════════════════════════════ */}
      <motion.div variants={fadeUp}>
        <GlassCard className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-forest-50/20 via-transparent to-teal-50/20 pointer-events-none" />

          <div className="relative space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-bold text-brown-900">
                  Task Lifecycle
                </h3>
                <p className="text-[11px] text-beige-500 mt-0.5">
                  State machine visualization — click any state for details
                </p>
              </div>
              <Badge variant="beige" size="sm">
                <ListChecks className="w-3 h-3" />
                {transitions.length} transitions
              </Badge>
            </div>

            {/* ── Horizontal Pipeline ── */}
            <div className="relative">
              {/* Connection lines (behind nodes) */}
              <div className="absolute top-[28px] left-0 right-0 flex items-center px-6 pointer-events-none">
                {STATE_MACHINE_NODES.slice(0, -1).map((node, i) => {
                  const nextNode = STATE_MACHINE_NODES[i + 1];
                  const phase = nodePhase(node.key);
                  const nextPhase = nodePhase(nextNode.key);

                  const lineCompleted =
                    phase === "completed" && nextPhase !== "future";

                  return (
                    <div key={node.key} className="flex-1 relative">
                      <div
                        className={cn(
                          "h-[2px] w-full transition-all duration-500",
                          lineCompleted
                            ? "bg-gradient-to-r from-forest-400 to-forest-500"
                            : phase === "current" || nextPhase === "current"
                              ? "bg-gradient-to-r from-teal-300 to-beige-200"
                              : "bg-beige-200"
                        )}
                      />
                      {/* Arrow indicator */}
                      <ChevronRight
                        className={cn(
                          "absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3",
                          lineCompleted
                            ? "text-forest-500"
                            : phase === "current"
                              ? "text-teal-400"
                              : "text-beige-300"
                        )}
                      />
                    </div>
                  );
                })}
              </div>

              {/* State nodes */}
              <div className="relative flex items-start justify-between">
                {STATE_MACHINE_NODES.map((node) => {
                  const phase = nodePhase(node.key);
                  const Icon = node.icon;
                  const timestamp = getStateTimestamp(node.key, transitions);
                  const isSelected = selectedState === node.key;

                  // Special: show rework loop indicator
                  const hasReworkLoop =
                    node.key === "rework" && task.status === "rework";

                  return (
                    <motion.button
                      key={node.key}
                      variants={scaleIn}
                      onClick={() =>
                        setSelectedState(isSelected ? null : node.key)
                      }
                      className={cn(
                        "flex flex-col items-center gap-2 relative z-10 group cursor-pointer",
                        "w-[100px] sm:w-[120px]"
                      )}
                    >
                      {/* Node circle */}
                      <div
                        className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 relative",
                          phase === "completed" &&
                            "bg-gradient-to-br from-forest-500 to-forest-600 text-white shadow-lg shadow-forest-500/20",
                          phase === "current" &&
                            "bg-gradient-to-br from-brown-500 to-brown-700 text-white shadow-lg shadow-brown-500/30 ring-4 ring-brown-200/40",
                          phase === "future" &&
                            "bg-beige-100 text-beige-400 border-2 border-dashed border-beige-300",
                          isSelected &&
                            "ring-4 ring-teal-300/60 scale-105",
                          "group-hover:scale-105 group-hover:shadow-xl"
                        )}
                      >
                        {phase === "completed" ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}

                        {/* Pulsing indicator for current state */}
                        {phase === "current" && (
                          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brown-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brown-500 border-2 border-white" />
                          </span>
                        )}

                        {/* Rework loop indicator */}
                        {hasReworkLoop && (
                          <div className="absolute -bottom-1 -right-1">
                            <div className="w-5 h-5 rounded-full bg-gold-500 text-white flex items-center justify-center">
                              <RotateCcw className="w-3 h-3" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Label */}
                      <span
                        className={cn(
                          "text-[11px] font-semibold text-center leading-tight transition-colors",
                          phase === "completed" && "text-forest-700",
                          phase === "current" && "text-brown-800",
                          phase === "future" && "text-beige-400"
                        )}
                      >
                        {node.label}
                      </span>

                      {/* Timestamp */}
                      <span
                        className={cn(
                          "text-[10px] text-center leading-tight",
                          phase === "future"
                            ? "text-beige-300"
                            : "text-beige-500"
                        )}
                      >
                        {timestamp ? fmtDateTime(timestamp) : "—"}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Rework loop arc (visual) — shown if rework is completed or current */}
              {(task.status === "rework" ||
                completedStates.includes("rework")) && (
                <div className="mt-3 flex justify-center">
                  <div className="relative flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 border border-gold-200/60">
                    <RotateCcw className="w-3 h-3 text-gold-600" />
                    <span className="text-[10px] font-medium text-gold-700">
                      Rework loop — returns to In Progress after revision
                    </span>
                    <ArrowRight className="w-3 h-3 text-gold-600" />
                  </div>
                </div>
              )}
            </div>

            {/* ── State Detail Panel (expanded on click) ── */}
            <AnimatePresence>
              {selectedState && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="rounded-xl bg-white/60 backdrop-blur-sm border border-beige-200/50 p-4 space-y-2">
                    {(() => {
                      const transition = transitions.find(
                        (t) => t.toState === selectedState
                      );
                      const config = taskStatusConfig[selectedState];
                      const Icon = config.icon;

                      return (
                        <>
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                nodePhase(selectedState) === "completed"
                                  ? "bg-forest-100 text-forest-600"
                                  : nodePhase(selectedState) === "current"
                                    ? "bg-brown-100 text-brown-600"
                                    : "bg-beige-100 text-beige-400"
                              )}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-[13px] font-semibold text-brown-900">
                                {config.label}
                              </p>
                              {transition && (
                                <p className="text-[10px] text-beige-500">
                                  {fmtDateTime(transition.timestamp)} ·{" "}
                                  {fmtRelativeTime(transition.timestamp)}
                                </p>
                              )}
                            </div>
                          </div>
                          {transition ? (
                            <div className="pl-10 space-y-1.5">
                              <p className="text-[12px] text-brown-700 leading-relaxed">
                                {transition.description}
                              </p>
                              <div className="flex items-center gap-1.5 text-[11px] text-beige-500">
                                <User2 className="w-3 h-3" />
                                Triggered by{" "}
                                <span className="font-medium text-brown-700">
                                  {transition.actor}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <p className="pl-10 text-[12px] text-beige-400 italic">
                              This state has not been reached yet
                            </p>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>
      </motion.div>

      {/* ══════════════════════════════════════════
          BOTTOM SECTION: Timeline + Evidence
         ══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── State Transition History ── */}
        <motion.div variants={fadeUp} className="lg:col-span-3">
          <GlassCard className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-beige-50/30 via-transparent to-transparent pointer-events-none" />

            <div className="relative space-y-5">
              <div>
                <h3 className="text-[14px] font-bold text-brown-900">
                  Transition History
                </h3>
                <p className="text-[11px] text-beige-500 mt-0.5">
                  Complete audit trail of state changes
                </p>
              </div>

              <StatusTimeline
                steps={transitions.map((t, i) => ({
                  label:
                    t.fromState === "created"
                      ? `Created → ${taskStatusConfig[t.toState].label}`
                      : `${taskStatusConfig[t.fromState as TaskStatus]?.label ?? t.fromState} → ${taskStatusConfig[t.toState].label}`,
                  description: `${t.actor}: ${t.description}`,
                  timestamp: fmtDateTime(t.timestamp),
                  status:
                    i === transitions.length - 1
                      ? task.status === "accepted"
                        ? ("completed" as const)
                        : ("current" as const)
                      : ("completed" as const),
                }))}
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* ── Right Column: Evidence + Links ── */}
        <motion.div variants={fadeUp} className="lg:col-span-2 space-y-5">
          {/* Evidence Card */}
          {deliverable ? (
            <GlassCard className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50/30 via-transparent to-transparent pointer-events-none" />

              <div className="relative space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-brown-900">
                      Submitted Evidence
                    </h3>
                    <p className="text-[10px] text-beige-500">
                      {fmtDate(deliverable.submittedAt)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-beige-600">
                      Submitted by
                    </span>
                    <span className="text-[12px] font-medium text-brown-800">
                      {deliverable.submittedBy}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-beige-600">
                      Evidence Files
                    </span>
                    <div className="flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-teal-500" />
                      <span className="text-[12px] font-semibold text-brown-900">
                        {deliverable.evidenceFiles} files
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-beige-600">
                      Review Status
                    </span>
                    <Badge
                      variant={
                        deliverable.status === "approved"
                          ? "forest"
                          : deliverable.status === "rejected"
                            ? "danger"
                            : deliverable.status === "rework"
                              ? "brown"
                              : "gold"
                      }
                      size="sm"
                      dot
                    >
                      {deliverable.status === "pending"
                        ? "Pending Review"
                        : deliverable.status.charAt(0).toUpperCase() +
                          deliverable.status.slice(1)}
                    </Badge>
                  </div>

                  {deliverable.reviewerNotes && (
                    <div className="rounded-lg bg-beige-50/70 border border-beige-200/40 p-3 space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-beige-500 font-semibold">
                        Reviewer Feedback
                      </p>
                      <p className="text-[11px] text-brown-700 leading-relaxed">
                        {deliverable.reviewerNotes}
                      </p>
                    </div>
                  )}
                </div>

                <Link
                  href={`/enterprise/review/${deliverable.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white text-[12px] font-semibold hover:from-teal-600 hover:to-teal-700 transition-all shadow-sm hover:shadow-md"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Evidence Pack
                </Link>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-beige-50/40 via-transparent to-transparent pointer-events-none" />
              <div className="relative flex flex-col items-center justify-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-beige-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-beige-400" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-brown-800">
                    No Evidence Submitted
                  </p>
                  <p className="text-[11px] text-beige-500 mt-0.5">
                    Evidence will appear here once the contributor submits their
                    work
                  </p>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Acceptance Criteria Card */}
          <GlassCard className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brown-50/20 via-transparent to-forest-50/10 pointer-events-none" />

            <div className="relative space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brown-500 to-brown-600 flex items-center justify-center shadow-lg shadow-brown-500/20">
                  <ListChecks className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[14px] font-bold text-brown-900">
                  Acceptance Criteria
                </h3>
              </div>

              <ul className="space-y-2.5">
                {task.acceptanceCriteria.map((criterion, i) => {
                  const isMet =
                    task.status === "accepted" ||
                    (task.status === "in_review" &&
                      i < task.acceptanceCriteria.length - 1);

                  return (
                    <li key={i} className="flex items-start gap-2.5">
                      <div
                        className={cn(
                          "w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-all",
                          isMet
                            ? "bg-forest-100 text-forest-600"
                            : "bg-beige-100 text-beige-400"
                        )}
                      >
                        {isMet ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Circle className="w-3 h-3" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-[12px] leading-relaxed",
                          isMet
                            ? "text-brown-700"
                            : "text-beige-500"
                        )}
                      >
                        {criterion}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </GlassCard>

          {/* Quick Links Card */}
          <GlassCard padding="sm">
            <div className="space-y-1.5">
              <Link
                href={`/enterprise/projects/${project.id}`}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-beige-50/70 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-beige-500 group-hover:text-brown-600 transition-colors" />
                  <span className="text-[12px] font-medium text-brown-700 group-hover:text-brown-900 transition-colors">
                    View in Project
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-beige-400 group-hover:text-brown-500 group-hover:translate-x-0.5 transition-all" />
              </Link>

              {milestone && (
                <Link
                  href={`/enterprise/projects/${project.id}/milestones`}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-beige-50/70 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Flag className="w-4 h-4 text-beige-500 group-hover:text-teal-600 transition-colors" />
                    <span className="text-[12px] font-medium text-brown-700 group-hover:text-brown-900 transition-colors">
                      {milestone.title}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-beige-400 group-hover:text-brown-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
              )}

              {assignedMember && team && (
                <Link
                  href={`/enterprise/team/${team.id}`}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-beige-50/70 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <User2 className="w-4 h-4 text-beige-500 group-hover:text-forest-600 transition-colors" />
                    <span className="text-[12px] font-medium text-brown-700 group-hover:text-brown-900 transition-colors">
                      View Team
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-beige-400 group-hover:text-brown-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
