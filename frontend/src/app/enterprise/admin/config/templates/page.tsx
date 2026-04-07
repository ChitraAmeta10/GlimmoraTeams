"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileStack,
  Plus,
  ArrowLeft,
  Shield,
  Lock,
  Unlock,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  Settings,
  Copy,
  Eye,
  Sparkles,
  Building2,
  Loader2,
  Check,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/stores/toast-store";
import {
  Button,
  Badge,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui";

/* ── Industry accent config ── */
const industryAccents: Record<
  string,
  { gradient: string; border: string; badge: string; tagBg: string; tagText: string }
> = {
  Healthcare: {
    gradient: "from-teal-400 to-teal-600",
    border: "border-t-teal-400",
    badge: "teal",
    tagBg: "bg-teal-50",
    tagText: "text-teal-700",
  },
  "Financial Services": {
    gradient: "from-gold-400 to-gold-600",
    border: "border-t-gold-400",
    badge: "gold",
    tagBg: "bg-gold-50",
    tagText: "text-gold-800",
  },
  Technology: {
    gradient: "from-brown-400 to-brown-600",
    border: "border-t-brown-400",
    badge: "brown",
    tagBg: "bg-brown-50",
    tagText: "text-brown-700",
  },
  Retail: {
    gradient: "from-forest-400 to-forest-600",
    border: "border-t-forest-400",
    badge: "forest",
    tagBg: "bg-forest-50",
    tagText: "text-forest-700",
  },
  "All Industries": {
    gradient: "from-beige-400 to-brown-400",
    border: "border-t-beige-400",
    badge: "beige",
    tagBg: "bg-beige-100",
    tagText: "text-beige-700",
  },
  Government: {
    gradient: "from-forest-500 to-teal-500",
    border: "border-t-forest-500",
    badge: "forest",
    tagBg: "bg-forest-50",
    tagText: "text-forest-700",
  },
};

/* ── Mock template data ── */
const mockTemplates = [
  {
    id: "tpl-001",
    name: "Healthcare Standard SOW",
    industry: "Healthcare",
    status: "active" as const,
    locked: true,
    sections: 14,
    clauses: 12,
    sowsGenerated: 8,
    lastModified: "2026-02-18T10:30:00Z",
    creator: "Priya Nair",
  },
  {
    id: "tpl-002",
    name: "FinTech Compliance SOW",
    industry: "Financial Services",
    status: "active" as const,
    locked: true,
    sections: 16,
    clauses: 15,
    sowsGenerated: 6,
    lastModified: "2026-02-22T14:00:00Z",
    creator: "Rahul Sharma",
  },
  {
    id: "tpl-003",
    name: "Technology Platform SOW",
    industry: "Technology",
    status: "active" as const,
    locked: true,
    sections: 12,
    clauses: 8,
    sowsGenerated: 5,
    lastModified: "2026-03-01T09:15:00Z",
    creator: "Priya Nair",
  },
  {
    id: "tpl-004",
    name: "Retail E-Commerce SOW",
    industry: "Retail",
    status: "active" as const,
    locked: true,
    sections: 10,
    clauses: 7,
    sowsGenerated: 4,
    lastModified: "2026-02-28T16:45:00Z",
    creator: "Ananya Gupta",
  },
  {
    id: "tpl-005",
    name: "General Purpose SOW",
    industry: "All Industries",
    status: "active" as const,
    locked: false,
    sections: 8,
    clauses: 5,
    sowsGenerated: 0,
    lastModified: "2026-03-04T11:00:00Z",
    creator: "Priya Nair",
  },
  {
    id: "tpl-006",
    name: "Government RFP SOW",
    industry: "Government",
    status: "draft" as const,
    locked: false,
    sections: 18,
    clauses: 20,
    sowsGenerated: 0,
    lastModified: "2026-03-05T08:30:00Z",
    creator: "Rahul Sharma",
  },
];

const industryOptions = ["Healthcare", "Financial Services", "Technology", "Retail", "Government", "Manufacturing", "Education"];

/* ── Create Template Dialog ── */
function CreateTemplateDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [industry, setIndustry] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleCreate = () => {
    if (!name.trim()) { setError("Template name is required"); return; }
    if (!industry) { setError("Select an industry"); return; }
    setSaving(true);
    setTimeout(() => {
      toast.success("Template Created", `"${name.trim()}" would be added as a draft.`);
      setSaving(false);
      setOpen(false);
      setName("");
      setIndustry("");
      setError("");
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setName(""); setIndustry(""); setError(""); } }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-brown-900 font-heading">Create SOW Template</DialogTitle>
          <DialogDescription className="text-beige-500">
            Define a new industry-specific template with required sections
            and compliance clauses.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tpl-name" className="text-[12px] text-brown-700">Template Name</Label>
            <Input
              id="tpl-name"
              placeholder="e.g. Manufacturing QA SOW"
              value={name}
              onChange={(e) => { setName(e.target.value); if (error) setError(""); }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tpl-industry" className="text-[12px] text-brown-700">Industry</Label>
            <Select value={industry} onValueChange={(v) => { setIndustry(v); if (error) setError(""); }}>
              <SelectTrigger id="tpl-industry">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industryOptions.map((ind) => (
                  <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-[11px] text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="gradient-primary" size="sm" onClick={handleCreate} disabled={saving}>
            {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Creating...</> : <><Sparkles className="w-3.5 h-3.5" />Create</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Template Card ── */
function TemplateCard({
  template,
  onDuplicate,
  onEdit,
}: {
  template: (typeof mockTemplates)[0];
  onDuplicate: (template: (typeof mockTemplates)[0]) => void;
  onEdit: (template: (typeof mockTemplates)[0]) => void;
}) {
  const accent = industryAccents[template.industry] ?? industryAccents["All Industries"];
  const modifiedDate = new Date(template.lastModified).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-hidden",
        "hover:shadow-xl hover:shadow-brown-100/20 transition-all duration-300 hover:-translate-y-0.5"
      )}
    >
      {/* Industry gradient strip */}
      <div className={cn("h-1.5 bg-gradient-to-r", accent.gradient)} />

      <div className="p-5">
        {/* Header: name + status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-bold text-brown-900 leading-snug group-hover:text-brown-950 transition-colors">
              {template.name}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge
                variant={accent.badge as "teal" | "gold" | "brown" | "forest" | "beige"}
                size="sm"
              >
                <Tag className="w-2.5 h-2.5" />
                {template.industry}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
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

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col items-center p-2.5 rounded-xl bg-beige-50/60 border border-beige-100/60">
            <p className="text-[16px] font-bold text-brown-800 leading-none">
              {template.sections}
            </p>
            <p className="text-[9px] text-beige-500 font-medium mt-1">Sections</p>
          </div>
          <div className="flex flex-col items-center p-2.5 rounded-xl bg-beige-50/60 border border-beige-100/60">
            <p className="text-[16px] font-bold text-teal-700 leading-none">
              {template.clauses}
            </p>
            <p className="text-[9px] text-beige-500 font-medium mt-1">Clauses</p>
          </div>
          <div className="flex flex-col items-center p-2.5 rounded-xl bg-beige-50/60 border border-beige-100/60">
            <p className={cn(
              "text-[16px] font-bold leading-none",
              template.sowsGenerated > 0 ? "text-gold-700" : "text-beige-400"
            )}>
              {template.sowsGenerated}
            </p>
            <p className="text-[9px] text-beige-500 font-medium mt-1">SOWs</p>
          </div>
        </div>

        {/* Meta: last modified + creator */}
        <div className="flex items-center justify-between pt-3 border-t border-beige-100">
          <div className="flex items-center gap-1.5 text-[10px] text-beige-500">
            <Calendar className="w-3 h-3" />
            <span>{modifiedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-beige-500">
            <User className="w-3 h-3" />
            <span>{template.creator}</span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-1 px-4 py-3 bg-beige-50/40 border-t border-beige-100">
        <Link href={`/enterprise/admin/config/templates/${template.id}`}>
          <Button variant="ghost" size="sm">
            <Eye className="w-3.5 h-3.5" />
            View
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDuplicate(template)}
        >
          <Copy className="w-3.5 h-3.5" />
          Duplicate
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(template)}
        >
          <Settings className="w-3.5 h-3.5" />
          Edit
        </Button>
      </div>
    </div>
  );
}

/* ================================================================
   SOW TEMPLATES GOVERNANCE PAGE
   ================================================================ */
type TemplateItem = (typeof mockTemplates)[0];

export default function SOWTemplatesPage() {
  const [search, setSearch] = React.useState("");

  /* ── Duplicate dialog state ── */
  const [duplicateOpen, setDuplicateOpen] = React.useState(false);
  const [duplicateTarget, setDuplicateTarget] = React.useState<TemplateItem | null>(null);
  const [duplicateName, setDuplicateName] = React.useState("");

  /* ── Edit dialog state ── */
  const [editOpen, setEditOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<TemplateItem | null>(null);
  const [editName, setEditName] = React.useState("");
  const [editIndustry, setEditIndustry] = React.useState("");
  const [editSections, setEditSections] = React.useState("");
  const [editClauses, setEditClauses] = React.useState("");

  /* ── Duplicate handlers ── */
  const handleOpenDuplicate = (template: TemplateItem) => {
    setDuplicateTarget(template);
    setDuplicateName(`${template.name} (Copy)`);
    setDuplicateOpen(true);
  };

  const handleConfirmDuplicate = () => {
    if (!duplicateTarget || !duplicateName.trim()) return;
    setDuplicateOpen(false);
    toast.success("Template Duplicated", `"${duplicateName.trim()}" has been created as a draft.`);
  };

  /* ── Edit handlers ── */
  const handleOpenEdit = (template: TemplateItem) => {
    setEditTarget(template);
    setEditName(template.name);
    setEditIndustry(template.industry);
    setEditSections(String(template.sections));
    setEditClauses(String(template.clauses));
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editTarget) return;
    if (!editName.trim()) {
      toast.error("Validation Error", "Template name is required.");
      return;
    }
    setEditOpen(false);
    toast.success("Template Updated", `"${editName.trim()}" has been saved.`);
  };

  const filtered = mockTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.industry.toLowerCase().includes(search.toLowerCase()) ||
      t.creator.toLowerCase().includes(search.toLowerCase())
  );

  const totalTemplates = mockTemplates.length;
  const activeCount = mockTemplates.filter((t) => t.status === "active").length;
  const industries = new Set(mockTemplates.map((t) => t.industry)).size;
  const totalSOWs = mockTemplates.reduce((s, t) => s + t.sowsGenerated, 0);

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-up">
        <div>
          <Link
            href="/enterprise/admin/config"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-teal-600 hover:text-teal-700 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to General
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brown-500 to-brown-600 flex items-center justify-center shadow-md shadow-brown-500/20">
              <FileStack className="w-4.5 h-4.5 text-white" />
            </div>
            <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em] font-heading">
              SOW Templates
            </h1>
          </div>
          <p className="text-[13px] text-beige-500 mt-1 max-w-xl">
            Manage industry-specific SOW templates for AI generation and governance.
            Locked templates constrain AI to approved structures.
          </p>
        </div>

        <CreateTemplateDialog
          trigger={
            <Button variant="gradient-primary" size="sm">
              <Plus className="w-3.5 h-3.5" />
              Create Template
            </Button>
          }
        />
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-up [animation-delay:50ms]">
        {[
          {
            label: "Templates",
            value: totalTemplates,
            icon: FileStack,
            accent: "bg-brown-100 text-brown-600",
          },
          {
            label: "Active",
            value: activeCount,
            icon: CheckCircle2,
            accent: "bg-forest-100 text-forest-600",
          },
          {
            label: "Industries",
            value: industries,
            icon: Building2,
            accent: "bg-teal-100 text-teal-600",
          },
          {
            label: "SOWs Generated",
            value: totalSOWs,
            icon: Sparkles,
            accent: "bg-gold-100 text-gold-700",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                stat.accent
              )}
            >
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

      {/* ── Search ── */}
      <div className="animate-fade-up [animation-delay:100ms]">
        <Input
          placeholder="Search templates by name or industry..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 text-[13px] bg-white/70 backdrop-blur-sm max-w-md"
        />
      </div>

      {/* ── Template Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-up [animation-delay:150ms]">
        {filtered.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onDuplicate={handleOpenDuplicate}
            onEdit={handleOpenEdit}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm animate-fade-up">
          <FileStack className="w-10 h-10 text-beige-300 mx-auto mb-3" />
          <p className="text-[14px] font-semibold text-brown-800">
            No templates found
          </p>
          <p className="text-[12px] text-beige-500 mt-1">
            Try adjusting your search terms
          </p>
        </div>
      )}

      {/* ── Info Banner: Template Locking & Hallucination Prevention ── */}
      <div className="rounded-2xl border border-teal-200/50 bg-gradient-to-br from-teal-50/60 to-forest-50/40 backdrop-blur-sm p-6 animate-fade-up [animation-delay:200ms]">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-forest-500 flex items-center justify-center shadow-md shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-[14px] font-bold text-brown-900 mb-1.5">
              Template Locking & Hallucination Prevention
            </h3>
            <p className="text-[12px] text-brown-700/80 leading-relaxed mb-3">
              Locked templates are part of GlimmoraTeam&apos;s 8-layer hallucination prevention
              architecture. When a template is locked, the AI is constrained to generate
              SOWs strictly within the approved structure -- it cannot invent sections,
              omit required clauses, or deviate from the compliance framework defined
              by the template.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-forest-700">
                <Lock className="w-3 h-3" />
                Locked = AI-constrained to approved structure
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-beige-600">
                <Unlock className="w-3 h-3" />
                Unlocked = template still in development
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-teal-700">
                <CheckCircle2 className="w-3 h-3" />
                All clause mappings auditable
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Duplicate Confirmation Dialog ── */}
      <Dialog open={duplicateOpen} onOpenChange={(v) => { setDuplicateOpen(v); if (!v) setDuplicateName(""); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brown-900 font-heading">
              Duplicate Template
            </DialogTitle>
            <DialogDescription className="text-beige-500">
              Create a copy of &ldquo;{duplicateTarget?.name}&rdquo; as a new draft template.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-2">
              <Label htmlFor="dup-name" className="text-[12px] text-brown-700">
                New Template Name
              </Label>
              <Input
                id="dup-name"
                value={duplicateName}
                onChange={(e) => setDuplicateName(e.target.value)}
                placeholder="Enter a name for the copy"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDuplicateOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmDuplicate}
              disabled={!duplicateName.trim()}
            >
              <Copy className="w-3.5 h-3.5" />
              Duplicate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Template Dialog ── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brown-900 font-heading">
              Edit Template
            </DialogTitle>
            <DialogDescription className="text-beige-500">
              Update the template details for &ldquo;{editTarget?.name}&rdquo;.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-[12px] text-brown-700">
                Template Name
              </Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Template name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-industry" className="text-[12px] text-brown-700">
                Industry
              </Label>
              <Select value={editIndustry} onValueChange={setEditIndustry}>
                <SelectTrigger id="edit-industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map((ind) => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-sections" className="text-[12px] text-brown-700">
                  Sections
                </Label>
                <Input
                  id="edit-sections"
                  type="number"
                  min={1}
                  value={editSections}
                  onChange={(e) => setEditSections(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-clauses" className="text-[12px] text-brown-700">
                  Clauses
                </Label>
                <Input
                  id="edit-clauses"
                  type="number"
                  min={0}
                  value={editClauses}
                  onChange={(e) => setEditClauses(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleEditSave}>
              <Pencil className="w-3.5 h-3.5" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
