"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  Code2,
  FileJson,
  FileCheck,
  Download,
  Eye,
  Clock,
  User2,
  Calendar,
  Layers,
  CheckCircle2,
  RotateCcw,
  XCircle,
  MessageSquare,
  ChevronRight,
  Sparkles,
  Shield,
  GitCompare,
  ListChecks,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, slideInRight } from "@/lib/utils/motion-variants";
import { Badge, Button, Textarea } from "@/components/ui";
import { StatusTimeline } from "@/components/enterprise/status-timeline";
import { mockDeliverables, mockProjects, mockMilestones } from "@/mocks/data/enterprise-projects";
import { toast } from "@/lib/stores/toast-store";

/* ══════════════════════════════════════════
   F1 — Review Evidence Pack
   Evidence checklist, mentor review display,
   version comparison, two-panel layout
   ══════════════════════════════════════════ */

/* ── Mock evidence files with checklist status ── */
const mockEvidenceFiles = [
  { name: "api-endpoints-spec.pdf", type: "pdf", size: "2.4 MB", icon: FileText, submittedAt: "2026-03-03T14:00:00Z", status: "verified" as const },
  { name: "screenshot-ledger-ui.png", type: "image", size: "1.1 MB", icon: ImageIcon, submittedAt: "2026-03-03T14:02:00Z", status: "verified" as const },
  { name: "general-ledger.service.ts", type: "code", size: "18 KB", icon: Code2, submittedAt: "2026-03-03T14:05:00Z", status: "pending" as const },
  { name: "test-results.json", type: "json", size: "42 KB", icon: FileJson, submittedAt: "2026-03-03T14:08:00Z", status: "pending" as const },
  { name: "integration-report.pdf", type: "pdf", size: "890 KB", icon: FileText, submittedAt: "2026-03-03T14:10:00Z", status: "verified" as const },
];

/* ── Mock mentor review data ── */
const mockMentorReview = {
  reviewerId: "mentor-R4H",
  reviewerName: "Mentor R-4H",
  decision: "approved_with_notes" as const,
  score: 4.6,
  reviewedAt: "2026-03-04T09:30:00Z",
  notes: "Code quality is strong with proper error handling. Test coverage meets threshold at 94%. Recommend minor optimization of the query batch processing logic in the service layer for production scale. All API endpoints match the SOW specification.",
  criteria: [
    { label: "Code Quality", score: 4.8, maxScore: 5 },
    { label: "Test Coverage", score: 4.5, maxScore: 5 },
    { label: "SOW Alignment", score: 4.7, maxScore: 5 },
    { label: "Documentation", score: 4.4, maxScore: 5 },
  ],
};

/* ── Mock version history ── */
const mockVersions = [
  { version: "v3", submittedAt: "2026-03-03T14:00:00Z", filesChanged: 3, status: "current" as const, notes: "Addressed rework feedback — improved error handling and added batch processing." },
  { version: "v2", submittedAt: "2026-03-01T10:00:00Z", filesChanged: 5, status: "superseded" as const, notes: "Updated API endpoints and test suite based on review comments." },
  { version: "v1", submittedAt: "2026-02-28T16:00:00Z", filesChanged: 5, status: "superseded" as const, notes: "Initial submission with all required evidence files." },
];

const fileTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  pdf: { bg: "bg-brown-50", text: "text-brown-600", border: "border-brown-200/50" },
  image: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200/50" },
  code: { bg: "bg-forest-50", text: "text-forest-600", border: "border-forest-200/50" },
  json: { bg: "bg-gold-50", text: "text-gold-700", border: "border-gold-200/50" },
};

const statusBadgeMap: Record<string, "gold" | "forest" | "danger" | "brown"> = {
  pending: "gold",
  approved: "forest",
  rejected: "danger",
  rework: "brown",
};

