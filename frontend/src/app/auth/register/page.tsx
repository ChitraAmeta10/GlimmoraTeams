"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  Briefcase,
  ArrowLeft,
  CheckCircle,
  Mail,
  Lock,
  Shield,
  Globe,
  Users,
  TrendingUp,
  Zap,
  BadgeCheck,
  CreditCard,
  MessageSquare,
  LayoutGrid,
  RefreshCw,
  ArrowRight,
  PenLine,
} from "lucide-react";
import { GlassCard, GlassCardContent } from "@/components/ui";

import { useRegistration } from "./hooks/useRegistration";
import { StepProgress } from "./components/StepProgress";
import { Step1Identity } from "./components/Step1Identity";
import { Step2Verification } from "./components/Step2Verification";
import { Step3Profile } from "./components/Step3Profile";
import { Step4Consent } from "./components/Step4Consent";
import { ReviewPreviewModal } from "./components/ReviewPreviewModal";
import type { SSOData, SSOProvider } from "./types";

/* ─────────────────────────── constants ─────────────────────────── */

const STATS = [
  { value: "50K+", label: "Contributors" },
  { value: "120+", label: "Countries" },
  { value: "10K+", label: "Projects" },
];

const FEATURES = [
  { Icon: Zap,       title: "AI-Matched Tasks",      desc: "Get recommended to projects that fit your exact skill set." },
  { Icon: Globe,     title: "Global Earnings",        desc: "Get paid in your local currency with zero conversion fees." },
  { Icon: TrendingUp,title: "Verified Portfolio",    desc: "Build a trust-scored profile that speaks louder than a CV." },
  { Icon: Users,     title: "Expert Community",       desc: "Collaborate with top-tier professionals across 120+ countries." },
];

const MOCK_SSO_DATA: Record<SSOProvider, SSOData> = {
  google:    { firstName: "Alex",  lastName: "Johnson", email: "alex.johnson@gmail.com",   provider: "google"    },
  microsoft: { firstName: "Jamie", lastName: "Lee",     email: "jamie.lee@outlook.com",     provider: "microsoft" },
};

/* ─────────────────────────── helpers ─────────────────────────── */

function getSsoDataFromStorage(): SSOData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("sso_data");
    if (!raw) return null;
    return JSON.parse(raw) as SSOData;
  } catch {
    return null;
  }
}

/* ─────────────────────────── left content (no box) ─────────────────────────── */

const LEFT_STATS = [
  { value: "50K+",  label: "Students & Pros"   },
  { value: "120+",  label: "Countries"          },
  { value: "2.4K+", label: "Companies Hiring"  },
];

const LEFT_FEATURES = [
  { Icon: BadgeCheck,    label: "Verified Professionals" },
  { Icon: CreditCard,    label: "Secure Payments"        },
  { Icon: MessageSquare, label: "Smart Collaboration"    },
  { Icon: LayoutGrid,    label: "Project Management"     },
];


