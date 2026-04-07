"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DollarSign,
  Cpu,
  BarChart3,
  TrendingDown,
  Hash,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Globe2,
  Layers,
  Download,
  Search,
  Calculator,
  Pencil,
  Check,
  AlertTriangle,
  X,
  Info,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/stores/toast-store";
import { stagger, fadeUp, scaleIn } from "@/lib/utils/motion-variants";
import {
  Badge,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui";

/* ── Types ── */

interface TaskPricing {
  id: string;
  task: string;
  skillsRequired: string[];
  level: "Junior" | "Mid" | "Senior";
  estimatedHours: number;
  rate: number;
  totalCost: number;
  region: string;
  currency: string;
  rateCard: string;
  complexity: "Low" | "Medium" | "High";
  aiConfidence: number;
  milestone: string;
  overridePrice?: number;
  overrideReason?: string;
}

/* ── Mock Data ── */

const initialTaskPricingData: TaskPricing[] = [
  { id: "tp-01", task: "Auth Service with Keycloak", skillsRequired: ["Backend", "Security"], level: "Senior", estimatedHours: 120, rate: 65, totalCost: 7800, region: "South Asia", currency: "USD", rateCard: "Backend Senior — SA", complexity: "High", aiConfidence: 94, milestone: "Infrastructure & Auth" },
  { id: "tp-02", task: "Database Schema Design", skillsRequired: ["Database", "Architecture"], level: "Senior", estimatedHours: 80, rate: 75, totalCost: 6000, region: "South Asia", currency: "USD", rateCard: "Database Senior — SA", complexity: "High", aiConfidence: 91, milestone: "Infrastructure & Auth" },
  { id: "tp-03", task: "Finance Module — GL", skillsRequired: ["Backend", "Finance"], level: "Mid", estimatedHours: 160, rate: 55, totalCost: 8800, region: "South Asia", currency: "USD", rateCard: "Backend Mid — SA", complexity: "High", aiConfidence: 88, milestone: "Finance Module" },
  { id: "tp-04", task: "Frontend Design System", skillsRequired: ["Frontend", "Design"], level: "Mid", estimatedHours: 80, rate: 50, totalCost: 4000, region: "Southeast Asia", currency: "USD", rateCard: "Frontend Mid — SEA", complexity: "Medium", aiConfidence: 95, milestone: "Core UI" },
  { id: "tp-05", task: "Accounts Payable UI", skillsRequired: ["Frontend", "Finance"], level: "Mid", estimatedHours: 120, rate: 45, totalCost: 5400, region: "Middle East", currency: "USD", rateCard: "Frontend Mid — ME", complexity: "Medium", aiConfidence: 93, milestone: "Finance Module" },
  { id: "tp-06", task: "Reporting Engine", skillsRequired: ["Full-Stack", "Data"], level: "Senior", estimatedHours: 160, rate: 70, totalCost: 11200, region: "South Asia", currency: "USD", rateCard: "Full-Stack Senior — SA", complexity: "High", aiConfidence: 86, milestone: "Analytics" },
  { id: "tp-07", task: "Integration Testing Suite", skillsRequired: ["QA", "DevOps"], level: "Mid", estimatedHours: 100, rate: 40, totalCost: 4000, region: "Southeast Asia", currency: "USD", rateCard: "QA Mid — SEA", complexity: "Medium", aiConfidence: 97, milestone: "Quality Assurance" },
  { id: "tp-08", task: "HR Employee Records", skillsRequired: ["Full-Stack", "HR"], level: "Mid", estimatedHours: 100, rate: 50, totalCost: 5000, region: "South Asia", currency: "USD", rateCard: "Full-Stack Mid — SA", complexity: "Medium", aiConfidence: 92, milestone: "HR Module" },
  { id: "tp-09", task: "Payroll Integration", skillsRequired: ["Backend", "Finance", "HR"], level: "Senior", estimatedHours: 140, rate: 60, totalCost: 8400, region: "Middle East", currency: "USD", rateCard: "Backend Senior — ME", complexity: "High", aiConfidence: 84, milestone: "HR Module" },
  { id: "tp-10", task: "Mobile UX Research", skillsRequired: ["UX", "Research"], level: "Junior", estimatedHours: 60, rate: 45, totalCost: 2700, region: "Africa", currency: "USD", rateCard: "UX Junior — AF", complexity: "Low", aiConfidence: 96, milestone: "Core UI" },
];

/* ── Helpers ── */

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function exportPricingCSV(data: TaskPricing[]) {
  const headers = ["Task", "Skills", "Level", "Hours", "Rate ($/hr)", "Total Cost", "Effective Price", "Region", "Currency", "Rate Card", "Complexity", "AI Confidence", "Milestone", "Override Price", "Override Reason"];
  const rows = data.map((t) => [
    t.task,
    t.skillsRequired.join("; "),
    t.level,
    t.estimatedHours,
    t.rate,
    t.totalCost,
    t.overridePrice ?? t.totalCost,
    t.region,
    t.currency,
    t.rateCard,
    t.complexity,
    `${t.aiConfidence}%`,
    t.milestone,
    t.overridePrice ? `$${t.overridePrice}` : "",
    t.overrideReason || "",
  ]);
  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `task-pricing-report-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const complexityConfig: Record<string, { variant: "forest" | "gold" | "brown"; label: string }> = {
  Low: { variant: "forest", label: "Low" },
  Medium: { variant: "gold", label: "Medium" },
  High: { variant: "brown", label: "High" },
};

const levelConfig: Record<string, { color: string }> = {
  Junior: { color: "text-forest-600 bg-forest-50" },
  Mid: { color: "text-teal-600 bg-teal-50" },
  Senior: { color: "text-brown-600 bg-brown-50" },
};

const regionColors: Record<string, string> = {
  "South Asia": "from-teal-500 to-teal-600",
  "Southeast Asia": "from-forest-500 to-forest-600",
  "Middle East": "from-gold-500 to-gold-600",
  Africa: "from-brown-400 to-brown-600",
};

function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 93
      ? "from-forest-500 to-teal-500"
      : value >= 88
        ? "from-teal-500 to-teal-400"
        : "from-gold-500 to-gold-400";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-beige-100 overflow-hidden">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r", color)}
          style={{ width: `${value}%` }}
        />
      </div>
      <span
        className={cn(
          "text-[11px] font-bold tabular-nums",
          value >= 93 ? "text-forest-600" : value >= 88 ? "text-teal-600" : "text-gold-600"
        )}
      >
        {value}%
      </span>
    </div>
  );
}

/* ── Pricing Detail Dialog ── */

function PricingDetailDialog({
  task,
  open,
  onOpenChange,
  onSave,
}: {
  task: TaskPricing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: TaskPricing) => void;
}) {
  const [hours, setHours] = React.useState(0);
  const [overrideEnabled, setOverrideEnabled] = React.useState(false);
  const [overridePrice, setOverridePrice] = React.useState("");
  const [overrideReason, setOverrideReason] = React.useState("");

  React.useEffect(() => {
    if (open && task) {
      setHours(task.estimatedHours);
      setOverrideEnabled(!!task.overridePrice);
      setOverridePrice(task.overridePrice?.toString() || "");
      setOverrideReason(task.overrideReason || "");
    }
  }, [open, task]);

  if (!task) return null;

  const calculatedTotal = hours * task.rate;
  const effectiveTotal = overrideEnabled && overridePrice ? Number(overridePrice) : calculatedTotal;
  const priceUnreasonable = overrideEnabled && overridePrice && (Number(overridePrice) <= 0 || Number(overridePrice) > 100000);

  const complexity = complexityConfig[task.complexity];
  const rColor = regionColors[task.region] || "from-beige-400 to-beige-500";

  const handleSave = () => {
    if (overrideEnabled && (!overridePrice || Number(overridePrice) <= 0)) {
      toast.error("Override Price Required", "Please enter a valid override amount or disable the override toggle.");
      return;
    }
    if (overrideEnabled && !overrideReason.trim()) {
      toast.error("Reason Required", "Override changes are audited. Please provide a reason for the price override.");
      return;
    }
    const updated: TaskPricing = {
      ...task,
      estimatedHours: hours,
      totalCost: calculatedTotal,
      overridePrice: overrideEnabled && overridePrice ? Number(overridePrice) : undefined,
      overrideReason: overrideEnabled ? overrideReason : undefined,
    };
    onSave(updated);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brown-500 to-gold-500 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <span className="block text-[15px]">{task.task}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={complexity.variant} size="sm" dot>{complexity.label}</Badge>
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-md", levelConfig[task.level].color)}>{task.level}</span>
                <span className="text-[10px] text-beige-500">· {task.milestone}</span>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Review pricing calculation, adjust effort hours, or override the AI-calculated price.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">

          {/* Rate card applied */}
          <div className="rounded-xl border border-beige-200/60 bg-beige-50/40 p-4">
            <p className="text-[10px] font-bold text-beige-500 uppercase tracking-wider mb-2">Rate Card Applied</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("w-2.5 h-2.5 rounded-full bg-gradient-to-br", rColor)} />
                <Link
                  href="/enterprise/billing/rate-cards"
                  className="text-[13px] font-semibold text-brown-900 hover:text-teal-700 transition-colors inline-flex items-center gap-1.5 group"
                  onClick={(e) => e.stopPropagation()}
                >
                  {task.rateCard}
                  <ExternalLink className="w-3 h-3 text-beige-400 group-hover:text-teal-500 transition-colors" />
                </Link>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-beige-600">
                <span>{task.region}</span>
                <span className="font-semibold text-brown-700">{task.currency}</span>
              </div>
            </div>
          </div>

          {/* Price calculation */}
          <div className="rounded-xl border border-beige-200/60 bg-white p-4 space-y-3">
            <p className="text-[10px] font-bold text-beige-500 uppercase tracking-wider">Price Calculation</p>

            <div className="flex items-center justify-between">
              <span className="text-[12px] text-beige-600">Rate</span>
              <span className="text-[14px] font-bold text-brown-900 tabular-nums">${task.rate}/hr</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[12px] text-beige-600">Effort (hours)</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(Math.max(1, Number(e.target.value)))}
                  className="w-20 h-8 text-right text-[13px] font-bold"
                  min={1}
                />
                {hours !== task.estimatedHours && (
                  <span className="text-[10px] text-gold-600 font-medium">
                    was {task.estimatedHours}h
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-beige-200/60 pt-3 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-brown-800">= Calculated Total</span>
              <span className="text-[16px] font-bold text-brown-900 tabular-nums">{formatCurrency(calculatedTotal)}</span>
            </div>
          </div>

          {/* Override section */}
          <div className={cn(
            "rounded-xl border p-4 space-y-3 transition-colors",
            overrideEnabled ? "border-gold-200 bg-gold-50/30" : "border-beige-200/60 bg-beige-50/30"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="w-3.5 h-3.5 text-beige-500" />
                <span className="text-[12px] font-semibold text-brown-800">Override Calculated Price</span>
              </div>
              <button
                role="switch"
                aria-checked={overrideEnabled}
                onClick={() => setOverrideEnabled(!overrideEnabled)}
                className={cn(
                  "w-9 h-5 rounded-full transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-500 focus-visible:ring-offset-2",
                  overrideEnabled ? "bg-gold-500" : "bg-beige-300"
                )}
                aria-label="Override calculated price"
              >
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform",
                  overrideEnabled ? "translate-x-4" : "translate-x-0.5"
                )} />
              </button>
            </div>

            {overrideEnabled && (
              <>
                <div>
                  <label className="text-[11px] text-beige-500 font-medium mb-1 block">Override Amount (USD)</label>
                  <Input
                    type="number"
                    value={overridePrice}
                    onChange={(e) => setOverridePrice(e.target.value)}
                    placeholder="Enter override amount"
                    className="h-9"
                    min={0}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-beige-500 font-medium mb-1 block">
                    Reason for Override <span className="text-brown-500">*</span>
                  </label>
                  <textarea
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="Explain why the calculated price is being overridden..."
                    className="w-full rounded-lg border border-beige-200 bg-white px-3 py-2 text-[12px] text-brown-900 placeholder:text-beige-400 focus:border-brown-300 focus:ring-1 focus:ring-brown-200 focus:outline-none resize-none"
                    rows={2}
                  />
                </div>
                {priceUnreasonable && (
                  <div className="flex items-center gap-2 text-[11px] text-gold-700 bg-gold-100/50 rounded-lg px-3 py-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {Number(overridePrice) <= 0
                      ? "Override price must be greater than $0."
                      : `Override price exceeds $100,000. The calculated price is ${formatCurrency(calculatedTotal)} — please verify this override is intentional.`}
                  </div>
                )}
              </>
            )}
          </div>

          {/* AI Confidence */}
          <div className="flex items-center justify-between px-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-[11px] text-beige-500 inline-flex items-center gap-1 cursor-help">
                    AI Confidence
                    <Info className="w-3 h-3" />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-[240px]">
                  <p className="text-[11px] leading-relaxed">
                    How confident the pricing engine is in this estimate. Factors: historical delivery data, skill availability, regional market rates, and task complexity.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <ConfidenceBar value={task.aiConfidence} />
          </div>

          {/* Effective total */}
          <div className="rounded-xl bg-gradient-to-r from-brown-50 to-beige-50 border border-brown-100/60 p-4 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-brown-800">Effective Price</span>
            <div className="text-right">
              <p className="text-[18px] font-bold text-brown-900 tabular-nums">{formatCurrency(effectiveTotal)}</p>
              {overrideEnabled && overridePrice && (
                <p className="text-[10px] text-gold-600 font-medium">Overridden from {formatCurrency(calculatedTotal)}</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="gradient-primary" size="sm" onClick={handleSave}>
            <Check className="w-3.5 h-3.5" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ═══════════════════════════════
   TASK PRICING PAGE (G2)
   ═══════════════════════════════ */
export default function TaskPricingPage() {
  const [tasks, setTasks] = React.useState<TaskPricing[]>(initialTaskPricingData);
  const [search, setSearch] = React.useState("");
  const [complexityFilter, setComplexityFilter] = React.useState("all");
  const [regionFilter, setRegionFilter] = React.useState("all");
  const [levelFilter, setLevelFilter] = React.useState("all");
  const [milestoneFilter, setMilestoneFilter] = React.useState("all");
  const [selectedTask, setSelectedTask] = React.useState<TaskPricing | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  /* Unique values for filters */
  const regions = React.useMemo(() => [...new Set(tasks.map((t) => t.region))].sort(), [tasks]);
  const milestones = React.useMemo(() => [...new Set(tasks.map((t) => t.milestone))].sort(), [tasks]);

  /* Filtered tasks */
  const filtered = React.useMemo(() => {
    return tasks.filter((t) => {
      const q = search.toLowerCase();
      if (q && !t.task.toLowerCase().includes(q) && !t.skillsRequired.some((s) => s.toLowerCase().includes(q)) && !t.rateCard.toLowerCase().includes(q)) return false;
      if (complexityFilter !== "all" && t.complexity !== complexityFilter) return false;
      if (regionFilter !== "all" && t.region !== regionFilter) return false;
      if (levelFilter !== "all" && t.level !== levelFilter) return false;
      if (milestoneFilter !== "all" && t.milestone !== milestoneFilter) return false;
      return true;
    });
  }, [tasks, search, complexityFilter, regionFilter, levelFilter, milestoneFilter]);

  /* Dynamic stats — reactive to edits */
  const totalProjectCost = React.useMemo(() => tasks.reduce((sum, t) => sum + (t.overridePrice ?? t.totalCost), 0), [tasks]);
  const avgTaskCost = React.useMemo(() => Math.round(totalProjectCost / tasks.length), [totalProjectCost, tasks.length]);
  const totalHours = React.useMemo(() => tasks.reduce((sum, t) => sum + t.estimatedHours, 0), [tasks]);

  /* Cost by skill */
  const costBySkill = React.useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach((t) => {
      const cost = t.overridePrice ?? t.totalCost;
      t.skillsRequired.forEach((s) => {
        map[s] = (map[s] || 0) + Math.round(cost / t.skillsRequired.length);
      });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [tasks]);
  const maxSkillCost = costBySkill[0]?.[1] || 1;

  /* Cost by region */
  const costByRegion = React.useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach((t) => {
      map[t.region] = (map[t.region] || 0) + (t.overridePrice ?? t.totalCost);
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [tasks]);

  /* Cost by milestone */
  const costByMilestone = React.useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach((t) => {
      map[t.milestone] = (map[t.milestone] || 0) + (t.overridePrice ?? t.totalCost);
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [tasks]);

  /* Handlers */
  const handleSaveTask = (updated: TaskPricing) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    if (updated.overridePrice) {
      toast.success("Price Overridden", `${updated.task} — effective price: ${formatCurrency(updated.overridePrice)}`);
    } else {
      toast.success("Pricing Updated", `${updated.task} — ${updated.estimatedHours}h × $${updated.rate}/hr = ${formatCurrency(updated.totalCost)}`);
    }
  };

  const handleExport = () => {
    exportPricingCSV(tasks);
    toast.success("Report Exported", `Task pricing report exported as CSV (${tasks.length} tasks).`);
  };

  const clearFilters = () => {
    setSearch("");
    setComplexityFilter("all");
    setRegionFilter("all");
    setLevelFilter("all");
    setMilestoneFilter("all");
  };

  const hasFilters = search || complexityFilter !== "all" || regionFilter !== "all" || levelFilter !== "all" || milestoneFilter !== "all";

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-6"
    >
      {/* Page Header + Export */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brown-500 to-gold-500 flex items-center justify-center shadow-md shadow-brown-500/20">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brown-900 tracking-tight font-heading">
              Task Pricing
            </h1>
            <p className="text-sm text-beige-600">
              AI-driven pricing intelligence with regional rates and skill-based cost analysis.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </motion.div>

      {/* AI Pricing Callout — compact */}
      <motion.div
        variants={fadeUp}
        className="rounded-xl border border-beige-200/50 bg-gradient-to-r from-brown-50 via-beige-50 to-teal-50 backdrop-blur-sm px-4 py-3 flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-forest-500 flex items-center justify-center shrink-0">
          <Cpu className="w-4 h-4 text-white" />
        </div>
        <p className="text-[12px] text-beige-600 flex-1 min-w-0">
          <span className="font-semibold text-brown-900">Task Pricing Intelligence Engine</span>
          {" · "}Prices factor in skill requirements, complexity, regional rates, and delivery data. Click any row to adjust.
        </p>
        <Badge variant="gradient-forest" size="sm" className="shrink-0">
          <Sparkles className="w-3 h-3" />
          AI-Powered
        </Badge>
      </motion.div>

      {/* Summary Stats Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-brown-50 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5 text-brown-500" />
            </div>
            <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">Total Project Cost</span>
          </div>
          <p className="text-2xl font-bold text-brown-900 tracking-tight">{formatCurrency(totalProjectCost)}</p>
          <div className="flex items-center gap-1 mt-1">
            <Layers className="w-3 h-3 text-forest-500" />
            <span className="text-[10px] font-medium text-forest-600">{tasks.length} tasks · Within budget</span>
          </div>
        </div>
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-teal-500" />
            </div>
            <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">Avg Task Cost</span>
          </div>
          <p className="text-2xl font-bold text-brown-900 tracking-tight">{formatCurrency(avgTaskCost)}</p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowDownRight className="w-3 h-3 text-forest-600" />
            <span className="text-[10px] font-medium text-forest-600">15% below market avg</span>
          </div>
        </div>
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-forest-50 flex items-center justify-center">
              <Hash className="w-3.5 h-3.5 text-forest-500" />
            </div>
            <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">Total Hours</span>
          </div>
          <p className="text-2xl font-bold text-brown-900 tracking-tight">{totalHours.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1">
            <Cpu className="w-3 h-3 text-teal-600" />
            <span className="text-[10px] font-medium text-teal-600">AI-estimated effort</span>
          </div>
        </div>
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-gold-50 flex items-center justify-center">
              <Globe2 className="w-3.5 h-3.5 text-gold-600" />
            </div>
            <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">Regions</span>
          </div>
          <p className="text-2xl font-bold text-brown-900 tracking-tight">{regions.length}</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingDown className="w-3 h-3 text-forest-600" />
            <span className="text-[10px] font-medium text-forest-600">Rates vary by region</span>
          </div>
        </div>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-beige-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks, skills, rate cards..."
            className="pl-9 h-9 text-[12px]"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={complexityFilter} onValueChange={setComplexityFilter}>
            <SelectTrigger className="w-[150px] h-9 text-[12px]">
              <SelectValue placeholder="Complexity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Complexity</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-[140px] h-9 text-[12px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[120px] h-9 text-[12px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Junior">Junior</SelectItem>
              <SelectItem value="Mid">Mid</SelectItem>
              <SelectItem value="Senior">Senior</SelectItem>
            </SelectContent>
          </Select>
          <Select value={milestoneFilter} onValueChange={setMilestoneFilter}>
            <SelectTrigger className="w-[170px] h-9 text-[12px]">
              <SelectValue placeholder="Milestone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Milestones</SelectItem>
              {milestones.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-beige-600 hover:text-brown-700 hover:bg-beige-100 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* Pricing Table Header */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-500" />
            <h2 className="text-[14px] font-semibold text-brown-800">Task Pricing Breakdown</h2>
            <Badge variant="beige" size="sm">{filtered.length} tasks</Badge>
            {tasks.filter((t) => t.overridePrice).length > 0 && (
              <Badge variant="gold" size="sm">{tasks.filter((t) => t.overridePrice).length} overridden</Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-500" />
            <span className="text-[10px] font-medium text-forest-600">AI verified</span>
          </div>
        </div>

        {/* Column Labels */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-3 px-5 py-2.5 text-[10px] font-semibold text-beige-500 uppercase tracking-wider bg-beige-50/40 rounded-t-xl border border-b-0 border-beige-200/50">
          <div className="col-span-3">Task</div>
          <div className="col-span-2">Skills / Level</div>
          <div className="col-span-1 text-right">Hours</div>
          <div className="col-span-1 text-right">Rate</div>
          <div className="col-span-1 text-right">Total</div>
          <div className="col-span-2">Region / Rate Card</div>
          <div className="col-span-2 text-right">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 cursor-help">
                    AI Confidence
                    <Info className="w-3 h-3" />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-[220px]">
                  <p className="text-[11px] leading-relaxed">
                    Pricing engine confidence based on historical data, skill availability, and regional rates.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </motion.div>

      {/* Pricing Rows */}
      <motion.div variants={stagger} className="space-y-2">
        {filtered.length === 0 ? (
          <motion.div variants={fadeUp} className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-10 text-center">
            <Search className="w-8 h-8 text-beige-300 mx-auto mb-3" />
            <p className="text-[14px] font-semibold text-brown-800">No tasks match your filters</p>
            <p className="text-[12px] text-beige-500 mt-1">Try adjusting your search or filter criteria.</p>
            <button onClick={clearFilters} className="mt-3 text-[12px] font-medium text-teal-600 hover:text-teal-700">
              Clear all filters
            </button>
          </motion.div>
        ) : (
          filtered.map((item) => {
            const complexity = complexityConfig[item.complexity];
            const rColor = regionColors[item.region] || "from-beige-400 to-beige-500";
            const effectiveTotal = item.overridePrice ?? item.totalCost;
            const isOverridden = !!item.overridePrice;

            return (
              <motion.div
                key={item.id}
                variants={scaleIn}
                role="button"
                tabIndex={0}
                onClick={() => { setSelectedTask(item); setDetailOpen(true); }}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedTask(item); setDetailOpen(true); } }}
                className="group rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm px-5 py-4 hover:shadow-lg hover:shadow-brown-100/15 hover:border-beige-300/60 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-500 focus-visible:ring-offset-2 focus-visible:rounded-2xl"
              >
                {/* Desktop row */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-3 items-center">
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-beige-100 to-beige-200/60 flex items-center justify-center group-hover:from-brown-50 group-hover:to-beige-100 transition-colors">
                      <DollarSign className="w-4 h-4 text-brown-500" />
                    </div>
                    <div>
                      <span className="text-[13px] font-semibold text-brown-900 block group-hover:text-brown-700 transition-colors">{item.task}</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant={complexity.variant} size="sm" dot>{complexity.label}</Badge>
                        {isOverridden && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-gold-100 text-gold-700">Overridden</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex flex-wrap gap-1">
                      {item.skillsRequired.map((s) => (
                        <span key={s} className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-beige-100 text-beige-700">{s}</span>
                      ))}
                    </div>
                    <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded mt-1 inline-block", levelConfig[item.level].color)}>
                      {item.level}
                    </span>
                  </div>
                  <div className="col-span-1 text-right">
                    <span className="text-[13px] font-bold text-brown-900 tabular-nums">{item.estimatedHours}h</span>
                  </div>
                  <div className="col-span-1 text-right">
                    <span className="text-[13px] font-medium text-beige-600 tabular-nums">${item.rate}/hr</span>
                    <p className="text-[9px] text-beige-400 mt-0.5">{item.currency}</p>
                  </div>
                  <div className="col-span-1 text-right">
                    <span className={cn("text-[14px] font-bold tabular-nums", isOverridden ? "text-gold-700" : "text-brown-900")}>
                      {formatCurrency(effectiveTotal)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-1.5">
                      <div className={cn("w-2 h-2 rounded-full bg-gradient-to-br", rColor)} />
                      <span className="text-[11px] font-medium text-brown-700">{item.region}</span>
                    </div>
                    <p className="text-[9px] text-beige-500 mt-0.5 truncate">{item.rateCard}</p>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <ConfidenceBar value={item.aiConfidence} />
                  </div>
                </div>

                {/* Mobile layout */}
                <div className="lg:hidden space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-beige-100 to-beige-200/60 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-brown-500" />
                      </div>
                      <div>
                        <span className="text-[13px] font-semibold text-brown-900 block">{item.task}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant={complexity.variant} size="sm" dot>{complexity.label}</Badge>
                          <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded", levelConfig[item.level].color)}>
                            {item.level}
                          </span>
                          <div className="flex items-center gap-1">
                            <div className={cn("w-2 h-2 rounded-full bg-gradient-to-br", rColor)} />
                            <span className="text-[10px] text-beige-500">{item.region}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.skillsRequired.map((s) => (
                      <span key={s} className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-beige-100 text-beige-700">{s}</span>
                    ))}
                  </div>
                  <div className="text-[9px] text-beige-500 truncate">Rate Card: {item.rateCard} · {item.currency}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-beige-100/60">
                    <div>
                      <p className="text-[10px] text-beige-500 uppercase tracking-wider mb-0.5">Hours</p>
                      <p className="text-[13px] font-bold text-brown-900">{item.estimatedHours}h</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-beige-500 uppercase tracking-wider mb-0.5">Rate</p>
                      <p className="text-[13px] font-medium text-beige-600">${item.rate}/hr</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-beige-500 uppercase tracking-wider mb-0.5">Total</p>
                      <p className={cn("text-[14px] font-bold", isOverridden ? "text-gold-700" : "text-brown-900")}>{formatCurrency(effectiveTotal)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-beige-500 uppercase tracking-wider mb-0.5">Confidence</p>
                      <ConfidenceBar value={item.aiConfidence} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>

      {/* Summary Cards: Milestone + Skill + Region */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Cost by Milestone */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-brown-500" />
            <h3 className="text-[14px] font-semibold text-brown-800">Cost by Milestone</h3>
          </div>
          <div className="space-y-3">
            {costByMilestone.map(([milestone, cost]) => {
              const pct = Math.round((cost / totalProjectCost) * 100);
              const isFiltered = milestoneFilter === milestone;
              return (
                <div key={milestone} className="flex items-center gap-3">
                  <button
                    onClick={() => setMilestoneFilter(isFiltered ? "all" : milestone)}
                    className={cn(
                      "text-[11px] font-medium w-28 shrink-0 truncate text-left transition-colors",
                      isFiltered ? "text-brown-900 font-semibold" : "text-brown-700 hover:text-teal-700"
                    )}
                    title={`${isFiltered ? "Clear filter" : "Filter by"}: ${milestone}`}
                  >{milestone}</button>
                  <div className="flex-1 h-2 rounded-full bg-beige-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brown-400 to-brown-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-brown-900 tabular-nums w-14 text-right">
                    {formatCurrency(cost)}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Cost by Skill */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-teal-500" />
            <h3 className="text-[14px] font-semibold text-brown-800">Cost by Skill</h3>
          </div>
          <div className="space-y-3">
            {costBySkill.map(([skill, cost]) => (
              <div key={skill} className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-brown-700 w-20 shrink-0">{skill}</span>
                <div className="flex-1 h-2 rounded-full bg-beige-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-forest-500"
                    style={{ width: `${(cost / maxSkillCost) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-brown-900 tabular-nums w-14 text-right">
                  {formatCurrency(cost)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cost by Region */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Globe2 className="w-4 h-4 text-gold-500" />
            <h3 className="text-[14px] font-semibold text-brown-800">Cost by Region</h3>
          </div>
          <div className="space-y-3">
            {costByRegion.map(([region, cost]) => {
              const rColor = regionColors[region] || "from-beige-400 to-beige-500";
              const pct = Math.round((cost / totalProjectCost) * 100);
              return (
                <div key={region} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-28 shrink-0">
                    <div className={cn("w-3 h-3 rounded-full bg-gradient-to-br", rColor)} />
                    <span className="text-[11px] font-medium text-brown-700">{region}</span>
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-beige-100 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full bg-gradient-to-r", rColor)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-right w-16 shrink-0">
                    <span className="text-[11px] font-bold text-brown-900 tabular-nums">{formatCurrency(cost)}</span>
                    <span className="text-[9px] text-beige-500 ml-0.5">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Total */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-beige-200/60">
            <span className="text-[10px] font-semibold text-beige-500 uppercase tracking-wider">Total</span>
            <span className="text-[14px] font-bold text-brown-900">{formatCurrency(totalProjectCost)}</span>
          </div>
        </motion.div>
      </div>

      {/* Pricing Accuracy */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-beige-200/50 bg-gradient-to-r from-white/70 to-beige-50/50 backdrop-blur-sm p-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-brown-800">Pricing Accuracy Score</p>
              <p className="text-[11px] text-beige-500 leading-relaxed">
                How closely AI-estimated prices match actual delivery costs. Calculated from 1,200+ completed tasks across all regions. Scores above 85% indicate high pricing reliability.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:block w-48">
              <div className="h-2 rounded-full bg-beige-200 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-forest-500 to-teal-500" style={{ width: "92%" }} />
              </div>
            </div>
            <span className="text-xl font-bold text-brown-900">
              92<span className="text-[12px] text-beige-500 ml-0.5">%</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Pricing Detail Dialog */}
      <PricingDetailDialog
        task={selectedTask}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onSave={handleSaveTask}
      />
    </motion.div>
  );
}
