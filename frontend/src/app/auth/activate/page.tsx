"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles, Eye, EyeOff, CheckCircle, AlertCircle,
  RefreshCw, Lock, ArrowRight,
} from "lucide-react";
import {
  GlassCard, GlassCardContent, Button, Input, Label, Badge,
} from "@/components/ui";

function getStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8)        s++;
  if (pw.length >= 12)       s++;
  if (/[A-Z]/.test(pw))      s++;
  if (/[0-9]/.test(pw))      s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { score: s, label: "Weak",   color: "bg-red-400" };
  if (s <= 3) return { score: s, label: "Fair",   color: "bg-gold-400" };
  return             { score: s, label: "Strong", color: "bg-teal-500" };
}

// In production these would come from the invite token URL params
const MOCK_INVITE = {
  name:   "Sarah Chen",
  email:  "sarah.chen@enterprise.com",
  role:   "Enterprise",
  tenant: "Acme Corp",
};

export default function ActivatePage() {
  const router = useRouter();

  const [password, setPassword]         = useState("");
  const [confirm, setConfirm]           = useState("");
  const [showPw, setShowPw]             = useState(false);
  const [showCon, setShowCon]           = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState("");
  const [tokenExpired]                  = useState(false);

  const strength = getStrength(password);
  const minLen   = MOCK_INVITE.role === "Admin" ? 16 : 12;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < minLen) {
      setError(`Password must be at least ${minLen} characters`);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    // Redirect to MFA setup after setting password
    router.push("/auth/mfa-setup?redirect=/enterprise/dashboard");
  };

  if (tokenExpired) {
    return (
      <div className="w-full max-w-md text-center">
        <GlassCard variant="heavy" padding="lg">
          <GlassCardContent>
            <div className="space-y-4 py-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="font-semibold text-brown-950">Invitation Link Expired</p>
              <p className="text-sm text-beige-600">
                This account creation link has expired (links expire after 72 hours).
                Please ask your administrator to resend the invitation.
              </p>
              <Link href="/auth/login">
                <Button variant="outline" size="md" className="w-full">Back to Sign In</Button>
              </Link>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brown-500 to-brown-700 shadow-xl shadow-brown-500/20 mb-4">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-heading text-2xl font-semibold text-brown-950">Create Your Account</h1>
        <p className="text-sm text-beige-600 mt-1">Set a password to get started</p>
      </div>

      {/* Invite info banner */}
      <div className="mb-5 p-4 rounded-xl bg-brown-50 border border-brown-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brown-200 flex items-center justify-center flex-shrink-0">
          <span className="text-brown-800 font-bold text-sm">
            {MOCK_INVITE.name.split(" ").map(n => n[0]).join("")}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-brown-950 text-sm truncate">{MOCK_INVITE.name}</p>
          <p className="text-xs text-beige-600 truncate">{MOCK_INVITE.email}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Badge variant="brown" size="sm">{MOCK_INVITE.role}</Badge>
            {MOCK_INVITE.tenant && (
              <span className="text-xs text-beige-500">· {MOCK_INVITE.tenant}</span>
            )}
          </div>
        </div>
      </div>

      <GlassCard variant="heavy" padding="lg">
        <GlassCardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                New Password
                <span className="text-xs text-beige-500 ml-1">(min {minLen} characters)</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder={`At least ${minLen} characters`}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-beige-400 hover:text-beige-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i <= strength.score ? strength.color : "bg-beige-200"
                      }`} />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    strength.score <= 1 ? "text-red-500" : strength.score <= 3 ? "text-gold-600" : "text-teal-600"
                  }`}>{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showCon ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCon(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-beige-400 hover:text-beige-600"
                >
                  {showCon ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirm && password !== confirm && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            {/* Requirements */}
            <div className="p-3 rounded-lg bg-beige-50 border border-beige-200 space-y-1">
              {[
                { check: password.length >= minLen, text: `At least ${minLen} characters` },
                { check: /[A-Z]/.test(password), text: "Uppercase letter" },
                { check: /[a-z]/.test(password), text: "Lowercase letter" },
                { check: /[0-9]/.test(password), text: "Number" },
                { check: /[^A-Za-z0-9]/.test(password), text: "Special character" },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${r.check ? "bg-teal-500" : "bg-beige-300"}`}>
                    {r.check && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className={r.check ? "text-teal-700" : "text-beige-500"}>{r.text}</span>
                </div>
              ))}
            </div>

            {/* Note about MFA */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-700">
              <Lock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>
                After setting your password, you&apos;ll be guided through setting up
                two-factor authentication (mandatory for your role).
              </span>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Setting up…</>
              ) : (
                <>Set Password &amp; Continue <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>
        </GlassCardContent>
      </GlassCard>
    </div>
  );
}