function LeftContent() {
  return (
    <div className="hidden lg:flex flex-col flex-1 max-w-lg py-8 pr-6 justify-between min-h-[680px]">

      {/* ── TOP ── */}
      <div>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-7 group w-fit">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brown-500 to-brown-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-semibold text-brown-950 group-hover:text-brown-700 transition-colors">
            GlimmoraTeam
          </span>
        </Link>

        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 w-fit mb-5">
          <div className="flex -space-x-1.5">
            {["bg-teal-500","bg-brown-400","bg-amber-400","bg-violet-400"].map((c, i) => (
              <div key={i} className={`w-5 h-5 rounded-full ${c} border-2 border-white flex items-center justify-center`}>
                <Users className="w-2.5 h-2.5 text-white" />
              </div>
            ))}
          </div>
          <span className="text-xs font-medium text-teal-700">Trusted by 50K+ professionals</span>
        </div>

        {/* Eyebrow */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-600 mb-3 flex items-center gap-2">
          <span className="w-5 h-px bg-teal-500" />
          Global Workforce Platform
        </p>

        {/* Headline */}
        <h2 className="font-heading text-4xl font-bold text-brown-950 leading-[1.15] mb-4">
          Your career or company<br />
          <span className="text-teal-600">starts here</span> — on a<br />
          global stage.
        </h2>

        {/* Description */}
        <p className="text-sm text-beige-600 leading-relaxed max-w-sm">
          Whether you&apos;re a student landing your first role, a professional growing your freelance career,
          or a company scaling with world-class talent — GlimmoraTeam connects you.
        </p>
      </div>

      {/* ── MIDDLE ── */}
      <div>
        {/* Stats row */}
        <div className="flex items-center gap-6 mb-5">
          {LEFT_STATS.map(({ value, label }, i) => (
            <div key={label} className={`${i > 0 ? "pl-6 border-l border-beige-200" : ""}`}>
              <p className="font-heading text-2xl font-bold text-brown-950">{value}</p>
              <p className="text-xs text-beige-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Features 2×2 */}
        <div className="grid grid-cols-2 gap-2.5">
          {LEFT_FEATURES.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/60 border border-beige-100 hover:border-teal-100 hover:bg-white transition-colors">
              <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-teal-600" />
              </div>
              <span className="text-sm text-brown-700 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM ── */}
      <div>
        {/* Trust footer */}
        <div className="flex items-center gap-3 text-xs text-beige-400">
          <div className="flex items-center gap-1"><Lock className="w-3 h-3" /><span>256-bit SSL</span></div>
          <span>·</span>
          <div className="flex items-center gap-1"><Shield className="w-3 h-3" /><span>SOC 2 Type II</span></div>
          <span>·</span>
          <div className="flex items-center gap-1"><Globe className="w-3 h-3" /><span>GDPR</span></div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── role bar (compact badge) ─────────────────────────── */

function RoleBar({
  role,
  onChange,
  animateIn,
}: {
  role: "contributor" | "enterprise";
  onChange: () => void;
  animateIn?: boolean;
}) {
  const config = {
    contributor: { label: "Contributor Account", Icon: Sparkles, color: "bg-teal-500", ring: "ring-teal-200" },
    enterprise:  { label: "Enterprise Account",  Icon: Briefcase, color: "bg-brown-600", ring: "ring-brown-200" },
  } as const;
  const { label, Icon, color, ring } = config[role];

  return (
    <div
      className={`flex items-center justify-between px-1 transition-all duration-500 ${
        animateIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-lg ${color} ring-2 ${ring} flex items-center justify-center shadow-sm`}>
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-brown-950">{label}</span>
        {role === "contributor" && <CheckCircle className="w-3.5 h-3.5 text-teal-500" />}
      </div>
      <button
        type="button"
        onClick={onChange}
        className="flex items-center gap-1 text-xs text-beige-500 hover:text-brown-700 transition-colors"
      >
        <ArrowLeft className="w-3 h-3" /> Change
      </button>
    </div>
  );
}

/* ─────────────────────────── invite-only card ─────────────────────────── */

function InviteOnlyCard() {
  return (
    <GlassCard variant="heavy" padding="lg" className="mb-4">
      <GlassCardContent>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-brown-500 to-brown-700 flex items-center justify-center shrink-0 shadow-lg shadow-brown-200">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-brown-950 mb-1">Invitation Required</p>
            <p className="text-sm text-beige-600 leading-relaxed">
              Enterprise accounts are provisioned by a GlimmoraTeam Admin and created via a secure email invitation.
              Please check your inbox for your account creation link.
            </p>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-beige-100">
              <span className="text-xs text-beige-500">No invitation?</span>
              <Link href="/auth/login" className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                Contact your Administrator
              </Link>
            </div>
          </div>
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}

/* ─────────────────────────── auth method picker ─────────────────────────── */

function AuthMethodPicker({
  role,
  onSSO,
  onManual,
  ssoLoading,
}: {
  role: "contributor" | "enterprise";
  onSSO: (provider: SSOProvider) => void;
  onManual: () => void;
  ssoLoading: SSOProvider | null;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const isContributor = role === "contributor";
  const accentClass   = isContributor ? "bg-teal-50 border-teal-200 text-teal-800" : "bg-brown-50 border-brown-200 text-brown-800";
  const iconClass     = isContributor ? "from-teal-500 to-teal-700 shadow-teal-200"  : "from-brown-500 to-brown-700 shadow-brown-200";
  const RoleIcon      = isContributor ? Sparkles : Briefcase;

  return (
    <div
      className={`transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* Context banner */}
      <div className={`p-3.5 rounded-2xl border flex items-center gap-3 mb-5 ${accentClass}`}>
        <div className={`w-9 h-9 rounded-xl bg-linear-to-br ${iconClass} flex items-center justify-center shrink-0 shadow-lg`}>
          <RoleIcon className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold">
            {isContributor ? "Contributor Account" : "Enterprise Account"}
          </p>
          <p className="text-xs opacity-70 mt-0.5">
            {isContributor
              ? "Find tasks, earn globally, build your verified profile"
              : "Hire talent, manage projects, track deliverables"}
          </p>
        </div>
      </div>

      <p className="text-[11px] font-semibold text-beige-400 uppercase tracking-widest mb-3 px-0.5">
        Choose how to register
      </p>

      <div className="space-y-2.5">
        {/* Google */}
        <button
          type="button"
          onClick={() => onSSO("google")}
          disabled={!!ssoLoading}
          style={{ transitionDelay: "80ms" }}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-beige-200 bg-white hover:border-teal-300 hover:shadow-md hover:shadow-teal-50 transition-all text-sm font-medium text-brown-800 disabled:opacity-50 group ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
        >
          {ssoLoading === "google" ? (
            <RefreshCw className="w-5 h-5 animate-spin text-beige-400 shrink-0" />
          ) : (
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )}
          <span className="flex-1 text-left">Continue with Google</span>
          <ArrowRight className="w-4 h-4 text-beige-300 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Microsoft */}
        <button
          type="button"
          onClick={() => onSSO("microsoft")}
          disabled={!!ssoLoading}
          style={{ transitionDelay: "150ms" }}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-beige-200 bg-white hover:border-blue-300 hover:shadow-md hover:shadow-blue-50 transition-all text-sm font-medium text-brown-800 disabled:opacity-50 group ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
        >
          {ssoLoading === "microsoft" ? (
            <RefreshCw className="w-5 h-5 animate-spin text-beige-400 shrink-0" />
          ) : (
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <rect fill="#F25022" x="1"  y="1"  width="10" height="10" />
              <rect fill="#7FBA00" x="13" y="1"  width="10" height="10" />
              <rect fill="#00A4EF" x="1"  y="13" width="10" height="10" />
              <rect fill="#FFB900" x="13" y="13" width="10" height="10" />
            </svg>
          )}
          <span className="flex-1 text-left">Continue with Microsoft</span>
          <ArrowRight className="w-4 h-4 text-beige-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Divider */}
        <div
          style={{ transitionDelay: "200ms" }}
          className={`relative flex items-center gap-3 py-1 transition-all duration-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex-1 h-px bg-beige-200" />
          <span className="text-xs text-beige-400 font-medium">or</span>
          <div className="flex-1 h-px bg-beige-200" />
        </div>

        {/* Manual */}
        <button
          type="button"
          onClick={onManual}
          style={{ transitionDelay: "240ms" }}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-beige-200 bg-white hover:border-brown-300 hover:shadow-md hover:shadow-brown-50 transition-all text-sm font-medium text-brown-800 group ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
        >
          <div className="w-5 h-5 rounded-md bg-beige-100 flex items-center justify-center shrink-0 group-hover:bg-brown-100 transition-colors">
            <PenLine className="w-3 h-3 text-beige-500 group-hover:text-brown-600 transition-colors" />
          </div>
          <span className="flex-1 text-left">Register manually</span>
          <ArrowRight className="w-4 h-4 text-beige-300 group-hover:text-brown-400 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── role picker ─────────────────────────── */

const ROLE_OPTIONS = [
  {
    role: "contributor" as const,
    label: "Contributor",
    sub: "For students & professionals seeking real-world opportunities",
    Icon: Sparkles,
    who: "Students · Freelancers · Working Professionals",
    perks: ["AI-matched tasks & internships", "Build a verified skill portfolio", "Earn globally — any experience level"],
    activeColor: "border-teal-400 bg-teal-50/60 shadow-teal-100",
    iconColor: "bg-teal-500",
    checkColor: "text-teal-500",
    badge: "Students & Pros",
    badgeColor: "bg-teal-100 text-teal-700",
  },
  {
    role: "enterprise" as const,
    label: "Enterprise",
    sub: "For companies hiring & managing distributed talent",
    Icon: Briefcase,
    who: "Startups · SMBs · Large Enterprises",
    perks: ["Post projects & hire vetted talent", "Manage teams & track deliverables", "Workforce analytics & compliance tools"],
    activeColor: "border-brown-400 bg-brown-50/60 shadow-brown-100",
    iconColor: "bg-brown-500",
    checkColor: "text-brown-500",
    badge: "For Companies",
    badgeColor: "bg-brown-100 text-brown-700",
  },
] as const;

function RolePicker({
  onSelect,
  visible,
}: {
  onSelect: (role: "contributor" | "enterprise") => void;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      className={`transition-all duration-400 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <GlassCard variant="heavy" padding="lg" className="mb-4">
        <GlassCardContent>
          <p className="text-[11px] font-semibold text-beige-400 uppercase tracking-widest mb-4">
            Select account type
          </p>
          <div className="space-y-3">
            {ROLE_OPTIONS.map(({ role, label, sub, who, Icon, perks, activeColor, iconColor, checkColor, badge, badgeColor }) => (
              <button
                key={role}
                type="button"
                onClick={() => onSelect(role)}
                onMouseEnter={() => setHovered(role)}
                onMouseLeave={() => setHovered(null)}
                className={`group w-full flex items-start gap-4 p-4 rounded-2xl border-2 bg-white transition-all duration-200 text-left shadow-sm hover:shadow-md ${
                  hovered === role ? activeColor : "border-beige-200"
                }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center shrink-0 mt-0.5 shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-brown-950">{label}</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
                  </div>
                  <p className="text-xs text-beige-500 mb-1.5">{sub}</p>
                  <p className="text-[11px] font-medium text-beige-400 mb-2">{who}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {perks.map((p) => (
                      <span key={p} className="flex items-center gap-1 text-[11px] text-beige-600">
                        <CheckCircle className={`w-3 h-3 ${checkColor} shrink-0`} />
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight className={`w-4 h-4 mt-1 shrink-0 transition-all duration-200 ${hovered === role ? "text-brown-400 translate-x-0.5" : "text-beige-300"}`} />
              </button>
            ))}
          </div>
        </GlassCardContent>
      </GlassCard>
      <p className="text-center text-sm text-beige-600 mb-2">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-teal-600 hover:text-teal-700 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}

/* ─────────────────────────── page exports ─────────────────────────── */

export default function ContributorRegisterPage() {
  return (
    <Suspense>
      <ContributorRegisterContent />
    </Suspense>
  );
}

type UIState = "picker" | "authOptions" | "registering";

function ContributorRegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ssoParam = searchParams.get("sso");

  const [ssoData] = useState<SSOData | null>(() => ssoParam ? getSsoDataFromStorage() : null);
  const reg = useRegistration(ssoData);

  const [uiState, setUiState] = useState<UIState>(() => {
    // If arrived via SSO redirect, jump straight to registering
    if (ssoParam) return "registering";
    return "picker";
  });
  const [selectedRole, setSelectedRole] = useState<"contributor" | "enterprise" | "">("");
  const [ssoLoading, setSsoLoading] = useState<SSOProvider | null>(null);
  const [roleBarAnimated, setRoleBarAnimated] = useState(false);

  const handleRoleSelect = (role: "contributor" | "enterprise") => {
    setSelectedRole(role);
    setTimeout(() => {
      setUiState("authOptions");
      setTimeout(() => setRoleBarAnimated(true), 80);
    }, 150);
  };

  const handleSSO = async (provider: SSOProvider) => {
    setSsoLoading(provider);
    await new Promise((r) => setTimeout(r, 1200));
    sessionStorage.setItem("sso_data", JSON.stringify(MOCK_SSO_DATA[provider]));
    router.push(`/auth/register?sso=${provider}`);
  };

  const handleManual = () => {
    const role = selectedRole || reg.registrationRole;
    if (!role) return;
    if (role === "enterprise") {
      router.push("/auth/register/enterprise");
      return;
    }
    reg.setRegistrationRole("contributor");
    reg.setStep(1);
    reg.setError("");
    setUiState("registering");
  };

  const resetToRolePicker = () => {
    setUiState("picker");
    setSelectedRole("");
    setRoleBarAnimated(false);
    reg.setRegistrationRole("");
    reg.setStep(1);
    reg.setError("");
  };

  // When SSO pre-fills role
  const activeRole = (reg.registrationRole as "contributor" | "enterprise") || (selectedRole as "contributor" | "enterprise") || undefined;

  const showLeftContent = uiState === "picker";

  const logo = (
    <Link href="/" className="flex items-center gap-2 group w-fit">
      <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brown-500 to-brown-700 flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <span className="font-heading font-semibold text-brown-950 group-hover:text-brown-700 transition-colors">
        GlimmoraTeam
      </span>
    </Link>
  );

  const formBody = (
    <>
      {/* SSO pre-fill notice */}
      {reg.isSsoUser && ssoData && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-start gap-3 mb-4">
          <CheckCircle className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-teal-800">
              Signed in with {ssoData.provider === "google" ? "Google" : "Microsoft"}
            </p>
            <p className="text-xs text-teal-700 mt-0.5 leading-relaxed">
              Welcome, {ssoData.firstName}! Select your account type and complete your profile to get started.
            </p>
          </div>
        </div>
      )}

        {/* ── State: picker ── */}
        {uiState === "picker" && (
          <RolePicker onSelect={handleRoleSelect} visible={uiState === "picker"} />
        )}

        {/* ── State: auth options (role selected, not yet registering) ── */}
        {uiState === "authOptions" && activeRole && (
          <div className="space-y-4">
            {/* Role badge at top */}
            <RoleBar
              role={activeRole}
              onChange={resetToRolePicker}
              animateIn={roleBarAnimated}
            />

            <GlassCard variant="heavy" padding="lg">
              <GlassCardContent>
                <AuthMethodPicker
                  role={activeRole}
                  onSSO={handleSSO}
                  onManual={handleManual}
                  ssoLoading={ssoLoading}
                />
              </GlassCardContent>
            </GlassCard>

            <p className="text-center text-sm text-beige-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-teal-600 hover:text-teal-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        )}

        {/* ── State: registering (manual form steps) ── */}
        {uiState === "registering" && reg.registrationRole === "contributor" && (
          <div className="space-y-4 pb-2">
            <RoleBar role="contributor" onChange={resetToRolePicker} animateIn />

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-teal-800">Welcome to GlimmoraTeam</p>
                <p className="text-xs text-teal-700 mt-0.5 leading-relaxed">
                  AI-matched tasks · global earnings · verified portfolio · set up in 4 quick steps.
                </p>
              </div>
            </div>

            <StepProgress step={reg.step} />

            {reg.step === 1 && (
              <Step1Identity
                firstName={reg.firstName} setFirstName={reg.setFirstName}
                lastName={reg.lastName} setLastName={reg.setLastName}
                email={reg.email} setEmail={reg.setEmail}
                password={reg.password} setPassword={reg.setPassword}
                confirm={reg.confirm} setConfirm={reg.setConfirm}
                showPw={reg.showPw} setShowPw={reg.setShowPw}
                showCon={reg.showCon} setShowCon={reg.setShowCon}
                contribType={reg.contribType} setContribType={reg.setContribType}
                country={reg.country} setCountry={reg.setCountry}
                passwordStrength={reg.passwordStrength}
                error={reg.error}
                onContinue={reg.goToStep2}
                isSsoUser={reg.isSsoUser}
                ssoProvider={reg.ssoProvider}
              />
            )}

            {reg.step === 2 && (
              <Step3Profile
                contribType={reg.contribType}
                dob={reg.dob} setDob={reg.setDob}
                timezone={reg.timezone} setTimezone={reg.setTimezone}
                departmentCategory={reg.departmentCategory} setDepartmentCategory={reg.setDepartmentCategory}
                departmentOther={reg.departmentOther} setDepartmentOther={reg.setDepartmentOther}
                availability={reg.availability} setAvailability={reg.setAvailability}
                degree={reg.degree} setDegree={reg.setDegree}
                branch={reg.branch} setBranch={reg.setBranch}
                linkedin={reg.linkedin} setLinkedin={reg.setLinkedin}
                mentorAck={reg.mentorAck} setMentorAck={reg.setMentorAck}
                primarySkills={reg.primarySkills}
                skillInput={reg.skillInput} setSkillInput={reg.setSkillInput}
                addPrimarySkill={reg.addPrimarySkill} removePrimarySkill={reg.removePrimarySkill}
                secondarySkills={reg.secondarySkills}
                secondarySkillInput={reg.secondarySkillInput} setSecondarySkillInput={reg.setSecondarySkillInput}
                addSecondarySkill={reg.addSecondarySkill} removeSecondarySkill={reg.removeSecondarySkill}
                otherSkills={reg.otherSkills}
                otherSkillInput={reg.otherSkillInput} setOtherSkillInput={reg.setOtherSkillInput}
                addOtherSkill={reg.addOtherSkill} removeOtherSkill={reg.removeOtherSkill}
                workStart={reg.workStart} setWorkStart={reg.setWorkStart}
                workEnd={reg.workEnd} setWorkEnd={reg.setWorkEnd}
                careerStage={reg.careerStage} setCareerStage={reg.setCareerStage}
                yearsExperience={reg.yearsExperience} setYearsExperience={reg.setYearsExperience}
                error={reg.error}
                onContinue={reg.goToStep3}
                onBack={() => { reg.setStep(1); reg.setError(""); }}
              />
            )}

            {reg.step === 3 && (
              <Step2Verification
                phoneCountry={reg.phoneCountry} setPhoneCountry={reg.setPhoneCountry}
                phone={reg.phone} setPhone={reg.setPhone}
                otpSent={reg.otpSent}
                otp={reg.otp} setOtp={reg.setOtp}
                cooldown={reg.cooldown}
                phoneVerified={reg.phoneVerified}
                phoneOtpLoading={reg.phoneOtpLoading}
                verificationEmail={reg.verificationEmail} setVerificationEmail={reg.setVerificationEmail}
                emailOtpSent={reg.emailOtpSent}
                emailOtp={reg.emailOtp} setEmailOtp={reg.setEmailOtp}
                emailCooldown={reg.emailCooldown}
                emailVerified={reg.emailVerified}
                emailOtpLoading={reg.emailOtpLoading}
                ndaAccepted={reg.ndaAccepted} setNdaAccepted={reg.setNdaAccepted}
                ndaSignature={reg.ndaSignature} setNdaSignature={reg.setNdaSignature}
                error={reg.error}
                onSendOTP={reg.sendOTP}
                onVerifyOTP={reg.verifyOTP}
                onSendEmailOTP={reg.sendEmailOTP}
                onVerifyEmailOTP={reg.verifyEmailOTP}
                onContinue={reg.goToStep4}
                onBack={() => { reg.setStep(2); reg.setError(""); }}
              />
            )}

            {reg.step === 4 && (
              <Step4Consent
                resumeFile={reg.resumeFile} setResumeFile={reg.setResumeFile}
                resumeDrag={reg.resumeDrag} setResumeDrag={reg.setResumeDrag}
                acceptTos={reg.acceptTos} setAcceptTos={reg.setAcceptTos}
                acceptCoc={reg.acceptCoc} setAcceptCoc={reg.setAcceptCoc}
                acceptPrivacy={reg.acceptPrivacy} setAcceptPrivacy={reg.setAcceptPrivacy}
                acceptFee={reg.acceptFee} setAcceptFee={reg.setAcceptFee}
                acceptAhp={reg.acceptAhp} setAcceptAhp={reg.setAcceptAhp}
                marketingOptIn={reg.marketingOptIn} setMarketingOptIn={reg.setMarketingOptIn}
                isLoading={reg.isLoading}
                error={reg.error}
                onPreview={() => reg.setPreviewOpen(true)}
                onSubmit={reg.handleFinalSubmit}
                onBack={() => { reg.setStep(3); reg.setError(""); }}
              />
            )}
          </div>
        )}

        {reg.previewOpen && (
          <ReviewPreviewModal
            onClose={() => reg.setPreviewOpen(false)}
            onEditStep={step => { reg.setStep(step); reg.setError(""); }}
            firstName={reg.firstName}
            lastName={reg.lastName}
            email={reg.email}
            contribType={reg.contribType}
            dob={reg.dob}
            country={reg.country}
            phone={reg.phone}
            verificationEmail={reg.verificationEmail}
            timezone={reg.timezone}
            departmentCategory={reg.departmentCategory}
            departmentOther={reg.departmentOther}
            degree={reg.degree}
            branch={reg.branch}
            availability={reg.availability}
            linkedin={reg.linkedin}
            primarySkills={reg.primarySkills}
            secondarySkills={reg.secondarySkills}
            otherSkills={reg.otherSkills}
            yearsExperience={reg.yearsExperience}
            careerStage={reg.careerStage}
            workStart={reg.workStart}
            workEnd={reg.workEnd}
          />
        )}

        {/* Footer trust line */}
        {uiState !== "registering" && (
          <div className="flex items-center justify-center gap-4 mt-5 text-xs text-beige-400">
            <div className="flex items-center gap-1"><Lock className="w-3 h-3" /><span>256-bit encryption</span></div>
            <span>|</span>
            <div className="flex items-center gap-1"><Zap className="w-3 h-3" /><span>SOC 2 compliant</span></div>
          </div>
        )}
    </>
  );

  /* ── Picker: two-column with left content ── */
  if (showLeftContent) {
    return (
      <div className="w-full flex items-start gap-8 max-w-6xl">
        <LeftContent />
        <div className="w-full max-w-xl flex flex-col">
          <div className="text-center mb-7">
            <h1 className="font-heading text-2xl font-bold text-brown-950">Create Your Account</h1>
            <p className="text-sm text-beige-500 mt-1">Join the Global Workforce Intelligence Platform</p>
          </div>
          {formBody}
        </div>
      </div>
    );
  }

  /* ── Auth options + form: logo top-left, form centered ── */
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col py-8">
      <div className="mb-8">{logo}</div>
      {formBody}
    </div>
  );
}
