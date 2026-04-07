"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Sparkles, CheckCircle2, FileText, Target, Code2,
  Calendar, DollarSign, Users, ShieldCheck, Lock, AlertTriangle,
  ClipboardCheck, Plus, X, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp } from "@/lib/utils/motion-variants";
import {
  Button, Input, Textarea, Label, Select, SelectTrigger, SelectContent,
  SelectItem, SelectValue,
} from "@/components/ui";

/* ══════════════════════════════════════════ Steps ══════════════════════════════════════════ */

const STEPS = [
  { label: "Project Overview", icon: FileText, short: "Overview" },
  { label: "Scope Definition", icon: Target, short: "Scope" },
  { label: "Technical Requirements", icon: Code2, short: "Technical" },
  { label: "Timeline & Milestones", icon: Calendar, short: "Timeline" },
  { label: "Budget Parameters", icon: DollarSign, short: "Budget" },
  { label: "Team Requirements", icon: Users, short: "Team" },
  { label: "Quality Standards", icon: ShieldCheck, short: "Quality" },
  { label: "Security & Compliance", icon: Lock, short: "Security" },
  { label: "Risk Parameters", icon: AlertTriangle, short: "Risk" },
  { label: "Review & Generate", icon: ClipboardCheck, short: "Review" },
] as const;

/* ══════════════════════════════════════════ Form data ══════════════════════════════════════════ */

interface FormData {
  title: string; client: string; industry: string; projectType: string;
  objectives: string; deliverables: string[]; outOfScope: string;
  techStack: string; infrastructure: string; integrations: string[];
  startDate: string; endDate: string; milestones: string[]; phasingStrategy: string;
  budgetMin: string; budgetMax: string; currency: string; breakdownPreference: string;
  teamSize: string; roles: string[]; skillPriorities: string; workModel: string;
  acceptanceCriteria: string; slaUptime: string; testingRequirements: string; codeReviewPolicy: string;
  dataSensitivity: string; regulations: string[]; encryptionRequirements: string; accessControl: string;
  knownRisks: string[]; constraints: string; contingencyBudget: string; escalationProcess: string;
}

const initialFormData: FormData = {
  title: "", client: "", industry: "", projectType: "",
  objectives: "", deliverables: [""], outOfScope: "",
  techStack: "", infrastructure: "", integrations: [""],
  startDate: "", endDate: "", milestones: [""], phasingStrategy: "",
  budgetMin: "", budgetMax: "", currency: "USD", breakdownPreference: "",
  teamSize: "", roles: [""], skillPriorities: "", workModel: "",
  acceptanceCriteria: "", slaUptime: "", testingRequirements: "", codeReviewPolicy: "",
  dataSensitivity: "", regulations: [""], encryptionRequirements: "", accessControl: "",
  knownRisks: [""], constraints: "", contingencyBudget: "", escalationProcess: "",
};

/* ══════════════════════════════════════════ Step transition ══════════════════════════════════════════ */

const stepTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

