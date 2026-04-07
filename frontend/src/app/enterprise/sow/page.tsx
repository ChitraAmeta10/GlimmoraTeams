"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText, Search, Plus, DollarSign, Shield, Upload, AlertTriangle,
  ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ClipboardCheck, Eye,
  CheckCircle2, X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, scaleIn } from "@/lib/utils/motion-variants";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui";
import { mockSOWs, mockSOWSections } from "@/mocks/data/enterprise-sow";

/* ══════════════════════════════════════════ Status config ══════════════════════════════════════════ */

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  draft:                      { label: "Draft",                      color: "var(--color-gray-600)",   bg: "var(--color-gray-100)",   icon: FileText },
  in_review:                  { label: "In Review",                  color: "var(--color-teal-700)",   bg: "var(--color-teal-50)",    icon: Eye },
  pending_commercial_review:  { label: "Pending Commercial Review",  color: "var(--color-gold-700)",   bg: "var(--color-gold-50)",    icon: ClipboardCheck },
  approved:                   { label: "Approved",                   color: "var(--color-forest-700)", bg: "var(--color-forest-50)",  icon: CheckCircle2 },
  rejected:                   { label: "Rejected",                   color: "var(--danger)",           bg: "var(--danger-light)",     icon: AlertTriangle },
  archived:                   { label: "Archived",                   color: "var(--color-gray-600)",   bg: "var(--color-gray-100)",   icon: FileText },
};

const sensitivityConfig: Record<string, { label: string; color: string; bg: string }> = {
  public:       { label: "Public",       color: "var(--color-teal-700)",   bg: "var(--color-teal-50)" },
  internal:     { label: "Internal",     color: "var(--color-gray-600)",   bg: "var(--color-gray-100)" },
  confidential: { label: "Confidential", color: "var(--color-gold-700)",   bg: "var(--color-gold-50)" },
  restricted:   { label: "Restricted",   color: "var(--danger)",           bg: "var(--danger-light)" },
};

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
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

type SortField = "title" | "client" | "intake" | "status" | "sensitivity" | "risk" | "version" | "modified";
type SortDir = "asc" | "desc";

const statusChips = [
  { value: "all", label: "All", statuses: [] as string[] },
  { value: "draft", label: "Draft", statuses: ["draft"] },
  { value: "in_review", label: "In Review", statuses: ["in_review"] },
  { value: "pending_commercial_review", label: "Pending Commercial Review", statuses: ["pending_commercial_review"] },
  { value: "approved", label: "Approved", statuses: ["approved"] },
  { value: "rejected", label: "Rejected", statuses: ["rejected"] },
  { value: "archived", label: "Archived", statuses: ["archived"] },
];

/* ══════════════════════════════════════════ Pill helper ══════════════════════════════════════════ */

