"use client";

import {
  AlertCircle, ArrowRight, ArrowLeft, FileText,
  Upload, CheckCircle, RefreshCw, Mail, Download, ShieldCheck,
} from "lucide-react";
import { Button, Input, Label } from "@/components/ui";

const CURRENCIES = [
  { code: "INR", symbol: "\u20B9", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "AED", symbol: "\u062F.\u0625", label: "UAE Dirham" },
  { code: "GBP", symbol: "\u00A3", label: "British Pound" },
];

interface Props {
  billingCurrency: string;
  setBillingCurrency: (v: string) => void;
  billingContactEmail: string;
  setBillingContactEmail: (v: string) => void;
  billingContactName: string;
  setBillingContactName: (v: string) => void;
  ndaFile: File | null;
  setNdaFile: (v: File | null) => void;
  ndaDrag: boolean;
  setNdaDrag: (v: boolean) => void;
  acceptTos: boolean;
  setAcceptTos: (v: boolean) => void;
  acceptDpa: boolean;
  setAcceptDpa: (v: boolean) => void;
  esigOtpSent: boolean;
  esigOtp: string;
  setEsigOtp: (v: string) => void;
  esigCooldown: number;
  esigVerified: boolean;
  esigOtpLoading: boolean;
  onSendOTP: () => void;
  onVerifyOTP: () => void;
  error: string;
  onContinue: () => void;
  onBack: () => void;
}

export function Step2BillingLegal({
  billingCurrency, setBillingCurrency,
  billingContactEmail, setBillingContactEmail,
  billingContactName, setBillingContactName,
  ndaFile, setNdaFile, ndaDrag, setNdaDrag,
  acceptTos, setAcceptTos, acceptDpa, setAcceptDpa,
  esigOtpSent, esigOtp, setEsigOtp, esigCooldown, esigVerified, esigOtpLoading,
  onSendOTP, onVerifyOTP,
  error, onContinue, onBack,
}: Props) {
  return (
    <div className="space-y-8">
      {/* Billing */}
      <section>
        <h3 className="text-sm font-semibold text-brown-900 mb-4">Billing Preferences</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Currency <span className="text-red-400">*</span></Label>
            <select
              value={billingCurrency}
              onChange={e => setBillingCurrency(e.target.value)}
              className="w-full h-10 rounded-xl border border-beige-200 bg-white px-3 text-sm text-brown-900 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent transition-colors"
            >
              {CURRENCIES.map(({ code, symbol, label }) => (
                <option key={code} value={code}>{symbol} {code} — {label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Contact Name <span className="text-red-400">*</span></Label>
            <Input placeholder="Full name" value={billingContactName} onChange={e => setBillingContactName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Contact Email <span className="text-red-400">*</span></Label>
            <Input type="email" placeholder="billing@company.com" value={billingContactEmail} onChange={e => setBillingContactEmail(e.target.value)} />
          </div>
        </div>
      </section>

      {/* NDA */}
      <section>
        <h3 className="text-sm font-semibold text-brown-900 mb-4">NDA Agreement</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Download Template</Label>
            <a
              href="/nda-agreement.pdf"
              target="_blank"
              className="flex items-center gap-3 w-full h-10 rounded-xl border border-blue-200 bg-blue-50 px-3 hover:bg-blue-100 transition-colors"
            >
              <Download className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="text-sm text-blue-700 font-medium">Download NDA template</span>
            </a>
          </div>
          <div className="space-y-1.5">
            <Label>Upload Signed NDA</Label>
            <label
              onDragOver={e => { e.preventDefault(); setNdaDrag(true); }}
              onDragLeave={() => setNdaDrag(false)}
              onDrop={e => {
                e.preventDefault();
                setNdaDrag(false);
                const file = e.dataTransfer.files[0];
                if (file && file.type === "application/pdf" && file.size <= 5 * 1024 * 1024) setNdaFile(file);
              }}
              className={`flex items-center gap-3 w-full h-10 rounded-xl border px-3 cursor-pointer transition-all ${
                ndaDrag
                  ? "border-brown-400 bg-brown-50"
                  : ndaFile
                  ? "border-teal-300 bg-teal-50"
                  : "border-beige-200 hover:border-beige-300 bg-white"
              }`}
            >
              <input type="file" accept=".pdf" className="sr-only"
                onChange={e => { const f = e.target.files?.[0]; if (f && f.size <= 5 * 1024 * 1024) setNdaFile(f); }} />
              {ndaFile ? (
                <>
                  <FileText className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="text-sm text-teal-800 truncate flex-1">{ndaFile.name}</span>
                  <CheckCircle className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-beige-400 shrink-0" />
                  <span className="text-sm text-beige-400">PDF — max 5 MB</span>
                </>
              )}
            </label>
          </div>
        </div>
      </section>

      {/* E-Signature */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-semibold text-brown-900">E-Signature Verification</h3>
          {esigVerified && (
            <span className="flex items-center gap-1 text-xs text-teal-600 font-medium">
              <CheckCircle className="w-3 h-3" /> Verified
            </span>
          )}
        </div>

        {!esigVerified ? (
          <div className="space-y-3">
            <p className="text-xs text-beige-500">We&apos;ll send a 6-digit code to verify your identity.</p>
            <div className="flex gap-3 max-w-md">
              <Input value={billingContactEmail} disabled className="flex-1 bg-beige-50 opacity-70" />
              <Button type="button" size="md" variant="primary" onClick={onSendOTP}
                disabled={esigOtpLoading || esigVerified} className="shrink-0">
                {esigOtpLoading ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending...</> : esigOtpSent ? "Resend" : "Send OTP"}
              </Button>
            </div>

            {esigOtpSent && (
              <div className="flex gap-3 max-w-md items-center">
                <Input type="text" inputMode="numeric" maxLength={6}
                  placeholder="6-digit code"
                  className="text-center tracking-[0.3em] font-mono flex-1"
                  value={esigOtp} onChange={e => setEsigOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} />
                <Button type="button" size="md" variant="primary" className="shrink-0"
                  onClick={onVerifyOTP} disabled={esigOtpLoading || esigOtp.length < 6}>
                  {esigOtpLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Verify"}
                </Button>
                {esigCooldown > 0 && <span className="text-xs text-beige-400 shrink-0">{esigCooldown}s</span>}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-teal-600 font-medium">
            <ShieldCheck className="w-4 h-4" />
            Electronic signature confirmed.
          </div>
        )}
      </section>

      {/* Actions */}
      <div className="space-y-3 pt-2 border-t border-beige-100">
        <p className="text-[11px] text-beige-400">
          By continuing, you agree to the{" "}
          <a href="/legal/terms" target="_blank" className="text-brown-600 underline hover:text-brown-800" onClick={() => setAcceptTos(true)}>Terms of Service</a>
          {" "}and{" "}
          <a href="/legal/dpa" target="_blank" className="text-brown-600 underline hover:text-brown-800" onClick={() => setAcceptDpa(true)}>Data Processing Agreement</a>.
        </p>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" />{error}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" size="md" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button type="button" variant="primary" size="md" onClick={onContinue}>
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
