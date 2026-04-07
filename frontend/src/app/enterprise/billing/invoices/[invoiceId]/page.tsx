"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  Download,
  Send,
  CheckCircle2,
  Clock,
  Building2,
  MapPin,
  Mail,
  Phone,
  FileText,
  Printer,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, slideInRight } from "@/lib/utils/motion-variants";
import { Badge, Button } from "@/components/ui";
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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getProjectTitle(projectId: string): string {
  return mockProjects.find((p) => p.id === projectId)?.title ?? projectId;
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.invoiceId as string;

  const invoice =
    mockInvoices.find((inv) => inv.id === invoiceId) ?? mockInvoices[0];
  const config = statusConfig[invoice.status];

  const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.amount, 0);
  const tax = 0;
  const total = subtotal + tax;
  const balanceDue = total - invoice.paidAmount;

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
          href="/enterprise/billing/invoices"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Invoices
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-beige-400" />
        <span className="text-beige-500">{invoice.number}</span>
      </motion.div>

      {/* Actions bar */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-brown-900 tracking-tight font-heading">
            {invoice.number}
          </h1>
          <Badge variant={config.variant} size="md" dot>
            {config.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {invoice.status === "pending" && (
            <Button variant="gradient-forest" size="sm" onClick={() => toast.success("Payment Recorded", `Invoice ${invoice.number} marked as paid.`)}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark as Paid
            </Button>
          )}
          {invoice.status === "overdue" && (
            <Button variant="gold" size="sm" onClick={() => toast.success("Reminder Sent", `Payment reminder sent for ${invoice.number}.`)}>
              <Send className="w-3.5 h-3.5" />
              Send Reminder
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => toast.info("Download PDF", "PDF download requires backend integration.")}>
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => toast.info("Print Dialog", "Opening print preview...")}>
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Invoice Document */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-beige-200/50 bg-white backdrop-blur-sm shadow-sm overflow-hidden"
      >
        {/* Invoice Header */}
        <div className="bg-gradient-to-r from-brown-50 to-beige-50/50 p-6 sm:p-8 border-b border-beige-200/60">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brown-500 to-brown-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GT</span>
                </div>
                <div>
                  <p className="text-[15px] font-bold text-brown-900 tracking-tight">
                    GlimmoraTeam
                  </p>
                  <p className="text-[11px] text-beige-500">
                    Powered by Baarez Technology Solutions
                  </p>
                </div>
              </div>
              <div className="space-y-1 text-[12px] text-beige-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  <span>Dubai Internet City, Tower B, Suite 4200</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3" />
                  <span>billing@glimmorateam.com</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3" />
                  <span>+971 4 XXX XXXX</span>
                </div>
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="text-right">
              <p className="text-[26px] font-bold text-brown-900 tracking-tight font-heading">
                INVOICE
              </p>
              <p className="text-[14px] font-mono text-brown-700 font-semibold mt-1">
                {invoice.number}
              </p>
              <div className="mt-3 space-y-1 text-[12px]">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-beige-500">Issued:</span>
                  <span className="font-medium text-brown-800">
                    {formatDate(invoice.issuedDate)}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-beige-500">Due:</span>
                  <span
                    className={cn(
                      "font-medium",
                      invoice.status === "overdue"
                        ? "text-[var(--danger)]"
                        : "text-brown-800"
                    )}
                  >
                    {formatDate(invoice.dueDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To / From */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 sm:p-8 border-b border-beige-100/60">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-beige-500 mb-2">
              Bill To
            </p>
            <p className="text-[14px] font-semibold text-brown-900">
              {mockProjects.find((p) => p.id === invoice.projectId)?.client ?? "Client"}
            </p>
            <div className="mt-1.5 space-y-0.5 text-[12px] text-beige-600">
              <p>Accounts Payable Department</p>
              <p>Mumbai, Maharashtra 400001</p>
              <p>India</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-beige-500 mb-2">
              Project
            </p>
            <p className="text-[14px] font-semibold text-brown-900">
              {getProjectTitle(invoice.projectId)}
            </p>
            <div className="mt-1.5 space-y-0.5 text-[12px] text-beige-600">
              {invoice.milestoneId && (
                <p>Milestone: {invoice.milestoneId}</p>
              )}
              <p>Currency: {invoice.currency}</p>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="px-6 sm:px-8 py-6">
          <div className="rounded-xl overflow-hidden border border-beige-100/60">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-beige-50/60 text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Rate</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>

            {/* Line Items */}
            {invoice.lineItems.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-4 px-4 py-3 border-t border-beige-100/60"
              >
                <div className="col-span-6">
                  <p className="text-[13px] text-brown-800">{item.description}</p>
                </div>
                <div className="col-span-2 text-center text-[13px] text-beige-600">
                  {item.quantity}
                </div>
                <div className="col-span-2 text-right text-[13px] text-beige-600 font-mono">
                  {formatCurrency(item.rate)}
                </div>
                <div className="col-span-2 text-right text-[13px] font-semibold text-brown-800 font-mono">
                  {formatCurrency(item.amount)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex items-center justify-between py-2 text-[13px]">
                <span className="text-beige-500">Subtotal</span>
                <span className="font-medium text-brown-800 font-mono">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 text-[13px] border-b border-beige-100/60">
                <span className="text-beige-500">Tax (0%)</span>
                <span className="font-medium text-beige-400 font-mono">
                  {formatCurrency(tax)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 text-[15px]">
                <span className="font-semibold text-brown-900">Total</span>
                <span className="font-bold text-brown-900 font-mono">
                  {formatCurrency(total)}
                </span>
              </div>

              {invoice.paidAmount > 0 && (
                <div className="flex items-center justify-between py-2 text-[13px]">
                  <span className="text-forest-600 font-medium">Amount Paid</span>
                  <span className="font-semibold text-forest-600 font-mono">
                    -{formatCurrency(invoice.paidAmount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between py-3 px-4 -mx-4 rounded-xl bg-gradient-to-r from-brown-50 to-gold-50/50 border border-brown-100/50">
                <span className="font-bold text-brown-900 text-[15px]">
                  Balance Due
                </span>
                <span
                  className={cn(
                    "font-bold text-[18px] font-mono tracking-tight",
                    balanceDue > 0 ? "text-brown-900" : "text-forest-600"
                  )}
                >
                  {formatCurrency(Math.max(balanceDue, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="px-6 sm:px-8 py-5 bg-beige-50/40 border-t border-beige-100/60">
          <div className="flex items-start gap-2">
            <FileText className="w-3.5 h-3.5 text-beige-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-medium text-beige-500 mb-1">Notes</p>
              <p className="text-[12px] text-beige-600 leading-relaxed">
                Payment is due within the terms specified above. Late payments may incur
                additional fees as per the service agreement. Please include the invoice
                number as reference when making payment.
              </p>
            </div>
          </div>

          {invoice.status === "overdue" && (
            <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-[var(--danger-light)] border border-[var(--danger-light)]">
              <AlertTriangle className="w-4 h-4 text-[var(--danger)] shrink-0" />
              <p className="text-[12px] text-[var(--danger-hover)] font-medium">
                This invoice is past due. A reminder will be sent to the billing contact.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
