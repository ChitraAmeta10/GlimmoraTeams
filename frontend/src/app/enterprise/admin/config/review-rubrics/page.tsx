"use client";

import * as React from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  Plus,
  Copy,
  Pencil,
  Eye,
  ToggleLeft,
  ToggleRight,
  ArrowLeft,
  Target,
  Scale,
  Award,
  Loader2,
  Check,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/stores/toast-store";
import {
  Badge,
  Button,
  Input,
  Label,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui";

/* ── Mock review rubric templates ── */
const mockRubrics = [
  {
    id: "rub-001",
    name: "Code Review Standard",
    description: "Standard rubric for evaluating code deliverables — correctness, style, tests, documentation",
    applicableTypes: ["Backend", "Frontend", "Full-Stack"],
    criteriaCount: 5,
    usageCount: 34,
    status: "active" as const,
    updatedAt: "2026-02-10T10:00:00Z",
    criteria: [
      { name: "Correctness", weight: 30, scale: "1-5", guidance: "Does the code produce correct output for all specified inputs?" },
      { name: "Code Quality", weight: 25, scale: "1-5", guidance: "Clean code, proper naming, no code smells" },
      { name: "Test Coverage", weight: 20, scale: "1-5", guidance: "Unit tests, integration tests, edge cases covered" },
      { name: "Documentation", weight: 15, scale: "1-5", guidance: "Inline comments, API docs, README updates" },
      { name: "Performance", weight: 10, scale: "1-5", guidance: "Response times, memory usage, query optimization" },
    ],
  },
  {
    id: "rub-002",
    name: "Design Deliverable",
    description: "Rubric for UI/UX design deliverables — usability, accessibility, brand alignment",
    applicableTypes: ["Design", "UX", "Figma"],
    criteriaCount: 4,
    usageCount: 12,
    status: "active" as const,
    updatedAt: "2026-02-18T14:30:00Z",
    criteria: [
      { name: "Usability", weight: 35, scale: "1-5", guidance: "Intuitive navigation, clear hierarchy, minimal clicks" },
      { name: "Accessibility", weight: 25, scale: "Pass-Fail", guidance: "WCAG 2.1 AA compliance, color contrast, screen reader support" },
      { name: "Brand Alignment", weight: 20, scale: "1-5", guidance: "Consistent with brand guidelines, color palette, typography" },
      { name: "Responsiveness", weight: 20, scale: "1-5", guidance: "Works on mobile, tablet, desktop breakpoints" },
    ],
  },
  {
    id: "rub-003",
    name: "Data Pipeline Review",
    description: "Rubric for data engineering deliverables — accuracy, performance, monitoring",
    applicableTypes: ["Data", "ETL", "Analytics"],
    criteriaCount: 4,
    usageCount: 8,
    status: "active" as const,
    updatedAt: "2026-03-01T09:00:00Z",
    criteria: [
      { name: "Data Accuracy", weight: 35, scale: "1-5", guidance: "Output data matches expected results, no data loss" },
      { name: "Pipeline Performance", weight: 25, scale: "1-5", guidance: "Execution time, resource usage, scalability" },
      { name: "Error Handling", weight: 25, scale: "1-5", guidance: "Graceful failures, retry logic, alerting" },
      { name: "Monitoring", weight: 15, scale: "1-5", guidance: "Logging, metrics, dashboard setup" },
    ],
  },
  {
    id: "rub-004",
    name: "DevOps Infrastructure",
    description: "Rubric for infrastructure and DevOps deliverables",
    applicableTypes: ["DevOps", "AWS", "Terraform"],
    criteriaCount: 5,
    usageCount: 0,
    status: "draft" as const,
    updatedAt: "2026-03-04T16:00:00Z",
    criteria: [
      { name: "Security", weight: 30, scale: "1-5", guidance: "IAM policies, encryption, network isolation" },
      { name: "Reliability", weight: 25, scale: "1-5", guidance: "High availability, disaster recovery, failover" },
      { name: "Automation", weight: 20, scale: "1-5", guidance: "IaC coverage, CI/CD integration, auto-scaling" },
      { name: "Cost Efficiency", weight: 15, scale: "1-5", guidance: "Right-sizing, reserved instances, waste elimination" },
      { name: "Observability", weight: 10, scale: "1-5", guidance: "Monitoring, logging, alerting, dashboards" },
    ],
  },
];

/* ── Weight bar colors ── */
const weightColors = ["bg-brown-400", "bg-teal-400", "bg-gold-400", "bg-forest-400", "bg-brown-300"];

/* ── Create Rubric Dialog ── */
function CreateRubricDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [types, setTypes] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleCreate = () => {
    if (!name.trim()) { setError("Rubric name is required"); return; }
    setSaving(true);
    setTimeout(() => {
      toast.success("Rubric Created", `"${name.trim()}" would be added as a draft.`);
      setSaving(false);
      setOpen(false);
      setName("");
      setDescription("");
      setTypes("");
      setError("");
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setName(""); setDescription(""); setTypes(""); setError(""); } }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-brown-900 font-heading">Create Review Rubric</DialogTitle>
          <DialogDescription className="text-beige-500">
            Define a new review rubric template. You can add criteria after creation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rubric-name" className="text-[12px] text-brown-700">Rubric Name</Label>
            <Input
              id="rubric-name"
              placeholder="e.g. QA Testing Review"
              value={name}
              onChange={(e) => { setName(e.target.value); if (error) setError(""); }}
            />
            {error && <p className="text-[11px] text-red-500">{error}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="rubric-desc" className="text-[12px] text-brown-700">Description</Label>
            <Textarea
              id="rubric-desc"
              placeholder="What does this rubric evaluate..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-20 text-[12px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rubric-types" className="text-[12px] text-brown-700">Applicable Types (comma-separated)</Label>
            <Input
              id="rubric-types"
              placeholder="e.g. QA, Testing, Automation"
              value={types}
              onChange={(e) => setTypes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => { setOpen(false); setName(""); setDescription(""); setTypes(""); setError(""); }}>Cancel</Button>
          <Button variant="gradient-primary" size="sm" onClick={handleCreate} disabled={saving}>
            {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Creating...</> : <><Check className="w-3.5 h-3.5" />Create Rubric</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Rubric Card ── */
function RubricCard({
  rubric,
}: {
  rubric: (typeof mockRubrics)[0];
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [status, setStatus] = React.useState(rubric.status);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [cloneOpen, setCloneOpen] = React.useState(false);

  // Edit form state
  const [editName, setEditName] = React.useState(rubric.name);
  const [editDescription, setEditDescription] = React.useState(rubric.description);
  const [editTypes, setEditTypes] = React.useState(rubric.applicableTypes.join(", "));
  const [editSaving, setEditSaving] = React.useState(false);

  const updatedDate = new Date(rubric.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleToggleStatus = () => {
    const newStatus = status === "active" ? "draft" : "active";
    setStatus(newStatus);
    toast.success(
      newStatus === "active" ? "Rubric Activated" : "Rubric Deactivated",
      `"${rubric.name}" is now ${newStatus === "active" ? "active" : "deactivated"}.`
    );
  };

  const handleEditSave = () => {
    if (!editName.trim()) {
      toast.error("Validation Error", "Rubric name is required.");
      return;
    }
    setEditSaving(true);
    setTimeout(() => {
      setEditSaving(false);
      setEditOpen(false);
      toast.success("Rubric Updated", `"${editName.trim()}" saved successfully.`);
    }, 500);
  };

  const handleCloneConfirm = () => {
    setCloneOpen(false);
    toast.success("Rubric Cloned", `A copy of "${rubric.name}" has been created as a draft.`);
  };

  return (
    <>
      <div className="group rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-hidden hover:shadow-xl hover:shadow-brown-100/15 transition-all duration-300">
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-50 to-forest-50 flex items-center justify-center group-hover:from-teal-100 group-hover:to-forest-100 transition-colors">
                <ClipboardCheck className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-brown-900">
                  {rubric.name}
                </h3>
                <p className="text-[11px] text-beige-500 mt-0.5">
                  {rubric.description}
                </p>
              </div>
            </div>
            <Badge
              variant={status === "active" ? "forest" : "beige"}
              size="sm"
              dot
            >
              {status === "active" ? "Active" : "Draft"}
            </Badge>
          </div>

          {/* Applicable types */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {rubric.applicableTypes.map((type) => (
              <span
                key={type}
                className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-beige-100 text-beige-600"
              >
                {type}
              </span>
            ))}
          </div>

          {/* Weight distribution bar */}
          <div className="mb-3">
            <p className="text-[10px] text-beige-500 font-medium mb-1.5">
              Criteria Weight Distribution
            </p>
            <div className="flex h-2.5 rounded-full overflow-hidden gap-px">
              {rubric.criteria.map((c, i) => (
                <div
                  key={c.name}
                  className={cn("rounded-full", weightColors[i % weightColors.length])}
                  style={{ width: `${c.weight}%` }}
                  title={`${c.name}: ${c.weight}%`}
                />
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 pt-3 border-t border-beige-100">
            <div>
              <p className="text-[16px] font-bold text-brown-800">
                {rubric.criteriaCount}
              </p>
              <p className="text-[10px] text-beige-500">Criteria</p>
            </div>
            <div>
              <p className="text-[16px] font-bold text-teal-700">
                {rubric.usageCount}
              </p>
              <p className="text-[10px] text-beige-500">Reviews</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-[10px] text-beige-500">Updated</p>
              <p className="text-[11px] text-brown-700 font-medium">
                {updatedDate}
              </p>
            </div>
          </div>
        </div>

        {/* Expandable criteria detail */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-beige-50/50 border-t border-beige-100 text-[11px] font-medium text-beige-600 hover:text-brown-700 hover:bg-beige-100/50 transition-colors"
        >
          {expanded ? "Hide" : "View"} Criteria Details
        </button>

        {expanded && (
          <div className="border-t border-beige-100 p-4 space-y-2.5 bg-beige-50/30">
            {rubric.criteria.map((criterion, i) => (
              <div
                key={criterion.name}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-beige-200/40"
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white text-[10px] font-bold",
                    weightColors[i % weightColors.length]
                  )}
                >
                  {criterion.weight}%
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-semibold text-brown-900">
                      {criterion.name}
                    </p>
                    <Badge variant="beige" size="sm">
                      {criterion.scale}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-beige-500 mt-0.5 leading-relaxed">
                    {criterion.guidance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 p-4 pt-2 border-t border-beige-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="w-3 h-3" />
            Preview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditName(rubric.name);
              setEditDescription(rubric.description);
              setEditTypes(rubric.applicableTypes.join(", "));
              setEditOpen(true);
            }}
          >
            <Pencil className="w-3 h-3" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCloneOpen(true)}
          >
            <Copy className="w-3 h-3" />
            Clone
          </Button>
          {status === "active" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleStatus}
              className="ml-auto text-beige-600 hover:text-gold-700 hover:bg-gold-50"
            >
              <ToggleRight className="w-3.5 h-3.5" />
              Deactivate
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleStatus}
              className="ml-auto text-forest-600 hover:text-forest-700 hover:bg-forest-50"
            >
              <ToggleLeft className="w-3.5 h-3.5" />
              Activate
            </Button>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-brown-900 font-heading flex items-center gap-2">
              <Eye className="w-4 h-4 text-teal-600" />
              {rubric.name}
            </DialogTitle>
            <DialogDescription className="text-beige-500">
              {rubric.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-beige-500">Status:</span>
              <Badge variant={status === "active" ? "forest" : "beige"} size="sm" dot>
                {status === "active" ? "Active" : "Draft"}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[11px] font-medium text-beige-500 mr-1">Types:</span>
              {rubric.applicableTypes.map((type) => (
                <span key={type} className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-beige-100 text-beige-600">{type}</span>
              ))}
            </div>
            <div className="border-t border-beige-100 pt-3 space-y-2.5">
              <p className="text-[11px] font-semibold text-brown-800">Criteria ({rubric.criteriaCount})</p>
              {rubric.criteria.map((criterion, i) => (
                <div key={criterion.name} className="flex items-start gap-3 p-3 rounded-xl bg-beige-50/50 border border-beige-200/40">
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white text-[10px] font-bold", weightColors[i % weightColors.length])}>
                    {criterion.weight}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] font-semibold text-brown-900">{criterion.name}</p>
                      <Badge variant="beige" size="sm">{criterion.scale}</Badge>
                    </div>
                    <p className="text-[10px] text-beige-500 mt-0.5 leading-relaxed">{criterion.guidance}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brown-900 font-heading flex items-center gap-2">
              <Pencil className="w-4 h-4 text-brown-500" />
              Edit Rubric
            </DialogTitle>
            <DialogDescription className="text-beige-500">
              Update the rubric details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor={`edit-name-${rubric.id}`} className="text-[12px] text-brown-700">Rubric Name</Label>
              <Input
                id={`edit-name-${rubric.id}`}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`edit-desc-${rubric.id}`} className="text-[12px] text-brown-700">Description</Label>
              <Textarea
                id={`edit-desc-${rubric.id}`}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="h-20 text-[12px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`edit-types-${rubric.id}`} className="text-[12px] text-brown-700">Applicable Types (comma-separated)</Label>
              <Input
                id={`edit-types-${rubric.id}`}
                value={editTypes}
                onChange={(e) => setEditTypes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">Cancel</Button>
            </DialogClose>
            <Button variant="gradient-primary" size="sm" onClick={handleEditSave} disabled={editSaving}>
              {editSaving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</> : <><Check className="w-3.5 h-3.5" />Save Changes</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clone Confirmation Dialog */}
      <Dialog open={cloneOpen} onOpenChange={setCloneOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-brown-900 font-heading flex items-center gap-2">
              <Copy className="w-4 h-4 text-teal-600" />
              Clone Rubric
            </DialogTitle>
            <DialogDescription className="text-beige-500">
              Create a copy of <strong>&ldquo;{rubric.name}&rdquo;</strong>? The clone will be saved as a draft.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">Cancel</Button>
            </DialogClose>
            <Button variant="gradient-primary" size="sm" onClick={handleCloneConfirm}>
              <Copy className="w-3.5 h-3.5" />
              Clone Rubric
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ══════════════════════════════════════════
   REVIEW RUBRIC CONFIGURATION PAGE (H7)
   ══════════════════════════════════════════ */
export default function ReviewRubricsPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 animate-fade-up">
        <div>
          <Link
            href="/enterprise/admin/config"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-teal-600 hover:text-teal-700 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to General
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-forest-500 flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em] font-heading">
              Review Rubrics
            </h1>
          </div>
          <p className="text-[13px] text-beige-500 mt-1">
            Configure review rubric templates for evaluating deliverables. Each rubric
            defines criteria, weights, and scoring scales used by mentors and reviewers.
          </p>
        </div>
        <CreateRubricDialog
          trigger={
            <Button variant="gradient-primary" size="sm">
              <Plus className="w-3.5 h-3.5" />
              Create Rubric
            </Button>
          }
        />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 animate-fade-up [animation-delay:50ms]">
        {[
          {
            label: "Active Rubrics",
            value: mockRubrics.filter((r) => r.status === "active").length,
            icon: Award,
            accent: "bg-forest-100 text-forest-600",
          },
          {
            label: "Total Reviews",
            value: mockRubrics.reduce((s, r) => s + r.usageCount, 0),
            icon: ClipboardCheck,
            accent: "bg-teal-100 text-teal-600",
          },
          {
            label: "Avg Criteria",
            value: Math.round(mockRubrics.reduce((s, r) => s + r.criteriaCount, 0) / mockRubrics.length),
            icon: Target,
            accent: "bg-gold-100 text-gold-700",
          },
          {
            label: "Draft Rubrics",
            value: mockRubrics.filter((r) => r.status === "draft").length,
            icon: Scale,
            accent: "bg-brown-100 text-brown-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.accent)}>
              <stat.icon className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[20px] font-bold text-brown-900 tracking-tight leading-none">
                {stat.value}
              </p>
              <p className="text-[10px] text-beige-500 font-medium mt-1">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Rubric cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-up [animation-delay:100ms]">
        {mockRubrics.map((rubric) => (
          <RubricCard key={rubric.id} rubric={rubric} />
        ))}
      </div>
    </div>
  );
}
