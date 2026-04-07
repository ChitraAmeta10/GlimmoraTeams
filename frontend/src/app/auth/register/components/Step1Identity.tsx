"use client";

import Link from "next/link";
import {
  Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle,
  GraduationCap, Briefcase, Users,
} from "lucide-react";
import {
  GlassCard, GlassCardContent, Button, Input, Label,
} from "@/components/ui";
import { CountryCombobox } from "./CountryCombobox";
import type { PasswordStrength, SSOProvider } from "../types";
import type { ContributorType } from "../types";

interface Props {
  firstName: string;       setFirstName: (v: string) => void;
  lastName: string;        setLastName: (v: string) => void;
  email: string;           setEmail: (v: string) => void;
  password: string;        setPassword: (v: string) => void;
  confirm: string;         setConfirm: (v: string) => void;
  showPw: boolean;         setShowPw: (v: boolean) => void;
  showCon: boolean;        setShowCon: (v: boolean) => void;
  contribType: ContributorType; setContribType: (v: ContributorType) => void;
  country: string;         setCountry: (v: string) => void;
  passwordStrength: PasswordStrength;
  error: string;
  onContinue: () => void;
  isSsoUser?: boolean;
  ssoProvider?: SSOProvider | null;
}

const CONTRIBUTOR_TYPES: {
  value: ContributorType;
  label: string;
  sub: string;
  Icon: React.FC<{ className?: string }>;
  activeClass: string;
  activeIcon: string;
}[] = [
  {
    value: "student",
    label: "Student",
    sub: "University / college",
    Icon: GraduationCap,
    activeClass: "border-brown-500 bg-brown-50",
    activeIcon: "text-brown-600",
  },
  {
    value: "women_workforce",
    label: "Women Workforce",
    sub: "Returnship / professional",
    Icon: Briefcase,
    activeClass: "border-teal-500 bg-teal-50",
    activeIcon: "text-teal-600",
  },
  {
    value: "general_workforce",
    label: "General Workforce",
    sub: "Professional contributor",
    Icon: Users,
    activeClass: "border-forest-500 bg-forest-50",
    activeIcon: "text-forest-600",
  },
];

export function Step1Identity({
  firstName, setFirstName,
  lastName, setLastName,
  email, setEmail,
  password, setPassword,
  confirm, setConfirm,
  showPw, setShowPw,
  showCon, setShowCon,
  contribType, setContribType,
  country, setCountry,
  passwordStrength,
  error,
  onContinue,
  isSsoUser = false,
  ssoProvider = null,
}: Props) {
  return (
    <GlassCard variant="heavy" padding="lg">
      <GlassCardContent>
        <div className="mb-5">
          <p className="text-[11px] font-semibold text-beige-400 uppercase tracking-widest">Step 1 of 4</p>
          <p className="font-heading font-semibold text-brown-950 text-lg mt-0.5">Basic Identity</p>
          <p className="text-xs text-beige-500 mt-0.5">Tell us who you are to get started</p>
        </div>

        <div className="space-y-4">

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="fn">First Name <span className="text-red-400">*</span></Label>
              <Input id="fn" placeholder="Enter first name" value={firstName}
                onChange={e => setFirstName(e.target.value)} maxLength={50} autoFocus />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ln">Last Name <span className="text-red-400">*</span></Label>
              <Input id="ln" placeholder="Enter last name" value={lastName}
                onChange={e => setLastName(e.target.value)} maxLength={50} />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address <span className="text-red-400">*</span></Label>
            <div className="relative">
              <Input id="email" type="email" placeholder="name@company.com" value={email}
                onChange={e => setEmail(e.target.value)} autoComplete="email"
                readOnly={isSsoUser} className={isSsoUser ? "pr-10 bg-beige-50 text-beige-700" : ""} />
              {isSsoUser && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-teal-500" />
                </div>
              )}
            </div>
            {isSsoUser && ssoProvider && (
              <p className="text-xs text-teal-600 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verified via {ssoProvider === "google" ? "Google" : "Microsoft"}
              </p>
            )}
          </div>

          {/* Password — hidden for SSO users */}
          {!isSsoUser && (
            <div className="space-y-2">
              <Label htmlFor="pw">Password <span className="text-red-400">*</span></Label>
              <div className="relative">
                <Input id="pw" type={showPw ? "text" : "password"}
                  placeholder="Create a strong password (min 8 characters)"
                  value={password} onChange={e => setPassword(e.target.value)} className="pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-beige-400 hover:text-beige-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= passwordStrength.score ? passwordStrength.color : "bg-beige-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    passwordStrength.score <= 1 ? "text-red-500"
                    : passwordStrength.score <= 3 ? "text-gold-600"
                    : "text-teal-600"
                  }`}>
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Confirm password — hidden for SSO users */}
          {!isSsoUser && (
            <div className="space-y-2">
              <Label htmlFor="con">Confirm Password <span className="text-red-400">*</span></Label>
              <div className="relative">
                <Input id="con" type={showCon ? "text" : "password"}
                  placeholder="Re-enter password to confirm"
                  value={confirm} onChange={e => setConfirm(e.target.value)} className="pr-10" />
                <button type="button" onClick={() => setShowCon(!showCon)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-beige-400 hover:text-beige-600">
                  {showCon ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Contributor type */}
          <div className="space-y-2">
            <Label>Contributor Type <span className="text-red-400">*</span></Label>
            <div className="grid grid-cols-3 gap-2">
              {CONTRIBUTOR_TYPES.map(({ value, label, sub, Icon, activeClass, activeIcon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setContribType(value)}
                  className={`flex flex-col items-center text-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    contribType === value ? activeClass : "border-beige-200 hover:border-beige-300 bg-white"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${contribType === value ? activeIcon : "text-beige-400"}`} />
                  <div>
                    <p className="text-xs font-semibold text-brown-950 leading-tight">{label}</p>
                    <p className="text-[10px] text-beige-500 mt-0.5 leading-tight">{sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Country of Residence <span className="text-red-400">*</span></Label>
            <CountryCombobox value={country} onChange={setCountry} />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}

          <Button type="button" variant="primary" size="lg" className="w-full" onClick={onContinue}>
            Continue <ArrowRight className="w-4 h-4" />
          </Button>

          <p className="text-center text-sm text-beige-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-teal-600 hover:text-teal-700 font-medium">Sign in</Link>
          </p>
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}
