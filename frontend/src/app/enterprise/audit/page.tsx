"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  Shield,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  PenSquare,
  PlusCircle,
  Activity,
  Users,
  Hash,
  Download,
  Archive,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/stores/toast-store";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import { Badge, Button, Input } from "@/components/ui";
import { mockAuditLog } from "@/mocks/data/enterprise-analytics";
import type { AuditEntry } from "@/types/enterprise";

/* ══════════════════════════════════════════
   J1 — Audit Log
   Full timeline with export, filters, table view
   ══════════════════════════════════════════ */

/* ── Action color + icon mapping ── */
const actionStyles: Record<
  string,
  { bg: string; text: string; dot: string; icon: React.ReactNode }
> = {
  created: {
    bg: "bg-forest-50",
    text: "text-forest-700",
    dot: "bg-forest-500",
    icon: <PlusCircle className="w-3.5 h-3.5 text-forest-500" />,
  },
  updated: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    dot: "bg-teal-500",
    icon: <PenSquare className="w-3.5 h-3.5 text-teal-500" />,
  },
  approved: {
    bg: "bg-forest-50",
    text: "text-forest-700",
    dot: "bg-forest-500",
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-forest-500" />,
  },
  rejected: {
    bg: "bg-brown-100",
    text: "text-brown-800",
    dot: "bg-brown-600",
    icon: <XCircle className="w-3.5 h-3.5 text-brown-600" />,
  },
  escalated: {
    bg: "bg-gold-50",
    text: "text-gold-700",
    dot: "bg-gold-500",
    icon: <AlertTriangle className="w-3.5 h-3.5 text-gold-600" />,
  },
  completed: {
    bg: "bg-brown-50",
    text: "text-brown-700",
    dot: "bg-brown-500",
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-brown-500" />,
  },
  archived: {
    bg: "bg-beige-100",
    text: "text-beige-700",
    dot: "bg-beige-500",
    icon: <Archive className="w-3.5 h-3.5 text-beige-500" />,
  },
};

/* ── Role badge mapping ── */
const roleBadge: Record<string, { variant: "brown" | "forest" | "teal" | "gold" | "beige" }> = {
  Owner: { variant: "brown" },
  Admin: { variant: "teal" },
  Manager: { variant: "forest" },
  Viewer: { variant: "beige" },
  System: { variant: "gold" },
};

/* ── Format timestamp ── */
function formatTime(ts: string) {
  const d = new Date(ts);
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
}

/* ── Filter Chip ── */
function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all capitalize",
        active
          ? "bg-brown-500 text-white border-brown-500 shadow-sm"
          : "bg-white/60 text-brown-600 border-beige-200 hover:border-beige-300"
      )}
    >
      {label}
    </button>
  );
}

