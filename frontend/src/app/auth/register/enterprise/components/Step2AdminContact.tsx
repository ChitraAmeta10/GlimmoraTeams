"use client";

import { useState, useRef, useEffect } from "react";
import {
  AlertCircle, ArrowRight, ArrowLeft,
  UserCircle, Mail, Briefcase,
  ChevronDown, Search, X, Check,
} from "lucide-react";
import {
  GlassCard, GlassCardContent, Button, Input, Label,
} from "@/components/ui";
import { COUNTRIES_DATA } from "../../data";

/* ── Section header ── */
function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.FC<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-5 h-5 rounded-md bg-brown-100 flex items-center justify-center shrink-0">
        <Icon className="w-3 h-3 text-brown-500" />
      </div>
      <p className="text-xs font-semibold text-brown-700 uppercase tracking-wide">{title}</p>
    </div>
  );
}

/* ── Department data ── */
const ADMIN_DEPARTMENTS = [
  { group: "Leadership",      items: ["Chief Executive Officer (CEO)", "Chief Technology Officer (CTO)", "Chief Operating Officer (COO)", "Chief Financial Officer (CFO)", "Founder / Co-Founder"] },
  { group: "Technology",      items: ["Engineering", "IT & Infrastructure", "Data & Analytics", "Cybersecurity", "Product Management"] },
  { group: "Business",        items: ["Strategy & Operations", "Business Development", "Finance & Accounting", "Legal & Compliance", "Marketing & Growth"] },
  { group: "People & Support",items: ["Human Resources", "Talent Acquisition", "Customer Success", "Administration"] },
  { group: "Other",           items: ["Other"] },
];

const ALL_DEPTS = ADMIN_DEPARTMENTS.flatMap(g => g.items);

/* ── Searchable department combobox ── */
function DeptCombobox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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

  const filteredGroups = search.trim()
    ? ADMIN_DEPARTMENTS
        .map(g => ({ ...g, items: g.items.filter(i => i.toLowerCase().includes(search.toLowerCase())) }))
        .filter(g => g.items.length > 0)
    : ADMIN_DEPARTMENTS;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`flex h-11 w-full items-center justify-between gap-2 rounded-xl border bg-white px-4 text-sm shadow-sm transition-all focus:outline-none ${
          open ? "border-brown-500 ring-2 ring-brown-500/20" : "border-beige-200 hover:border-beige-300"
        }`}
      >
        <span className={value ? "text-brown-950" : "text-beige-400"}>
          {value || "Select your department"}
        </span>
        <ChevronDown className={`h-4 w-4 text-beige-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-xl border border-beige-200 bg-white shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-beige-100">
            <Search className="w-3.5 h-3.5 text-beige-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search departments…"
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
                      key={item}
                      type="button"
                      onClick={() => { onChange(item); setOpen(false); setSearch(""); }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${
                        value === item
                          ? "bg-brown-50 text-brown-900 font-medium"
                          : "text-brown-800 hover:bg-beige-50"
                      }`}
                    >
                      <span>{item}</span>
                      {value === item && <Check className="w-3.5 h-3.5 text-brown-600 shrink-0" />}
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

/* ── Props ── */
interface Props {
  adminFirstName: string; setAdminFirstName: (v: string) => void;
  adminLastName: string;  setAdminLastName:  (v: string) => void;
  adminTitle: string;     setAdminTitle:     (v: string) => void;
  adminEmail: string;     setAdminEmail:     (v: string) => void;
  adminDept: string;      setAdminDept:      (v: string) => void;
  phoneCountry: string;   setPhoneCountry:   (v: string) => void;
  phone: string;          setPhone:          (v: string) => void;
  error: string;
  onContinue: () => void;
  onBack: () => void;
}

