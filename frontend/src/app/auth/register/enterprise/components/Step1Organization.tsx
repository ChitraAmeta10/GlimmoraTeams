"use client";

import { useState, useRef, useEffect } from "react";
import {
  AlertCircle, ArrowRight,
  Rocket, Building2, Building, Globe,
  Heart, Landmark, GraduationCap, Users,
  Link2, Shapes, Upload, CheckCircle,
  ChevronDown, Search, X, Check,
} from "lucide-react";
import {
  GlassCard, GlassCardContent, Button, Input, Label,
} from "@/components/ui";
import { CountryCombobox } from "../../components/CountryCombobox";
import type { OrgType } from "../hooks/useEnterpriseRegistration";

/* ── Industry data ── */
const INDUSTRY_GROUPS = [
  { group: "Technology", items: [
    { value: "software-saas",  label: "Software & SaaS" },
    { value: "it-services",    label: "IT Services & Consulting" },
    { value: "cybersecurity",  label: "Cybersecurity" },
    { value: "ai-data",        label: "AI, Data Science & Analytics" },
    { value: "hardware",       label: "Hardware & Electronics" },
    { value: "telecom",        label: "Telecommunications" },
  ]},
  { group: "Finance & Business", items: [
    { value: "banking",     label: "Banking & Financial Services" },
    { value: "investment",  label: "Investment & Asset Management" },
    { value: "insurance",   label: "Insurance" },
    { value: "accounting",  label: "Accounting & Audit" },
    { value: "consulting",  label: "Management Consulting" },
  ]},
  { group: "Healthcare & Life Sciences", items: [
    { value: "healthcare", label: "Hospitals & Healthcare" },
    { value: "pharma",     label: "Pharmaceuticals & Biotech" },
    { value: "medtech",    label: "Medical Devices & HealthTech" },
  ]},
  { group: "Creative & Media", items: [
    { value: "advertising",     label: "Advertising & Marketing" },
    { value: "media",           label: "Media & Entertainment" },
    { value: "publishing",      label: "Publishing & Content" },
    { value: "design-creative", label: "Design & Creative Services" },
  ]},
  { group: "Manufacturing & Industry", items: [
    { value: "automotive",   label: "Automotive & Transportation" },
    { value: "aerospace",    label: "Aerospace & Defence" },
    { value: "construction", label: "Construction & Real Estate" },
    { value: "energy",       label: "Energy & Utilities" },
    { value: "fmcg",         label: "FMCG & Consumer Goods" },
    { value: "logistics",    label: "Logistics & Supply Chain" },
  ]},
  { group: "Education & Research", items: [
    { value: "edtech",    label: "Education & e-Learning" },
    { value: "research",  label: "Research & Development" },
    { value: "nonprofit", label: "Non-profit & NGO" },
  ]},
  { group: "Government & Public", items: [
    { value: "public-admin", label: "Government & Public Administration" },
    { value: "legal",        label: "Legal Services & Compliance" },
    { value: "staffing",     label: "Staffing & Recruitment" },
  ]},
  { group: "Other", items: [
    { value: "other", label: "Other" },
  ]},
];

const ALL_INDUSTRIES = INDUSTRY_GROUPS.flatMap(g => g.items);

/* ── Searchable industry combobox ── */
function IndustryCombobox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const ref                 = useRef<HTMLDivElement>(null);
  const inputRef            = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const selected = ALL_INDUSTRIES.find(i => i.value === value);

  const filteredGroups = search.trim()
    ? INDUSTRY_GROUPS
        .map(g => ({
          ...g,
          items: g.items.filter(i => i.label.toLowerCase().includes(search.toLowerCase())),
        }))
        .filter(g => g.items.length > 0)
    : INDUSTRY_GROUPS;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`flex h-11 w-full items-center justify-between gap-2 rounded-xl border bg-white px-4 text-sm shadow-sm transition-all focus:outline-none ${
          open ? "border-brown-500 ring-2 ring-brown-500/20" : "border-beige-200 hover:border-beige-300"
        }`}
      >
        <span className={selected ? "text-brown-950" : "text-beige-400"}>
          {selected ? selected.label : "Select your industry"}
        </span>
        <ChevronDown className={`h-4 w-4 text-beige-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-xl border border-beige-200 bg-white shadow-xl overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-beige-100">
            <Search className="w-3.5 h-3.5 text-beige-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search industries…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-sm text-brown-950 bg-transparent outline-none placeholder:text-beige-400"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="text-beige-400 hover:text-beige-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-52 overflow-y-auto overscroll-contain">
            {filteredGroups.length === 0 ? (
              <p className="px-4 py-3 text-sm text-beige-400 text-center">No results found</p>
            ) : (
              filteredGroups.map(({ group, items }) => (
                <div key={group}>
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-beige-400 bg-beige-50 border-b border-beige-100">
                    {group}
                  </p>
                  {items.map(item => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => { onChange(item.value); setOpen(false); setSearch(""); }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${
                        value === item.value
                          ? "bg-brown-50 text-brown-900 font-medium"
                          : "text-brown-800 hover:bg-beige-50"
                      }`}
                    >
                      <span>{item.label}</span>
                      {value === item.value && <Check className="w-3.5 h-3.5 text-brown-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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
      <div className="w-5 h-5 rounded-md bg-brown-100 flex items-center justify-center shrink-0">
        <Icon className="w-3 h-3 text-brown-500" />
      </div>
      <p className="text-xs font-semibold text-brown-700 uppercase tracking-wide">{title}</p>
      {badge && <span className="text-[10px] text-beige-400 font-medium">{badge}</span>}
    </div>
  );
}

