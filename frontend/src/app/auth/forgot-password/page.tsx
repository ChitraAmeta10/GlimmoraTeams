"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles, ArrowLeft, Mail, AlertCircle, CheckCircle, RefreshCw,
  Eye, EyeOff, Lock, ShieldCheck,
} from "lucide-react";
import {
  GlassCard,
  GlassCardContent,
  Button,
  Input,
  Label,
} from "@/components/ui";

type Step = "email" | "otp" | "success";

function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Weak",   color: "bg-red-400" };
  if (score <= 3) return { score, label: "Fair",   color: "bg-gold-400" };
  return             { score, label: "Strong", color: "bg-teal-500" };
}

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep]                   = useState<Step>("email");
  const [email, setEmail]                 = useState("");
  const [otp, setOtp]                     = useState<string[]>(["", "", "", "", "", ""]);
  const [password, setPassword]           = useState("");
  const [confirm, setConfirm]             = useState("");
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [isLoading, setIsLoading]         = useState(false);
  const [error, setError]                 = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const strength = getStrength(password);
  const otpValue = otp.join("");

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    otpRefs.current[focusIndex]?.focus();
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Enter a valid email address"); return; }

    setError("");
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsLoading(false);
    setStep("otp");
    setResendCooldown(30);
  };

  // Resend OTP
  const handleResendOtp = useCallback(async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setIsLoading(false);
    setOtp(["", "", "", "", "", ""]);
    setResendCooldown(30);
    otpRefs.current[0]?.focus();
  }, [resendCooldown]);

  // Step 2: Verify OTP + Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otpValue.length < 6)  { setError("Please enter the complete 6-digit OTP"); return; }
    if (password.length < 8)  { setError("Password must be at least 8 characters"); return; }
    if (!/[A-Z]/.test(password))      { setError("Password must contain an uppercase letter"); return; }
    if (!/[0-9]/.test(password))      { setError("Password must contain a number"); return; }
    if (!/[^A-Za-z0-9]/.test(password)) { setError("Password must contain a special character"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }

    setError("");
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsLoading(false);
    setStep("success");

    setTimeout(() => router.push("/auth/login"), 3000);
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brown-500 to-brown-700 shadow-xl shadow-brown-500/20 mb-4">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-heading text-2xl font-semibold text-brown-950">
          {step === "email" && "Reset Password"}
          {step === "otp" && "Reset your password"}
          {step === "success" && "Password Updated!"}
        </h1>
        <p className="text-sm text-beige-600 mt-1">
          {step === "email" && "Enter your email to receive a verification code"}
          {step === "otp" && "Enter the OTP sent to your email and set a new password"}
          {step === "success" && "Your password has been successfully reset"}
        </p>
      </div>

      <GlassCard variant="heavy" padding="lg">
        <GlassCardContent>
          {/* ── Step 1: Email ── */}
          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Sending OTP…</>
                ) : (
                  <><Mail className="w-4 h-4" /> Send OTP</>
                )}
              </Button>

              <Link href="/auth/login">
                <Button type="button" variant="ghost" size="sm" className="w-full">
                  <ArrowLeft className="w-4 h-4" /> Back to sign in
                </Button>
              </Link>
            </form>
          )}

          {/* ── Step 2: OTP + New Password ── */}
          {step === "otp" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* Back button */}
              <button
                type="button"
                onClick={() => { setStep("email"); setError(""); setOtp(["", "", "", "", "", ""]); }}
                className="flex items-center gap-1 text-sm text-beige-600 hover:text-brown-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {/* OTP Code */}
              <div className="space-y-2">
                <Label>OTP Code</Label>
                <p className="text-xs text-beige-500">
                  We sent a 6-digit code to <span className="font-medium text-brown-800">{email}</span>
                </p>
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className="w-11 h-12 text-center text-lg font-semibold rounded-lg border border-beige-300 bg-white/80
                        focus:border-brown-500 focus:ring-2 focus:ring-brown-500/20 outline-none transition-all
                        text-brown-950 placeholder:text-beige-300"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-center gap-1 text-xs text-beige-500 mt-1">
                  {resendCooldown > 0 ? (
                    <span>Resend code in <span className="font-medium text-brown-700">{resendCooldown}s</span></span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-brown-600 hover:text-brown-800 font-medium underline underline-offset-2 transition-colors"
                    >
                      Resend code
                    </button>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-beige-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-beige-400">Set new password</span>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 chars, uppercase, number, special"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-beige-400 hover:text-beige-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Strength meter */}
                {password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength.score ? strength.color : "bg-beige-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${
                      strength.score <= 1 ? "text-red-500"
                      : strength.score <= 3 ? "text-gold-600"
                      : "text-teal-600"
                    }`}>
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your new password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-beige-400 hover:text-beige-600"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirm && password !== confirm && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
                {confirm && password === confirm && password.length > 0 && (
                  <p className="text-xs text-teal-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Passwords match
                  </p>
                )}
              </div>

              {/* Requirements */}
              <div className="p-3 rounded-lg bg-beige-50 border border-beige-200 space-y-1">
                <p className="text-xs font-semibold text-beige-700 mb-1">Password requirements:</p>
                {[
                  { check: password.length >= 8, text: "At least 8 characters" },
                  { check: /[A-Z]/.test(password), text: "Uppercase letter" },
                  { check: /[a-z]/.test(password), text: "Lowercase letter" },
                  { check: /[0-9]/.test(password), text: "Number" },
                  { check: /[^A-Za-z0-9]/.test(password), text: "Special character" },
                ].map((req, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      req.check ? "bg-teal-500" : "bg-beige-300"
                    }`}>
                      {req.check && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className={req.check ? "text-teal-700" : "text-beige-500"}>{req.text}</span>
                  </div>
                ))}
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Resetting…</>
                ) : (
                  <><Lock className="w-4 h-4" /> Reset Password</>
                )}
              </Button>
            </form>
          )}

          {/* ── Step 3: Success ── */}
          {step === "success" && (
            <div className="text-center space-y-5 py-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-teal-600" />
              </div>
              <div>
                <p className="font-semibold text-brown-950 mb-1">Password reset successfully!</p>
                <p className="text-sm text-beige-600">
                  Your password has been updated. All active sessions have been signed out.
                  Redirecting to login…
                </p>
              </div>
              <Link href="/auth/login">
                <Button variant="primary" size="md" className="w-full">
                  <ArrowLeft className="w-4 h-4" /> Go to Sign In
                </Button>
              </Link>
            </div>
          )}
        </GlassCardContent>
      </GlassCard>
    </div>
  );
}