export function Step2AdminContact({
  adminFirstName, setAdminFirstName,
  adminLastName,  setAdminLastName,
  adminTitle,     setAdminTitle,
  adminEmail,     setAdminEmail,
  adminDept,      setAdminDept,
  phoneCountry,   setPhoneCountry,
  phone,          setPhone,
  error,
  onContinue, onBack,
}: Props) {
  const [adminDeptOther, setAdminDeptOther] = useState("");
  const selectedCountry = COUNTRIES_DATA.find(c => c.name === phoneCountry);

  return (
    <GlassCard variant="heavy" padding="lg">
      <GlassCardContent>
        <div className="mb-5">
          <p className="text-[11px] font-semibold text-beige-400 uppercase tracking-widest">Step 2 of 4</p>
          <p className="font-heading font-semibold text-brown-950 text-lg mt-0.5">Primary Administrator</p>
          <p className="text-xs text-beige-500 mt-0.5">
            Add the SPOC (Single Point of Contact) who will manage this enterprise account
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <SectionHeader icon={UserCircle} title="Administrator Details" />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="adminFn">First Name <span className="text-red-400">*</span></Label>
                  <Input id="adminFn" placeholder="Enter first name" value={adminFirstName}
                    onChange={e => setAdminFirstName(e.target.value)} maxLength={50} autoFocus />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminLn">Last Name <span className="text-red-400">*</span></Label>
                  <Input id="adminLn" placeholder="Enter last name" value={adminLastName}
                    onChange={e => setAdminLastName(e.target.value)} maxLength={50} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminPhone">Phone Number <span className="text-red-400">*</span></Label>
                <div className="flex flex-1 h-11 rounded-xl border border-beige-200 bg-white shadow-sm overflow-hidden transition-all focus-within:border-brown-500 focus-within:ring-2 focus-within:ring-brown-500/20">
                  <div className="relative flex items-center border-r border-beige-200 shrink-0">
                    <select
                      value={phoneCountry}
                      onChange={e => {
                        const country = COUNTRIES_DATA.find(item => item.name === e.target.value)!;
                        setPhoneCountry(country.name);
                        const numberPart = phone.replace(/^\+\d+\s?/, "");
                        setPhone(country.code + (numberPart ? " " + numberPart : " "));
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full"
                      aria-label="Country dial code"
                    >
                      {COUNTRIES_DATA.map(country => (
                        <option key={country.name} value={country.name}>{country.name} ({country.code})</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1.5 px-3 pointer-events-none select-none">
                      <span className={`fi fi-${selectedCountry?.iso} text-xl`} />
                      <span className="text-sm font-semibold text-brown-700">{selectedCountry?.code}</span>
                      <ChevronDown className="w-3 h-3 text-beige-400" />
                    </div>
                  </div>
                  <input
                    id="adminPhone"
                    type="tel"
                    placeholder="Work phone (with country code)"
                    value={phone.replace(/^\+\d+\s?/, "")}
                    onChange={e => {
                      const dialCode = selectedCountry?.code ?? "";
                      setPhone(dialCode + " " + e.target.value);
                    }}
                    className="flex-1 px-3 text-sm text-brown-950 bg-transparent outline-none placeholder:text-beige-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">Business Email <span className="text-red-400">*</span></Label>
                <div className="relative">
                  <Input id="adminEmail" type="email" placeholder="name@company.com"
                    value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
                    className="pl-9" autoComplete="email" />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-beige-400 pointer-events-none" />
                </div>
                <p className="text-[10px] text-beige-400">Use your work email - this will be used for all account notifications</p>
              </div>

              <div className="space-y-2">
                <Label>Department <span className="text-beige-400 text-xs">(optional)</span></Label>
                <DeptCombobox value={adminDept} onChange={setAdminDept} />
              </div>

              {adminDept === "Other" && (
                <div className="space-y-2">
                  <Label htmlFor="adminDeptOther">Specify Department</Label>
                  <Input
                    id="adminDeptOther"
                    placeholder="Enter your department"
                    value={adminDeptOther}
                    onChange={e => setAdminDeptOther(e.target.value)}
                    maxLength={80}
                    autoFocus
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="adminTitle">Job Title / Designation <span className="text-red-400">*</span></Label>
                <Input id="adminTitle" placeholder="Job title or designation"
                  value={adminTitle} onChange={e => setAdminTitle(e.target.value)} maxLength={100} />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-brown-50 border border-brown-200">
            <Briefcase className="w-4 h-4 text-brown-500 shrink-0 mt-0.5" />
            <p className="text-xs text-brown-700 leading-relaxed">
              The administrator account has full access to the enterprise dashboard, billing, team management, and task workflows. Additional sub-admins can be invited after setup.
            </p>
          </div>

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
