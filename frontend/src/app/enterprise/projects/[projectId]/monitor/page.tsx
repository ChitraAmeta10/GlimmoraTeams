"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Bug,
  CheckCircle2,
  Clock,
  Gauge,
  Server,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, slideInRight, scaleIn } from "@/lib/utils/motion-variants";
import { Badge } from "@/components/ui";
import { MetricRing } from "@/components/enterprise/metric-ring";
import { StatusTimeline } from "@/components/enterprise/status-timeline";
import { mockProjects } from "@/mocks/data/enterprise-projects";
import type { ProjectHealth } from "@/types/enterprise";

/* ── Health ring color map ── */
const ringColorMap: Record<ProjectHealth, "forest" | "gold" | "brown" | "teal"> = {
  on_track: "forest",
  at_risk: "gold",
  behind: "brown",
  completed: "teal",
};

/* ── Mock alerts ── */
const mockAlerts = [
  {
    id: "alert-001",
    severity: "warning" as const,
    title: "Budget utilization approaching 90%",
    description: "Project spending is at 87% of allocated budget with 55% work remaining. Review cost allocation.",
    timestamp: "2026-03-06T10:15:00Z",
    source: "APG Budget Monitor",
  },
  {
    id: "alert-002",
    severity: "critical" as const,
    title: "Task #004 overdue by 2 days",
    description: "General Ledger API task has exceeded its deadline. Contributor D-2M has been notified.",
    timestamp: "2026-03-06T08:30:00Z",
    source: "APG Timeline Engine",
  },
  {
    id: "alert-003",
    severity: "warning" as const,
    title: "Quality score below threshold",
    description: "Review pass rate dropped to 72% this week, below the 85% APG threshold. 3 rework requests issued.",
    timestamp: "2026-03-05T16:45:00Z",
    source: "APG Quality Gate",
  },
  {
    id: "alert-004",
    severity: "info" as const,
    title: "Team velocity stabilizing",
    description: "Sprint velocity has stabilized at 34 story points after two sprints of adjustment.",
    timestamp: "2026-03-05T12:00:00Z",
    source: "APG Performance",
  },
];

/* ── Mock health metrics ── */
const healthMetrics = [
  { label: "Task Velocity", value: "34", unit: "pts/sprint", change: 8.2, positive: true, icon: Zap, accent: "teal" as const },
  { label: "Bug Rate", value: "0.8", unit: "/KLOC", change: -12.5, positive: true, icon: Bug, accent: "forest" as const },
  { label: "Response Time", value: "4.2", unit: "hours", change: -18.3, positive: true, icon: Clock, accent: "gold" as const },
  { label: "Uptime", value: "99.7", unit: "%", change: 0.3, positive: true, icon: Server, accent: "brown" as const },
];

/* ── Mock performance data for SVG chart ── */
const perfData = [
  { week: "W1", score: 68 },
  { week: "W2", score: 72 },
  { week: "W3", score: 75 },
  { week: "W4", score: 71 },
  { week: "W5", score: 78 },
  { week: "W6", score: 82 },
  { week: "W7", score: 80 },
  { week: "W8", score: 85 },
  { week: "W9", score: 83 },
  { week: "W10", score: 87 },
];

/* ── Mock APG timeline events ── */
const apgEvents = [
  { label: "Quality gate triggered", description: "Rework requested for Auth Service MFA flow", timestamp: "10:30 AM", status: "error" as const },
  { label: "Budget checkpoint passed", description: "Monthly budget review completed — within limits", timestamp: "9:15 AM", status: "completed" as const },
  { label: "Team rebalancing suggestion", description: "APG recommends shifting 1 contributor to Finance module", timestamp: "8:45 AM", status: "current" as const },
  { label: "Sprint velocity calculated", description: "34 points completed — 12% above sprint average", timestamp: "Yesterday", status: "completed" as const },
  { label: "Risk assessment update", description: "Project risk score decreased from 42 to 38", timestamp: "Yesterday", status: "completed" as const },
  { label: "Milestone review scheduled", description: "Finance Module milestone review in 3 days", timestamp: "Mar 4", status: "upcoming" as const },
];

/* ── Accent color map ── */
const accentStyles = {
  teal: { bg: "bg-teal-50", icon: "text-teal-500", border: "border-teal-100" },
  forest: { bg: "bg-forest-50", icon: "text-forest-500", border: "border-forest-100" },
  gold: { bg: "bg-gold-50", icon: "text-gold-600", border: "border-gold-100" },
  brown: { bg: "bg-brown-50", icon: "text-brown-500", border: "border-brown-100" },
};

/* ══════════════════════════════════════════
   REAL-TIME MONITOR PAGE
   ══════════════════════════════════════════ */
