"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  ShieldCheck,
  ShieldOff,
  KeyRound,
  RefreshCw,
  Copy,
  Download,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Eye,
  EyeOff,
  Monitor,
  Smartphone,
  Globe,
  Clock,
  LogOut,
} from "lucide-react";
import {
  GlassCard,
  GlassCardContent,
  Button,
  Input,
  Label,
  Badge,
} from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth-store";

/* ── Recovery code generator (same logic as mfa-setup) ── */
function generateRecoveryCodes(): string[] {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () =>
    Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)])
      .join("")
      .replace(/(.{5})/, "$1-")
  );
}

/* ── Mock active sessions ── */
const MOCK_SESSIONS = [
  {
    id: "1",
    device: "MacBook Pro",
    icon: "monitor",
    browser: "Chrome 124",
    location: "New York, US",
    lastActive: "Now (current session)",
    current: true,
  },
  {
    id: "2",
    device: "iPhone 15 Pro",
    icon: "phone",
    browser: "Safari 17",
    location: "New York, US",
    lastActive: "2 hours ago",
    current: false,
  },
  {
    id: "3",
    device: "Windows PC",
    icon: "monitor",
    browser: "Edge 124",
    location: "London, UK",
    lastActive: "Yesterday at 3:42 PM",
    current: false,
  },
];