function Pill({ bg, color, children, className }: { bg: string; color: string; children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full ${className || ""}`}
      style={{ background: bg, color }}>
      {children}
    </span>
  );
}

/* ══════════════════════════════════════════ SOW REPOSITORY PAGE ══════════════════════════════════════════ */

export default function SOWListPage() {
  const router = useRouter();

  const [statusFilter, setStatusFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState("all");
  const [clientFilter, setClientFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [searchFocused, setSearchFocused] = React.useState(false);

  const uniqueClients = React.useMemo(() => [...new Set(mockSOWs.map((s) => s.client))].sort(), []);

  const [sortField, setSortField] = React.useState<SortField>("modified");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);

  function handleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  }

  const filtered = React.useMemo(() => {
    let list = [...mockSOWs];
    if (statusFilter !== "all") {
      const chip = statusChips.find((c) => c.value === statusFilter);
      if (chip) list = list.filter((s) => chip.statuses.includes(s.status));
    }
    if (clientFilter !== "all") list = list.filter((s) => s.client === clientFilter);
    if (dateFilter !== "all") {
      const now = new Date("2026-03-09T00:00:00Z");
      const cutoff = new Date(now);
      switch (dateFilter) {
        case "7d": cutoff.setDate(now.getDate() - 7); break;
        case "30d": cutoff.setDate(now.getDate() - 30); break;
        case "90d": cutoff.setDate(now.getDate() - 90); break;
      }
      list = list.filter((s) => new Date(s.updatedAt) >= cutoff);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) =>
        s.title.toLowerCase().includes(q) || s.client.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) ||
        s.stakeholders.some((st) => st.toLowerCase().includes(q)) ||
        mockSOWSections.filter((sec) => sec.sowId === s.id).some((sec) => sec.content.toLowerCase().includes(q))
      );
    }
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "title": cmp = a.title.localeCompare(b.title); break;
        case "client": cmp = a.client.localeCompare(b.client); break;
        case "intake": cmp = a.intakeMode.localeCompare(b.intakeMode); break;
        case "status": cmp = a.status.localeCompare(b.status); break;
        case "sensitivity": cmp = (a.dataSensitivity || "").localeCompare(b.dataSensitivity || ""); break;
        case "risk": cmp = a.riskScore.overall - b.riskScore.overall; break;
        case "version": cmp = a.version - b.version; break;
        case "modified": cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [statusFilter, clientFilter, dateFilter, search, sortField, sortDir]);

  React.useEffect(() => { setCurrentPage(1); }, [statusFilter, clientFilter, dateFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const activeFilterCount = [statusFilter, dateFilter, clientFilter].filter((v) => v !== "all").length;

  function clearAllFilters() { setStatusFilter("all"); setDateFilter("all"); setClientFilter("all"); setSearch(""); }

  const totalSOWs = mockSOWs.length;
  const pendingCount = mockSOWs.filter((s) => ["in_review", "pending_commercial_review"].includes(s.status)).length;
  const approvedCount = mockSOWs.filter((s) => s.status === "approved").length;
  const scoredSOWs = mockSOWs.filter((s) => s.riskScore.overall > 0);
  const avgRisk = scoredSOWs.length > 0 ? Math.round(scoredSOWs.reduce((sum, s) => sum + s.riskScore.overall, 0) / scoredSOWs.length) : 0;
  const totalBudget = mockSOWs.reduce((sum, s) => sum + s.estimatedBudget, 0);

  const columns = [
    { field: "title" as SortField, label: "Title", align: "left" },
    { field: "client" as SortField, label: "Client", align: "left" },
    { field: "intake" as SortField, label: "Intake", align: "left" },
    { field: "status" as SortField, label: "Status", align: "left" },
    { field: "sensitivity" as SortField, label: "Sensitivity", align: "left" },
    { field: "risk" as SortField, label: "Risk", align: "center" },
    { field: "version" as SortField, label: "Ver.", align: "center" },
    { field: "modified" as SortField, label: "Modified", align: "left" },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">

      {/* ═══ HERO ═══ */}
      <motion.div variants={fadeUp} className="mb-7">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="font-heading leading-tight text-gray-900" style={{ fontSize: "1.75rem", fontWeight: 600, letterSpacing: "-0.02em" }}>
              SOW Repository
            </h1>
            <p className="mt-1.5 text-[13px] text-gray-500">
              Manage all Statements of Work — upload, track, and approve across projects.
            </p>
          </div>
          <Link href="/enterprise/sow/intake">
            <button className="flex items-center gap-1.5 rounded-xl text-white text-xs font-medium px-4 py-2.5 shrink-0 transition-all hover:-translate-y-0.5 bg-gradient-to-r from-brown-400 to-brown-600 hover:from-brown-500 hover:to-brown-700"
              style={{ boxShadow: "0 2px 8px color-mix(in srgb, var(--color-brown-500) 30%, transparent)" }}>
              <Plus className="w-3 h-3" /> New SOW
            </button>
          </Link>
        </div>
      </motion.div>

      {/* ═══ KPI ROW ═══ */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-7">
        {[
          { label: "Total SOWs", value: totalSOWs, icon: FileText, iconBg: "bg-gradient-to-br from-brown-400 to-brown-600" },
          { label: "Pending Action", value: pendingCount, icon: AlertTriangle, iconBg: "bg-gradient-to-br from-gold-400 to-gold-600" },
          { label: "Approved", value: approvedCount, icon: Shield, iconBg: "bg-gradient-to-br from-forest-400 to-forest-600" },
          { label: "Avg Risk", value: avgRisk, icon: AlertTriangle, iconBg: "bg-gradient-to-br from-brown-500 to-brown-700" },
          { label: "Total Budget", value: `$${(totalBudget / 1000).toFixed(0)}K`, icon: DollarSign, iconBg: "bg-gradient-to-br from-gold-400 to-gold-600" },
        ].map((kpi) => {
          const KpiIcon = kpi.icon;
          return (
            <motion.div key={kpi.label} variants={scaleIn} className="card-parchment flex items-center gap-5 px-5 py-5">
              <div className={`w-12 h-12 rounded-2xl ${kpi.iconBg} flex items-center justify-center shrink-0`}>
                <KpiIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-gray-400">{kpi.label}</div>
                <div className="num-display text-[28px] text-gray-900 leading-none mt-1">{kpi.value}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ═══ TABLE CARD ═══ */}
      {mockSOWs.length === 0 ? (
        <motion.div variants={fadeUp} className="card-parchment">
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brown-400 to-brown-600 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-[15px] font-semibold text-gray-800 mb-1.5">Create your first SOW</h2>
            <p className="text-xs text-gray-500 max-w-[320px] mb-5">Upload or generate a Statement of Work to kick off your first project.</p>
            <Link href="/enterprise/sow/intake">
              <button className="flex items-center gap-1.5 rounded-xl text-white text-xs font-medium px-4 py-2.5 bg-gradient-to-r from-brown-400 to-brown-600 hover:from-brown-500 hover:to-brown-700 transition-all"
                style={{ boxShadow: "0 2px 8px color-mix(in srgb, var(--color-brown-500) 30%, transparent)" }}>
                <Plus className="w-3 h-3" /> New SOW
              </button>
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="card-parchment mb-5">

          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <span className="text-sm font-semibold text-gray-800">All Statements of Work</span>
          </div>

          {/* Search + Filters */}
          <div className="flex items-center justify-between gap-3 px-6 py-3" style={{ borderBottom: "1px solid var(--border-hair)" }}>
            {/* Search */}
            <div className={cn("flex items-center gap-2 rounded-lg transition-all duration-200 shrink-0", searchFocused ? "w-64" : "w-[220px]")}
              style={{
                background: searchFocused ? "white" : "var(--color-gray-50)",
                border: searchFocused ? "1px solid var(--color-brown-300)" : "1px solid var(--border-soft)",
                padding: "7px 12px",
                boxShadow: searchFocused ? "0 0 0 3px color-mix(in srgb, var(--color-brown-500) 8%, transparent)" : undefined,
              }}
            >
              <Search className="w-3.5 h-3.5 shrink-0 text-gray-400" />
              <input type="text" placeholder="Search SOWs…" value={search} onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                className="border-none outline-none bg-transparent w-full text-[12.5px] text-gray-700 placeholder:text-gray-400" />
              {search ? (
                <button onClick={() => setSearch("")} className="shrink-0 p-0.5 rounded text-gray-400 hover:text-gray-600"><X className="w-3 h-3" /></button>
              ) : !searchFocused ? (
                <kbd className="font-mono whitespace-nowrap shrink-0 text-[9px] text-gray-400 bg-gray-100 border border-gray-200 px-1.5 py-px rounded">⌘F</kbd>
              ) : null}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 rounded-lg bg-white border border-gray-200 px-3 text-[12px] text-gray-600 hover:border-gray-300 focus:ring-2 focus:ring-brown-100 focus:border-brown-300 transition-all" style={{ minWidth: 110 }}><SelectValue placeholder="All Status" /></SelectTrigger>
                <SelectContent>{statusChips.map((chip) => <SelectItem key={chip.value} value={chip.value}>{chip.label}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="h-8 rounded-lg bg-white border border-gray-200 px-3 text-[12px] text-gray-600 hover:border-gray-300 focus:ring-2 focus:ring-brown-100 focus:border-brown-300 transition-all" style={{ minWidth: 120 }}><SelectValue placeholder="All Clients" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {uniqueClients.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="h-8 rounded-lg bg-white border border-gray-200 px-3 text-[12px] text-gray-600 hover:border-gray-300 focus:ring-2 focus:ring-brown-100 focus:border-brown-300 transition-all" style={{ minWidth: 100 }}><SelectValue placeholder="All Time" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
              {activeFilterCount > 0 && (
                <button onClick={clearAllFilters} className="flex items-center gap-1.5 text-[11px] font-medium text-brown-500 px-2.5 py-1 rounded-lg hover:bg-brown-50 transition-all">
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-hair)" }}>
                  {columns.map((col) => {
                    const active = sortField === col.field;
                    return (
                      <th key={col.field} onClick={() => handleSort(col.field)}
                        className="cursor-pointer select-none transition-colors"
                        style={{
                          padding: "11px 16px", textAlign: col.align as "left" | "center",
                          fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
                          color: active ? "var(--ink-mid)" : "var(--color-gray-400)",
                          background: "color-mix(in srgb, var(--color-gray-100) 40%, white)",
                        }}>
                        <div className="flex items-center gap-1" style={{ justifyContent: col.align === "center" ? "center" : "flex-start" }}>
                          <span>{col.label}</span>
                          <span style={{ opacity: active ? 1 : 0, transition: "opacity 0.15s" }}>
                            {active && sortDir === "asc" ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {paginated.map((sow) => {
                  const sc = statusConfig[sow.status] || statusConfig.draft;
                  const sens = sensitivityConfig[sow.dataSensitivity] || sensitivityConfig.internal;
                  return (
                    <tr key={sow.id} onClick={() => router.push(`/enterprise/sow/${sow.id}`)}
                      className="group cursor-pointer transition-colors hover:bg-black/[0.02]"
                      style={{ borderBottom: "1px solid var(--border-hair)" }}>
                      <td style={{ padding: "13px 16px" }}>
                        <div className="flex items-center gap-3">
                          <sc.icon className={`w-4 h-4 shrink-0`} style={{ color: sc.color }} />
                          <div>
                            <div className="text-[13px] font-medium text-gray-800 truncate max-w-[240px]">{sow.title}</div>
                            <div className="font-mono text-[10px] text-gray-400 mt-0.5">{sow.id.toUpperCase()} · {sow.pages} pg</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-[12.5px] text-gray-600" style={{ padding: "13px 16px" }}>{sow.client}</td>
                      <td style={{ padding: "13px 16px" }}>
                        <Pill bg={sow.intakeMode === "ai_generated" ? "var(--color-teal-50)" : "var(--color-gray-100)"} color={sow.intakeMode === "ai_generated" ? "var(--color-teal-700)" : "var(--color-gray-600)"}>
                          {sow.intakeMode === "ai_generated" ? <><Bot className="w-2.5 h-2.5" /> AI</> : <><Upload className="w-2.5 h-2.5" /> Manual</>}
                        </Pill>
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <Pill bg={sc.bg} color={sc.color}>{sc.label}</Pill>
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <Pill bg={sens.bg} color={sens.color}>{sens.label}</Pill>
                      </td>
                      <td style={{ padding: "13px 16px", textAlign: "center" }}>
                        {sow.riskScore.overall > 0 ? (
                          <span className="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                            style={{ color: riskColor(sow.riskScore.overall), background: riskBg(sow.riskScore.overall) }}>
                            {sow.riskScore.overall}
                          </span>
                        ) : <span className="text-[11px] text-gray-300">—</span>}
                      </td>
                      <td style={{ padding: "13px 16px", textAlign: "center" }}>
                        <span className="font-mono text-[12px] font-medium text-gray-600">v{sow.version}</span>
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <span className="text-[11.5px] text-gray-500">{formatDate(sow.updatedAt)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brown-300 to-brown-500 flex items-center justify-center mb-4">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-1">No SOWs match your filters</p>
                <p className="text-xs text-gray-500 max-w-[280px] mb-4">Try different keywords or clear filters to see all SOWs.</p>
                <button onClick={clearAllFilters}
                  className="flex items-center gap-1.5 rounded-xl text-xs font-medium text-brown-500 px-3.5 py-1.5 border border-brown-200 hover:bg-brown-50 transition-all">
                  <X className="w-3 h-3" /> Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination — only when more than one page */}
          {totalPages > 1 && <div className="flex items-center justify-between px-6 py-3" style={{ borderTop: "1px solid var(--border-hair)" }}>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400">Rows per page</span>
              <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
                <SelectTrigger className="h-7 rounded-lg bg-white border border-gray-200 px-2.5 text-[11px] text-gray-600 hover:border-gray-300 focus:ring-2 focus:ring-brown-100 focus:border-brown-300 transition-all" style={{ minWidth: 52 }}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-gray-400">
                {filtered.length > 0 ? `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)} of ${filtered.length}` : "0 results"}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}
                  className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}
                  className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>}

        </motion.div>
      )}
    </motion.div>
  );
}
