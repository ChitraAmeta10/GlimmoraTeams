"use client";

import Link from "next/link";
import {
  AlertCircle, ArrowRight, ArrowLeft, CheckCircle,
  Shield, Pencil, RefreshCw,
} from "lucide-react";
import {
  GlassCard, GlassCardContent, Button, Checkbox,
} from "@/components/ui";

interface Props {
  resumeFile: File | null;
  setResumeFile: (v: File | null) => void;
  resumeDrag: boolean;
  setResumeDrag: (v: boolean) => void;
  acceptTos: boolean;       setAcceptTos: (v: boolean) => void;
  acceptCoc: boolean;       setAcceptCoc: (v: boolean) => void;
  acceptPrivacy: boolean;   setAcceptPrivacy: (v: boolean) => void;
  acceptFee: boolean;       setAcceptFee: (v: boolean) => void;
  acceptAhp: boolean;       setAcceptAhp: (v: boolean) => void;
  marketingOptIn: boolean;  setMarketingOptIn: (v: boolean) => void;
  isLoading: boolean;
  error: string;
  onPreview: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const LEGAL_AGREEMENTS = [
  {
    id:    "tos" as const,
    label: "Terms of Use",
    note:  undefined as string | undefined,
    link:  "#",
  },
  {
    id:    "coc" as const,
    label: "Code of Conduct",
    note:  undefined,
    link:  "#",
  },
  {
    id:    "privacy" as const,
    label: "Privacy Policy",
    note:  undefined,
    link:  "#",
  },
  {
    id:    "ahp" as const,
    label: "Anti-Harassment Policy",
    note:  undefined,
    link:  "#",
  },
] as const;

type AgreementId = (typeof LEGAL_AGREEMENTS)[number]["id"];

export function Step4Consent({
  resumeFile, setResumeFile, resumeDrag, setResumeDrag,
  acceptTos, setAcceptTos,
  acceptCoc, setAcceptCoc,
  acceptPrivacy, setAcceptPrivacy,
  acceptFee, setAcceptFee,
  acceptAhp, setAcceptAhp,
  marketingOptIn, setMarketingOptIn,
  isLoading, error,
  onPreview, onSubmit, onBack,
}: Props) {

  const agreementState: Record<AgreementId, { checked: boolean; set: (v: boolean) => void }> = {
    tos: { checked: acceptTos, set: setAcceptTos },
    coc: { checked: acceptCoc, set: setAcceptCoc },
    privacy: { checked: acceptPrivacy, set: setAcceptPrivacy },
    ahp: { checked: acceptAhp, set: setAcceptAhp },
  };

  const allRequired = acceptTos && acceptCoc && acceptPrivacy && acceptFee && acceptAhp;

  return (
    <GlassCard variant="heavy" padding="lg">
      <GlassCardContent>
        <form onSubmit={onSubmit} className="space-y-6">

          <div className="pb-1 border-b border-beige-100">
            <p className="text-[11px] font-semibold text-beige-400 uppercase tracking-widest">Step 4 of 4</p>
            <p className="font-heading font-semibold text-brown-950 text-lg mt-0.5">Consent &amp; Terms</p>
            <p className="text-xs text-beige-500 mt-0.5">Upload your resume and accept the agreements below to complete registration</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-md bg-beige-100 flex items-center justify-center shrink-0">
                <ArrowRight className="w-3 h-3 text-beige-500 rotate-[-90deg]" />
              </div>
              <p className="text-xs font-semibold text-brown-700 uppercase tracking-wide">Resume / CV</p>
              <span className="text-[10px] text-beige-400 font-medium">(optional - PDF - max 5 MB)</span>
            </div>
            <label
              onDragOver={e => { e.preventDefault(); setResumeDrag(true); }}
              onDragLeave={() => setResumeDrag(false)}
              onDrop={e => {
                e.preventDefault();
                setResumeDrag(false);
                const f = e.dataTransfer.files[0];
                if (f && f.type === "application/pdf") setResumeFile(f);
              }}
              className={`flex items-center gap-3 w-full rounded-xl border-2 border-dashed px-4 py-3.5 cursor-pointer transition-all ${
                resumeDrag
                  ? "border-brown-400 bg-brown-50"
                  : resumeFile
                  ? "border-teal-400 bg-teal-50"
                  : "border-beige-300 hover:border-beige-400 bg-white"
              }`}
            >
              <input
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={e => { const f = e.target.files?.[0]; if (f) setResumeFile(f); }}
              />
              {resumeFile ? (
                <>
                  <CheckCircle className="w-5 h-5 text-teal-500 shrink-0" />
                  <p className="text-sm font-medium text-teal-700 flex-1 truncate">{resumeFile.name}</p>
                  <button
                    type="button"
                    onClick={e => { e.preventDefault(); setResumeFile(null); }}
                    className="text-xs text-beige-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <div className="w-9 h-9 rounded-lg bg-beige-100 flex items-center justify-center shrink-0">
                    <ArrowRight className="w-4 h-4 text-beige-400 rotate-[-90deg]" />
                  </div>
                  <div>
                    <p className="text-sm text-brown-700 font-medium">
                      Drop your resume here or{" "}
                      <span className="text-teal-600 underline">browse files</span>
                    </p>
                    <p className="text-xs text-beige-400 mt-0.5">PDF only - Maximum 5 MB</p>
                  </div>
                </>
              )}
            </label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-md bg-brown-100 flex items-center justify-center shrink-0">
                <Shield className="w-3 h-3 text-brown-500" />
              </div>
              <p className="text-xs font-semibold text-brown-700 uppercase tracking-wide">Legal Agreements</p>
              <span className="text-[10px] text-red-400 font-medium">All required</span>
            </div>
            <div className="rounded-xl border border-beige-200 overflow-hidden divide-y divide-beige-100">
              {LEGAL_AGREEMENTS.map(({ id, label, note, link }) => {
                const { checked, set } = agreementState[id];
                return (
                  <label
                    key={id}
                    htmlFor={id}
                    className={`flex items-center gap-3 px-3.5 py-3 transition-colors cursor-pointer ${
                      checked ? "bg-brown-50" : "bg-white hover:bg-beige-50"
                    }`}
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={v => set(!!v)}
                      onClick={e => e.stopPropagation()}
                      className="shrink-0"
                    />
                    <span className="text-sm text-brown-800 flex-1">
                      I have read and agree to the{" "}
                      <Link
                        href={link}
                        className="text-teal-600 hover:underline font-medium"
                        onClick={e => e.stopPropagation()}
                      >
                        {label}
                      </Link>
                      {note && <span className="text-xs text-beige-400 ml-1">({note})</span>}
                    </span>
                    {checked && <CheckCircle className="w-4 h-4 text-teal-500 shrink-0" />}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-md bg-gold-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-3 h-3 text-gold-500" />
              </div>
              <p className="text-xs font-semibold text-brown-700 uppercase tracking-wide">Acknowledgments</p>
            </div>

            <label
              htmlFor="fee"
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                acceptFee
                  ? "border-gold-400 bg-gold-50"
                  : "border-gold-200 bg-gold-50/40 hover:border-gold-300"
              }`}
            >
              <Checkbox
                id="fee"
                checked={acceptFee}
                onCheckedChange={v => setAcceptFee(!!v)}
                onClick={e => e.stopPropagation()}
                className="mt-0.5 shrink-0"
              />
              <span className="text-sm text-gold-800 leading-relaxed flex-1">
                I acknowledge that GlimmoraTeam applies a{" "}
                <strong>platform service fee</strong> on completed task earnings.
                The applicable rate is visible in your contributor profile settings.{" "}
                <span className="text-red-400">*</span>
              </span>
              {acceptFee && <CheckCircle className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />}
            </label>

            <label
              htmlFor="mkt"
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                marketingOptIn
                  ? "border-teal-300 bg-teal-50"
                  : "border-beige-200 hover:border-beige-300 bg-white"
              }`}
            >
              <Checkbox
                id="mkt"
                checked={marketingOptIn}
                onCheckedChange={v => setMarketingOptIn(!!v)}
                onClick={e => e.stopPropagation()}
                className="mt-0.5 shrink-0"
              />
              <span className="text-sm leading-relaxed flex-1">
                <span className={marketingOptIn ? "text-teal-800" : "text-beige-600"}>
                  Keep me informed about new task matches, platform updates, and career growth resources
                </span>{" "}
                <span className="text-xs text-beige-400 font-medium">(optional)</span>
              </span>
              {marketingOptIn && <CheckCircle className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />}
            </label>
          </div>

          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={onPreview}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-beige-300 hover:border-brown-400 hover:bg-brown-50 text-sm font-medium text-brown-700 hover:text-brown-900 transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
              Preview my answers before submitting
            </button>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
              </div>
            )}

            <Button
              type="submit"
              variant="gradient-forest"
              size="lg"
              className="w-full"
              disabled={isLoading || !allRequired}
            >
              {isLoading ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Creating your account...</>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>

            <button
              type="button"
              onClick={onBack}
              className="w-full text-sm text-beige-600 hover:text-beige-800 flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>
          </div>

        </form>
      </GlassCardContent>
    </GlassCard>
  );
}
