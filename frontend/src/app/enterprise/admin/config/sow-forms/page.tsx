"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Copy,
  Pencil,
  Eye,
  ToggleLeft,
  ToggleRight,
  ArrowLeft,
  Calendar,
  Hash,
  Type,
  List,
  Upload,
  GripVertical,
  Trash2,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/stores/toast-store";
import {
  Badge,
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui";

/* ── Types ── */
interface Template {
  id: string;
  name: string;
  description: string;
  fieldCount: number;
  usageCount: number;
  status: "active" | "draft";
  isDefault: boolean;
  updatedAt: string;
}

interface EditorField {
  id: string;
  label: string;
  type: string;
  required: boolean;
}

/* ── Initial mock SOW intake form templates ── */
const initialTemplates: Template[] = [
  {
    id: "tpl-001",
    name: "Standard SOW Template",
    description: "Default template with all standard fields for IT project SOWs",
    fieldCount: 14,
    usageCount: 12,
    status: "active",
    isDefault: true,
    updatedAt: "2026-02-15T10:00:00Z",
  },
  {
    id: "tpl-002",
    name: "Quick Brief Template",
    description: "Simplified template for small projects under $50K",
    fieldCount: 8,
    usageCount: 5,
    status: "active",
    isDefault: false,
    updatedAt: "2026-02-20T14:30:00Z",
  },
  {
    id: "tpl-003",
    name: "Enterprise RFP Template",
    description: "Comprehensive template for large-scale enterprise RFP responses",
    fieldCount: 22,
    usageCount: 3,
    status: "active",
    isDefault: false,
    updatedAt: "2026-03-01T09:15:00Z",
  },
  {
    id: "tpl-004",
    name: "Maintenance & Support",
    description: "Template for ongoing maintenance and support contracts",
    fieldCount: 10,
    usageCount: 0,
    status: "draft",
    isDefault: false,
    updatedAt: "2026-03-04T11:00:00Z",
  },
];

/* ── Field type icons ── */
const fieldTypeIcons: Record<string, React.ElementType> = {
  text: Type,
  date: Calendar,
  number: Hash,
  dropdown: List,
  file: Upload,
};

/* ── Default fields for new templates ── */
const defaultEditorFields: EditorField[] = [
  { id: "f-01", label: "Project Title", type: "text", required: true },
  { id: "f-02", label: "Client Name", type: "text", required: true },
  { id: "f-03", label: "Start Date", type: "date", required: true },
  { id: "f-04", label: "End Date", type: "date", required: true },
  { id: "f-05", label: "Stakeholders", type: "text", required: true },
  { id: "f-06", label: "Confidentiality Level", type: "dropdown", required: true },
];

/* ── Mock fields per template (for preview / edit dialogs) ── */
const templateFieldsMap: Record<string, EditorField[]> = {
  "tpl-001": [
    { id: "f-01", label: "Project Title", type: "text", required: true },
    { id: "f-02", label: "Client Name", type: "text", required: true },
    { id: "f-03", label: "Start Date", type: "date", required: true },
    { id: "f-04", label: "End Date", type: "date", required: true },
    { id: "f-05", label: "Budget", type: "number", required: true },
    { id: "f-06", label: "Stakeholders", type: "text", required: true },
    { id: "f-07", label: "Confidentiality Level", type: "dropdown", required: true },
    { id: "f-08", label: "Scope Description", type: "text", required: true },
    { id: "f-09", label: "Deliverables", type: "text", required: true },
    { id: "f-10", label: "Acceptance Criteria", type: "text", required: false },
    { id: "f-11", label: "Milestone Count", type: "number", required: false },
    { id: "f-12", label: "Risk Level", type: "dropdown", required: false },
    { id: "f-13", label: "Attachments", type: "file", required: false },
    { id: "f-14", label: "Notes", type: "text", required: false },
  ],
  "tpl-002": [
    { id: "f-01", label: "Project Title", type: "text", required: true },
    { id: "f-02", label: "Client Name", type: "text", required: true },
    { id: "f-03", label: "Start Date", type: "date", required: true },
    { id: "f-04", label: "End Date", type: "date", required: true },
    { id: "f-05", label: "Budget", type: "number", required: true },
    { id: "f-06", label: "Scope Summary", type: "text", required: true },
    { id: "f-07", label: "Deliverables", type: "text", required: true },
    { id: "f-08", label: "Attachments", type: "file", required: false },
  ],
  "tpl-003": [
    { id: "f-01", label: "RFP Reference", type: "text", required: true },
    { id: "f-02", label: "Enterprise Name", type: "text", required: true },
    { id: "f-03", label: "Start Date", type: "date", required: true },
    { id: "f-04", label: "End Date", type: "date", required: true },
    { id: "f-05", label: "Total Budget", type: "number", required: true },
    { id: "f-06", label: "Stakeholders", type: "text", required: true },
    { id: "f-07", label: "Confidentiality Level", type: "dropdown", required: true },
    { id: "f-08", label: "Compliance Requirements", type: "text", required: true },
    { id: "f-09", label: "Scope of Work", type: "text", required: true },
    { id: "f-10", label: "Deliverables List", type: "text", required: true },
    { id: "f-11", label: "Acceptance Criteria", type: "text", required: true },
    { id: "f-12", label: "Milestone Count", type: "number", required: true },
    { id: "f-13", label: "Milestone Definitions", type: "text", required: true },
    { id: "f-14", label: "Risk Assessment", type: "dropdown", required: true },
    { id: "f-15", label: "Team Requirements", type: "text", required: true },
    { id: "f-16", label: "SLA Definitions", type: "text", required: true },
    { id: "f-17", label: "Payment Terms", type: "dropdown", required: true },
    { id: "f-18", label: "Penalty Clauses", type: "text", required: false },
    { id: "f-19", label: "IP Ownership", type: "dropdown", required: true },
    { id: "f-20", label: "Warranty Period", type: "number", required: false },
    { id: "f-21", label: "Supporting Documents", type: "file", required: false },
    { id: "f-22", label: "Additional Notes", type: "text", required: false },
  ],
  "tpl-004": [
    { id: "f-01", label: "Contract Title", type: "text", required: true },
    { id: "f-02", label: "Client Name", type: "text", required: true },
    { id: "f-03", label: "Start Date", type: "date", required: true },
    { id: "f-04", label: "End Date", type: "date", required: true },
    { id: "f-05", label: "Monthly Budget", type: "number", required: true },
    { id: "f-06", label: "Support Hours", type: "number", required: true },
    { id: "f-07", label: "SLA Tier", type: "dropdown", required: true },
    { id: "f-08", label: "Escalation Contact", type: "text", required: false },
    { id: "f-09", label: "Scope Description", type: "text", required: true },
    { id: "f-10", label: "Attachments", type: "file", required: false },
  ],
};

/* ── Field type options for new fields ── */
const fieldTypeOptions = ["text", "date", "number", "dropdown", "file"];

/* ── Template Card ── */
function TemplateCard({
  template,
  onClone,
  onToggleStatus,
  onPreview,
  onEdit,
}: {
  template: Template;
  onClone: (template: Template) => void;
  onToggleStatus: (templateId: string) => void;
  onPreview: (template: Template) => void;
  onEdit: (template: Template) => void;
}) {
  const updatedDate = new Date(template.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 hover:shadow-xl hover:shadow-brown-100/15 hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brown-50 to-beige-100 flex items-center justify-center group-hover:from-brown-100 group-hover:to-beige-200 transition-colors">
            <FileText className="w-5 h-5 text-brown-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-bold text-brown-900">
                {template.name}
              </h3>
              {template.isDefault && (
                <Badge variant="brown" size="sm">Default</Badge>
              )}
            </div>
            <p className="text-[11px] text-beige-500 mt-0.5">
              {template.description}
            </p>
          </div>
        </div>
        <Badge
          variant={template.status === "active" ? "forest" : "beige"}
          size="sm"
          dot
        >
          {template.status === "active" ? "Active" : "Draft"}
        </Badge>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-6 mt-4 pt-3 border-t border-beige-100">
        <div>
          <p className="text-[16px] font-bold text-brown-800">
            {template.fieldCount}
          </p>
          <p className="text-[10px] text-beige-500">Fields</p>
        </div>
        <div>
          <p className="text-[16px] font-bold text-teal-700">
            {template.usageCount}
          </p>
          <p className="text-[10px] text-beige-500">SOWs Created</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-[10px] text-beige-500">Updated</p>
          <p className="text-[11px] text-brown-700 font-medium">
            {updatedDate}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-beige-100">
        <Button variant="ghost" size="sm" onClick={() => onPreview(template)}>
          <Eye className="w-3 h-3" />
          Preview
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEdit(template)}>
          <Pencil className="w-3 h-3" />
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onClone(template)}>
          <Copy className="w-3 h-3" />
          Clone
        </Button>
        {template.status === "active" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleStatus(template.id)}
            className="ml-auto text-beige-600 hover:text-gold-700 hover:bg-gold-50"
          >
            <ToggleRight className="w-3.5 h-3.5" />
            Deactivate
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleStatus(template.id)}
            className="ml-auto text-forest-600 hover:text-forest-700 hover:bg-forest-50"
          >
            <ToggleLeft className="w-3.5 h-3.5" />
            Activate
          </Button>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SOW INTAKE FORM CONFIGURATION PAGE (H6)
   ══════════════════════════════════════════ */
