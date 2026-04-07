"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  FileDown,
  Download,
  BarChart3,
  CheckCircle2,
  Copy,
  Receipt,
  DollarSign,
  ClipboardList,
  TrendingUp,
  Eye,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import {
  Badge,
  Button,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui";
import { toast } from "@/lib/stores/toast-store";
import { mockProjects } from "@/mocks/data/enterprise-projects";

/* ── Report Type Definitions ── */
const reportTypes = [
  {
    id: "billing-summary",
    title: "Billing Summary",
    description: "Overview of all billing activity including invoices, payments, and outstanding balances.",
    icon: Receipt,
    accent: "text-teal-600",
    bg: "bg-teal-50",
    gradient: "from-teal-500 to-teal-600",
    lastGenerated: "Mar 7, 2026",
    records: 42,
    recordLabel: "invoices",
  },
  {
    id: "payout-report",
    title: "Payout Report",
    description: "Detailed payout records per contributor, task acceptance dates, and amounts disbursed.",
    icon: DollarSign,
    accent: "text-forest-600",
    bg: "bg-forest-50",
    gradient: "from-forest-500 to-forest-600",
    lastGenerated: "Mar 5, 2026",
    records: 128,
    recordLabel: "payouts",
  },
  {
    id: "task-pricing",
    title: "Task Pricing Report",
    description: "Rate card applications across all tasks, effort breakdowns, and pricing analytics.",
    icon: ClipboardList,
    accent: "text-gold-600",
    bg: "bg-gold-50",
    gradient: "from-gold-500 to-gold-600",
    lastGenerated: "Mar 3, 2026",
    records: 86,
    recordLabel: "tasks priced",
  },
  {
    id: "full-financial",
    title: "Full Financial Report",
    description: "Comprehensive report covering billing, payouts, escrow, pricing, and forecasts.",
    icon: TrendingUp,
    accent: "text-brown-600",
    bg: "bg-brown-50",
    gradient: "from-brown-500 to-brown-600",
    lastGenerated: "Feb 28, 2026",
    records: 310,
    recordLabel: "line items",
  },
];

/* ── Recent Exports ── */
const recentExports = [
  { id: 1, name: "billing-summary-mar-2026.csv", type: "Billing Summary", format: "CSV", date: "Mar 7, 2026", size: "128 KB" },
  { id: 2, name: "payout-report-q1-2026.pdf", type: "Payout Report", format: "PDF", date: "Mar 5, 2026", size: "2.4 MB" },
  { id: 3, name: "full-financial-feb-2026.csv", type: "Full Financial", format: "CSV", date: "Feb 28, 2026", size: "456 KB" },
  { id: 4, name: "task-pricing-feb-2026.pdf", type: "Task Pricing", format: "PDF", date: "Feb 20, 2026", size: "1.8 MB" },
];

function generateMockReport(reportId: string, fmt: string): void {
  const filename = `${reportId}-report-${new Date().toISOString().split("T")[0]}.${fmt}`;
  let content: string;
  let mimeType: string;

  if (fmt === "csv") {
    content = `"Report","${reportId}","Generated","${new Date().toISOString()}"\n"Type","Date","Amount","Status"\n"Invoice","2026-03-01","$12,500","Paid"\n"Invoice","2026-03-05","$8,200","Pending"\n"Payout","2026-03-02","$3,400","Disbursed"`;
    mimeType = "text/csv";
  } else {
    // For PDF mock, generate a text file since real PDF generation requires a library
    content = `FINANCIAL REPORT\n${"=".repeat(40)}\nReport: ${reportId}\nGenerated: ${new Date().toLocaleString()}\n\nThis is a mock report preview.\nIn production, this would be a formatted PDF document.`;
    mimeType = "text/plain";
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function FinancialReportsPage() {
  const [selectedReport, setSelectedReport] = React.useState("billing-summary");
  const [format, setFormat] = React.useState("csv");
  const [scope, setScope] = React.useState("all");
  const [dateRange, setDateRange] = React.useState("last-30");
  const [project, setProject] = React.useState("all");
  const [generating, setGenerating] = React.useState(false);

  const selectedReportData = reportTypes.find((r) => r.id === selectedReport);

  const handleGenerate = () => {
    setGenerating(true);
    // Simulate generation delay so user sees the loading state
    setTimeout(() => {
      generateMockReport(selectedReport, format);
      setGenerating(false);
      toast.success(
        "Report Downloaded",
        `${selectedReportData?.title} saved as ${selectedReport}-report-${new Date().toISOString().split("T")[0]}.${format}`
      );
    }, 800);
  };

  const handleCopyEndpoint = () => {
    const endpoint = `GET /v1/reports/billing?type=${selectedReport}&format=${format}&scope=${scope}`;
    navigator.clipboard?.writeText(endpoint);
    toast.info("API Endpoint Copied", endpoint);
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-md shadow-forest-500/20">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brown-900 tracking-tight font-heading">
              Financial Reports
            </h1>
            <p className="text-sm text-beige-600">
              Generate and export billing, payout, and pricing reports.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content: Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Report Configuration */}
        <motion.div variants={fadeUp} className="lg:col-span-3 space-y-5">
          {/* Report Type Selection */}
          <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
            <h3 className="text-[13px] font-semibold text-brown-800 mb-3">
              Select Report Type
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {reportTypes.map((report) => {
                const isSelected = selectedReport === report.id;
                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    aria-pressed={isSelected}
                    className={cn(
                      "text-left p-4 rounded-xl border-[1.5px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-500 focus-visible:ring-offset-2",
                      isSelected
                        ? "border-brown-400 bg-brown-50/60 shadow-sm"
                        : "border-beige-200/50 bg-white/60 hover:border-beige-300 hover:shadow-sm"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br shadow-sm",
                          report.gradient
                        )}
                      >
                        <report.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-brown-900">
                          {report.title}
                        </p>
                        <p className="text-[11px] text-beige-500 mt-0.5 line-clamp-2">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[9px] text-beige-400">
                            Last: {report.lastGenerated}
                          </span>
                          <span className="text-[9px] bg-beige-100 text-beige-600 px-1.5 py-0.5 rounded-full font-medium">
                            {report.records} {report.recordLabel}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-brown-600 shrink-0 mt-0.5" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Settings */}
          <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
            <h3 className="text-[13px] font-semibold text-brown-800 mb-4">
              Export Settings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Format */}
              <div>
                <label className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider mb-1.5 block">
                  Format
                </label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                    <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div>
                <label className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider mb-1.5 block">
                  Date Range
                </label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7">Last 7 Days</SelectItem>
                    <SelectItem value="last-30">Last 30 Days</SelectItem>
                    <SelectItem value="last-90">Last 90 Days</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Project Status */}
              <div>
                <label className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider mb-1.5 block">
                  Project Status
                </label>
                <Select value={scope} onValueChange={setScope}>
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="completed">Completed Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Specific Project */}
              <div>
                <label className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider mb-1.5 block">
                  Specific Project
                </label>
                <Select value={project} onValueChange={setProject}>
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {mockProjects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Generate Buttons */}
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-beige-100/60">
              <Button
                variant="gradient-forest"
                size="sm"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                {generating ? "Generating…" : "Generate & Download"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.info(
                    "Preview",
                    `${selectedReportData?.title} — ${selectedReportData?.records} ${selectedReportData?.recordLabel} for ${dateRange === "last-7" ? "last 7 days" : dateRange === "last-30" ? "last 30 days" : dateRange === "last-90" ? "last 90 days" : dateRange === "ytd" ? "year to date" : "all time"}`
                  );
                }}
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyEndpoint}
              >
                <Copy className="w-3.5 h-3.5" />
                Copy API Endpoint
              </Button>
            </div>
          </div>

          {/* API Endpoint Reference */}
          <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-[13px] font-semibold text-brown-800">
                API Access
              </h3>
              <Badge variant="teal" size="sm">
                REST
              </Badge>
            </div>
            <div className="rounded-xl bg-brown-950 p-4 font-mono text-[12px] text-beige-200 leading-relaxed overflow-x-auto">
              <p className="text-beige-400"># Billing Report API</p>
              <p className="mt-1">
                <span className="text-forest-400">GET</span>{" "}
                <span className="text-gold-400">/v1/reports/billing</span>
                <span className="text-beige-500">?type=</span>
                <span className="text-teal-400">{selectedReport}</span>
                <span className="text-beige-500">&format=</span>
                <span className="text-teal-400">{format}</span>
                <span className="text-beige-500">&scope=</span>
                <span className="text-teal-400">{scope}</span>
              </p>
              <p className="mt-2 text-beige-400"># Authentication: Bearer Token (OAuth2)</p>
              <p className="text-beige-500">
                Authorization: Bearer {"<"}your_api_key{">"}
              </p>
            </div>
            <p className="text-[11px] text-beige-500 mt-2">
              Requires <span className="font-medium text-beige-600">reports:read</span> OAuth2 scope.
              See API documentation for full query parameters.
            </p>
          </div>
        </motion.div>

        {/* Right: Recent Exports + Quick Stats */}
        <motion.div variants={fadeUp} className="lg:col-span-2 space-y-5">
          {/* Quick Stats */}
          <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
            <h3 className="text-[13px] font-semibold text-brown-800 mb-3">
              Report Stats
            </h3>
            <div className="space-y-3">
              {[
                { label: "Reports Generated", value: "23", sub: "This month", accent: "text-teal-600", bg: "bg-teal-50" },
                { label: "Total Downloads", value: "67", sub: "All time", accent: "text-forest-600", bg: "bg-forest-50" },
                { label: "API Calls", value: "142", sub: "Last 30 days", accent: "text-gold-600", bg: "bg-gold-50" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between p-3 rounded-xl border border-beige-100/60 bg-beige-50/30"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", stat.bg)}>
                      <FileDown className={cn("w-3.5 h-3.5", stat.accent)} />
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-brown-800">{stat.label}</p>
                      <p className="text-[10px] text-beige-500">{stat.sub}</p>
                    </div>
                  </div>
                  <p className="text-[18px] font-bold text-brown-900 tracking-tight">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Exports */}
          <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
            <h3 className="text-[13px] font-semibold text-brown-800 mb-3">
              Recent Exports
            </h3>
            <div className="space-y-2">
              {recentExports.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => {
                    const reportId = exp.type.toLowerCase().replace(/\s+/g, "-");
                    const fmt = exp.format.toLowerCase();
                    generateMockReport(reportId, fmt);
                    toast.success("Re-downloading", exp.name);
                  }}
                  className="w-full text-left flex items-center gap-3 p-3 rounded-xl border border-beige-100/60 hover:border-beige-200 hover:bg-beige-50/40 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-500 focus-visible:ring-offset-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-beige-100 flex items-center justify-center shrink-0">
                    {exp.format === "CSV" ? (
                      <FileText className="w-3.5 h-3.5 text-teal-600" />
                    ) : (
                      <FileDown className="w-3.5 h-3.5 text-brown-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-brown-800 truncate">
                      {exp.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-beige-500">{exp.date}</span>
                      <span className="text-[10px] text-beige-400">·</span>
                      <span className="text-[10px] text-beige-500">{exp.size}</span>
                    </div>
                  </div>
                  <Badge
                    variant={exp.format === "CSV" ? "teal" : "brown"}
                    size="sm"
                  >
                    {exp.format}
                  </Badge>
                  <Download className="w-3 h-3 text-beige-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
