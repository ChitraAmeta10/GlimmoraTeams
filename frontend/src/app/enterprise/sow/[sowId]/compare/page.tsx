"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  GitCompare,
  Plus,
  Minus,
  ArrowRight,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, fadeIn } from "@/lib/utils/motion-variants";
import {
  Badge,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui";
import { mockSOWs } from "@/mocks/data/enterprise-sow";

/* ── Inline mock diff data ── */
const mockDiffs = [
  {
    id: "diff-001",
    section: "Project Scope",
    type: "modified" as const,
    oldText:
      "The platform will cover 4 core modules: Financial Management, Human Resources, Inventory, and Reporting.",
    newText:
      "The platform will cover 5 core modules: Financial Management, Human Resources, Inventory, CRM, and Reporting. Each module will integrate via event-driven microservice architecture.",
    additions: 2,
    removals: 1,
  },
  {
    id: "diff-002",
    section: "Timeline & Milestones",
    type: "modified" as const,
    oldText:
      "Phase 1 (Month 1-2): Core infrastructure. Phase 2 (Month 3-4): Finance + HR modules. Phase 3 (Month 5): Reporting.",
    newText:
      "Phase 1 (Month 1-2): Core infrastructure + Auth. Phase 2 (Month 3-4): Finance + HR modules. Phase 3 (Month 5-6): Reporting + Integration testing.",
    additions: 3,
    removals: 2,
  },
  {
    id: "diff-003",
    section: "Budget Breakdown",
    type: "modified" as const,
    oldText:
      "Total budget: $245,000. Development: $185,000. Infrastructure: $30,000. QA: $20,000. PM: $10,000.",
    newText:
      "Total budget: $285,000. Development: $210,000. Infrastructure: $35,000. QA: $25,000. Project management: $15,000.",
    additions: 5,
    removals: 5,
  },
  {
    id: "diff-004",
    section: "Risk Assessment",
    type: "added" as const,
    oldText: "",
    newText:
      "Key risks: Legacy data migration complexity, third-party API dependencies, regulatory compliance for financial data. Mitigation: parallel running period for data migration, API abstraction layer, early compliance audit.",
    additions: 4,
    removals: 0,
  },
];

const summaryStats = {
  sectionsChanged: 4,
  linesAdded: 14,
  linesRemoved: 8,
  aiSuggestionsAccepted: 3,
};

export default function SOWComparePage() {
  const params = useParams();
  const sowId = params.sowId as string;
  const sow = mockSOWs.find((s) => s.id === sowId) || mockSOWs[0];

  const [leftVersion, setLeftVersion] = React.useState("v2");
  const [rightVersion, setRightVersion] = React.useState("v3");

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-5"
    >
      {/* Back Link */}
      <motion.div variants={fadeUp}>
        <Link
          href={`/enterprise/sow/${sow.id}`}
          className="inline-flex items-center gap-2 text-sm text-beige-600 hover:text-brown-700 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to {sow.title}
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-xl font-bold text-brown-900 tracking-tight font-heading flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-teal-500" />
            Version Comparison
          </h1>
          <p className="text-sm text-beige-600 mt-1">
            Compare changes between SOW versions for {sow.title}
          </p>
        </div>

        {/* Version Selectors + Export */}
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-beige-200 text-beige-600 text-[12px] font-medium hover:border-brown-300 hover:text-brown-600 transition-colors">
            <FileText className="w-3.5 h-3.5" />
            Export PDF
          </button>
          <Select value={leftVersion} onValueChange={setLeftVersion}>
            <SelectTrigger className="w-24 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="v1">v1</SelectItem>
              <SelectItem value="v2">v2</SelectItem>
            </SelectContent>
          </Select>
          <ArrowRight className="w-4 h-4 text-beige-400 shrink-0" />
          <Select value={rightVersion} onValueChange={setRightVersion}>
            <SelectTrigger className="w-24 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="v2">v2</SelectItem>
              <SelectItem value="v3">v3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          {
            label: "Sections Changed",
            value: summaryStats.sectionsChanged,
            icon: FileText,
            accent: "text-brown-600",
            bg: "bg-brown-50",
          },
          {
            label: "Lines Added",
            value: `+${summaryStats.linesAdded}`,
            icon: Plus,
            accent: "text-forest-600",
            bg: "bg-forest-50",
          },
          {
            label: "Lines Removed",
            value: `-${summaryStats.linesRemoved}`,
            icon: Minus,
            accent: "text-brown-500",
            bg: "bg-brown-50",
          },
          {
            label: "AI Suggestions Accepted",
            value: summaryStats.aiSuggestionsAccepted,
            icon: Sparkles,
            accent: "text-teal-600",
            bg: "bg-teal-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center",
                  stat.bg
                )}
              >
                <stat.icon className={cn("w-3.5 h-3.5", stat.accent)} />
              </div>
              <span className="text-[10px] font-semibold text-beige-500 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <p
              className={cn(
                "text-2xl font-bold tracking-tight",
                stat.label === "Lines Added"
                  ? "text-forest-700"
                  : stat.label === "Lines Removed"
                  ? "text-brown-500"
                  : "text-brown-900"
              )}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Diff Sections */}
      <motion.div variants={stagger} className="space-y-4">
        {mockDiffs.map((diff) => (
          <motion.div
            key={diff.id}
            variants={fadeUp}
            className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-hidden"
          >
            {/* Diff Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-beige-100 bg-beige-50/40">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-beige-400" />
                <h3 className="text-[13px] font-semibold text-brown-900">
                  {diff.section}
                </h3>
                <Badge
                  variant={diff.type === "added" ? "forest" : "gold"}
                  size="sm"
                >
                  {diff.type === "added" ? "Added" : "Modified"}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-forest-600 font-semibold">
                  +{diff.additions}
                </span>
                {diff.removals > 0 && (
                  <span className="text-brown-500 font-semibold">
                    -{diff.removals}
                  </span>
                )}
              </div>
            </div>

            {/* Side-by-Side Diff */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-beige-100">
              {/* Previous Version */}
              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] font-bold text-beige-500 uppercase tracking-wider">
                    Previous Version
                  </span>
                  <span className="text-[10px] text-beige-400">
                    ({leftVersion})
                  </span>
                </div>
                {diff.oldText ? (
                  <div className="rounded-lg bg-brown-50/50 border border-brown-100/50 p-3">
                    <p className="text-[12px] text-brown-700 leading-relaxed">
                      {diff.oldText.split(". ").map((sentence, i, arr) => (
                        <React.Fragment key={i}>
                          {diff.type === "modified" && i < diff.removals ? (
                            <span className="bg-brown-100/70 text-brown-800 px-0.5 rounded">
                              {sentence}
                              {i < arr.length - 1 ? ". " : ""}
                            </span>
                          ) : (
                            <span>
                              {sentence}
                              {i < arr.length - 1 ? ". " : ""}
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg bg-beige-50 border border-beige-100 p-3 text-center">
                    <p className="text-[12px] text-beige-400 italic">
                      Section did not exist in previous version
                    </p>
                  </div>
                )}
              </div>

              {/* Current Version */}
              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] font-bold text-beige-500 uppercase tracking-wider">
                    Current Version
                  </span>
                  <span className="text-[10px] text-beige-400">
                    ({rightVersion})
                  </span>
                </div>
                <div className="rounded-lg bg-forest-50/40 border border-forest-100/50 p-3">
                  <p className="text-[12px] text-brown-700 leading-relaxed">
                    {diff.newText.split(". ").map((sentence, i, arr) => (
                      <React.Fragment key={i}>
                        {i >= (arr.length - diff.additions) ? (
                          <span className="bg-forest-100/70 text-forest-800 px-0.5 rounded">
                            {sentence}
                            {i < arr.length - 1 ? ". " : ""}
                          </span>
                        ) : (
                          <span>
                            {sentence}
                            {i < arr.length - 1 ? ". " : ""}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Summary */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl bg-gradient-to-r from-teal-50 to-beige-50 border border-teal-100/60 p-5"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-teal-900 mb-1">
              Version {rightVersion} Summary
            </h3>
            <p className="text-[12px] text-teal-700 leading-relaxed">
              This version includes {summaryStats.sectionsChanged} section
              changes with {summaryStats.linesAdded} additions and{" "}
              {summaryStats.linesRemoved} removals.{" "}
              {summaryStats.aiSuggestionsAccepted} AI suggestions were accepted
              — improvements to scope definition, timeline extension, and risk
              mitigation strategies.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
