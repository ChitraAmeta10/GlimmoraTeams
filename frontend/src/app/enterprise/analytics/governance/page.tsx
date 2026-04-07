"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Bot,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Zap,
  Download,
  FileText,
  Filter,
  Eye,
  ChevronDown,
  ChevronUp,
  User,
  GitCompareArrows,
  CheckSquare,
  Square,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from "@/components/ui";
import { toast } from "@/lib/stores/toast-store";

/* ==============================================================
   I3 — Governance & Risk Dashboard
   SOW: Section 19.4, Section 14, Section 3.1.MVP.8
   Steps: 1-Risk Overview, 2-Incidents, 3-Fraud Flags,
          4-Override Audit, 5-Trend Analysis
   ============================================================== */

/* -- Filter options -- */
const severityOptions = ["All Severities", "Critical", "High", "Medium", "Low"];
const typeOptions = ["All Types", "Quality Breach", "Fraud Flag", "SLA Breach", "Budget Overrun", "Rework Limit"];
const dateRangeOptions = ["Last 7 days", "Last 30 days", "This Quarter", "This Year"];
const apgDecisionOptions = ["All Decisions", "Rework", "Reassigned", "Freeze", "Escalated", "Approved", "Warning", "Alert"];

/* -- Step 1: KPI Data (SOW: active incidents, fraud flags, admin overrides, SLA breaches, escalations) -- */
const kpis = [
  { label: "Open Incidents", value: "7", change: "+2", positive: false, icon: AlertTriangle, bg: "bg-gold-50", iconColor: "text-gold-600" },
  { label: "Fraud Flags", value: "3", change: "+1", positive: false, icon: ShieldAlert, bg: "bg-brown-50", iconColor: "text-brown-600" },
  { label: "SLA Breaches", value: "4", change: "+1", positive: false, icon: Clock, bg: "bg-teal-50", iconColor: "text-teal-600" },
  { label: "APG Overrides", value: "12", change: "+4", positive: false, icon: Bot, bg: "bg-forest-50", iconColor: "text-forest-600" },
  { label: "Escalations", value: "5", change: "+2", positive: false, icon: Zap, bg: "bg-gold-50", iconColor: "text-gold-700" },
  { label: "Governance Score", value: "84%", change: "+2.1%", positive: true, icon: ShieldCheck, bg: "bg-forest-50", iconColor: "text-forest-600" },
];

/* -- Step 2: Incident Timeline Data -- */
const incidentTimeline = [
  { id: "inc-001", timestamp: "2026-03-06T10:30:00Z", severity: "high" as const, type: "Quality Breach", description: "Deliverable 'Auth Service MFA' failed quality gate -- acceptance score 62/85.", actor: "APG System", status: "open" as const, project: "ERP Platform", projectId: "proj-001" },
  { id: "inc-002", timestamp: "2026-03-06T08:15:00Z", severity: "critical" as const, type: "Fraud Flag", description: "Anomalous submission pattern detected for Contributor X-4R -- 3 identical files in 2 hours.", actor: "Fraud Engine", status: "investigating" as const, project: "ERP Platform", projectId: "proj-001" },
  { id: "inc-003", timestamp: "2026-03-05T17:45:00Z", severity: "medium" as const, type: "SLA Breach", description: "Review turnaround for 'Database Schema v2' exceeded 48h SLA by 6 hours.", actor: "APG System", status: "open" as const, project: "ERP Platform", projectId: "proj-001" },
  { id: "inc-004", timestamp: "2026-03-05T14:00:00Z", severity: "high" as const, type: "Budget Overrun", description: "CRM Integration project spending at 91% of budget with only 18% completion.", actor: "APG System", status: "escalated" as const, project: "CRM Integration", projectId: "proj-004" },
  { id: "inc-005", timestamp: "2026-03-05T11:30:00Z", severity: "low" as const, type: "Rework Limit", description: "Contributor B-3K has 3 consecutive rework cycles on Auth Service -- approaching limit.", actor: "APG System", status: "resolved" as const, project: "ERP Platform", projectId: "proj-001" },
  { id: "inc-006", timestamp: "2026-03-04T16:00:00Z", severity: "medium" as const, type: "Fraud Flag", description: "Unusual login pattern detected -- 4 different IPs in 30 minutes for team account.", actor: "Fraud Engine", status: "resolved" as const, project: "Mobile Banking", projectId: "proj-002" },
  { id: "inc-007", timestamp: "2026-03-04T09:30:00Z", severity: "critical" as const, type: "Fraud Flag", description: "Evidence files contain metadata from a different contributor -- possible submission proxy.", actor: "Fraud Engine", status: "investigating" as const, project: "E-Commerce", projectId: "proj-003" },
];

/* -- Step 3: Fraud Flags Data (SOW: plagiarism, behavioral anomaly, identity verification) -- */
const fraudFlags = [
  { id: "ff-001", type: "Behavioral Anomaly" as const, contributor: "X-4R", confidence: 94, evidence: "3 identical files submitted within 2 hours -- code hash match 99.7%", evidenceFiles: ["submission_auth_v3.zip", "submission_auth_v3_copy.zip", "submission_auth_v3_final.zip"], detectedBy: "Fraud Engine v2.1", project: "ERP Platform", projectId: "proj-001", task: "Auth Service MFA", timestamp: "2026-03-06T08:15:00Z", status: "investigating" as const },
  { id: "ff-002", type: "Identity Verification" as const, contributor: "L-7M", confidence: 78, evidence: "Login from 4 distinct IPs across 3 countries within 30 minutes", evidenceFiles: ["login_audit_L7M.csv", "ip_geolocation_report.pdf"], detectedBy: "Identity Verification Engine", project: "Mobile Banking", projectId: "proj-002", task: "Payment Gateway Integration", timestamp: "2026-03-04T16:00:00Z", status: "resolved" as const },
  { id: "ff-003", type: "Plagiarism / Duplication" as const, contributor: "K-2N", confidence: 89, evidence: "Evidence file metadata shows authorship by a different contributor -- possible proxy submission", evidenceFiles: ["deliverable_ecommerce_ui.zip", "metadata_analysis.json"], detectedBy: "Content Similarity Engine", project: "E-Commerce", projectId: "proj-003", task: "Product Catalog Frontend", timestamp: "2026-03-04T09:30:00Z", status: "investigating" as const },
];

