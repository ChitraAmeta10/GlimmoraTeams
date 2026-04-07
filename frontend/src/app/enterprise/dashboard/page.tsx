"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle, ClipboardCheck, ArrowRight, Users, Clock,
  TrendingUp, TrendingDown, CheckCircle2, XCircle, RotateCcw,
  ShieldCheck, Banknote, Target, GitBranch, Timer, CircleCheck,
  FileText, FolderKanban, Wallet, ChevronRight, Eye,
} from "lucide-react";
import { stagger, fadeUp, scaleIn } from "@/lib/utils/motion-variants";
import { mockProjects, mockDeliverables, mockPlans, mockTeams, mockAssignments } from "@/mocks/data/enterprise-projects";
import { mockSOWs } from "@/mocks/data/enterprise-sow";
import { mockInvoices, mockEscrowAccounts, billingStats } from "@/mocks/data/enterprise-billing";
import { mockActivityFeed, mockAPGRules, mockAnalytics } from "@/mocks/data/enterprise-analytics";
import type { ProjectHealth } from "@/types/enterprise";

/* ══════════════════════════════════════════ Derived data ══════════════════════════════════════════ */

const activeProjects = mockProjects.filter((p) => p.health !== "completed");
const totalEscalations = mockProjects.reduce((sum, p) => sum + p.escalations, 0);
const pendingDeliverables = mockDeliverables.filter((d) => d.status === "pending");
const reworkDeliverables = mockDeliverables.filter((d) => d.status === "rework");
const draftPlans = mockPlans.filter((p) => p.status === "draft");
const pendingApprovals = pendingDeliverables.length + draftPlans.length;
const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);
const totalSpent = mockProjects.reduce((sum, p) => sum + p.spent, 0);
const budgetUtilization = Math.round((totalSpent / totalBudget) * 100);
const overdueInvoices = mockInvoices.filter((i) => i.status === "overdue");
const pendingInvoicesList = mockInvoices.filter((i) => i.status === "pending");
const sowsInApproval = mockSOWs.filter((s) => s.status === "in_review" || s.status === "pending_commercial_review");
const avgApgScore = Math.round(mockProjects.reduce((sum, p) => sum + p.apgScore, 0) / mockProjects.length);

const sowsByStage = {
  draft: mockSOWs.filter((s) => s.status === "draft").length,
  in_review: mockSOWs.filter((s) => s.status === "in_review").length,
  pending_commercial_review: mockSOWs.filter((s) => s.status === "pending_commercial_review").length,
  approved: mockSOWs.filter((s) => s.status === "approved").length,
};
const plansByStatus = {
  draft: mockPlans.filter((p) => p.status === "draft").length,
  in_progress: mockPlans.filter((p) => p.status === "in_progress").length,
  pending_review: mockPlans.filter((p) => p.status === "pending_review").length,
  approved: mockPlans.filter((p) => p.status === "approved").length,
};
const totalContributors = mockTeams.reduce((s, t) => s + t.totalMembers, 0);
const assignmentsByStatus = { pending: mockAssignments.filter((a) => a.status === "pending_response").length };
const apgRulesEnabled = mockAPGRules.filter((r) => r.enabled).length;
const deliveryPerf = mockAnalytics.find((a) => a.id === "delivery-performance");
const onTimeDelivery = deliveryPerf?.metrics[0]?.value ?? 0;
const firstPassRate = deliveryPerf?.metrics[2]?.value ?? 0;

/* ══════════════════════════════════════════ Style configs ══════════════════════════════════════════ */

const badge: Record<string, { bg: string; color: string }> = {
  forest: { bg: "var(--color-forest-50)", color: "var(--color-forest-700)" },
  teal: { bg: "var(--color-teal-50)", color: "var(--color-teal-700)" },
  gold: { bg: "var(--color-gold-50)", color: "var(--color-gold-700)" },
  danger: { bg: "var(--danger-light)", color: "var(--danger)" },
  beige: { bg: "var(--color-gray-100)", color: "var(--color-gray-600)" },
  brown: { bg: "var(--color-brown-50)", color: "var(--color-brown-700)" },
};

