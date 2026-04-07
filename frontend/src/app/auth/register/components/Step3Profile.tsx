"use client";
import { useState, useRef, useEffect } from "react";
import {
  AlertCircle, ArrowRight, ArrowLeft, X,
  Briefcase, GraduationCap, Clock,
  Sparkles, Globe, Link2,
  ChevronDown, Search, Check,
} from "lucide-react";
import {
  GlassCard, GlassCardContent, Button, Input, Label,
} from "@/components/ui";
import { Checkbox } from "@/components/ui";
import { SKILL_OPTIONS, TIMEZONES } from "../data";
import type { ContributorType } from "../types";

/* ── Generic searchable combobox ── */
function SearchCombobox({
  value, onChange, options, placeholder, searchPlaceholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string; group?: string }[];
  placeholder: string;
  searchPlaceholder: string;
}) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const ref                 = useRef<HTMLDivElement>(null);
  const inputRef            = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false); setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const filtered = search.trim()
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  // Group items if they have a group property
  const hasGroups = options.some(o => o.group);
  const groups = hasGroups
    ? Array.from(new Set(options.map(o => o.group ?? ""))).map(g => ({
        group: g,
        items: filtered.filter(o => (o.group ?? "") === g),
      })).filter(g => g.items.length > 0)
    : null;

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`flex h-11 w-full items-center justify-between gap-2 rounded-xl border bg-white px-4 text-sm shadow-sm transition-all focus:outline-none ${
          open ? "border-brown-500 ring-2 ring-brown-500/20" : "border-beige-200 hover:border-beige-300"
        }`}
      >
        <span className={selected ? "text-brown-950 truncate" : "text-beige-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-beige-500 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-xl border border-beige-200 bg-white shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-beige-100">
            <Search className="w-3.5 h-3.5 text-beige-400 shrink-0" />
            <input ref={inputRef} type="text" placeholder={searchPlaceholder} value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-sm text-brown-950 bg-transparent outline-none placeholder:text-beige-400" />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="text-beige-400 hover:text-beige-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="max-h-52 overflow-y-auto overscroll-contain">
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-sm text-beige-400 text-center">No results found</p>
            )}
            {groups ? (
              groups.map(({ group, items }) => (
                <div key={group}>
                  {group && (
                    <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-beige-400 bg-beige-50 border-b border-beige-100">
                      {group}
                    </p>
                  )}
                  {items.map(item => (
                    <button key={item.value} type="button"
                      onClick={() => { onChange(item.value); setOpen(false); setSearch(""); }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${
                        value === item.value ? "bg-brown-50 text-brown-900 font-medium" : "text-brown-800 hover:bg-beige-50"
                      }`}>
                      <span>{item.label}</span>
                      {value === item.value && <Check className="w-3.5 h-3.5 text-brown-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              ))
            ) : (
              filtered.map(item => (
                <button key={item.value} type="button"
                  onClick={() => { onChange(item.value); setOpen(false); setSearch(""); }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${
                    value === item.value ? "bg-brown-50 text-brown-900 font-medium" : "text-brown-800 hover:bg-beige-50"
                  }`}>
                  <span>{item.label}</span>
                  {value === item.value && <Check className="w-3.5 h-3.5 text-brown-600 shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Static option lists ── */
const TIMEZONE_OPTIONS = TIMEZONES.map(t => ({ label: t, value: t }));

const DEPT_OPTIONS = [
  { group: "Technology",          value: "engineering",      label: "Engineering & Development" },
  { group: "Technology",          value: "devops",           label: "DevOps & Infrastructure" },
  { group: "Technology",          value: "data",             label: "Data & Analytics" },
  { group: "Technology",          value: "cybersecurity",    label: "Cybersecurity" },
  { group: "Technology",          value: "qa",               label: "Quality Assurance & Testing" },
  { group: "Creative & Design",   value: "design",           label: "Design & UX/UI" },
  { group: "Creative & Design",   value: "content",          label: "Content & Copywriting" },
  { group: "Creative & Design",   value: "media",            label: "Media & Video Production" },
  { group: "Business",            value: "product",          label: "Product Management" },
  { group: "Business",            value: "marketing",        label: "Marketing & Growth" },
  { group: "Business",            value: "sales",            label: "Sales & Business Development" },
  { group: "Business",            value: "finance",          label: "Finance & Accounting" },
  { group: "Business",            value: "operations",       label: "Operations & Strategy" },
  { group: "People & Support",    value: "hr",               label: "Human Resources" },
  { group: "People & Support",    value: "customer-support", label: "Customer Support" },
  { group: "People & Support",    value: "legal",            label: "Legal & Compliance" },
  { group: "Research & Education",value: "research",         label: "Research & Development" },
  { group: "Research & Education",value: "education",        label: "Education & Training" },
  { group: "Other",               value: "other",            label: "Other" },
];

const CAREER_OPTIONS = [
  { value: "re-entering",   label: "Re-entering the workforce" },
  { value: "mid-career",    label: "Mid-career professional" },
  { value: "senior",        label: "Senior professional" },
  { value: "career-change", label: "Career transition / change" },
];

/* ── Reusable section header ── */
function SectionHeader({
  icon: Icon,
  title,
  badge,
}: {
  icon: React.FC<{ className?: string }>;
  title: string;
  badge?: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-5 h-5 rounded-md bg-beige-100 flex items-center justify-center shrink-0">
        <Icon className="w-3 h-3 text-beige-500" />
      </div>
      <p className="text-xs font-semibold text-brown-700 uppercase tracking-wide">{title}</p>
      {badge && <span className="text-[10px] text-beige-400 font-medium">{badge}</span>}
    </div>
  );
}

/* ── Reusable skill tag pill ── */
function SkillPill({
  label,
  onRemove,
  variant = "teal",
}: {
  label: string;
  onRemove: () => void;
  variant?: "teal" | "beige" | "forest";
}) {
  const styles = {
    teal:   "bg-teal-100 border-teal-200 text-teal-800 [&_button]:text-teal-500 [&_button:hover]:text-teal-700",
    beige:  "bg-beige-100 border-beige-200 text-brown-800 [&_button]:text-beige-500 [&_button:hover]:text-brown-700",
    forest: "bg-forest-100 border-forest-200 text-forest-800 [&_button]:text-forest-500 [&_button:hover]:text-forest-700",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium ${styles[variant]}`}>
      {label}
      <button type="button" onClick={onRemove}><X className="w-3 h-3" /></button>
    </span>
  );
}

/* ── Skill input with autocomplete dropdown ── */
function SkillAutocomplete({
  label, badge, skills, onAdd, onRemove,
  inputValue, onInputChange,
  suggestions, maxItems = 20, placeholder, tagVariant = "teal",
}: {
  label: string;
  badge?: string;
  skills: string[];
  onAdd: (s: string) => void;
  onRemove: (s: string) => void;
  inputValue: string;
  onInputChange: (v: string) => void;
  suggestions: string[];
  maxItems?: number;
  placeholder: string;
  tagVariant?: "teal" | "beige" | "forest";
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}{" "}
        <span className="text-beige-400 text-xs">
          {badge ?? `(${skills.length}/${maxItems})`}
        </span>
      </Label>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.map(s => (
            <SkillPill key={s} label={s} onRemove={() => onRemove(s)} variant={tagVariant} />
          ))}
        </div>
      )}
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={e => onInputChange(e.target.value)}
          disabled={skills.length >= maxItems}
        />
        {inputValue && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-beige-200 rounded-xl shadow-lg overflow-hidden">
            {suggestions.slice(0, 6).map(s => (
              <button key={s} type="button" onClick={() => onAdd(s)}
                className="w-full text-left px-4 py-2.5 text-sm text-brown-800 hover:bg-brown-50 transition-colors">
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Free-form skill input (press Enter to add) ── */
function SkillFreeform({
  label, badge, skills, onAdd, onRemove,
  inputValue, onInputChange,
  maxItems = 20, placeholder,
}: {
  label: string;
  badge?: string;
  skills: string[];
  onAdd: (s: string) => void;
  onRemove: (s: string) => void;
  inputValue: string;
  onInputChange: (v: string) => void;
  maxItems?: number;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}{" "}
        <span className="text-beige-400 text-xs">{badge ?? `(${skills.length}/${maxItems})`}</span>
      </Label>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.map(s => (
            <SkillPill key={s} label={s} onRemove={() => onRemove(s)} variant="beige" />
          ))}
        </div>
      )}
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={e => onInputChange(e.target.value)}
        disabled={skills.length >= maxItems}
        onKeyDown={e => {
          if (e.key === "Enter") {
            e.preventDefault();
            const trimmed = inputValue.trim();
            if (trimmed && !skills.includes(trimmed)) onAdd(trimmed);
          }
        }}
      />
      <p className="text-[10px] text-beige-400">Press Enter to add a custom skill</p>
    </div>
  );
}

/* ─────────────────────────── Step3Profile ──────────────────────────── */

interface Props {
  contribType: ContributorType;
  dob: string;                   setDob: (v: string) => void;
  timezone: string;              setTimezone: (v: string) => void;
  departmentCategory: string;    setDepartmentCategory: (v: string) => void;
  departmentOther: string;       setDepartmentOther: (v: string) => void;
  availability: string;          setAvailability: (v: string) => void;
  degree: string;                setDegree: (v: string) => void;
  branch: string;                setBranch: (v: string) => void;
  linkedin: string;              setLinkedin: (v: string) => void;
  mentorAck: boolean;            setMentorAck: (v: boolean) => void;
  // Primary skills
  primarySkills: string[];
  skillInput: string;            setSkillInput: (v: string) => void;
  addPrimarySkill: (s: string) => void;
  removePrimarySkill: (s: string) => void;
  // Secondary skills
  secondarySkills: string[];
  secondarySkillInput: string;   setSecondarySkillInput: (v: string) => void;
  addSecondarySkill: (s: string) => void;
  removeSecondarySkill: (s: string) => void;
  // Other skills (free-form)
  otherSkills: string[];
  otherSkillInput: string;       setOtherSkillInput: (v: string) => void;
  addOtherSkill: (s: string) => void;
  removeOtherSkill: (s: string) => void;
  // Type-specific
  workStart: string;             setWorkStart: (v: string) => void;
  workEnd: string;               setWorkEnd: (v: string) => void;
  careerStage: string;           setCareerStage: (v: string) => void;
  yearsExperience: string;       setYearsExperience: (v: string) => void;
  error: string;
  onContinue: () => void;
  onBack: () => void;
}

export function Step3Profile({
  contribType,
  dob, setDob,
  timezone, setTimezone,
  departmentCategory, setDepartmentCategory,
  departmentOther, setDepartmentOther,
  availability, setAvailability,
  degree, setDegree,
  branch, setBranch,
  linkedin, setLinkedin,
  mentorAck, setMentorAck,
  primarySkills, skillInput, setSkillInput, addPrimarySkill, removePrimarySkill,
  secondarySkills, secondarySkillInput, setSecondarySkillInput, addSecondarySkill, removeSecondarySkill,
  otherSkills, otherSkillInput, setOtherSkillInput, addOtherSkill, removeOtherSkill,
  workStart, setWorkStart,
  workEnd, setWorkEnd,
  careerStage, setCareerStage,
  yearsExperience, setYearsExperience,
  error,
  onContinue, onBack,
}: Props) {
  // Filtered suggestions for autocomplete
  const primarySuggestions = SKILL_OPTIONS.filter(
    s => s.toLowerCase().includes(skillInput.toLowerCase()) && !primarySkills.includes(s)
  );
  const secondarySuggestions = SKILL_OPTIONS.filter(
    s =>
      s.toLowerCase().includes(secondarySkillInput.toLowerCase()) &&
      !primarySkills.includes(s) &&
      !secondarySkills.includes(s)
  );

  return (
    <GlassCard variant="heavy" padding="lg">
      <GlassCardContent>
        <div className="mb-5">
          <p className="text-[11px] font-semibold text-beige-400 uppercase tracking-widest">Step 2 of 4</p>
          <p className="font-heading font-semibold text-brown-950 text-lg mt-0.5">Profile &amp; Skills</p>
          <p className="text-xs text-beige-500 mt-0.5">Add your profile details so we can intelligently match you to the right tasks</p>
        </div>

        <div className="space-y-6">
          <div>
            <SectionHeader icon={Globe} title="Profile Basics" />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth <span className="text-red-400">*</span></Label>
                <Input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                />
                <p className="text-[10px] text-beige-400">Must be 18 years or older</p>
              </div>
              <div className="space-y-2">
                <Label>Time Zone <span className="text-red-400">*</span></Label>
                <SearchCombobox
                  value={timezone} onChange={setTimezone}
                  options={TIMEZONE_OPTIONS}
                  placeholder="Select your timezone"
                  searchPlaceholder="Search timezones…"
                />
              </div>
            </div>
          </div>

          {/* ══ Work Preferences ══ */}
          <div>
            <SectionHeader icon={Clock} title="Work Preferences" />
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="avail">Weekly Availability <span className="text-red-400">*</span></Label>
                <div className="relative">
                  <Input id="avail" type="number" min="1" max="60"
                    placeholder="Hours per week"
                    value={availability} onChange={e => setAvailability(e.target.value)} className="pr-14" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-beige-400 pointer-events-none">hrs/wk</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Department Category <span className="text-red-400">*</span></Label>
                <SearchCombobox
                  value={departmentCategory} onChange={setDepartmentCategory}
                  options={DEPT_OPTIONS}
                  placeholder="Select your department"
                  searchPlaceholder="Search departments…"
                />
              </div>

              {departmentCategory === "other" && (
                <div className="space-y-2">
                  <Label htmlFor="deptOther">Department Name <span className="text-red-400">*</span></Label>
                  <Input id="deptOther" placeholder="Enter your department name"
                    value={departmentOther} onChange={e => setDepartmentOther(e.target.value)} maxLength={80} />
                </div>
              )}
            </div>
          </div>

          {/* ══ Education ══ */}
          <div>
            <SectionHeader icon={GraduationCap} title="Education" badge="(optional)" />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree / Qualification</Label>
                <Input id="degree" placeholder="Highest degree or qualification"
                  value={degree} onChange={e => setDegree(e.target.value)} maxLength={80} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Field of Study / Branch</Label>
                <Input id="branch" placeholder="Field of study or major"
                  value={branch} onChange={e => setBranch(e.target.value)} maxLength={80} />
              </div>
            </div>
          </div>

          {/* ══ Skills ══ */}
          <div>
            <SectionHeader icon={Sparkles} title="Skills" />
            <div className="space-y-4">
              <SkillAutocomplete
                label="Primary Skills"
                badge={`(${primarySkills.length}/20) — required`}
                skills={primarySkills}
                onAdd={addPrimarySkill}
                onRemove={removePrimarySkill}
                inputValue={skillInput}
                onInputChange={setSkillInput}
                suggestions={primarySuggestions}
                placeholder="Search and add your primary skills"
                tagVariant="teal"
              />
              <SkillAutocomplete
                label="Secondary Skills"
                badge={`(${secondarySkills.length}/20) — optional`}
                skills={secondarySkills}
                onAdd={addSecondarySkill}
                onRemove={removeSecondarySkill}
                inputValue={secondarySkillInput}
                onInputChange={setSecondarySkillInput}
                suggestions={secondarySuggestions}
                placeholder="Search and add supporting skills"
                tagVariant="forest"
              />
              <SkillFreeform
                label="Other / Niche Skills"
                badge="(optional — not in list above)"
                skills={otherSkills}
                onAdd={addOtherSkill}
                onRemove={removeOtherSkill}
                inputValue={otherSkillInput}
                onInputChange={setOtherSkillInput}
                placeholder="Add a niche or custom skill"
              />
            </div>
          </div>

          {/* ══ Online Presence ══ */}
          <div>
            <SectionHeader icon={Link2} title="Online Presence" badge="(optional)" />
            <div className="space-y-2">
              <Label htmlFor="li">LinkedIn Profile URL</Label>
              <Input id="li" type="url" placeholder="https://www.linkedin.com/in/your-profile"
                value={linkedin} onChange={e => setLinkedin(e.target.value)} />
            </div>
          </div>

          {/* ══ Women Workforce ══ */}
          {contribType === "women_workforce" && (
            <div className="space-y-4 p-4 rounded-xl bg-teal-50 border border-teal-200">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-teal-600" />
                <p className="text-sm font-semibold text-teal-800">Schedule Preferences</p>
                <span className="text-xs text-teal-500 ml-1">(optional)</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="ws">Preferred Start Time</Label>
                  <Input id="ws" type="time" value={workStart} onChange={e => setWorkStart(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="we">Preferred End Time</Label>
                  <Input id="we" type="time" value={workEnd} onChange={e => setWorkEnd(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Career Stage</Label>
                <SearchCombobox
                  value={careerStage} onChange={setCareerStage}
                  options={CAREER_OPTIONS}
                  placeholder="Select your career stage"
                  searchPlaceholder="Search…"
                />
              </div>
            </div>
          )}

          {/* ══ Mentor Acknowledgment ══ */}
          <label
            htmlFor="mentor-ack"
            className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
              mentorAck
                ? "border-brown-400 bg-brown-50"
                : "border-beige-200 hover:border-beige-300 bg-white"
            }`}
          >
            <Checkbox
              id="mentor-ack"
              checked={mentorAck}
              onCheckedChange={v => setMentorAck(!!v)}
              onClick={e => e.stopPropagation()}
              className="mt-0.5 shrink-0"
            />
            <span className="text-sm text-brown-800 leading-relaxed">
              I understand that my first 3 tasks will require an assigned{" "}
              <span className="font-semibold text-brown-950">Reviewer / Mentor</span>{" "}
              to guide my onboarding journey.{" "}
              <span className="text-red-400">*</span>
            </span>
          </label>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}

          <Button type="button" variant="primary" size="lg" className="w-full" onClick={onContinue}>
            Continue <ArrowRight className="w-4 h-4" />
          </Button>

          <button type="button" onClick={onBack}
            className="w-full text-sm text-beige-600 hover:text-beige-800 flex items-center justify-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}
