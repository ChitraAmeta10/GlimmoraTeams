"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar, CheckCircle2, CircleDollarSign, Clock, DollarSign,
  AlertTriangle, Eye, FileCheck, Flag, Layers, Package,
  ShieldCheck, Sparkles, Target, Timer, Users, Zap, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, scaleIn } from "@/lib/utils/motion-variants";
import {
  mockProjects, mockTasks, mockTeams, mockMilestones, mockDeliverables,
} from "@/mocks/data/enterprise-projects";
import type { ProjectHealth, MilestoneStatus, TaskStatus } from "@/types/enterprise";

/* ═══ Badge ═══ */

const badgeStyles: Record<string, { bg: string; text: string; dot: string }> = {
  forest: { bg: "bg-forest-50", text: "text-forest-700", dot: "bg-forest-500" },
  teal: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" },
  gold: { bg: "bg-gold-50", text: "text-gold-700", dot: "bg-gold-500" },
  brown: { bg: "bg-brown-50", text: "text-brown-700", dot: "bg-brown-500" },
  beige: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  danger: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
};

function Badge({ variant, dot, children }: { variant: string; dot?: boolean; children: React.ReactNode }) {
  const s = badgeStyles[variant] || badgeStyles.beige;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[9px] font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full", s.bg, s.text)}>
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />}
      {children}
    </span>
  );
}

/* ═══ Configs ═══ */

const healthCfg: Record<ProjectHealth, { label: string; variant: string }> = {
  on_track: { label: "On Track", variant: "forest" },
  at_risk: { label: "At Risk", variant: "gold" },
  behind: { label: "Behind", variant: "danger" },
  completed: { label: "Completed", variant: "teal" },
};

const taskStatusMap: Record<TaskStatus, { variant: string; label: string; dotColor: string }> = {
  backlog: { variant: "beige", label: "Backlog", dotColor: "bg-gray-300" },
  in_progress: { variant: "teal", label: "In Progress", dotColor: "bg-teal-500" },
  in_review: { variant: "gold", label: "In Review", dotColor: "bg-gold-500" },
  rework: { variant: "danger", label: "Rework", dotColor: "bg-red-500" },
  accepted: { variant: "forest", label: "Accepted", dotColor: "bg-forest-500" },
  rejected: { variant: "danger", label: "Rejected", dotColor: "bg-red-500" },
};

const priorityMap: Record<string, { variant: string; label: string }> = {
  low: { variant: "beige", label: "Low" },
  medium: { variant: "teal", label: "Medium" },
  high: { variant: "gold", label: "High" },
  critical: { variant: "brown", label: "Critical" },
};

