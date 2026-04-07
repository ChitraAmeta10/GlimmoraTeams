"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, AlertTriangle, FileText, Shield, ShieldCheck, DollarSign,
  Clock, Users, Sparkles, Lock, ScrollText, GitBranch, Target, Scale,
  XCircle, Send, ChevronRight, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import { Checkbox, Textarea } from "@/components/ui";
import { mockSOWs } from "@/mocks/data/enterprise-sow";
import type { ApprovalStage } from "@/types/enterprise";

/* ═══ Badge component (matches detail page) ═══ */

const badgeStyles: Record<string, { bg: string; text: string; dot: string }> = {
  forest: { bg: "bg-forest-50", text: "text-forest-700", dot: "bg-forest-500" },
  teal: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" },
  gold: { bg: "bg-gold-50", text: "text-gold-700", dot: "bg-gold-500" },
  brown: { bg: "bg-brown-50", text: "text-brown-700", dot: "bg-brown-500" },
  beige: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  danger: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
};

function Badge({ variant, dot, children }: { variant: string; dot?: boolean; children: React.ReactNode }) {
  const s = badgeStyles[variant] || badgeStyles.beige;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[9px] font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full", s.bg, s.text)}>
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />}
      {children}
    </span>
  );
}

/* ═══ Stage config ═══ */

const stageLabels: Record<string, string> = {
  business: "Business Owner",
  commercial: "Commercial Review",
  legal: "Legal / Compliance",
  security: "Security Review",
  final: "Final Sign-off",
};
const stageDesc: Record<string, string> = {
  business: "Verify budget, scope, and business alignment",
  commercial: "Confirm contracted value and commercial viability",
  legal: "Review contractual terms and compliance",
  security: "Assess data sensitivity and security requirements",
  final: "Executive sign-off for project initiation",
};
const stageIcons: Record<string, LucideIcon> = { business: DollarSign, commercial: ScrollText, legal: Scale, security: Shield, final: ShieldCheck };

interface CLI { id: string; label: string; description: string; }
const stageChecklists: Record<ApprovalStage, CLI[]> = {
  business: [
    { id: "scope-align", label: "Scope aligns with business objectives", description: "SOW deliverables match strategic goals" },
    { id: "budget-ok", label: "Budget within procurement limits", description: "Cost falls within approved spending authority" },
    { id: "timeline-ok", label: "Timeline is feasible", description: "Milestone dates are realistic" },
    { id: "stakeholders", label: "Stakeholders identified and notified", description: "All decision-makers are listed and aware" },
  ],
  commercial: [
    { id: "budget-viable", label: "Budget viable for scope", description: "Declared range supports delivery requirements" },
    { id: "rate-card", label: "Rate cards available for roles", description: "All required roles have pricing coverage" },
    { id: "pricing-model", label: "Pricing model supported", description: "Fixed/T&M/outcome-based is supported" },
    { id: "contracted-value", label: "Contracted value confirmed", description: "Commercial value set and recorded" },
  ],
  legal: [
    { id: "ip-rights", label: "IP rights and ownership clauses reviewed", description: "Intellectual property terms are acceptable" },
    { id: "liability", label: "Liability and indemnification verified", description: "Risk allocation is balanced" },
    { id: "compliance", label: "Regulatory compliance confirmed", description: "Meets all applicable regulations" },
    { id: "terms", label: "Standard terms applied", description: "Terms match approved templates" },
  ],
  security: [
    { id: "data-class", label: "Data classification appropriate", description: "Sensitivity level matches data types" },
    { id: "access-ctrl", label: "Access controls specified", description: "Auth requirements are defined" },
    { id: "encryption", label: "Encryption requirements met", description: "Data protection standards met" },
    { id: "audit-trail", label: "Audit logging requirements defined", description: "Traceability mechanisms in place" },
  ],
  final: [
    { id: "all-stages", label: "All prior stages approved", description: "Business, Legal, and Security reviews complete" },
    { id: "risk-accept", label: "Residual risks accepted", description: "Outstanding risks documented" },
    { id: "decomp-ready", label: "Ready for decomposition", description: "SOW can be broken into tasks" },
  ],
};

function riskVariant(s: number) { return s <= 25 ? "forest" : s <= 50 ? "gold" : "danger"; }

const statusVariant: Record<string, string> = {
  draft: "beige",
  in_review: "teal",
  pending_commercial_review: "gold",
  approved: "forest",
  archived: "beige",
  rejected: "danger",
};

const statusLabel: Record<string, string> = {
  draft: "Draft",
  in_review: "In Review",
  pending_commercial_review: "Pending Commercial Review",
  approved: "Approved",
  archived: "Archived",
  rejected: "Rejected",
};

