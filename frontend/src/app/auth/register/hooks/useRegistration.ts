"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES_DATA } from "../data";
import { getPasswordStrength, getAgeFromDob } from "../helpers";
import type { RegistrationRole, ContributorType, SSOData } from "../types";

export function useRegistration(ssoData?: SSOData | null) {
  const router = useRouter();

  const [isSsoUser] = useState(() => !!ssoData);
  const [ssoProvider] = useState(() => ssoData?.provider ?? null);

  const [registrationRole, setRegistrationRole] = useState<RegistrationRole>("");
  const [step, setStep]                         = useState(1);
  const [error, setError]                       = useState("");
  const [isLoading, setIsLoading]               = useState(false);
  const [previewOpen, setPreviewOpen]           = useState(false);

  const [firstName,   setFirstName]   = useState(ssoData?.firstName ?? "");
  const [lastName,    setLastName]    = useState(ssoData?.lastName ?? "");
  const [email,       setEmail]       = useState(ssoData?.email ?? "");
  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [showPw,      setShowPw]      = useState(false);
  const [showCon,     setShowCon]     = useState(false);
  const [contribType, setContribType] = useState<ContributorType>("");
  const [country,     setCountry]     = useState("");

  const [dob,                 setDob]                 = useState("");
  const [timezone,            setTimezone]            = useState("");
  const [departmentCategory,  setDepartmentCategory]  = useState("");
  const [departmentOther,     setDepartmentOther]     = useState("");
  const [availability,        setAvailability]        = useState("");
  const [degree,              setDegree]              = useState("");
  const [branch,              setBranch]              = useState("");
  const [linkedin,            setLinkedin]            = useState("");
  const [mentorAck,           setMentorAck]           = useState(false);
  const [primarySkills,       setPrimarySkills]       = useState<string[]>([]);
  const [skillInput,          setSkillInput]          = useState("");
  const [secondarySkills,     setSecondarySkills]     = useState<string[]>([]);
  const [secondarySkillInput, setSecondarySkillInput] = useState("");
  const [otherSkills,         setOtherSkills]         = useState<string[]>([]);
  const [otherSkillInput,     setOtherSkillInput]     = useState("");
  const [workStart,           setWorkStart]           = useState("");
  const [workEnd,             setWorkEnd]             = useState("");
  const [careerStage,         setCareerStage]         = useState("");
  const [yearsExperience,     setYearsExperience]     = useState("");

  const [phoneCountry,      setPhoneCountry]      = useState("India");
  const [phone,             setPhone]             = useState("");
  const [otpSent,           setOtpSent]           = useState(false);
  const [otp,               setOtp]               = useState("");
  const [cooldown,          setCooldown]          = useState(0);
  const [phoneVerified,     setPhoneVerified]     = useState(false);
  const [phoneOtpLoading,   setPhoneOtpLoading]   = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [emailOtpSent,      setEmailOtpSent]      = useState(false);
  const [emailOtp,          setEmailOtp]          = useState("");
  const [emailCooldown,     setEmailCooldown]     = useState(0);
  const [emailVerified,     setEmailVerified]     = useState(false);
  const [emailOtpLoading,   setEmailOtpLoading]   = useState(false);

  const [ndaAccepted,     setNdaAccepted]     = useState(false);
  const [ndaSignature,    setNdaSignature]    = useState("");

  const [resumeFile,      setResumeFile]      = useState<File | null>(null);
  const [resumeDrag,      setResumeDrag]      = useState(false);
  const [acceptTos,       setAcceptTos]       = useState(false);
  const [acceptCoc,       setAcceptCoc]       = useState(false);
  const [acceptPrivacy,   setAcceptPrivacy]   = useState(false);
  const [acceptFee,       setAcceptFee]       = useState(false);
  const [acceptAhp,       setAcceptAhp]       = useState(false);
  const [marketingOptIn,  setMarketingOptIn]  = useState(false);

  useEffect(() => {
    if (email && !verificationEmail) setVerificationEmail(email);
  }, [email, verificationEmail]);

  useEffect(() => {
    if (step !== 3 || !country) return;
    const match = COUNTRIES_DATA.find(c => c.name === country);
    if (match) {
      setPhoneCountry(match.name);
      setPhone(prev => (prev.startsWith(match.code) ? prev : match.code + " "));
    }
  }, [step, country]);

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

  const addPrimarySkill = (skill: string) => {
    if (primarySkills.length < 20) setPrimarySkills(prev => [...prev, skill]);
    setSkillInput("");
  };
  const removePrimarySkill = (skill: string) => setPrimarySkills(prev => prev.filter(item => item !== skill));

  const addSecondarySkill = (skill: string) => {
    if (secondarySkills.length < 20) setSecondarySkills(prev => [...prev, skill]);
    setSecondarySkillInput("");
  };
  const removeSecondarySkill = (skill: string) => setSecondarySkills(prev => prev.filter(item => item !== skill));

  const addOtherSkill = (skill: string) => {
    if (otherSkills.length < 20) setOtherSkills(prev => [...prev, skill]);
    setOtherSkillInput("");
  };
  const removeOtherSkill = (skill: string) => setOtherSkills(prev => prev.filter(item => item !== skill));

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
    if (!verificationEmail) {
      setError("Please enter a valid email address");
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
    if (!firstName.trim())    { setError("Please enter your first name"); return; }
    if (!lastName.trim())     { setError("Please enter your last name"); return; }
    if (!email)               { setError("Please enter a valid email address"); return; }
    if (!isSsoUser) {
      if (password.length < 8)  { setError("Password must be at least 8 characters with a number and mixed case"); return; }
      if (password !== confirm) { setError("Passwords do not match - please re-enter"); return; }
    }
    if (!contribType)         { setError("Please select your contributor type"); return; }
    if (!country)             { setError("Please select your country of residence"); return; }
    setError("");
    setStep(2);
  }

  function goToStep3() {
    if (!dob) { setError("Please enter your date of birth"); return; }
    if (getAgeFromDob(dob) < 18) { setError("You must be 18 or older to register"); return; }
    if (!timezone)           { setError("Please select your working time zone"); return; }
    if (!departmentCategory) { setError("Please select your department category"); return; }
    if (departmentCategory === "other" && !departmentOther.trim()) {
      setError("Please specify your department name");
      return;
    }
    if (primarySkills.length < 1) { setError("Please add at least one primary skill"); return; }
    if (!availability) { setError("Please enter your weekly availability (hours)"); return; }
    if (!mentorAck) { setError("Please acknowledge the Reviewer / Mentor requirement to proceed"); return; }
    setError("");
    setStep(3);
  }

  function goToStep4() {
    if (!ndaAccepted || !ndaSignature.trim()) {
      setError("You must read, sign, and accept the NDA & Disclosure Agreement to continue");
      return;
    }
    if (!phoneVerified || !emailVerified) {
      setError("Please verify both your phone number and email address to continue");
      return;
    }
    setError("");
    setStep(4);
  }

  async function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!acceptTos) { setError("You must accept the Terms of Use to proceed"); return; }
    if (!acceptCoc) { setError("You must accept the Code of Conduct to proceed"); return; }
    if (!acceptPrivacy) { setError("You must accept the Privacy Policy to proceed"); return; }
    if (!acceptAhp) { setError("You must accept the Anti-Harassment Policy to proceed"); return; }
    if (!acceptFee) { setError("You must acknowledge the platform service fee to proceed"); return; }
    setError("");
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.push("/contributor/dashboard");
  }

  const passwordStrength = getPasswordStrength(password);

  return {
    isSsoUser, ssoProvider,
    registrationRole, setRegistrationRole,
    step, setStep,
    error, setError,
    isLoading,
    previewOpen, setPreviewOpen,

    firstName, setFirstName,
    lastName, setLastName,
    email, setEmail,
    password, setPassword,
    confirm, setConfirm,
    showPw, setShowPw,
    showCon, setShowCon,
    contribType, setContribType,
    country, setCountry,
    passwordStrength,

    dob, setDob,
    timezone, setTimezone,
    departmentCategory, setDepartmentCategory,
    departmentOther, setDepartmentOther,
    availability, setAvailability,
    degree, setDegree,
    branch, setBranch,
    linkedin, setLinkedin,
    mentorAck, setMentorAck,
    primarySkills, skillInput, setSkillInput, addPrimarySkill, removePrimarySkill,
    secondarySkills, secondarySkillInput, setSecondarySkillInput, addSecondarySkill, removeSecondarySkill,
    otherSkills, otherSkillInput, setOtherSkillInput, addOtherSkill, removeOtherSkill,
    workStart, setWorkStart,
    workEnd, setWorkEnd,
    careerStage, setCareerStage,
    yearsExperience, setYearsExperience,

    phoneCountry, setPhoneCountry,
    phone, setPhone,
    otpSent,
    otp, setOtp,
    cooldown,
    phoneVerified,
    phoneOtpLoading,
    verificationEmail, setVerificationEmail,
    emailOtpSent,
    emailOtp, setEmailOtp,
    emailCooldown,
    emailVerified,
    emailOtpLoading,
    sendOTP, verifyOTP, sendEmailOTP, verifyEmailOTP,

    ndaAccepted, setNdaAccepted,
    ndaSignature, setNdaSignature,

    resumeFile, setResumeFile,
    resumeDrag, setResumeDrag,
    acceptTos, setAcceptTos,
    acceptCoc, setAcceptCoc,
    acceptPrivacy, setAcceptPrivacy,
    acceptFee, setAcceptFee,
    acceptAhp, setAcceptAhp,
    marketingOptIn, setMarketingOptIn,

    goToStep2, goToStep3, goToStep4, handleFinalSubmit,
  };
}

export type RegistrationState = ReturnType<typeof useRegistration>;