/* ── Mock CSV export ── */
function exportCSV(entries: AuditEntry[]) {
  const headers = ["Timestamp", "Actor", "Role", "Action", "Resource", "Resource Type", "Details", "IP Address"];
  const rows = entries.map((e) => [
    e.timestamp,
    e.actor,
    e.actorRole,
    e.action,
    e.resource,
    e.resourceType,
    `"${e.details}"`,
    e.ipAddress,
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audit-log-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ══════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════ */
export default function AuditTrailPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [actionFilter, setActionFilter] = React.useState<string | null>(null);
  const [resourceFilter, setResourceFilter] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<"table" | "timeline">("table");

  /* Filter entries */
  const entries = mockAuditLog.filter((entry) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !entry.actor.toLowerCase().includes(q) &&
        !entry.resource.toLowerCase().includes(q) &&
        !entry.details.toLowerCase().includes(q)
      )
        return false;
    }
    if (actionFilter && entry.action !== actionFilter) return false;
    if (resourceFilter && entry.resourceType !== resourceFilter) return false;
    return true;
  });

  /* Summary stats */
  const totalEvents = mockAuditLog.length;
  const criticalActions = mockAuditLog.filter(
    (e) => e.action === "escalated" || e.action === "rejected"
  ).length;
  const uniqueActors = new Set(mockAuditLog.map((e) => e.actor)).size;

  const actionTypes = ["created", "updated", "approved", "escalated", "completed"];
  const resourceTypes = ["project", "billing", "team", "sow", "plan", "config"];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-6"
    >
      {/* Header with Export */}
      <motion.div variants={fadeUp} className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em]">
            Audit Trail
          </h1>
          <p className="text-[13px] text-beige-500 mt-1">
            Complete timeline of all actions, changes, and system events across your organization.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => exportCSV(entries)}
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
          <Button variant="ghost" size="sm" onClick={() => toast.info("Export PDF", "PDF export requires backend integration.")}>
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </Button>
        </div>
      </motion.div>

      {/* ── Summary KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            label: "Total Events (30d)",
            value: totalEvents,
            icon: <Activity className="w-4 h-4 text-brown-500" />,
            bg: "bg-brown-50",
          },
          {
            label: "Critical Actions",
            value: criticalActions,
            icon: <AlertTriangle className="w-4 h-4 text-gold-600" />,
            bg: "bg-gold-50",
          },
          {
            label: "Unique Actors",
            value: uniqueActors,
            icon: <Users className="w-4 h-4 text-forest-500" />,
            bg: "bg-forest-50",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 flex items-center gap-3"
          >
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", stat.bg)}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-medium text-beige-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-[18px] font-bold text-brown-900 tracking-tight capitalize">
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Filters ── */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4"
      >
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search by actor, resource, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all",
                viewMode === "table"
                  ? "bg-teal-500 text-white border-teal-500"
                  : "bg-white/60 text-brown-600 border-beige-200"
              )}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all",
                viewMode === "timeline"
                  ? "bg-teal-500 text-white border-teal-500"
                  : "bg-white/60 text-brown-600 border-beige-200"
              )}
            >
              Timeline
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 mt-3">
          {/* Action filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-semibold text-beige-500 uppercase tracking-wider mr-1">
              Action:
            </span>
            <FilterChip
              label="All"
              active={actionFilter === null}
              onClick={() => setActionFilter(null)}
            />
            {actionTypes.map((a) => (
              <FilterChip
                key={a}
                label={a}
                active={actionFilter === a}
                onClick={() => setActionFilter(actionFilter === a ? null : a)}
              />
            ))}
          </div>

          {/* Resource type filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-semibold text-beige-500 uppercase tracking-wider mr-1">
              Resource:
            </span>
            <FilterChip
              label="All"
              active={resourceFilter === null}
              onClick={() => setResourceFilter(null)}
            />
            {resourceTypes.map((r) => (
              <FilterChip
                key={r}
                label={r}
                active={resourceFilter === r}
                onClick={() => setResourceFilter(resourceFilter === r ? null : r)}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Table View ── */}
      {viewMode === "table" && (
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-hidden"
        >
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 border-b border-beige-100 text-[10px] font-semibold text-beige-500 uppercase tracking-wider">
            <div className="col-span-2">Timestamp</div>
            <div className="col-span-2">Actor</div>
            <div className="col-span-1">Action</div>
            <div className="col-span-3">Resource</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-2">Details</div>
            <div className="col-span-1">IP Address</div>
          </div>

          {/* Table Rows */}
          {entries.map((entry) => {
            const style = actionStyles[entry.action] || actionStyles.updated;
            const rb = roleBadge[entry.actorRole] || roleBadge.Viewer;
            const { date, time } = formatTime(entry.timestamp);

            return (
              <div
                key={entry.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 px-5 py-3.5 border-b border-beige-50 last:border-0 hover:bg-beige-50/40 transition-colors items-center"
              >
                {/* Timestamp */}
                <div className="col-span-2 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-beige-400 shrink-0" />
                  <div>
                    <span className="text-[11px] text-brown-700 block">{date}</span>
                    <span className="text-[10px] text-beige-400">{time}</span>
                  </div>
                </div>

                {/* Actor */}
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brown-300 to-brown-500 flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                    {entry.actor
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium text-brown-800 block truncate">
                      {entry.actor}
                    </span>
                    <Badge variant={rb.variant} size="sm">
                      {entry.actorRole}
                    </Badge>
                  </div>
                </div>

                {/* Action */}
                <div className="col-span-1">
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-md capitalize inline-flex items-center gap-1",
                      style.bg,
                      style.text
                    )}
                  >
                    {style.icon}
                    {entry.action}
                  </span>
                </div>

                {/* Resource */}
                <div className="col-span-3">
                  <span className="text-[11px] text-brown-700 font-medium truncate block">
                    {entry.resource}
                  </span>
                </div>

                {/* Type */}
                <div className="col-span-1">
                  <Badge variant="beige" size="sm">
                    {entry.resourceType}
                  </Badge>
                </div>

                {/* Details */}
                <div className="col-span-2">
                  <span className="text-[10px] text-beige-500 line-clamp-2 leading-relaxed">
                    {entry.details}
                  </span>
                </div>

                {/* IP */}
                <div className="col-span-1">
                  <span className="text-[10px] text-beige-400 font-mono">
                    {entry.ipAddress}
                  </span>
                </div>
              </div>
            );
          })}

          {entries.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-8 h-8 text-beige-300 mx-auto mb-3" />
              <p className="text-[13px] text-beige-500">
                No audit entries match your current filters.
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Timeline View ── */}
      {viewMode === "timeline" && (
        <motion.div variants={fadeUp} className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[23px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-brown-200 via-beige-200 to-beige-100 rounded-full" />

          <div className="space-y-4">
            {entries.map((entry) => {
              const style = actionStyles[entry.action] || actionStyles.updated;
              const { date, time } = formatTime(entry.timestamp);
              const rb = roleBadge[entry.actorRole] || roleBadge.Viewer;

              return (
                <motion.div
                  key={entry.id}
                  variants={fadeUp}
                  className="relative pl-14"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-[15px] top-5 z-10">
                    <div
                      className={cn(
                        "w-[18px] h-[18px] rounded-full border-[2.5px] border-white shadow-sm flex items-center justify-center",
                        style.bg
                      )}
                    >
                      <div className={cn("w-2 h-2 rounded-full", style.dot)} />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 hover:shadow-md transition-all">
                    {/* Header row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brown-300 to-brown-500 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                          {entry.actor
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <span className="text-[12px] font-semibold text-brown-800">
                            {entry.actor}
                          </span>
                          <Badge variant={rb.variant} size="sm" className="ml-2">
                            {entry.actorRole}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-beige-500">
                        <Clock className="w-3 h-3" />
                        <span>{date} at {time}</span>
                      </div>
                    </div>

                    {/* Action + Resource */}
                    <div className="flex items-center gap-2 mb-2">
                      {style.icon}
                      <span
                        className={cn(
                          "text-[11px] font-bold px-2 py-0.5 rounded-md capitalize",
                          style.bg,
                          style.text
                        )}
                      >
                        {entry.action}
                      </span>
                      <span className="text-[12px] text-brown-700 font-medium">
                        {entry.resource}
                      </span>
                    </div>

                    {/* Details */}
                    <p className="text-[11px] text-beige-500 leading-relaxed pl-5">
                      {entry.details}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-beige-100/60 text-[10px] text-beige-400">
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        <span>IP: {entry.ipAddress}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span className="capitalize">{entry.resourceType}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        <span>{entry.id}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {entries.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-8 h-8 text-beige-300 mx-auto mb-3" />
              <p className="text-[13px] text-beige-500">
                No audit entries match your current filters.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