/* ═══ PAGE ═══ */

export default function SOWApprovePage() {
  const params = useParams();
  const sowId = params.sowId as string;
  const sow = mockSOWs.find((s) => s.id === sowId) || mockSOWs[0];

  const activeStageIndex = sow.approvalStages.findIndex((s) => s.status === "in_review" || s.status === "pending");
  const activeStage = activeStageIndex >= 0 ? sow.approvalStages[activeStageIndex] : null;
  const activeChecklist = activeStage ? stageChecklists[activeStage.stage] : [];

  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [comments, setComments] = React.useState("");
  const allChecked = activeChecklist.every((item) => checked[item.id]);
  const checkedCount = activeChecklist.filter((item) => checked[item.id]).length;

  const [showRejectForm, setShowRejectForm] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [rejectionSubmitted, setRejectionSubmitted] = React.useState(false);
  const [approvalSubmitted, setApprovalSubmitted] = React.useState(false);

  const allStagesApproved = sow.approvalStages.every((s) => s.status === "approved");
  const showMain = activeStage && !approvalSubmitted && !rejectionSubmitted;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">

      {/* ═══ HEADER ═══ */}
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge variant={statusVariant[sow.status] || "beige"} dot>{statusLabel[sow.status] || sow.status}</Badge>
          {sow.riskScore.overall > 0 && <Badge variant={riskVariant(sow.riskScore.overall)}>Risk {sow.riskScore.overall}/100</Badge>}
        </div>
        <h1 className="font-heading text-[28px] font-semibold text-gray-900 tracking-tight leading-tight">{sow.title}</h1>
        <div className="flex items-center gap-2 mt-2 text-[12px] text-gray-400">
          <span>{sow.client}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>v{sow.version}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{sow.pages} pages</span>
        </div>
      </motion.div>

      {showMain && (
        <>
          {/* ═══ PIPELINE — Vertical list ═══ */}
          <motion.div variants={fadeUp} className="mb-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">Approval Pipeline</h2>
            <div className="card-parchment">
              {sow.approvalStages.map((stage, i) => {
                const isActive = activeStage?.stage === stage.stage;
                const done = stage.status === "approved";
                const rejected = stage.status === "rejected";
                const variant = done ? "forest" : isActive ? "gold" : rejected ? "danger" : "beige";
                const StageIcon = done ? CheckCircle2 : rejected ? XCircle : isActive ? Clock : stageIcons[stage.stage] || FileText;

                return (
                  <div key={stage.stage} className={cn("flex items-center gap-4 px-5 py-4",
                    isActive && "bg-gold-50/50"
                  )} style={{ borderBottom: i < sow.approvalStages.length - 1 ? "1px solid var(--border-hair)" : undefined }}>
                    <StageIcon className={cn("w-[18px] h-[18px] shrink-0",
                      done ? "text-forest-500" : isActive ? "text-gold-600" : rejected ? "text-red-500" : "text-gray-400"
                    )} />
                    <div className="flex-1 min-w-0">
                      <span className="text-[13px] font-medium text-gray-800">{stageLabels[stage.stage]}</span>
                      {stage.reviewer && <span className="text-[11px] text-gray-400 ml-2">— {stage.reviewer}</span>}
                    </div>
                    <Badge variant={variant}>{done ? "Approved" : isActive ? "In Review" : rejected ? "Rejected" : "Pending"}</Badge>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ═══ REVIEW CHECKLIST ═══ */}
          <motion.div variants={fadeUp} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-gray-800">{stageLabels[activeStage.stage]}</h2>
                <p className="text-[12px] text-gray-400 mt-0.5">{stageDesc[activeStage.stage]}</p>
              </div>
              <Badge variant={allChecked ? "forest" : "gold"}>{checkedCount}/{activeChecklist.length}</Badge>
            </div>

            <div className="card-parchment">
              {/* Progress bar */}
              <div className="px-5 pt-4 pb-2">
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-500", allChecked ? "bg-forest-500" : "bg-gradient-to-r from-brown-400 to-brown-500")}
                    style={{ width: `${activeChecklist.length > 0 ? (checkedCount / activeChecklist.length) * 100 : 0}%` }} />
                </div>
              </div>

              {/* Checklist items */}
              {activeChecklist.map((item, idx) => {
                const isChecked = !!checked[item.id];
                return (
                  <label key={item.id} className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-black/[0.02]"
                    style={{ borderBottom: idx < activeChecklist.length - 1 ? "1px solid var(--border-hair)" : undefined }}>
                    <Checkbox checked={isChecked} onCheckedChange={(val) => setChecked((prev) => ({ ...prev, [item.id]: !!val }))} />
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-[13px] font-medium transition-colors", isChecked ? "text-forest-700" : "text-gray-800")}>{item.label}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{item.description}</p>
                    </div>
                    {isChecked && <CheckCircle2 className="w-4 h-4 text-forest-500 shrink-0" />}
                  </label>
                );
              })}

              {/* Notes */}
              <div className="px-5 py-4" style={{ borderTop: "1px solid var(--border-hair)" }}>
                <div className="label-caps mb-2">Approval Notes</div>
                <Textarea value={comments} onChange={(e) => setComments(e.target.value)}
                  placeholder="Optional notes or conditions..." className="min-h-[80px]" />
              </div>
            </div>
          </motion.div>

          {/* ═══ ACTIONS — Outside the card ═══ */}
          <motion.div variants={fadeUp} className="flex items-center justify-end gap-2 mb-6">
            <button onClick={() => setShowRejectForm((p) => !p)}
              className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
              <AlertTriangle className="w-3.5 h-3.5" /> Request Changes
            </button>
            <button disabled={!allChecked} onClick={() => setApprovalSubmitted(true)}
              className={cn("flex items-center gap-1.5 text-[13px] font-semibold px-6 py-2.5 rounded-xl transition-all",
                allChecked ? "text-white bg-gradient-to-r from-brown-400 to-brown-600 hover:from-brown-500 hover:to-brown-700" : "text-gray-400 bg-gray-100 cursor-not-allowed"
              )}>
              <CheckCircle2 className="w-4 h-4" />
              {allChecked ? "Approve Stage" : `${checkedCount}/${activeChecklist.length} Verified`}
            </button>
          </motion.div>

          {/* ═══ REJECTION FORM ═══ */}
          <AnimatePresence>
            {showRejectForm && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
                <div className="card-parchment px-5 py-5">
                  <h3 className="text-[14px] font-semibold text-gray-800 mb-1">Request Changes</h3>
                  <p className="text-[12px] text-gray-400 mb-4">Describe what needs to be modified before this stage can be approved.</p>
                  <Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Describe what needs to change..." className="min-h-[100px] mb-4" />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setShowRejectForm(false)}
                      className="text-[12px] font-medium text-gray-500 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all">Cancel</button>
                    <button disabled={!rejectionReason.trim()}
                      onClick={() => { if (rejectionReason.trim()) { setRejectionSubmitted(true); setShowRejectForm(false); } }}
                      className={cn("flex items-center gap-1.5 text-[12px] font-medium px-4 py-2 rounded-lg transition-all",
                        rejectionReason.trim() ? "text-white bg-gradient-to-r from-brown-400 to-brown-600" : "text-gray-400 bg-gray-100 cursor-not-allowed"
                      )}>
                      <Send className="w-3 h-3" /> Submit Changes
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* ═══ SUCCESS STATES ═══ */}
      {approvalSubmitted && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-parchment text-center px-10 py-16">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-[20px] font-semibold text-gray-900 mb-1">Stage Approved</h2>
          <p className="text-[13px] text-gray-400"><span className="font-semibold text-gray-700">{activeStage ? stageLabels[activeStage.stage] : ""}</span> review completed.</p>
          {comments && <p className="text-[12px] text-gray-400 italic mt-3 max-w-[360px] mx-auto">&ldquo;{comments}&rdquo;</p>}
          <Link href={`/enterprise/sow/${sow.id}`} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-500 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all mt-6">
            Return to SOW
          </Link>
        </motion.div>
      )}

      {rejectionSubmitted && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-parchment text-center px-10 py-16">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-[20px] font-semibold text-gray-900 mb-1">Changes Requested</h2>
          <p className="text-[13px] text-gray-400">Sent back for modifications.</p>
          <p className="text-[12px] text-gray-400 italic mt-3 max-w-[380px] mx-auto">&ldquo;{rejectionReason}&rdquo;</p>
          <Link href={`/enterprise/sow/${sow.id}`} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-500 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all mt-6">
            Return to SOW
          </Link>
        </motion.div>
      )}

      {allStagesApproved && !activeStage && !approvalSubmitted && !rejectionSubmitted && (
        <motion.div variants={fadeUp} className="card-parchment text-center px-10 py-16">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-[20px] font-semibold text-gray-900 mb-1">All Stages Approved</h2>
          <p className="text-[13px] text-gray-400 max-w-[340px] mx-auto mb-6">Ready for decomposition into tasks.</p>
          <Link href={`/enterprise/sow/${sow.id}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white bg-gradient-to-r from-brown-400 to-brown-600 hover:from-brown-500 hover:to-brown-700 px-6 py-2.5 rounded-xl transition-all">
            <GitBranch className="w-4 h-4" /> Proceed to Decomposition
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
