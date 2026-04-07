"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  Eye,
  Flame,
  ShieldAlert,
  Timer,
  TrendingDown,
  User,
  Wrench,
  Zap,
  CheckCircle2,
  ArrowLeft,
  FileText,
  Search,
  ArrowUpDown,
  ArrowUpRight,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/stores/toast-store";
import { stagger, fadeUp, scaleIn } from "@/lib/utils/motion-variants";
import {
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui";
import { mockProjects } from "@/mocks/data/enterprise-projects";

/* -- Exception types -- */
type ExceptionType = "escalation" | "sla_breach" | "quality_issue" | "overdue";
type Severity = "critical" | "high" | "warning";
type ExceptionStatus = "open" | "investigating" | "resolved";

interface ExceptionItem {
  id: string;
  type: ExceptionType;
  severity: Severity;
  status: ExceptionStatus;
  projectId: string;
  projectName: string;
  taskName: string;
  description: string;
  reportedDate: string;
  assignedTo: string;
}

/* -- Type config -- */
const typeConfig: Record<
  ExceptionType,
  {
    label: string;
    badge: "danger" | "gold" | "brown" | "teal";
    icon: React.ElementType;
  }
> = {
  escalation: { label: "Escalation", badge: "danger", icon: Flame },
  sla_breach: { label: "SLA Breach", badge: "brown", icon: Timer },
  quality_issue: { label: "Quality Issue", badge: "gold", icon: TrendingDown },
  overdue: { label: "Overdue", badge: "gold", icon: Clock },
};

/* -- Severity config -- */
const severityConfig: Record<
  Severity,
  { label: string; color: string; border: string }
> = {
  critical: {
    label: "Critical",
    color: "bg-brown-100 text-brown-700",
    border: "border-l-brown-600",
  },
  high: {
    label: "High",
    color: "bg-gold-100 text-gold-700",
    border: "border-l-gold-500",
  },
  warning: {
    label: "Warning",
    color: "bg-beige-200 text-beige-600",
    border: "border-l-beige-400",
  },
};

/* -- Status config -- */
const statusConfig: Record<
  ExceptionStatus,
  { label: string; variant: "gold" | "teal" | "forest" }
> = {
  open: { label: "Open", variant: "gold" },
  investigating: { label: "Investigating", variant: "teal" },
  resolved: { label: "Resolved", variant: "forest" },
};

/* -- Filter tabs -- */
const filterTabs: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "escalation", label: "Escalations" },
  { key: "sla_breach", label: "SLA Breaches" },
  { key: "quality_issue", label: "Quality Issues" },
  { key: "overdue", label: "Overdue" },
];

