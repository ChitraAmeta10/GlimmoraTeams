"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import {
  ArrowLeft,
  FileStack,
  Lock,
  Unlock,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  Shield,
  Copy,
  Settings,
  Sparkles,
  Hash,
  FileText,
  Scale,
  ChevronDown,
  ChevronUp,
  Eye,
  Building2,
  Clock,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/stores/toast-store";
import { Badge, Button, Progress, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";

/* ── Industry accent config (same as listing page) ── */
const industryAccents: Record<
  string,
  { gradient: string; border: string; badge: string; tagBg: string; tagText: string; ring: string }
> = {
  Healthcare: {
    gradient: "from-teal-400 to-teal-600",
    border: "border-teal-200",
    badge: "teal",
    tagBg: "bg-teal-50",
    tagText: "text-teal-700",
    ring: "ring-teal-200",
  },
  "Financial Services": {
    gradient: "from-gold-400 to-gold-600",
    border: "border-gold-200",
    badge: "gold",
    tagBg: "bg-gold-50",
    tagText: "text-gold-800",
    ring: "ring-gold-200",
  },
  Technology: {
    gradient: "from-brown-400 to-brown-600",
    border: "border-brown-200",
    badge: "brown",
    tagBg: "bg-brown-50",
    tagText: "text-brown-700",
    ring: "ring-brown-200",
  },
  Retail: {
    gradient: "from-forest-400 to-forest-600",
    border: "border-forest-200",
    badge: "forest",
    tagBg: "bg-forest-50",
    tagText: "text-forest-700",
    ring: "ring-forest-200",
  },
  "All Industries": {
    gradient: "from-beige-400 to-brown-400",
    border: "border-beige-200",
    badge: "beige",
    tagBg: "bg-beige-100",
    tagText: "text-beige-700",
    ring: "ring-beige-200",
  },
  Government: {
    gradient: "from-forest-500 to-teal-500",
    border: "border-forest-200",
    badge: "forest",
    tagBg: "bg-forest-50",
    tagText: "text-forest-700",
    ring: "ring-forest-200",
  },
};

/* ── Mock template detail data ── */
const mockTemplates: Record<
  string,
  {
    id: string;
    name: string;
    industry: string;
    status: "active" | "draft";
    locked: boolean;
    sections: { id: string; name: string; required: boolean; description: string }[];
    clauses: { id: string; name: string; category: string; required: boolean }[];
    sowsGenerated: number;
    lastModified: string;
    creator: string;
    createdAt: string;
    version: string;
    description: string;
  }
> = {
  "tpl-001": {
    id: "tpl-001",
    name: "Healthcare Standard SOW",
    industry: "Healthcare",
    status: "active",
    locked: true,
    description:
      "Comprehensive SOW template designed for healthcare IT projects. Includes HIPAA compliance sections, PHI handling protocols, and healthcare-specific deliverable frameworks.",
    sections: [
      { id: "s1", name: "Executive Summary", required: true, description: "High-level overview of the healthcare engagement, objectives, and expected patient-impact outcomes." },
      { id: "s2", name: "Scope of Work", required: true, description: "Detailed description of services, deliverables, and system integrations including EHR/EMR compatibility." },
      { id: "s3", name: "Technical Requirements", required: true, description: "Infrastructure, interoperability standards (HL7/FHIR), and platform specifications." },
      { id: "s4", name: "HIPAA Compliance", required: true, description: "PHI handling, encryption requirements, BAA terms, and breach notification protocols." },
      { id: "s5", name: "Data Security & Privacy", required: true, description: "Access controls, audit logging, data retention policies, and de-identification standards." },
      { id: "s6", name: "Timeline & Milestones", required: true, description: "Phase-wise delivery schedule with clinical validation gates." },
      { id: "s7", name: "Acceptance Criteria", required: true, description: "Measurable criteria for each deliverable including clinical workflow validation." },
      { id: "s8", name: "Payment Terms", required: true, description: "Milestone-based payment schedule with escrow conditions." },
      { id: "s9", name: "Team Composition", required: false, description: "Required skill sets, certifications, and healthcare domain experience." },
      { id: "s10", name: "Risk Management", required: true, description: "Risk register, mitigation strategies, and escalation procedures." },
      { id: "s11", name: "Change Management", required: false, description: "Process for handling scope changes and their impact on timeline/budget." },
      { id: "s12", name: "Quality Assurance", required: true, description: "Testing protocols, clinical validation, and quality gates." },
      { id: "s13", name: "Governance & Reporting", required: true, description: "APG monitoring rules, reporting cadence, and stakeholder communication." },
      { id: "s14", name: "Termination & Transition", required: false, description: "Exit clauses, data handover, and transition support terms." },
    ],
    clauses: [
      { id: "c1", name: "HIPAA BAA Requirement", category: "Compliance", required: true },
      { id: "c2", name: "PHI Encryption Standards", category: "Data Security", required: true },
      { id: "c3", name: "Breach Notification (72hr)", category: "Compliance", required: true },
      { id: "c4", name: "SOC 2 Type II Certification", category: "Data Security", required: true },
      { id: "c5", name: "Clinical Data De-identification", category: "Privacy", required: true },
      { id: "c6", name: "Standard Payment Net-30", category: "Payment Terms", required: true },
      { id: "c7", name: "Force Majeure", category: "Legal", required: true },
      { id: "c8", name: "IP Assignment", category: "Legal", required: true },
      { id: "c9", name: "Confidentiality (5-Year)", category: "Legal", required: true },
      { id: "c10", name: "FDA 21 CFR Part 11", category: "Compliance", required: false },
      { id: "c11", name: "Indemnification", category: "Legal", required: true },
      { id: "c12", name: "Dispute Resolution", category: "Legal", required: false },
    ],
    sowsGenerated: 8,
    lastModified: "2026-02-18T10:30:00Z",
    creator: "Priya Nair",
    createdAt: "2025-11-05T09:00:00Z",
    version: "3.2",
  },
  "tpl-002": {
    id: "tpl-002",
    name: "FinTech Compliance SOW",
    industry: "Financial Services",
    status: "active",
    locked: true,
    description:
      "SOW template for financial technology engagements with built-in regulatory compliance for PCI-DSS, SOX, and financial data handling requirements.",
    sections: [
      { id: "s1", name: "Executive Summary", required: true, description: "Engagement overview, business objectives, and regulatory context." },
      { id: "s2", name: "Scope of Work", required: true, description: "Services, deliverables, and financial system integrations." },
      { id: "s3", name: "Technical Architecture", required: true, description: "System design, API specifications, and infrastructure requirements." },
      { id: "s4", name: "Regulatory Compliance", required: true, description: "PCI-DSS, SOX, KYC/AML requirements and audit controls." },
      { id: "s5", name: "Data Security", required: true, description: "Encryption, tokenization, access controls, and penetration testing requirements." },
      { id: "s6", name: "Transaction Processing", required: true, description: "SLA for transaction throughput, latency, and error handling." },
      { id: "s7", name: "Timeline & Milestones", required: true, description: "Phase delivery with regulatory review gates." },
      { id: "s8", name: "Acceptance Criteria", required: true, description: "Functional, performance, and compliance acceptance standards." },
      { id: "s9", name: "Payment Terms", required: true, description: "Milestone-based payments with holdback provisions." },
      { id: "s10", name: "Team Composition", required: false, description: "Required certifications (CISA, CISSP) and fintech domain expertise." },
      { id: "s11", name: "Risk & Continuity", required: true, description: "Business continuity planning and disaster recovery requirements." },
      { id: "s12", name: "Audit & Reporting", required: true, description: "Audit trails, regulatory reporting, and governance framework." },
      { id: "s13", name: "Quality Assurance", required: true, description: "Testing including load testing, security scanning, and regression." },
      { id: "s14", name: "Change Management", required: false, description: "Change request process with regulatory impact assessment." },
      { id: "s15", name: "Governance & Monitoring", required: true, description: "APG rules, real-time monitoring, and anomaly detection." },
      { id: "s16", name: "Termination & Data Handling", required: true, description: "Exit terms, data purging, and certificate revocation procedures." },
    ],
    clauses: [
      { id: "c1", name: "PCI-DSS Compliance", category: "Compliance", required: true },
      { id: "c2", name: "SOX Audit Controls", category: "Compliance", required: true },
      { id: "c3", name: "KYC/AML Procedures", category: "Compliance", required: true },
      { id: "c4", name: "Data Tokenization Mandate", category: "Data Security", required: true },
      { id: "c5", name: "SOC 2 Type II Certification", category: "Data Security", required: true },
      { id: "c6", name: "Penetration Testing (Quarterly)", category: "Data Security", required: true },
      { id: "c7", name: "SLA — 99.99% Uptime", category: "Performance", required: true },
      { id: "c8", name: "Standard Payment Net-30", category: "Payment Terms", required: true },
      { id: "c9", name: "Force Majeure", category: "Legal", required: true },
      { id: "c10", name: "IP Assignment", category: "Legal", required: true },
      { id: "c11", name: "Confidentiality (7-Year)", category: "Legal", required: true },
      { id: "c12", name: "Regulatory Change Adaptation", category: "Compliance", required: false },
      { id: "c13", name: "Indemnification", category: "Legal", required: true },
      { id: "c14", name: "Dispute Resolution (Arbitration)", category: "Legal", required: true },
      { id: "c15", name: "Data Residency Requirements", category: "Compliance", required: false },
    ],
    sowsGenerated: 6,
    lastModified: "2026-02-22T14:00:00Z",
    creator: "Rahul Sharma",
    createdAt: "2025-10-20T11:00:00Z",
    version: "2.8",
  },
  "tpl-003": {
    id: "tpl-003",
    name: "Technology Platform SOW",
    industry: "Technology",
    status: "active",
    locked: true,
    description:
      "Versatile template for technology platform development projects. Covers API-first design, microservices architecture, and modern DevOps delivery.",
    sections: [
      { id: "s1", name: "Executive Summary", required: true, description: "Project vision, business case, and technology strategy." },
      { id: "s2", name: "Scope of Work", required: true, description: "Platform features, APIs, and integration points." },
      { id: "s3", name: "Technical Architecture", required: true, description: "System design, tech stack decisions, and scalability plan." },
      { id: "s4", name: "Security Requirements", required: true, description: "Authentication, authorization, encryption, and vulnerability management." },
      { id: "s5", name: "Timeline & Sprints", required: true, description: "Sprint-based delivery with demo cadence." },
      { id: "s6", name: "Acceptance Criteria", required: true, description: "Feature-level acceptance with automated test coverage targets." },
      { id: "s7", name: "Payment Terms", required: true, description: "Sprint-based payments with acceptance gates." },
      { id: "s8", name: "DevOps & CI/CD", required: false, description: "Build pipeline, deployment strategy, and monitoring setup." },
      { id: "s9", name: "Quality & Testing", required: true, description: "Unit, integration, E2E testing requirements and coverage thresholds." },
      { id: "s10", name: "Risk Management", required: true, description: "Technical risks, mitigation plans, and escalation matrix." },
      { id: "s11", name: "Governance & APG", required: true, description: "Automated monitoring rules and governance checkpoints." },
      { id: "s12", name: "Handover & Documentation", required: false, description: "Code documentation, runbooks, and knowledge transfer." },
    ],
    clauses: [
      { id: "c1", name: "SOC 2 Type II Certification", category: "Data Security", required: true },
      { id: "c2", name: "Open Source License Compliance", category: "Legal", required: true },
      { id: "c3", name: "Standard Payment Net-30", category: "Payment Terms", required: true },
      { id: "c4", name: "IP Assignment", category: "Legal", required: true },
      { id: "c5", name: "Confidentiality (3-Year)", category: "Legal", required: true },
      { id: "c6", name: "SLA — 99.9% Uptime", category: "Performance", required: false },
      { id: "c7", name: "Force Majeure", category: "Legal", required: true },
      { id: "c8", name: "Code Escrow", category: "Legal", required: false },
    ],
    sowsGenerated: 5,
    lastModified: "2026-03-01T09:15:00Z",
    creator: "Priya Nair",
    createdAt: "2025-12-01T10:00:00Z",
    version: "2.1",
  },
  "tpl-004": {
    id: "tpl-004",
    name: "Retail E-Commerce SOW",
    industry: "Retail",
    status: "active",
    locked: true,
    description:
      "Template for retail and e-commerce platform projects. Covers payment gateway integration, inventory management, and consumer data privacy.",
    sections: [
      { id: "s1", name: "Executive Summary", required: true, description: "Business objectives and e-commerce platform vision." },
      { id: "s2", name: "Scope of Work", required: true, description: "Features, integrations, and platform capabilities." },
      { id: "s3", name: "Technical Requirements", required: true, description: "Platform stack, performance benchmarks, and scalability targets." },
      { id: "s4", name: "Payment & Checkout", required: true, description: "Payment gateway specs, PCI compliance, and checkout UX requirements." },
      { id: "s5", name: "Consumer Data Privacy", required: true, description: "GDPR, CCPA compliance and consumer consent management." },
      { id: "s6", name: "Timeline & Milestones", required: true, description: "Phase delivery with seasonal readiness targets." },
      { id: "s7", name: "Acceptance Criteria", required: true, description: "Functional, performance (page load, cart), and UX acceptance." },
      { id: "s8", name: "Payment Terms", required: true, description: "Milestone-based with go-live bonus provisions." },
      { id: "s9", name: "Quality Assurance", required: true, description: "Load testing for peak traffic, accessibility (WCAG 2.1), cross-browser." },
      { id: "s10", name: "Governance & Monitoring", required: true, description: "APG rules for delivery velocity and quality metrics." },
    ],
    clauses: [
      { id: "c1", name: "PCI-DSS Compliance", category: "Compliance", required: true },
      { id: "c2", name: "GDPR Data Handling", category: "Privacy", required: true },
      { id: "c3", name: "Standard Payment Net-30", category: "Payment Terms", required: true },
      { id: "c4", name: "Performance SLA (sub-2s load)", category: "Performance", required: true },
      { id: "c5", name: "IP Assignment", category: "Legal", required: true },
      { id: "c6", name: "Confidentiality (3-Year)", category: "Legal", required: true },
      { id: "c7", name: "Accessibility (WCAG 2.1 AA)", category: "Compliance", required: false },
    ],
    sowsGenerated: 4,
    lastModified: "2026-02-28T16:45:00Z",
    creator: "Ananya Gupta",
    createdAt: "2025-12-15T14:00:00Z",
    version: "1.5",
  },
  "tpl-005": {
    id: "tpl-005",
    name: "General Purpose SOW",
    industry: "All Industries",
    status: "active",
    locked: false,
    description:
      "A flexible, industry-agnostic SOW template suitable for general technology projects. Can be customized per engagement with additional sections.",
    sections: [
      { id: "s1", name: "Executive Summary", required: true, description: "Project overview and business objectives." },
      { id: "s2", name: "Scope of Work", required: true, description: "Services, deliverables, and boundaries." },
      { id: "s3", name: "Technical Requirements", required: true, description: "Technology specifications and infrastructure needs." },
      { id: "s4", name: "Timeline & Milestones", required: true, description: "Delivery schedule with phase gates." },
      { id: "s5", name: "Acceptance Criteria", required: true, description: "Measurable acceptance standards for each deliverable." },
      { id: "s6", name: "Payment Terms", required: true, description: "Payment schedule and conditions." },
      { id: "s7", name: "Quality Assurance", required: false, description: "Testing requirements and quality gates." },
      { id: "s8", name: "Governance", required: false, description: "Monitoring, reporting, and escalation framework." },
    ],
    clauses: [
      { id: "c1", name: "Standard Payment Net-30", category: "Payment Terms", required: true },
      { id: "c2", name: "IP Assignment", category: "Legal", required: true },
      { id: "c3", name: "Confidentiality (3-Year)", category: "Legal", required: true },
      { id: "c4", name: "Force Majeure", category: "Legal", required: true },
      { id: "c5", name: "Indemnification", category: "Legal", required: false },
    ],
    sowsGenerated: 0,
    lastModified: "2026-03-04T11:00:00Z",
    creator: "Priya Nair",
    createdAt: "2026-02-20T08:00:00Z",
    version: "1.0",
  },
  "tpl-006": {
    id: "tpl-006",
    name: "Government RFP SOW",
    industry: "Government",
    status: "draft",
    locked: false,
    description:
      "Template designed for government RFP responses and public sector engagements. Includes procurement compliance, accessibility mandates, and public audit requirements.",
    sections: [
      { id: "s1", name: "Executive Summary", required: true, description: "Program overview, public value proposition, and agency alignment." },
      { id: "s2", name: "Scope of Work", required: true, description: "Services, deliverables, and contract performance standards." },
      { id: "s3", name: "Technical Architecture", required: true, description: "FedRAMP-aligned infrastructure, cloud compliance, and interoperability." },
      { id: "s4", name: "Security & Authorization", required: true, description: "FISMA compliance, ATO process, and continuous monitoring." },
      { id: "s5", name: "Accessibility (Section 508)", required: true, description: "WCAG 2.1 AA compliance, VPAT documentation, and testing." },
      { id: "s6", name: "Data Sovereignty", required: true, description: "Data residency, citizen data protection, and cross-border restrictions." },
      { id: "s7", name: "Performance Standards", required: true, description: "SLA definitions, uptime requirements, and penalty clauses." },
      { id: "s8", name: "Timeline & Milestones", required: true, description: "Phase delivery aligned with fiscal year and procurement cycles." },
      { id: "s9", name: "Acceptance Criteria", required: true, description: "Government acceptance process with independent verification." },
      { id: "s10", name: "Payment Terms", required: true, description: "Government payment schedules with procurement compliance." },
      { id: "s11", name: "Key Personnel", required: true, description: "Named key personnel requirements with replacement approval process." },
      { id: "s12", name: "Small Business Participation", required: false, description: "Subcontracting plan and small business utilization targets." },
      { id: "s13", name: "Quality Assurance", required: true, description: "IV&V requirements, testing standards, and quality metrics." },
      { id: "s14", name: "Governance & Oversight", required: true, description: "Program management office, reporting cadence, and review boards." },
      { id: "s15", name: "Change Management", required: true, description: "Engineering change proposals and contract modification procedures." },
      { id: "s16", name: "Transition & Closeout", required: true, description: "Knowledge transfer, data migration, and contract closeout procedures." },
      { id: "s17", name: "Audit & Compliance", required: true, description: "GAO audit support, record retention, and compliance monitoring." },
      { id: "s18", name: "Dispute Resolution", required: true, description: "Claims procedures, ADR methods, and Contracting Officer authority." },
    ],
    clauses: [
      { id: "c1", name: "FedRAMP Authorization", category: "Compliance", required: true },
      { id: "c2", name: "FISMA Compliance", category: "Security", required: true },
      { id: "c3", name: "Section 508 Accessibility", category: "Compliance", required: true },
      { id: "c4", name: "FAR/DFARS Compliance", category: "Procurement", required: true },
      { id: "c5", name: "FOIA Compliance", category: "Legal", required: true },
      { id: "c6", name: "Data Sovereignty (US Soil)", category: "Data Security", required: true },
      { id: "c7", name: "Key Personnel Designation", category: "Staffing", required: true },
      { id: "c8", name: "Organizational Conflict of Interest", category: "Legal", required: true },
      { id: "c9", name: "Anti-Kickback Act Compliance", category: "Legal", required: true },
      { id: "c10", name: "Service Level Agreement", category: "Performance", required: true },
      { id: "c11", name: "Government Payment (Net-30)", category: "Payment Terms", required: true },
      { id: "c12", name: "Indemnification", category: "Legal", required: true },
      { id: "c13", name: "Termination for Convenience", category: "Legal", required: true },
      { id: "c14", name: "Termination for Cause", category: "Legal", required: true },
      { id: "c15", name: "Record Retention (6-Year)", category: "Compliance", required: true },
      { id: "c16", name: "Small Business Subcontracting Plan", category: "Procurement", required: false },
      { id: "c17", name: "Truth in Negotiations (TINA)", category: "Procurement", required: false },
      { id: "c18", name: "CUI Handling Requirements", category: "Security", required: true },
      { id: "c19", name: "Continuous Monitoring", category: "Security", required: true },
      { id: "c20", name: "Dispute Resolution (Contract Disputes Act)", category: "Legal", required: true },
    ],
    sowsGenerated: 0,
    lastModified: "2026-03-05T08:30:00Z",
    creator: "Rahul Sharma",
    createdAt: "2026-03-01T09:00:00Z",
    version: "0.4",
  },
};

/* ── Format date ── */
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ── Section Row ── */
function SectionRow({
  section,
  index,
  accent,
}: {
  section: { id: string; name: string; required: boolean; description: string };
  index: number;
  accent: (typeof industryAccents)[string];
}) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      className={cn(
        "rounded-xl border border-beige-200/50 bg-white/60 backdrop-blur-sm overflow-hidden transition-all duration-200",
        expanded && "ring-1",
        expanded && accent.ring
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 w-full p-4 text-left hover:bg-beige-50/40 transition-colors"
      >
        <span
          className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0",
            accent.tagBg,
            accent.tagText
          )}
        >
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-brown-900">{section.name}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {section.required ? (
            <Badge variant="forest" size="sm">Required</Badge>
          ) : (
            <Badge variant="beige" size="sm">Optional</Badge>
          )}
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-beige-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-beige-400" />
          )}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-0">
          <div className="pl-10">
            <p className="text-[12px] text-brown-700/80 leading-relaxed">
              {section.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   TEMPLATE DETAIL PAGE
   ================================================================ */
export default function TemplateDetailPage() {
  const params = useParams();
  const templateId = params.templateId as string;
  const template = mockTemplates[templateId];

  if (!template) {
    notFound();
  }

  const accent = industryAccents[template.industry] ?? industryAccents["All Industries"];
  const requiredSections = template.sections.filter((s) => s.required).length;
  const requiredClauses = template.clauses.filter((c) => c.required).length;

  /* Group clauses by category */
  const clausesByCategory = template.clauses.reduce<Record<string, typeof template.clauses>>(
    (acc, clause) => {
      if (!acc[clause.category]) acc[clause.category] = [];
      acc[clause.category].push(clause);
      return acc;
    },
    {}
  );

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* ── Back + Header ── */}
      <div className="animate-fade-up">
        <Link
          href="/enterprise/admin/config/templates"
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-teal-600 hover:text-teal-700 transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Templates
        </Link>

        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-hidden">
          {/* Industry gradient bar */}
          <div className={cn("h-2 bg-gradient-to-r", accent.gradient)} />

          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md shrink-0",
                      accent.gradient
                    )}
                  >
                    <FileStack className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-[20px] font-bold text-brown-900 tracking-[-0.02em] font-heading">
                      {template.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={accent.badge as "teal" | "gold" | "brown" | "forest" | "beige"}
                        size="sm"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {template.industry}
                      </Badge>
                      <Badge
                        variant={template.status === "active" ? "forest" : "beige"}
                        size="sm"
                        dot
                      >
                        {template.status === "active" ? "Active" : "Draft"}
                      </Badge>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md",
                          template.locked
                            ? "bg-brown-100 text-brown-700"
                            : "bg-beige-100 text-beige-600"
                        )}
                      >
                        {template.locked ? (
                          <Lock className="w-2.5 h-2.5" />
                        ) : (
                          <Unlock className="w-2.5 h-2.5" />
                        )}
                        {template.locked ? "Locked" : "Unlocked"}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-[12px] text-brown-700/80 leading-relaxed mt-3 max-w-2xl">
                  {template.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast.info(
                      "Duplicate Template",
                      "A copy of this template would be created."
                    )
                  }
                >
                  <Copy className="w-3.5 h-3.5" />
                  Duplicate
                </Button>
                <Button
                  variant="gradient-primary"
                  size="sm"
                  onClick={() =>
                    toast.info(
                      "Edit Template",
                      "Template editor would open here."
                    )
                  }
                  disabled={template.locked}
                >
                  <Settings className="w-3.5 h-3.5" />
                  Edit
                </Button>
              </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-beige-100">
              <div className="flex items-center gap-1.5 text-[11px] text-beige-500">
                <BookOpen className="w-3 h-3" />
                <span>v{template.version}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-beige-500">
                <User className="w-3 h-3" />
                <span>{template.creator}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-beige-500">
                <Calendar className="w-3 h-3" />
                <span>Created {fmtDate(template.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-beige-500">
                <Clock className="w-3 h-3" />
                <span>Modified {fmtDate(template.lastModified)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-beige-500">
                <Sparkles className="w-3 h-3" />
                <span>{template.sowsGenerated} SOWs generated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-up [animation-delay:50ms]">
        {[
          {
            label: "Total Sections",
            value: template.sections.length,
            icon: Hash,
            accent: "bg-brown-100 text-brown-600",
          },
          {
            label: "Required Sections",
            value: requiredSections,
            icon: CheckCircle2,
            accent: "bg-forest-100 text-forest-600",
          },
          {
            label: "Total Clauses",
            value: template.clauses.length,
            icon: Scale,
            accent: "bg-teal-100 text-teal-600",
          },
          {
            label: "Required Clauses",
            value: requiredClauses,
            icon: Shield,
            accent: "bg-gold-100 text-gold-700",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4"
          >
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                stat.accent
              )}
            >
              <stat.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[18px] font-bold text-brown-900 leading-none">
                {stat.value}
              </p>
              <p className="text-[10px] text-beige-500 font-medium mt-0.5">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs: Sections / Clauses ── */}
      <div className="animate-fade-up [animation-delay:100ms]">
        <Tabs defaultValue="sections">
          <TabsList>
            <TabsTrigger value="sections">
              <FileText className="w-3.5 h-3.5" />
              Sections ({template.sections.length})
            </TabsTrigger>
            <TabsTrigger value="clauses">
              <Scale className="w-3.5 h-3.5" />
              Clauses ({template.clauses.length})
            </TabsTrigger>
          </TabsList>

          {/* Sections tab */}
          <TabsContent value="sections" className="mt-4 space-y-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] text-beige-500">
                {requiredSections} required, {template.sections.length - requiredSections} optional
              </p>
              <div className="flex items-center gap-2">
                <Progress
                  value={(requiredSections / template.sections.length) * 100}
                  className="w-24 h-1.5"
                />
                <span className="text-[10px] text-beige-500 font-medium">
                  {Math.round((requiredSections / template.sections.length) * 100)}% required
                </span>
              </div>
            </div>
            {template.sections.map((section, i) => (
              <SectionRow key={section.id} section={section} index={i} accent={accent} />
            ))}
          </TabsContent>

          {/* Clauses tab */}
          <TabsContent value="clauses" className="mt-4 space-y-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[12px] text-beige-500">
                {requiredClauses} required, {template.clauses.length - requiredClauses} optional
              </p>
              <div className="flex items-center gap-2">
                <Progress
                  value={(requiredClauses / template.clauses.length) * 100}
                  className="w-24 h-1.5"
                />
                <span className="text-[10px] text-beige-500 font-medium">
                  {Math.round((requiredClauses / template.clauses.length) * 100)}% required
                </span>
              </div>
            </div>

            {Object.entries(clausesByCategory).map(([category, clauses]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full bg-gradient-to-r", accent.gradient)} />
                  <h3 className="text-[12px] font-bold text-brown-800 uppercase tracking-wider">
                    {category}
                  </h3>
                  <span className="text-[10px] text-beige-400 font-medium">
                    ({clauses.length})
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-3.5">
                  {clauses.map((clause) => (
                    <div
                      key={clause.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-beige-200/50 bg-white/60 backdrop-blur-sm"
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
                          clause.required
                            ? "bg-forest-100 text-forest-600"
                            : "bg-beige-100 text-beige-400"
                        )}
                      >
                        {clause.required ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-brown-900 truncate">
                          {clause.name}
                        </p>
                      </div>
                      <Badge
                        variant={clause.required ? "forest" : "beige"}
                        size="sm"
                      >
                        {clause.required ? "Required" : "Optional"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Hallucination Prevention Info (if locked) ── */}
      {template.locked && (
        <div className="rounded-2xl border border-teal-200/50 bg-gradient-to-br from-teal-50/60 to-forest-50/40 backdrop-blur-sm p-5 animate-fade-up [animation-delay:150ms]">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-forest-500 flex items-center justify-center shadow-md shrink-0">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[13px] font-bold text-brown-900 mb-1">
                Template Locked — AI Constrained
              </h3>
              <p className="text-[11px] text-brown-700/80 leading-relaxed">
                This template is locked as part of GlimmoraTeam&apos;s hallucination prevention
                architecture. The AI cannot invent sections, omit required clauses, or deviate
                from this approved structure when generating SOWs. All {template.sections.length} sections
                and {template.clauses.length} clauses are enforced.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
