"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck, Sparkles, AlertTriangle, CheckCircle2, Clock, FileText,
  BarChart3, RefreshCcw, PenLine, Send, X, Lightbulb, Eye, ChevronDown,
  ChevronRight, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import { Textarea } from "@/components/ui";
import { useSidebarStore } from "@/lib/stores/sidebar-store";

/* ═══ MOCK DATA ═══ */

const sowMeta = {
  id: "sow-004", title: "Healthcare Patient Portal", client: "MedFirst Health Systems",
  generatedAt: "2026-03-07T14:32:00Z", overallConfidence: 92, riskScore: 18,
  hallucinationFlags: 2, completeness: 96,
};

const generatedSections = [
  { id: "sec-1", title: "Executive Summary", confidence: 96, content: "This project delivers a secure, HIPAA-compliant patient portal enabling MedFirst Health Systems' 2.4 million active patients to manage appointments, view medical records, communicate with providers, and process payments. The platform integrates with Epic EHR via FHIR R4 APIs, supports real-time telehealth video, and includes a mobile-responsive Progressive Web App. Target launch: Q3 2026 with phased rollout across 14 regional facilities." },
  { id: "sec-2", title: "Project Scope", confidence: 94, content: "In-scope: Patient registration and identity verification (KYC/KYB), appointment scheduling with provider availability sync, secure messaging, medical records viewer with lab results and imaging, prescription refill requests, billing and payment processing, telehealth video consultations, push notifications, multi-language support, accessibility (WCAG 2.1 AA). Out-of-scope: EMR data migration, insurance claim adjudication, provider-side administrative tools." },
  { id: "sec-3", title: "Technical Requirements", confidence: 91, content: "Frontend: React 18+ with TypeScript, Next.js App Router, Tailwind CSS. Backend: Node.js/NestJS microservices, PostgreSQL 16, Redis. Security: OAuth 2.0 / OIDC with Keycloak, MFA, AES-256, TLS 1.3. Infrastructure: AWS (EKS), Terraform IaC, GitHub Actions CI/CD. Integrations: Epic FHIR R4, Twilio, Stripe, SendGrid, Vonage." },
  { id: "sec-4", title: "Timeline & Milestones", confidence: 88, content: "Phase 1 (Weeks 1-6): Core infrastructure, auth, registration. Phase 2 (Weeks 7-14): Scheduling, records viewer, messaging. Phase 3 (Weeks 15-20): Telehealth, billing, prescriptions. Phase 4 (Weeks 21-24): UAT, security audit, staged rollout. Total: 24 weeks." },
  { id: "sec-5", title: "Budget Breakdown", confidence: 82, content: "Total: $1,240,000. Engineering (60%): $744,000. Design (10%): $124,000. Infrastructure (15%): $186,000. Security & Compliance (10%): $124,000. Project Management (5%): $62,000. Contingency: 12% buffer." },
  { id: "sec-6", title: "Team Composition", confidence: 93, content: "18 team members: 1 PM, 1 Solutions Architect, 5 Frontend, 5 Backend, 2 DevOps, 2 QA, 1 Security Engineer, 2 UX. All HIPAA-experienced." },
  { id: "sec-7", title: "Quality Standards & SLAs", confidence: 95, content: "Availability: 99.95%. Performance: P95 load < 2s, API < 200ms. Security: Zero critical vulns at launch. Testing: 85%+ code coverage. Accessibility: WCAG 2.1 AA. Support: 24/7 critical, 8hr SLA." },
  { id: "sec-8", title: "Security & Compliance", confidence: 97, content: "HIPAA BAA with all subprocessors. PHI encrypted at rest (AES-256) and in transit (TLS 1.3). RBAC with least privilege. Immutable audit logging (7-year retention). MFA mandatory. SOC 2 Type II targeted within 12 months." },
];