/* -- Mock exceptions across all projects -- */
const mockExceptions: ExceptionItem[] = [
  {
    id: "exc-001",
    type: "escalation",
    severity: "critical",
    status: "open",
    projectId: mockProjects[1]?.id ?? "proj-002",
    projectName: mockProjects[1]?.title ?? "Mobile Banking App Redesign",
    taskName: "API Integration Module",
    description:
      "Client escalated: API integration deliverable has failed review twice. Requesting senior mentor reassignment and timeline extension.",
    reportedDate: "2026-03-06T10:00:00Z",
    assignedTo: "Contributor I-6T",
  },
  {
    id: "exc-002",
    type: "sla_breach",
    severity: "critical",
    status: "investigating",
    projectId: mockProjects[3]?.id ?? "proj-004",
    projectName: mockProjects[3]?.title ?? "CRM Integration Module",
    taskName: "CRM Data Sync Engine",
    description:
      "Review SLA breached: Task evidence pack pending mentor review for 52 hours, exceeding the 48-hour SLA threshold.",
    reportedDate: "2026-03-06T06:00:00Z",
    assignedTo: "Contributor D-2M",
  },
  {
    id: "exc-003",
    type: "quality_issue",
    severity: "high",
    status: "open",
    projectId: mockProjects[1]?.id ?? "proj-002",
    projectName: mockProjects[1]?.title ?? "Mobile Banking App Redesign",
    taskName: "Biometric Auth Flow",
    description:
      "APG flagged: Review pass rate dropped to 58% over the last 5 submissions. APG quality threshold is 75%. Rework cycle increasing.",
    reportedDate: "2026-03-05T18:00:00Z",
    assignedTo: "Contributor H-4P",
  },
  {
    id: "exc-004",
    type: "overdue",
    severity: "high",
    status: "open",
    projectId: mockProjects[0]?.id ?? "proj-001",
    projectName:
      mockProjects[0]?.title ?? "Enterprise Resource Planning Platform",
    taskName: "Finance Module - General Ledger",
    description:
      'Milestone "Finance Module" has 3 tasks overdue by an average of 4 days. General Ledger API and Accounts Payable UI are blocking downstream work.',
    reportedDate: "2026-03-05T08:00:00Z",
    assignedTo: "Contributor A-7X",
  },
  {
    id: "exc-005",
    type: "escalation",
    severity: "critical",
    status: "investigating",
    projectId: mockProjects[3]?.id ?? "proj-004",
    projectName: mockProjects[3]?.title ?? "CRM Integration Module",
    taskName: "Contact Sync Pipeline",
    description:
      "Team capacity alert: 2 of 4 contributors are at part-time availability this week. APG recommends temporary team augmentation.",
    reportedDate: "2026-03-04T14:00:00Z",
    assignedTo: "Contributor E-5L",
  },
  {
    id: "exc-006",
    type: "sla_breach",
    severity: "warning",
    status: "resolved",
    projectId: mockProjects[0]?.id ?? "proj-001",
    projectName:
      mockProjects[0]?.title ?? "Enterprise Resource Planning Platform",
    taskName: "Auth Service Deployment",
    description:
      "Payment release SLA breached: Approved deliverable payment not released within the 72-hour window. Finance action completed.",
    reportedDate: "2026-03-03T12:00:00Z",
    assignedTo: "Contributor C-9R",
  },
  {
    id: "exc-007",
    type: "quality_issue",
    severity: "warning",
    status: "resolved",
    projectId: mockProjects[3]?.id ?? "proj-004",
    projectName: mockProjects[3]?.title ?? "CRM Integration Module",
    taskName: "Lead Scoring Algorithm",
    description:
      "Quality gate warning: Evidence pack did not include required test coverage report. Contributor notified; resubmission received.",
    reportedDate: "2026-03-02T09:00:00Z",
    assignedTo: "Contributor B-3K",
  },
  {
    id: "exc-008",
    type: "overdue",
    severity: "high",
    status: "open",
    projectId: mockProjects[3]?.id ?? "proj-004",
    projectName: mockProjects[3]?.title ?? "CRM Integration Module",
    taskName: "Email Template Engine",
    description:
      "Task overdue by 3 days. Contributor reported blocked on API dependency from upstream CRM Data Sync Engine task.",
    reportedDate: "2026-03-05T16:00:00Z",
    assignedTo: "Contributor D-2M",
  },
];

/* -- Date formatter -- */
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ================================================================
   EXCEPTION MANAGEMENT PAGE
   ================================================================ */
type SortKey = "type" | "project" | "task" | "severity" | "status" | "assignedTo" | "reportedDate";

const severityOrder: Record<Severity, number> = { critical: 0, high: 1, warning: 2 };
const statusOrder: Record<ExceptionStatus, number> = { open: 0, investigating: 1, resolved: 2 };