const evidenceStatusConfig: Record<string, { label: string; cls: string }> = {
  verified: { label: "Verified", cls: "bg-forest-50 text-forest-700" },
  pending: { label: "Pending", cls: "bg-gold-50 text-gold-700" },
  rejected: { label: "Rejected", cls: "bg-brown-100 text-brown-700" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/* ══════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════ */
export default function ReviewDetailPage() {
  const params = useParams();
  const deliverableId = params.deliverableId as string;

  const deliverable = mockDeliverables.find((d) => d.id === deliverableId) ?? mockDeliverables[0];
  const project = mockProjects.find((p) => p.id === deliverable.projectId);
  const milestone = mockMilestones.find((m) => m.id === deliverable.milestoneId);

  const [selectedFile, setSelectedFile] = React.useState(0);
  const [activeAction, setActiveAction] = React.useState<"approve" | "rework" | "reject" | null>(null);
  const [actionNotes, setActionNotes] = React.useState("");
  /* Derive initial decision state from mock data (already-decided deliverables) */
  const initialDecision = deliverable.decidedAt
    ? deliverable.decision === "approved"
      ? "approve" as const
      : deliverable.decision === "rework_requested"
        ? "rework" as const
        : deliverable.decision === "rejected"
          ? "reject" as const
          : null
    : null;

  const [confirmedDecision, setConfirmedDecision] = React.useState<"approve" | "rework" | "reject" | null>(initialDecision);

  /* Sync decision state when navigating between deliverables */
  React.useEffect(() => {
    setConfirmedDecision(initialDecision);
    setActiveAction(null);
    setActionNotes("");
    setSelectedFile(0);
  }, [deliverableId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConfirmDecision = () => {
    if (!activeAction) return;
    if ((activeAction === "rework" || activeAction === "reject") && !actionNotes.trim()) {
      toast.error("Required", activeAction === "rework" ? "Please provide rework instructions." : "Please provide a rejection reason.");
      return;
    }
    setConfirmedDecision(activeAction);
    setActiveAction(null);
    if (activeAction === "approve") {
      toast.success("Deliverable Approved", "Payout eligibility triggered. Contributor has been notified.");
    } else if (activeAction === "rework") {
      toast.success("Rework Requested", "Contributor has been notified with your feedback.");
    } else {
      toast.success("Deliverable Rejected", "Decision recorded. Task may need reassignment.");
    }
    setActionNotes("");
  };

  /* Effective status reflects local confirmed decision */
  const effectiveStatus = confirmedDecision
    ? confirmedDecision === "approve" ? "approved" : confirmedDecision === "rework" ? "rework" : "rejected"
    : deliverable.status;

  const effectiveDecisionLabel = confirmedDecision
    ? confirmedDecision === "approve" ? "Approved" : confirmedDecision === "rework" ? "Rework Requested" : "Rejected"
    : deliverable.decision === "approved"
      ? "Approved"
      : deliverable.decision === "rework_requested"
        ? "Rework Requested"
        : deliverable.decision === "rejected"
          ? "Rejected"
          : "Pending review";

  const isDecided = !!confirmedDecision || !!deliverable.decidedAt;

  const timelineSteps = [
    {
      label: "Submitted",
      description: `By ${deliverable.submittedBy}`,
      timestamp: formatDate(deliverable.submittedAt),
      status: "completed" as const,
    },
    {
      label: "Evidence Uploaded",
      description: `${mockEvidenceFiles.length} files attached`,
      status: "completed" as const,
    },
    {
      label: "Mentor Reviewed",
      description: `Score: ${mockMentorReview.score}/5`,
      timestamp: formatDate(mockMentorReview.reviewedAt),
      status: "completed" as const,
    },
    {
      label: "Enterprise Review",
      description: isDecided ? "Review completed" : "Awaiting your decision",
      status: isDecided ? ("completed" as const) : ("current" as const),
    },
    {
      label: "Decision",
      description: effectiveDecisionLabel,
      timestamp: deliverable.decidedAt ? formatDate(deliverable.decidedAt) : confirmedDecision ? "Just now" : undefined,
      status: isDecided ? ("completed" as const) : ("upcoming" as const),
    },
  ];

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
          href="/enterprise/review"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Review Queue
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-beige-400" />
        <span className="text-beige-500 truncate max-w-[200px]">
          {deliverable.title}
        </span>
      </motion.div>

      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-brown-900 tracking-tight font-heading">
              {deliverable.title}
            </h1>
            <Badge variant={statusBadgeMap[effectiveStatus] ?? "gold"} size="md" dot>
              {effectiveStatus.charAt(0).toUpperCase() + effectiveStatus.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-beige-600">
            <Link href={`/enterprise/projects/${deliverable.projectId}`} className="text-teal-600 hover:text-teal-700 transition-colors">
              {project?.title ?? "Project"}
            </Link>
            {" "}&middot; {milestone?.title ?? "Milestone"}
          </p>
        </div>
      </motion.div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT: Evidence Files + Checklist (3/5) */}
        <motion.div variants={fadeUp} className="lg:col-span-3 space-y-4">
          {/* Evidence Checklist */}
          <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-teal-500" />
                <h2 className="text-sm font-semibold text-brown-800">
                  Evidence Checklist
                </h2>
                <Badge variant="teal" size="sm">
                  {mockEvidenceFiles.filter((f) => f.status === "verified").length}/{mockEvidenceFiles.length} verified
                </Badge>
              </div>
              <button
                onClick={() => toast.info("Download All", "Batch download requires backend integration.")}
                className="text-[11px] text-teal-600 font-medium hover:text-teal-700 transition-colors flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Download All
              </button>
            </div>

            <div className="space-y-2">
              {mockEvidenceFiles.map((file, i) => {
                const colors = fileTypeColors[file.type] || fileTypeColors.pdf;
                const FileIcon = file.icon;
                const statusConf = evidenceStatusConfig[file.status];
                return (
                  <button
                    key={file.name}
                    onClick={() => setSelectedFile(i)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left group",
                      selectedFile === i
                        ? "border-teal-300 bg-teal-50/50 shadow-sm"
                        : "border-beige-100/60 bg-white/50 hover:border-beige-200 hover:bg-beige-50/40"
                    )}
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                        colors.bg
                      )}
                    >
                      <FileIcon className={cn("w-4 h-4", colors.text)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-brown-800 truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-beige-500">{file.size}</span>
                        <span className="text-beige-300">&middot;</span>
                        <span className="text-[10px] text-beige-500">{formatShortDate(file.submittedAt)}</span>
                      </div>
                    </div>
                    {/* Status badge */}
                    <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-md shrink-0", statusConf.cls)}>
                      {statusConf.label}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-3.5 h-3.5 text-beige-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview Area */}
          <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-beige-100/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-beige-400" />
                <span className="text-[13px] font-semibold text-brown-800">
                  Preview
                </span>
                <span className="text-[11px] text-beige-500">
                  &mdash; {mockEvidenceFiles[selectedFile].name}
                </span>
              </div>
              <button
                onClick={() => toast.info("Download File", "File download requires backend integration.")}
                className="text-[11px] text-teal-600 font-medium hover:text-teal-700 flex items-center gap-1 transition-colors"
              >
                <Download className="w-3 h-3" />
                Download
              </button>
            </div>

            <div className="h-[280px] flex items-center justify-center bg-gradient-to-br from-beige-50 to-beige-100/50 relative">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm border border-beige-200/60 flex items-center justify-center mx-auto shadow-sm">
                  {React.createElement(mockEvidenceFiles[selectedFile].icon, {
                    className: cn(
                      "w-7 h-7",
                      fileTypeColors[mockEvidenceFiles[selectedFile].type]?.text ?? "text-brown-400"
                    ),
                  })}
                </div>
                <div>
                  <p className="text-sm font-semibold text-brown-700">
                    {mockEvidenceFiles[selectedFile].name}
                  </p>
                  <p className="text-[11px] text-beige-500 mt-0.5">
                    {mockEvidenceFiles[selectedFile].size} &middot;{" "}
                    {mockEvidenceFiles[selectedFile].type.toUpperCase()} file
                  </p>
                </div>
                <button
                  onClick={() => toast.success("Opening Preview", `${mockEvidenceFiles[selectedFile].name} opened in viewer.`)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-beige-200 text-[12px] font-medium text-brown-700 hover:border-brown-300 transition-colors shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Open Full Preview
                </button>
              </div>

              <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-beige-200/60 rounded-tl-lg" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-beige-200/60 rounded-br-lg" />
            </div>
          </div>

          {/* Mentor Review Section */}
          <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-500" />
                <h3 className="text-sm font-semibold text-brown-800">
                  Mentor Review
                </h3>
                <Badge variant="forest" size="sm" dot>
                  {mockMentorReview.decision === "approved_with_notes" ? "Approved w/ Notes" : "Approved"}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                <span className="text-[13px] font-bold text-brown-800">{mockMentorReview.score}</span>
                <span className="text-[10px] text-beige-500">/5</span>
              </div>
            </div>

            {/* Criteria scores */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {mockMentorReview.criteria.map((c) => (
                <div key={c.label} className="flex items-center justify-between p-2.5 rounded-lg bg-beige-50/60 border border-beige-100/50">
                  <span className="text-[11px] font-medium text-brown-700">{c.label}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-1.5 bg-beige-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold-400 rounded-full"
                        style={{ width: `${(c.score / c.maxScore) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-brown-700">{c.score}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Review notes */}
            <div className="p-3 rounded-xl bg-gold-50/60 border border-gold-100/60">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                  R4
                </div>
                <span className="text-[11px] font-semibold text-brown-800">{mockMentorReview.reviewerName}</span>
                <span className="text-[10px] text-beige-400">&middot; {formatShortDate(mockMentorReview.reviewedAt)}</span>
              </div>
              <p className="text-[12px] text-brown-700 leading-relaxed italic">
                &ldquo;{mockMentorReview.notes}&rdquo;
              </p>
            </div>
          </div>

          {/* Version Comparison */}
          <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <GitCompare className="w-4 h-4 text-teal-500" />
              <h3 className="text-sm font-semibold text-brown-800">
                Version History
              </h3>
            </div>

            <div className="space-y-3">
              {mockVersions.map((ver, i) => (
                <div
                  key={ver.version}
                  className={cn(
                    "rounded-xl border p-4 transition-all",
                    ver.status === "current"
                      ? "border-teal-300 bg-teal-50/30"
                      : "border-beige-100/60 bg-white/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[11px] font-bold px-2 py-0.5 rounded-md",
                        ver.status === "current"
                          ? "bg-teal-100 text-teal-700"
                          : "bg-beige-100 text-beige-600"
                      )}>
                        {ver.version}
                      </span>
                      {ver.status === "current" && (
                        <Badge variant="teal" size="sm">Current</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-beige-500">
                      <Clock className="w-3 h-3" />
                      {formatShortDate(ver.submittedAt)}
                      <span className="text-beige-300">&middot;</span>
                      <span>{ver.filesChanged} files changed</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-brown-600 leading-relaxed">
                    {ver.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT: Review Panel (2/5) */}
        <motion.div variants={slideInRight} className="lg:col-span-2 space-y-4">
          {/* Deliverable Info */}
          <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-brown-500" />
              <h2 className="text-sm font-semibold text-brown-800">
                Deliverable Info
              </h2>
            </div>

            <div className="space-y-3">
              {[
                { label: "Task ID", value: deliverable.taskId, icon: FileCheck },
                { label: "Submitted By", value: deliverable.submittedBy, icon: User2 },
                {
                  label: "Submitted",
                  value: formatDate(deliverable.submittedAt),
                  icon: Calendar,
                },
                {
                  label: "Evidence",
                  value: `${mockEvidenceFiles.length} files`,
                  icon: Layers,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2 border-b border-beige-100/60 last:border-b-0"
                >
                  <div className="flex items-center gap-2 text-[12px] text-beige-500">
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </div>
                  <span className="text-[12px] font-medium text-brown-800">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Timeline */}
          <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-teal-500" />
              <h2 className="text-sm font-semibold text-brown-800">
                Review Progress
              </h2>
            </div>
            <StatusTimeline steps={timelineSteps} />
          </div>

          {/* Previous Review Notes */}
          {deliverable.reviewerNotes && (
            <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-gold-500" />
                <h2 className="text-sm font-semibold text-brown-800">
                  Previous Review Notes
                </h2>
              </div>
              <div className="p-3 rounded-xl bg-gold-50/60 border border-gold-100/60">
                <p className="text-[12px] text-brown-700 leading-relaxed italic">
                  &ldquo;{deliverable.reviewerNotes}&rdquo;
                </p>
                {deliverable.decidedAt && (
                  <p className="text-[10px] text-beige-400 mt-2">
                    {formatDate(deliverable.decidedAt)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Decision Actions */}
          <div className="rounded-2xl border border-beige-200/50 bg-gradient-to-br from-white/80 to-beige-50/40 backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileCheck className="w-4 h-4 text-brown-500" />
              <h2 className="text-sm font-semibold text-brown-800">
                Decision
              </h2>
            </div>

            {confirmedDecision ? (
              <div className="text-center space-y-3">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center mx-auto",
                  confirmedDecision === "approve" ? "bg-forest-100" : confirmedDecision === "rework" ? "bg-gold-100" : "bg-brown-100"
                )}>
                  {confirmedDecision === "approve" ? (
                    <CheckCircle2 className="w-6 h-6 text-forest-600" />
                  ) : confirmedDecision === "rework" ? (
                    <RotateCcw className="w-6 h-6 text-gold-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-brown-600" />
                  )}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-brown-900">
                    {confirmedDecision === "approve" ? "Deliverable Approved" : confirmedDecision === "rework" ? "Rework Requested" : "Deliverable Rejected"}
                  </p>
                  <p className="text-[11px] text-beige-500 mt-0.5">Decision recorded &middot; Contributor notified</p>
                </div>
                <Link
                  href="/enterprise/review"
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Back to Review Queue
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <Button
                    variant="gradient-forest"
                    size="md"
                    className="w-full justify-center"
                    onClick={() => setActiveAction(activeAction === "approve" ? null : "approve")}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Deliverable
                  </Button>

                  <Button
                    variant="gold"
                    size="md"
                    className="w-full justify-center border-[1.5px] border-gold-400 bg-transparent text-gold-700 hover:bg-gold-50 shadow-none hover:shadow-none hover:translate-y-0"
                    onClick={() => setActiveAction(activeAction === "rework" ? null : "rework")}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Request Rework
                  </Button>

                  <Button
                    variant="danger"
                    size="md"
                    className="w-full justify-center bg-transparent text-[var(--danger)] border-[1.5px] border-[var(--danger)] hover:bg-[var(--danger-light)] shadow-none hover:shadow-none hover:translate-y-0"
                    onClick={() => setActiveAction(activeAction === "reject" ? null : "reject")}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                </div>

                {/* Expandable action form */}
                {activeAction && (
                  <div className="mt-4 pt-3 border-t border-beige-200/50 space-y-3">
                    <h4 className="text-[12px] font-semibold text-brown-800 capitalize">
                      {activeAction === "approve"
                        ? "Approval Notes (optional)"
                        : activeAction === "rework"
                          ? "Rework Instructions (required)"
                          : "Rejection Reason (required)"}
                    </h4>
                    <Textarea
                      placeholder={
                        activeAction === "approve"
                          ? "Add optional notes for the contributor..."
                          : activeAction === "rework"
                            ? "Describe what needs to be changed or improved..."
                            : "Explain why this deliverable is being rejected..."
                      }
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        variant={activeAction === "approve" ? "gradient-forest" : activeAction === "rework" ? "gold" : "danger"}
                        size="sm"
                        className="flex-1 justify-center"
                        onClick={handleConfirmDecision}
                      >
                        Confirm {activeAction === "approve" ? "Approval" : activeAction === "rework" ? "Rework Request" : "Rejection"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setActiveAction(null);
                          setActionNotes("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {!confirmedDecision && !activeAction && (
              <div className="mt-4 pt-3 border-t border-beige-200/50">
                <Link
                  href={`/enterprise/review/${deliverableId}/feedback`}
                  className="flex items-center justify-center gap-2 text-[12px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Provide Structured Feedback
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
