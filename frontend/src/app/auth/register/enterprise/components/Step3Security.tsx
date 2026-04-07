"use client";

import { useState } from "react";
import {
  AlertCircle, ArrowRight, ArrowLeft,
  Eye, EyeOff, Lock, Smartphone, Mail,
  CheckCircle, RefreshCw,
} from "lucide-react";
import { ChevronDown } from "lucide-react";
import {
  GlassCard, GlassCardContent, Button, Input, Label,
} from "@/components/ui";
import { COUNTRIES_DATA } from "../../data";
import type { PasswordStrength } from "../../types";

interface Props {
  password: string; setPassword: (v: string) => void;
  confirm: string; setConfirm: (v: string) => void;
  passwordStrength: PasswordStrength;
  phoneCountry: string; setPhoneCountry: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  otpSent: boolean;
  otp: string; setOtp: (v: string) => void;
  cooldown: number;
  phoneVerified: boolean;
  phoneOtpLoading: boolean;
  adminEmail: string; setAdminEmail: (v: string) => void;
  emailOtpSent: boolean;
  emailOtp: string; setEmailOtp: (v: string) => void;
  emailCooldown: number;
  emailVerified: boolean;
  emailOtpLoading: boolean;
  error: string;
  onSendOTP: () => void;
  onVerifyOTP: () => void;
  onSendEmailOTP: () => void;
  onVerifyEmailOTP: () => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Step3Security({
  password, setPassword,
  confirm, setConfirm,
  passwordStrength,
  phoneCountry, setPhoneCountry,
  phone, setPhone,
  otpSent, otp, setOtp, cooldown, phoneVerified, phoneOtpLoading,
  adminEmail, setAdminEmail,
  emailOtpSent, emailOtp, setEmailOtp, emailCooldown, emailVerified, emailOtpLoading,
  error,
  onSendOTP, onVerifyOTP, onSendEmailOTP, onVerifyEmailOTP,
  onContinue, onBack,
}: Props) {
  const [showPw, setShowPw] = useState(false);
  const [showCon, setShowCon] = useState(false);

  const selectedCountry = COUNTRIES_DATA.find(country => country.name === phoneCountry);
  const pwMatch = confirm.length > 0 && password === confirm;
  const pwMismatch = confirm.length > 0 && password !== confirm;

  const handlePhoneAction = () => {
    if (phoneVerified) return;
    if (!otpSent) onSendOTP();
    else document.getElementById("enterprise-otp")?.focus();
  };

  const handleEmailAction = () => {
    if (emailVerified) return;
    if (!emailOtpSent) onSendEmailOTP();
    else document.getElementById("enterprise-email-otp")?.focus();
  };

  return (
    <GlassCard variant="heavy" padding="lg">
      <GlassCardContent>
        <div className="mb-5">
          <p className="text-[11px] font-semibold text-beige-400 uppercase tracking-widest">Step 3 of 4</p>
          <p className="font-heading font-semibold text-brown-950 text-lg mt-0.5">Account Security</p>
          <p className="text-xs text-beige-500 mt-0.5">Create a password and verify the administrator phone number and email address</p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-md bg-brown-100 flex items-center justify-center shrink-0">
                <Lock className="w-3 h-3 text-brown-500" />
              </div>
              <p className="text-xs font-semibold text-brown-700 uppercase tracking-wide">Password</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pw">
                  Password <span className="text-red-400">*</span>{" "}
                  <span className="text-beige-400 text-xs">(min 8 characters)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="pw"
                    type={showPw ? "text" : "password"}
                    placeholder="Create a strong password (min 8 characters)"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(value => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-beige-400 hover:text-beige-600"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && (
                  <div className="space-y-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= passwordStrength.score ? passwordStrength.color : "bg-beige-200"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-medium ${
                        passwordStrength.score <= 1 ? "text-red-500"
                        : passwordStrength.score <= 3 ? "text-gold-600"
                        : "text-teal-600"
                      }`}>
                        {passwordStrength.label}
                      </p>
                      <p className="text-[10px] text-beige-400">
                        {passwordStrength.score < 5 ? "Add symbols & length for a stronger password" : "Excellent password strength"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="con">Confirm Password <span className="text-red-400">*</span></Label>
                <div className="relative">
                  <Input
                    id="con"
                    type={showCon ? "text" : "password"}
                    placeholder="Re-enter password to confirm"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className={`pr-10 ${pwMismatch ? "border-red-300 focus:border-red-400" : pwMatch ? "border-teal-400" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCon(value => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-beige-400 hover:text-beige-600"
                  >
                    {showCon ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {pwMatch && <p className="text-xs text-teal-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Passwords match</p>}
                {pwMismatch && <p className="text-xs text-red-500">Passwords do not match</p>}
              </div>
            </div>
          </div>

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
              <Label htmlFor="enterprise-phone">Mobile Number <span className="text-red-400">*</span></Label>
              <div className="flex gap-2">
                <div className="flex flex-1 h-11 rounded-xl border border-beige-200 bg-white shadow-sm overflow-hidden transition-all focus-within:border-brown-500 focus-within:ring-2 focus-within:ring-brown-500/20">
                  <div className="relative flex items-center border-r border-beige-200 shrink-0">
                    <select
                      value={phoneCountry}
                      onChange={e => {
                        const country = COUNTRIES_DATA.find(item => item.name === e.target.value)!;
                        setPhoneCountry(country.name);
                        setPhone(country.code + " ");
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
                    id="enterprise-phone"
                    type="tel"
                    placeholder="Work phone (with country code)"
                    value={phone.replace(/^\+\d+\s?/, "")}
                    onChange={e => {
                      const dialCode = selectedCountry?.code ?? "";
                      setPhone(dialCode + " " + e.target.value);
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
                  <Input
                    id="enterprise-otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    className="text-center tracking-[0.5em] font-mono flex-1"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    autoFocus
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    className="shrink-0"
                    onClick={onVerifyOTP}
                    disabled={phoneOtpLoading || otp.length < 6}
                  >
                    {phoneOtpLoading
                      ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      : <>Verify <ArrowRight className="w-3.5 h-3.5" /></>}
                  </Button>
                </div>
                <button
                  type="button"
                  onClick={onSendOTP}
                  disabled={cooldown > 0 || phoneOtpLoading}
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                </button>
              </div>
            )}
          </div>

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
              <Label htmlFor="enterprise-email">Email for Verification <span className="text-red-400">*</span></Label>
              <div className="flex gap-2">
                <Input
                  id="enterprise-email"
                  type="email"
                  placeholder="Work email for verification"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  className="flex-1"
                  disabled={emailVerified}
                />
                <Button
                  type="button"
                  size="sm"
                  variant={emailVerified ? "ghost" : "primary"}
                  onClick={handleEmailAction}
                  disabled={emailOtpLoading || emailVerified}
                  className={`shrink-0 ${emailVerified ? "text-teal-600 border border-teal-200 bg-teal-50 hover:bg-teal-50 gap-1.5 cursor-default" : ""}`}
                >
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
                  A 6-digit code was sent to <strong>{adminEmail}</strong>. Valid for 5 minutes.
                </p>
                <div className="flex gap-2 items-center">
                  <Input
                    id="enterprise-email-otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    className="text-center tracking-[0.5em] font-mono flex-1"
                    value={emailOtp}
                    onChange={e => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    className="shrink-0"
                    onClick={onVerifyEmailOTP}
                    disabled={emailOtpLoading || emailOtp.length < 6}
                  >
                    {emailOtpLoading
                      ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      : <>Verify <ArrowRight className="w-3.5 h-3.5" /></>}
                  </Button>
                </div>
                <button
                  type="button"
                  onClick={onSendEmailOTP}
                  disabled={emailCooldown > 0 || emailOtpLoading}
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
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

          <Button type="button" variant="primary" size="lg" className="w-full" onClick={onContinue}>
            Continue <ArrowRight className="w-4 h-4" />
          </Button>

          <button
            type="button"
            onClick={onBack}
            className="w-full text-sm text-beige-600 hover:text-beige-800 flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}