export default function ExceptionsPage() {
  const [activeFilter, setActiveFilter] = React.useState("all");
  const [viewMode, setViewMode] = React.useState<"card" | "table">("table");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<SortKey>("reportedDate");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");
  const [exceptionStatuses, setExceptionStatuses] = React.useState<
    Record<string, ExceptionStatus>
  >({});

  /* Helper: effective status respecting overrides */
  const getStatus = (exc: ExceptionItem): ExceptionStatus =>
    exceptionStatuses[exc.id] || exc.status;

  /* Action handlers */
  const handleInvestigate = (exc: ExceptionItem) => {
    setExceptionStatuses((prev) => ({ ...prev, [exc.id]: "investigating" }));
    toast.info("Investigation started", `Now investigating: ${exc.taskName}`);
  };

  const handleResolve = (exc: ExceptionItem) => {
    setExceptionStatuses((prev) => ({ ...prev, [exc.id]: "resolved" }));
    toast.success("Exception resolved", `${exc.taskName} marked as resolved`);
  };

  const handleEscalate = (exc: ExceptionItem) => {
    toast.info("Escalated", `${exc.taskName} escalated for governance review`);
  };

  /* Search-filtered base (before type filter) for accurate tab counts */
  const searchFiltered = React.useMemo(() => {
    if (!searchQuery.trim()) return mockExceptions;
    const q = searchQuery.toLowerCase();
    return mockExceptions.filter(
      (e) =>
        e.projectName.toLowerCase().includes(q) ||
        e.taskName.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.assignedTo.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  /* Filter by type (search already applied in searchFiltered) */
  const filtered = React.useMemo(() => {
    return activeFilter === "all"
      ? searchFiltered
      : searchFiltered.filter((e) => e.type === activeFilter);
  }, [activeFilter, searchFiltered]);

  /* Sort */
  const sorted = React.useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      switch (sortKey) {
        case "type": return dir * a.type.localeCompare(b.type);
        case "project": return dir * a.projectName.localeCompare(b.projectName);
        case "task": return dir * a.taskName.localeCompare(b.taskName);
        case "severity": return dir * (severityOrder[a.severity] - severityOrder[b.severity]);
        case "status": return dir * (statusOrder[getStatus(a)] - statusOrder[getStatus(b)]);
        case "assignedTo": return dir * a.assignedTo.localeCompare(b.assignedTo);
        case "reportedDate": return dir * (new Date(a.reportedDate).getTime() - new Date(b.reportedDate).getTime());
        default: return 0;
      }
    });
    return arr;
  }, [filtered, sortKey, sortDir, exceptionStatuses]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  /* Tab counts reflect search */
  const tabCounts: Record<string, number> = {
    all: searchFiltered.length,
    escalation: searchFiltered.filter((e) => e.type === "escalation").length,
    sla_breach: searchFiltered.filter((e) => e.type === "sla_breach").length,
    quality_issue: searchFiltered.filter((e) => e.type === "quality_issue").length,
    overdue: searchFiltered.filter((e) => e.type === "overdue").length,
  };

  /* KPIs */
  const totalExceptions = mockExceptions.length;
  const openCount = mockExceptions.filter(
    (e) => getStatus(e) === "open"
  ).length;
  const criticalCount = mockExceptions.filter(
    (e) => e.severity === "critical"
  ).length;
  const resolvedCount = mockExceptions.filter(
    (e) => getStatus(e) === "resolved"
  ).length;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-6"
    >
      {/* Breadcrumb */}
      <motion.div variants={fadeUp}>
        <Link
          href="/enterprise/projects"
          className="inline-flex items-center gap-1.5 text-[12px] text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Projects
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
      >
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400 to-brown-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-brown-200/40">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em]">
              Exception Management
            </h1>
            <p className="text-[13px] text-beige-500 mt-1">
              Track escalations, SLA breaches, quality issues, and overdue tasks
              across all active projects.
            </p>
          </div>
        </div>
      </motion.div>

      {/* KPI Summary Row */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          {
            label: "Total Exceptions",
            value: totalExceptions,
            icon: ShieldAlert,
            color: "from-brown-400 to-brown-600",
          },
          {
            label: "Open",
            value: openCount,
            icon: AlertTriangle,
            color: "from-gold-400 to-gold-600",
          },
          {
            label: "Critical",
            value: criticalCount,
            icon: Flame,
            color: "from-brown-500 to-brown-700",
          },
          {
            label: "Avg Resolution",
            value: "4.2h",
            icon: Clock,
            color: "from-teal-400 to-teal-600",
          },
        ].map((stat) => (
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
              <p className="text-[10px] text-beige-500 mt-0.5 font-medium">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Search + Filter */}
      <motion.div variants={fadeUp} className="space-y-0">
        {/* Search bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-beige-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search exceptions by project, task, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 rounded-xl bg-white/60 border border-beige-200/60 pl-10 pr-4 text-[13px] text-brown-800 placeholder:text-beige-400 transition-all focus:outline-none focus:ring-2 focus:ring-brown-200/40 focus:border-brown-200/60 focus:bg-white/80"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-0 border-b border-beige-200/60">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={cn(
              "px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 flex items-center gap-1.5",
              activeFilter === tab.key
                ? "text-brown-800 border-brown-500"
                : "text-beige-500 border-transparent hover:text-brown-600"
            )}
          >
            {tab.label}
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                activeFilter === tab.key
                  ? "bg-brown-100 text-brown-700"
                  : "bg-beige-100 text-beige-500"
              )}
            >
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
        </div>
      </motion.div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-12 flex flex-col items-center text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-forest-50 flex items-center justify-center mb-4">
            <Zap className="w-7 h-7 text-forest-400" />
          </div>
          <h3 className="text-[15px] font-bold text-brown-800">
            {searchQuery.trim() ? "No exceptions found" : "No active exceptions"}
          </h3>
          <p className="text-[13px] text-beige-500 mt-1 max-w-sm">
            {searchQuery.trim()
              ? `No exceptions match "${searchQuery}". Try adjusting your search or filters.`
              : "All projects on track. No escalations, breaches, or overdue tasks."}
          </p>
        </motion.div>
      )}

      {/* Exceptions Table */}
      {filtered.length > 0 && (
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-x-auto"
      >
        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow>
              {([
                ["type", "Type", ""],
                ["project", "Project", ""],
                ["task", "Task", ""],
                ["severity", "Severity", ""],
                ["status", "Status", ""],
                ["assignedTo", "Assigned To", "hidden xl:table-cell"],
                ["reportedDate", "Reported", "hidden xl:table-cell"],
              ] as [SortKey, string, string][]).map(([key, label, responsive]) => (
                <TableHead key={key} className={responsive}>
                  <button
                    onClick={() => toggleSort(key)}
                    className="flex items-center gap-1 hover:text-brown-700 transition-colors group"
                  >
                    {label}
                    <ArrowUpDown
                      className={cn(
                        "w-3 h-3 transition-colors",
                        sortKey === key ? "text-brown-600" : "text-beige-300 group-hover:text-beige-500"
                      )}
                    />
                  </button>
                </TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((exception) => {
              const tc = typeConfig[exception.type];
              const sc = severityConfig[exception.severity];
              const effectiveStatus = getStatus(exception);
              const st = statusConfig[effectiveStatus];
              const TypeIcon = tc.icon;

              return (
                <TableRow
                  key={exception.id}
                  className={cn(
                    "border-l-[3px]",
                    sc.border
                  )}
                >
                  {/* Type */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                          exception.severity === "critical"
                            ? "bg-brown-100 text-brown-700"
                            : "bg-gold-100 text-gold-700"
                        )}
                      >
                        <TypeIcon className="w-3.5 h-3.5" />
                      </div>
                      <Badge variant={tc.badge} size="sm">
                        {tc.label}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Project */}
                  <TableCell>
                    <Link
                      href={`/enterprise/projects/${exception.projectId}`}
                      className="group"
                    >
                      <p className="text-[12px] font-semibold text-brown-900 group-hover:text-teal-700 transition-colors max-w-[160px] truncate">
                        {exception.projectName}
                      </p>
                    </Link>
                  </TableCell>

                  {/* Task */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-beige-400 shrink-0" />
                      <span className="text-[12px] text-brown-700 max-w-[140px] truncate">
                        {exception.taskName}
                      </span>
                    </div>
                  </TableCell>

                  {/* Severity */}
                  <TableCell>
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                        sc.color
                      )}
                    >
                      {sc.label}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge variant={st.variant} size="sm" dot>
                      {st.label}
                    </Badge>
                  </TableCell>

                  {/* Assigned To */}
                  <TableCell className="hidden xl:table-cell">
                    <span className="text-[11px] text-beige-600 flex items-center gap-1">
                      <User className="w-3 h-3 text-beige-400" />
                      {exception.assignedTo}
                    </span>
                  </TableCell>

                  {/* Reported */}
                  <TableCell className="hidden xl:table-cell">
                    <span className="text-[11px] text-beige-500">
                      {fmtDate(exception.reportedDate)}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {effectiveStatus !== "resolved" && (
                        <>
                          {effectiveStatus === "open" && (
                            <button
                              onClick={() => handleInvestigate(exception)}
                              title="Investigate"
                              className="p-1.5 rounded-lg bg-brown-600 hover:bg-brown-700 text-white shadow-sm hover:shadow-md transition-all"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {effectiveStatus === "investigating" && (
                            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600" title="Investigating">
                              <Eye className="w-3.5 h-3.5" />
                            </span>
                          )}
                          <button
                            onClick={() => handleResolve(exception)}
                            title="Resolve"
                            className="p-1.5 rounded-lg border border-beige-200 bg-white text-brown-700 hover:bg-beige-50 transition-all"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                          </button>
                          {exception.severity === "critical" && (
                            <button
                              onClick={() => handleEscalate(exception)}
                              title="Escalate"
                              className="p-1.5 rounded-lg border border-gold-200 bg-gold-50 text-gold-700 hover:bg-gold-100 transition-all"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      )}
                      {effectiveStatus === "resolved" && (
                        <span className="flex items-center gap-1 text-[10px] text-forest-600 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Resolved
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

      </motion.div>
      )}

      {/* Detail cards below the table for expanded descriptions */}
      <motion.div variants={stagger} className="space-y-3">
        {filtered
          .filter((e) => getStatus(e) !== "resolved")
          .slice(0, 3)
          .map((exception) => {
            const tc = typeConfig[exception.type];
            const sc = severityConfig[exception.severity];
            const st = statusConfig[getStatus(exception)];
            const TypeIcon = tc.icon;

            return (
              <motion.div
                key={`detail-${exception.id}`}
                variants={scaleIn}
                className={cn(
                  "rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 border-l-[4px]",
                  sc.border
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                      exception.severity === "critical"
                        ? "bg-brown-100 text-brown-700"
                        : "bg-gold-100 text-gold-700"
                    )}
                  >
                    <TypeIcon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant={tc.badge} size="sm" dot>
                        {tc.label}
                      </Badge>
                      <span
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                          sc.color
                        )}
                      >
                        {sc.label}
                      </span>
                      <Badge variant={st.variant} size="sm">
                        {st.label}
                      </Badge>
                    </div>
                    <Link
                      href={`/enterprise/projects/${exception.projectId}`}
                      className="inline-block"
                    >
                      <span className="text-[13px] font-bold text-brown-900 hover:text-teal-700 transition-colors underline decoration-beige-300 underline-offset-2">
                        {exception.projectName}
                      </span>
                    </Link>
                    <span className="text-[11px] text-beige-400 ml-2">
                      / {exception.taskName}
                    </span>
                    <p className="text-[12px] text-beige-600 mt-1.5 leading-relaxed">
                      {exception.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2.5 flex-wrap">
                      <span className="text-[10px] text-beige-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {fmtDate(exception.reportedDate)}
                      </span>
                      <span className="text-[10px] text-beige-500 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {exception.assignedTo}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </motion.div>
    </motion.div>
  );
}