export default function SowIntakeFormsPage() {
  const [showEditor, setShowEditor] = React.useState(false);
  const [templates, setTemplates] = React.useState<Template[]>(initialTemplates);
  const [editorFields, setEditorFields] = React.useState<EditorField[]>([...defaultEditorFields]);
  const [templateName, setTemplateName] = React.useState("");
  const [templateDesc, setTemplateDesc] = React.useState("");

  /* ── Preview dialog state ── */
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewTarget, setPreviewTarget] = React.useState<Template | null>(null);

  /* ── Edit dialog state ── */
  const [editOpen, setEditOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Template | null>(null);
  const [editName, setEditName] = React.useState("");
  const [editDesc, setEditDesc] = React.useState("");
  const [editFields, setEditFields] = React.useState<EditorField[]>([]);

  /* ── Computed stats ── */
  const activeCount = templates.filter((t) => t.status === "active").length;
  const draftCount = templates.filter((t) => t.status === "draft").length;
  const totalSOWs = templates.reduce((s, t) => s + t.usageCount, 0);

  /* ── Clone a template ── */
  const handleClone = (template: Template) => {
    const cloned: Template = {
      ...template,
      id: `tpl-${Date.now()}`,
      name: `${template.name} (Copy)`,
      isDefault: false,
      usageCount: 0,
      status: "draft",
      updatedAt: new Date().toISOString(),
    };
    setTemplates((prev) => [...prev, cloned]);
    toast.success("Template Cloned", `"${cloned.name}" has been created as a draft.`);
  };

  /* ── Toggle active/draft status ── */
  const handleToggleStatus = (templateId: string) => {
    const target = templates.find((t) => t.id === templateId);
    if (!target) return;
    const newStatus = target.status === "active" ? "draft" : "active";
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === templateId
          ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
          : t
      )
    );
    toast.success(
      newStatus === "active" ? "Template Activated" : "Template Deactivated",
      `"${target.name}" is now ${newStatus === "active" ? "active" : "inactive"}.`
    );
  };

  /* ── Open editor (always opens, never toggles closed) ── */
  const handleOpenEditor = () => {
    if (!showEditor) {
      setEditorFields([...defaultEditorFields]);
      setTemplateName("");
      setTemplateDesc("");
    }
    setShowEditor(true);
  };

  /* ── Remove a field from the editor ── */
  const handleRemoveField = (fieldId: string) => {
    if (editorFields.length <= 1) {
      toast.error("Cannot Remove", "Template must have at least one field.");
      return;
    }
    const removed = editorFields.find((f) => f.id === fieldId);
    setEditorFields((prev) => prev.filter((f) => f.id !== fieldId));
    toast.info("Field Removed", `"${removed?.label}" has been removed.`);
  };

  /* ── Add a new field ── */
  const handleAddField = () => {
    const newField: EditorField = {
      id: `f-new-${Date.now()}`,
      label: `New Field ${editorFields.length + 1}`,
      type: fieldTypeOptions[Math.floor(Math.random() * fieldTypeOptions.length)],
      required: false,
    };
    setEditorFields((prev) => [...prev, newField]);
    toast.success("Field Added", `"${newField.label}" added to template.`);
  };

  /* ── Save new template ── */
  const handleSave = () => {
    if (!templateName.trim()) {
      toast.error("Validation Error", "Template name is required.");
      return;
    }
    if (editorFields.length === 0) {
      toast.error("Validation Error", "Template must have at least one field.");
      return;
    }
    const newTemplate: Template = {
      id: `tpl-${Date.now()}`,
      name: templateName.trim(),
      description: templateDesc.trim() || "No description provided",
      fieldCount: editorFields.length,
      usageCount: 0,
      status: "draft",
      isDefault: false,
      updatedAt: new Date().toISOString(),
    };
    setTemplates((prev) => [...prev, newTemplate]);
    setShowEditor(false);
    setTemplateName("");
    setTemplateDesc("");
    setEditorFields([...defaultEditorFields]);
    toast.success("Template Saved", `"${newTemplate.name}" has been created as a draft.`);
  };

  /* ── Cancel editor ── */
  const handleCancel = () => {
    setShowEditor(false);
    setTemplateName("");
    setTemplateDesc("");
    setEditorFields([...defaultEditorFields]);
  };

  /* ── Open preview dialog ── */
  const handlePreview = (template: Template) => {
    setPreviewTarget(template);
    setPreviewOpen(true);
  };

  /* ── Open edit dialog ── */
  const handleEdit = (template: Template) => {
    setEditTarget(template);
    setEditName(template.name);
    setEditDesc(template.description);
    const fields = templateFieldsMap[template.id] ?? defaultEditorFields.slice(0, template.fieldCount);
    setEditFields(fields.map((f) => ({ ...f })));
    setEditOpen(true);
  };

  /* ── Save edit dialog ── */
  const handleEditSave = () => {
    if (!editTarget) return;
    if (!editName.trim()) {
      toast.error("Validation Error", "Template name is required.");
      return;
    }
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === editTarget.id
          ? {
              ...t,
              name: editName.trim(),
              description: editDesc.trim() || t.description,
              fieldCount: editFields.length,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    setEditOpen(false);
    toast.success("Template Updated", `"${editName.trim()}" has been saved.`);
  };

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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brown-500 to-brown-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em] font-heading">
              SOW Intake Forms
            </h1>
          </div>
          <p className="text-[13px] text-beige-500 mt-1">
            Configure intake form templates for SOW creation. Each template defines
            the fields available when users create SOWs via the structured form.
          </p>
        </div>
        <Button
          variant="gradient-primary"
          size="sm"
          onClick={handleOpenEditor}
        >
          <Plus className="w-3.5 h-3.5" />
          Create Template
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up [animation-delay:50ms]">
        {[
          { label: "Active Templates", value: activeCount, accent: "bg-forest-100 text-forest-600" },
          { label: "Total SOWs Created", value: totalSOWs, accent: "bg-teal-100 text-teal-600" },
          { label: "Draft Templates", value: draftCount, accent: "bg-gold-100 text-gold-700" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5"
          >
            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", stat.accent)}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[22px] font-bold text-brown-900 tracking-tight leading-none">
                {stat.value}
              </p>
              <p className="text-[11px] text-beige-500 font-medium mt-1">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Editor preview (toggleable) */}
      {showEditor && (
        <div className="rounded-2xl border-2 border-dashed border-brown-200 bg-gradient-to-br from-brown-50/40 to-white/80 p-6 space-y-4 animate-fade-up">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-brown-900">
              New Template Editor
            </h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="gradient-primary"
                size="sm"
                onClick={handleSave}
              >
                <Save className="w-3.5 h-3.5" />
                Save Template
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-brown-700 uppercase tracking-wider mb-1.5 block">
                Template Name
              </label>
              <Input
                placeholder="e.g., Standard SOW Template"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-brown-700 uppercase tracking-wider mb-1.5 block">
                Description
              </label>
              <Input
                placeholder="Brief description of this template..."
                value={templateDesc}
                onChange={(e) => setTemplateDesc(e.target.value)}
              />
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-brown-700 uppercase tracking-wider mb-2">
              Form Fields ({editorFields.length})
            </p>
            <div className="space-y-2">
              {editorFields.map((field) => {
                const FieldIcon = fieldTypeIcons[field.type] || Type;
                return (
                  <div
                    key={field.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-beige-200/60 bg-white/80"
                  >
                    <GripVertical className="w-3.5 h-3.5 text-beige-300" />
                    <FieldIcon className="w-3.5 h-3.5 text-beige-500" />
                    <span className="text-[12px] font-medium text-brown-800 flex-1">
                      {field.label}
                    </span>
                    <Badge
                      variant={field.required ? "brown" : "beige"}
                      size="sm"
                    >
                      {field.required ? "Required" : "Optional"}
                    </Badge>
                    <span className="text-[10px] text-beige-500 capitalize">
                      {field.type}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleRemoveField(field.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                className="w-full border-dashed"
                onClick={handleAddField}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Field
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Template cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-up [animation-delay:100ms]">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onClone={handleClone}
            onToggleStatus={handleToggleStatus}
            onPreview={handlePreview}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* ── Preview Dialog ── */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brown-900 font-heading">
              {previewTarget?.name}
            </DialogTitle>
            <DialogDescription className="text-beige-500">
              {previewTarget?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <p className="text-[11px] font-semibold text-brown-700 uppercase tracking-wider">
              Fields ({(templateFieldsMap[previewTarget?.id ?? ""] ?? []).length})
            </p>
            {(templateFieldsMap[previewTarget?.id ?? ""] ?? []).map((field) => {
              const FieldIcon = fieldTypeIcons[field.type] || Type;
              return (
                <div
                  key={field.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-beige-200/60 bg-beige-50/40"
                >
                  <FieldIcon className="w-3.5 h-3.5 text-beige-500" />
                  <span className="text-[12px] font-medium text-brown-800 flex-1">
                    {field.label}
                  </span>
                  <Badge
                    variant={field.required ? "brown" : "beige"}
                    size="sm"
                  >
                    {field.required ? "Required" : "Optional"}
                  </Badge>
                  <span className="text-[10px] text-beige-500 capitalize">
                    {field.type}
                  </span>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Dialog ── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brown-900 font-heading">
              Edit Template
            </DialogTitle>
            <DialogDescription className="text-beige-500">
              Update the template name, description, and fields.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-[11px] font-semibold text-brown-700 uppercase tracking-wider mb-1.5 block">
                Template Name
              </label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Template name"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-brown-700 uppercase tracking-wider mb-1.5 block">
                Description
              </label>
              <Input
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Brief description..."
              />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-brown-700 uppercase tracking-wider mb-2">
                Fields ({editFields.length})
              </p>
              <div className="space-y-2">
                {editFields.map((field, idx) => {
                  const FieldIcon = fieldTypeIcons[field.type] || Type;
                  return (
                    <div
                      key={field.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-beige-200/60 bg-white/80"
                    >
                      <GripVertical className="w-3.5 h-3.5 text-beige-300" />
                      <FieldIcon className="w-3.5 h-3.5 text-beige-500" />
                      <Input
                        value={field.label}
                        onChange={(e) => {
                          const updated = [...editFields];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setEditFields(updated);
                        }}
                        className="flex-1 h-7 text-[12px]"
                      />
                      <Badge
                        variant={field.required ? "brown" : "beige"}
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => {
                          const updated = [...editFields];
                          updated[idx] = { ...updated[idx], required: !updated[idx].required };
                          setEditFields(updated);
                        }}
                      >
                        {field.required ? "Required" : "Optional"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          if (editFields.length <= 1) return;
                          setEditFields((prev) => prev.filter((f) => f.id !== field.id));
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-dashed"
                  onClick={() => {
                    setEditFields((prev) => [
                      ...prev,
                      {
                        id: `f-edit-${Date.now()}`,
                        label: `New Field ${prev.length + 1}`,
                        type: fieldTypeOptions[Math.floor(Math.random() * fieldTypeOptions.length)],
                        required: false,
                      },
                    ]);
                  }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Field
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleEditSave}>
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