/* -- Risk Matrix Data -- */
const riskMatrix = [
  { likelihood: 4, severity: 4, label: "Budget overrun + delay", count: 1 },
  { likelihood: 3, severity: 4, label: "Fraud attempt", count: 2 },
  { likelihood: 3, severity: 3, label: "Quality breach", count: 3 },
  { likelihood: 2, severity: 3, label: "SLA violation", count: 2 },
  { likelihood: 4, severity: 2, label: "Rework cycles", count: 4 },
  { likelihood: 1, severity: 4, label: "Data leak", count: 0 },
  { likelihood: 2, severity: 2, label: "Team capacity", count: 1 },
  { likelihood: 3, severity: 1, label: "Minor escalation", count: 3 },
];

/* -- Step 4: APG Intervention Log (with override user/reason per SOW) -- */
const apgInterventions = [
  { id: "apg-001", timestamp: "2026-03-06T10:30:00Z", rule: "Quality Gate Threshold", action: "Flagged for manual review", target: "Auth Service MFA", decision: "rework_requested" as const, overridden: false, overriddenBy: null as string | null, overrideReason: null as string | null, affectedEntity: "Task task-002 in ERP Platform" },
  { id: "apg-002", timestamp: "2026-03-05T17:45:00Z", rule: "Response Time SLA", action: "Reassigned to backup reviewer", target: "Database Schema v2", decision: "auto_reassigned" as const, overridden: false, overriddenBy: null, overrideReason: null, affectedEntity: "Review R-1042 for task-003" },
  { id: "apg-003", timestamp: "2026-03-05T14:00:00Z", rule: "Budget Overrun Alert", action: "Froze non-critical tasks", target: "CRM Integration Module", decision: "auto_freeze" as const, overridden: true, overriddenBy: "Priya Nair", overrideReason: "Budget freeze paused critical-path tasks -- unfreezing to maintain delivery timeline. Additional $12k contingency allocated.", affectedEntity: "Project proj-004 (CRM Integration)" },
  { id: "apg-004", timestamp: "2026-03-04T11:00:00Z", rule: "Auto-Escalation", action: "Created escalation ticket", target: "Auth Service MFA", decision: "escalated" as const, overridden: false, overriddenBy: null, overrideReason: null, affectedEntity: "Escalation ESC-089 for task-002" },
  { id: "apg-005", timestamp: "2026-03-03T16:30:00Z", rule: "Quality Gate Threshold", action: "Auto-approved (score 92/85)", target: "Monorepo Infrastructure", decision: "auto_approved" as const, overridden: false, overriddenBy: null, overrideReason: null, affectedEntity: "Deliverable D-001 for task-001" },
  { id: "apg-006", timestamp: "2026-03-03T09:00:00Z", rule: "Rework Limit", action: "Sent warning notification", target: "Contributor B-3K", decision: "warning_sent" as const, overridden: false, overriddenBy: null, overrideReason: null, affectedEntity: "Contributor B-3K rework count: 3/4" },
  { id: "apg-007", timestamp: "2026-03-02T14:30:00Z", rule: "Timeline SLA Warning", action: "Alert sent to project manager", target: "Finance Module tasks", decision: "alert_sent" as const, overridden: false, overriddenBy: null, overrideReason: null, affectedEntity: "3 tasks overdue in Phase 2" },
  { id: "apg-008", timestamp: "2026-03-01T10:00:00Z", rule: "Budget Overrun Alert", action: "Notification to owner", target: "Mobile Banking App", decision: "alert_sent" as const, overridden: true, overriddenBy: "Rajesh Kumar", overrideReason: "Owner acknowledged overspend -- allocated additional budget from contingency reserve. No task freeze needed.", affectedEntity: "Project proj-002 (Mobile Banking)" },
];

/* -- Step 5: Trend Data + Previous Period for comparison -- */
const incidentTrend = [
  { week: "W1 Feb", incidents: 2, fraud: 0, sla: 1 },
  { week: "W2 Feb", incidents: 3, fraud: 1, sla: 1 },
  { week: "W3 Feb", incidents: 1, fraud: 0, sla: 0 },
  { week: "W4 Feb", incidents: 4, fraud: 1, sla: 2 },
  { week: "W1 Mar", incidents: 5, fraud: 2, sla: 1 },
  { week: "W2 Mar", incidents: 7, fraud: 3, sla: 4 },
];

const prevPeriodTrend = [
  { week: "W3 Dec", incidents: 1, fraud: 0, sla: 0 },
  { week: "W4 Dec", incidents: 2, fraud: 0, sla: 1 },
  { week: "W1 Jan", incidents: 3, fraud: 1, sla: 1 },
  { week: "W2 Jan", incidents: 2, fraud: 0, sla: 0 },
  { week: "W3 Jan", incidents: 3, fraud: 1, sla: 2 },
  { week: "W4 Jan", incidents: 2, fraud: 1, sla: 1 },
];

/* -- Helpers -- */
const severityConfig: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: "bg-brown-100", text: "text-brown-800", border: "border-brown-300" },
  high: { bg: "bg-gold-50", text: "text-gold-700", border: "border-gold-300" },
  medium: { bg: "bg-beige-100", text: "text-beige-700", border: "border-beige-300" },
  low: { bg: "bg-forest-50", text: "text-forest-700", border: "border-forest-300" },
};

const statusConfig: Record<string, { variant: "gold" | "brown" | "teal" | "forest" | "beige"; label: string }> = {
  open: { variant: "gold", label: "Open" },
  investigating: { variant: "brown", label: "Investigating" },
  escalated: { variant: "teal", label: "Escalated" },
  resolved: { variant: "forest", label: "Resolved" },
};

const decisionBadge: Record<string, { variant: "forest" | "gold" | "brown" | "teal" | "beige"; label: string }> = {
  rework_requested: { variant: "gold", label: "Rework" },
  auto_reassigned: { variant: "teal", label: "Reassigned" },
  auto_freeze: { variant: "brown", label: "Freeze" },
  escalated: { variant: "brown", label: "Escalated" },
  auto_approved: { variant: "forest", label: "Approved" },
  warning_sent: { variant: "beige", label: "Warning" },
  alert_sent: { variant: "beige", label: "Alert" },
};

