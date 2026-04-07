"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  DollarSign,
  AlertTriangle,
  Timer,
  Sparkles,
  Plus,
  GitBranch,
  Loader2,
  Check,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/stores/toast-store";
import {
  Badge,
  Switch,
  Button,
  Input,
  Label,
  Textarea,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

/* ══════════════════════════════════
   POLICIES PAGE (H3)
   SLA Templates, Pricing Rules,
   Governance Thresholds, Stage Gates
   ══════════════════════════════════ */

/* ── Types ── */
interface SlaTemplate {
  id: string;
  priority: string;
  reviewStart: string;
  reviewComplete: string;
  escalation: string;
  enabled: boolean;
}

interface PricingRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface GovernanceThreshold {
  id: string;
  name: string;
  description: string;
  value: number;
  unit: string;
  max: number;
  icon: typeof Shield;
  gradient: string;
}

interface StageGate {
  id: string;
  stage: string;
  approvals: string[];
  description: string;
  mandatory: boolean;
}

/* ── Initial Data ── */
const initialSlaTemplates: SlaTemplate[] = [
  { id: "sla-1", priority: "Critical", reviewStart: "4h", reviewComplete: "24h", escalation: "After 2h overdue", enabled: true },
  { id: "sla-2", priority: "High", reviewStart: "8h", reviewComplete: "48h", escalation: "After 4h overdue", enabled: true },
  { id: "sla-3", priority: "Medium", reviewStart: "24h", reviewComplete: "72h", escalation: "After 12h overdue", enabled: true },
  { id: "sla-4", priority: "Low", reviewStart: "48h", reviewComplete: "120h", escalation: "After 24h overdue", enabled: true },
];

const slaPriorityConfig: Record<string, { variant: "brown" | "gold" | "teal" | "forest"; gradient: string }> = {
  Critical: { variant: "brown", gradient: "from-brown-500 to-brown-600" },
  High: { variant: "gold", gradient: "from-gold-500 to-gold-600" },
  Medium: { variant: "teal", gradient: "from-teal-500 to-teal-600" },
  Low: { variant: "forest", gradient: "from-forest-500 to-forest-600" },
};

const initialPricingRules: PricingRule[] = [
  { id: "pr-1", name: "Base Rate Card Policy", description: "Apply approved rate cards for all task pricing calculations", enabled: true },
  { id: "pr-2", name: "Overtime Multiplier", description: "1.5x rate for tasks exceeding SLA by 50%+", enabled: true },
  { id: "pr-3", name: "Rush Delivery Premium", description: "2x rate for critical-priority tasks requiring < 24h turnaround", enabled: true },
  { id: "pr-4", name: "Bulk Discount", description: "10% discount on projects with 50+ tasks", enabled: false },
  { id: "pr-5", name: "Regional Rate Adjustment", description: "Automatically adjust rates based on contributor region cost of living", enabled: true },
];

const initialGovernanceThresholds: GovernanceThreshold[] = [
  { id: "gt-1", name: "Quality Score Threshold", description: "Minimum acceptance score for auto-approval", value: 85, unit: "score", max: 100, icon: Shield, gradient: "from-forest-400 to-forest-600" },
  { id: "gt-2", name: "SLA Breach Tolerance", description: "Maximum percentage of SLA breaches before project freeze", value: 15, unit: "%", max: 100, icon: Timer, gradient: "from-teal-400 to-teal-600" },
  { id: "gt-3", name: "Budget Overrun Alert", description: "Alert when project spending exceeds budget by this percentage", value: 90, unit: "%", max: 200, icon: DollarSign, gradient: "from-gold-400 to-gold-600" },
  { id: "gt-4", name: "Auto-Escalation Trigger", description: "Escalate to admin after this many failed reviews", value: 3, unit: "reviews", max: 10, icon: AlertTriangle, gradient: "from-brown-400 to-brown-600" },
  { id: "gt-5", name: "Rework Limit", description: "Maximum rework cycles before mandatory escalation", value: 2, unit: "cycles", max: 5, icon: Sparkles, gradient: "from-teal-500 to-forest-500" },
];

const initialStageGates: StageGate[] = [
  { id: "sg-1", stage: "SOW Approval", approvals: ["Owner"], description: "SOW must be approved before decomposition begins", mandatory: true },
  { id: "sg-2", stage: "Decomposition Review", approvals: ["Owner", "Manager"], description: "Task breakdown must be reviewed before team formation", mandatory: true },
  { id: "sg-3", stage: "Team Formation Sign-off", approvals: ["Manager"], description: "Team composition must be approved before project start", mandatory: true },
  { id: "sg-4", stage: "Milestone Completion", approvals: ["Owner", "Mentor"], description: "All deliverables in milestone must be accepted", mandatory: true },
  { id: "sg-5", stage: "Payment Release", approvals: ["Owner", "Finance Lead"], description: "Dual approval required for payout release", mandatory: true },
  { id: "sg-6", stage: "Project Closure", approvals: ["Owner"], description: "Final sign-off with all milestones completed", mandatory: false },
];

const approverOptions = ["Owner", "Admin", "Manager", "Mentor", "Finance Lead"];

/* ── Add SLA Template Dialog ── */
function AddSlaDialog({
  trigger,
  onCreated,
}: {
  trigger: React.ReactNode;
  onCreated: (tpl: Omit<SlaTemplate, "id">) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [priority, setPriority] = React.useState("");
  const [reviewStart, setReviewStart] = React.useState("");
  const [reviewComplete, setReviewComplete] = React.useState("");
  const [escalation, setEscalation] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!priority) e.priority = "Select a priority";
    if (!reviewStart.trim()) e.reviewStart = "Required";
    if (!reviewComplete.trim()) e.reviewComplete = "Required";
    if (!escalation.trim()) e.escalation = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      onCreated({
        priority,
        reviewStart: reviewStart.trim(),
        reviewComplete: reviewComplete.trim(),
        escalation: escalation.trim(),
        enabled: true,
      });
      toast.success("SLA template created", `"${priority}" priority template has been added.`);
      setSaving(false);
      setOpen(false);
      setPriority("");
      setReviewStart("");
      setReviewComplete("");
      setEscalation("");
      setErrors({});
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setErrors({}); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-brown-900 font-heading">Add SLA Template</DialogTitle>
          <DialogDescription className="text-beige-500">
            Define SLA durations for a task priority level.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="sla-priority" className="text-[12px] text-brown-700">Priority</Label>
            <Select value={priority} onValueChange={(v) => { setPriority(v); if (errors.priority) setErrors((e) => ({ ...e, priority: "" })); }}>
              <SelectTrigger id="sla-priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {errors.priority && <p className="text-[11px] text-red-500">{errors.priority}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="sla-review-start" className="text-[12px] text-brown-700">Review Start</Label>
              <Input id="sla-review-start" placeholder="e.g. 4h" value={reviewStart} onChange={(e) => setReviewStart(e.target.value)} />
              {errors.reviewStart && <p className="text-[11px] text-red-500">{errors.reviewStart}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sla-review-complete" className="text-[12px] text-brown-700">Review Complete</Label>
              <Input id="sla-review-complete" placeholder="e.g. 24h" value={reviewComplete} onChange={(e) => setReviewComplete(e.target.value)} />
              {errors.reviewComplete && <p className="text-[11px] text-red-500">{errors.reviewComplete}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sla-escalation" className="text-[12px] text-brown-700">Escalation Trigger</Label>
            <Input id="sla-escalation" placeholder="e.g. After 2h overdue" value={escalation} onChange={(e) => setEscalation(e.target.value)} />
            {errors.escalation && <p className="text-[11px] text-red-500">{errors.escalation}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="gradient-primary" size="sm" onClick={handleCreate} disabled={saving}>
            {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Creating...</> : <><Check className="w-3.5 h-3.5" />Add Template</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Add Pricing Rule Dialog ── */
function AddPricingRuleDialog({
  trigger,
  onCreated,
}: {
  trigger: React.ReactNode;
  onCreated: (rule: Omit<PricingRule, "id">) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleCreate = () => {
    if (!name.trim()) { setError("Rule name is required"); return; }
    setSaving(true);
    setTimeout(() => {
      onCreated({ name: name.trim(), description: description.trim(), enabled: true });
      toast.success("Pricing rule created", `"${name.trim()}" has been added.`);
      setSaving(false);
      setOpen(false);
      setName("");
      setDescription("");
      setError("");
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setError(""); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-brown-900 font-heading">Add Pricing Rule</DialogTitle>
          <DialogDescription className="text-beige-500">
            Create a new pricing policy for task calculations.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rule-name" className="text-[12px] text-brown-700">Rule Name</Label>
            <Input id="rule-name" placeholder="e.g. Weekend Premium" value={name} onChange={(e) => { setName(e.target.value); if (error) setError(""); }} />
            {error && <p className="text-[11px] text-red-500">{error}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="rule-desc" className="text-[12px] text-brown-700">Description</Label>
            <Textarea id="rule-desc" placeholder="Describe when this rule applies..." value={description} onChange={(e) => setDescription(e.target.value)} className="h-20 text-[12px]" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="gradient-primary" size="sm" onClick={handleCreate} disabled={saving}>
            {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Creating...</> : <><Check className="w-3.5 h-3.5" />Add Rule</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Edit Threshold Dialog ── */
function EditThresholdDialog({
  threshold,
  trigger,
  onSaved,
}: {
  threshold: GovernanceThreshold;
  trigger: React.ReactNode;
  onSaved: (value: number) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(String(threshold.value));
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) setValue(String(threshold.value));
  }, [open, threshold.value]);

  const handleSave = () => {
    const num = Number(value);
    if (isNaN(num) || num < 0 || num > threshold.max) return;
    setSaving(true);
    setTimeout(() => {
      onSaved(num);
      toast.success("Threshold updated", `"${threshold.name}" set to ${num}${threshold.unit === "%" ? "%" : " " + threshold.unit}.`);
      setSaving(false);
      setOpen(false);
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-brown-900 font-heading">Edit Threshold</DialogTitle>
          <DialogDescription className="text-beige-500">
            {threshold.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="threshold-value" className="text-[12px] text-brown-700">
              Value ({threshold.unit}) — max {threshold.max}
            </Label>
            <Input
              id="threshold-value"
              type="number"
              min={0}
              max={threshold.max}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="gradient-primary" size="sm" onClick={handleSave} disabled={saving || !value}>
            {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Add Stage Gate Dialog ── */
function AddStageGateDialog({
  trigger,
  onCreated,
}: {
  trigger: React.ReactNode;
  onCreated: (gate: Omit<StageGate, "id">) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [stage, setStage] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [approvals, setApprovals] = React.useState<string[]>([]);
  const [mandatory, setMandatory] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const toggleApprover = (name: string) => {
    setApprovals((prev) => prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]);
    if (errors.approvals) setErrors((e) => ({ ...e, approvals: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!stage.trim()) e.stage = "Stage name is required";
    if (approvals.length === 0) e.approvals = "Select at least one approver";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      onCreated({ stage: stage.trim(), description: description.trim(), approvals, mandatory });
      toast.success("Stage gate created", `"${stage.trim()}" has been added to the pipeline.`);
      setSaving(false);
      setOpen(false);
      setStage("");
      setDescription("");
      setApprovals([]);
      setMandatory(true);
      setErrors({});
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setErrors({}); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-brown-900 font-heading">Add Stage Gate</DialogTitle>
          <DialogDescription className="text-beige-500">
            Define a new approval checkpoint in the project pipeline.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="gate-stage" className="text-[12px] text-brown-700">Stage Name</Label>
            <Input id="gate-stage" placeholder="e.g. QA Review" value={stage} onChange={(e) => { setStage(e.target.value); if (errors.stage) setErrors((er) => ({ ...er, stage: "" })); }} />
            {errors.stage && <p className="text-[11px] text-red-500">{errors.stage}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="gate-desc" className="text-[12px] text-brown-700">Description</Label>
            <Textarea id="gate-desc" placeholder="When should this gate be triggered..." value={description} onChange={(e) => setDescription(e.target.value)} className="h-16 text-[12px]" />
          </div>
          <div className="space-y-2">
            <Label className="text-[12px] text-brown-700">Required Approvers</Label>
            {errors.approvals && <p className="text-[11px] text-red-500">{errors.approvals}</p>}
            <div className="flex flex-wrap gap-3">
              {approverOptions.map((name) => (
                <label key={name} className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox checked={approvals.includes(name)} onCheckedChange={() => toggleApprover(name)} />
                  <span className="text-[11px] text-beige-600 group-hover:text-brown-700 transition-colors">{name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={mandatory} onCheckedChange={setMandatory} id="gate-mandatory" />
            <Label htmlFor="gate-mandatory" className="text-[12px] text-brown-700 cursor-pointer">Mandatory gate</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="gradient-primary" size="sm" onClick={handleCreate} disabled={saving}>
            {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Creating...</> : <><Check className="w-3.5 h-3.5" />Add Gate</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ═══════════════════════ PAGE ═══════════════════════ */
export default function PoliciesPage() {
  const [slaTemplates, setSlaTemplates] = React.useState(initialSlaTemplates);
  const [pricingRules, setPricingRules] = React.useState(initialPricingRules);
  const [thresholds, setThresholds] = React.useState(initialGovernanceThresholds);
  const [stageGates, setStageGates] = React.useState(initialStageGates);

  /* ── SLA handlers ── */
  const handleAddSla = (tpl: Omit<SlaTemplate, "id">) => {
    setSlaTemplates((prev) => [...prev, { ...tpl, id: `sla-${prev.length + 1}` }]);
  };
  const handleToggleSla = (id: string) => {
    setSlaTemplates((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const next = !s.enabled;
        toast.success(next ? "SLA enabled" : "SLA disabled", `"${s.priority}" template ${next ? "activated" : "deactivated"}.`);
        return { ...s, enabled: next };
      })
    );
  };

  /* ── Pricing handlers ── */
  const handleAddPricingRule = (rule: Omit<PricingRule, "id">) => {
    setPricingRules((prev) => [...prev, { ...rule, id: `pr-${prev.length + 1}` }]);
  };
  const handleTogglePricing = (id: string) => {
    setPricingRules((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next = !r.enabled;
        toast.success(next ? "Rule enabled" : "Rule disabled", `"${r.name}" ${next ? "activated" : "deactivated"}.`);
        return { ...r, enabled: next };
      })
    );
  };

  /* ── Threshold handlers ── */
  const handleUpdateThreshold = (id: string) => (value: number) => {
    setThresholds((prev) => prev.map((t) => (t.id === id ? { ...t, value } : t)));
  };

  /* ── Stage gate handlers ── */
  const handleAddStageGate = (gate: Omit<StageGate, "id">) => {
    setStageGates((prev) => [...prev, { ...gate, id: `sg-${prev.length + 1}` }]);
  };
  const handleToggleGate = (id: string) => {
    setStageGates((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const next = !g.mandatory;
        toast.success(next ? "Gate enabled" : "Gate disabled", `"${g.stage}" is now ${next ? "mandatory" : "optional"}.`);
        return { ...g, mandatory: next };
      })
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Back link */}
      <div className="animate-fade-up">
        <Link
          href="/enterprise/admin/config"
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to General
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 animate-fade-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-md shadow-forest-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em] font-heading">
              Policies
            </h1>
            <p className="text-[13px] text-beige-500 mt-1">
              SLA Templates, Pricing Rules, Governance Thresholds, and Stage Gates.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ Section 1: SLA Templates ═══ */}
      <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6 animate-fade-up [animation-delay:100ms]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-teal-500" />
            <h2 className="text-[14px] font-semibold text-brown-800">SLA Templates</h2>
            <Badge variant="teal" size="sm">{slaTemplates.length} templates</Badge>
          </div>
          <AddSlaDialog
            onCreated={handleAddSla}
            trigger={
              <Button variant="outline" size="sm">
                <Plus className="w-3 h-3" />
                Add Template
              </Button>
            }
          />
        </div>

        <p className="text-[11px] text-beige-500 mb-4">
          Default SLA durations by task priority. Defines review start time, completion time, and escalation triggers.
        </p>

        {/* Column headers */}
        <div className="hidden md:grid md:grid-cols-12 gap-3 px-4 py-2 text-[10px] font-semibold text-beige-500 uppercase tracking-wider border-b border-beige-100">
          <div className="col-span-2">Priority</div>
          <div className="col-span-2 text-center">Review Start</div>
          <div className="col-span-3 text-center">Review Complete</div>
          <div className="col-span-3">Escalation</div>
          <div className="col-span-2 text-center">Status</div>
        </div>

        <div className="divide-y divide-beige-100/60">
          {slaTemplates.map((sla) => {
            const config = slaPriorityConfig[sla.priority] || { variant: "beige" as const, gradient: "from-beige-400 to-beige-500" };
            return (
              <div
                key={sla.id}
                className={cn(
                  "grid grid-cols-1 md:grid-cols-12 gap-3 items-center px-4 py-3.5 hover:bg-beige-50/40 transition-colors",
                  !sla.enabled && "opacity-50"
                )}
              >
                <div className="md:col-span-2">
                  <Badge variant={config.variant} size="sm" dot>
                    {sla.priority}
                  </Badge>
                </div>
                <div className="md:col-span-2 text-center">
                  <span className="text-[13px] font-bold text-brown-900">{sla.reviewStart}</span>
                </div>
                <div className="md:col-span-3 text-center">
                  <span className="text-[13px] font-bold text-brown-900">{sla.reviewComplete}</span>
                </div>
                <div className="md:col-span-3">
                  <span className="text-[11px] text-beige-600">{sla.escalation}</span>
                </div>
                <div className="md:col-span-2 flex justify-center">
                  <Switch
                    checked={sla.enabled}
                    onCheckedChange={() => handleToggleSla(sla.id)}
                    aria-label={`Toggle ${sla.priority} SLA`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ Section 2: Pricing Rules ═══ */}
      <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6 animate-fade-up [animation-delay:200ms]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gold-500" />
            <h2 className="text-[14px] font-semibold text-brown-800">Pricing Rules</h2>
            <Badge variant="gold" size="sm">{pricingRules.filter((r) => r.enabled).length} active</Badge>
          </div>
          <AddPricingRuleDialog
            onCreated={handleAddPricingRule}
            trigger={
              <Button variant="outline" size="sm">
                <Plus className="w-3 h-3" />
                Add Rule
              </Button>
            }
          />
        </div>

        <p className="text-[11px] text-beige-500 mb-4">
          Rate card policies, overtime multipliers, and automatic pricing adjustments.
        </p>

        <div className="space-y-3">
          {pricingRules.map((rule) => (
            <div
              key={rule.id}
              className={cn(
                "flex items-center gap-4 py-3.5 px-4 rounded-xl border transition-colors",
                rule.enabled
                  ? "border-beige-100 hover:bg-beige-50/40"
                  : "border-beige-100/50 opacity-60"
              )}
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-sm shrink-0">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-brown-800">{rule.name}</p>
                <p className="text-[11px] text-beige-500 mt-0.5">{rule.description}</p>
              </div>
              <Switch
                checked={rule.enabled}
                onCheckedChange={() => handleTogglePricing(rule.id)}
                aria-label={`Toggle ${rule.name}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Section 3: Governance Thresholds ═══ */}
      <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6 animate-fade-up [animation-delay:300ms]">
        <div className="flex items-center gap-2 mb-5">
          <AlertTriangle className="w-4 h-4 text-brown-500" />
          <h2 className="text-[14px] font-semibold text-brown-800">Governance Thresholds</h2>
          <Badge variant="brown" size="sm">APG Config</Badge>
        </div>

        <p className="text-[11px] text-beige-500 mb-4">
          APG intervention triggers. When these thresholds are breached, the system takes automated action.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {thresholds.map((gt) => {
            const Icon = gt.icon;
            const barPercent = Math.min((gt.value / gt.max) * 100, 100);

            return (
              <div
                key={gt.id}
                className="rounded-xl border border-beige-100 bg-white/50 p-4 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br shadow-sm shrink-0",
                        gt.gradient
                      )}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-semibold text-brown-800">{gt.name}</h3>
                      <p className="text-[10px] text-beige-500 mt-0.5">{gt.description}</p>
                    </div>
                  </div>
                  <EditThresholdDialog
                    threshold={gt}
                    onSaved={handleUpdateThreshold(gt.id)}
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Edit ${gt.name}`}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                    }
                  />
                </div>

                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-beige-500 font-medium">Threshold</span>
                    <span className="text-[13px] font-bold text-brown-800">
                      {gt.value}
                      <span className="text-[10px] text-beige-500 ml-1">{gt.unit}</span>
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full bg-beige-100 overflow-hidden">
                    <div
                      className={cn("absolute inset-y-0 left-0 rounded-full bg-gradient-to-r transition-all", gt.gradient)}
                      style={{ width: `${barPercent}%` }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-brown-400 shadow-sm"
                      style={{ left: `calc(${barPercent}% - 6px)` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ Section 4: Stage Gates ═══ */}
      <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6 animate-fade-up [animation-delay:400ms]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-forest-500" />
            <h2 className="text-[14px] font-semibold text-brown-800">Stage Gates</h2>
            <Badge variant="forest" size="sm">{stageGates.filter((s) => s.mandatory).length} mandatory</Badge>
          </div>
          <AddStageGateDialog
            onCreated={handleAddStageGate}
            trigger={
              <Button variant="outline" size="sm">
                <Plus className="w-3 h-3" />
                Add Gate
              </Button>
            }
          />
        </div>

        <p className="text-[11px] text-beige-500 mb-4">
          Required approvals per milestone or project stage. Mandatory gates cannot be bypassed.
        </p>

        <div className="space-y-3">
          {stageGates.map((gate, index) => (
            <div
              key={gate.id}
              className={cn(
                "flex items-center gap-4 py-3.5 px-4 rounded-xl border transition-colors",
                gate.mandatory
                  ? "border-beige-100 hover:bg-beige-50/40"
                  : "border-beige-100/50 opacity-70"
              )}
            >
              {/* Step number */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm">
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold text-brown-800">{gate.stage}</p>
                  {gate.mandatory && (
                    <Badge variant="forest" size="sm">Mandatory</Badge>
                  )}
                </div>
                <p className="text-[11px] text-beige-500 mt-0.5">{gate.description}</p>
              </div>

              {/* Required approvers */}
              <div className="flex flex-wrap gap-1 shrink-0">
                {gate.approvals.map((approver) => (
                  <span
                    key={approver}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-beige-100 text-beige-700"
                  >
                    {approver}
                  </span>
                ))}
              </div>

              <Switch
                checked={gate.mandatory}
                onCheckedChange={() => handleToggleGate(gate.id)}
                aria-label={`Toggle ${gate.stage} gate`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
