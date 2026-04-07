"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Receipt,
  TrendingUp,
  Target,
  Download,
  FileText,
  Filter,
  DollarSign,
  Activity,
  PiggyBank,
  Users,
  GraduationCap,
  Heart,
  Briefcase,
  UserCog,
  CheckCircle2,
  RotateCcw,
  Gauge,
  Landmark,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import { MetricRing } from "@/components/enterprise/metric-ring";
import { toast } from "@/lib/stores/toast-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from "@/components/ui";

/* ══════════════════════════════════════════
   I2 — Economic Dashboard
   SOW: Section 3.1.6 (economic dashboards), Section 27.3 (economic KPIs)
   Steps: 1-KPIs, 2-Spend Analysis, 3-ROI, 4-Earning Distribution
   ══════════════════════════════════════════ */

/* ── Filter options ── */
const projectOptions = ["All Projects", "ERP Platform", "Mobile Banking", "E-Commerce", "CRM Integration"];
const dateRangeOptions = ["Last 7 days", "Last 30 days", "This Quarter", "This Year"];

/* ── Step 1: KPI Data (SOW 27.3 mandated KPIs) ── */
const primaryKpis = [
  { label: "Total Spend", value: "$650.7k", change: "+$50.7k", positive: false, icon: Wallet, bg: "bg-brown-50", iconColor: "text-brown-500" },
  { label: "Avg Cost per Task", value: "$2,340", change: "-$180", positive: true, icon: Receipt, bg: "bg-teal-50", iconColor: "text-teal-500" },
  { label: "Transaction Volume", value: "1,284", change: "+142", positive: true, icon: Activity, bg: "bg-forest-50", iconColor: "text-forest-500" },
  { label: "Cost Savings", value: "$312k", change: "vs traditional", positive: true, icon: PiggyBank, bg: "bg-gold-50", iconColor: "text-gold-600" },
];

/* ── Secondary metrics (budget context) ── */
const secondaryMetrics = [
  { label: "Total Budget", value: "$1.08M", description: "Allocated across 4 active projects", icon: Landmark, color: "text-brown-600", bg: "bg-brown-50" },
  { label: "Budget Variance", value: "+39.7%", description: "Under budget — $429k remaining", icon: TrendingUp, color: "text-forest-600", bg: "bg-forest-50" },
  { label: "Forecasted Cost", value: "$927k", description: "93% confidence — $153k under budget at completion", icon: Target, color: "text-teal-600", bg: "bg-teal-50" },
];

/* ── Step 2: Spend Analysis Data ── */
const budgetVsActual = [
  { name: "ERP Platform", id: "proj-001", budget: 285000, actual: 98500 },
  { name: "Mobile Banking", id: "proj-002", budget: 180000, actual: 42000 },
  { name: "E-Commerce", id: "proj-003", budget: 520000, actual: 495000 },
  { name: "CRM Integration", id: "proj-004", budget: 95000, actual: 15200 },
];

const costTrendData = [
  { month: "Oct", amount: 45000 },
  { month: "Nov", amount: 82000 },
  { month: "Dec", amount: 165000 },
  { month: "Jan", amount: 210000 },
  { month: "Feb", amount: 98000 },
  { month: "Mar", amount: 50700 },
];

const forecastData = [
  { month: "Apr", amount: 72000 },
  { month: "May", amount: 95000 },
  { month: "Jun", amount: 110000 },
];

const costBySkill = [
  { category: "Backend / API", amount: 245000, pct: 37.7, color: "#A67763" },
  { category: "Frontend / UI", amount: 148000, pct: 22.7, color: "#5B9BA2" },
  { category: "DevOps / Infra", amount: 95000, pct: 14.6, color: "#4D5741" },
  { category: "QA / Testing", amount: 72000, pct: 11.1, color: "#D0B060" },
  { category: "Design / UX", amount: 52700, pct: 8.1, color: "#C9B09D" },
  { category: "Other", amount: 38000, pct: 5.8, color: "#E9DFD7" },
];

/* ── Step 3: ROI Data ── */
const roiMetrics = [
  { label: "Cost per Accepted Deliverable", value: "$1,870", change: "-12.3%", positive: true, description: "Average cost for each accepted work item", color: "forest" as const },
  { label: "Cost per Rework", value: "$680", change: "+$45", positive: false, description: "Average wasted cost per rework cycle", color: "gold" as const },
  { label: "Cost Efficiency", value: "87%", change: "+4.2%", positive: true, description: "Accepted value vs total spend ratio", color: "teal" as const },
  { label: "Platform vs Traditional", value: "32%", change: "savings", positive: true, description: "Estimated savings compared to traditional staffing baseline", color: "brown" as const },
];

