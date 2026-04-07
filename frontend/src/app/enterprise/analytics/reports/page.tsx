"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  TrendingUp,
  Shield,
  DollarSign,
  Users,
  Calendar,
  ListChecks,
  Layers,
  ChevronRight,
  Download,
  Eye,
  Clock,
  BarChart3,
  LineChart,
  Table2,
  Share2,
  Star,
  Bookmark,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/stores/toast-store";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import {
  Badge,
  Button,
  Input,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui";

/* ══════════════════════════════════════════
   I4 — Self-service Analytics
   Report builder with save/share, drill-down
   ══════════════════════════════════════════ */

/* ── Metric categories ── */
const metricCategories: Record<string, { label: string; icon: React.ReactNode; gradient: string; metrics: string[] }> = {
  delivery: {
    label: "Delivery Metrics",
    icon: <TrendingUp className="w-4 h-4" />,
    gradient: "from-forest-400 to-forest-600",
    metrics: ["On-Time Delivery", "Avg Cycle Time", "First-Pass Acceptance", "Rework Rate", "Tasks Completed", "Active Projects"],
  },
  quality: {
    label: "Quality Metrics",
    icon: <Shield className="w-4 h-4" />,
    gradient: "from-teal-400 to-teal-600",
    metrics: ["Acceptance Rate", "Defect Density", "Test Coverage", "Review Scores", "Rework Cycles"],
  },
  team: {
    label: "Team Metrics",
    icon: <Users className="w-4 h-4" />,
    gradient: "from-brown-400 to-brown-600",
    metrics: ["Active Contributors", "Utilization Rate", "Skill Match Score", "Avg Completion Time", "Track Distribution"],
  },
  financial: {
    label: "Financial Metrics",
    icon: <DollarSign className="w-4 h-4" />,
    gradient: "from-gold-400 to-gold-600",
    metrics: ["Total Spend", "Cost per Task", "Budget Utilization", "ROI Index", "Escrow Balance", "Payment Timeline"],
  },
};

const groupByOptions = [
  { id: "project", label: "By Project" },
  { id: "team", label: "By Team" },
  { id: "skill", label: "By Skill" },
  { id: "time", label: "By Time Period" },
];

const vizTypes = [
  { id: "table", label: "Table", icon: Table2 },
  { id: "bar", label: "Bar Chart", icon: BarChart3 },
  { id: "line", label: "Line Chart", icon: LineChart },
];

/* ── Saved reports mock ── */
const savedReports = [
  { id: "sr-001", name: "Q1 2026 Delivery Summary", category: "delivery", date: "2026-03-01", shared: true, starred: true },
  { id: "sr-002", name: "February Quality Analysis", category: "quality", date: "2026-02-28", shared: false, starred: false },
  { id: "sr-003", name: "Monthly Financial Report — Feb", category: "financial", date: "2026-02-28", shared: true, starred: true },
  { id: "sr-004", name: "Team Performance — Sprint 14", category: "team", date: "2026-02-20", shared: false, starred: false },
  { id: "sr-005", name: "Custom Executive Dashboard", category: "delivery", date: "2026-02-15", shared: true, starred: true },
  { id: "sr-006", name: "Cost Per Task Trend — Q4 2025", category: "financial", date: "2026-01-05", shared: false, starred: false },
];

const categoryBadge: Record<string, "forest" | "teal" | "brown" | "gold"> = {
  delivery: "forest",
  quality: "teal",
  team: "brown",
  financial: "gold",
};