const ORG_TYPES: {
  value: Exclude<OrgType, "">;
  label: string;
  sub: string;
  Icon: React.FC<{ className?: string }>;
}[] = [
  { value: "startup", label: "Startup", sub: "Early-stage venture", Icon: Rocket },
  { value: "sme", label: "SME", sub: "Small-to-mid size", Icon: Building2 },
  { value: "large-enterprise", label: "Enterprise", sub: "1,000+ employees", Icon: Building },
  { value: "mnc", label: "MNC", sub: "Multinational corp.", Icon: Globe },
  { value: "ngo", label: "NGO / Non-profit", sub: "Charity / foundation", Icon: Heart },
  { value: "government", label: "Government", sub: "Public sector body", Icon: Landmark },
  { value: "educational", label: "Educational", sub: "University / institute", Icon: GraduationCap },
  { value: "agency", label: "Agency", sub: "Consulting / staffing", Icon: Users },
  { value: "other", label: "Other", sub: "Custom organisation type", Icon: Shapes },
];

const SIZE_OPTIONS = [
  { value: "1-10", label: "1 - 10", sub: "Solo / micro team" },
  { value: "11-50", label: "11 - 50", sub: "Small team" },
  { value: "51-200", label: "51 - 200", sub: "Growing team" },
  { value: "201-1000", label: "201 - 1,000", sub: "Mid-size company" },
  { value: "1001-5000", label: "1,001 - 5,000", sub: "Large company" },
  { value: "5001-10000", label: "5,001 - 10,000", sub: "Very large" },
  { value: "10000+", label: "10,000+", sub: "Global enterprise" },
];

interface Props {
  orgName: string; setOrgName: (v: string) => void;
  orgType: OrgType; setOrgType: (v: OrgType) => void;
  orgTypeOther: string; setOrgTypeOther: (v: string) => void;
  industry: string; setIndustry: (v: string) => void;
  industryOther: string; setIndustryOther: (v: string) => void;
  companySize: string; setCompanySize: (v: string) => void;
  website: string; setWebsite: (v: string) => void;
  incorporationCountry: string; setIncorporationCountry: (v: string) => void;
  incorporationFile: File | null; setIncorporationFile: (v: File | null) => void;
  incorporationDrag: boolean; setIncorporationDrag: (v: boolean) => void;
  error: string;
  onContinue: () => void;
}