/* ── Step 4: Earning Distribution Data ── */
const earningDistribution = [
  { segment: "Women Workforce", amount: 234000, pct: 36.0, count: 18, icon: Heart, color: "#A67763", bg: "bg-brown-50" },
  { segment: "Students", amount: 195000, pct: 30.0, count: 15, icon: GraduationCap, color: "#5B9BA2", bg: "bg-teal-50" },
  { segment: "Freelancers", amount: 156000, pct: 24.0, count: 10, icon: Briefcase, color: "#4D5741", bg: "bg-forest-50" },
  { segment: "Internal", amount: 65700, pct: 10.0, count: 4, icon: UserCog, color: "#D0B060", bg: "bg-gold-50" },
];

/* ══════════════════════════════════════════
   CHART COMPONENTS
   ══════════════════════════════════════════ */

/* ── Budget vs Actual Horizontal Bar Chart ── */
function BudgetVsActualChart() {
  const maxVal = Math.max(...budgetVsActual.map((p) => Math.max(p.budget, p.actual)));

  return (
    <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
      <h3 className="text-[14px] font-semibold text-brown-800 mb-1">
        Budget vs Actual by Project
      </h3>
      <p className="text-[11px] text-beige-500 mb-4">
        Horizontal comparison across active projects
      </p>

      <div className="space-y-4">
        {budgetVsActual.map((proj) => {
          const budgetPct = (proj.budget / maxVal) * 100;
          const actualPct = (proj.actual / maxVal) * 100;
          const utilization = Math.round((proj.actual / proj.budget) * 100);

          return (
            <div key={proj.name}>
              <div className="flex items-center justify-between mb-1.5">
                <Link
                  href={`/enterprise/projects/${proj.id}`}
                  className="text-[11px] font-medium text-teal-600 hover:text-teal-700 hover:underline transition-colors"
                >
                  {proj.name}
                </Link>
                <span className={cn(
                  "text-[10px] font-semibold",
                  utilization > 90 ? "text-gold-600" : "text-beige-500"
                )}>
                  {utilization}% utilized
                </span>
              </div>
              <div className="relative h-5 bg-beige-100/60 rounded-md overflow-hidden mb-1">
                <div
                  className="absolute top-0 left-0 h-full rounded-md bg-beige-200/80"
                  style={{ width: `${budgetPct}%` }}
                />
                <div
                  className="absolute top-0 left-0 h-full rounded-md"
                  style={{
                    width: `${actualPct}%`,
                    backgroundColor: utilization > 90 ? "#D0B060" : "#4D5741",
                    opacity: 0.7,
                  }}
                />
                <div className="absolute inset-0 flex items-center px-2">
                  <span className="text-[8px] font-bold text-white drop-shadow-sm">
                    ${(proj.actual / 1000).toFixed(0)}k / ${(proj.budget / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-beige-100">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-beige-200" />
          <span className="text-[10px] text-beige-500">Budget</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-forest-500 opacity-70" />
          <span className="text-[10px] text-beige-500">Actual</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-gold-500 opacity-70" />
          <span className="text-[10px] text-beige-500">&gt;90% Utilized</span>
        </div>
      </div>
    </div>
  );
}

/* ── Cost Trend Line Chart (SVG) ── */
function CostTrendChart() {
  const allData = [...costTrendData, ...forecastData];
  const maxVal = Math.max(...allData.map((d) => d.amount));
  const pad = 25;
  const w = 500;
  const h = 160;

  const pts = allData.map((d, i) => ({
    x: pad + (i / (allData.length - 1)) * (w - pad * 2),
    y: h - pad - (d.amount / maxVal) * (h - pad * 2 - 5),
  }));

  const actualPts = pts.slice(0, costTrendData.length);
  const forecastPts = [pts[costTrendData.length - 1], ...pts.slice(costTrendData.length)];

  const actualLine = actualPts.map((p) => `${p.x},${p.y}`).join(" ");
  const forecastLine = forecastPts.map((p) => `${p.x},${p.y}`).join(" ");

  const areaPath = `M${actualPts[0].x},${h - pad} ${actualPts.map((p) => `L${p.x},${p.y}`).join(" ")} L${actualPts[actualPts.length - 1].x},${h - pad} Z`;

  return (
    <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-[14px] font-semibold text-brown-800">
            Cost Trend Over Time
          </h3>
          <p className="text-[11px] text-beige-500 mt-0.5">
            Monthly spend with 3-month forecast
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5 bg-brown-500 rounded" />
            <span className="text-[9px] text-beige-500">Actual</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5 bg-gold-500 rounded" style={{ borderTop: "1.5px dashed #D0B060" }} />
            <span className="text-[9px] text-beige-500">Forecast</span>
          </div>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[200px]">
        {[0, 1, 2, 3].map((i) => {
          const y = pad + (i * (h - pad * 2)) / 3;
          const val = Math.round(maxVal - (i * maxVal) / 3);
          return (
            <g key={i}>
              <line x1={pad} y1={y} x2={w - pad} y2={y} stroke="#E9DFD7" strokeWidth="0.5" />
              <text x={pad - 4} y={y + 3} textAnchor="end" fontSize="7" fill="#B8A99A">
                ${(val / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}

        <line
          x1={actualPts[actualPts.length - 1].x}
          y1={pad}
          x2={actualPts[actualPts.length - 1].x}
          y2={h - pad}
          stroke="#E9DFD7"
          strokeWidth="0.8"
          strokeDasharray="3,3"
        />
        <text
          x={actualPts[actualPts.length - 1].x}
          y={pad - 5}
          textAnchor="middle"
          fontSize="7"
          fill="#B8A99A"
        >
          Today
        </text>

        <defs>
          <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A67763" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#A67763" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#costGrad)" />

        <polyline
          points={actualLine}
          fill="none"
          stroke="#A67763"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <polyline
          points={forecastLine}
          fill="none"
          stroke="#D0B060"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="6,4"
        />

        {actualPts.map((p, i) => (
          <g key={`a-${i}`}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="white" stroke="#A67763" strokeWidth="1.5" />
            <text x={p.x} y={h - 6} textAnchor="middle" fontSize="7" fill="#B8A99A">
              {allData[i].month}
            </text>
          </g>
        ))}

        {forecastPts.slice(1).map((p, i) => (
          <g key={`f-${i}`}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="white" stroke="#D0B060" strokeWidth="1.5" strokeDasharray="2,1" />
            <text x={p.x} y={h - 6} textAnchor="middle" fontSize="7" fill="#D0B060">
              {allData[costTrendData.length + i].month}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ── Cost By Skill Category Donut ── */
function CostBySkillDonut() {
  const totalSpent = costBySkill.reduce((sum, s) => sum + s.amount, 0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  return (
    <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
      <h3 className="text-[14px] font-semibold text-brown-800 mb-4">
        Cost by Skill Category
      </h3>
      <div className="flex items-center justify-center gap-8">
        <div className="relative">
          <svg width="160" height="160" className="-rotate-90">
            {costBySkill.map((seg, i) => {
              const dashLength = (seg.pct / 100) * circumference;
              const gap = circumference - dashLength;
              const offset = cumulativeOffset;
              cumulativeOffset += dashLength;

              return (
                <circle
                  key={i}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="16"
                  strokeDasharray={`${dashLength} ${gap}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                  opacity="0.85"
                />
              );
            })}
            <circle cx="80" cy="80" r="48" fill="white" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[20px] font-bold text-brown-900">
              ${(totalSpent / 1000).toFixed(1)}k
            </span>
            <span className="text-[9px] text-beige-500 font-medium">Total Spent</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {costBySkill.map((seg, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: seg.color, opacity: 0.85 }}
              />
              <div>
                <p className="text-[11px] font-semibold text-brown-700">
                  {seg.pct}%
                </p>
                <p className="text-[9px] text-beige-500">{seg.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════ */
export default function EconomicDashboardPage() {
  const [selectedProject, setSelectedProject] = React.useState("All Projects");
  const [activeDateRange, setActiveDateRange] = React.useState("This Quarter");
  const [baselineOpen, setBaselineOpen] = React.useState(false);
  const [baselineRate, setBaselineRate] = React.useState("125");
  const [baselineHours, setBaselineHours] = React.useState("2400");
  const [baselineOverhead, setBaselineOverhead] = React.useState("35");

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-6"
    >
      {/* ── Header with export ── */}
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
            Economic Dashboard
          </h1>
          <p className="text-[13px] text-beige-500 mt-1">
            Spend analysis, ROI metrics, cost trends, and earning distribution across all projects.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => toast.info("CSV export would be generated for the current economic view.")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-beige-200 bg-white/70 text-[11px] font-medium text-brown-700 hover:bg-beige-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
          <button
            onClick={() => toast.info("PDF report would be generated for the current economic view.")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brown-600 text-[11px] font-medium text-white hover:bg-brown-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            PDF
          </button>
        </div>
      </motion.div>

      {/* ── Filter bar ── */}
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap items-center gap-3 rounded-xl border border-beige-200/50 bg-white/60 backdrop-blur-sm px-4 py-2.5"
      >
        <Filter className="w-3.5 h-3.5 text-beige-400" />
        <span className="text-[11px] font-semibold text-brown-700 tracking-wide uppercase">Filters</span>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="h-8 rounded-lg border border-beige-200/50 bg-white/70 px-3 text-[11px] text-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-200/30"
        >
          {projectOptions.map((opt) => (
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

      {/* ── Step 1: Primary KPI Cards (SOW 27.3) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              variants={fadeUp}
              className="group rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", kpi.bg)}>
                  <Icon className={cn("w-4 h-4", kpi.iconColor)} />
                </div>
                <div className="flex items-center gap-1">
                  {kpi.positive ? (
                    <ArrowUpRight className="w-3 h-3 text-forest-500" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-gold-600" />
                  )}
                  <span
                    className={cn(
                      "text-[10px] font-semibold",
                      kpi.positive ? "text-forest-600" : "text-gold-600"
                    )}
                  >
                    {kpi.change}
                  </span>
                </div>
              </div>
              <p className="text-[24px] font-bold text-brown-900 tracking-tight">
                {kpi.value}
              </p>
              <p className="text-[11px] text-beige-500 mt-0.5">{kpi.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Secondary metrics row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {secondaryMetrics.map((m) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              variants={fadeUp}
              className="flex items-start gap-3 rounded-2xl border border-beige-200/50 bg-white/60 backdrop-blur-sm p-4"
            >
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", m.bg)}>
                <Icon className={cn("w-4 h-4", m.color)} />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[18px] font-bold text-brown-900">{m.value}</span>
                  <span className="text-[11px] font-semibold text-brown-600">{m.label}</span>
                </div>
                <p className="text-[10px] text-beige-500 mt-0.5">{m.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Step 2: Spend Analysis — Budget vs Actual ── */}
      <motion.div variants={fadeUp}>
        <BudgetVsActualChart />
      </motion.div>

      {/* ── Step 2: Spend Analysis — Cost Trend + Cost by Skill ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={fadeUp}>
          <CostTrendChart />
        </motion.div>
        <motion.div variants={fadeUp}>
          <CostBySkillDonut />
        </motion.div>
      </div>

      {/* ── Step 3: ROI Section ── */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[16px] font-bold text-brown-900">Return on Investment</h2>
            <p className="text-[11px] text-beige-500 mt-0.5">
              Cost efficiency metrics — deliverable costs, waste tracking, and platform savings
            </p>
          </div>
          <button
            onClick={() => setBaselineOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-beige-200 bg-white/70 text-[11px] font-medium text-brown-700 hover:bg-beige-50 transition-colors"
          >
            <Gauge className="w-3.5 h-3.5" />
            Configure Baseline
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roiMetrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-beige-100/50 bg-beige-50/30 p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <MetricRing
                  value={parseFloat(metric.value.replace(/[^0-9.]/g, ""))}
                  max={metric.value.includes("%") ? 100 : parseFloat(metric.value.replace(/[^0-9.]/g, "")) * 1.3}
                  size={52}
                  strokeWidth={5}
                  color={metric.color}
                />
                <div>
                  <p className="text-[18px] font-bold text-brown-900">{metric.value}</p>
                  <div className="flex items-center gap-1">
                    {metric.positive ? (
                      <ArrowUpRight className="w-2.5 h-2.5 text-forest-500" />
                    ) : (
                      <ArrowDownRight className="w-2.5 h-2.5 text-gold-600" />
                    )}
                    <span className={cn(
                      "text-[9px] font-semibold",
                      metric.positive ? "text-forest-600" : "text-gold-600"
                    )}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] font-semibold text-brown-700">{metric.label}</p>
              <p className="text-[9px] text-beige-500 mt-0.5">{metric.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Step 4: Earning Distribution by Contributor Segment ── */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[16px] font-bold text-brown-900">Earning Distribution</h2>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-beige-400" />
            <span className="text-[11px] text-beige-500">Anonymized & aggregated</span>
          </div>
        </div>
        <p className="text-[11px] text-beige-500 mb-5">
          How spend distributes across contributor segments — all data anonymized per platform policy
        </p>

        <div className="space-y-4">
          {earningDistribution.map((seg) => {
            const Icon = seg.icon;
            const maxPct = Math.max(...earningDistribution.map((s) => s.pct));
            const barWidth = (seg.pct / maxPct) * 100;

            return (
              <div key={seg.segment} className="flex items-center gap-4">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", seg.bg)}>
                  <Icon className="w-4 h-4" style={{ color: seg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-semibold text-brown-700">{seg.segment}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-beige-500">{seg.count} contributors</span>
                      <span className="text-[12px] font-bold text-brown-900">
                        ${(seg.amount / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                  <div className="relative h-3 bg-beige-100/60 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
                      style={{ width: `${barWidth}%`, backgroundColor: seg.color, opacity: 0.7 }}
                    />
                    <div className="absolute right-2 top-0 h-full flex items-center">
                      <span className="text-[8px] font-bold text-brown-600">{seg.pct}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-beige-100">
          <span className="text-[10px] text-beige-500">Total distributed</span>
          <span className="text-[12px] font-bold text-brown-900">
            ${(earningDistribution.reduce((sum, s) => sum + s.amount, 0) / 1000).toFixed(1)}k across {earningDistribution.reduce((sum, s) => sum + s.count, 0)} contributors
          </span>
        </div>
      </motion.div>

      {/* ── Configure Baseline Dialog ── */}
      <Dialog open={baselineOpen} onOpenChange={setBaselineOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Configure ROI Baseline</DialogTitle>
            <DialogDescription>
              Set the traditional staffing cost baseline used to calculate platform savings and ROI comparisons.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div>
              <label className="text-[12px] font-medium text-brown-700 mb-1.5 block">
                Traditional Hourly Rate ($/hr)
              </label>
              <input
                type="number"
                value={baselineRate}
                onChange={(e) => setBaselineRate(e.target.value)}
                className="w-full h-9 rounded-lg border border-beige-200 bg-white px-3 text-[13px] text-brown-800 focus:outline-none focus:ring-2 focus:ring-brown-200/40 focus:border-brown-300"
              />
              <p className="text-[10px] text-beige-500 mt-1">Average hourly rate for equivalent traditional staffing</p>
            </div>
            <div>
              <label className="text-[12px] font-medium text-brown-700 mb-1.5 block">
                Estimated Hours per Quarter
              </label>
              <input
                type="number"
                value={baselineHours}
                onChange={(e) => setBaselineHours(e.target.value)}
                className="w-full h-9 rounded-lg border border-beige-200 bg-white px-3 text-[13px] text-brown-800 focus:outline-none focus:ring-2 focus:ring-brown-200/40 focus:border-brown-300"
              />
              <p className="text-[10px] text-beige-500 mt-1">Total estimated hours with traditional staffing model</p>
            </div>
            <div>
              <label className="text-[12px] font-medium text-brown-700 mb-1.5 block">
                Overhead & Management Cost (%)
              </label>
              <input
                type="number"
                value={baselineOverhead}
                onChange={(e) => setBaselineOverhead(e.target.value)}
                className="w-full h-9 rounded-lg border border-beige-200 bg-white px-3 text-[13px] text-brown-800 focus:outline-none focus:ring-2 focus:ring-brown-200/40 focus:border-brown-300"
              />
              <p className="text-[10px] text-beige-500 mt-1">Additional overhead percentage (recruitment, management, benefits)</p>
            </div>
            <div className="rounded-lg bg-beige-50/60 border border-beige-100 p-3">
              <p className="text-[11px] font-medium text-brown-700 mb-1">Estimated Traditional Cost</p>
              <p className="text-[18px] font-bold text-brown-900">
                ${((Number(baselineRate) * Number(baselineHours) * (1 + Number(baselineOverhead) / 100)) / 1000).toFixed(0)}k
                <span className="text-[11px] font-normal text-beige-500 ml-1.5">per quarter</span>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBaselineOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setBaselineOpen(false);
                toast.success("ROI baseline updated — savings metrics recalculated.");
              }}
            >
              Save Baseline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