/* ══════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════ */
export default function SelfServiceAnalyticsPage() {
  const [metricCategory, setMetricCategory] = React.useState("delivery");
  const [dateFrom, setDateFrom] = React.useState("2026-01-01");
  const [dateTo, setDateTo] = React.useState("2026-03-06");
  const [groupBy, setGroupBy] = React.useState("project");
  const [vizType, setVizType] = React.useState("table");
  const [selectedMetrics, setSelectedMetrics] = React.useState<string[]>([
    "On-Time Delivery",
    "Avg Cycle Time",
    "First-Pass Acceptance",
  ]);

  /* Dialog states */
  const [saveOpen, setSaveOpen] = React.useState(false);
  const [saveName, setSaveName] = React.useState("");
  const [saveDesc, setSaveDesc] = React.useState("");
  const [saveVisibility, setSaveVisibility] = React.useState<"personal" | "team">("personal");
  const [shareOpen, setShareOpen] = React.useState(false);
  const [shareCopied, setShareCopied] = React.useState(false);
  const [reportGenerated, setReportGenerated] = React.useState(false);
  const [viewReportOpen, setViewReportOpen] = React.useState(false);
  const [viewReportTarget, setViewReportTarget] = React.useState<typeof savedReports[0] | null>(null);

  const toggleMetric = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  const currentCategory = metricCategories[metricCategory];

  /* Mock generated report rows */
  const mockGroupLabels: Record<string, string[]> = {
    project: ["SOW Intelligence MVP", "FinTech Compliance", "Healthcare Platform", "Retail Analytics"],
    team: ["Team Alpha", "Team Beta", "Team Gamma", "Team Delta"],
    skill: ["React/TypeScript", "Python/ML", "DevOps/Cloud", "Data Engineering"],
    time: ["Jan 2026", "Feb 2026", "Mar 2026 (partial)", "Q1 Average"],
  };

  const generatedRows = mockGroupLabels[groupBy]?.map((label) => ({
    group: label,
    values: selectedMetrics.map(() => {
      const v = Math.random();
      return metricCategory === "financial"
        ? `$${(v * 50000 + 10000).toFixed(0)}`
        : `${(v * 40 + 60).toFixed(1)}${metricCategory !== "team" ? "%" : ""}`;
    }),
  })) ?? [];

  const shareLink = `https://glimmora.app/reports/shared/${Date.now().toString(36)}`;

  const handleSave = () => {
    if (!saveName.trim()) return;
    toast.success("Report Saved", `"${saveName}" saved to your ${saveVisibility === "team" ? "team" : "personal"} library.`);
    setSaveOpen(false);
    setSaveName("");
    setSaveDesc("");
    setSaveVisibility("personal");
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareLink).catch(() => {});
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-6"
    >
      {/* Back + header */}
      <motion.div variants={fadeUp}>
        <Link
          href="/enterprise/analytics"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-teal-600 hover:text-teal-700 transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Analytics
        </Link>
        <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em]">
          Self-service Analytics
        </h1>
        <p className="text-[13px] text-beige-500 mt-1">
          Build custom reports with flexible metrics, drill-down grouping, and share with your team.
        </p>
      </motion.div>

      {/* ── Report Builder ── */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <FileText className="w-4 h-4 text-brown-500" />
          <h2 className="text-[14px] font-semibold text-brown-800">
            Report Builder
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Controls */}
          <div className="space-y-5">
            {/* Metric Selector */}
            <div>
              <label className="text-[11px] font-semibold text-brown-600 uppercase tracking-wider mb-2 block">
                Metric Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(metricCategories).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setMetricCategory(key);
                      setSelectedMetrics(cat.metrics.slice(0, 3));
                    }}
                    className={cn(
                      "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all",
                      metricCategory === key
                        ? "border-brown-400 bg-brown-50/60 shadow-sm"
                        : "border-beige-200/50 bg-white/40 hover:border-beige-300"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shrink-0",
                        cat.gradient
                      )}
                    >
                      {cat.icon}
                    </div>
                    <span className="text-[11px] font-medium text-brown-700">
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-[11px] font-semibold text-brown-600 uppercase tracking-wider mb-2 block">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-beige-500 mb-1 block">From</span>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div>
                  <span className="text-[10px] text-beige-500 mb-1 block">To</span>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {[
                  { label: "Last 7 days", from: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0] },
                  { label: "Last 30 days", from: new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0] },
                  { label: "This Quarter", from: "2026-01-01" },
                  { label: "This Year", from: "2026-01-01" },
                ].map(
                  (preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setDateFrom(preset.from);
                        setDateTo(new Date().toISOString().split("T")[0]);
                        toast.info("Date Range Updated", `Date range set to "${preset.label}".`);
                      }}
                      className="text-[10px] font-medium text-teal-600 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors"
                    >
                      {preset.label}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Group By */}
            <div>
              <label className="text-[11px] font-semibold text-brown-600 uppercase tracking-wider mb-2 block">
                Group By
              </label>
              <div className="flex flex-wrap gap-2">
                {groupByOptions.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGroupBy(g.id)}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-[11px] font-medium border transition-all",
                      groupBy === g.id
                        ? "border-brown-400 bg-brown-500 text-white shadow-sm"
                        : "border-beige-200 bg-white/60 text-brown-600 hover:border-beige-300"
                    )}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visualization Type */}
            <div>
              <label className="text-[11px] font-semibold text-brown-600 uppercase tracking-wider mb-2 block">
                Visualization
              </label>
              <div className="flex items-center gap-2">
                {vizTypes.map((vt) => {
                  const Icon = vt.icon;
                  return (
                    <button
                      key={vt.id}
                      onClick={() => setVizType(vt.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-medium border transition-all",
                        vizType === vt.id
                          ? "border-teal-400 bg-teal-50 text-teal-700 shadow-sm"
                          : "border-beige-200 bg-white/60 text-brown-600 hover:border-beige-300"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {vt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Metrics Selection */}
          <div>
            <label className="text-[11px] font-semibold text-brown-600 uppercase tracking-wider mb-2 block">
              Select Metrics ({selectedMetrics.length} selected)
            </label>
            <div className="space-y-2 mb-5">
              {currentCategory.metrics.map((metric) => (
                <label
                  key={metric}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                    selectedMetrics.includes(metric)
                      ? "border-brown-300 bg-brown-50/40"
                      : "border-beige-200/50 bg-white/40 hover:border-beige-300"
                  )}
                >
                  <Checkbox
                    checked={selectedMetrics.includes(metric)}
                    onCheckedChange={() => toggleMetric(metric)}
                  />
                  <span className="text-[12px] font-medium text-brown-700">
                    {metric}
                  </span>
                </label>
              ))}
            </div>

            {/* Preview card */}
            <div className="rounded-xl border border-beige-200/50 bg-beige-50/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-3.5 h-3.5 text-beige-400" />
                <span className="text-[11px] font-semibold text-brown-700">
                  Report Preview
                </span>
              </div>
              <div className="space-y-1.5 text-[11px] text-brown-600">
                <p>
                  <span className="font-semibold text-brown-800">Category:</span>{" "}
                  {currentCategory.label}
                </p>
                <p>
                  <span className="font-semibold text-brown-800">Date Range:</span>{" "}
                  {dateFrom} to {dateTo}
                </p>
                <p>
                  <span className="font-semibold text-brown-800">Metrics ({selectedMetrics.length}):</span>{" "}
                  {selectedMetrics.join(", ")}
                </p>
                <p>
                  <span className="font-semibold text-brown-800">Grouped:</span>{" "}
                  {groupByOptions.find((g) => g.id === groupBy)?.label}
                </p>
                <p>
                  <span className="font-semibold text-brown-800">Visualization:</span>{" "}
                  {vizTypes.find((v) => v.id === vizType)?.label}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-beige-100">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSaveOpen(true)}>
              <Bookmark className="w-3.5 h-3.5" />
              Save Report
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setShareCopied(false); setShareOpen(true); }}>
              <Share2 className="w-3.5 h-3.5" />
              Share
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => toast.info("Export CSV", "CSV export requires backend integration.")}>
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </Button>
            <Button variant="ghost" size="sm" onClick={() => toast.info("Export PDF", "PDF export requires backend integration.")}>
              <Download className="w-3.5 h-3.5" />
              Export PDF
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={selectedMetrics.length === 0}
              onClick={() => {
                setReportGenerated(true);
                toast.success("Report Generated", `${currentCategory.label} report generated with ${selectedMetrics.length} metrics.`);
              }}
            >
              <FileText className="w-4 h-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ── Generated Report Results ── */}
      {reportGenerated && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={cn("w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center text-white", currentCategory.gradient)}>
                {currentCategory.icon}
              </div>
              <div>
                <h2 className="text-[14px] font-semibold text-brown-800">
                  Generated Report — {currentCategory.label}
                </h2>
                <p className="text-[10px] text-beige-500">
                  {dateFrom} to {dateTo} · Grouped {groupByOptions.find((g) => g.id === groupBy)?.label?.toLowerCase()} · {selectedMetrics.length} metrics
                </p>
              </div>
            </div>
            <button
              onClick={() => setReportGenerated(false)}
              className="text-[11px] font-medium text-beige-400 hover:text-brown-600 transition-colors"
            >
              Dismiss
            </button>
          </div>

          {/* Table Visualization */}
          {vizType === "table" && (
            <div className="overflow-x-auto rounded-xl border border-beige-200/50">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-beige-50/60 border-b border-beige-100">
                    <th className="text-left px-4 py-2.5 font-semibold text-brown-700">
                      {groupByOptions.find((g) => g.id === groupBy)?.label?.replace("By ", "")}
                    </th>
                    {selectedMetrics.map((m) => (
                      <th key={m} className="text-right px-4 py-2.5 font-semibold text-brown-700">{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {generatedRows.map((row) => (
                    <tr key={row.group} className="border-b border-beige-50 last:border-0 hover:bg-beige-50/30">
                      <td className="px-4 py-2.5 font-medium text-brown-800">{row.group}</td>
                      {row.values.map((val, vi) => (
                        <td key={vi} className="text-right px-4 py-2.5 text-brown-600 font-mono">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Bar Chart Visualization */}
          {vizType === "bar" && (
            <div className="space-y-3">
              {generatedRows.map((row) => (
                <div key={row.group} className="flex items-center gap-3">
                  <span className="text-[11px] font-medium text-brown-700 w-36 truncate shrink-0">{row.group}</span>
                  <div className="flex-1 flex items-center gap-1.5">
                    {row.values.map((val, vi) => {
                      const numVal = parseFloat(val.replace(/[$%,]/g, ""));
                      const maxVal = metricCategory === "financial" ? 60000 : 100;
                      const pct = Math.min((numVal / maxVal) * 100, 100);
                      const barColors = ["bg-brown-400", "bg-forest-400", "bg-teal-400", "bg-gold-400"];
                      return (
                        <div key={vi} className="flex-1">
                          <div className="h-7 rounded-lg bg-beige-100/60 overflow-hidden relative">
                            <div
                              className={cn("h-full rounded-lg transition-all duration-700", barColors[vi % barColors.length])}
                              style={{ width: `${pct}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-brown-800 mix-blend-multiply">
                              {val}
                            </span>
                          </div>
                          <span className="text-[8px] text-beige-400 truncate block mt-0.5">{selectedMetrics[vi]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Line Chart Visualization (SVG) */}
          {vizType === "line" && (
            <div className="p-4">
              <svg viewBox="0 0 400 200" className="w-full h-48">
                {/* Grid */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line key={i} x1="40" y1={20 + i * 40} x2="380" y2={20 + i * 40} stroke="#E8DFD8" strokeWidth="0.5" strokeDasharray="4,4" />
                ))}
                {generatedRows.map((_, gi) => (
                  <line key={gi} x1={40 + gi * 113} y1="20" x2={40 + gi * 113} y2="180" stroke="#E8DFD8" strokeWidth="0.5" />
                ))}
                {/* Lines for each metric */}
                {selectedMetrics.map((metric, mi) => {
                  const colors = ["#A67763", "#4D5741", "#5B9BA2", "#D0B060"];
                  const points = generatedRows.map((row, ri) => {
                    const numVal = parseFloat(row.values[mi]?.replace(/[$%,]/g, "") || "50");
                    const maxVal = metricCategory === "financial" ? 60000 : 100;
                    const y = 180 - (numVal / maxVal) * 160;
                    const x = 40 + ri * 113;
                    return `${x},${y}`;
                  });
                  return (
                    <React.Fragment key={metric}>
                      <polyline
                        fill="none"
                        stroke={colors[mi % colors.length]}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points.join(" ")}
                      />
                      {points.map((pt, pi) => {
                        const [cx, cy] = pt.split(",").map(Number);
                        return <circle key={pi} cx={cx} cy={cy} r="3" fill={colors[mi % colors.length]} />;
                      })}
                    </React.Fragment>
                  );
                })}
                {/* X-axis labels */}
                {generatedRows.map((row, gi) => (
                  <text key={gi} x={40 + gi * 113} y="196" textAnchor="middle" className="text-[9px] fill-beige-500">{row.group.split(" ").slice(0, 2).join(" ")}</text>
                ))}
              </svg>
              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-2">
                {selectedMetrics.map((m, mi) => {
                  const colors = ["#A67763", "#4D5741", "#5B9BA2", "#D0B060"];
                  return (
                    <div key={m} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[mi % colors.length] }} />
                      <span className="text-[10px] text-brown-600">{m}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Saved Reports ── */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-semibold text-brown-800">
            Saved Reports
          </h2>
          <span className="text-[11px] text-beige-500">
            {savedReports.length} reports
          </span>
        </div>

        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-beige-100 text-[10px] font-semibold text-beige-500 uppercase tracking-wider">
            <div className="col-span-1" />
            <div className="col-span-4">Report Name</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Date Generated</div>
            <div className="col-span-1 text-center">Shared</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Rows */}
          {savedReports.map((report) => (
            <div
              key={report.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-3 border-b border-beige-50 last:border-0 hover:bg-beige-50/40 transition-colors items-center"
            >
              {/* Star */}
              <div className="col-span-1 hidden md:flex items-center">
                <Star
                  className={cn(
                    "w-3.5 h-3.5",
                    report.starred
                      ? "fill-gold-400 text-gold-400"
                      : "text-beige-300"
                  )}
                />
              </div>

              {/* Name */}
              <div className="col-span-4 flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-beige-400 shrink-0" />
                <span className="text-[12px] font-medium text-brown-700 truncate">
                  {report.name}
                </span>
              </div>

              {/* Category */}
              <div className="col-span-2">
                <Badge variant={categoryBadge[report.category]} size="sm">
                  {report.category}
                </Badge>
              </div>

              {/* Date */}
              <div className="col-span-2 hidden md:flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-beige-400" />
                <span className="text-[11px] text-beige-500">{report.date}</span>
              </div>

              {/* Shared */}
              <div className="col-span-1 hidden md:flex items-center justify-center">
                {report.shared ? (
                  <Share2 className="w-3.5 h-3.5 text-teal-500" />
                ) : (
                  <span className="text-[10px] text-beige-300">--</span>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-2 flex items-center justify-end gap-2">
                <button onClick={() => { setViewReportTarget(report); setViewReportOpen(true); }} className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-600 hover:text-teal-700 transition-colors">
                  <Eye className="w-3 h-3" />
                  View
                </button>
                <button onClick={() => toast.info("Export Report", `Export for "${report.name}" requires backend integration.`)} className="inline-flex items-center gap-1 text-[11px] font-medium text-brown-500 hover:text-brown-700 transition-colors">
                  <Download className="w-3 h-3" />
                  Export
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ══ Save Report Dialog ══ */}
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Report</DialogTitle>
            <DialogDescription>
              Save this report configuration to your library for quick access later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-[11px] font-semibold text-brown-600 uppercase tracking-wider mb-1.5 block">
                Report Name
              </label>
              <Input
                placeholder="e.g. Q1 Delivery Summary"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-brown-600 uppercase tracking-wider mb-1.5 block">
                Description (optional)
              </label>
              <textarea
                placeholder="Brief description of what this report tracks..."
                value={saveDesc}
                onChange={(e) => setSaveDesc(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-beige-200 bg-white/80 px-3 py-2 text-[12px] text-brown-800 placeholder:text-beige-400 focus:outline-none focus:ring-2 focus:ring-brown-200/40 focus:border-brown-300 transition-all resize-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-brown-600 uppercase tracking-wider mb-1.5 block">
                Visibility
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSaveVisibility("personal")}
                  className={cn(
                    "flex-1 px-3 py-2.5 rounded-xl text-[11px] font-medium border transition-all text-center",
                    saveVisibility === "personal"
                      ? "border-brown-400 bg-brown-500 text-white"
                      : "border-beige-200 bg-white/60 text-brown-600 hover:border-beige-300"
                  )}
                >
                  Personal
                </button>
                <button
                  onClick={() => setSaveVisibility("team")}
                  className={cn(
                    "flex-1 px-3 py-2.5 rounded-xl text-[11px] font-medium border transition-all text-center",
                    saveVisibility === "team"
                      ? "border-teal-400 bg-teal-500 text-white"
                      : "border-beige-200 bg-white/60 text-brown-600 hover:border-beige-300"
                  )}
                >
                  Team
                </button>
              </div>
            </div>
            {/* Summary of what's being saved */}
            <div className="rounded-xl bg-beige-50/60 border border-beige-200/50 p-3 text-[10px] text-brown-600 space-y-1">
              <p><span className="font-semibold">Category:</span> {currentCategory.label}</p>
              <p><span className="font-semibold">Metrics:</span> {selectedMetrics.join(", ")}</p>
              <p><span className="font-semibold">Visualization:</span> {vizTypes.find((v) => v.id === vizType)?.label}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setSaveOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={!saveName.trim()}>
              <Bookmark className="w-3.5 h-3.5" />
              Save Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══ Share Dialog ══ */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Report</DialogTitle>
            <DialogDescription>
              Share this report with your team via a link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-[11px] font-semibold text-brown-600 uppercase tracking-wider mb-1.5 block">
                Share Link
              </label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={shareLink}
                  className="flex-1 font-mono text-[11px]"
                />
                <Button variant="secondary" size="sm" onClick={handleCopyLink}>
                  {shareCopied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
            <div className="rounded-xl bg-beige-50/60 border border-beige-200/50 p-3 text-[10px] text-brown-600 space-y-1">
              <p className="font-semibold text-brown-700 mb-1">Report includes:</p>
              <p><span className="font-semibold">Category:</span> {currentCategory.label}</p>
              <p><span className="font-semibold">Metrics:</span> {selectedMetrics.join(", ")}</p>
              <p><span className="font-semibold">Date Range:</span> {dateFrom} to {dateTo}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setShareOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══ View Saved Report Dialog ══ */}
      <Dialog open={viewReportOpen} onOpenChange={setViewReportOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewReportTarget?.name}</DialogTitle>
            <DialogDescription>
              Generated on {viewReportTarget?.date} · Category: {viewReportTarget?.category}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            {viewReportTarget && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant={categoryBadge[viewReportTarget.category]} size="sm">
                    {viewReportTarget.category}
                  </Badge>
                  {viewReportTarget.shared && (
                    <span className="flex items-center gap-1 text-[10px] text-teal-600">
                      <Share2 className="w-3 h-3" /> Shared with team
                    </span>
                  )}
                </div>
                {/* Mock report content table */}
                <div className="overflow-x-auto rounded-xl border border-beige-200/50">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="bg-beige-50/60 border-b border-beige-100">
                        <th className="text-left px-4 py-2.5 font-semibold text-brown-700">Dimension</th>
                        <th className="text-right px-4 py-2.5 font-semibold text-brown-700">Value</th>
                        <th className="text-right px-4 py-2.5 font-semibold text-brown-700">Trend</th>
                        <th className="text-right px-4 py-2.5 font-semibold text-brown-700">Target</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(metricCategories[viewReportTarget.category]?.metrics ?? []).slice(0, 5).map((metric) => {
                        const val = (Math.random() * 30 + 65).toFixed(1);
                        const trend = (Math.random() * 10 - 3).toFixed(1);
                        return (
                          <tr key={metric} className="border-b border-beige-50 last:border-0">
                            <td className="px-4 py-2.5 font-medium text-brown-800">{metric}</td>
                            <td className="text-right px-4 py-2.5 text-brown-600 font-mono">{val}%</td>
                            <td className={cn("text-right px-4 py-2.5 font-mono text-[11px]", Number(trend) >= 0 ? "text-forest-600" : "text-brown-500")}>
                              {Number(trend) >= 0 ? "+" : ""}{trend}%
                            </td>
                            <td className="text-right px-4 py-2.5 text-beige-500 font-mono">85.0%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-beige-400 italic">
                  Report data is a snapshot from {viewReportTarget.date}. Live data may differ.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => toast.info("Export Report", `Export for "${viewReportTarget?.name}" requires backend integration.`)}>
              <Download className="w-3.5 h-3.5" />
              Export
            </Button>
            <Button variant="primary" size="sm" onClick={() => setViewReportOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
