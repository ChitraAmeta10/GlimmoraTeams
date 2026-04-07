"use client";

import {
  AlertCircle, ArrowRight, Upload, FileText,
  CheckCircle, RefreshCw, Clock,
} from "lucide-react";
import { Button, Input, Label } from "@/components/ui";

interface TaxIdConfig {
  label: string;
  placeholder: string;
  validate: (v: string) => boolean;
  format: string;
}

interface Props {
  companyName: string;
  countryOfIncorporation: string;
  incorporationFile: File | null;
  setIncorporationFile: (v: File | null) => void;
  incorporationDrag: boolean;
  setIncorporationDrag: (v: boolean) => void;
  taxId: string;
  setTaxId: (v: string) => void;
  taxIdConfig: TaxIdConfig;
  addressLine1: string;
  setAddressLine1: (v: string) => void;
  addressLine2: string;
  setAddressLine2: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  stateProvince: string;
  setStateProvince: (v: string) => void;
  postalCode: string;
  setPostalCode: (v: string) => void;
  verificationStatus: "idle" | "verifying" | "verified" | "pending-review";
  error: string;
  onContinue: () => void;
}

export function Step1CompanyVerification({
  companyName, countryOfIncorporation,
  incorporationFile, setIncorporationFile,
  incorporationDrag, setIncorporationDrag,
  taxId, setTaxId, taxIdConfig,
  addressLine1, setAddressLine1,
  addressLine2, setAddressLine2,
  city, setCity,
  stateProvince, setStateProvince,
  postalCode, setPostalCode,
  verificationStatus, error, onContinue,
}: Props) {
  const acceptedTypes = ["application/pdf", "image/jpeg", "image/png"];

  return (
    <div className="space-y-8">
      {/* Company Identity */}
      <section>
        <h3 className="text-sm font-semibold text-brown-900 mb-4">Company Identity</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Company Name</Label>
            <Input value={companyName} disabled className="bg-beige-50 opacity-70" />
          </div>
          <div className="space-y-1.5">
            <Label>Country of Incorporation</Label>
            <Input value={countryOfIncorporation} disabled className="bg-beige-50 opacity-70" />
          </div>
        </div>
      </section>

      {/* Documents & Tax */}
      <section>
        <h3 className="text-sm font-semibold text-brown-900 mb-4">Documents & Tax ID</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Certificate of Incorporation <span className="text-red-400">*</span></Label>
            <label
              onDragOver={e => { e.preventDefault(); setIncorporationDrag(true); }}
              onDragLeave={() => setIncorporationDrag(false)}
              onDrop={e => {
                e.preventDefault();
                setIncorporationDrag(false);
                const file = e.dataTransfer.files[0];
                if (file && acceptedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024) setIncorporationFile(file);
              }}
              className={`flex items-center gap-3 w-full h-10 rounded-xl border px-3 cursor-pointer transition-all ${
                incorporationDrag
                  ? "border-brown-400 bg-brown-50"
                  : incorporationFile
                  ? "border-teal-300 bg-teal-50"
                  : "border-beige-200 hover:border-beige-300 bg-white"
              }`}
            >
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="sr-only"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file && file.size <= 10 * 1024 * 1024) setIncorporationFile(file);
                }}
              />
              {incorporationFile ? (
                <>
                  <FileText className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="text-sm text-teal-800 truncate flex-1">{incorporationFile.name}</span>
                  <CheckCircle className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-beige-400 shrink-0" />
                  <span className="text-sm text-beige-400">PDF, JPG, PNG — max 10 MB</span>
                </>
              )}
            </label>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tax-id">{taxIdConfig.label} <span className="text-red-400">*</span></Label>
            <Input
              id="tax-id"
              placeholder={taxIdConfig.placeholder}
              value={taxId}
              onChange={e => setTaxId(e.target.value)}
            />
            <p className="text-[10px] text-beige-400">Format: {taxIdConfig.format}</p>
          </div>
        </div>
      </section>

      {/* Address */}
      <section>
        <h3 className="text-sm font-semibold text-brown-900 mb-4">Registered Address</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Address Line 1 <span className="text-red-400">*</span></Label>
            <Input placeholder="Street address, building" value={addressLine1} onChange={e => setAddressLine1(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Address Line 2</Label>
            <Input placeholder="Floor, suite (optional)" value={addressLine2} onChange={e => setAddressLine2(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>City <span className="text-red-400">*</span></Label>
            <Input placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>State / Province <span className="text-red-400">*</span></Label>
            <Input placeholder="State or province" value={stateProvince} onChange={e => setStateProvince(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Postal / ZIP Code <span className="text-red-400">*</span></Label>
            <Input placeholder="Postal code" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Country</Label>
            <Input value={countryOfIncorporation} disabled className="bg-beige-50 opacity-70" />
          </div>
        </div>
      </section>

      {/* Status & Actions */}
      <div className="space-y-4 pt-2 border-t border-beige-100">
        {verificationStatus !== "idle" && (
          <div className={`flex items-center gap-2 text-xs font-medium ${
            verificationStatus === "verified" ? "text-teal-600"
              : verificationStatus === "verifying" ? "text-brown-500"
              : "text-amber-600"
          }`}>
            {verificationStatus === "verifying" && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            {verificationStatus === "verified" && <CheckCircle className="w-3.5 h-3.5" />}
            {verificationStatus === "pending-review" && <Clock className="w-3.5 h-3.5" />}
            {verificationStatus === "verifying" && "Verifying your company details..."}
            {verificationStatus === "verified" && "Company verified successfully."}
            {verificationStatus === "pending-review" && "Under review — we'll notify you within 1 business day."}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" />{error}
          </div>
        )}

        <Button type="button" variant="primary" size="md" className="ml-auto"
          onClick={onContinue} disabled={verificationStatus === "verifying"}>
          {verificationStatus === "verifying" ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Verifying...</>
          ) : (
            <>Continue <ArrowRight className="w-4 h-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