const healthCfg: Record<ProjectHealth, { label: string; dot: string; badge: string; progress: string }> = {
  on_track: { label: "On Track", dot: "var(--color-forest-500)", badge: "forest", progress: "var(--color-forest-500)" },
  at_risk: { label: "At Risk", dot: "var(--color-gold-500)", badge: "gold", progress: "var(--color-gold-500)" },
  behind: { label: "Behind", dot: "var(--danger)", badge: "danger", progress: "var(--danger)" },
  completed: { label: "Completed", dot: "var(--color-teal-500)", badge: "teal", progress: "var(--color-teal-500)" },
};

const sowBadge: Record<string, string> = {
  draft: "beige",
  in_review: "teal",
  pending_commercial_review: "gold",
  approved: "forest",
  rejected: "danger",
  archived: "beige",
};
const teamBadge: Record<string, string> = { forming: "gold", ready: "teal", active: "forest", disbanded: "beige" };
const planBadge: Record<string, string> = { draft: "beige", in_progress: "gold", pending_review: "teal", approved: "forest", completed: "teal" };
const planLabel: Record<string, string> = { draft: "Draft", in_progress: "Progress", pending_review: "Review", approved: "Approved", completed: "Done" };
const typeBadge: Record<string, string> = { overdue: "danger", escalation: "gold", rework: "teal", approval: "brown", sow: "forest" };
const urgencyDot: Record<string, string> = { overdue: "var(--danger)", escalation: "var(--danger)", rework: "var(--color-gold-500)", approval: "var(--color-gold-500)", sow: "var(--color-gray-400)" };
const typeIcon: Record<string, React.ElementType> = { approval: ClipboardCheck, escalation: AlertTriangle, overdue: XCircle, rework: RotateCcw, sow: Clock };

/* ══════════════════════════════════════════ Risk helpers ══════════════════════════════════════════ */

function riskColor(score: number): string {
  if (score <= 25) return "var(--color-forest-700)";
  if (score <= 50) return "var(--color-gold-700)";
  return "var(--danger)";
}
function riskBg(score: number): string {
  if (score <= 25) return "var(--color-forest-50)";
  if (score <= 50) return "var(--color-gold-50)";
  return "var(--danger-light)";
}

/* ══════════════════════════════════════════ Inline badge helper ══════════════════════════════════════════ */

