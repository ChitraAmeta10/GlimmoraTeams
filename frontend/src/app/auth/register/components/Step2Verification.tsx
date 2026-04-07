"use client";

import {
  AlertCircle, ArrowRight, ArrowLeft,
  CheckCircle, RefreshCw, Smartphone, Mail, FileText, PenLine, ShieldCheck,
} from "lucide-react";
import { ChevronDown } from "lucide-react";
import {
  GlassCard, GlassCardContent, Button, Input, Label,
} from "@/components/ui";
import { COUNTRIES_DATA } from "../data";

interface Props {
  phoneCountry: string;
  setPhoneCountry: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  otpSent: boolean;
  otp: string;
  setOtp: (v: string) => void;
  cooldown: number;
  phoneVerified: boolean;
  phoneOtpLoading: boolean;
  verificationEmail: string;
  setVerificationEmail: (v: string) => void;
  emailOtpSent: boolean;
  emailOtp: string;
  setEmailOtp: (v: string) => void;
  emailCooldown: number;
  emailVerified: boolean;
  emailOtpLoading: boolean;
  ndaAccepted: boolean;
  setNdaAccepted: (v: boolean) => void;
  ndaSignature: string;
  setNdaSignature: (v: string) => void;
  error: string;
  onSendOTP: () => void;
  onVerifyOTP: () => void;
  onSendEmailOTP: () => void;
  onVerifyEmailOTP: () => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Step2Verification({
  phoneCountry, setPhoneCountry,
  phone, setPhone,
  otpSent, otp, setOtp, cooldown, phoneVerified, phoneOtpLoading,
  verificationEmail, setVerificationEmail,
  emailOtpSent, emailOtp, setEmailOtp, emailCooldown, emailVerified, emailOtpLoading,
  ndaAccepted, setNdaAccepted,
  ndaSignature, setNdaSignature,
  error,
  onSendOTP, onVerifyOTP, onSendEmailOTP, onVerifyEmailOTP,
  onContinue, onBack,
}: Props) {
  const selectedCountry = COUNTRIES_DATA.find(c => c.name === phoneCountry);
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });


  const handlePhoneAction = () => {
    if (phoneVerified) return;
    if (!otpSent) onSendOTP();
    else document.getElementById("otp")?.focus();
  };

  const handleEmailAction = () => {
    if (emailVerified) return;
    if (!emailOtpSent) onSendEmailOTP();
    else document.getElementById("email-otp")?.focus();
  };

  const ndaSigned = ndaAccepted && ndaSignature.trim().length > 0;

  return (
    <GlassCard variant="heavy" padding="lg">
      <GlassCardContent>
        <div className="mb-5">
          <p className="text-[11px] font-semibold text-beige-400 uppercase tracking-widest">Step 3 of 4</p>
          <p className="font-heading font-semibold text-brown-950 text-lg mt-0.5">Identity Verification</p>
          <p className="text-xs text-beige-500 mt-0.5">Review the NDA, sign, then verify your contact details</p>
        </div>

        <div className="space-y-5">

          {/* ── NDA Document ── */}
          <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${ndaSigned ? "ring-2 ring-teal-300 shadow-lg shadow-teal-50" : "ring-1 ring-beige-200 shadow-md"}`}>

            {/* Doc top bar — like DocuSign */}
            <div className="bg-white px-5 py-3.5 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${ndaSigned ? "bg-teal-500" : "bg-brown-600"}`}>
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-gray-900 leading-tight">Product Development Non-Disclosure Agreement</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Glimmora International, UAE · 3 pages · Review before signing</p>
                </div>
              </div>
              {ndaSigned
                ? <span className="flex items-center gap-1.5 text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" /> Signed
                  </span>
                : <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full shrink-0">
                    Signature required
                  </span>
              }
            </div>

            {/* PDF — toolbar hidden */}
            <iframe
              src="/Glimmora International Product-Development-Non-Disclosure-Agreement.pdf#toolbar=0&navpanes=0&scrollbar=1&view=FitH"
              className="w-full bg-gray-50"
              style={{ height: "400px", border: "none", display: "block" }}
              title="NDA Agreement"
            />

            {/* Sign panel */}
            <div className="bg-white border-t border-gray-100 px-5 py-4 space-y-4">

              {/* Instruction row */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2">Sign below</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Signature input */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                  <PenLine className="w-3 h-3" />
                  Full legal name <span className="text-red-500 normal-case font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type your name to sign"
                    value={ndaSignature}
                    onChange={e => setNdaSignature(e.target.value)}
                    className={`w-full h-12 px-4 rounded-xl border-2 text-[15px] transition-all outline-none bg-white
                      placeholder:text-gray-300
                      ${ndaSignature.trim()
                        ? "border-teal-400 text-teal-800 font-medium"
                        : "border-gray-200 text-gray-800 focus:border-brown-400"}`}
                    style={{}}
                  />
                  {ndaSignature.trim() && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-500" />
                  )}
                </div>
                {ndaSignature.trim() && (
                  <p className="text-[10px] text-gray-400 pl-1">Signed as: <span className="italic text-gray-600">{ndaSignature}</span> · {today}</p>
                )}
              </div>

              {/* Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl hover:bg-gray-50 transition-colors -mx-1">
                <div className="mt-0.5 shrink-0">
                  <div
                    onClick={() => setNdaAccepted(!ndaAccepted)}
                    className={`w-4.5 h-4.5 w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all cursor-pointer
                      ${ndaAccepted ? "bg-teal-500 border-teal-500" : "bg-white border-gray-300 group-hover:border-brown-400"}`}
                  >
                    {ndaAccepted && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <span className="text-[12px] text-gray-600 leading-relaxed">
                  I have read, understood, and agree to be legally bound by the{" "}
                  <span className="font-semibold text-gray-900">Glimmora International Product Development Non-Disclosure Agreement</span>,
                  governed by the Indian Contract Act 1872.{" "}
                  <span className="text-red-500 font-semibold">*</span>
                </span>
              </label>

              {/* Signed confirmation */}
              {ndaSigned && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-50 border border-teal-200">
                  <ShieldCheck className="w-5 h-5 text-teal-500 shrink-0" />
                  <div>
                    <p className="text-[12px] font-semibold text-teal-800">Agreement signed</p>
                    <p className="text-[11px] text-teal-600 mt-0.5">
                      Signed by <strong>{ndaSignature}</strong> · {today}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Phone Verification ── */}
          <div className="space-y-3 p-4 rounded-xl bg-beige-50 border border-beige-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-md bg-brown-100 flex items-center justify-center shrink-0">
                <Smartphone className="w-3 h-3 text-brown-500" />
              </div>
              <p className="text-xs font-semibold text-brown-700 uppercase tracking-wide">Phone Number</p>
              {phoneVerified && (
                <span className="ml-auto flex items-center gap-1 text-xs text-teal-600 font-medium">
                  <CheckCircle className="w-3 h-3" /> Verified
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number <span className="text-red-400">*</span></Label>
              <div className="flex gap-2">
                <div className="flex flex-1 h-11 rounded-xl border border-beige-200 bg-white shadow-sm overflow-hidden transition-all focus-within:border-brown-500 focus-within:ring-2 focus-within:ring-brown-500/20">
                  <div className="relative flex items-center border-r border-beige-200 shrink-0">
                    <select
                      value={phoneCountry}
                      onChange={e => {
                        const c = COUNTRIES_DATA.find(x => x.name === e.target.value)!;
                        setPhoneCountry(c.name);
                        setPhone(c.code + " ");
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full"
                      aria-label="Country dial code"
                    >
                      {COUNTRIES_DATA.map(c => (
                        <option key={c.name} value={c.name}>{c.name} ({c.code})</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1.5 px-3 pointer-events-none select-none">
                      <span className={`fi fi-${selectedCountry?.iso} text-xl`} />
                      <span className="text-sm font-semibold text-brown-700">{selectedCountry?.code}</span>
                      <ChevronDown className="w-3 h-3 text-beige-400" />
                    </div>
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Work phone (with country code)"
                    value={phone.replace(/^\+\d+\s?/, "")}
                    onChange={e => {
                      const cc = selectedCountry?.code ?? "";
                      setPhone(cc + " " + e.target.value);
                    }}
                    disabled={phoneVerified}
                    className="flex-1 px-3 text-sm text-brown-950 bg-transparent outline-none placeholder:text-beige-400 disabled:opacity-60"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant={phoneVerified ? "ghost" : "primary"}
                  onClick={handlePhoneAction}
                  disabled={phoneOtpLoading || phoneVerified}
                  className={`shrink-0 ${phoneVerified ? "text-teal-600 border border-teal-200 bg-teal-50 hover:bg-teal-50 gap-1.5 cursor-default" : ""}`}
                >
                  {phoneVerified ? (
                    <><CheckCircle className="w-4 h-4 text-teal-500" /> Verified</>
                  ) : phoneOtpLoading ? (
                    <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending...</>
                  ) : otpSent ? "Verify OTP" : "Send OTP"}
                </Button>
              </div>
            </div>

            {otpSent && !phoneVerified && (
              <div className="space-y-3 p-3 rounded-xl bg-teal-50/60 border border-teal-100">
                <p className="text-xs text-teal-700">
                  A 6-digit code was sent to <strong>{phone}</strong>. Valid for 5 minutes.
                </p>
                <div className="flex gap-2 items-center">
                  <Input id="otp" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6}
                    placeholder="Enter 6-digit code"
                    className="text-center tracking-[0.5em] font-mono flex-1" value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} autoFocus />
                  <Button type="button" size="sm" variant="primary" className="shrink-0"
                    onClick={onVerifyOTP} disabled={phoneOtpLoading || otp.length < 6}>
                    {phoneOtpLoading
                      ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      : <>Verify <ArrowRight className="w-3.5 h-3.5" /></>}
                  </Button>
                </div>
                <button type="button" onClick={onSendOTP}
                  disabled={cooldown > 0 || phoneOtpLoading}
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed">
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                </button>
              </div>
            )}
          </div>

          {/* ── Email Verification ── */}
          <div className="space-y-3 p-4 rounded-xl bg-beige-50 border border-beige-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-md bg-teal-100 flex items-center justify-center shrink-0">
                <Mail className="w-3 h-3 text-teal-500" />
              </div>
              <p className="text-xs font-semibold text-brown-700 uppercase tracking-wide">Email Address</p>
              {emailVerified && (
                <span className="ml-auto flex items-center gap-1 text-xs text-teal-600 font-medium">
                  <CheckCircle className="w-3 h-3" /> Verified
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="verify-email">Email for Verification <span className="text-red-400">*</span></Label>
              <div className="flex gap-2">
                <Input id="verify-email" type="email" placeholder="Work email for verification"
                  value={verificationEmail} onChange={e => setVerificationEmail(e.target.value)}
                  className="flex-1" disabled={emailVerified} />
                <Button type="button" size="sm"
                  variant={emailVerified ? "ghost" : "primary"}
                  onClick={handleEmailAction}
                  disabled={emailOtpLoading || emailVerified}
                  className={`shrink-0 ${emailVerified ? "text-teal-600 border border-teal-200 bg-teal-50 hover:bg-teal-50 gap-1.5 cursor-default" : ""}`}>
                  {emailVerified ? (
                    <><CheckCircle className="w-4 h-4 text-teal-500" /> Verified</>
                  ) : emailOtpLoading ? (
                    <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending...</>
                  ) : emailOtpSent ? "Verify OTP" : "Send OTP"}
                </Button>
              </div>
            </div>

            {emailOtpSent && !emailVerified && (
              <div className="space-y-3 p-3 rounded-xl bg-teal-50/60 border border-teal-100">
                <p className="text-xs text-teal-700">
                  A 6-digit code was sent to <strong>{verificationEmail}</strong>. Valid for 5 minutes.
                </p>
                <div className="flex gap-2 items-center">
                  <Input id="email-otp" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6}
                    placeholder="Enter 6-digit code"
                    className="text-center tracking-[0.5em] font-mono flex-1" value={emailOtp}
                    onChange={e => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} />
                  <Button type="button" size="sm" variant="primary" className="shrink-0"
                    onClick={onVerifyEmailOTP} disabled={emailOtpLoading || emailOtp.length < 6}>
                    {emailOtpLoading
                      ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      : <>Verify <ArrowRight className="w-3.5 h-3.5" /></>}
                  </Button>
                </div>
                <button type="button" onClick={onSendEmailOTP}
                  disabled={emailCooldown > 0 || emailOtpLoading}
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed">
                  {emailCooldown > 0 ? `Resend in ${emailCooldown}s` : "Resend OTP"}
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          <Button type="button" variant="primary" size="lg" className="w-full"
            onClick={onContinue} disabled={!ndaSigned || !phoneVerified || !emailVerified}>
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
