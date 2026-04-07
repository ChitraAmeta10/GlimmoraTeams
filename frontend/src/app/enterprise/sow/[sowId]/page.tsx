"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText, CheckCircle2, Sparkles, ChevronDown, ChevronRight, Calendar,
  BookOpen, DollarSign, Clock, Tag, Layers, Shield, GitBranch, History,
  ClipboardList, Link2, User, ExternalLink, Bot, Upload, AlertTriangle,
  ShieldCheck, Send, X, Search, Download, Scale, Eye, Ban, Filter, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, scaleIn } from "@/lib/utils/motion-variants";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui";
import { mockSOWs, mockSOWSections } from "@/mocks/data/enterprise-sow";
import { mockProjects } from "@/mocks/data/enterprise-projects";
import {
  mockSOWClauses, mockEthicsScreening, mockRegulatoryAlignment,
  mockGenerationParams, mockHallucinationLayers, sensitivityHandlingRequirements,
} from "@/mocks/data/enterprise-sow-detail";

/* ═══ Config maps — all Tailwind tokens ═══ */

const statusCfg: Record<string, { label: string; variant: string }> = {
  draft: { label: "Draft", variant: "beige" },
  in_review: { label: "In Review", variant: "teal" },
  pending_commercial_review: { label: "Pending Commercial Review", variant: "gold" },
  approved: { label: "Approved", variant: "forest" },
  archived: { label: "Archived", variant: "beige" },
  rejected: { label: "Rejected", variant: "danger" },
};

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

function confidenceColor(c: number) { return c >= 90 ? "forest" : c >= 85 ? "teal" : "gold"; }
function riskVariant(r: number) { return r <= 25 ? "forest" : r <= 50 ? "gold" : "danger"; }
function fd(iso: string) { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
function fdt(iso: string) { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }); }

const clauseLabels: Record<string, string> = {
  dependency: "Dependency", assumption: "Assumption", constraint: "Constraint",
  acceptance_criteria: "Acceptance", ethical: "Ethical", security: "Security",
  ip: "IP", liability: "Liability", confidentiality: "Confidentiality",
  sla: "SLA", warranty: "Warranty", termination: "Termination",
};

const stageLabels: Record<string, string> = {
  business: "Business Owner",
  commercial: "Commercial Review",
  legal: "Legal / Compliance",
  security: "Security Review",
  final: "Final Sign-off",
};

/* ═══ Mock generators ═══ */

type AE = { id: string; action: string; actor: string; timestamp: string; details: string };
function genAudit(sow: (typeof mockSOWs)[0]): AE[] {
  const e: AE[] = [{ id: "a1", action: "created", actor: sow.createdBy, timestamp: sow.createdAt, details: `SOW "${sow.title}" ${sow.intakeMode === "ai_generated" ? "generated via AI" : "uploaded manually"}` }];
  if (sow.parsedSections > 0) { const d = new Date(sow.createdAt); d.setMinutes(d.getMinutes() + 15); e.push({ id: "a1b", action: "parsed", actor: "AI Engine", timestamp: d.toISOString(), details: `AI extraction: ${sow.parsedSections} sections detected` }); }
  if (sow.version > 1) { const d = new Date(sow.createdAt); d.setDate(d.getDate() + 3); e.push({ id: "a2", action: "updated", actor: sow.createdBy, timestamp: d.toISOString(), details: "Scope sections revised" }); }
  if (sow.status === "in_review" || sow.status === "pending_commercial_review" || sow.status === "approved") {
    const d = new Date(sow.createdAt);
    d.setDate(d.getDate() + 5);
    e.push({ id: "a2b", action: "submitted", actor: sow.createdBy, timestamp: d.toISOString(), details: "Submitted for approval" });
  }
  if (sow.status === "approved" && sow.approvedBy) { e.push({ id: "a3", action: "approved", actor: sow.approvedBy, timestamp: sow.updatedAt, details: "SOW approved and locked" }); }
  return e.reverse();
}

/* ═══ PAGE ═══ */