export function Step1Organization({
  orgName, setOrgName,
  orgType, setOrgType,
  orgTypeOther, setOrgTypeOther,
  industry, setIndustry,
  industryOther, setIndustryOther,
  companySize, setCompanySize,
  website, setWebsite,
  incorporationCountry, setIncorporationCountry,
  incorporationFile, setIncorporationFile,
  incorporationDrag, setIncorporationDrag,
  error,
  onContinue,
}: Props) {
  return (
    <GlassCard variant="heavy" padding="lg">
      <GlassCardContent>
        <div className="mb-5">
          <p className="text-[11px] font-semibold text-beige-400 uppercase tracking-widest">Step 1 of 4</p>
          <p className="font-heading font-semibold text-brown-950 text-lg mt-0.5">Organisation Profile</p>
          <p className="text-xs text-beige-500 mt-0.5">Tell us about your company so we can tailor the platform to your needs</p>
        </div>

        <div className="space-y-6">
          <div>
            <SectionHeader icon={Building} title="Company Identity" />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organisation Name <span className="text-red-400">*</span></Label>
                <Input
                  id="orgName"
                  placeholder="Legal name of your organisation"
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  maxLength={120}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label>Organisation Type <span className="text-red-400">*</span></Label>
                <div className="grid grid-cols-3 gap-2">
                  {ORG_TYPES.map(({ value, label, sub, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setOrgType(value)}
                      className={`flex flex-col items-center text-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        orgType === value
                          ? "border-brown-600 bg-brown-50 shadow-sm"
                          : "border-beige-200 hover:border-brown-300 bg-white"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${orgType === value ? "text-brown-600" : "text-beige-400"}`} />
                      <div>
                        <p className={`text-[11px] font-semibold leading-tight ${orgType === value ? "text-brown-900" : "text-brown-700"}`}>{label}</p>
                        <p className="text-[9px] text-beige-400 mt-0.5 leading-tight">{sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {orgType === "other" && (
                <div className="space-y-2">
                  <Label htmlFor="orgTypeOther">Other Organisation Type <span className="text-red-400">*</span></Label>
                  <Input
                    id="orgTypeOther"
                    placeholder="Specify your organisation type"
                    value={orgTypeOther}
                    onChange={e => setOrgTypeOther(e.target.value)}
                    maxLength={80}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Industry / Sector <span className="text-red-400">*</span></Label>
                <IndustryCombobox value={industry} onChange={setIndustry} />
              </div>

              {industry === "other" && (
                <div className="space-y-2">
                  <Label htmlFor="industryOther">Other Industry / Sector <span className="text-red-400">*</span></Label>
                  <Input
                    id="industryOther"
                    placeholder="Specify your industry or sector"
                    value={industryOther}
                    onChange={e => setIndustryOther(e.target.value)}
                    maxLength={80}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <SectionHeader icon={Users} title="Scale & Reach" />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Company Size <span className="text-red-400">*</span></Label>
                <div className="grid grid-cols-2 gap-2">
                  {SIZE_OPTIONS.map(({ value, label, sub }, index) => {
                    const isLast = index === SIZE_OPTIONS.length - 1;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setCompanySize(value)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-left ${
                          isLast ? "col-span-2" : ""
                        } ${
                          companySize === value
                            ? "border-brown-600 bg-brown-50 shadow-sm"
                            : "border-beige-200 hover:border-brown-300 bg-white"
                        }`}
                      >
                        <span className={`text-sm font-semibold ${companySize === value ? "text-brown-900" : "text-brown-700"}`}>{label}</span>
                        <span className="text-[10px] text-beige-400">{sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <div className="relative">
                  <Input
                    id="website"
                    type="url"
                    placeholder="www.company.com"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    className="pl-9"
                  />
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-beige-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Certification of Incorporation */}
          <div className="pt-2 border-t border-beige-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-md bg-beige-100 flex items-center justify-center shrink-0">
                <Upload className="w-3 h-3 text-beige-500" />
              </div>
              <p className="text-xs font-semibold text-brown-700 uppercase tracking-wide">Certification of Incorporation</p>
              <span className="text-[10px] text-beige-400 font-medium">(optional · PDF · max 10 MB)</span>
            </div>
            <div className="grid grid-cols-2 gap-3 items-start">
              {/* Left: Country of Incorporation */}
              <div className="space-y-2">
                <Label>Country of Incorporation</Label>
                <CountryCombobox value={incorporationCountry} onChange={setIncorporationCountry} />
              </div>
              {/* Right: File upload */}
              <div className="space-y-2">
                <Label className="invisible select-none">Upload</Label>
                <label
                  onDragOver={e => { e.preventDefault(); setIncorporationDrag(true); }}
                  onDragLeave={() => setIncorporationDrag(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setIncorporationDrag(false);
                    const file = e.dataTransfer.files[0];
                    if (file && file.type === "application/pdf") setIncorporationFile(file);
                  }}
                  className={`flex items-center gap-3 w-full rounded-xl border-2 border-dashed px-4 py-3 cursor-pointer transition-all ${
                    incorporationDrag
                      ? "border-brown-400 bg-brown-50"
                      : incorporationFile
                      ? "border-teal-400 bg-teal-50"
                      : "border-beige-300 hover:border-beige-400 bg-white"
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    className="sr-only"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) setIncorporationFile(file);
                    }}
                  />
                  {incorporationFile ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-teal-500 shrink-0" />
                      <p className="text-xs font-medium text-teal-700 flex-1 truncate">{incorporationFile.name}</p>
                      <button
                        type="button"
                        onClick={e => { e.preventDefault(); setIncorporationFile(null); }}
                        className="text-xs text-beige-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-lg bg-beige-100 flex items-center justify-center shrink-0">
                        <Upload className="w-3.5 h-3.5 text-beige-400" />
                      </div>
                      <div>
                        <p className="text-xs text-brown-700 font-medium leading-snug">
                          Drop here or <span className="text-teal-600 underline">browse files</span>
                        </p>
                        <p className="text-[10px] text-beige-400 mt-0.5">PDF only · Max 10 MB</p>
                      </div>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}

          <Button type="button" variant="primary" size="lg" className="w-full" onClick={onContinue}>
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}
