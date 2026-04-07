"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Network, Clock, Layers, ArrowRight, Boxes, Sparkles, Download,
  Milestone as MilestoneIcon, BrainCircuit, CheckCircle2, Search, X,
  ChevronRight, ChevronLeft, ArrowUp, ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, scaleIn } from "@/lib/utils/motion-variants";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui";
import { mockPlans, mockTasks } from "@/mocks/data/enterprise-projects";
import type { DecompositionPlan, PlanStatus } from "@/types/enterprise";

/* ═══ Badge ═══ */

const badgeStyles: Record<string, { bg: string; text: string; dot: string }> = {
  forest: { bg: "bg-forest-50", text: "text-forest-700", dot: "bg-forest-500" },
  teal: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" },
  gold: { bg: "bg-gold-50", text: "text-gold-700", dot: "bg-gold-500" },
  brown: { bg: "bg-brown-50", text: "text-brown-700", dot: "bg-brown-500" },
  beige: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
};

function Badge({ variant, children }: { variant: string; children: React.ReactNode }) {
  const s = badgeStyles[variant] || badgeStyles.beige;
  return <span className={cn("inline-flex items-center gap-1 text-[9px] font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full", s.bg, s.text)}>{children}</span>;
}

const statusMap: Record<PlanStatus, { variant: string; label: string }> = {
  draft: { variant: "beige", label: "Draft" }, pending_review: { variant: "gold", label: "Review" },
  approved: { variant: "teal", label: "Approved" }, in_progress: { variant: "forest", label: "In Progress" },
  completed: { variant: "brown", label: "Completed" },
};

const complexityMap: Record<string, { variant: string; label: string }> = {
  low: { variant: "forest", label: "Low" }, medium: { variant: "teal", label: "Medium" },
  high: { variant: "gold", label: "High" }, critical: { variant: "brown", label: "Critical" },
};

function formatCost(n: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 0 }).format(n); }

/* ═══ Sort ═══ */

type SortField = "title" | "status" | "tasks" | "confidence" | "cost" | "updated";
type SortDir = "asc" | "desc";

const columns = [
  { field: "title" as SortField, label: "Plan", align: "left" },
  { field: "status" as SortField, label: "Status", align: "left" },
  { field: "tasks" as SortField, label: "Tasks", align: "center" },
  { field: "confidence" as SortField, label: "AI Confidence", align: "left" },
  { field: "cost" as SortField, label: "Cost", align: "right" },
  { field: "updated" as SortField, label: "Updated", align: "left" },
];

/* ═══ PAGE ═══ */