const confidenceColor = (c: number) => {
  if (c >= 90) return { bg: "bg-brown-100", text: "text-brown-800" };
  if (c >= 70) return { bg: "bg-gold-50", text: "text-gold-700" };
  return { bg: "bg-beige-100", text: "text-beige-700" };
};

function formatTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

/* -- Risk Matrix Component -- */
function RiskMatrixGrid() {
  const severityLabels = ["Negligible", "Minor", "Moderate", "Major", "Critical"];
  const likelihoodLabels = ["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"];

  const cellMap: Record<string, typeof riskMatrix> = {};
  riskMatrix.forEach((r) => {
    const key = `${r.likelihood}-${r.severity}`;
    if (!cellMap[key]) cellMap[key] = [];
    cellMap[key].push(r);
  });

  function cellColor(lik: number, sev: number): string {
    const score = lik + sev;
    if (score >= 7) return "bg-brown-200/80";
    if (score >= 5) return "bg-gold-100/80";
    if (score >= 3) return "bg-beige-100/60";
    return "bg-forest-50/60";
  }

  return (
    <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
      <h3 className="text-[14px] font-semibold text-brown-800 mb-1">Risk Matrix</h3>
      <p className="text-[11px] text-beige-500 mb-4">Severity vs likelihood of identified risks</p>

      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          <div className="grid grid-cols-[80px_repeat(5,1fr)] gap-1 mb-1">
            <div />
            {severityLabels.map((s) => (
              <div key={s} className="text-center text-[9px] font-semibold text-beige-500 uppercase tracking-wider py-1">{s}</div>
            ))}
          </div>

          {[4, 3, 2, 1, 0].map((lik) => (
            <div key={lik} className="grid grid-cols-[80px_repeat(5,1fr)] gap-1 mb-1">
              <div className="flex items-center text-[9px] font-semibold text-beige-500 uppercase tracking-wider pr-1 text-right">
                {likelihoodLabels[lik]}
              </div>
              {[0, 1, 2, 3, 4].map((sev) => {
                const items = cellMap[`${lik}-${sev}`] || [];
                return (
                  <div key={sev} className={cn("h-12 rounded-lg flex items-center justify-center relative border border-white/50", cellColor(lik, sev))}>
                    {items.length > 0 && (
                      <span className="text-[11px] font-bold text-brown-800">
                        {items.reduce((s, i) => s + i.count, 0)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          <div className="flex items-center justify-between mt-2 px-[80px]">
            <span className="text-[9px] text-beige-400">Low Severity</span>
            <span className="text-[9px] text-beige-400 font-medium">SEVERITY &rarr;</span>
            <span className="text-[9px] text-beige-400">High Severity</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-beige-100">
        {[
          { label: "Critical", color: "bg-brown-200" },
          { label: "High", color: "bg-gold-100" },
          { label: "Medium", color: "bg-beige-100" },
          { label: "Low", color: "bg-forest-50" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={cn("w-3 h-2.5 rounded-sm", l.color)} />
            <span className="text-[10px] text-beige-500">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -- Step 5: Trend Chart with Compare Periods (SOW: change time period, compare periods) -- */
function TrendChart({ showCompare }: { showCompare: boolean }) {
  const allData = showCompare ? [...incidentTrend, ...prevPeriodTrend] : incidentTrend;
  const maxVal = Math.max(...allData.map((d) => d.incidents), 1);
  const pad = 25;
  const w = 520;
  const h = 150;

  function toPoints(data: typeof incidentTrend, key: "incidents" | "fraud" | "sla") {
    return data.map((d, i) => ({
      x: pad + (i / (data.length - 1)) * (w - pad * 2),
      y: h - pad - (d[key] / maxVal) * (h - pad * 2 - 5),
    }));
  }

  const incPts = toPoints(incidentTrend, "incidents");
  const fraudPts = toPoints(incidentTrend, "fraud");
  const slaPts = toPoints(incidentTrend, "sla");

  const prevIncPts = showCompare ? toPoints(prevPeriodTrend, "incidents") : [];
  const prevFraudPts = showCompare ? toPoints(prevPeriodTrend, "fraud") : [];
  const prevSlaPts = showCompare ? toPoints(prevPeriodTrend, "sla") : [];

  const mkLine = (pts: { x: number; y: number }[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[180px]">
      {[0, 1, 2, 3].map((i) => {
        const y = pad + (i * (h - pad * 2)) / 3;
        const val = Math.round(maxVal - (i * maxVal) / 3);
        return (
          <g key={i}>
            <line x1={pad} y1={y} x2={w - pad} y2={y} stroke="#E9DFD7" strokeWidth="0.5" />
            <text x={pad - 4} y={y + 3} textAnchor="end" fontSize="7" fill="#B8A99A">{val}</text>
          </g>
        );
      })}

      <defs>
        <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A67763" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#A67763" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path
        d={`M${incPts[0].x},${h - pad} ${incPts.map((p) => `L${p.x},${p.y}`).join(" ")} L${incPts[incPts.length - 1].x},${h - pad} Z`}
        fill="url(#incGrad)"
      />

      {/* Previous period dashed lines */}
      {showCompare && (
        <>
          <polyline points={mkLine(prevIncPts)} fill="none" stroke="#A67763" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3" opacity="0.45" />
          <polyline points={mkLine(prevFraudPts)} fill="none" stroke="#D0B060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3" opacity="0.45" />
          <polyline points={mkLine(prevSlaPts)} fill="none" stroke="#5B9BA2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3" opacity="0.45" />
          {prevIncPts.map((p, i) => (
            <circle key={`pi-${i}`} cx={p.x} cy={p.y} r="2" fill="white" stroke="#A67763" strokeWidth="1" opacity="0.45" />
          ))}
        </>
      )}

      {/* Current period solid lines */}
      <polyline points={mkLine(incPts)} fill="none" stroke="#A67763" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={mkLine(fraudPts)} fill="none" stroke="#D0B060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={mkLine(slaPts)} fill="none" stroke="#5B9BA2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots + labels */}
      {incPts.map((p, i) => (
        <g key={`i-${i}`}>
          <circle cx={p.x} cy={p.y} r="3" fill="white" stroke="#A67763" strokeWidth="1.5" />
          <text x={p.x} y={h - 6} textAnchor="middle" fontSize="7" fill="#B8A99A">{incidentTrend[i].week}</text>
        </g>
      ))}
      {fraudPts.map((p, i) => (
        <circle key={`f-${i}`} cx={p.x} cy={p.y} r="2.5" fill="white" stroke="#D0B060" strokeWidth="1.5" />
      ))}
      {slaPts.map((p, i) => (
        <circle key={`s-${i}`} cx={p.x} cy={p.y} r="2.5" fill="white" stroke="#5B9BA2" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

/* ==============================================================
   PAGE COMPONENT
   ============================================================== */
export default function GovernanceRiskPage() {
  /* -- Incident filters -- */
  const [incidentFilter, setIncidentFilter] = React.useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = React.useState("All Severities");
  const [typeFilter, setTypeFilter] = React.useState("All Types");
  const [activeDateRange, setActiveDateRange] = React.useState("This Quarter");
  const [expandedIncident, setExpandedIncident] = React.useState<string | null>(null);

  /* -- Incident action dialog -- */
  const [incidentActionOpen, setIncidentActionOpen] = React.useState(false);
  const [incidentActionType, setIncidentActionType] = React.useState<"resolve" | "escalate" | "dismiss">("resolve");
  const [incidentActionTarget, setIncidentActionTarget] = React.useState("");
  const [incidentActionNotes, setIncidentActionNotes] = React.useState("");

  /* -- Fraud flag action dialog -- */
  const [fraudActionOpen, setFraudActionOpen] = React.useState(false);
  const [fraudActionType, setFraudActionType] = React.useState<"dismiss" | "escalate" | "resolve">("dismiss");
  const [fraudActionTarget, setFraudActionTarget] = React.useState<string>("");
  const [fraudActionReason, setFraudActionReason] = React.useState("");

  /* -- Fraud flag evidence review dialog -- */
  const [reviewOpen, setReviewOpen] = React.useState(false);
  const [reviewTarget, setReviewTarget] = React.useState<typeof fraudFlags[0] | null>(null);

  /* -- Fraud flag bulk selection -- */
  const [selectedFlags, setSelectedFlags] = React.useState<Set<string>>(new Set());
  const [bulkActionOpen, setBulkActionOpen] = React.useState(false);
  const [bulkActionType, setBulkActionType] = React.useState<"dismiss" | "escalate" | "resolve">("dismiss");
  const [bulkActionNotes, setBulkActionNotes] = React.useState("");

  /* -- APG log state -- */
  const [apgDecisionFilter, setApgDecisionFilter] = React.useState("All Decisions");
  const [expandedApg, setExpandedApg] = React.useState<string | null>(null);

  /* -- Trend comparison -- */
  const [showComparePeriod, setShowComparePeriod] = React.useState(false);

  /* -- Filtered incidents -- */
  const filteredIncidents = incidentTimeline.filter((inc) => {
    if (incidentFilter && inc.status !== incidentFilter) return false;
    if (severityFilter !== "All Severities" && inc.severity !== severityFilter.toLowerCase()) return false;
    if (typeFilter !== "All Types" && inc.type !== typeFilter) return false;
    return true;
  });

  /* -- Filtered APG interventions -- */
  const filteredApg = apgInterventions.filter((apg) => {
    if (apgDecisionFilter === "All Decisions") return true;
    const db = decisionBadge[apg.decision];
    return db && db.label === apgDecisionFilter;
  });

  /* -- Incident action handlers -- */
  function openIncidentAction(type: "resolve" | "escalate" | "dismiss", incidentId: string) {
    setIncidentActionType(type);
    setIncidentActionTarget(incidentId);
    setIncidentActionNotes("");
    setIncidentActionOpen(true);
  }

  function handleIncidentAction() {
    const labels = { resolve: "resolved", escalate: "escalated", dismiss: "dismissed" };
    toast.success(`Incident ${incidentActionTarget.toUpperCase()} ${labels[incidentActionType]} successfully.`);
    setIncidentActionOpen(false);
  }

  /* -- Fraud flag action handlers -- */
  function openFraudAction(type: "dismiss" | "escalate" | "resolve", flagId: string) {
    setFraudActionType(type);
    setFraudActionTarget(flagId);
    setFraudActionReason("");
    setFraudActionOpen(true);
  }

  function handleFraudAction() {
    const labels = { dismiss: "dismissed", escalate: "escalated", resolve: "resolved" };
    toast.success(`Fraud flag ${fraudActionTarget} ${labels[fraudActionType]} successfully.`);
    setFraudActionOpen(false);
  }

  /* -- Fraud flag review handler -- */
  function openReview(flag: typeof fraudFlags[0]) {
    setReviewTarget(flag);
    setReviewOpen(true);
  }

  /* -- Bulk selection helpers -- */
  function toggleFlag(id: string) {
    setSelectedFlags((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllFlags() {
    if (selectedFlags.size === fraudFlags.length) {
      setSelectedFlags(new Set());
    } else {
      setSelectedFlags(new Set(fraudFlags.map((f) => f.id)));
    }
  }

  function openBulkAction(type: "dismiss" | "escalate" | "resolve") {
    setBulkActionType(type);
    setBulkActionNotes("");
    setBulkActionOpen(true);
  }

  function handleBulkAction() {
    const labels = { dismiss: "dismissed", escalate: "escalated", resolve: "resolved" };
    toast.success(`${selectedFlags.size} fraud flag(s) ${labels[bulkActionType]} successfully.`);
    setBulkActionOpen(false);
    setSelectedFlags(new Set());
  }

  const allSelected = selectedFlags.size === fraudFlags.length;
  const someSelected = selectedFlags.size > 0 && selectedFlags.size < fraudFlags.length;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-6"
    >
      {/* -- Header with export -- */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Link
            href="/enterprise/analytics"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-teal-600 hover:text-teal-700 transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Analytics
          </Link>
          <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em]">
            Governance & Risk
          </h1>
          <p className="text-[13px] text-beige-500 mt-1">
            Incident tracking, fraud detection flags, APG autonomous interventions, and risk posture.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => toast.info("CSV export would be generated for the governance report.")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-beige-200 bg-white/70 text-[11px] font-medium text-brown-700 hover:bg-beige-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
          <button
            onClick={() => toast.info("PDF report would be generated for the governance overview.")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brown-600 text-[11px] font-medium text-white hover:bg-brown-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            PDF
          </button>
        </div>
      </motion.div>

      {/* -- Filter bar -- */}
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap items-center gap-3 rounded-xl border border-beige-200/50 bg-white/60 backdrop-blur-sm px-4 py-2.5"
      >
        <Filter className="w-3.5 h-3.5 text-beige-400" />
        <span className="text-[11px] font-semibold text-brown-700 tracking-wide uppercase">Filters</span>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="h-8 rounded-lg border border-beige-200/50 bg-white/70 px-3 text-[11px] text-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-200/30"
        >
          {severityOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-8 rounded-lg border border-beige-200/50 bg-white/70 px-3 text-[11px] text-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-200/30"
        >
          {typeOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="flex items-center gap-1 ml-auto">
          {dateRangeOptions.map((range) => (
            <button
              key={range}
              onClick={() => setActiveDateRange(range)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors",
                activeDateRange === range
                  ? "bg-brown-600 text-white"
                  : "text-beige-500 hover:bg-beige-100/60 hover:text-brown-700"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </motion.div>

      {/* -- Step 1: KPI Row -- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              variants={fadeUp}
              className="group rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", kpi.bg)}>
                  <Icon className={cn("w-3.5 h-3.5", kpi.iconColor)} />
                </div>
                <div className="flex items-center gap-0.5">
                  {kpi.positive ? (
                    <ArrowUpRight className="w-2.5 h-2.5 text-forest-500" />
                  ) : (
                    <ArrowDownRight className="w-2.5 h-2.5 text-gold-600" />
                  )}
                  <span className={cn("text-[9px] font-semibold", kpi.positive ? "text-forest-600" : "text-gold-600")}>
                    {kpi.change}
                  </span>
                </div>
              </div>
              <p className="text-[20px] font-bold text-brown-900 tracking-tight">{kpi.value}</p>
              <p className="text-[10px] text-beige-500 mt-0.5">{kpi.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* -- Step 2: Incident Timeline + Risk Matrix -- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <motion.div variants={fadeUp} className="lg:col-span-3">
          <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-[14px] font-semibold text-brown-800">Incident Timeline</h3>
                <p className="text-[11px] text-beige-500 mt-0.5">Click to expand -- recent governance events and alerts</p>
              </div>
              <div className="flex items-center gap-1.5">
                {(["all", "open", "investigating", "escalated", "resolved"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setIncidentFilter(f === "all" ? null : f)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all capitalize",
                      (f === "all" && !incidentFilter) || incidentFilter === f
                        ? "bg-brown-500 text-white border-brown-500"
                        : "bg-white/60 text-brown-600 border-beige-200 hover:border-beige-300"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {filteredIncidents.map((inc) => {
                const sc = severityConfig[inc.severity];
                const st = statusConfig[inc.status];
                const isExpanded = expandedIncident === inc.id;
                return (
                  <div
                    key={inc.id}
                    className={cn(
                      "rounded-xl border p-4 transition-all cursor-pointer",
                      sc.border, "bg-white/60",
                      isExpanded ? "shadow-md ring-1 ring-brown-200/50" : "hover:shadow-md"
                    )}
                    onClick={() => setExpandedIncident(isExpanded ? null : inc.id)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md uppercase", sc.bg, sc.text)}>
                          {inc.severity}
                        </span>
                        <span className="text-[12px] font-semibold text-brown-800">{inc.type}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3 text-beige-400" /> : <ChevronDown className="w-3 h-3 text-beige-400" />}
                      </div>
                      <Badge variant={st.variant} size="sm" dot>{st.label}</Badge>
                    </div>
                    <p className="text-[11px] text-brown-600 leading-relaxed mb-2">{inc.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-beige-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(inc.timestamp)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bot className="w-3 h-3" />
                        <span>{inc.actor}</span>
                      </div>
                      <Link
                        href={`/enterprise/projects/${inc.projectId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-teal-600 hover:text-teal-700 hover:underline"
                      >
                        <span>{inc.project}</span>
                      </Link>
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-beige-100 space-y-2">
                        <div className="grid grid-cols-2 gap-3 text-[11px]">
                          <div>
                            <span className="text-beige-500">Incident ID:</span>
                            <span className="ml-1.5 font-medium text-brown-700">{inc.id.toUpperCase()}</span>
                          </div>
                          <div>
                            <span className="text-beige-500">Detected by:</span>
                            <span className="ml-1.5 font-medium text-brown-700">{inc.actor}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {inc.status !== "resolved" && (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); openIncidentAction("resolve", inc.id); }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-forest-50 text-[10px] font-medium text-forest-700 hover:bg-forest-100 transition-colors"
                              >
                                <CheckCircle2 className="w-3 h-3" /> Resolve
                              </button>
                              {inc.status !== "escalated" && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); openIncidentAction("escalate", inc.id); }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gold-50 text-[10px] font-medium text-gold-700 hover:bg-gold-100 transition-colors"
                                >
                                  <Zap className="w-3 h-3" /> Escalate
                                </button>
                              )}
                            </>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); openIncidentAction("dismiss", inc.id); }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-beige-100 text-[10px] font-medium text-beige-600 hover:bg-beige-200 transition-colors"
                          >
                            <XCircle className="w-3 h-3" /> Dismiss
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredIncidents.length === 0 && (
                <div className="text-center py-8">
                  <ShieldCheck className="w-8 h-8 text-beige-300 mx-auto mb-2" />
                  <p className="text-[12px] text-beige-500">No active governance incidents.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-2">
          <RiskMatrixGrid />
        </motion.div>
      </div>

      {/* -- Step 3: Fraud Flags (SOW Section 14) with bulk actions -- */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-brown-600" />
            <h2 className="text-[16px] font-bold text-brown-900">Fraud Flags</h2>
            <Badge variant="brown" size="sm">{fraudFlags.length}</Badge>
          </div>
          <span className="text-[10px] text-beige-500">Plagiarism, behavioral anomaly, and identity verification flags</span>
        </div>
        <p className="text-[11px] text-beige-500 mb-4">
          Each flag includes confidence level, evidence summary, and available actions -- review, dismiss, escalate, or resolve.
        </p>

        {/* Bulk selection bar */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-beige-100">
          <button
            onClick={toggleAllFlags}
            className="inline-flex items-center gap-2 text-[11px] font-medium text-brown-600 hover:text-brown-800 transition-colors"
          >
            {allSelected ? (
              <CheckSquare className="w-4 h-4 text-brown-600" />
            ) : someSelected ? (
              <Minus className="w-4 h-4 text-brown-400 border border-brown-400 rounded-[3px] p-[1px]" />
            ) : (
              <Square className="w-4 h-4 text-beige-400" />
            )}
            {allSelected ? "Deselect all" : "Select all"}
          </button>

          <AnimatePresence>
            {selectedFlags.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="flex items-center gap-2"
              >
                <span className="text-[10px] text-beige-500 mr-1">{selectedFlags.size} selected</span>
                <button
                  onClick={() => openBulkAction("resolve")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-forest-50 text-[10px] font-medium text-forest-700 hover:bg-forest-100 transition-colors"
                >
                  <CheckCircle2 className="w-3 h-3" /> Bulk Resolve
                </button>
                <button
                  onClick={() => openBulkAction("escalate")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gold-50 text-[10px] font-medium text-gold-700 hover:bg-gold-100 transition-colors"
                >
                  <Zap className="w-3 h-3" /> Bulk Escalate
                </button>
                <button
                  onClick={() => openBulkAction("dismiss")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-beige-100 text-[10px] font-medium text-beige-600 hover:bg-beige-200 transition-colors"
                >
                  <XCircle className="w-3 h-3" /> Bulk Dismiss
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-3">
          {fraudFlags.map((flag) => {
            const cc = confidenceColor(flag.confidence);
            const st = statusConfig[flag.status];
            const isSelected = selectedFlags.has(flag.id);
            return (
              <div key={flag.id} className={cn(
                "rounded-xl border p-4 transition-all",
                isSelected ? "border-brown-300 bg-brown-50/30 ring-1 ring-brown-200/50" : "border-beige-200/50 bg-white/60"
              )}>
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleFlag(flag.id)}
                    className="mt-0.5 shrink-0"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-brown-600" />
                    ) : (
                      <Square className="w-4 h-4 text-beige-400 hover:text-beige-600 transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brown-100 text-brown-800 uppercase">{flag.type}</span>
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", cc.bg, cc.text)}>
                          {flag.confidence}% confidence
                        </span>
                        <Badge variant={st.variant} size="sm" dot>{st.label}</Badge>
                      </div>
                      <span className="text-[10px] text-beige-400 shrink-0">{formatTime(flag.timestamp)}</span>
                    </div>
                    <p className="text-[11px] text-brown-600 leading-relaxed mb-2">{flag.evidence}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[10px] text-beige-400">
                        <span>Contributor: <span className="font-medium text-brown-600">{flag.contributor}</span></span>
                        <Link
                          href={`/enterprise/projects/${flag.projectId}`}
                          className="text-teal-600 hover:text-teal-700 hover:underline"
                        >
                          {flag.project}
                        </Link>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openFraudAction("resolve", flag.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-forest-50 text-[10px] font-medium text-forest-700 hover:bg-forest-100 transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Resolve
                        </button>
                        <button
                          onClick={() => openFraudAction("escalate", flag.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gold-50 text-[10px] font-medium text-gold-700 hover:bg-gold-100 transition-colors"
                        >
                          <Zap className="w-3 h-3" /> Escalate
                        </button>
                        <button
                          onClick={() => openFraudAction("dismiss", flag.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-beige-100 text-[10px] font-medium text-beige-600 hover:bg-beige-200 transition-colors"
                        >
                          <XCircle className="w-3 h-3" /> Dismiss
                        </button>
                        <button
                          onClick={() => openReview(flag)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-50 text-[10px] font-medium text-teal-700 hover:bg-teal-100 transition-colors"
                        >
                          <Eye className="w-3 h-3" /> Review
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* -- Step 4: APG Intervention Log (Override Audit) with filter + expand -- */}
      <motion.div variants={fadeUp}>
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-beige-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-teal-500" />
              <h3 className="text-[14px] font-semibold text-brown-800">APG Intervention Log</h3>
              <Badge variant="teal" size="sm">{filteredApg.length}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={apgDecisionFilter}
                onChange={(e) => setApgDecisionFilter(e.target.value)}
                className="h-8 rounded-lg border border-beige-200/50 bg-white/70 px-3 text-[11px] text-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-200/30"
              >
                {apgDecisionOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <button
                onClick={() => toast.info("CSV export would be generated for the APG intervention log.")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-beige-200 bg-white/70 text-[10px] font-medium text-brown-700 hover:bg-beige-50 transition-colors"
              >
                <Download className="w-3 h-3" />
                Export
              </button>
            </div>
          </div>

          <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-2.5 border-b border-beige-50 text-[10px] font-semibold text-beige-500 uppercase tracking-wider">
            <div className="col-span-2">Timestamp</div>
            <div className="col-span-2">Rule</div>
            <div className="col-span-3">Action</div>
            <div className="col-span-2">Target</div>
            <div className="col-span-1 text-center">Decision</div>
            <div className="col-span-2 text-center">Override</div>
          </div>

          {filteredApg.length === 0 && (
            <div className="py-8 text-center">
              <Bot className="w-8 h-8 text-beige-300 mx-auto mb-2" />
              <p className="text-[12px] text-beige-500">No interventions match the filter.</p>
            </div>
          )}

          {filteredApg.map((apg) => {
            const db = decisionBadge[apg.decision] || decisionBadge.alert_sent;
            const isExpanded = expandedApg === apg.id;
            return (
              <div key={apg.id}>
                <div
                  className={cn(
                    "grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 px-5 py-3 border-b border-beige-50 last:border-0 transition-colors items-center cursor-pointer",
                    isExpanded ? "bg-beige-50/60" : "hover:bg-beige-50/40"
                  )}
                  onClick={() => setExpandedApg(isExpanded ? null : apg.id)}
                >
                  <div className="col-span-2 flex items-center gap-1.5 text-[11px] text-beige-500">
                    <Clock className="w-3 h-3 text-beige-400 shrink-0" />
                    {formatTime(apg.timestamp)}
                  </div>
                  <div className="col-span-2 text-[11px] font-medium text-brown-700 truncate">{apg.rule}</div>
                  <div className="col-span-3 text-[11px] text-brown-600 truncate">{apg.action}</div>
                  <div className="col-span-2 text-[11px] text-beige-600 truncate">{apg.target}</div>
                  <div className="col-span-1 text-center">
                    <Badge variant={db.variant} size="sm">{db.label}</Badge>
                  </div>
                  <div className="col-span-2 flex items-center justify-center gap-1">
                    {apg.overridden ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gold-600 bg-gold-50 px-2 py-0.5 rounded-md">
                        <RotateCcw className="w-3 h-3" /> Overridden
                      </span>
                    ) : (
                      <span className="text-[10px] text-beige-400">--</span>
                    )}
                    {isExpanded ? <ChevronUp className="w-3 h-3 text-beige-400 ml-1" /> : <ChevronDown className="w-3 h-3 text-beige-400 ml-1" />}
                  </div>
                </div>

                {/* Expanded detail row */}
                {isExpanded && (
                  <div className="bg-beige-50/40 px-5 py-4 border-b border-beige-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[11px]">
                      <div>
                        <span className="text-beige-500 block mb-0.5">Intervention ID</span>
                        <span className="font-medium text-brown-700">{apg.id.toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="text-beige-500 block mb-0.5">Affected Entity</span>
                        <span className="font-medium text-brown-700">{apg.affectedEntity}</span>
                      </div>
                      <div>
                        <span className="text-beige-500 block mb-0.5">Triggered Rule</span>
                        <span className="font-medium text-brown-700">{apg.rule}</span>
                      </div>
                    </div>

                    {apg.overridden && apg.overriddenBy && (
                      <div className="mt-4 pt-3 border-t border-beige-200/50">
                        <div className="flex items-center gap-2 mb-2">
                          <RotateCcw className="w-3.5 h-3.5 text-gold-600" />
                          <span className="text-[12px] font-semibold text-gold-700">Admin Override</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
                          <div>
                            <span className="text-beige-500 block mb-0.5">Overridden By</span>
                            <span className="inline-flex items-center gap-1.5 font-medium text-brown-700">
                              <User className="w-3 h-3 text-brown-400" />
                              {apg.overriddenBy}
                            </span>
                          </div>
                          <div>
                            <span className="text-beige-500 block mb-0.5">Reason</span>
                            <span className="font-medium text-brown-700 leading-relaxed">{apg.overrideReason}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {!apg.overridden && (
                      <div className="mt-3 pt-3 border-t border-beige-200/50">
                        <span className="text-[11px] text-beige-400">No admin override -- APG decision stands as executed.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* -- Step 5: Trend Analysis with Compare Periods (SOW: change time period, compare periods) -- */}
      <motion.div variants={fadeUp}>
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[14px] font-semibold text-brown-800">Governance Trends</h3>
              <p className="text-[11px] text-beige-500 mt-0.5">Weekly incident, fraud flag, and SLA breach trends</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Compare toggle */}
              <button
                onClick={() => setShowComparePeriod(!showComparePeriod)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium border transition-all",
                  showComparePeriod
                    ? "bg-brown-600 text-white border-brown-600"
                    : "bg-white/60 text-brown-600 border-beige-200 hover:border-beige-300"
                )}
              >
                <GitCompareArrows className="w-3.5 h-3.5" />
                vs Previous Period
              </button>

              {/* Legend */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-0.5 bg-brown-500 rounded" />
                  <span className="text-[9px] text-beige-500">Incidents</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-0.5 bg-gold-500 rounded" />
                  <span className="text-[9px] text-beige-500">Fraud</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-0.5 bg-teal-500 rounded" />
                  <span className="text-[9px] text-beige-500">SLA</span>
                </div>
                {showComparePeriod && (
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-0.5 bg-beige-400 rounded" style={{ borderTop: "1.5px dashed" }} />
                    <span className="text-[9px] text-beige-500">Previous</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <TrendChart showCompare={showComparePeriod} />
        </div>
      </motion.div>

      {/* ═════════════════ DIALOGS ═════════════════ */}

      {/* -- Incident Action Dialog -- */}
      <Dialog open={incidentActionOpen} onOpenChange={setIncidentActionOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="capitalize">{incidentActionType} Incident</DialogTitle>
            <DialogDescription>
              {incidentActionType === "resolve"
                ? "Mark this incident as resolved. Provide resolution notes for the audit trail."
                : incidentActionType === "escalate"
                ? "Escalate this incident to the governance team for further investigation."
                : "Dismiss this incident with a reason. This action will be logged."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div>
              <label className="text-[12px] font-medium text-brown-700 mb-1.5 block">Incident ID</label>
              <input
                type="text"
                value={incidentActionTarget.toUpperCase()}
                readOnly
                className="w-full h-9 rounded-lg border border-beige-200 bg-beige-50/50 px-3 text-[13px] text-brown-600"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-brown-700 mb-1.5 block">
                {incidentActionType === "resolve" ? "Resolution Notes" : incidentActionType === "escalate" ? "Escalation Reason" : "Dismissal Reason"}
              </label>
              <textarea
                value={incidentActionNotes}
                onChange={(e) => setIncidentActionNotes(e.target.value)}
                placeholder={
                  incidentActionType === "resolve" ? "Describe the resolution..." :
                  incidentActionType === "escalate" ? "Describe why this needs escalation..." :
                  "Reason for dismissal..."
                }
                rows={3}
                className="w-full rounded-lg border border-beige-200 bg-white px-3 py-2 text-[13px] text-brown-800 placeholder:text-beige-400 focus:outline-none focus:ring-2 focus:ring-brown-200/40 focus:border-brown-300 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIncidentActionOpen(false)}>Cancel</Button>
            <Button onClick={handleIncidentAction} disabled={!incidentActionNotes.trim()}>
              {incidentActionType === "resolve" ? "Mark Resolved" : incidentActionType === "escalate" ? "Escalate" : "Dismiss"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* -- Fraud Action Dialog -- */}
      <Dialog open={fraudActionOpen} onOpenChange={setFraudActionOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="capitalize">{fraudActionType} Fraud Flag</DialogTitle>
            <DialogDescription>
              {fraudActionType === "dismiss"
                ? "Provide a reason for dismissing this fraud flag. This action will be logged in the audit trail."
                : fraudActionType === "escalate"
                ? "Escalate this fraud flag to the security team for further investigation."
                : "Mark this fraud flag as resolved with a resolution note."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div>
              <label className="text-[12px] font-medium text-brown-700 mb-1.5 block">Flag ID</label>
              <input
                type="text"
                value={fraudActionTarget}
                readOnly
                className="w-full h-9 rounded-lg border border-beige-200 bg-beige-50/50 px-3 text-[13px] text-brown-600"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-brown-700 mb-1.5 block">
                {fraudActionType === "dismiss" ? "Reason for Dismissal" : fraudActionType === "escalate" ? "Escalation Notes" : "Resolution Notes"}
              </label>
              <textarea
                value={fraudActionReason}
                onChange={(e) => setFraudActionReason(e.target.value)}
                placeholder={fraudActionType === "dismiss" ? "e.g., False positive -- verified contributor identity" : "Describe the action taken..."}
                rows={3}
                className="w-full rounded-lg border border-beige-200 bg-white px-3 py-2 text-[13px] text-brown-800 placeholder:text-beige-400 focus:outline-none focus:ring-2 focus:ring-brown-200/40 focus:border-brown-300 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFraudActionOpen(false)}>Cancel</Button>
            <Button onClick={handleFraudAction} disabled={!fraudActionReason.trim()}>
              {fraudActionType === "dismiss" ? "Dismiss Flag" : fraudActionType === "escalate" ? "Escalate" : "Mark Resolved"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* -- Fraud Flag Evidence Review Dialog -- */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Evidence Review -- {reviewTarget?.id?.toUpperCase()}</DialogTitle>
            <DialogDescription>
              Full evidence details for this fraud flag. Review all artifacts before taking action.
            </DialogDescription>
          </DialogHeader>
          {reviewTarget && (
            <div className="space-y-4 py-3">
              {/* Flag summary */}
              <div className="rounded-lg border border-beige-200 bg-beige-50/50 p-3">
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-beige-500 block mb-0.5">Flag Type</span>
                    <span className="font-semibold text-brown-800">{reviewTarget.type}</span>
                  </div>
                  <div>
                    <span className="text-beige-500 block mb-0.5">Confidence</span>
                    <span className={cn("font-semibold", reviewTarget.confidence >= 90 ? "text-brown-700" : reviewTarget.confidence >= 70 ? "text-gold-700" : "text-beige-700")}>
                      {reviewTarget.confidence}%
                    </span>
                  </div>
                  <div>
                    <span className="text-beige-500 block mb-0.5">Contributor</span>
                    <span className="font-medium text-brown-700">{reviewTarget.contributor}</span>
                  </div>
                  <div>
                    <span className="text-beige-500 block mb-0.5">Detected By</span>
                    <span className="font-medium text-brown-700">{reviewTarget.detectedBy}</span>
                  </div>
                  <div>
                    <span className="text-beige-500 block mb-0.5">Project / Task</span>
                    <Link href={`/enterprise/projects/${reviewTarget.projectId}`} className="font-medium text-teal-600 hover:text-teal-700 hover:underline">
                      {reviewTarget.project}
                    </Link>
                    <span className="text-beige-400 mx-1">/</span>
                    <span className="font-medium text-brown-700">{reviewTarget.task}</span>
                  </div>
                  <div>
                    <span className="text-beige-500 block mb-0.5">Timestamp</span>
                    <span className="font-medium text-brown-700">{formatTime(reviewTarget.timestamp)}</span>
                  </div>
                </div>
              </div>

              {/* Evidence description */}
              <div>
                <label className="text-[12px] font-medium text-brown-700 mb-1.5 block">Evidence Summary</label>
                <div className="rounded-lg border border-beige-200 bg-white p-3 text-[12px] text-brown-700 leading-relaxed">
                  {reviewTarget.evidence}
                </div>
              </div>

              {/* Evidence files */}
              <div>
                <label className="text-[12px] font-medium text-brown-700 mb-1.5 block">Evidence Files</label>
                <div className="space-y-1.5">
                  {reviewTarget.evidenceFiles.map((file) => (
                    <div key={file} className="flex items-center gap-2 rounded-lg border border-beige-200 bg-white px-3 py-2">
                      <FileText className="w-3.5 h-3.5 text-beige-400 shrink-0" />
                      <span className="text-[12px] text-brown-700 flex-1 truncate">{file}</span>
                      <button
                        onClick={() => toast.info(`File "${file}" would be downloaded.`)}
                        className="text-[10px] font-medium text-teal-600 hover:text-teal-700 transition-colors shrink-0"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewOpen(false)}>Close</Button>
            <Button
              onClick={() => {
                setReviewOpen(false);
                if (reviewTarget) openFraudAction("resolve", reviewTarget.id);
              }}
            >
              Take Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* -- Bulk Action Dialog -- */}
      <Dialog open={bulkActionOpen} onOpenChange={setBulkActionOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="capitalize">Bulk {bulkActionType} Fraud Flags</DialogTitle>
            <DialogDescription>
              This will {bulkActionType} {selectedFlags.size} selected fraud flag(s). Provide a reason -- this action will be logged for each flag.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div>
              <label className="text-[12px] font-medium text-brown-700 mb-1.5 block">Selected Flags</label>
              <div className="flex flex-wrap gap-1.5">
                {Array.from(selectedFlags).map((id) => (
                  <span key={id} className="inline-flex items-center px-2 py-0.5 rounded-md bg-brown-100 text-[10px] font-semibold text-brown-800">
                    {id}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-brown-700 mb-1.5 block">
                {bulkActionType === "dismiss" ? "Reason for Dismissal" : bulkActionType === "escalate" ? "Escalation Notes" : "Resolution Notes"}
              </label>
              <textarea
                value={bulkActionNotes}
                onChange={(e) => setBulkActionNotes(e.target.value)}
                placeholder="Provide a reason that applies to all selected flags..."
                rows={3}
                className="w-full rounded-lg border border-beige-200 bg-white px-3 py-2 text-[13px] text-brown-800 placeholder:text-beige-400 focus:outline-none focus:ring-2 focus:ring-brown-200/40 focus:border-brown-300 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkActionOpen(false)}>Cancel</Button>
            <Button onClick={handleBulkAction} disabled={!bulkActionNotes.trim()}>
              {bulkActionType === "dismiss" ? `Dismiss ${selectedFlags.size} Flags` : bulkActionType === "escalate" ? `Escalate ${selectedFlags.size} Flags` : `Resolve ${selectedFlags.size} Flags`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