const msStatusColors: Record<MilestoneStatus, { dot: string; text: string; bg: string; border: string }> = {
  completed: { dot: "bg-forest-500", text: "text-forest-700", bg: "bg-forest-50", border: "border-forest-300" },
  in_progress: { dot: "bg-teal-500", text: "text-teal-700", bg: "bg-teal-50", border: "border-teal-300" },
  upcoming: { dot: "bg-gray-300", text: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200" },
  overdue: { dot: "bg-brown-500", text: "text-brown-700", bg: "bg-brown-50", border: "border-brown-300" },
};

const deliverableStatusMap: Record<string, { variant: string; label: string }> = {
  pending: { variant: "gold", label: "Pending Review" },
  approved: { variant: "forest", label: "Approved" },
  rejected: { variant: "danger", label: "Rejected" },
  rework: { variant: "brown", label: "Rework" },
};

/* ═══ Helpers ═══ */

function formatDate(iso: string) { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
function formatShortDate(iso: string) { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
function trackLabel(track: string) {
  switch (track) {
    case "women": return "Women's Track";
    case "student": return "University";
    default: return "General";
  }
}

/* ═══ PAGE ═══ */

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const project = mockProjects.find((p) => p.id === projectId) ?? mockProjects[0];
  const milestones = mockMilestones.filter((m) => m.projectId === project.id);
  const team = mockTeams.find((t) => t.id === project.teamId);
  const tasks = mockTasks.filter((t) => t.planId === project.planId);
  const deliverables = mockDeliverables.filter((d) => d.projectId === project.id);
  const hc = healthCfg[project.health];
  const [resolvedExceptions, setResolvedExceptions] = React.useState<Set<string>>(new Set());

  const daysLeft = Math.max(0, Math.ceil((new Date(project.endDate).getTime() - Date.now()) / 86400000));
  const completedTasks = tasks.filter((t) => t.status === "accepted").length;
  const completionPct = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const projectExceptions = [
    ...(project.escalations > 0 ? [{ id: "pe-1", type: "escalation", description: "Client escalation: deliverable review cycle exceeding SLA threshold.", severity: "critical" as const, date: "2 hours ago", status: "open" as const }] : []),
    ...(project.slaCompliance < 90 ? [{ id: "pe-2", type: "sla_breach", description: "SLA compliance dropped below 90% target. Evidence packs pending review beyond 48h window.", severity: "warning" as const, date: "6 hours ago", status: "investigating" as const }] : []),
    ...(project.health === "behind" ? [{ id: "pe-3", type: "quality_issue", description: "Review pass rate dropped to 58% over last 5 submissions. APG quality threshold is 75%.", severity: "warning" as const, date: "1 day ago", status: "open" as const }] : []),
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">

      {/* ═══ HEADER ═══ */}
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-3">
              <Badge variant={hc.variant} dot>{hc.label}</Badge>
            </div>
            <h1 className="font-heading text-[28px] font-semibold text-gray-900 tracking-tight leading-tight">{project.title}</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap text-[12px] text-gray-400">
              <span className="text-gray-600 font-medium">{project.client}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <Link href={`/enterprise/sow/${project.sowId}`} className="text-brown-500 hover:text-brown-600 font-medium transition-colors">{project.sowTitle}</Link>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>{formatDate(project.startDate)} – {formatDate(project.endDate)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href={`/enterprise/projects/${projectId}/milestones`}>
              <button className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
                <Layers className="w-3 h-3" /> Milestones
              </button>
            </Link>
            <Link href={`/enterprise/projects/${projectId}/monitor`}>
              <button className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-gradient-to-r from-brown-400 to-brown-600 hover:from-brown-500 hover:to-brown-700 px-5 py-2 rounded-xl transition-all">
                <Zap className="w-3.5 h-3.5" /> Live Monitor
              </button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ═══ KPI ROW ═══ */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Progress", value: `${project.progress}%`, icon: CheckCircle2, iconBg: "bg-gradient-to-br from-brown-400 to-brown-600" },
          { label: "APG Score", value: project.apgScore, icon: Target, iconBg: "bg-gradient-to-br from-teal-400 to-teal-600" },
          { label: "Budget", value: `$${Math.round(project.spent / 1000)}k / $${Math.round(project.budget / 1000)}k`, icon: DollarSign, iconBg: "bg-gradient-to-br from-gold-400 to-gold-600" },
          { label: "Team Size", value: project.teamSize, icon: Users, iconBg: "bg-gradient-to-br from-forest-400 to-forest-600" },
          { label: "SLA", value: `${project.slaCompliance}%`, icon: ShieldCheck, iconBg: "bg-gradient-to-br from-brown-400 to-brown-600" },
          { label: "Days Left", value: daysLeft, icon: Calendar, iconBg: "bg-gradient-to-br from-teal-400 to-teal-600" },
        ].map((kpi) => {
          const KpiIcon = kpi.icon;
          return (
            <motion.div key={kpi.label} variants={scaleIn} className="card-parchment flex items-center gap-4 px-4 py-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", kpi.iconBg)}>
                <KpiIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium text-gray-400">{kpi.label}</div>
                <div className="num-display text-[20px] text-gray-900 leading-none mt-0.5">{kpi.value}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ═══ COMPLETION + TASK STATUS ═══ */}
      <motion.div variants={fadeUp} className="card-parchment px-5 py-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-800">Completion</span>
          <span className="text-[12px] font-mono font-semibold text-gray-600">{completionPct}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-4">
          <div className={cn("h-full rounded-full transition-all duration-700", completionPct === 100 ? "bg-forest-500" : "bg-gradient-to-r from-brown-400 to-brown-500")} style={{ width: `${completionPct}%` }} />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {(["backlog", "in_progress", "in_review", "rework", "accepted"] as TaskStatus[]).map((key) => {
            const count = tasks.filter((t) => t.status === key).length;
            const cfg = taskStatusMap[key];
            return (
              <div key={key} className="flex items-center gap-1.5">
                <span className={cn("w-2 h-2 rounded-full", cfg.dotColor)} />
                <span className="text-[11px] text-gray-600"><span className="font-semibold">{count}</span> {cfg.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ═══ TASKS ═══ */}
      <motion.div variants={fadeUp} className="card-parchment mb-6">
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
          <span className="text-sm font-semibold text-gray-800">Tasks</span>
          <span className="text-[11px] text-gray-400">{tasks.length} total</span>
        </div>
        <div className="hidden lg:grid items-center px-5 py-2.5"
          style={{ gridTemplateColumns: "1fr 100px 80px 80px 60px 20px", borderBottom: "1px solid var(--border-soft)", background: "color-mix(in srgb, var(--color-gray-100) 40%, white)", fontSize: 10, color: "var(--color-gray-400)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          <span>Task</span><span>Status</span><span>Priority</span><span>Hours</span><span>Phase</span><span />
        </div>
        {tasks.map((task, i) => {
          const ts = taskStatusMap[task.status];
          const pr = priorityMap[task.priority];
          return (
            <Link key={task.id} href={`/enterprise/projects/${projectId}/tasks/${task.id}`}>
              <div className="group flex lg:grid items-center px-5 py-3.5 transition-colors hover:bg-black/[0.02]"
                style={{ gridTemplateColumns: "1fr 100px 80px 80px 60px 20px", borderBottom: i < tasks.length - 1 ? "1px solid var(--border-hair)" : undefined }}>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-gray-700 truncate">{task.title}</div>
                  <div className="text-[11px] text-gray-400 truncate mt-0.5">{task.description}</div>
                </div>
                <div className="hidden lg:block"><Badge variant={ts.variant}>{ts.label}</Badge></div>
                <div className="hidden lg:block">{pr && <Badge variant={pr.variant}>{pr.label}</Badge>}</div>
                <div className="hidden lg:block text-[12px] font-mono text-gray-600">{task.estimatedHours}h</div>
                <div className="hidden lg:block text-[11px] text-gray-400">Phase {task.phase}</div>
                <div className="hidden lg:flex justify-end">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          );
        })}
        {tasks.length === 0 && (
          <div className="py-10 text-center">
            <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-gray-300" />
            <p className="text-[13px] text-gray-400">No tasks found for this project.</p>
          </div>
        )}
      </motion.div>

      {/* ═══ TEAM + SLA ═══ */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Team */}
        <div className="card-parchment">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <span className="text-sm font-semibold text-gray-800">Team</span>
            {team && <span className="text-[11px] text-gray-400">{team.totalMembers} members · {team.matchScore}% match</span>}
          </div>
          {team ? (
            <>
              <div className="flex items-center gap-2 mx-5 mt-3 px-3 py-2 rounded-lg bg-forest-50">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-500 shrink-0" />
                <p className="text-[10px] text-forest-700">All contributor identities are anonymized. Privacy by architecture.</p>
              </div>
              <div className="py-2">
                {team.members.map((member, i) => (
                  <div key={member.id} className="flex items-center gap-3 px-5 py-3"
                    style={{ borderBottom: i < team.members.length - 1 ? "1px solid var(--border-hair)" : undefined }}>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brown-300 to-brown-500 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-medium text-gray-700">{member.displayName}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-mono text-gray-400">{member.anonymousId}</span>
                        <span className="text-[9px] text-gray-400">{trackLabel(member.track)}</span>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                      <div className="w-12 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className={cn("h-full rounded-full", member.matchScore >= 90 ? "bg-forest-500" : member.matchScore >= 80 ? "bg-teal-500" : "bg-gold-500")}
                          style={{ width: `${member.matchScore}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-gray-500 w-7 text-right">{member.matchScore}%</span>
                    </div>
                    <Badge variant={member.availability === "full_time" ? "forest" : member.availability === "part_time" ? "gold" : "beige"}>
                      {member.availability === "full_time" ? "Full" : member.availability === "part_time" ? "Part" : "Limited"}
                    </Badge>
                    <div className="flex items-center gap-1 shrink-0">
                      <Sparkles className="w-3 h-3 text-gold-500" />
                      <span className="text-[11px] font-semibold text-gray-700">{member.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-10 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-gray-300" />
              <p className="text-[13px] text-gray-400">No team assigned yet.</p>
            </div>
          )}
        </div>

        {/* SLA */}
        <div className="card-parchment">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <span className="text-sm font-semibold text-gray-800">SLA Compliance</span>
            <span className={cn("text-[14px] font-semibold",
              project.slaCompliance >= 95 ? "text-forest-600" : project.slaCompliance >= 85 ? "text-gold-600" : "text-brown-600"
            )}>{project.slaCompliance}%</span>
          </div>
          <div className="py-2">
            {[
              { label: "Review Turnaround", target: "48h", actual: project.slaCompliance >= 90 ? "34h" : "52h", met: project.slaCompliance >= 90, icon: Timer },
              { label: "Payment Release", target: "72h", actual: project.slaCompliance >= 85 ? "48h" : "78h", met: project.slaCompliance >= 85, icon: CircleDollarSign },
              { label: "Escalation Response", target: "4h", actual: project.slaCompliance >= 90 ? "2h" : "6h", met: project.slaCompliance >= 90, icon: Flag },
              { label: "Evidence Review", target: "24h", actual: project.slaCompliance >= 90 ? "18h" : "32h", met: project.slaCompliance >= 90, icon: FileCheck },
            ].map((metric, i, arr) => {
              const MetricIcon = metric.icon;
              return (
                <div key={metric.label} className="flex items-center gap-3 px-5 py-3"
                  style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--border-hair)" : undefined }}>
                  <MetricIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-[12px] text-gray-600 flex-1">{metric.label}</span>
                  <span className="text-[11px] text-gray-400 shrink-0">Target: {metric.target}</span>
                  <span className={cn("text-[12px] font-semibold shrink-0 w-9 text-right", metric.met ? "text-forest-600" : "text-gold-600")}>{metric.actual}</span>
                  {metric.met ? <CheckCircle2 className="w-3.5 h-3.5 text-forest-500 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-gold-500 shrink-0" />}
                </div>
              );
            })}
          </div>
          {/* Compliance trend */}
          <div className="px-5 py-4" style={{ borderTop: "1px solid var(--border-soft)" }}>
            <div className="text-[11px] font-medium text-gray-400 mb-3">Weekly Trend</div>
            <div className="flex items-end gap-2 h-20">
              {[88, 91, 93, 90, 94, project.slaCompliance].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-semibold text-gray-500">{val}%</span>
                  <div className={cn("w-full rounded-t-md", val >= 95 ? "bg-forest-400" : val >= 85 ? "bg-gold-400" : "bg-brown-400")}
                    style={{ height: `${val * 0.8}%` }} />
                  <span className="text-[8px] text-gray-400">W{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ TIMELINE ═══ */}
      {milestones.length > 0 && (
        <motion.div variants={fadeUp} className="card-parchment mb-6">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <span className="text-sm font-semibold text-gray-800">Timeline</span>
            <span className="text-[11px] text-gray-400">{formatDate(project.startDate)} – {formatDate(project.endDate)}</span>
          </div>
          <div className="p-5">
            {/* Month labels */}
            <div className="flex items-center mb-4">
              <div className="w-[180px] shrink-0" />
              <div className="flex-1 flex items-center justify-between px-1">
                {(() => {
                  const start = new Date(project.startDate);
                  const end = new Date(project.endDate);
                  const months: string[] = [];
                  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
                  while (cursor <= end) {
                    months.push(cursor.toLocaleDateString("en-US", { month: "short", year: "2-digit" }));
                    cursor.setMonth(cursor.getMonth() + 1);
                  }
                  return months.map((m) => (
                    <span key={m} className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">{m}</span>
                  ));
                })()}
              </div>
            </div>
            {/* Milestone bars */}
            {milestones.map((ms) => {
              const msC = msStatusColors[ms.status];
              const projStart = new Date(project.startDate).getTime();
              const projEnd = new Date(project.endDate).getTime();
              const totalDur = projEnd - projStart;
              const msIdx = milestones.indexOf(ms);
              const barStart = msIdx === 0 ? projStart : new Date(milestones[msIdx - 1].dueDate).getTime();
              const barEnd = new Date(ms.dueDate).getTime();
              const leftPct = Math.max(0, ((barStart - projStart) / totalDur) * 100);
              const widthPct = Math.max(5, ((barEnd - barStart) / totalDur) * 100);

              return (
                <div key={ms.id} className="flex items-center mb-1">
                  <div className="w-[180px] shrink-0 pr-3">
                    <p className="text-[12px] font-medium text-gray-700 truncate">{ms.title}</p>
                    <p className="text-[10px] text-gray-400">Due {formatShortDate(ms.dueDate)}</p>
                  </div>
                  <div className="flex-1 h-8 relative">
                    <div className="absolute inset-0 border-l border-gray-100" />
                    <div className="absolute top-1 h-6 rounded-md overflow-hidden"
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}>
                      <div className={cn("absolute inset-0 opacity-20", msC.bg)} />
                      <div className={cn("absolute inset-y-0 left-0 rounded-md opacity-50", msC.dot)} style={{ width: `${ms.progress}%` }} />
                      <div className={cn("absolute inset-0 rounded-md border", msC.border)} />
                      <div className="absolute inset-0 flex items-center px-2">
                        <span className={cn("text-[10px] font-semibold", msC.text)}>{ms.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
              {(["completed", "in_progress", "upcoming", "overdue"] as MilestoneStatus[]).map((status) => (
                <div key={status} className="flex items-center gap-1.5">
                  <span className={cn("w-2 h-2 rounded-sm", msStatusColors[status].dot)} />
                  <span className="text-[10px] text-gray-500 capitalize">{status.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══ DELIVERABLES ═══ */}
      <motion.div variants={fadeUp} className="card-parchment mb-6">
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
          <span className="text-sm font-semibold text-gray-800">Deliverables</span>
          <span className="text-[11px] text-gray-400">{deliverables.length} total</span>
        </div>
        <div className="hidden lg:grid items-center px-5 py-2.5"
          style={{ gridTemplateColumns: "1fr 110px 100px 90px 80px 80px", borderBottom: "1px solid var(--border-soft)", background: "color-mix(in srgb, var(--color-gray-100) 40%, white)", fontSize: 10, color: "var(--color-gray-400)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          <span>Deliverable</span><span>Status</span><span>Submitted By</span><span>Date</span><span>Evidence</span><span>Action</span>
        </div>
        {deliverables.map((del, i) => {
          const ds = deliverableStatusMap[del.status] || deliverableStatusMap.pending;
          return (
            <div key={del.id} className="flex lg:grid items-center px-5 py-3.5"
              style={{ gridTemplateColumns: "1fr 110px 100px 90px 80px 80px", borderBottom: i < deliverables.length - 1 ? "1px solid var(--border-hair)" : undefined }}>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-gray-700">{del.title}</div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">{del.taskId}</div>
              </div>
              <div className="hidden lg:block"><Badge variant={ds.variant} dot>{ds.label}</Badge></div>
              <div className="hidden lg:block text-[12px] text-gray-600">{del.submittedBy}</div>
              <div className="hidden lg:block text-[11px] text-gray-400">{formatShortDate(del.submittedAt)}</div>
              <div className="hidden lg:block">
                <Link href={`/enterprise/review/${del.id}`} className="text-[11px] font-medium text-brown-500 hover:text-brown-600">{del.evidenceFiles} files</Link>
              </div>
              <div className="hidden lg:block">
                {del.status === "pending" ? (
                  <Link href={`/enterprise/review/${del.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-gradient-to-r from-brown-400 to-brown-600 px-3 py-1.5 rounded-lg">
                    <Eye className="w-3 h-3" /> Review
                  </Link>
                ) : del.status === "rework" ? (
                  <Link href={`/enterprise/review/${del.id}`} className="text-[11px] font-medium text-brown-500 hover:text-brown-600">Feedback</Link>
                ) : (
                  <span className="text-[10px] text-gray-400 capitalize">{del.status}</span>
                )}
              </div>
            </div>
          );
        })}
        {deliverables.length === 0 && (
          <div className="py-10 text-center">
            <Package className="w-6 h-6 mx-auto mb-2 text-gray-300" />
            <p className="text-[13px] text-gray-400">No deliverables submitted yet.</p>
          </div>
        )}
      </motion.div>

      {/* ═══ EXCEPTIONS ═══ */}
      {projectExceptions.length > 0 && (
        <motion.div variants={fadeUp} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-800">Exceptions</h2>
              <span className="text-[10px] font-semibold text-gold-700 bg-gold-50 w-5 h-5 rounded-full flex items-center justify-center">
                {projectExceptions.filter((e) => !resolvedExceptions.has(e.id)).length}
              </span>
            </div>
            <Link href="/enterprise/projects/exceptions" className="text-[12px] text-brown-500 hover:text-brown-600 font-medium flex items-center gap-1">
              Exception Queue <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="card-parchment">
            {projectExceptions.map((exc, i) => {
              const isResolved = resolvedExceptions.has(exc.id);
              return (
                <div key={exc.id} className={cn("px-5 py-4 transition-opacity", isResolved && "opacity-40")}
                  style={{ borderBottom: i < projectExceptions.length - 1 ? "1px solid var(--border-hair)" : undefined }}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={cn("w-4 h-4 shrink-0 mt-0.5", exc.severity === "critical" ? "text-brown-600" : "text-gold-500")} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={exc.type === "escalation" ? "danger" : exc.type === "sla_breach" ? "brown" : "gold"}>
                          {exc.type === "escalation" ? "Escalation" : exc.type === "sla_breach" ? "SLA Breach" : "Quality Issue"}
                        </Badge>
                        <Badge variant={exc.severity === "critical" ? "brown" : "gold"}>{exc.severity}</Badge>
                        <Badge variant={isResolved ? "forest" : exc.status === "open" ? "gold" : "teal"}>
                          {isResolved ? "resolved" : exc.status}
                        </Badge>
                      </div>
                      <p className="text-[12px] text-gray-500 leading-relaxed">{exc.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{exc.date}</span>
                        {!isResolved && (
                          <button onClick={() => setResolvedExceptions((p) => { const n = new Set(p); n.add(exc.id); return n; })}
                            className="flex items-center gap-1 text-[11px] font-medium text-white bg-gradient-to-r from-brown-400 to-brown-600 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 className="w-3 h-3" /> Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}
