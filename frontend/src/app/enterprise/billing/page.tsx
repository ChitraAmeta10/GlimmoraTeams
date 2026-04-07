"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  CircleDollarSign,
  Clock,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  Wallet,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  FileDown,
  Printer,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import { Badge } from "@/components/ui";
import { toast } from "@/lib/stores/toast-store";
import { mockInvoices, billingStats } from "@/mocks/data/enterprise-billing";
import { mockProjects, mockDeliverables, mockMilestones } from "@/mocks/data/enterprise-projects";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/* ── Payout eligibility data (accepted deliverables) ── */
const payoutEligible = mockDeliverables
  .filter((d) => d.status === "approved")
  .map((d) => {
    const project = mockProjects.find((p) => p.id === d.projectId);
    const milestone = mockMilestones.find((m) => m.id === d.milestoneId);
    return {
      ...d,
      projectTitle: project?.title || "Unknown Project",
      milestoneTitle: milestone?.title || "Unknown Milestone",
      payoutAmount: milestone ? Math.round(milestone.budget / (milestone.deliverables || 1)) : 0,
    };
  });

/* ── KPI data ── */
const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);
const totalSpent = mockProjects.reduce((sum, p) => sum + p.spent, 0);
const pendingPayouts = payoutEligible.reduce((sum, d) => sum + d.payoutAmount, 0);
const activeInvoices = mockInvoices.filter((i) => i.status === "pending" || i.status === "overdue").length;

