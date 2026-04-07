"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles, Eye, EyeOff, AlertCircle, CheckCircle, RefreshCw, ArrowRight, X,
} from "lucide-react";
import {
  GlassCard, GlassCardContent, Button, Input, Label, Checkbox, Badge,
} from "@/components/ui";

function getStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8)          s++;
  if (pw.length >= 12)         s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { score: s, label: "Weak",   color: "bg-red-400" };
  if (s <= 3) return { score: s, label: "Fair",   color: "bg-gold-400" };
  return             { score: s, label: "Strong", color: "bg-teal-500" };
}

const SKILL_OPTIONS = [
  "Data Analysis", "Content Writing", "Software Development", "UX/UI Design",
  "Project Management", "Research", "Machine Learning", "Quality Assurance",
  "Business Analysis", "Copywriting", "Translation", "Legal Review",
  "Financial Analysis", "Marketing Strategy", "Technical Writing", "Video Production",
];

const MOCK_INVITE = {
  email:   "alex.kumar@example.com",
  project: "GWIP Platform v2",
  tenant:  "GlimmoraTeam",
  admin:   "Platform Administrator",
};

export default function ReviewerRegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  const [jobTitle, setJobTitle]     = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone]           = useState("");
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [showCon, setShowCon]       = useState(false);
  const [expertise, setExpertise]   = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [acceptTos, setAcceptTos]   = useState(false);
  const [acceptPp, setAcceptPp]     = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState("");

  const strength  = getStrength(password);
  const filtered  = SKILL_OPTIONS.filter(
    s => s.toLowerCase().includes(skillInput.toLowerCase()) && !expertise.includes(s)
  );

  const addSkill = (skill: string) => {
    if (expertise.length >= 10) return;
    setExpertise(prev => [...prev, skill]);
    setSkillInput("");
  };
  const removeSkill = (skill: string) => setExpertise(prev => prev.filter(s => s !== skill));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim())    { setError("Please enter a valid first name"); return; }
    if (!lastName.trim())     { setError("Please enter a valid last name"); return; }
    if (!jobTitle.trim())     { setError("Please enter your job title"); return; }
    if (expertise.length < 1) { setError("Please select at least one area of expertise"); return; }
    if (password.length < 12) { setError("Password must be at least 12 characters"); return; }
    if (password !== confirm)  { setError("Passwords do not match"); return; }
    if (!acceptTos)            { setError("You must accept the Terms of Use to continue"); return; }
    if (!acceptPp)             { setError("You must accept the Privacy Policy to continue"); return; }

    setError("");
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsLoading(false);
    router.push("/auth/mfa-setup?redirect=/mentor/dashboard");
  };

  return (
    <div className="w-full max-w-lg">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-700 shadow-xl shadow-forest-500/20 mb-4">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-heading text-2xl font-semibold text-brown-950">Complete Registration</h1>
        <p className="text-sm text-beige-600 mt-1">Reviewer account - {MOCK_INVITE.project}</p>
      </div>

      {/* Invite info */}
      <div className="mb-5 p-4 rounded-xl bg-forest-50 border border-forest-200 flex items-center gap-3">
        <Badge variant="forest">Reviewer</Badge>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-brown-800">
            Invited by <strong>{MOCK_INVITE.admin}</strong> for <strong>{MOCK_INVITE.project}</strong>
          </p>
          <p className="text-xs text-beige-600 truncate">{MOCK_INVITE.email}</p>
        </div>
      </div>

      <GlassCard variant="heavy" padding="lg">
        <GlassCardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter first name" value={firstName}
                  onChange={e => setFirstName(e.target.value)} maxLength={50} autoFocus />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter last name" value={lastName}
                  onChange={e => setLastName(e.target.value)} maxLength={50} />
              </div>
            </div>

            {/* Email readonly */}
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input value={MOCK_INVITE.email} readOnly className="bg-beige-50 text-beige-600 cursor-not-allowed" />
            </div>

            {/* Job title + department */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title <span className="text-red-400">*</span></Label>
                <Input id="jobTitle" placeholder="Enter your job title" value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)} maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dept">Department</Label>
                <Input id="dept" placeholder="Department or function" value={department}
                  onChange={e => setDepartment(e.target.value)} maxLength={100} />
              </div>
            </div>

            {/* Areas of Expertise (Reviewer-specific) */}
            <div className="space-y-2">
              <Label>
                Areas of Expertise <span className="text-red-400">*</span>
                <span className="text-xs text-beige-400 ml-1">({expertise.length}/10)</span>
              </Label>

              {/* Selected tags */}
              {expertise.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {expertise.map(skill => (
                    <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-forest-100 border border-forest-200 text-xs font-medium text-forest-800">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="text-forest-500 hover:text-forest-700">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Skill input with autocomplete */}
              <div className="relative">
                <Input
                  placeholder="Type to search skills"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  disabled={expertise.length >= 10}
                />
                {skillInput && filtered.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-beige-200 rounded-xl shadow-lg overflow-hidden">
                    {filtered.slice(0, 6).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => addSkill(s)}
                        className="w-full text-left px-4 py-2.5 text-sm text-brown-800 hover:bg-brown-50 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-beige-500">Select 1-10 areas used for project matching</p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number <span className="text-beige-400 text-xs">(optional)</span></Label>
              <Input id="phone" type="tel" placeholder="Work phone with country code" value={phone}
                onChange={e => setPhone(e.target.value)} />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password <span className="text-beige-400 text-xs">(min 8 chars)</span></Label>
              <div className="relative">
                <Input id="password" type={showPw ? "text" : "password"}
                  placeholder="Minimum 8 characters" value={password}
                  onChange={e => setPassword(e.target.value)} className="pr-10" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-beige-400 hover:text-beige-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i<=strength.score?strength.color:"bg-beige-200"}`} />
                  ))}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <div className="relative">
                <Input id="confirm" type={showCon ? "text" : "password"}
                  placeholder="Re-enter password to confirm" value={confirm}
                  onChange={e => setConfirm(e.target.value)} className="pr-10" />
                <button type="button" onClick={() => setShowCon(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-beige-400 hover:text-beige-600">
                  {showCon ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3">
                <Checkbox id="tos" checked={acceptTos} onCheckedChange={v => setAcceptTos(!!v)} className="mt-0.5" />
                <label htmlFor="tos" className="text-sm text-beige-600 cursor-pointer">
                  I agree to the <Link href="#" className="text-teal-600 hover:underline">Terms of Use</Link>
                </label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox id="pp" checked={acceptPp} onCheckedChange={v => setAcceptPp(!!v)} className="mt-0.5" />
                <label htmlFor="pp" className="text-sm text-beige-600 cursor-pointer">
                  I agree to the <Link href="#" className="text-teal-600 hover:underline">Privacy Policy</Link>
                </label>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" variant="secondary" size="lg" className="w-full"
              disabled={isLoading || !acceptTos || !acceptPp}>
              {isLoading ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Creating account…</>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>

            <div className="flex items-center gap-2 text-xs text-beige-500 justify-center">
              <CheckCircle className="w-3 h-3 text-teal-500" />
              <span>Next step: Set up two-factor authentication (mandatory)</span>
            </div>
          </form>
        </GlassCardContent>
      </GlassCard>
    </div>
  );
}