const hallucinationFlags = [
  { id: "flag-1", severity: "medium" as const, section: "Budget Breakdown", clause: "Contingency: 12% buffer included in line items.", reason: "This contingency percentage was not specified in the input parameters. The AI inferred 12% based on project complexity scoring.", suggestion: "Verify the 12% contingency rate aligns with MedFirst's procurement policy. Healthcare projects typically range 10-20%." },
  { id: "flag-2", severity: "low" as const, section: "Timeline & Milestones", clause: "Security penetration test (Week 20)", reason: "Penetration test timing was auto-scheduled based on phase completion patterns.", suggestion: "Week 20 allows 4 weeks of buffer before go-live. Consider if this aligns with your security team's availability." },
  { id: "flag-3", severity: "high" as const, section: "Budget Breakdown", clause: "Security & Compliance (10%): $124,000", reason: "The security budget allocation (10%) is significantly below the healthcare industry median of 14%.", suggestion: "Increase security allocation to at least 14% ($173,600). Healthcare breaches average $10.9M per incident." },
];

const riskBreakdown = [
  { category: "Completeness", score: 28, maxScore: 30 },
  { category: "Confidence", score: 22, maxScore: 25 },
  { category: "Compliance", score: 23, maxScore: 25 },
  { category: "Pattern Match", score: 18, maxScore: 20 },
];

/* ═══ PAGE ═══ */