export default function SecuritySettingsPage() {
  const router = useRouter();
  const isMfaEnabled = useAuthStore((s) => s.isMfaEnabled);
  const setMfaEnabled = useAuthStore((s) => s.setMfaEnabled);

  const recoveryCodes = useMemo(() => generateRecoveryCodes(), []);

  const [showCodes, setShowCodes] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");
  const [showDisablePw, setShowDisablePw] = useState(false);
  const [disableLoading, setDisableLoading] = useState(false);
  const [disableError, setDisableError] = useState("");
  const [sessions, setSessions] = useState(MOCK_SESSIONS);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const handleCopyCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join("\n")).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCodes = () => {
    const blob = new Blob([recoveryCodes.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "glimmorateam-recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDisableMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disablePassword) { setDisableError("Please enter your password"); return; }
    setDisableError("");
    setDisableLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setDisableLoading(false);
    setMfaEnabled(false);
    setShowDisableForm(false);
    setDisablePassword("");
  };

  const handleRevokeSession = async (id: string) => {
    setRevokingId(id);
    await new Promise((r) => setTimeout(r, 600));
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setRevokingId(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      {/* Page header */}
      <div>
        <h1 className="font-heading text-2xl font-semibold text-brown-950">Security</h1>
        <p className="text-sm text-beige-600 mt-1">
          Manage your account security settings, two-factor authentication, and active sessions.
        </p>
      </div>

      {/* ── Section A: Two-Factor Authentication ── */}
      <GlassCard variant="heavy" padding="lg">
        <GlassCardContent>
          <div className="space-y-5">
            {/* Header row */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isMfaEnabled
                    ? "bg-teal-100 text-teal-600"
                    : "bg-beige-100 text-beige-500"
                }`}>
                  {isMfaEnabled ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : (
                    <Shield className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-brown-950">Two-Factor Authentication</p>
                  <p className="text-xs text-beige-500">TOTP via authenticator app</p>
                </div>
              </div>
              {isMfaEnabled ? (
                <Badge variant="teal" size="sm">Enabled</Badge>
              ) : (
                <Badge variant="beige" size="sm">Not configured</Badge>
              )}
            </div>

            {/* MFA enabled state */}
            {isMfaEnabled && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-teal-50 border border-teal-200 text-sm text-teal-700">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Your account is protected with TOTP two-factor authentication.
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    size="md"
                    className="flex-1"
                    onClick={() => router.push("/auth/mfa-setup?redirect=/enterprise/settings/security")}
                  >
                    <RefreshCw className="w-4 h-4" /> Re-setup Authenticator
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    onClick={() => { setShowDisableForm((v) => !v); setDisableError(""); }}
                  >
                    <ShieldOff className="w-4 h-4" />
                    {showDisableForm ? "Cancel" : "Disable MFA"}
                  </Button>
                </div>

                {/* Disable MFA confirmation */}
                {showDisableForm && (
                  <form
                    onSubmit={handleDisableMFA}
                    className="p-4 rounded-xl border border-red-200 bg-red-50 space-y-3"
                  >
                    <p className="text-sm font-medium text-red-700">
                      Confirm your password to disable two-factor authentication.
                    </p>
                    <div className="space-y-1.5">
                      <Label htmlFor="disable-pw" className="text-red-700">Password</Label>
                      <div className="relative">
                        <Input
                          id="disable-pw"
                          type={showDisablePw ? "text" : "password"}
                          placeholder="Enter your current password"
                          value={disablePassword}
                          onChange={(e) => setDisablePassword(e.target.value)}
                          className="pr-10 border-red-200 focus:border-red-400"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setShowDisablePw((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-beige-400 hover:text-beige-600"
                        >
                          {showDisablePw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    {disableError && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {disableError}
                      </div>
                    )}
                    <Button
                      type="submit"
                      size="md"
                      className="w-full bg-red-600 hover:bg-red-700 text-white border-0"
                      disabled={disableLoading}
                    >
                      {disableLoading ? (
                        <><RefreshCw className="w-4 h-4 animate-spin" /> Disabling...</>
                      ) : (
                        <>Confirm &amp; Disable MFA</>
                      )}
                    </Button>
                  </form>
                )}

                {/* Recovery codes accordion */}
                <div className="border border-beige-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowCodes((v) => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-beige-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-beige-500" />
                      <span className="text-sm font-medium text-brown-800">Recovery Codes</span>
                    </div>
                    {showCodes ? (
                      <ChevronUp className="w-4 h-4 text-beige-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-beige-400" />
                    )}
                  </button>

                  {showCodes && (
                    <div className="px-4 pb-4 space-y-3 border-t border-beige-200">
                      <p className="text-xs text-beige-500 pt-3">
                        These codes can be used to access your account if you lose your authenticator.
                        Each code can only be used once.
                      </p>
                      <div className="grid grid-cols-2 gap-2 p-4 rounded-xl bg-brown-950 font-mono">
                        {recoveryCodes.map((code, i) => (
                          <div key={i} className="text-sm text-brown-100 py-0.5">
                            <span className="text-brown-500 mr-1 text-xs">{i + 1}.</span>{code}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" className="flex-1" onClick={handleCopyCodes}>
                          <Copy className="w-3.5 h-3.5" />
                          {copied ? "Copied!" : "Copy"}
                        </Button>
                        <Button type="button" variant="outline" size="sm" className="flex-1" onClick={handleDownloadCodes}>
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MFA not enabled state */}
            {!isMfaEnabled && (
              <div className="space-y-4">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-gold-50 border border-gold-200 text-sm text-gold-800">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  Your account is not protected with two-factor authentication. We strongly recommend enabling it.
                </div>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto"
                  onClick={() => router.push("/auth/mfa-setup?redirect=/enterprise/settings/security")}
                >
                  <Shield className="w-4 h-4" /> Set Up Two-Factor Auth
                </Button>
              </div>
            )}
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* ── Section B: Active Sessions ── */}
      <GlassCard variant="heavy" padding="lg">
        <GlassCardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-beige-100 text-beige-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-brown-950">Active Sessions</p>
                <p className="text-xs text-beige-500">Devices currently signed into your account</p>
              </div>
            </div>

            <div className="divide-y divide-beige-100">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-9 h-9 rounded-lg bg-beige-100 flex items-center justify-center shrink-0">
                    {session.icon === "phone" ? (
                      <Smartphone className="w-4 h-4 text-beige-600" />
                    ) : (
                      <Monitor className="w-4 h-4 text-beige-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-brown-950 truncate">{session.device}</p>
                      {session.current && (
                        <Badge variant="teal" size="sm">This device</Badge>
                      )}
                    </div>
                    <p className="text-xs text-beige-500 truncate">{session.browser} &middot; {session.location}</p>
                    <div className="flex items-center gap-1 mt-0.5 text-[11px] text-beige-400">
                      <Clock className="w-3 h-3" />
                      {session.lastActive}
                    </div>
                  </div>
                  {!session.current && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
                      disabled={revokingId === session.id}
                      onClick={() => handleRevokeSession(session.id)}
                    >
                      {revokingId === session.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <LogOut className="w-3.5 h-3.5" />
                      )}
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </GlassCardContent>
      </GlassCard>
    </div>
  );
}