/* ══════════════════════════════════════════ Date picker ══════════════════════════════════════════ */

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function DateInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ top: 0, left: 0 });

  const today = new Date();
  const parsed = value ? new Date(value + 'T00:00:00') : null;
  const [viewYear, setViewYear] = React.useState(parsed?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(parsed?.getMonth() ?? today.getMonth());

  React.useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4 + window.scrollY, left: rect.left + window.scrollX });
    }
  }, [open]);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || dropdownRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const formatDisplay = (v: string) => {
    if (!v) return '';
    const d = new Date(v + 'T00:00:00');
    return isNaN(d.getTime()) ? v : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const days: (number | null)[] = Array(firstDayOfWeek).fill(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };
  const selectDay = (day: number) => { onChange(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`); setOpen(false); };
  const isSelected = (day: number) => parsed && parsed.getFullYear() === viewYear && parsed.getMonth() === viewMonth && parsed.getDate() === day;
  const isToday = (day: number) => today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;

  return (
    <div className="relative w-full">
      <button ref={triggerRef} type="button" onClick={() => setOpen(o => !o)}
        className={cn("flex h-10 w-full items-center rounded-xl border bg-white px-3.5 py-2 text-[13px] transition-all duration-200",
          open ? "border-brown-300 ring-2 ring-brown-100" : "border-gray-200 hover:border-gray-300",
          value ? "text-gray-900" : "text-gray-400"
        )}>
        {formatDisplay(value) || placeholder || 'Select date'}
      </button>
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

      {open && ReactDOM.createPortal(
        <div ref={dropdownRef} className="fixed rounded-xl bg-white border border-gray-200 p-4 z-[9999]"
          style={{ top: pos.top, left: pos.left, width: 280, boxShadow: "0 8px 24px var(--border-hair), 0 2px 6px var(--border-hair)" }}>
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={prevMonth} className="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[13px] font-semibold text-gray-900">{MONTH_NAMES[viewMonth]} {viewYear}</span>
            <button type="button" onClick={nextMonth} className="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0 mb-1">
            {DAY_LABELS.map(d => <div key={d} className="flex items-center justify-center h-7 text-[10px] font-semibold text-gray-400">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-0">
            {days.map((day, i) => (
              <div key={i} className="flex items-center justify-center h-8">
                {day && (
                  <button type="button" onClick={() => selectDay(day)}
                    className={cn("w-7 h-7 rounded-md text-[12px] flex items-center justify-center transition-all",
                      isSelected(day) ? "bg-gradient-to-r from-brown-400 to-brown-600 text-white font-semibold" :
                      isToday(day) ? "border border-brown-300 text-brown-600 font-medium" :
                      "text-gray-700 hover:bg-gray-50"
                    )}>
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

/* ══════════════════════════════════════════ MAIN PAGE ══════════════════════════════════════════ */

export default function SOWGenerateWizardPage() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState<FormData>(initialFormData);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => setFormData((prev) => ({ ...prev, [key]: value }));
  const addListItem = (key: keyof FormData) => setFormData((prev) => ({ ...prev, [key]: [...(prev[key] as string[]), ""] }));
  const removeListItem = (key: keyof FormData, idx: number) => setFormData((prev) => ({ ...prev, [key]: (prev[key] as string[]).filter((_, i) => i !== idx) }));
  const updateListItem = (key: keyof FormData, idx: number, value: string) => setFormData((prev) => ({ ...prev, [key]: (prev[key] as string[]).map((item, i) => (i === idx ? value : item)) }));

  const calculateConfidence = React.useCallback(() => {
    const checks: boolean[] = [
      formData.title.trim().length > 0, formData.client.trim().length > 0,
      formData.industry.length > 0, formData.projectType.length > 0,
      formData.objectives.trim().length > 0, formData.deliverables.some((d) => d.trim().length > 0),
      formData.outOfScope.trim().length > 0, formData.techStack.trim().length > 0,
      formData.infrastructure.length > 0, formData.integrations.some((i) => i.trim().length > 0),
      formData.startDate.length > 0, formData.endDate.length > 0,
      formData.milestones.some((m) => m.trim().length > 0), formData.phasingStrategy.length > 0,
      formData.budgetMin.length > 0, formData.budgetMax.length > 0, formData.breakdownPreference.length > 0,
      formData.teamSize.length > 0, formData.roles.some((r) => r.trim().length > 0), formData.workModel.length > 0,
      formData.acceptanceCriteria.trim().length > 0, formData.slaUptime.length > 0, formData.testingRequirements.length > 0,
      formData.dataSensitivity.length > 0, formData.regulations.some((r) => r.trim().length > 0),
      formData.encryptionRequirements.length > 0, formData.knownRisks.some((r) => r.trim().length > 0),
      formData.constraints.trim().length > 0, formData.contingencyBudget.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [formData]);

  const aiConfidence = calculateConfidence();

  const isStepComplete = React.useCallback((step: number): boolean => {
    switch (step) {
      case 0: return formData.title.trim().length > 0 && formData.client.trim().length > 0;
      case 1: return formData.objectives.trim().length > 0 && formData.deliverables.some((d) => d.trim().length > 0);
      case 2: return formData.techStack.trim().length > 0;
      case 3: return formData.startDate.length > 0 && formData.endDate.length > 0;
      case 4: return formData.budgetMin.length > 0 || formData.budgetMax.length > 0;
      case 5: return formData.roles.some((r) => r.trim().length > 0);
      case 6: return formData.acceptanceCriteria.trim().length > 0;
      case 7: return formData.dataSensitivity.length > 0;
      case 8: return formData.knownRisks.some((r) => r.trim().length > 0);
      case 9: return aiConfidence >= 60;
      default: return false;
    }
  }, [formData, aiConfidence]);

  const progressPercent = Math.round(((currentStep + 1) / STEPS.length) * 100);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">

      {/* Header + progress */}
      <motion.div variants={fadeUp} className="mb-6">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h1 className="font-heading text-[28px] font-semibold text-gray-900 tracking-tight">AI SOW Generator</h1>
            <p className="mt-1 text-[13px] text-gray-400">Step {currentStep + 1} of {STEPS.length} · {STEPS[currentStep].label}</p>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className={cn("w-3.5 h-3.5", aiConfidence >= 70 ? "text-forest-500" : aiConfidence >= 40 ? "text-gold-500" : "text-gray-400")} />
            <span className={cn("text-[11px] font-mono font-medium", aiConfidence >= 70 ? "text-forest-600" : aiConfidence >= 40 ? "text-gold-600" : "text-gray-400")}>{aiConfidence}% AI Confidence</span>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-brown-400 to-brown-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </motion.div>

      {/* Form card — full width */}
      <AnimatePresence mode="wait">
        <motion.div key={currentStep} variants={stepTransition} initial="initial" animate="animate" exit="exit">
          <div className="card-parchment">
            <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
              <span className="text-sm font-semibold text-gray-800">{STEPS[currentStep].label}</span>
            </div>
            <div className="px-6 py-6">
              {currentStep === 0 && <StepProjectOverview formData={formData} updateField={updateField} />}
              {currentStep === 1 && <StepScopeDefinition formData={formData} updateField={updateField} addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} />}
              {currentStep === 2 && <StepTechnicalRequirements formData={formData} updateField={updateField} addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} />}
              {currentStep === 3 && <StepTimelineMilestones formData={formData} updateField={updateField} addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} />}
              {currentStep === 4 && <StepBudgetParameters formData={formData} updateField={updateField} />}
              {currentStep === 5 && <StepTeamRequirements formData={formData} updateField={updateField} addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} />}
              {currentStep === 6 && <StepQualityStandards formData={formData} updateField={updateField} />}
              {currentStep === 7 && <StepSecurityCompliance formData={formData} updateField={updateField} addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} />}
              {currentStep === 8 && <StepRiskParameters formData={formData} updateField={updateField} addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} />}
              {currentStep === 9 && <StepReviewGenerate formData={formData} aiConfidence={aiConfidence} />}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation — outside the card */}
      <div className="flex items-center justify-between mt-5">
        <button onClick={() => setCurrentStep((s) => Math.max(0, s - 1))} disabled={currentStep === 0}
          className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        {currentStep < STEPS.length - 1 ? (
          <button onClick={() => setCurrentStep((s) => s + 1)}
            className="flex items-center gap-1.5 text-[12px] font-medium text-white bg-gradient-to-r from-brown-400 to-brown-600 hover:from-brown-500 hover:to-brown-700 px-6 py-2.5 rounded-xl transition-all">
            Continue <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <Link href="/enterprise/sow/generate/review">
            <button className="flex items-center gap-2 text-[13px] font-semibold text-white bg-gradient-to-r from-brown-400 to-brown-600 hover:from-brown-500 hover:to-brown-700 px-8 py-3 rounded-xl transition-all">
              <Sparkles className="w-4 h-4" /> Generate SOW
            </button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   STEP COMPONENTS
   ════════════════════════════════════════════════════════════════ */

const fieldLabel = "mb-1.5 block text-[12px] font-semibold text-gray-600";
const fieldDesc = "text-[13px] text-gray-500 leading-relaxed mb-5";

function StepProjectOverview({ formData, updateField }: { formData: FormData; updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void }) {
  return (
    <div className="space-y-5">
      <p className={fieldDesc}>Start by providing core project identifiers. This grounds the AI and prevents generic boilerplate.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className={fieldLabel}>Project Title *</label><Input placeholder="e.g., Enterprise Resource Planning Platform v2.0" value={formData.title} onChange={(e) => updateField("title", e.target.value)} /></div>
        <div><label className={fieldLabel}>Client / Organization *</label><Input placeholder="e.g., TechVista Solutions" value={formData.client} onChange={(e) => updateField("client", e.target.value)} /></div>
        <div><label className={fieldLabel}>Industry</label>
          <Select value={formData.industry} onValueChange={(v) => updateField("industry", v)}>
            <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
            <SelectContent>
              {["Technology & SaaS", "Finance & Banking", "Healthcare & Life Sciences", "Retail & E-commerce", "Manufacturing", "Education & EdTech", "Government & Public Sector", "Energy & Utilities", "Media & Entertainment", "Other"].map((v) => (
                <SelectItem key={v} value={v.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div><label className={fieldLabel}>Project Type</label>
          <Select value={formData.projectType} onValueChange={(v) => updateField("projectType", v)}>
            <SelectTrigger><SelectValue placeholder="Select project type" /></SelectTrigger>
            <SelectContent>
              {["Greenfield Development", "System Migration", "Legacy Modernization", "Integration Project", "MVP / Proof of Concept", "Enhancement / Feature Build", "Ongoing Maintenance", "Data & Analytics Platform"].map((v) => (
                <SelectItem key={v} value={v.toLowerCase().replace(/ \/ /g, "-").replace(/ & /g, "-").replace(/ /g, "-")}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <TipBox icon={Sparkles} variant="teal" title="Why this matters:">
        Specifying industry and project type enables the AI to apply domain-specific templates, compliance requirements, and proven milestone structures.
      </TipBox>
    </div>
  );
}

function StepScopeDefinition({ formData, updateField, addListItem, removeListItem, updateListItem }: StepListProps) {
  return (
    <div className="space-y-5">
      <p className={fieldDesc}>Define what the project should achieve and deliver. Clear scope definition prevents scope creep.</p>
      <div><label className={fieldLabel}>Project Objectives *</label><Textarea placeholder="Describe the primary objectives. What outcomes should it achieve?" value={formData.objectives} onChange={(e) => updateField("objectives", e.target.value)} className="min-h-[100px]" /></div>
      <ListField label="Key Deliverables *" items={formData.deliverables} fieldKey="deliverables" placeholder="e.g., User authentication module with OAuth 2.0" addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} />
      <div><label className={fieldLabel}>Out of Scope</label><Textarea placeholder="Explicitly state what is NOT included." value={formData.outOfScope} onChange={(e) => updateField("outOfScope", e.target.value)} className="min-h-[80px]" /></div>
    </div>
  );
}

function StepTechnicalRequirements({ formData, updateField, addListItem, removeListItem, updateListItem }: StepListProps) {
  return (
    <div className="space-y-5">
      <p className={fieldDesc}>Specify the technology stack, infrastructure, and third-party integrations.</p>
      <div><label className={fieldLabel}>Technology Stack *</label><Textarea placeholder="e.g., React + TypeScript, Node.js/NestJS, PostgreSQL, Redis, Docker/K8s" value={formData.techStack} onChange={(e) => updateField("techStack", e.target.value)} className="min-h-[80px]" /></div>
      <div><label className={fieldLabel}>Infrastructure & Hosting</label>
        <Select value={formData.infrastructure} onValueChange={(v) => updateField("infrastructure", v)}>
          <SelectTrigger><SelectValue placeholder="Select infrastructure" /></SelectTrigger>
          <SelectContent>
            {["Amazon Web Services (AWS)", "Microsoft Azure", "Google Cloud Platform", "Hybrid Cloud", "On-Premise", "Multi-Cloud", "Serverless Architecture", "Other / TBD"].map((v) => (
              <SelectItem key={v} value={v.toLowerCase().replace(/[^a-z0-9]/g, "-")}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ListField label="Third-Party Integrations" items={formData.integrations} fieldKey="integrations" placeholder="e.g., Stripe Payments API, Salesforce CRM" addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} icon={Zap} />
      <TipBox icon={Code2} variant="brown" title="AI Hint:">
        Specifying your tech stack helps the AI generate accurate task breakdowns, skill requirements, and realistic effort estimates.
      </TipBox>
    </div>
  );
}

function StepTimelineMilestones({ formData, updateField, addListItem, removeListItem, updateListItem }: StepListProps) {
  return (
    <div className="space-y-5">
      <p className={fieldDesc}>Set the project timeline and define key milestones.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className={fieldLabel}>Start Date *</label><DateInput value={formData.startDate} onChange={(v) => updateField("startDate", v)} placeholder="Select start date" /></div>
        <div><label className={fieldLabel}>Target End Date *</label><DateInput value={formData.endDate} onChange={(v) => updateField("endDate", v)} placeholder="Select end date" /></div>
      </div>
      <div><label className={fieldLabel}>Phasing Strategy</label>
        <Select value={formData.phasingStrategy} onValueChange={(v) => updateField("phasingStrategy", v)}>
          <SelectTrigger><SelectValue placeholder="Select phasing approach" /></SelectTrigger>
          <SelectContent>
            {["Waterfall (Sequential)", "Agile Sprints (2-week)", "Agile Sprints (3-week)", "Kanban (Continuous Flow)", "Hybrid (Phases + Sprints)", "Milestone-Driven"].map((v) => (
              <SelectItem key={v} value={v.toLowerCase().replace(/[^a-z0-9]/g, "-")}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ListField label="Key Milestones" items={formData.milestones} fieldKey="milestones" placeholder="e.g., Phase 1 Complete - Core API & Auth" addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} numbered prefix="M" />
    </div>
  );
}

function StepBudgetParameters({ formData, updateField }: { formData: FormData; updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void }) {
  return (
    <div className="space-y-5">
      <p className={fieldDesc}>Define budget range and breakdown preferences.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><label className={fieldLabel}>Budget Minimum</label><Input type="number" placeholder="e.g., 50000" icon={<DollarSign className="w-4 h-4" />} value={formData.budgetMin} onChange={(e) => updateField("budgetMin", e.target.value)} /></div>
        <div><label className={fieldLabel}>Budget Maximum</label><Input type="number" placeholder="e.g., 150000" icon={<DollarSign className="w-4 h-4" />} value={formData.budgetMax} onChange={(e) => updateField("budgetMax", e.target.value)} /></div>
        <div><label className={fieldLabel}>Currency</label>
          <Select value={formData.currency} onValueChange={(v) => updateField("currency", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["USD ($)", "EUR", "GBP", "AED", "INR", "PKR"].map((v) => <SelectItem key={v} value={v.split(" ")[0]}>{v}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div><label className={fieldLabel}>Budget Breakdown Preference</label>
        <Select value={formData.breakdownPreference} onValueChange={(v) => updateField("breakdownPreference", v)}>
          <SelectTrigger><SelectValue placeholder="How should budget be broken down?" /></SelectTrigger>
          <SelectContent>
            {["By Phase / Milestone", "By Team / Role", "By Deliverable", "Fixed Monthly Allocation", "Time & Materials", "Hybrid (Fixed + T&M)"].map((v) => (
              <SelectItem key={v} value={v.toLowerCase().replace(/[^a-z0-9]/g, "-")}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <TipBox icon={DollarSign} variant="gold" title="Budget AI:">
        Providing a range allows the AI to optimize scope across priority levels and flag budget-risk items.
      </TipBox>
    </div>
  );
}

function StepTeamRequirements({ formData, updateField, addListItem, removeListItem, updateListItem }: StepListProps) {
  return (
    <div className="space-y-5">
      <p className={fieldDesc}>Specify the team structure, roles, and skill preferences.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className={fieldLabel}>Estimated Team Size</label>
          <Select value={formData.teamSize} onValueChange={(v) => updateField("teamSize", v)}>
            <SelectTrigger><SelectValue placeholder="Select team size" /></SelectTrigger>
            <SelectContent>
              {["Micro (1-3)", "Small (4-8)", "Medium (9-15)", "Large (16-30)", "Enterprise (30+)", "Auto (AI Recommended)"].map((v) => (
                <SelectItem key={v} value={v.toLowerCase().replace(/[^a-z0-9]/g, "-")}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div><label className={fieldLabel}>Work Model</label>
          <Select value={formData.workModel} onValueChange={(v) => updateField("workModel", v)}>
            <SelectTrigger><SelectValue placeholder="Select work model" /></SelectTrigger>
            <SelectContent>
              {["Fully Remote", "Hybrid", "On-Site", "Flexible / Async"].map((v) => (
                <SelectItem key={v} value={v.toLowerCase().replace(/[^a-z0-9]/g, "-")}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <ListField label="Required Roles *" items={formData.roles} fieldKey="roles" placeholder="e.g., Senior React Developer" addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} addLabel="Add Role" icon={Users} />
      <div><label className={fieldLabel}>Skill Priorities & Preferences</label><Textarea placeholder="e.g., Must have TypeScript expertise, prefer fintech experience" value={formData.skillPriorities} onChange={(e) => updateField("skillPriorities", e.target.value)} className="min-h-[80px]" /></div>
    </div>
  );
}

function StepQualityStandards({ formData, updateField }: { formData: FormData; updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void }) {
  return (
    <div className="space-y-5">
      <p className={fieldDesc}>Define acceptance criteria, SLA targets, and quality gates.</p>
      <div><label className={fieldLabel}>Acceptance Criteria *</label><Textarea placeholder="e.g., code coverage > 80%, WCAG 2.1 AA compliance" value={formData.acceptanceCriteria} onChange={(e) => updateField("acceptanceCriteria", e.target.value)} className="min-h-[100px]" /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className={fieldLabel}>SLA / Uptime Target</label>
          <Select value={formData.slaUptime} onValueChange={(v) => updateField("slaUptime", v)}>
            <SelectTrigger><SelectValue placeholder="Select SLA target" /></SelectTrigger>
            <SelectContent>{["99.9% (Three Nines)", "99.95%", "99.99% (Four Nines)", "Best Effort", "Not Applicable"].map((v) => <SelectItem key={v} value={v.split(" ")[0].replace("%", "")}>{v}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><label className={fieldLabel}>Testing Requirements</label>
          <Select value={formData.testingRequirements} onValueChange={(v) => updateField("testingRequirements", v)}>
            <SelectTrigger><SelectValue placeholder="Select testing level" /></SelectTrigger>
            <SelectContent>{["Unit Tests Only", "Unit + Integration", "Full (Unit + Integration + E2E)", "Full + Performance", "Full + Security", "Comprehensive (All Types)"].map((v) => <SelectItem key={v} value={v.toLowerCase().replace(/[^a-z0-9]/g, "-")}>{v}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div><label className={fieldLabel}>Code Review Policy</label>
        <Select value={formData.codeReviewPolicy} onValueChange={(v) => updateField("codeReviewPolicy", v)}>
          <SelectTrigger><SelectValue placeholder="Select code review approach" /></SelectTrigger>
          <SelectContent>{["Peer Review (1 reviewer)", "Senior Review Required", "Two Reviewers Required", "Mentor-Guided Review (APG)", "AI-Assisted + Human Review"].map((v) => <SelectItem key={v} value={v.toLowerCase().replace(/[^a-z0-9]/g, "-")}>{v}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <TipBox icon={ShieldCheck} variant="forest" title="Quality Gates:">
        These criteria will be embedded as automated quality gates in the APG, ensuring every deliverable meets your standards.
      </TipBox>
    </div>
  );
}

function StepSecurityCompliance({ formData, updateField, addListItem, removeListItem, updateListItem }: StepListProps) {
  return (
    <div className="space-y-5">
      <p className={fieldDesc}>Specify data sensitivity levels and regulatory requirements.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className={fieldLabel}>Data Sensitivity Level *</label>
          <Select value={formData.dataSensitivity} onValueChange={(v) => updateField("dataSensitivity", v)}>
            <SelectTrigger><SelectValue placeholder="Select sensitivity level" /></SelectTrigger>
            <SelectContent>{["Public Data", "Internal / Confidential", "Sensitive (PII/PHI)", "Restricted / Top Secret", "Regulated Industry Data"].map((v) => <SelectItem key={v} value={v.toLowerCase().replace(/[^a-z0-9]/g, "-")}>{v}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><label className={fieldLabel}>Encryption Requirements</label>
          <Select value={formData.encryptionRequirements} onValueChange={(v) => updateField("encryptionRequirements", v)}>
            <SelectTrigger><SelectValue placeholder="Select encryption level" /></SelectTrigger>
            <SelectContent>{["Standard (TLS 1.2+)", "Enhanced (TLS 1.3 + AES-256)", "End-to-End Encryption", "FIPS 140-2 Compliant", "Custom Requirements"].map((v) => <SelectItem key={v} value={v.toLowerCase().replace(/[^a-z0-9]/g, "-")}>{v}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <ListField label="Regulatory Frameworks" items={formData.regulations} fieldKey="regulations" placeholder="e.g., GDPR, SOC 2 Type II, HIPAA" addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} icon={ShieldCheck} />
      <div><label className={fieldLabel}>Access Control Model</label>
        <Select value={formData.accessControl} onValueChange={(v) => updateField("accessControl", v)}>
          <SelectTrigger><SelectValue placeholder="Select access control approach" /></SelectTrigger>
          <SelectContent>{["Role-Based (RBAC)", "Attribute-Based (ABAC)", "Zero Trust Architecture", "MFA Required for All Users", "SSO / Federated Identity"].map((v) => <SelectItem key={v} value={v.toLowerCase().replace(/[^a-z0-9]/g, "-")}>{v}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    </div>
  );
}

function StepRiskParameters({ formData, updateField, addListItem, removeListItem, updateListItem }: StepListProps) {
  return (
    <div className="space-y-5">
      <p className={fieldDesc}>Identify known risks and constraints.</p>
      <ListField label="Known Risks *" items={formData.knownRisks} fieldKey="knownRisks" placeholder="e.g., Third-party API dependency may have rate limits" addListItem={addListItem} removeListItem={removeListItem} updateListItem={updateListItem} addLabel="Add Risk" icon={AlertTriangle} />
      <div><label className={fieldLabel}>Project Constraints</label><Textarea placeholder="e.g., Must not exceed 6-month timeline" value={formData.constraints} onChange={(e) => updateField("constraints", e.target.value)} className="min-h-[80px]" /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className={fieldLabel}>Contingency Budget (%)</label>
          <Select value={formData.contingencyBudget} onValueChange={(v) => updateField("contingencyBudget", v)}>
            <SelectTrigger><SelectValue placeholder="Select contingency %" /></SelectTrigger>
            <SelectContent>{["5% of total budget", "10% of total budget", "15% of total budget", "20% of total budget", "Custom Amount"].map((v) => <SelectItem key={v} value={v.split("%")[0] || "custom"}>{v}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><label className={fieldLabel}>Escalation Process</label>
          <Select value={formData.escalationProcess} onValueChange={(v) => updateField("escalationProcess", v)}>
            <SelectTrigger><SelectValue placeholder="Select escalation model" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tiered">{"Tiered (L1 → L2 → L3)"}</SelectItem>
              <SelectItem value="direct">Direct to Stakeholder</SelectItem>
              <SelectItem value="committee">Steering Committee</SelectItem>
              <SelectItem value="apg-governed">APG-Governed Auto-Escalation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <TipBox icon={AlertTriangle} variant="gold" title="Risk AI:">
        The more risks you identify upfront, the better the AI can generate targeted mitigation strategies.
      </TipBox>
    </div>
  );
}

function StepReviewGenerate({ formData, aiConfidence }: { formData: FormData; aiConfidence: number }) {
  const formatDate = (v: string) => { if (!v) return ''; const d = new Date(v + 'T00:00:00'); return isNaN(d.getTime()) ? v : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };

  const summaryRows = [
    { label: "Project", value: formData.title || "—", filled: !!formData.title.trim() },
    { label: "Client", value: formData.client || "—", filled: !!formData.client.trim() },
    { label: "Industry", value: formData.industry || "—", filled: !!formData.industry },
    { label: "Objectives", value: formData.objectives ? formData.objectives.slice(0, 80) + (formData.objectives.length > 80 ? "…" : "") : "—", filled: !!formData.objectives.trim() },
    { label: "Deliverables", value: formData.deliverables.filter((d) => d.trim()).length ? `${formData.deliverables.filter((d) => d.trim()).length} defined` : "—", filled: formData.deliverables.some((d) => !!d.trim()) },
    { label: "Tech Stack", value: formData.techStack ? formData.techStack.slice(0, 60) + (formData.techStack.length > 60 ? "…" : "") : "—", filled: !!formData.techStack.trim() },
    { label: "Timeline", value: formData.startDate && formData.endDate ? `${formatDate(formData.startDate)} → ${formatDate(formData.endDate)}` : "—", filled: !!formData.startDate && !!formData.endDate },
    { label: "Budget", value: formData.budgetMin || formData.budgetMax ? `${formData.currency} ${formData.budgetMin || "?"} – ${formData.budgetMax || "?"}` : "—", filled: !!formData.budgetMin || !!formData.budgetMax },
    { label: "Team", value: formData.roles.filter((r) => r.trim()).length ? `${formData.roles.filter((r) => r.trim()).length} roles` : "—", filled: formData.roles.some((r) => !!r.trim()) },
    { label: "Security", value: formData.dataSensitivity || "—", filled: !!formData.dataSensitivity },
    { label: "Risks", value: formData.knownRisks.filter((r) => r.trim()).length ? `${formData.knownRisks.filter((r) => r.trim()).length} identified` : "—", filled: formData.knownRisks.some((r) => !!r.trim()) },
  ];
  const filledCount = summaryRows.filter((r) => r.filled).length;

  return (
    <div className="space-y-5">
      <p className={fieldDesc}>Review your inputs below. Click Generate SOW when ready.</p>

      {/* Confidence bar */}
      <div className={cn("flex items-center justify-between px-4 py-3 rounded-xl",
        aiConfidence >= 70 ? "bg-forest-50" : aiConfidence >= 40 ? "bg-gold-50" : "bg-brown-50"
      )}>
        <span className={cn("text-[12px] font-semibold",
          aiConfidence >= 70 ? "text-forest-700" : aiConfidence >= 40 ? "text-gold-700" : "text-brown-700"
        )}>
          {aiConfidence >= 70 ? "High Confidence" : aiConfidence >= 40 ? "Moderate Confidence" : "Low Confidence"}
        </span>
        <span className="text-[12px] text-gray-500">{filledCount} of {summaryRows.length} fields · {aiConfidence}%</span>
      </div>

      {/* Summary table */}
      <div className="rounded-xl overflow-hidden border border-gray-200">
        {summaryRows.map((row, idx) => (
          <div key={row.label} className="flex items-center gap-3 px-4 py-2.5"
            style={{ borderBottom: idx < summaryRows.length - 1 ? "1px solid var(--border-hair)" : undefined, background: idx % 2 === 0 ? "white" : "var(--color-gray-50)" }}>
            {row.filled ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-forest-500" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-200 shrink-0" />}
            <span className="text-[12px] font-semibold text-gray-600 w-20 shrink-0">{row.label}</span>
            <span className={cn("text-[12px] truncate", row.filled ? "text-gray-800" : "text-gray-400")}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SHARED HELPERS
   ════════════════════════════════════════════════════════════════ */

interface StepListProps {
  formData: FormData;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  addListItem: (key: keyof FormData) => void;
  removeListItem: (key: keyof FormData, idx: number) => void;
  updateListItem: (key: keyof FormData, idx: number, value: string) => void;
}

const tipVariants = {
  teal: { bg: "bg-teal-50", text: "text-teal-700", icon: "text-teal-500" },
  brown: { bg: "bg-brown-50", text: "text-brown-700", icon: "text-brown-500" },
  gold: { bg: "bg-gold-50", text: "text-gold-700", icon: "text-gold-500" },
  forest: { bg: "bg-forest-50", text: "text-forest-700", icon: "text-forest-500" },
};

function TipBox({ icon: Icon, variant, title, children }: { icon: React.ElementType; variant: keyof typeof tipVariants; title: string; children: React.ReactNode }) {
  const v = tipVariants[variant];
  return (
    <div className={cn("rounded-xl px-4 py-3.5", v.bg)}>
      <div className="flex items-start gap-2.5">
        <Icon className={cn("w-4 h-4 shrink-0 mt-0.5", v.icon)} />
        <p className={cn("text-[12px] leading-relaxed", v.text)}>
          <span className="font-semibold">{title}</span> {children}
        </p>
      </div>
    </div>
  );
}

function ListField({ label, items, fieldKey, placeholder, addListItem, removeListItem, updateListItem, addLabel = "Add", icon: Icon, numbered, prefix }: {
  label: string; items: string[]; fieldKey: keyof FormData; placeholder: string;
  addListItem: (key: keyof FormData) => void; removeListItem: (key: keyof FormData, idx: number) => void;
  updateListItem: (key: keyof FormData, idx: number, value: string) => void;
  addLabel?: string; icon?: React.ElementType; numbered?: boolean; prefix?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className={fieldLabel}>{label}</label>
        <button onClick={() => addListItem(fieldKey)} className="inline-flex items-center gap-1 text-[12px] font-semibold text-brown-500 hover:text-brown-600 transition-colors">
          <Plus className="w-3.5 h-3.5" /> {addLabel}
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gray-50 flex items-center justify-center shrink-0">
              {Icon ? <Icon className="w-3 h-3 text-gray-400" /> : (
                <span className="text-[10px] font-bold text-gray-400">{prefix ? `${prefix}${idx + 1}` : idx + 1}</span>
              )}
            </div>
            <Input placeholder={placeholder} value={item} onChange={(e) => updateListItem(fieldKey, idx, e.target.value)} />
            {items.length > 1 && (
              <button onClick={() => removeListItem(fieldKey, idx)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