export default function SOWDetailPage() {
  const params = useParams();
  const sowId = params.sowId as string;
  const sow = mockSOWs.find((s) => s.id === sowId) || mockSOWs[0];
  const linkedProject = mockProjects.find((p) => p.sowId === sow.id);
  const sections = mockSOWSections.filter((s) => s.sowId === sow.id);
  const clauses = mockSOWClauses.filter((c) => c.sowId === sow.id);
  const auditTrail = genAudit(sow);
  const ethicsScreening = mockEthicsScreening[sow.id] || [];
  const regulatoryItems = mockRegulatoryAlignment[sow.id] || [];
  const hallucinationLayers = mockHallucinationLayers[sow.id] || [];
  const sensitivityReqs = sensitivityHandlingRequirements[sow.dataSensitivity] || [];

  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(() => new Set(sections.slice(0, 2).map((s) => s.id)));
  const [showModal, setShowModal] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const toggleSection = (id: string) => setExpandedSections((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const st = statusCfg[sow.status] || statusCfg.draft;
  const prohib = clauses.filter((c) => c.isProhibited).length;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">

      {/* ═══ HEADER ═══ */}
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <Badge variant={st.variant} dot>{st.label}</Badge>
              <Badge variant={sow.intakeMode === "ai_generated" ? "teal" : "beige"}>
                {sow.intakeMode === "ai_generated" ? <><Bot className="w-2.5 h-2.5" /> AI Generated</> : <><Upload className="w-2.5 h-2.5" /> Manual</>}
              </Badge>
              {sow.riskScore.overall > 0 && <Badge variant={riskVariant(sow.riskScore.overall)}>Risk {sow.riskScore.overall}/100</Badge>}
            </div>

            <h1 className="font-heading text-[28px] font-semibold text-gray-900 tracking-tight leading-tight">{sow.title}</h1>

            <div className="flex items-center gap-2 mt-2 flex-wrap text-[12px] text-gray-400">
              <span className="font-mono text-gray-500">{sow.id.toUpperCase()}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>{sow.client}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>v{sow.version}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>{sow.pages} pages</span>
              {sow.estimatedBudget > 0 && <><span className="w-1 h-1 rounded-full bg-gray-300" /><span>${Math.round(sow.estimatedBudget / 1000)}k</span></>}
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>by {sow.createdBy}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 shrink-0 mt-1">
            {sow.status === "draft" && sow.parsedSections > 0 && (
              <button onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-gradient-to-r from-brown-400 to-brown-600 hover:from-brown-500 hover:to-brown-700 px-5 py-2.5 rounded-xl transition-all">
                <Send className="w-3.5 h-3.5" /> Submit for Approval
              </button>
            )}
            {(sow.status === "in_review" || sow.status === "pending_commercial_review") && (
              <Link href={`/enterprise/sow/${sow.id}/approve`}>
                <button className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-gradient-to-r from-brown-400 to-brown-600 px-5 py-2.5 rounded-xl">
                  <Clock className="w-3.5 h-3.5" /> View Approval
                </button>
              </Link>
            )}
            {sow.status === "approved" && (
              <Link href={sow.planId ? `/enterprise/decomposition/${sow.planId}` : `/enterprise/decomposition?sowId=${sow.id}`}>
                <button className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-gradient-to-r from-brown-400 to-brown-600 px-5 py-2.5 rounded-xl">
                  <Layers className="w-3.5 h-3.5" /> {sow.planId ? "View Plan" : "Start Decomposition"}
                </button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* ═══ KPI ROW ═══ */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Sections", value: `${sow.parsedSections}/${sow.totalSections}`, icon: BookOpen, iconBg: "bg-gradient-to-br from-brown-400 to-brown-600" },
          { label: "AI Confidence", value: `${sow.aiConfidence}%`, icon: Sparkles, iconBg: "bg-gradient-to-br from-forest-400 to-forest-600" },
          { label: "Clauses", value: `${clauses.length}`, icon: Scale, iconBg: "bg-gradient-to-br from-teal-400 to-teal-600" },
          { label: "Risk Score", value: `${sow.riskScore.overall}/100`, icon: ShieldCheck, iconBg: `bg-gradient-to-br ${sow.riskScore.overall <= 25 ? "from-forest-400 to-forest-600" : "from-gold-400 to-gold-600"}` },
        ].map((kpi) => {
          const KpiIcon = kpi.icon;
          return (
            <motion.div key={kpi.label} variants={scaleIn} className="card-parchment flex items-center gap-5 px-5 py-5">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", kpi.iconBg)}>
                <KpiIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-gray-400">{kpi.label}</div>
                <div className="num-display text-[28px] text-gray-900 leading-none mt-1">{kpi.value}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ═══ SOW DETAILS ═══ */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        {/* Details */}
        <div className="card-parchment">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <span className="text-sm font-semibold text-gray-800">Details</span>
          </div>
          <div className="py-2">
            {[
              { label: "Created", value: fdt(sow.createdAt), icon: Calendar },
              { label: "Updated", value: fdt(sow.updatedAt), icon: Clock },
              ...(sow.approvedBy ? [{ label: "Approved By", value: sow.approvedBy, icon: CheckCircle2 }] : []),
              { label: "Sensitivity", value: sow.dataSensitivity, icon: Shield },
            ].map((item, i, arr) => {
              const Ico = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-black/[0.02]"
                  style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--border-hair)" : undefined }}>
                  <Ico className="w-4 h-4 text-brown-400 shrink-0" />
                  <span className="text-[12px] text-gray-400 flex-1">{item.label}</span>
                  <span className="text-[12px] font-medium text-gray-700">{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stakeholders */}
        <div className="card-parchment">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <span className="text-sm font-semibold text-gray-800">Stakeholders</span>
          </div>
          <div className="px-5 py-4">
            <div className="flex flex-wrap gap-2">
              {sow.stakeholders.map((name) => (
                <div key={name} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brown-300 to-brown-500 flex items-center justify-center">
                    <span className="text-[7px] font-bold text-white">{name.split(" ").map(w => w[0]).join("")}</span>
                  </div>
                  <span className="text-[11px] font-medium text-gray-700">{name}</span>
                </div>
              ))}
            </div>
            {sow.tags.length > 0 && (
              <>
                <div className="label-caps mt-5 mb-2">Tags</div>
                <div className="flex flex-wrap gap-1.5">
                  {sow.tags.map((tag) => <Badge key={tag} variant="beige"><Tag className="w-2.5 h-2.5" /> {tag}</Badge>)}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Approval Pipeline */}
        <div className="card-parchment">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <span className="text-sm font-semibold text-gray-800">Approval Pipeline</span>
          </div>
          <div className="py-2">
            {sow.approvalStages.map((stage, i) => {
              const sv = stage.status === "approved" ? "forest" : stage.status === "in_review" ? "gold" : stage.status === "rejected" ? "danger" : "beige";
              const StgIcon = stage.status === "approved" ? CheckCircle2 : stage.status === "in_review" ? Clock : stage.status === "rejected" ? X : FileText;
              return (
                <div key={stage.stage} className="flex items-center gap-3 px-5 py-3"
                  style={{ borderBottom: i < sow.approvalStages.length - 1 ? "1px solid var(--border-hair)" : undefined }}>
                  <StgIcon className={cn("w-4 h-4 shrink-0", badgeStyles[sv]?.text || "text-gray-400")} />
                  <span className="text-[12px] font-medium text-gray-700 flex-1">{stageLabels[stage.stage] || stage.stage}</span>
                  <Badge variant={sv}>{stage.status === "approved" ? "Done" : stage.status === "in_review" ? "Active" : "Pending"}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ═══ DOCUMENT SECTIONS ═══ */}
      {sections.length > 0 && (
        <motion.div variants={fadeUp} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Document Sections</h2>
            <button onClick={() => expandedSections.size === sections.length ? setExpandedSections(new Set()) : setExpandedSections(new Set(sections.map(s => s.id)))}
              className="text-[12px] font-medium text-brown-500 hover:text-brown-600 transition-colors">
              {expandedSections.size === sections.length ? "Collapse all" : "Expand all"}
            </button>
          </div>
          <div className="space-y-2">
            {sections.map((sec, idx) => {
              const isOpen = expandedSections.has(sec.id);
              const isLow = sec.confidence < 85;
              const cv = confidenceColor(sec.confidence);
              return (
                <div key={sec.id} className="card-parchment overflow-hidden">
                  <button onClick={() => toggleSection(sec.id)}
                    className="w-full flex items-center gap-3 text-left px-5 py-3.5 transition-colors hover:bg-black/[0.02]">
                    <span className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 truncate text-[13px] font-semibold text-gray-800">{sec.title}</span>
                    {isLow && <AlertTriangle className="w-3.5 h-3.5 text-gold-500 shrink-0" />}
                    <Badge variant={cv}>{sec.confidence}%</Badge>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4">
                      <p className="text-[13px] text-gray-600 leading-relaxed mb-3">{sec.content}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider w-16 shrink-0">Confidence</span>
                        <div className={cn("flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden")}>
                          <div className={cn("h-full rounded-full", cv === "forest" ? "bg-forest-500" : cv === "teal" ? "bg-teal-500" : "bg-gold-500")} style={{ width: `${sec.confidence}%` }} />
                        </div>
                        <span className={cn("text-[11px] font-mono font-semibold w-8 text-right", cv === "forest" ? "text-forest-600" : cv === "teal" ? "text-teal-600" : "text-gold-600")}>{sec.confidence}%</span>
                      </div>
                      {sec.aiSuggestion && (
                        <div className="flex items-start gap-2.5 mt-3 px-3.5 py-2.5 rounded-xl bg-gold-50">
                          <Sparkles className="w-3.5 h-3.5 text-gold-500 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[10px] font-semibold text-gold-700 uppercase tracking-wider">AI Suggestion</span>
                            <p className="text-[12px] text-gold-700 leading-relaxed mt-0.5">{sec.aiSuggestion}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ═══ CLAUSES ═══ */}
      {clauses.length > 0 && (
        <motion.div variants={fadeUp} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-gray-800">Tagged Clauses</h2>
              <span className="text-[11px] text-gray-400">{clauses.length} clauses</span>
              {prohib > 0 && <Badge variant="danger">{prohib} prohibited</Badge>}
            </div>
          </div>
          <div className="card-parchment">
            {clauses.slice(0, 8).map((cl, i) => (
              <div key={cl.id} className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-black/[0.02]"
                style={{ borderBottom: i < Math.min(clauses.length, 8) - 1 ? "1px solid var(--border-hair)" : undefined }}>
                {cl.isProhibited ? <Ban className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> : <Scale className="w-4 h-4 text-brown-400 shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Badge variant={cl.isProhibited ? "danger" : "beige"}>{clauseLabels[cl.type] || cl.type}</Badge>
                    <span className="text-[10px] font-mono text-gray-400">{cl.sectionRef}</span>
                  </div>
                  <p className="text-[12.5px] text-gray-600 leading-relaxed">{cl.text}</p>
                </div>
                <span className={cn("text-[10px] font-mono font-semibold shrink-0",
                  cl.confidence >= 90 ? "text-forest-600" : cl.confidence >= 75 ? "text-teal-600" : "text-gold-600"
                )}>{cl.confidence}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ═══ AUDIT TRAIL ═══ */}
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800">Activity</h2>
        </div>
        <div className="card-parchment">
          {auditTrail.map((ev, i) => {
            const isAI = ev.actor === "AI Engine";
            const actionVariant: Record<string, string> = { created: "teal", updated: "gold", approved: "forest", submitted: "brown", parsed: "teal", reviewed: "gold" };
            return (
              <div key={ev.id} className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-black/[0.02]"
                style={{ borderBottom: i < auditTrail.length - 1 ? "1px solid var(--border-hair)" : undefined }}>
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[8px] font-bold",
                  isAI ? "bg-brown-100 text-brown-600" : "bg-gray-100 text-gray-500"
                )}>
                  {isAI ? <Bot className="w-3.5 h-3.5" /> : ev.actor.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-medium text-gray-700">{ev.actor}</span>
                    <Badge variant={actionVariant[ev.action] || "beige"}>{ev.action}</Badge>
                  </div>
                  <p className="text-[12px] text-gray-500 mt-0.5">{ev.details}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{fdt(ev.timestamp)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ═══ SUBMIT MODAL ═══ */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => !submitted && setShowModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-[460px] mx-4 rounded-2xl bg-white border border-gray-200 p-6"
            style={{ boxShadow: "0 16px 40px var(--border-hair)" }}>
            {!submitted ? (
              <>
                <h3 className="text-[16px] font-semibold text-gray-900 mb-1">Submit for Approval?</h3>
                <p className="text-[13px] text-gray-400 mb-5">This will send the SOW through the 5-stage approval pipeline.</p>
                <div className="card-parchment mb-5">
                  {[
                    { l: "Title", v: sow.title },
                    { l: "Risk Score", v: `${sow.riskScore.overall}/100` },
                    { l: "Sections", v: `${sow.parsedSections}/${sow.totalSections}` },
                  ].map((item, i, arr) => (
                    <div key={item.l} className="flex items-center justify-between px-4 py-2.5"
                      style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--border-hair)" : undefined }}>
                      <span className="text-[11px] text-gray-400 uppercase tracking-wider">{item.l}</span>
                      <span className="text-[12px] font-medium text-gray-700">{item.v}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowModal(false)} className="text-[12px] font-medium text-gray-500 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all">Cancel</button>
                  <button onClick={() => { setSubmitted(true); setTimeout(() => setShowModal(false), 2000); }}
                    className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-gradient-to-r from-brown-400 to-brown-600 px-5 py-2 rounded-lg">
                    <Send className="w-3 h-3" /> Confirm
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-[16px] font-semibold text-gray-900 mb-1">Submitted Successfully</h3>
                <p className="text-[13px] text-gray-400">Sent to Stage 1: Business Owner Review.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}