export default function DecompositionPlansPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [sortField, setSortField] = React.useState<SortField>("updated");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");

  function handleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  }

  const filtered = React.useMemo(() => {
    let list = [...mockPlans];
    if (statusFilter !== "all") list = list.filter((p) => p.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.sowId.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "title": cmp = a.title.localeCompare(b.title); break;
        case "status": cmp = a.status.localeCompare(b.status); break;
        case "tasks": cmp = a.totalTasks - b.totalTasks; break;
        case "confidence": cmp = a.aiConfidence - b.aiConfidence; break;
        case "cost": cmp = a.estimatedCost - b.estimatedCost; break;
        case "updated": cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [statusFilter, search, sortField, sortDir]);

  const totalPlans = mockPlans.length;
  const totalMilestones = mockPlans.reduce((s, p) => s + p.totalMilestones, 0);
  const totalTasks = mockPlans.reduce((s, p) => s + p.totalTasks, 0);
  const avgConfidence = Math.round(mockPlans.reduce((s, p) => s + p.aiConfidence, 0) / totalPlans);
  const totalBudget = mockPlans.reduce((s, p) => s + p.estimatedCost, 0);

  const statusOptions = [
    { value: "all", label: "All Status" }, { value: "draft", label: "Draft" },
    { value: "pending_review", label: "Pending Review" }, { value: "approved", label: "Approved" },
    { value: "in_progress", label: "In Progress" }, { value: "completed", label: "Completed" },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">

      {/* ═══ HEADER ═══ */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7">
        <div>
          <h1 className="font-heading text-[28px] font-semibold text-gray-900 tracking-tight">Decomposition Plans</h1>
          <p className="text-[13px] text-gray-500 mt-1.5">AI-powered task decomposition from your SOW documents.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-gray-500 text-[12px] font-medium hover:border-gray-300 transition-all">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <Link href="/enterprise/sow/upload"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-[12px] font-semibold bg-gradient-to-r from-brown-400 to-brown-600 hover:from-brown-500 hover:to-brown-700 transition-all">
            <Sparkles className="w-3.5 h-3.5" /> Upload SOW
          </Link>
        </div>
      </motion.div>

      {/* ═══ KPI ROW ═══ */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-7">
        {[
          { label: "Total Plans", value: totalPlans, icon: Boxes, iconBg: "bg-gradient-to-br from-brown-400 to-brown-600" },
          { label: "Milestones", value: totalMilestones, icon: MilestoneIcon, iconBg: "bg-gradient-to-br from-forest-400 to-forest-600" },
          { label: "Total Tasks", value: totalTasks, icon: Layers, iconBg: "bg-gradient-to-br from-teal-400 to-teal-600" },
          { label: "Avg AI Confidence", value: `${avgConfidence}%`, icon: BrainCircuit, iconBg: "bg-gradient-to-br from-gold-400 to-gold-600" },
          { label: "Total Budget", value: formatCost(totalBudget), icon: Clock, iconBg: "bg-gradient-to-br from-brown-400 to-brown-600" },
        ].map((kpi) => {
          const KpiIcon = kpi.icon;
          return (
            <motion.div key={kpi.label} variants={scaleIn} className="card-parchment flex items-center gap-5 px-5 py-5">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", kpi.iconBg)}>
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
      <motion.div variants={fadeUp} className="card-parchment">

        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
          <span className="text-sm font-semibold text-gray-800">All Decomposition Plans</span>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center justify-between gap-3 px-6 py-3" style={{ borderBottom: "1px solid var(--border-hair)" }}>
          <div className={cn("flex items-center gap-2 rounded-lg transition-all duration-200 shrink-0", searchFocused ? "w-64" : "w-[220px]")}
            style={{
              background: searchFocused ? "white" : "var(--color-gray-50)",
              border: searchFocused ? "1px solid var(--color-brown-300)" : "1px solid var(--border-soft)",
              padding: "7px 12px",
              boxShadow: searchFocused ? "0 0 0 3px color-mix(in srgb, var(--color-brown-500) 8%, transparent)" : undefined,
            }}>
            <Search className="w-3.5 h-3.5 shrink-0 text-gray-400" />
            <input type="text" placeholder="Search plans…" value={search} onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
              className="border-none outline-none bg-transparent w-full text-[12.5px] text-gray-700 placeholder:text-gray-400" />
            {search && <button onClick={() => setSearch("")} className="shrink-0 p-0.5 rounded text-gray-400 hover:text-gray-600"><X className="w-3 h-3" /></button>}
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 rounded-lg bg-white border border-gray-200 px-3 text-[12px] text-gray-600 hover:border-gray-300 focus:ring-2 focus:ring-brown-100 focus:border-brown-300 transition-all" style={{ minWidth: 130 }}>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
            {statusFilter !== "all" && (
              <button onClick={() => setStatusFilter("all")} className="flex items-center gap-1.5 text-[11px] font-medium text-brown-500 px-2.5 py-1 rounded-lg hover:bg-brown-50 transition-all">
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
                        padding: "11px 16px", textAlign: col.align as "left" | "center" | "right",
                        fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
                        color: active ? "var(--ink-mid)" : "var(--color-gray-400)",
                        background: "color-mix(in srgb, var(--color-gray-100) 40%, white)",
                      }}>
                      <div className="flex items-center gap-1" style={{ justifyContent: col.align === "center" ? "center" : col.align === "right" ? "flex-end" : "flex-start" }}>
                        <span>{col.label}</span>
                        <span style={{ opacity: active ? 1 : 0 }}>
                          {active && sortDir === "asc" ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filtered.map((plan) => {
                const st = statusMap[plan.status];
                const cx = complexityMap[plan.complexity];
                const planTasks = mockTasks.filter((t) => t.planId === plan.id);
                const completedTasks = planTasks.filter((t) => t.status === "accepted").length;
                const taskTotal = planTasks.length > 0 ? planTasks.length : plan.totalTasks;
                const updatedDate = new Date(plan.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

                return (
                  <tr key={plan.id} onClick={() => router.push(`/enterprise/decomposition/${plan.id}`)}
                    className="group cursor-pointer transition-colors hover:bg-black/[0.02]"
                    style={{ borderBottom: "1px solid var(--border-hair)" }}>
                    {/* Plan */}
                    <td style={{ padding: "13px 16px" }}>
                      <div className="text-[13px] font-medium text-gray-800 truncate max-w-[280px]">{plan.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[10px] text-gray-400">{plan.sowId.toUpperCase()}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="text-[10px] text-gray-400">{plan.totalMilestones} milestones</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="text-[10px] text-gray-400">{plan.estimatedHours.toLocaleString()}h</span>
                      </div>
                    </td>
                    {/* Status */}
                    <td style={{ padding: "13px 16px" }}>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={st.variant}>{st.label}</Badge>
                        {cx && <Badge variant={cx.variant}>{cx.label}</Badge>}
                      </div>
                    </td>
                    {/* Tasks */}
                    <td style={{ padding: "13px 16px", textAlign: "center" }}>
                      <span className="text-[12px] font-medium text-gray-700">{planTasks.length > 0 ? `${completedTasks}/${taskTotal}` : plan.totalTasks}</span>
                    </td>
                    {/* AI Confidence */}
                    <td style={{ padding: "13px 16px" }}>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div className={cn("h-full rounded-full",
                            plan.aiConfidence >= 85 ? "bg-forest-500" : plan.aiConfidence >= 70 ? "bg-gold-500" : "bg-brown-500"
                          )} style={{ width: `${plan.aiConfidence}%` }} />
                        </div>
                        <span className="text-[11px] font-mono font-medium text-gray-600 w-8">{plan.aiConfidence}%</span>
                      </div>
                    </td>
                    {/* Cost */}
                    <td style={{ padding: "13px 16px", textAlign: "right" }}>
                      <span className="text-[12px] font-semibold text-gray-800">{formatCost(plan.estimatedCost)}</span>
                    </td>
                    {/* Updated */}
                    <td style={{ padding: "13px 16px" }}>
                      <span className="text-[11.5px] text-gray-500">{updatedDate}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brown-300 to-brown-500 flex items-center justify-center mb-4">
                <Network className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-800 mb-1">No plans match your filters</p>
              <p className="text-xs text-gray-500 max-w-[280px] mb-4">Try different keywords or clear filters.</p>
              <button onClick={() => { setStatusFilter("all"); setSearch(""); }}
                className="flex items-center gap-1.5 rounded-xl text-xs font-medium text-brown-500 px-3.5 py-1.5 border border-brown-200 hover:bg-brown-50 transition-all">
                <X className="w-3 h-3" /> Clear all filters
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