export default function SOWAIDraftReviewPage() {
  const router = useRouter();
  const { isCollapsed } = useSidebarStore();
  const [resolvedFlags, setResolvedFlags] = React.useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set(["sec-1"]));
  const [submitted, setSubmitted] = React.useState(false);
  const [showChangesDialog, setShowChangesDialog] = React.useState(false);
  const [changesFeedback, setChangesFeedback] = React.useState("");

  const toggleResolve = (id: string) => setResolvedFlags((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const toggleSection = (id: string) => setExpandedSections((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const unresolvedCount = hallucinationFlags.filter((f) => !resolvedFlags.has(f.id)).length;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" style={{ paddingBottom: 80 }}>

      {/* ═══ HEADER ═══ */}
      <motion.div variants={fadeUp} className="mb-6">
        <h1 className="font-heading text-[28px] font-semibold text-gray-900 tracking-tight">AI Draft Review</h1>
        <p className="mt-1.5 text-[13px] text-gray-500">
          <span className="font-semibold text-gray-700">{sowMeta.title}</span> for {sowMeta.client} · Generated {new Date(sowMeta.generatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </motion.div>

      {/* ═══ KPI ROW ═══ */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: "AI Confidence", value: `${sowMeta.overallConfidence}%`, sub: "Above threshold", icon: Sparkles, iconBg: "bg-gradient-to-br from-forest-400 to-forest-600" },
          { label: "Risk Score", value: `${sowMeta.riskScore}/100`, sub: "Low risk", icon: ShieldCheck, iconBg: "bg-gradient-to-br from-brown-400 to-brown-600" },
          { label: "Flags", value: `${unresolvedCount}`, sub: unresolvedCount === 0 ? "All resolved" : `of ${hallucinationFlags.length} unresolved`, icon: AlertTriangle, iconBg: unresolvedCount > 0 ? "bg-gradient-to-br from-gold-400 to-gold-600" : "bg-gradient-to-br from-forest-400 to-forest-600" },
          { label: "Completeness", value: `${sowMeta.completeness}%`, sub: `${generatedSections.length} sections`, icon: BarChart3, iconBg: "bg-gradient-to-br from-teal-400 to-teal-600" },
        ].map((kpi) => {
          const KpiIcon = kpi.icon;
          return (
            <motion.div key={kpi.label} className="card-parchment flex items-center gap-5 px-5 py-5">
              <div className={`w-12 h-12 rounded-2xl ${kpi.iconBg} flex items-center justify-center shrink-0`}>
                <KpiIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-gray-400">{kpi.label}</div>
                <div className="num-display text-[28px] text-gray-900 leading-none mt-1">{kpi.value}</div>
                <div className="text-[11px] mt-1 text-gray-400">{kpi.sub}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ═══ GENERATED SOW SECTIONS ═══ */}
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800">Generated SOW</h2>
          <span className="text-[11px] text-gray-400">{generatedSections.length} sections</span>
        </div>
        <div className="space-y-2">
          {generatedSections.map((section, idx) => {
            const isOpen = expandedSections.has(section.id);
            const isLow = section.confidence < 85;
            return (
              <div key={section.id} className="card-parchment overflow-hidden">
                <button onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center gap-3 text-left px-5 py-3.5 transition-colors hover:bg-black/[0.02]">
                  <span className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 truncate text-[13px] font-semibold text-gray-800">{section.title}</span>
                  {isLow && <AlertTriangle className="w-3.5 h-3.5 text-gold-500 shrink-0" />}
                  <span className={cn("text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full",
                    section.confidence >= 90 ? "bg-forest-50 text-forest-700" :
                    section.confidence >= 85 ? "bg-teal-50 text-teal-700" :
                    "bg-gold-50 text-gold-700"
                  )}>{section.confidence}%</span>
                  {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4">
                    <p className="text-[13px] text-gray-600 leading-relaxed mb-3">{section.content}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider w-16 shrink-0">Confidence</span>
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all",
                          section.confidence >= 90 ? "bg-forest-500" : section.confidence >= 85 ? "bg-teal-500" : "bg-gold-500"
                        )} style={{ width: `${section.confidence}%` }} />
                      </div>
                      <span className={cn("text-[11px] font-mono font-semibold w-8 text-right",
                        section.confidence >= 90 ? "text-forest-600" : section.confidence >= 85 ? "text-teal-600" : "text-gold-600"
                      )}>{section.confidence}%</span>
                    </div>
                    {isLow && (
                      <div className="flex items-start gap-2.5 mt-3 px-3.5 py-2.5 rounded-xl bg-gold-50">
                        <AlertTriangle className="w-3.5 h-3.5 text-gold-500 mt-0.5 shrink-0" />
                        <span className="text-[12px] text-gold-700 leading-relaxed">Below 85% confidence. Review this section carefully against your original requirements.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ═══ FLAGGED CLAUSES ═══ */}
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-gray-800">Flagged Clauses</h2>
            {unresolvedCount > 0 ? (
              <span className="text-[10px] font-semibold text-gold-700 bg-gold-50 w-5 h-5 rounded-full flex items-center justify-center">{unresolvedCount}</span>
            ) : (
              <span className="text-[10px] font-semibold text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> All Resolved</span>
            )}
          </div>
        </div>
        <div className="card-parchment">
          {hallucinationFlags.map((flag, idx) => {
            const isResolved = resolvedFlags.has(flag.id);
            const severityColor = { high: "text-red-500", medium: "text-gold-600", low: "text-gray-400" };
            const severityBg = { high: "bg-red-500", medium: "bg-gold-500", low: "bg-gray-300" };
            return (
              <div key={flag.id} className={cn("px-5 py-5 transition-opacity", isResolved && "opacity-40")}
                style={{ borderBottom: idx < hallucinationFlags.length - 1 ? "1px solid var(--border-hair)" : undefined }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full shrink-0", severityBg[flag.severity])} />
                    <span className={cn("text-[12px] font-semibold capitalize", severityColor[flag.severity])}>{flag.severity}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-[12px] text-gray-500">{flag.section}</span>
                  </div>
                  <button onClick={() => toggleResolve(flag.id)}
                    className={cn("flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all",
                      isResolved ? "text-gray-500 border border-gray-200 hover:bg-gray-50" : "text-white bg-gradient-to-r from-brown-400 to-brown-600 hover:from-brown-500 hover:to-brown-700"
                    )}>
                    {isResolved ? <><RefreshCcw className="w-3 h-3" /> Undo</> : <><CheckCircle2 className="w-3 h-3" /> Resolve</>}
                  </button>
                </div>
                {/* Clause */}
                <p className="text-[13px] text-gray-800 italic leading-relaxed mb-2">&ldquo;{flag.clause}&rdquo;</p>
                <p className="text-[12px] text-gray-500 leading-relaxed mb-3">{flag.reason}</p>
                {/* Suggestion */}
                <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-teal-50">
                  <Lightbulb className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
                  <p className="text-[12px] text-teal-700 leading-relaxed">{flag.suggestion}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ═══ RISK BREAKDOWN ═══ */}
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800">Risk Assessment</h2>
          <span className={cn("text-[10px] font-semibold px-2.5 py-0.5 rounded-full",
            sowMeta.riskScore <= 25 ? "bg-forest-50 text-forest-700" : sowMeta.riskScore <= 50 ? "bg-gold-50 text-gold-700" : "bg-red-50 text-red-600"
          )}>
            {sowMeta.riskScore <= 25 ? "Low Risk" : sowMeta.riskScore <= 50 ? "Moderate Risk" : "High Risk"} · {sowMeta.riskScore}/100
          </span>
        </div>
        <div className="card-parchment px-5 py-5">
          <div className="space-y-4">
            {riskBreakdown.map((item) => {
              const pct = Math.round((item.score / item.maxScore) * 100);
              return (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-medium text-gray-700">{item.category}</span>
                    <span className="text-[11px] font-mono text-gray-600">{item.score}<span className="text-gray-400">/{item.maxScore}</span></span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className={cn("h-full rounded-full",
                      pct >= 90 ? "bg-forest-500" : pct >= 75 ? "bg-teal-500" : "bg-gold-500"
                    )} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid var(--border-hair)" }}>
            <span className="text-[12px] font-medium text-gray-700">Total Points Lost</span>
            <span className="num-display text-[16px] text-gray-900">
              {riskBreakdown.reduce((a, r) => a + (r.maxScore - r.score), 0)}<span className="text-gray-400 font-normal text-[12px]"> / 100</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* ═══ REQUEST CHANGES DIALOG ═══ */}
      {showChangesDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowChangesDialog(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-[480px] mx-4 rounded-2xl bg-white border border-gray-200 p-6"
            style={{ boxShadow: "0 16px 40px var(--border-hair)" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[15px] font-semibold text-gray-900">Request Changes</div>
                <p className="text-[12px] text-gray-400 mt-0.5">Provide feedback for the AI to revise the draft</p>
              </div>
              <button onClick={() => setShowChangesDialog(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50"><X className="w-4 h-4" /></button>
            </div>
            <Textarea placeholder="Describe changes — e.g. 'Expand the security section to include HIPAA details'..." value={changesFeedback} onChange={(e) => setChangesFeedback(e.target.value)} className="min-h-[120px]" />
            <div className="flex items-center justify-end gap-2 mt-4">
              <button onClick={() => setShowChangesDialog(false)} className="text-[12px] font-medium text-gray-500 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all">Cancel</button>
              <button onClick={() => { setShowChangesDialog(false); setChangesFeedback(""); }} disabled={!changesFeedback.trim()}
                className={cn("flex items-center gap-1.5 text-[12px] font-medium px-4 py-2 rounded-lg transition-all",
                  changesFeedback.trim() ? "text-white bg-gradient-to-r from-brown-400 to-brown-600" : "text-gray-400 bg-gray-100 cursor-not-allowed"
                )}>
                <Send className="w-3 h-3" /> Submit
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ═══ FIXED BOTTOM ACTION BAR ═══ */}
      <div className="fixed bottom-0 right-0 z-40 bg-white border-t border-gray-200 transition-all" style={{ left: isCollapsed ? 64 : 220 }}>
        <div className="flex items-center justify-end gap-3 px-8 py-3.5">
          <p className="hidden md:block text-[11px] text-gray-400 text-right max-w-[260px] mr-auto">
            Routes to 5-stage approval: Business → Commercial → Legal → Security → Final
          </p>
          <button onClick={() => router.push("/enterprise/sow/generate")}
            className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all">
            <RefreshCcw className="w-3 h-3" /> Re-generate
          </button>
          <button onClick={() => setShowChangesDialog(true)}
            className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all">
            <PenLine className="w-3 h-3" /> Request Changes
          </button>
          <button disabled={submitted}
            onClick={() => { setSubmitted(true); setTimeout(() => router.push("/enterprise/sow/sow-004/approve"), 1500); }}
            className={cn("flex items-center gap-1.5 text-[12px] font-semibold px-6 py-2.5 rounded-xl transition-all",
              submitted ? "text-forest-700 bg-forest-50" : "text-white bg-gradient-to-r from-brown-400 to-brown-600 hover:from-brown-500 hover:to-brown-700"
            )}>
            {submitted ? <><CheckCircle2 className="w-3.5 h-3.5" /> Submitted</> : <><Send className="w-3.5 h-3.5" /> Submit for Approval</>}
          </button>
        </div>
      </div>

    </motion.div>
  );
}