/* ── Mini sparkline ── */
function Sparkline() {
  const data = billingStats.monthlySpend;
  const max = Math.max(...data.map((d) => d.amount));
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (d.amount / max) * 80;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" className="w-full h-[40px]" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="#5B9BA2"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={`0,100 ${points} 100,100`}
        fill="url(#sparkGrad)"
        opacity="0.15"
      />
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5B9BA2" />
          <stop offset="100%" stopColor="#5B9BA2" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Monthly spend chart ── */
function MonthlySpendChart() {
  const data = billingStats.monthlySpend;
  const max = Math.max(...data.map((d) => d.amount));

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-3 h-[180px] px-2">
        {data.map((d) => {
          const heightPct = (d.amount / max) * 100;
          const isHighest = d.amount === max;
          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-brown-700">
                {formatCurrency(d.amount)}
              </span>
              <div className="w-full flex items-end justify-center" style={{ height: "140px" }}>
                <div
                  className={cn(
                    "w-full max-w-[48px] rounded-t-lg transition-all",
                    isHighest
                      ? "bg-gradient-to-t from-brown-500 to-brown-400"
                      : "bg-gradient-to-t from-teal-500/70 to-teal-400/50"
                  )}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="text-[11px] text-beige-500 font-medium">
                {d.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   BILLING DASHBOARD PAGE (G3/G4)
   ═══════════════════════════════════ */
export default function BillingDashboardPage() {
  const handleExport = (format: "csv" | "pdf") => {
    if (format === "csv") {
      toast.info("Export CSV", "CSV export requires backend integration.");
    } else {
      toast.info("Export PDF", "PDF export requires backend integration.");
    }
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-6"
    >
      {/* Page Header */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brown-500 to-gold-500 flex items-center justify-center shadow-md shadow-brown-500/20">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brown-900 tracking-tight font-heading">
              Billing & Payouts
            </h1>
            <p className="text-sm text-beige-600 mt-0.5">
              Payout eligibility, invoices, and financial exports.
            </p>
          </div>
        </div>

        {/* Export buttons (G4) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport("csv")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-beige-200 bg-white/80 hover:bg-beige-50 text-[12px] font-semibold text-brown-700 transition-all hover:-translate-y-0.5 disabled:opacity-50"
          >
            <FileDown className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brown-600 hover:bg-brown-700 text-white text-[12px] font-semibold shadow-md hover:shadow-lg hover:shadow-brown-500/25 transition-all hover:-translate-y-0.5 disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </motion.div>

      {/* KPI Row */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {/* Total Budget */}
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-brown-50 flex items-center justify-center">
              <CircleDollarSign className="w-3.5 h-3.5 text-brown-600" />
            </div>
            <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
              Total Budget
            </span>
          </div>
          <p className="text-2xl font-bold text-brown-900 tracking-tight">
            {formatCurrency(totalBudget)}
          </p>
          <p className="text-[10px] text-beige-500 mt-1">
            Across {mockProjects.length} projects
          </p>
        </div>

        {/* Total Spent */}
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
              Total Spent
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-brown-900 tracking-tight">
                {formatCurrency(totalSpent)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-teal-600" />
                <span className="text-[10px] font-medium text-teal-600">
                  {Math.round((totalSpent / totalBudget) * 100)}% utilized
                </span>
              </div>
            </div>
            <div className="w-20">
              <Sparkline />
            </div>
          </div>
        </div>

        {/* Pending Payouts */}
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-gold-50 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-gold-600" />
            </div>
            <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
              Pending Payouts
            </span>
          </div>
          <p className="text-2xl font-bold text-brown-900 tracking-tight">
            {formatCurrency(pendingPayouts)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowDownRight className="w-3 h-3 text-forest-600" />
            <span className="text-[10px] font-medium text-forest-600">
              {payoutEligible.length} eligible
            </span>
          </div>
        </div>

        {/* Active Invoices */}
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-forest-50 flex items-center justify-center">
              <Receipt className="w-3.5 h-3.5 text-forest-600" />
            </div>
            <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
              Active Invoices
            </span>
          </div>
          <p className="text-2xl font-bold text-brown-900 tracking-tight">
            {activeInvoices}
          </p>
          <p className="text-[10px] text-beige-500 mt-1">
            {mockInvoices.length} total invoices
          </p>
        </div>
      </motion.div>

      {/* Main Content: Chart + Payout Eligibility */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Monthly Spend Chart (2/5) */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-2 rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-500" />
              <h2 className="text-sm font-semibold text-brown-800">
                Monthly Spend
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-teal-500/60" />
                <span className="text-[10px] text-beige-500">Regular</span>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-brown-500" />
                <span className="text-[10px] text-beige-500">Peak</span>
              </div>
            </div>
          </div>
          <MonthlySpendChart />
        </motion.div>

        {/* Payout Eligibility Table (G3) (3/5) */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-3 rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-forest-500" />
              <h2 className="text-sm font-semibold text-brown-800">
                Payout Eligibility
              </h2>
              <Badge variant="forest" size="sm">
                {payoutEligible.length} eligible
              </Badge>
            </div>
          </div>

          <p className="text-[11px] text-beige-500 mb-4 leading-relaxed">
            Accepted deliverables eligible for payout release. Only approved outcomes qualify.
          </p>

          {/* Column headers */}
          <div className="hidden md:grid md:grid-cols-12 gap-3 px-3 py-2 text-[10px] font-semibold text-beige-500 uppercase tracking-wider border-b border-beige-100">
            <div className="col-span-4">Deliverable</div>
            <div className="col-span-3">Project</div>
            <div className="col-span-2">Milestone</div>
            <div className="col-span-1 text-center">Evidence</div>
            <div className="col-span-2 text-right">Payout</div>
          </div>

          <div className="divide-y divide-beige-100/60">
            {payoutEligible.length === 0 ? (
              <div className="py-8 text-center text-[12px] text-beige-400">
                No deliverables currently eligible for payout.
              </div>
            ) : (
              payoutEligible.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center px-3 py-3 hover:bg-beige-50/40 transition-colors"
                >
                  <div className="md:col-span-4 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-forest-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-brown-800 truncate">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-beige-400 md:hidden">
                        {item.projectTitle}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block md:col-span-3">
                    <p className="text-[11px] text-beige-600 truncate">
                      {item.projectTitle}
                    </p>
                  </div>
                  <div className="hidden md:block md:col-span-2">
                    <p className="text-[11px] text-beige-600 truncate">
                      {item.milestoneTitle}
                    </p>
                  </div>
                  <div className="hidden md:flex md:col-span-1 justify-center">
                    <Badge variant="beige" size="sm">
                      {item.evidenceFiles} files
                    </Badge>
                  </div>
                  <div className="hidden md:block md:col-span-2 text-right">
                    <span className="text-[13px] font-bold text-forest-700 tabular-nums">
                      {formatCurrency(item.payoutAmount)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Total bar */}
          {payoutEligible.length > 0 && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-beige-200/60 px-3">
              <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
                Total Eligible
              </span>
              <span className="text-[15px] font-bold text-brown-900">
                {formatCurrency(pendingPayouts)}
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Avg Payment Time bar */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-beige-200/50 bg-gradient-to-r from-white/70 to-beige-50/50 backdrop-blur-sm p-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-forest-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-forest-600" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-brown-800">
                Average Payment Time
              </p>
              <p className="text-[11px] text-beige-500">
                From deliverable acceptance to payout release
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block w-48">
              <div className="h-2 rounded-full bg-beige-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-forest-500 to-teal-500"
                  style={{
                    width: `${Math.min((billingStats.averagePaymentTime / 30) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
            <span className="text-xl font-bold text-brown-900">
              {billingStats.averagePaymentTime}
              <span className="text-[12px] text-beige-500 ml-1">days</span>
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
