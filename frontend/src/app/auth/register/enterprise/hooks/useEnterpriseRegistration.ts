"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES_DATA } from "../../data";
import { getPasswordStrength } from "../../helpers";
import { useAuthStore } from "@/lib/stores/auth-store";

export type OrgType =
  | ""
  | "startup"
  | "sme"
  | "large-enterprise"
  | "mnc"
  | "ngo"
  | "government"
  | "educational"
  | "agency"
  | "other";

export function useEnterpriseRegistration() {
  const router = useRouter();

  const [step, setStep]         = useState(1);
  const [error, setError]       = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [orgName, setOrgName]             = useState("");
  const [orgType, setOrgType]             = useState<OrgType>("");
  const [orgTypeOther, setOrgTypeOther]   = useState("");
  const [industry, setIndustry]           = useState("");
  const [industryOther, setIndustryOther] = useState("");
  const [companySize, setCompanySize]     = useState("");
  const [website, setWebsite]             = useState("");
  const [hqCountry, setHqCountry]         = useState("");
  const [hqCity, setHqCity]               = useState("");

  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName]   = useState("");
  const [adminTitle, setAdminTitle]         = useState("");
  const [adminEmail, setAdminEmail]         = useState("");
  const [adminDept, setAdminDept]           = useState("");
  const [phoneCountry, setPhoneCountry]     = useState("India");
  const [phone, setPhone]                   = useState("");

  const [password, setPassword]         = useState("");
  const [confirm, setConfirm]           = useState("");
  const [otpSent, setOtpSent]           = useState(false);
  const [otp, setOtp]                   = useState("");
  const [cooldown, setCooldown]         = useState(0);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneOtpLoading, setPhoneOtpLoading] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp]         = useState("");
  const [emailCooldown, setEmailCooldown] = useState(0);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtpLoading, setEmailOtpLoading] = useState(false);

  const [incorporationCountry, setIncorporationCountry] = useState("");
  const [incorporationFile, setIncorporationFile] = useState<File | null>(null);
  const [incorporationDrag, setIncorporationDrag] = useState(false);
  const [acceptTos, setAcceptTos]           = useState(false);
  const [acceptPp, setAcceptPp]             = useState(false);
  const [acceptEsa, setAcceptEsa]           = useState(false);
  const [acceptAhp, setAcceptAhp]           = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  useEffect(() => {
    setPhoneVerified(false);
    setOtpSent(false);
    setOtp("");
  }, [phoneCountry, phone]);

  useEffect(() => {
    setEmailVerified(false);
    setEmailOtpSent(false);
    setEmailOtp("");
  }, [adminEmail]);

  function startCooldown() {
    setCooldown(30);
    const iv = setInterval(() => {
      setCooldown(p => {
        if (p <= 1) {
          clearInterval(iv);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
  }

  function startEmailCooldown() {
    setEmailCooldown(30);
    const iv = setInterval(() => {
      setEmailCooldown(p => {
        if (p <= 1) {
          clearInterval(iv);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
  }

  async function sendOTP() {
    if (!phone || phone.replace(/\D/g, "").length < 7) {
      setError("Please enter a valid phone number");
      return;
    }
    setError("");
    setPhoneOtpLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPhoneOtpLoading(false);
    setOtpSent(true);
    startCooldown();
  }

  async function verifyOTP() {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }
    setError("");
    setPhoneOtpLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setPhoneOtpLoading(false);
    setPhoneVerified(true);
  }

  async function sendEmailOTP() {
    if (!adminEmail.trim() || !adminEmail.includes("@")) {
      setError("Please enter a valid business email address");
      return;
    }
    setError("");
    setEmailOtpLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setEmailOtpLoading(false);
    setEmailOtpSent(true);
    startEmailCooldown();
  }

  async function verifyEmailOTP() {
    if (emailOtp.length !== 6) {
      setError("Please enter the 6-digit email code");
      return;
    }
    setError("");
    setEmailOtpLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setEmailOtpLoading(false);
    setEmailVerified(true);
  }

  function goToStep2() {
    if (!orgName.trim())  { setError("Please enter your organisation name"); return; }
    if (!orgType)         { setError("Please select your organisation type"); return; }
    if (orgType === "other" && !orgTypeOther.trim()) {
      setError("Please enter your organisation type");
      return;
    }
    if (!industry)        { setError("Please select your industry / sector"); return; }
    if (industry === "other" && !industryOther.trim()) {
      setError("Please enter your industry / sector");
      return;
    }
    if (!companySize)     { setError("Please select your company size"); return; }
    setError("");
    setStep(2);
  }

  function goToStep3() {
    if (!adminFirstName.trim()) { setError("Please enter the administrator's first name"); return; }
    if (!adminLastName.trim())  { setError("Please enter the administrator's last name"); return; }
    if (!phone || phone.replace(/\D/g, "").length < 7) {
      setError("Please enter a valid phone number");
      return;
    }
    if (!adminEmail.trim() || !adminEmail.includes("@")) {
      setError("Please enter a valid business email address");
      return;
    }
    if (!adminTitle.trim()) { setError("Please enter the administrator's job title"); return; }
    setError("");
    setStep(3);
  }

  function goToStep4() {
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match - please re-enter"); return; }
    if (!phoneVerified || !emailVerified) {
      setError("Please verify both the phone number and email address to continue");
      return;
    }
    setError("");
    setStep(4);
  }

  const setRegistrationData = useAuthStore((s) => s.setRegistrationData);

  async function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!acceptTos) { setError("You must accept the Terms of Use to proceed"); return; }
    if (!acceptPp)  { setError("You must accept the Privacy Policy to proceed"); return; }
    if (!acceptEsa) { setError("You must accept the Enterprise Service Agreement to proceed"); return; }
    if (!acceptAhp) { setError("You must accept the Anti-Harassment Policy to proceed"); return; }
    setError("");
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    // Save registration data for onboarding wizard
    setRegistrationData({
      companyName: orgName,
      countryOfIncorporation: incorporationCountry,
      adminEmail: adminEmail,
    });

    router.push("/enterprise/onboarding");
  }

  const passwordStrength = getPasswordStrength(password);

  return {
    step, setStep, error, setError, isLoading,

    orgName, setOrgName,
    orgType, setOrgType,
    orgTypeOther, setOrgTypeOther,
    industry, setIndustry,
    industryOther, setIndustryOther,
    companySize, setCompanySize,
    website, setWebsite,
    hqCountry, setHqCountry,
    hqCity, setHqCity,

    adminFirstName, setAdminFirstName,
    adminLastName, setAdminLastName,
    adminTitle, setAdminTitle,
    adminEmail, setAdminEmail,
    adminDept, setAdminDept,
    phoneCountry, setPhoneCountry,
    phone, setPhone,

    password, setPassword,
    confirm, setConfirm,
    passwordStrength,
    otpSent,
    otp, setOtp,
    cooldown,
    phoneVerified,
    phoneOtpLoading,
    emailOtpSent,
    emailOtp, setEmailOtp,
    emailCooldown,
    emailVerified,
    emailOtpLoading,
    sendOTP, verifyOTP, sendEmailOTP, verifyEmailOTP,

    incorporationCountry, setIncorporationCountry,
    incorporationFile, setIncorporationFile,
    incorporationDrag, setIncorporationDrag,
    acceptTos, setAcceptTos,
    acceptPp, setAcceptPp,
    acceptEsa, setAcceptEsa,
    acceptAhp, setAcceptAhp,
    marketingOptIn, setMarketingOptIn,

    goToStep2, goToStep3, goToStep4, handleFinalSubmit,
  };
}

export type EnterpriseRegistrationState = ReturnType<typeof useEnterpriseRegistration>;
