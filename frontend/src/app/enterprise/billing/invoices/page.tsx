"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Receipt,
  Download,
  Search,
  ChevronRight,
  FileText,
  CircleDollarSign,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import {
  Badge,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui";
import { toast } from "@/lib/stores/toast-store";
import { mockInvoices } from "@/mocks/data/enterprise-billing";
import { mockProjects } from "@/mocks/data/enterprise-projects";

const statusConfig: Record<
  string,
  { variant: "beige" | "gold" | "forest" | "danger" | "brown"; label: string }
> = {
  draft: { variant: "beige", label: "Draft" },
  pending: { variant: "gold", label: "Pending" },
  paid: { variant: "forest", label: "Paid" },
  overdue: { variant: "danger", label: "Overdue" },
  cancelled: { variant: "brown", label: "Cancelled" },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getProjectTitle(projectId: string): string {
  return mockProjects.find((p) => p.id === projectId)?.title ?? projectId;
}

export default function InvoiceListPage() {
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    let list = [...mockInvoices];

    if (statusFilter !== "all") {
      list = list.filter((inv) => inv.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (inv) =>
          inv.number.toLowerCase().includes(q) ||
          getProjectTitle(inv.projectId).toLowerCase().includes(q)
      );
    }

    return list;
  }, [statusFilter, search]);

  const totalInvoiced = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = mockInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const outstanding = totalInvoiced - totalPaid;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-6"
    >
      {/* Breadcrumb */}
      <motion.div variants={fadeUp} className="flex items-center gap-2 text-sm">
        <Link
          href="/enterprise/billing"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Billing
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-beige-400" />
        <span className="text-beige-500">Invoices</span>
      </motion.div>

      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md shadow-teal-500/20">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brown-900 tracking-tight font-heading">
              Invoices
            </h1>
            <p className="text-sm text-beige-600">
              Track and manage all project invoices.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.info("Export CSV", "CSV export requires backend integration.")}
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-3 gap-3"
      >
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
              Total Invoiced
            </span>
          </div>
          <p className="text-2xl font-bold text-brown-900 tracking-tight">
            {formatCurrency(totalInvoiced)}
          </p>
        </div>

        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-forest-50 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
            </div>
            <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
              Total Paid
            </span>
          </div>
          <p className="text-2xl font-bold text-brown-900 tracking-tight">
            {formatCurrency(totalPaid)}
          </p>
        </div>

        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-gold-50 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-gold-600" />
            </div>
            <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
              Outstanding
            </span>
          </div>
          <p className="text-2xl font-bold text-brown-900 tracking-tight">
            {formatCurrency(outstanding)}
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
      >
        <div className="w-full sm:w-40">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 text-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 w-full sm:w-auto">
          <Input
            icon={<Search className="w-4 h-4" />}
            placeholder="Search by invoice number or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10"
          />
        </div>
      </motion.div>

      {/* Invoice Table */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-beige-200/50 bg-white/60 backdrop-blur-sm overflow-hidden"
      >
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-beige-100 text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
          <div className="col-span-2">Invoice #</div>
          <div className="col-span-3">Project</div>
          <div className="col-span-1 text-right">Amount</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-center">Issued</div>
          <div className="col-span-1 text-center">Due</div>
          <div className="col-span-2 text-right">Paid</div>
          <div className="col-span-1" />
        </div>

        {/* Rows */}
        {filtered.map((invoice) => {
          const config = statusConfig[invoice.status];

          return (
            <Link
              key={invoice.id}
              href={`/enterprise/billing/invoices/${invoice.id}`}
              className="block group"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-3.5 border-b border-beige-100/60 last:border-b-0 hover:bg-beige-50/40 transition-colors">
                {/* Invoice # */}
                <div className="col-span-2 flex items-center">
                  <span className="text-[13px] font-semibold text-brown-800 font-mono">
                    {invoice.number}
                  </span>
                </div>

                {/* Project */}
                <div className="col-span-3 flex items-center min-w-0">
                  <p className="text-[12px] text-beige-600 truncate">
                    {getProjectTitle(invoice.projectId)}
                  </p>
                </div>

                {/* Amount */}
                <div className="col-span-1 flex items-center justify-end">
                  <span className="text-[13px] font-bold text-brown-900">
                    {formatCurrency(invoice.amount)}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-1 flex items-center justify-center">
                  <Badge variant={config.variant} size="sm" dot>
                    {config.label}
                  </Badge>
                </div>

                {/* Issued */}
                <div className="col-span-1 hidden md:flex items-center justify-center">
                  <span className="text-[11px] text-beige-500">
                    {formatDate(invoice.issuedDate)}
                  </span>
                </div>

                {/* Due */}
                <div className="col-span-1 hidden md:flex items-center justify-center">
                  <span
                    className={cn(
                      "text-[11px]",
                      invoice.status === "overdue"
                        ? "text-[var(--danger)] font-semibold"
                        : "text-beige-500"
                    )}
                  >
                    {formatDate(invoice.dueDate)}
                  </span>
                </div>

                {/* Paid */}
                <div className="col-span-2 hidden md:flex items-center justify-end gap-2">
                  <span
                    className={cn(
                      "text-[12px] font-medium",
                      invoice.paidAmount > 0
                        ? "text-forest-600"
                        : "text-beige-400"
                    )}
                  >
                    {invoice.paidAmount > 0
                      ? formatCurrency(invoice.paidAmount)
                      : "--"}
                  </span>
                  {invoice.paidAmount > 0 &&
                    invoice.paidAmount < invoice.amount && (
                      <span className="text-[9px] bg-gold-100 text-gold-700 px-1.5 py-0.5 rounded-full font-bold">
                        Partial
                      </span>
                    )}
                </div>

                {/* Arrow */}
                <div className="col-span-1 hidden md:flex items-center justify-end">
                  <ChevronRight className="w-3.5 h-3.5 text-beige-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Receipt className="w-8 h-8 text-beige-300 mb-2" />
            <p className="text-sm text-beige-500">No invoices found</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