function Pill({ variant, dot, children, className }: { variant: string; dot?: boolean; children: React.ReactNode; className?: string }) {
  const s = badge[variant] || badge.beige;
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full ${className || ""}`}
      style={{ background: s.bg, color: s.color }}>
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />}
      {children}
    </span>
  );
}

/* ══════════════════════════════════════════ ProgressRing ══════════════════════════════════════════ */

function ProgressRing({ value, size = 56, stroke = 5, color = "var(--color-brown-500)", dark = false }: { value: number; size?: number; stroke?: number; color?: string; dark?: boolean }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={dark ? "rgba(255,255,255,0.2)" : "var(--border-soft)"} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c - (value / 100) * c} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.5s ease" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="num-display text-[15px]" style={{ color: dark ? "white" : "var(--ink)" }}>{value}%</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════ Sparkline ══════════════════════════════════════════ */

function SpendSparkline({ compact }: { compact?: boolean }) {
  const data = billingStats.monthlySpend;
  const max = Math.max(...data.map((d) => d.amount));
  const h = compact ? 50 : 65, w = 420, stepX = w / (data.length - 1);
  const pts = data.map((d, i) => ({ x: i * stepX, y: h - (d.amount / max) * (h - 8) - 4 }));
  const d = pts.map((p, i) => { if (i === 0) return `M${p.x},${p.y}`; const prev = pts[i - 1]; const cx = (prev.x + p.x) / 2; return `C${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`; }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: compact ? 45 : 60, overflow: "visible" }} aria-hidden>
      <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-brown-500)" stopOpacity="0.15" /><stop offset="100%" stopColor="var(--color-brown-500)" stopOpacity="0" /></linearGradient></defs>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill="url(#sg)" />
      <path d={d} fill="none" stroke="var(--color-brown-400)" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 3 : 2} fill={i === pts.length - 1 ? "var(--color-brown-500)" : "var(--color-brown-300)"} stroke={i === pts.length - 1 ? "white" : undefined} strokeWidth={i === pts.length - 1 ? 1.5 : undefined} />)}
      {!compact && data.map((m, i) => <text key={m.month} x={i * stepX} y={h} fill="var(--ink-faint)" fontSize="8" fontFamily="var(--font-mono)">{m.month}</text>)}
    </svg>
  );
}

/* ══════════════════════════════════════════ Attention Items ══════════════════════════════════════════ */

const attentionItems = [
  ...(overdueInvoices.length > 0 ? [{ id: "att-overdue", title: `${overdueInvoices.length} Overdue Invoice${overdueInvoices.length > 1 ? "s" : ""}`, desc: `$${overdueInvoices.reduce((s, i) => s + i.amount, 0).toLocaleString()} past due`, type: "overdue", href: "/enterprise/billing/invoices", time: "Overdue" }] : []),
  ...(totalEscalations > 0 ? [{ id: "att-esc", title: `${totalEscalations} Active Escalation${totalEscalations > 1 ? "s" : ""}`, desc: `APG flagged across ${activeProjects.filter((p) => p.escalations > 0).length} projects`, type: "escalation", href: "/enterprise/projects", time: "Active" }] : []),
  ...(reworkDeliverables.length > 0 ? [{ id: "att-rework", title: `${reworkDeliverables.length} Rework Request${reworkDeliverables.length > 1 ? "s" : ""}`, desc: reworkDeliverables.map((d) => d.title).join(", "), type: "rework", href: "/enterprise/review", time: "In Progress" }] : []),
  ...(pendingDeliverables.length > 0 ? [{ id: "att-del", title: `${pendingDeliverables.length} Pending Review${pendingDeliverables.length > 1 ? "s" : ""}`, desc: pendingDeliverables.slice(0, 2).map((d) => d.title).join(", "), type: "approval", href: "/enterprise/review", time: "Awaiting" }] : []),
  ...(sowsInApproval.length > 0 ? [{ id: "att-sow", title: `SOW: ${sowsInApproval[0].title}`, desc: `Legal review — ${sowsInApproval[0].client}`, type: "sow", href: `/enterprise/sow/${sowsInApproval[0].id}/approve`, time: "In Review" }] : []),
  ...(draftPlans.length > 0 ? [{ id: "att-plans", title: `${draftPlans.length} Plan${draftPlans.length > 1 ? "s" : ""} Draft`, desc: draftPlans.map((p) => p.title).join(", "), type: "approval", href: "/enterprise/decomposition", time: "Draft" }] : []),
];

/* ══════════════════════════════════════════ Helpers ══════════════════════════════════════════ */

function getGreeting() { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; }
function getTimeAgo(ts: string) { const h = Math.floor((Date.now() - new Date(ts).getTime()) / 3600000); return h < 1 ? "Just now" : h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`; }

/* ══════════════════════════════════════════ DASHBOARD ══════════════════════════════════════════ */

export default function EnterpriseDashboardPage() {
  const greeting = getGreeting();
  const dateString = new Date().toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" });

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">

      {/* ═══ HERO ═══ */}
      <motion.div variants={fadeUp} className="flex items-end justify-between mb-8">
        <div>
          <div className="label-caps mb-2">Enterprise Console</div>
          <h1 className="font-heading leading-tight text-gray-900" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>
            {greeting}, <span className="text-brown-500">Priya.</span>
          </h1>
          <p className="mt-1.5 text-[13px] text-gray-500">
            {attentionItems.length > 0 ? <>{attentionItems.length} item{attentionItems.length > 1 ? "s" : ""} requiring attention.</> : "All systems operational."}
          </p>
        </div>
        <div className="mono-label hidden md:block text-gray-400">{dateString}</div>
      </motion.div>

      {/* ═══ KPI CARDS ═══ */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Active SOWs", value: mockSOWs.length, sub: `${sowsByStage.in_review + sowsByStage.pending_commercial_review} in review`, icon: FileText, iconBg: "bg-gradient-to-br from-brown-400 to-brown-600" },
          { label: "Active Projects", value: activeProjects.length, sub: "+1 this month", icon: FolderKanban, iconBg: "bg-gradient-to-br from-gold-400 to-gold-600", trend: true },
          { label: "APG Escalations", value: totalEscalations, sub: `Across ${activeProjects.filter(p => p.escalations > 0).length} projects`, icon: AlertTriangle, iconBg: "bg-gradient-to-br from-brown-500 to-brown-700" },
          { label: "Pending Reviews", value: pendingApprovals, link: "/enterprise/review", linkText: "Review now", icon: ClipboardCheck, iconBg: "bg-gradient-to-br from-teal-400 to-teal-600" },
        ].map((kpi) => {
          const KpiIcon = kpi.icon;
          return (
          <motion.div key={kpi.label} variants={scaleIn} className="card-parchment flex items-center gap-5 px-5 py-5">
            {/* Solid gradient icon */}
            <div className={`w-12 h-12 rounded-2xl ${kpi.iconBg} flex items-center justify-center shrink-0`}>
              <KpiIcon className="w-5 h-5 text-white" />
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium text-gray-400">{kpi.label}</div>
              <div className="num-display text-[28px] text-gray-900 leading-none mt-1">{kpi.value}</div>
              {kpi.sub && <div className="text-[11px] mt-1.5 text-gray-400">{kpi.trend && <TrendingUp className="w-3 h-3 inline mr-1 text-forest-500" />}{kpi.sub}</div>}
              {kpi.link && <Link href={kpi.link} className="flex items-center gap-1 mt-1.5 text-[11px] font-medium text-brown-500 hover:text-brown-600">{kpi.linkText} <ArrowRight className="w-3 h-3" /></Link>}
            </div>
          </motion.div>
          );
        })}
        {/* Budget — progress ring */}
        <motion.div variants={scaleIn} className="card-parchment flex items-center gap-4 px-5 py-5">
          <ProgressRing value={budgetUtilization} />
          <div>
            <div className="text-[11px] font-medium text-gray-400 mb-1">Budget</div>
            <div className="num-display text-[22px] text-gray-900">${Math.round(totalSpent / 1000)}k</div>
            <div className="text-[10px] text-gray-400 mt-0.5">of ${Math.round(totalBudget / 1000)}k</div>
          </div>
        </motion.div>
      </motion.div>

      {/* ═══ SOW PIPELINE + ATTENTION ═══ */}
      <motion.div variants={fadeUp} className="grid gap-3 mb-6" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="card-parchment">
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <span className="text-sm font-semibold text-gray-800">SOW Pipeline</span>
            <Link href="/enterprise/sow" className="flex items-center gap-1 text-xs font-medium text-brown-500 hover:text-brown-600">Manage <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="py-2">
            {mockSOWs.slice(0, 5).map((sow, i) => {
              const statusIcon: Record<string, { icon: React.ElementType; color: string }> = {
                draft: { icon: FileText, color: "text-brown-400" },
                in_review: { icon: Eye, color: "text-teal-500" },
                pending_commercial_review: { icon: ClipboardCheck, color: "text-gold-500" },
                approved: { icon: CheckCircle2, color: "text-forest-500" },
                rejected: { icon: XCircle, color: "text-red-500" },
                archived: { icon: FileText, color: "text-gray-400" },
              };
              const statusLabel: Record<string, string> = {
                draft: "Draft",
                in_review: "In Review",
                pending_commercial_review: "Pending Commercial Review",
                approved: "Approved",
                rejected: "Rejected",
                archived: "Archived",
              };
              const si = statusIcon[sow.status] || statusIcon.draft;
              const SowIcon = si.icon;
              const completedStages = sow.approvalStages?.filter((s) => s.status === "approved").length ?? 0;
              const currentStage = sow.approvalStages?.find((s) => s.status === "in_review");
              const totalStages = sow.approvalStages?.length ?? 5;

              return (
                <Link key={sow.id} href={`/enterprise/sow/${sow.id}`}>
                  <div className="group flex items-center gap-3 py-3.5 px-6 transition-colors hover:bg-black/[0.02]"
                    style={{ borderBottom: i < 4 ? "1px solid var(--border-hair)" : undefined }}>
                    <SowIcon className={`w-[18px] h-[18px] shrink-0 ${si.color}`} />
                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium truncate text-gray-700">{sow.title}</div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] text-gray-400">{sow.client}</span>
                        {/* Pipeline progress dots */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalStages }).map((_, si) => (
                            <div key={si} className="rounded-full" style={{
                              width: si < completedStages ? 12 : 6,
                              height: 4,
                              borderRadius: 100,
                              background: si < completedStages
                                ? "var(--color-forest-500)"
                                : si === completedStages && currentStage
                                  ? "var(--color-gold-500)"
                                  : "var(--color-gray-200)",
                              transition: "all 0.3s",
                            }} />
                          ))}
                          <span className="text-[9px] font-mono text-gray-400 ml-1">{completedStages}/{totalStages}</span>
                        </div>
                      </div>
                    </div>
                    {/* Risk pill */}
                    {sow.riskScore.overall > 0 && (
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full shrink-0"
                        style={{ color: riskColor(sow.riskScore.overall), background: riskBg(sow.riskScore.overall) }}>
                        {sow.riskScore.overall}
                      </span>
                    )}
                    <Pill variant={sowBadge[sow.status] || "beige"} className="ml-1 shrink-0">{statusLabel[sow.status] || sow.status}</Pill>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="card-parchment">
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <span className="text-sm font-semibold text-gray-800">Needs Attention</span>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brown-400 to-brown-600 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">{attentionItems.length}</span>
            </div>
          </div>
          <div className="py-2">
            {attentionItems.map((item, i) => {
              const Icon = typeIcon[item.type] || ClipboardCheck;
              const isCritical = item.type === "overdue" || item.type === "escalation";
              const iconColor: Record<string, string> = {
                overdue: "text-brown-600",
                escalation: "text-brown-600",
                rework: "text-gold-500",
                approval: "text-gold-500",
                sow: "text-gray-400",
              };
              return (
                <Link key={item.id} href={item.href}>
                  <div className="group flex items-center gap-3 py-3.5 px-6 transition-colors hover:bg-black/[0.02]"
                    style={{ borderBottom: i < attentionItems.length - 1 ? "1px solid var(--border-hair)" : undefined }}>
                    <Icon className={`w-[18px] h-[18px] shrink-0 ${iconColor[item.type] || "text-gray-400"}`} />
                    <div className="flex-1 min-w-0">
                      <div className={`text-[13px] font-medium ${isCritical ? "text-gray-800" : "text-gray-700"}`}>{item.title}</div>
                      <div className={`text-[11px] mt-0.5 truncate ${isCritical ? "text-gray-500" : "text-gray-400"}`}>{item.desc}</div>
                    </div>
                    <Pill variant={typeBadge[item.type] || "beige"} className="shrink-0">{item.time}</Pill>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </Link>
              );
            })}
            {attentionItems.length === 0 && (
              <div className="text-center py-10"><CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-forest-500" /><p className="text-[13px] font-medium text-gray-600">All clear</p></div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ═══ ACTIVE PROJECTS ═══ */}
      <motion.div variants={fadeUp} className="card-parchment mb-6">
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
          <span className="text-sm font-semibold text-gray-800">Active Projects</span>
          <Link href="/enterprise/projects" className="flex items-center gap-1 text-xs font-medium text-brown-500 hover:text-brown-600">View all <ArrowRight className="w-3 h-3" /></Link>
        </div>
        <div className="hidden lg:grid items-center px-6 py-2.5" style={{ gridTemplateColumns: "1fr 130px 100px 190px 100px 20px", borderBottom: "1px solid var(--border-soft)", background: "color-mix(in srgb, var(--color-gray-100) 40%, white)", fontSize: 10, color: "var(--color-gray-400)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          <span>Project</span><span>Client</span><span>Health</span><span>Progress</span><span className="text-right">Spend</span><span />
        </div>
        {mockProjects.map((project, i) => {
          const h = healthCfg[project.health];
          const budgetPct = Math.round((project.spent / project.budget) * 100);
          return (
            <Link key={project.id} href={`/enterprise/projects/${project.id}`}>
              <div className="group flex lg:grid items-center px-6 py-4 transition-colors hover:bg-black/[0.02]"
                style={{ gridTemplateColumns: "1fr 130px 100px 190px 100px 20px", borderBottom: i < mockProjects.length - 1 ? "1px solid var(--border-hair)" : undefined }}>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-gray-700">{project.title}</div>
                  <div className="flex items-center gap-2.5 mt-1">
                    <span className="lg:hidden text-[11px] text-gray-400">{project.client}</span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-400"><Users className="w-3 h-3" />{project.teamSize}</span>
                    {project.escalations > 0 && (
                      <span className="flex items-center gap-1 text-[10px] text-gold-600"><AlertTriangle className="w-3 h-3" />{project.escalations}</span>
                    )}
                  </div>
                </div>
                <div className="hidden lg:block text-[12px] text-gray-400">{project.client}</div>
                <div className="hidden lg:block"><Pill variant={h.badge} dot>{h.label}</Pill></div>
                <div className="hidden lg:flex items-center gap-3">
                  <div className="flex-1 h-[6px] rounded-full bg-gray-100 overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${project.progress}%`, background: h.progress }} /></div>
                  <span className="text-[11px] font-mono font-medium w-8 text-right text-gray-600">{project.progress}%</span>
                </div>
                <div className="text-right ml-4 lg:ml-0 shrink-0">
                  <div className="text-[12px] font-medium text-gray-700">${Math.round(project.spent / 1000)}k</div>
                  <div className="text-[10px] text-gray-400 mb-1">of ${Math.round(project.budget / 1000)}k</div>
                  <div className="h-[3px] rounded-full bg-gray-100 overflow-hidden w-16 ml-auto">
                    <div className="h-full rounded-full" style={{ width: `${budgetPct}%`, background: budgetPct > 85 ? "var(--danger)" : "var(--color-brown-400)" }} />
                  </div>
                </div>
                <div className="hidden lg:flex justify-end">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          );
        })}
      </motion.div>

      {/* ═══ DECOMP + TEAMS + FINANCIAL ═══ */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
        {/* Decomposition */}
        <div className="card-parchment">
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <span className="text-sm font-semibold text-gray-800">Decomposition</span>
            <Link href="/enterprise/decomposition" className="flex items-center gap-1 text-xs font-medium text-brown-500 hover:text-brown-600">All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="py-2">
            {mockPlans.slice(0, 4).map((plan, i) => {
              const statusDot: Record<string, string> = { draft: "bg-gray-300", in_progress: "bg-gold-500", pending_review: "bg-teal-500", approved: "bg-forest-500", completed: "bg-teal-400" };
              return (
                <Link key={plan.id} href={`/enterprise/decomposition/${plan.id}`}>
                  <div className="group flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-black/[0.02]"
                    style={{ borderBottom: i < 3 ? "1px solid var(--border-hair)" : undefined }}>
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusDot[plan.status] || "bg-gray-300"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-medium truncate text-gray-700">{plan.title}</div>
                      <div className="flex items-center gap-2.5 mt-1.5">
                        <span className="text-[10px] text-gray-400">{plan.totalTasks} tasks</span>
                        <span className="text-[10px] text-gray-400">{plan.totalMilestones} milestones</span>
                        {/* AI confidence bar */}
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-[3px] rounded-full bg-gray-100 overflow-hidden">
                            <div className="h-full rounded-full bg-brown-400" style={{ width: `${plan.aiConfidence}%` }} />
                          </div>
                          <span className="font-mono text-[9px] text-brown-500">{plan.aiConfidence}%</span>
                        </div>
                      </div>
                    </div>
                    <Pill variant={planBadge[plan.status] || "beige"}>{planLabel[plan.status] || plan.status}</Pill>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Teams */}
        <div className="card-parchment">
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <span className="text-sm font-semibold text-gray-800">Teams</span>
            <Link href="/enterprise/team" className="flex items-center gap-1 text-xs font-medium text-brown-500 hover:text-brown-600">All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="py-2">
            {/* Summary strip — tinted pills */}
            <div className="grid grid-cols-3 gap-2 px-6 py-3 mb-1" style={{ borderBottom: "1px solid var(--border-hair)" }}>
              {[{ v: totalContributors, l: "People", bg: "bg-brown-50" }, { v: mockTeams.length, l: "Teams", bg: "bg-teal-50" }, { v: assignmentsByStatus.pending, l: "Pending", bg: "bg-gold-50" }].map((m) => (
                <div key={m.l} className={`text-center rounded-xl py-2.5 ${m.bg}`}>
                  <span className="num-display text-[20px] text-gray-900">{m.v}</span>
                  <div className="text-[9px] text-gray-400 uppercase tracking-wider mt-0.5">{m.l}</div>
                </div>
              ))}
            </div>
            {/* Team rows */}
            {mockTeams.map((team, i) => {
              const statusDot: Record<string, string> = { forming: "bg-gold-500", ready: "bg-teal-500", active: "bg-forest-500", disbanded: "bg-gray-300" };
              return (
                <Link key={team.id} href={`/enterprise/team/${team.id}`}>
                  <div className="group flex items-center gap-3 px-6 py-3 transition-colors hover:bg-black/[0.02]"
                    style={{ borderBottom: i < mockTeams.length - 1 ? "1px solid var(--border-hair)" : undefined }}>
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusDot[team.status] || "bg-gray-300"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-medium truncate text-gray-700">{team.name}</div>
                      <div className="flex items-center gap-2.5 mt-1">
                        <span className="flex items-center gap-1 text-[10px] text-gray-400"><Users className="w-3 h-3" />{team.totalMembers}</span>
                        <span className="font-mono text-[9px] text-brown-500">{team.matchScore}% match</span>
                      </div>
                    </div>
                    <Pill variant={teamBadge[team.status] || "beige"} className="capitalize">{team.status}</Pill>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Financial */}
        <div className="card-parchment">
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <span className="text-sm font-semibold text-gray-800">Financial</span>
            <Link href="/enterprise/billing" className="flex items-center gap-1 text-xs font-medium text-brown-500 hover:text-brown-600">Details <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="py-2">
            {/* Total spend hero number */}
            <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border-hair)" }}>
              <div className="label-caps mb-1">Total Spent</div>
              <div className="flex items-baseline gap-2">
                <span className="num-display text-[28px] text-gray-900">${Math.round(billingStats.totalSpent / 1000)}k</span>
                <span className="flex items-center gap-1 text-[11px] text-brown-500"><TrendingDown className="w-2.5 h-2.5" /> −48% this month</span>
              </div>
              <div className="mt-3">
                <SpendSparkline compact />
              </div>
            </div>
            {/* Financial breakdown rows */}
            {[
              { label: "Escrow Held", value: `$${Math.round(mockEscrowAccounts.reduce((s, e) => s + e.totalHeld, 0) / 1000)}k`, icon: ShieldCheck, danger: false },
              { label: "Pending Pay", value: `$${Math.round(pendingInvoicesList.reduce((s, inv) => s + inv.amount, 0) / 1000)}k`, icon: Clock, danger: false },
              { label: "Overdue", value: overdueInvoices.length > 0 ? `$${Math.round(overdueInvoices.reduce((s, inv) => s + inv.amount, 0) / 1000)}k` : "$0", icon: XCircle, danger: overdueInvoices.length > 0 },
            ].map((m, i, arr) => {
              const MI = m.icon;
              return (
                <div key={m.label} className="flex items-center gap-3 px-6 py-3.5"
                  style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--border-hair)" : undefined, background: m.danger ? "color-mix(in srgb, var(--danger) 3%, transparent)" : undefined }}>
                  <MI className={`w-[18px] h-[18px] shrink-0 ${m.danger ? "text-red-500" : ""}`}
                    style={m.danger ? undefined : { color: "var(--color-brown-400)" }} />
                  <span className="text-[12.5px] text-gray-600 flex-1">{m.label}</span>
                  <span className={`num-display text-[16px] ${m.danger ? "text-red-500" : "text-gray-900"}`}>{m.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ═══ AI & GOVERNANCE ═══ */}
      <motion.div variants={fadeUp} className="card-parchment">
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-800">AI & Governance</span>
            <Pill variant="brown">{apgRulesEnabled}/{mockAPGRules.length} rules</Pill>
          </div>
          <Link href="/enterprise/audit" className="flex items-center gap-1 text-xs font-medium text-brown-500 hover:text-brown-600">Audit log <ArrowRight className="w-3 h-3" /></Link>
        </div>

        {/* Metrics strip */}
        <div className="grid grid-cols-3 gap-3 px-6 py-4" style={{ borderBottom: "1px solid var(--border-hair)" }}>
          {[
            { icon: Timer, label: "On-Time Delivery", value: `${onTimeDelivery}%`, bg: "bg-brown-50", iconColor: "text-brown-500" },
            { icon: CircleCheck, label: "First-Pass Rate", value: `${firstPassRate}%`, bg: "bg-teal-50", iconColor: "text-teal-500" },
            { icon: Target, label: "APG Score", value: `${avgApgScore}`, bg: "bg-gold-50", iconColor: "text-gold-500" },
          ].map((m) => (
            <div key={m.label} className={`flex items-center gap-3 ${m.bg} rounded-xl px-4 py-3.5`}>
              <m.icon className={`w-[18px] h-[18px] ${m.iconColor} shrink-0`} />
              <div>
                <div className="num-display text-[18px] text-gray-900">{m.value}</div>
                <div className="text-[9px] text-gray-400 mt-0.5">{m.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity sub-header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Recent Activity</span>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-forest-500" />
            </span>
            <span className="text-[10px] text-gray-400">Live</span>
          </div>
        </div>

        {/* Activity feed — single column */}
        <div className="pb-2">
          {mockActivityFeed.slice(0, 5).map((event, i) => {
            const isAI = event.actor === "APG System" || event.actor === "Finance Team";
            const initials = event.actor.split(" ").map((w: string) => w[0]).join("").slice(0, 2);
            return (
              <div key={event.id} className="flex items-start gap-3 px-6 py-3 transition-colors hover:bg-black/[0.02]"
                style={{ borderBottom: i < 4 ? "1px solid var(--border-hair)" : undefined }}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold ${isAI ? "bg-brown-100 text-brown-600" : "bg-gray-100 text-gray-500"}`}>
                  {isAI ? <Bot className="w-3.5 h-3.5" /> : initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-gray-500 leading-relaxed">
                    <span className={`font-medium ${isAI ? "text-brown-600" : "text-gray-700"}`}>
                      {event.actor}
                    </span>{" "}{event.action}{" "}
                    <span className="font-medium text-gray-800">{event.target}</span>
                  </div>
                  <div className="text-[10px] mt-0.5 text-gray-400">{getTimeAgo(event.timestamp)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

    </motion.div>
  );
}