export default function MonitorPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const project = mockProjects.find((p) => p.id === projectId) ?? mockProjects[0];
  const ringColor = ringColorMap[project.health];

  /* Alert action state */
  const [alertStatuses, setAlertStatuses] = React.useState<Record<number, "resolved" | "escalated" | null>>({});

  /* Build SVG path from perf data */
  const chartW = 400;
  const chartH = 120;
  const padding = 10;
  const maxVal = 100;
  const minVal = 50;
  const range = maxVal - minVal;

  const points = perfData.map((d, i) => {
    const x = padding + (i / (perfData.length - 1)) * (chartW - padding * 2);
    const y = chartH - padding - ((d.score - minVal) / range) * (chartH - padding * 2);
    return { x, y };
  });

  const linePath = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${chartH - padding} L${points[0].x},${chartH - padding} Z`;

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

      {/* Header with live indicator */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em]">
              Project Monitor
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-forest-50 border border-forest-200">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-forest-500" />
              </span>
              <span className="text-[10px] font-semibold text-forest-700">LIVE</span>
            </div>
          </div>
          <p className="text-[13px] text-beige-500 mt-1">
            {project.title} — Real-time APG governance and performance tracking.
          </p>
        </div>
      </motion.div>

      {/* APG Score + Health Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* APG Score — large card */}
        <motion.div
          variants={scaleIn}
          className="md:col-span-1 rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6 flex flex-col items-center justify-center hover:shadow-xl hover:shadow-brown-100/20 transition-all"
        >
          <MetricRing
            value={project.apgScore}
            size={120}
            strokeWidth={10}
            color={ringColor}
            label="APG Score"
          />
          <div className="mt-3 flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-forest-600" />
            <span className="text-[11px] font-semibold text-forest-600">+4.2%</span>
            <span className="text-[10px] text-beige-400">vs last week</span>
          </div>
          <p className="text-[10px] text-beige-500 mt-2 text-center">
            Autonomous Project Governor
          </p>
        </motion.div>

        {/* Health Metric Cards */}
        {healthMetrics.map((metric) => {
          const accent = accentStyles[metric.accent];
          return (
            <motion.div
              key={metric.label}
              variants={fadeUp}
              className={cn(
                "rounded-2xl border bg-white/70 backdrop-blur-sm p-5 hover:shadow-lg transition-all",
                accent.border
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", accent.bg)}>
                  <metric.icon className={cn("w-4 h-4", accent.icon)} />
                </div>
                <div className="flex items-center gap-1">
                  {metric.positive ? (
                    <ArrowUpRight className="w-3 h-3 text-forest-600" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-[var(--danger)]" />
                  )}
                  <span
                    className={cn(
                      "text-[10px] font-bold",
                      metric.positive ? "text-forest-600" : "text-[var(--danger)]"
                    )}
                  >
                    {Math.abs(metric.change)}%
                  </span>
                </div>
              </div>
              <p className="text-[22px] font-bold text-brown-900 tracking-tight leading-none">
                {metric.value}
                <span className="text-[11px] font-medium text-beige-500 ml-1">
                  {metric.unit}
                </span>
              </p>
              <p className="text-[10px] text-beige-500 mt-1 font-medium">
                {metric.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Alerts + Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Alerts / Escalation Panel */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6 hover:shadow-lg hover:shadow-gold-100/15 transition-all"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-gold-500" />
              <span className="text-[13px] font-semibold text-brown-800">
                Alerts & Escalations
              </span>
            </div>
            <Badge variant="gold" size="sm">
              {mockAlerts.length} active
            </Badge>
          </div>

          <div className="space-y-3">
            {mockAlerts.map((alert, index) => (
              <div
                key={alert.id}
                className={cn(
                  "rounded-xl border p-4 transition-all hover:shadow-md",
                  alert.severity === "critical"
                    ? "border-gold-300/80 bg-gold-50/40"
                    : alert.severity === "warning"
                    ? "border-gold-200/80 bg-gold-50/40"
                    : "border-teal-200/80 bg-teal-50/40"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                      alert.severity === "critical"
                        ? "bg-gold-100 text-[var(--danger)]"
                        : alert.severity === "warning"
                        ? "bg-gold-100 text-gold-600"
                        : "bg-teal-100 text-teal-600"
                    )}
                  >
                    {alert.severity === "critical" ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : alert.severity === "warning" ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Activity className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-brown-900">
                      {alert.title}
                    </p>
                    <p className="text-[11px] text-beige-600 mt-0.5 leading-relaxed">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[9px] text-beige-400">
                        {alert.source}
                      </span>
                      <span className="text-[9px] text-beige-400">
                        {new Date(alert.timestamp).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons / Status indicator */}
                <div className="flex items-center gap-2 mt-3 ml-10">
                  {alertStatuses[index] === "resolved" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-3 py-1.5 rounded-lg bg-forest-50 border border-forest-200 text-forest-700">
                      <CheckCircle2 className="w-3 h-3" />
                      Resolved
                    </span>
                  ) : alertStatuses[index] === "escalated" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-3 py-1.5 rounded-lg bg-gold-50 border border-gold-200 text-gold-700">
                      <AlertTriangle className="w-3 h-3" />
                      Escalated
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => setAlertStatuses((prev) => ({ ...prev, [index]: "resolved" }))}
                        className="text-[10px] font-semibold px-3 py-1.5 rounded-lg bg-white border border-beige-200 text-brown-700 hover:bg-beige-50 hover:border-brown-300 transition-all"
                      >
                        Resolve
                      </button>
                      {alert.severity !== "info" && (
                        <button
                          onClick={() => setAlertStatuses((prev) => ({ ...prev, [index]: "escalated" }))}
                          className="text-[10px] font-semibold px-3 py-1.5 rounded-lg bg-brown-600 text-white hover:bg-brown-700 shadow-sm transition-all"
                        >
                          Escalate
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          variants={slideInRight}
          className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6 hover:shadow-lg hover:shadow-forest-100/15 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-forest-500" />
              <span className="text-[13px] font-semibold text-brown-800">
                Performance Trend
              </span>
            </div>
            <span className="text-[10px] text-beige-400">Last 10 weeks</span>
          </div>

          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-[160px]">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => {
              const y = padding + (i / 4) * (chartH - padding * 2);
              return (
                <line
                  key={i}
                  x1={padding}
                  y1={y}
                  x2={chartW - padding}
                  y2={y}
                  stroke="#E9DFD7"
                  strokeWidth="0.5"
                />
              );
            })}

            {/* Area fill */}
            <path d={areaPath} fill="#4D5741" opacity="0.06" />

            {/* Gradient line */}
            <defs>
              <linearGradient id="perfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5B9BA2" />
                <stop offset="50%" stopColor="#4D5741" />
                <stop offset="100%" stopColor="#4D5741" />
              </linearGradient>
            </defs>
            <path
              d={linePath}
              stroke="url(#perfGrad)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {points.map((p, i) => (
              <g key={i}>
                {i === points.length - 1 && (
                  <circle cx={p.x} cy={p.y} r="8" fill="#4D5741" opacity="0.12" />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={i === points.length - 1 ? 4 : 2.5}
                  fill={i === points.length - 1 ? "#4D5741" : "#5B9BA2"}
                />
              </g>
            ))}

            {/* X-axis labels */}
            {perfData.map((d, i) => {
              const x = padding + (i / (perfData.length - 1)) * (chartW - padding * 2);
              return (
                <text
                  key={d.week}
                  x={x}
                  y={chartH - 1}
                  textAnchor="middle"
                  className="text-[8px] fill-beige-400"
                >
                  {d.week}
                </text>
              );
            })}

            {/* Y-axis labels */}
            {[100, 87, 75, 62, 50].map((val, i) => {
              const y = padding + (i / 4) * (chartH - padding * 2);
              return (
                <text
                  key={val}
                  x={padding - 3}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[7px] fill-beige-400"
                >
                  {val}
                </text>
              );
            })}
          </svg>

          {/* Current score highlight */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-beige-100/80">
            <div>
              <p className="text-[10px] text-beige-500 font-medium">Current APG Score</p>
              <p className="text-[20px] font-bold text-brown-900 tracking-tight leading-none mt-0.5">
                {project.apgScore}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] text-beige-500 font-medium">Target</p>
                <p className="text-[14px] font-bold text-forest-700 leading-none mt-0.5">90</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-beige-500 font-medium">Min Threshold</p>
                <p className="text-[14px] font-bold text-gold-700 leading-none mt-0.5">75</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* APG Activity Timeline */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6 hover:shadow-lg hover:shadow-teal-100/15 transition-all"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-500" />
            <span className="text-[13px] font-semibold text-brown-800">
              APG Activity Timeline
            </span>
          </div>
          <span className="text-[10px] text-beige-400">Autonomous governance events</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <StatusTimeline steps={apgEvents.slice(0, 3)} />
          <StatusTimeline steps={apgEvents.slice(3)} />
        </div>
      </motion.div>

      {/* Quick Stats Footer */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          { label: "Tasks Completed", value: `${project.tasksCompleted}/${project.tasksTotal}`, icon: CheckCircle2, accent: "forest" },
          { label: "Active Escalations", value: project.escalations, icon: AlertTriangle, accent: project.escalations > 0 ? "gold" : "forest" },
          { label: "Budget Used", value: `${Math.round((project.spent / project.budget) * 100)}%`, icon: Activity, accent: "brown" },
          { label: "Days Remaining", value: Math.max(0, Math.ceil((new Date(project.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))), icon: Clock, accent: "teal" },
        ].map((stat) => {
          const a = accentStyles[stat.accent as keyof typeof accentStyles];
          return (
            <div
              key={stat.label}
              className={cn(
                "rounded-2xl border bg-white/70 backdrop-blur-sm p-4 flex items-center gap-3",
                a.border
              )}
            >
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", a.bg)}>
                <stat.icon className={cn("w-4 h-4", a.icon)} />
              </div>
              <div>
                <p className="text-[16px] font-bold text-brown-900 tracking-tight leading-none">
                  {stat.value}
                </p>
                <p className="text-[10px] text-beige-500 mt-0.5 font-medium">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
