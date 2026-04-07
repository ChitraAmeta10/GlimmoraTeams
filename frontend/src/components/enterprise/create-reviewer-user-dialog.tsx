"use client";

import * as React from "react";
import { Check, Copy, Loader2, Mail, UserPlus } from "lucide-react";
import { toast } from "@/lib/stores/toast-store";
import {
  createReviewerUser,
  type CreateReviewerResult,
  type ReviewerLifecycleStatus,
} from "@/lib/api/users-admin";
import { getStoredAccessToken } from "@/lib/api/config";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui";

export function CreateReviewerUserDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<"form" | "credentials">("form");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [jobRole, setJobRole] = React.useState("");
  const [designation, setDesignation] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [language, setLanguage] = React.useState("en");
  const [timeZone, setTimeZone] = React.useState("Asia/Kolkata");
  const [lifecycleStatus, setLifecycleStatus] = React.useState<ReviewerLifecycleStatus>("INVITED");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [created, setCreated] = React.useState<CreateReviewerResult | null>(null);
  const [copiedPw, setCopiedPw] = React.useState(false);
  const [copiedAll, setCopiedAll] = React.useState(false);

  const reset = () => {
    setStep("form");
    setFirstName("");
    setLastName("");
    setEmail("");
    setJobRole("");
    setDesignation("");
    setDepartment("");
    setUsername("");
    setLanguage("en");
    setTimeZone("Asia/Kolkata");
    setLifecycleStatus("INVITED");
    setError("");
    setCreated(null);
    setCopiedPw(false);
    setCopiedAll(false);
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) reset();
  };

  const handleSubmit = async () => {
    const missing =
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !jobRole.trim() ||
      !designation.trim() ||
      !department.trim() ||
      !username.trim();
    if (missing) {
      setError("Fill all required fields (including role, designation, department, username).");
      return;
    }
    const token = getStoredAccessToken();
    if (!token) {
      toast.error("Not signed in", "Sign in as a platform admin and try again.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const data = await createReviewerUser(token, {
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: jobRole.trim(),
        designation: designation.trim(),
        department: department.trim(),
        username: username.trim().toLowerCase(),
        language,
        timeZone,
        status: lifecycleStatus,
      });
      setCreated(data);
      setStep("credentials");
      toast.success("Reviewer created", "Copy the temporary password before closing this dialog.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create user.");
    } finally {
      setSaving(false);
    }
  };

  const copyPassword = async () => {
    if (!created?.temporary_password) return;
    try {
      await navigator.clipboard.writeText(created.temporary_password);
      setCopiedPw(true);
      setTimeout(() => setCopiedPw(false), 2000);
    } catch {
      toast.error("Copy failed", "Copy the password manually.");
    }
  };

  const copyLoginBlock = async () => {
    if (!created) return;
    const text = [
      `Login email: ${created.email}`,
      `Username: ${created.username}`,
      `Temporary password: ${created.temporary_password}`,
      `User ID: ${created.id}`,
      `Job title: ${created.jobTitle}`,
      `Designation: ${created.designation}`,
      `Department: ${created.department}`,
      `System role: ${created.role}`,
      `Account status: ${created.status}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      toast.error("Copy failed", "Copy the fields manually.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-brown-900 font-heading">
            {step === "form" ? "Create reviewer user" : "Save these credentials"}
          </DialogTitle>
          <DialogDescription className="text-beige-500">
            {step === "form"
              ? "Creates a platform reviewer with FSD profile fields. The temporary password appears only on the next screen — copy it before you close."
              : "This temporary password is not stored in plain text and cannot be shown again. Share it securely with the reviewer."}
          </DialogDescription>
        </DialogHeader>

        {step === "form" ? (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="rev-fn" className="text-[12px] text-brown-700">
                  First name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="rev-fn"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (error) { setError(""); }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rev-ln" className="text-[12px] text-brown-700">
                  Last name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="rev-ln"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (error) { setError(""); }
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rev-email" className="text-[12px] text-brown-700">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="rev-email"
                type="email"
                placeholder="user@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) { setError(""); }
                }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="rev-role" className="text-[12px] text-brown-700">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="rev-role"
                  placeholder="e.g. Manager"
                  value={jobRole}
                  onChange={(e) => {
                    setJobRole(e.target.value);
                    if (error) { setError(""); }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rev-des" className="text-[12px] text-brown-700">
                  Designation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="rev-des"
                  placeholder="e.g. Senior Reviewer"
                  value={designation}
                  onChange={(e) => {
                    setDesignation(e.target.value);
                    if (error) { setError(""); }
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rev-dept" className="text-[12px] text-brown-700">
                Department <span className="text-red-500">*</span>
              </Label>
              <Input
                id="rev-dept"
                placeholder="e.g. Engineering"
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  if (error) { setError(""); }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rev-user" className="text-[12px] text-brown-700">
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="rev-user"
                placeholder="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) { setError(""); }
                }}
              />
              <p className="text-[10px] text-beige-500">Stored lowercase; sign-in still uses email + password.</p>
            </div>
            <div className="space-y-2">
              <Label className="text-[12px] text-brown-700">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={lifecycleStatus}
                onValueChange={(v) => setLifecycleStatus(v as ReviewerLifecycleStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INVITED">INVITED (pending onboarding)</SelectItem>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="EXPIRED">EXPIRED (cannot sign in)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-beige-500">
                EXPIRED sets the account inactive for login. Default for new invites is INVITED.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-[12px] text-brown-700">
                  Language <span className="text-red-500">*</span>
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="en-IN">English (India)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] text-brown-700">
                  Time zone <span className="text-red-500">*</span>
                </Label>
                <Select value={timeZone} onValueChange={setTimeZone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {error ? <p className="text-[11px] text-red-500 font-medium">{error}</p> : null}
          </div>
        ) : created ? (
          <div className="space-y-4 py-2">
            <div className="rounded-xl border border-gold-200 bg-gold-50/60 px-4 py-3 text-[12px] text-brown-800">
              <p className="font-semibold text-brown-900 mb-1">Temporary password (one-time display)</p>
              <div className="flex items-center gap-2 mt-2">
                <code className="flex-1 break-all rounded-md bg-white/80 px-2 py-1.5 text-[11px] font-mono border border-beige-200">
                  {created.temporary_password}
                </code>
                <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={copyPassword}>
                  {copiedPw ? <Check className="w-3.5 h-3.5 text-forest-600" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </div>
            <div className="grid gap-2 text-[12px] text-brown-700">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-beige-500 shrink-0" />
                <span className="text-beige-600">Sign-in email:</span>
                <span className="font-medium">{created.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserPlus className="w-3.5 h-3.5 text-beige-500 shrink-0" />
                <span className="text-beige-600">Username:</span>
                <span className="font-mono text-[11px]">{created.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserPlus className="w-3.5 h-3.5 text-beige-500 shrink-0" />
                <span className="text-beige-600">User ID:</span>
                <span className="font-mono text-[11px] break-all">{created.id}</span>
              </div>
              <p className="text-[11px] text-beige-600 pt-1">
                {created.jobTitle} · {created.designation} · {created.department} · {created.language} · {created.timeZone}{" "}
                · status {created.status} · system role {created.role}
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" className="w-full" onClick={copyLoginBlock}>
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-forest-600" /> Copied profile + credentials
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy all to clipboard
                </>
              )}
            </Button>
          </div>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-0">
          {step === "form" ? (
            <>
              <Button type="button" variant="outline" size="sm" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="button" variant="gradient-primary" size="sm" onClick={handleSubmit} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating…
                  </>
                ) : (
                  "Create & invite"
                )}
              </Button>
            </>
          ) : (
            <Button type="button" variant="gradient-primary" size="sm" className="w-full sm:w-auto" onClick={() => handleOpenChange(false)}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
