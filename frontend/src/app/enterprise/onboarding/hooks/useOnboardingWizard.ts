"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getTaxIdConfig } from "@/lib/validations/tax-id";

interface TeamInvite {
  email: string;
  firstName: string;
  lastName: string;
}

const emptyInvite = (): TeamInvite => ({ email: "", firstName: "", lastName: "" });

/* ── Mock data for demo ── */
const MOCK_REGISTRATION = {
  companyName: "Glimmora International",
  countryOfIncorporation: "India",
  adminEmail: "admin@glimmora.com",
};

const MOCK_STEP1 = {
  taxId: "27AAPFU0939F1ZV",
  addressLine1: "Office No.202, Saha Offices",
  addressLine2: "Souk Al Bahar, Downtown Dubai",
  city: "Mumbai",
  stateProvince: "Maharashtra",
  postalCode: "400001",
};

const MOCK_STEP2 = {
  billingContactName: "Rahulraj P",
  billingContactEmail: "admin@glimmora.com",
};

const MOCK_TEAM: TeamInvite[] = [
  { email: "reviewer1@glimmora.com", firstName: "Priya", lastName: "Sharma" },
];

export function useOnboardingWizard() {
  const router = useRouter();
  const registrationData = useAuthStore((s) => s.registrationData);
  const setOnboardingComplete = useAuthStore((s) => s.setOnboardingComplete);
  const onboardingProgress = useAuthStore((s) => s.onboardingProgress);
  const setOnboardingProgress = useAuthStore((s) => s.setOnboardingProgress);

  const reg = registrationData ?? MOCK_REGISTRATION;

  /* ── Navigation ── */
  const [step, setStep] = useState(0); // 0 = welcome
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* ── Step 1: Company Verification ── */
  const [companyName] = useState(reg.companyName);
  const [countryOfIncorporation] = useState(reg.countryOfIncorporation);
  const [incorporationFile, setIncorporationFile] = useState<File | null>(null);
  const [incorporationDrag, setIncorporationDrag] = useState(false);
  const [taxId, setTaxId] = useState(MOCK_STEP1.taxId);
  const [addressLine1, setAddressLine1] = useState(MOCK_STEP1.addressLine1);
  const [addressLine2, setAddressLine2] = useState(MOCK_STEP1.addressLine2);
  const [city, setCity] = useState(MOCK_STEP1.city);
  const [stateProvince, setStateProvince] = useState(MOCK_STEP1.stateProvince);
  const [postalCode, setPostalCode] = useState(MOCK_STEP1.postalCode);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "verified" | "pending-review">("idle");

  /* ── Step 2: Billing & Legal ── */
  const [billingCurrency, setBillingCurrency] = useState("INR");
  const [billingContactEmail, setBillingContactEmail] = useState(MOCK_STEP2.billingContactEmail);
  const [billingContactName, setBillingContactName] = useState(MOCK_STEP2.billingContactName);
  const [ndaFile, setNdaFile] = useState<File | null>(null);
  const [ndaDrag, setNdaDrag] = useState(false);
  const [acceptTos, setAcceptTos] = useState(false);
  const [acceptDpa, setAcceptDpa] = useState(false);
  const [esigOtpSent, setEsigOtpSent] = useState(false);
  const [esigOtp, setEsigOtp] = useState("");
  const [esigCooldown, setEsigCooldown] = useState(0);
  const [esigVerified, setEsigVerified] = useState(false);
  const [esigOtpLoading, setEsigOtpLoading] = useState(false);

  /* ── Step 3: Team Setup ── */
  const [teamInvites, setTeamInvites] = useState<TeamInvite[]>(MOCK_TEAM);
  const [isSubmittingInvites, setIsSubmittingInvites] = useState(false);

  /* ── Step 4: Upload SOW ── */
  const [sowFile, setSowFile] = useState<File | null>(null);
  const [sowDrag, setSowDrag] = useState(false);
  const [projectTitle, setProjectTitle] = useState("Enterprise Portal Rebuild — Phase 1");

  /* ── Restore progress ── */
  useEffect(() => {
    if (onboardingProgress) {
      setStep(onboardingProgress.currentStep);
      if (onboardingProgress.step1) {
        setTaxId(onboardingProgress.step1.taxId);
        setAddressLine1(onboardingProgress.step1.addressLine1);
        setAddressLine2(onboardingProgress.step1.addressLine2);
        setCity(onboardingProgress.step1.city);
        setStateProvince(onboardingProgress.step1.stateProvince);
        setPostalCode(onboardingProgress.step1.postalCode);
      }
      if (onboardingProgress.step2) {
        setBillingCurrency(onboardingProgress.step2.billingCurrency);
        setBillingContactEmail(onboardingProgress.step2.billingContactEmail);
        setBillingContactName(onboardingProgress.step2.billingContactName);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Auto-save ── */
  const saveProgress = useCallback(() => {
    if (step === 0) return;
    setOnboardingProgress({
      currentStep: step,
      step1: { taxId, addressLine1, addressLine2, city, stateProvince, postalCode },
      step2: { billingCurrency, billingContactEmail, billingContactName },
      lastSaved: new Date().toISOString(),
    });
  }, [step, taxId, addressLine1, addressLine2, city, stateProvince, postalCode, billingCurrency, billingContactEmail, billingContactName, setOnboardingProgress]);

  useEffect(() => {
    const timeout = setTimeout(saveProgress, 1000);
    return () => clearTimeout(timeout);
  }, [saveProgress]);

  /* ── OTP helpers ── */
  function startEsigCooldown() {
    setEsigCooldown(30);
    const iv = setInterval(() => {
      setEsigCooldown((p) => {
        if (p <= 1) { clearInterval(iv); return 0; }
        return p - 1;
      });
    }, 1000);
  }

  async function sendEsigOTP() {
    if (!billingContactEmail) { setError("Please enter a billing contact email first"); return; }
    setError("");
    setEsigOtpLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setEsigOtpLoading(false);
    setEsigOtpSent(true);
    startEsigCooldown();
  }

  async function verifyEsigOTP() {
    if (esigOtp.length !== 6) { setError("Please enter the 6-digit code"); return; }
    setError("");
    setEsigOtpLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setEsigOtpLoading(false);
    setEsigVerified(true);
  }

  /* ── Team invite helpers ── */
  function addInviteRow() {
    if (teamInvites.length < 10) setTeamInvites([...teamInvites, emptyInvite()]);
  }

  function removeInviteRow(index: number) {
    setTeamInvites(teamInvites.filter((_, i) => i !== index));
  }

  function updateInvite(index: number, field: keyof TeamInvite, value: string) {
    setTeamInvites(teamInvites.map((inv, i) => (i === index ? { ...inv, [field]: value } : inv)));
  }

  /* ── Step navigation ── */
  function goToStep1() {
    setError("");
    setStep(1);
  }

  function goToStep2() {
    if (!incorporationFile) { setError("Please upload your Certificate of Incorporation"); return; }
    const taxConfig = getTaxIdConfig(countryOfIncorporation);
    if (!taxId.trim()) { setError(`Please enter your ${taxConfig.label}`); return; }
    if (!taxConfig.validate(taxId)) { setError(`Invalid ${taxConfig.label} format. Expected: ${taxConfig.format}`); return; }
    if (!addressLine1.trim()) { setError("Please enter your registered address"); return; }
    if (!city.trim()) { setError("Please enter the city"); return; }
    if (!stateProvince.trim()) { setError("Please enter the state/province"); return; }
    if (!postalCode.trim()) { setError("Please enter the postal/ZIP code"); return; }

    setError("");

    // Simulate verification
    setVerificationStatus("verifying");
    setTimeout(() => {
      setVerificationStatus("verified");
      setStep(2);
    }, 1500);
  }

  function goToStep3() {
    if (!billingCurrency) { setError("Please select a billing currency"); return; }
    if (!billingContactEmail.trim()) { setError("Please enter a billing contact email"); return; }
    if (!billingContactName.trim()) { setError("Please enter a billing contact name"); return; }
    // Auto-accept legal agreements when continuing (user agreed via hyperlinks)
    setAcceptTos(true);
    setAcceptDpa(true);
    setError("");
    setStep(3);
  }

  function goToStep4() {
    // Step 3 is skippable — team invites are optional
    const filledInvites = teamInvites.filter((inv) => inv.email.trim());
    if (filledInvites.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const inv of filledInvites) {
        if (!emailRegex.test(inv.email)) {
          setError(`Invalid email: ${inv.email}`);
          return;
        }
      }
    }
    setError("");
    setStep(4);
  }

  function skipStep3() {
    setError("");
    setStep(4);
  }

  async function handleComplete() {
    setError("");
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setOnboardingComplete(true);
    setOnboardingProgress(null);
    router.push("/enterprise/dashboard");
  }

  function skipStep4() {
    handleComplete();
  }

  const taxIdConfig = getTaxIdConfig(countryOfIncorporation);

  return {
    step, setStep, error, setError, isLoading,

    // Step 1
    companyName, countryOfIncorporation,
    incorporationFile, setIncorporationFile,
    incorporationDrag, setIncorporationDrag,
    taxId, setTaxId, taxIdConfig,
    addressLine1, setAddressLine1,
    addressLine2, setAddressLine2,
    city, setCity,
    stateProvince, setStateProvince,
    postalCode, setPostalCode,
    verificationStatus,

    // Step 2
    billingCurrency, setBillingCurrency,
    billingContactEmail, setBillingContactEmail,
    billingContactName, setBillingContactName,
    ndaFile, setNdaFile, ndaDrag, setNdaDrag,
    acceptTos, setAcceptTos,
    acceptDpa, setAcceptDpa,
    esigOtpSent, esigOtp, setEsigOtp,
    esigCooldown, esigVerified, esigOtpLoading,
    sendEsigOTP, verifyEsigOTP,

    // Step 3
    teamInvites, addInviteRow, removeInviteRow, updateInvite,
    isSubmittingInvites,

    // Step 4
    sowFile, setSowFile, sowDrag, setSowDrag,
    projectTitle, setProjectTitle,

    // Navigation
    goToStep1, goToStep2, goToStep3, goToStep4,
    skipStep3, skipStep4, handleComplete,
  };
}
