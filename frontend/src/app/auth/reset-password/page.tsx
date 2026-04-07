"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles, Eye, EyeOff, AlertCircle, CheckCircle, RefreshCw, Lock,
} from "lucide-react";
import {
  GlassCard, GlassCardContent, Button, Input, Label,
} from "@/components/ui";

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

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword]           = useState("");
  const [confirm, setConfirm]             = useState("");
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [isLoading, setIsLoading]         = useState(false);
  const [error, setError]                 = useState("");
  const [success, setSuccess]             = useState(false);

  const strength = getStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 10) { setError("Password must be at least 10 characters"); return; }
    if (password !== confirm)  { setError("Passwords do not match"); return; }

    setError("");
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsLoading(false);
    setSuccess(true);

    setTimeout(() => router.push("/auth/login"), 2500);
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brown-500 to-brown-700 shadow-xl shadow-brown-500/20 mb-4">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-heading text-2xl font-semibold text-brown-950">Set New Password</h1>
        <p className="text-sm text-beige-600 mt-1">Choose a strong password for your account</p>
      </div>

      <GlassCard variant="heavy" padding="lg">
        <GlassCardContent>
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 10 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pr-10"
                    autoFocus
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
                <Label htmlFor="confirm">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
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
                  { check: password.length >= 10, text: "At least 10 characters" },
                  { check: /[A-Z]/.test(password), text: "Uppercase letter" },
                  { check: /[a-z]/.test(password), text: "Lowercase letter" },
                  { check: /[0-9]/.test(password), text: "Number" },
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
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Updating…</>
                ) : (
                  <><Lock className="w-4 h-4" /> Update Password</>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-5 py-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-teal-600" />
              </div>
              <div>
                <p className="font-semibold text-brown-950 mb-1">Password updated!</p>
                <p className="text-sm text-beige-600">
                  Your password has been updated. All active sessions have been signed out.
                  Redirecting to login…
                </p>
              </div>
              <Link href="/auth/login">
                <Button variant="primary" size="md" className="w-full">
                  Go to Sign In
                </Button>
              </Link>
            </div>
          )}
        </GlassCardContent>
      </GlassCard>
    </div>
  );
}
