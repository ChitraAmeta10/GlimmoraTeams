"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Shield,
  Lock,
  Zap,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
  KeyRound,
  Star,
} from "lucide-react";
import { GlassCard, GlassCardContent, Button, Input, Label, Badge } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth-store";
import { postAuthLogin, postAuthMfaRecovery, postAuthMfaTotp, type LoginSuccess } from "@/lib/api/auth-login";
import { storeSessionTokens } from "@/lib/api/config";
import type { SSOData, SSOProvider } from "../register/types";

type Step = "credentials" | "mfa-prompt" | "mfa" | "recovery";

const STATS = [
  { value: "50K+", label: "Contributors" },
  { value: "2,400+", label: "Enterprises" },
  { value: "99.9%", label: "Uptime SLA" },
];

const MOCK_SSO_DATA: Record<SSOProvider, SSOData> = {
  google: { firstName: "John", lastName: "Doe", email: "john.doe@gmail.com", provider: "google" },
  microsoft: { firstName: "Jane", lastName: "Smith", email: "jane.smith@outlook.com", provider: "microsoft" },
};

export default function LoginPage() {
  const router = useRouter();
  const isOnboardingComplete = useAuthStore((s) => s.isOnboardingComplete);

  const enterpriseDest = isOnboardingComplete ? "/enterprise/dashboard" : "/enterprise/onboarding";

  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [pendingMfaEmail, setPendingMfaEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<SSOProvider | null>(null);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);

  /* ── TOTP countdown timer ── */
  useEffect(() => {
    if (step !== "mfa") return;
    const tick = () => {
      setTimeLeft(30 - (Math.floor(Date.now() / 1000) % 30));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [step]);

  const finishLoginSession = useCallback(
    (data: LoginSuccess) => {
      storeSessionTokens(data.access_token, data.refresh_token);
      const role = (data.user?.role || "").toLowerCase();
      if (role === "reviewer") {
        router.push("/mentor/dashboard");
        return;
      }
      if (data.user && data.user.isMfaEnabled === false) {
        setStep("mfa-prompt");
        return;
      }
      router.push(enterpriseDest);
    },
    [router, enterpriseDest]
  );

  const verifyMfaTotp = useCallback(async () => {
    if (!pendingMfaEmail) {
      setError("Session expired. Sign in again with your email and password.");
      return;
    }
    if (mfaCode.length !== 6) return;
    setError("");
    setIsLoading(true);
    try {
      const ok = await postAuthMfaTotp({
        email: pendingMfaEmail,
        code: mfaCode,
        rememberMe,
      });
      finishLoginSession(ok);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setIsLoading(false);
    }
  }, [pendingMfaEmail, mfaCode, rememberMe, finishLoginSession]);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Enter a valid email address"); return; }
    if (!password) { setError("Please enter your password"); return; }
    setError("");
    setIsLoading(true);
    try {
      const result = await postAuthLogin({
        email: email.trim(),
        password,
        rememberMe,
      });
      if ("mfa_required" in result && result.mfa_required) {
        setPendingMfaEmail(result.email);
        setMfaCode("");
        setStep("mfa");
        return;
      }
      finishLoginSession(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length !== 6) { setError("Please enter the 6-digit code"); return; }
    await verifyMfaTotp();
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingMfaEmail) {
      setError("Session expired. Sign in again with your email and password.");
      return;
    }
    if (!recoveryCode.trim()) { setError("Please enter your recovery code"); return; }
    setError("");
    setIsLoading(true);
    try {
      const ok = await postAuthMfaRecovery({
        email: pendingMfaEmail,
        recoveryCode: recoveryCode.trim(),
        rememberMe,
      });
      finishLoginSession(ok);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Recovery sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSO = async (provider: SSOProvider) => {
    setError("");
    setSsoLoading(provider);
    await new Promise((r) => setTimeout(r, 1200));
    sessionStorage.setItem("sso_data", JSON.stringify(MOCK_SSO_DATA[provider]));
    router.push(`/auth/register?sso=${provider}`);
  };

  const resetToCredentials = () => {
    setStep("credentials");
    setMfaCode("");
    setRecoveryCode("");
    setPendingMfaEmail("");
    setError("");
  };

  return (
    <div className="w-full flex items-start gap-10 max-w-6xl">

      {/* ── Left content (no box) ── */}
      <div className="hidden lg:flex flex-col flex-1 max-w-lg py-8 pr-6 justify-between min-h-[640px]">

        {/* TOP */}
        <div>
          <Link href="/" className="flex items-center gap-2 mb-8 group w-fit">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brown-500 to-brown-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-semibold text-brown-950 group-hover:text-brown-700 transition-colors">
              GlimmoraTeam
            </span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 w-fit mb-5">
            <div className="flex -space-x-1.5">
              {["bg-teal-500","bg-brown-400","bg-amber-400","bg-violet-400"].map((c, i) => (
                <div key={i} className={`w-5 h-5 rounded-full ${c} border-2 border-white flex items-center justify-center`}>
                  <Zap className="w-2.5 h-2.5 text-white" />
                </div>
              ))}
            </div>
            <span className="text-xs font-medium text-teal-700">Trusted by 50K+ professionals</span>
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-600 mb-3 flex items-center gap-2">
            <span className="w-5 h-px bg-teal-500" />
            Enterprise Intelligence
          </p>

          <h2 className="font-heading text-4xl font-bold text-brown-950 leading-[1.15] mb-4">
            Welcome back to<br />
            <span className="text-teal-600">your workspace</span>.
          </h2>

          <p className="text-sm text-beige-600 leading-relaxed max-w-sm">
            AI-governed delivery for distributed teams at trusted scale.
            Sign in to manage your workforce, projects, and earnings.
          </p>
        </div>

        {/* MIDDLE */}
        <div>
          <div className="flex items-center gap-6 mb-5">
            {STATS.map(({ value, label }, i) => (
              <div key={label} className={`${i > 0 ? "pl-6 border-l border-beige-200" : ""}`}>
                <p className="font-heading text-2xl font-bold text-brown-950">{value}</p>
                <p className="text-xs text-beige-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { Icon: Shield,   label: "SOC 2 Certified"      },
              { Icon: Lock,     label: "256-bit Encryption"   },
              { Icon: Zap,      label: "99.9% Uptime SLA"     },
              { Icon: ArrowRight, label: "GDPR Compliant"     },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/60 border border-beige-100">
                <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-teal-600" />
                </div>
                <span className="text-sm text-brown-700 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM — testimonial */}
        <div>
          <div className="p-4 rounded-2xl bg-white/70 border border-beige-100 mb-5">
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-brown-700 leading-relaxed mb-3">
              &ldquo;GlimmoraTeam gave us real visibility into our global workforce for the first time.
              The governance controls alone justified the switch within our first quarter.&rdquo;
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brown-500 flex items-center justify-center text-xs font-bold text-white shrink-0">SK</div>
              <div>
                <p className="text-xs font-semibold text-brown-900">Sarah Kim</p>
                <p className="text-[11px] text-beige-500">VP of Operations · Acme Corp</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-beige-400">
            <div className="flex items-center gap-1"><Lock className="w-3 h-3" /><span>256-bit SSL</span></div>
            <span>·</span>
            <div className="flex items-center gap-1"><Shield className="w-3 h-3" /><span>SOC 2 Type II</span></div>
          </div>
        </div>
      </div>

      {/* ── Form panel (right) ── */}
      <div className="w-full max-w-md flex flex-col justify-center">

        {/* Header */}
        <div className="text-center mb-7">
          <Link href="/" className="lg:hidden inline-flex items-center gap-2 mb-5 group">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brown-500 to-brown-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-semibold text-brown-950 group-hover:text-brown-700 transition-colors">
              GlimmoraTeam
            </span>
          </Link>
          <h1 className="font-heading text-2xl font-bold text-brown-950">Welcome back</h1>
          <p className="text-sm text-beige-500 mt-1">Sign in to your account to continue</p>
        </div>

        {/* ── Step: credentials ── */}
        {step === "credentials" && (
          <GlassCard variant="heavy" padding="lg">
            <GlassCardContent>
              <form onSubmit={handleCredentials} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your secure password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-beige-400 hover:text-beige-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-beige-300 text-brown-700 accent-brown-700 focus:ring-brown-700/20 cursor-pointer"
                    />
                    <span className="text-sm text-brown-700">Remember me</span>
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                    Forgot password?
                  </Link>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <Button type="submit" variant="gradient-cta" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Signing in...</>
                  ) : (
                    <>Sign In <ArrowRight className="w-4 h-4" /></>
                  )}
                </Button>

                <div className="relative flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-beige-200" />
                  <span className="text-xs text-beige-400 font-medium">or continue with</span>
                  <div className="flex-1 h-px bg-beige-200" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSSO("google")}
                    disabled={!!ssoLoading}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-beige-200 bg-white hover:border-beige-300 hover:bg-beige-50 transition-all text-sm font-medium text-brown-800 disabled:opacity-50"
                  >
                    {ssoLoading === "google" ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    )}
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSSO("microsoft")}
                    disabled={!!ssoLoading}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-beige-200 bg-white hover:border-beige-300 hover:bg-beige-50 transition-all text-sm font-medium text-brown-800 disabled:opacity-50"
                  >
                    {ssoLoading === "microsoft" ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <rect fill="#F25022" x="1" y="1" width="10" height="10" />
                        <rect fill="#7FBA00" x="13" y="1" width="10" height="10" />
                        <rect fill="#00A4EF" x="1" y="13" width="10" height="10" />
                        <rect fill="#FFB900" x="13" y="13" width="10" height="10" />
                      </svg>
                    )}
                    Microsoft
                  </button>
                </div>

                <p className="text-center text-sm text-beige-600">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/register" className="text-teal-600 hover:text-teal-700 font-medium">
                    Register
                  </Link>
                </p>
              </form>
            </GlassCardContent>
          </GlassCard>
        )}

        {/* ── Step: mfa-prompt (MFA not yet set up) ── */}
        {step === "mfa-prompt" && (
          <GlassCard variant="heavy" padding="lg">
            <GlassCardContent>
              <div className="text-center space-y-5">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-linear-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-200">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-brown-950 text-lg">Secure Your Account</p>
                  <p className="text-sm text-beige-500 mt-1">
                    Enable two-factor authentication for stronger protection against unauthorized access.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-left space-y-2">
                  {[
                    "Protects against password breaches",
                    "Required for enterprise admin roles",
                    "Takes less than 2 minutes to set up",
                  ].map((point) => (
                    <div key={point} className="flex items-center gap-2 text-sm text-teal-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                      {point}
                    </div>
                  ))}
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => router.push(`/auth/mfa-setup?redirect=${enterpriseDest}`)}
                >
                  <Shield className="w-4 h-4" /> Set Up MFA Now
                </Button>

                <button
                  type="button"
                  onClick={() => router.push(enterpriseDest)}
                  className="w-full text-sm text-beige-500 hover:text-beige-700 transition-colors py-1"
                >
                  Skip for now
                </button>

                <button
                  type="button"
                  onClick={resetToCredentials}
                  className="flex items-center justify-center gap-1.5 text-xs text-beige-400 hover:text-beige-600 transition-colors w-full"
                >
                  <ArrowLeft className="w-3 h-3" /> Back to login
                </button>
              </div>
            </GlassCardContent>
          </GlassCard>
        )}

        {/* ── Step: mfa (verify 6-digit code) ── */}
        {step === "mfa" && (
          <GlassCard variant="heavy" padding="lg">
            <GlassCardContent>
              <div className="mb-5">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-brown-500 to-brown-700 flex items-center justify-center mb-4 shadow-lg shadow-brown-200">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <p className="text-[11px] font-semibold text-beige-400 uppercase tracking-widest">Security check</p>
                <p className="font-heading font-semibold text-brown-950 text-lg mt-0.5">Two-Factor Authentication</p>
                <p className="text-xs text-beige-500 mt-1">Enter the 6-digit code from your authenticator app</p>
              </div>

              <form onSubmit={handleMFASubmit} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="mfa">Authenticator Code</Label>
                  <Input
                    id="mfa"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="000000"
                    className="text-center text-2xl tracking-[0.5em] font-mono"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    autoFocus
                  />

                  {/* Countdown bar */}
                  <div className="space-y-1">
                    <div className="h-1 rounded-full bg-beige-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 bg-teal-500"
                        style={{ width: `${(timeLeft / 30) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-beige-400 text-center">
                      Code expires in <span className="font-mono font-semibold text-brown-700">{timeLeft}s</span>
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                {isLoading && (
                  <div className="flex items-center justify-center gap-2 py-2 text-sm text-beige-500">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                  </div>
                )}

                {!isLoading && (
                  <Button type="submit" variant="gradient-cta" size="lg" className="w-full" disabled={mfaCode.length !== 6}>
                    Verify &amp; Sign In <ArrowRight className="w-4 h-4" />
                  </Button>
                )}

                <div className="space-y-2 text-center">
                  <button
                    type="button"
                    onClick={() => { setStep("recovery"); setError(""); }}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
                  >
                    Use a recovery code instead
                  </button>
                  <br />
                  <button
                    type="button"
                    onClick={resetToCredentials}
                    className="flex items-center justify-center gap-1.5 text-sm text-beige-600 hover:text-beige-800 transition-colors w-full"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to login
                  </button>
                </div>
              </form>
            </GlassCardContent>
          </GlassCard>
        )}

        {/* ── Step: recovery code ── */}
        {step === "recovery" && (
          <GlassCard variant="heavy" padding="lg">
            <GlassCardContent>
              <div className="mb-5">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-brown-400 to-brown-600 flex items-center justify-center mb-4">
                  <KeyRound className="w-6 h-6 text-white" />
                </div>
                <p className="font-heading font-semibold text-brown-950 text-lg">Recovery Code</p>
                <p className="text-xs text-beige-500 mt-1">
                  Enter one of your 8-character backup codes saved during MFA setup.
                </p>
              </div>

              <form onSubmit={handleRecovery} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="recovery">Backup Recovery Code</Label>
                  <Input
                    id="recovery"
                    type="text"
                    placeholder="XXXXX-XXXXX"
                    className="text-center font-mono tracking-widest uppercase"
                    value={recoveryCode}
                    onChange={(e) =>
                      setRecoveryCode(
                        e.target.value
                          .replace(/[^A-Za-z0-9-]/g, "")
                          .toUpperCase()
                          .slice(0, 11)
                      )
                    }
                    autoFocus
                  />
                  <p className="text-xs text-beige-400 text-center">Format: XXXXX-XXXXX</p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <Button type="submit" variant="gradient-cta" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Verifying...</>
                  ) : (
                    <>Verify Recovery Code <ArrowRight className="w-4 h-4" /></>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => { setStep("mfa"); setError(""); }}
                  className="flex items-center justify-center gap-1.5 text-sm text-beige-600 hover:text-beige-800 transition-colors w-full"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to authenticator code
                </button>
              </form>
            </GlassCardContent>
          </GlassCard>
        )}

        {/* ── Quick Access (Demo) ── */}
        <GlassCard variant="light" padding="md" className="mt-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-[11px] font-semibold text-beige-400 uppercase tracking-widest">Quick Access (Demo)</p>
            <span className="text-[11px] text-beige-400">Sandbox roles</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x w-full">
            <Link href="/enterprise/dashboard" className="shrink-0 snap-start">
              <Button variant="outline" size="sm" className="w-full justify-center gap-2 rounded-full border-brown-200 bg-white/80 text-brown-800 shadow-sm hover:bg-white">
                <Badge variant="brown" size="sm">E</Badge>
                <span className="text-xs font-semibold tracking-wide">Enterprise</span>
              </Button>
            </Link>
            <Link href="/contributor/dashboard" className="shrink-0 snap-start">
              <Button variant="outline" size="sm" className="w-full justify-center gap-2 rounded-full border-brown-200 bg-white/80 text-brown-800 shadow-sm hover:bg-white">
                <Badge variant="teal" size="sm">C</Badge>
                <span className="text-xs font-semibold tracking-wide">Contributor</span>
              </Button>
            </Link>
            <Link href="/mentor/dashboard" className="shrink-0 snap-start">
              <Button variant="outline" size="sm" className="w-full justify-center gap-2 rounded-full border-brown-200 bg-white/80 text-brown-800 shadow-sm hover:bg-white">
                <Badge variant="forest" size="sm">R</Badge>
                <span className="text-xs font-semibold tracking-wide">Reviewer</span>
              </Button>
            </Link>
            <Link href="/enterprise/dashboard?demo=super-admin" className="shrink-0 snap-start">
              <Button variant="outline" size="sm" className="w-full justify-center gap-2 rounded-full border-brown-200 bg-white/80 text-brown-800 shadow-sm hover:bg-white">
                <Badge variant="brown" size="sm">SA</Badge>
                <span className="text-xs font-semibold tracking-wide">Super Admin</span>
              </Button>
            </Link>
          </div>
        </GlassCard>

        {/* Footer */}
        <div className="flex items-center justify-center gap-4 mt-5 text-xs text-beige-400">
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>256-bit encryption</span>
          </div>
          <span>|</span>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>SOC 2 compliant</span>
          </div>
          <span>|</span>
          <Link href="#" className="hover:text-beige-600 transition-colors">Privacy</Link>
          <span>|</span>
          <Link href="#" className="hover:text-beige-600 transition-colors">Terms</Link>
        </div>
      </div>
    </div>
  );
}
