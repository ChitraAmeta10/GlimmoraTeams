"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Settings,
  Bot,
  Plug,
  ChevronRight,
  Globe,
  DollarSign,
  Clock,
  Calendar,
  Building2,
  Users,
  Upload,
  Palette,
  Shield,
  Database,
  Save,
  ImageIcon,
  Mail,
  Phone,
  Briefcase,
  Loader2,
  AlertTriangle,
  Info,
  UserCog,
} from "lucide-react";
import { CreateReviewerUserDialog } from "@/components/enterprise/create-reviewer-user-dialog";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, scaleIn } from "@/lib/utils/motion-variants";
import { toast } from "@/lib/stores/toast-store";
import {
  Badge,
  Button,
  Input,
  Label,
  Switch,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui";

/* ── Org details mock ── */
const orgDefaults = {
  companyName: "TechVista Solutions",
  industry: "information-technology",
  companySize: "500-1000",
  primaryContact: "Priya Nair",
  contactEmail: "priya@techvista.com",
  contactPhone: "+91 98765 43210",
  logoUrl: "",
};

/* ── Platform settings mock ── */
const platformDefaults = {
  defaultCurrency: "USD",
  timezone: "Asia/Karachi",
  dateFormat: "MMM DD, YYYY",
};

/* ── Industry options ── */
const industryOptions = [
  { value: "information-technology", label: "Information Technology" },
  { value: "financial-services", label: "Financial Services" },
  { value: "healthcare", label: "Healthcare" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "retail-ecommerce", label: "Retail & E-Commerce" },
  { value: "education", label: "Education" },
  { value: "consulting", label: "Consulting & Professional Services" },
  { value: "media-entertainment", label: "Media & Entertainment" },
  { value: "government", label: "Government & Public Sector" },
  { value: "other", label: "Other" },
];

/* ── Company size options ── */
const companySizeOptions = [
  { value: "1-50", label: "1–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "500-1000", label: "500–1,000 employees" },
  { value: "1001-5000", label: "1,001–5,000 employees" },
  { value: "5000+", label: "5,000+ employees" },
];

/* ── Navigation sub-page card ── */
function ConfigNavCard({
  href,
  icon: Icon,
  title,
  description,
  gradient,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <Link href={href} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-500 focus-visible:ring-offset-2 rounded-2xl">
      <motion.div
        variants={scaleIn}
        className="group relative rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 hover:shadow-lg hover:shadow-brown-100/20 transition-all cursor-pointer hover:-translate-y-0.5"
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-sm shrink-0",
              gradient
            )}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-semibold text-brown-800 group-hover:text-brown-900 transition-colors">
              {title}
            </h3>
            <p className="text-[11px] text-beige-500 mt-1 leading-relaxed">
              {description}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-beige-300 group-hover:text-brown-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
        </div>
      </motion.div>
    </Link>
  );
}

/* ── Setting row with proper label-input pairing ── */
function SettingInputRow({
  id,
  label,
  value,
  icon: Icon,
  readOnly = false,
  type = "text",
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  icon: React.ElementType;
  readOnly?: boolean;
  type?: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-beige-100 last:border-0">
      <Icon className="w-4 h-4 text-beige-400 shrink-0" aria-hidden="true" />
      <Label htmlFor={id} className="text-[12px] text-beige-500 font-medium w-36 shrink-0">
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        type={type}
        className="h-9 text-[12px] bg-beige-50/60 max-w-[280px]"
      />
    </div>
  );
}

/* ── Data retention toggle row with confirmation ── */
function RetentionRow({
  title,
  description,
  duration,
  enabled,
}: {
  title: string;
  description: string;
  duration: string;
  enabled: boolean;
}) {
  const [on, setOn] = React.useState(enabled);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const handleToggle = (checked: boolean) => {
    if (!checked && on) {
      // Turning OFF — requires confirmation
      setConfirmOpen(true);
    } else {
      setOn(checked);
      toast.success("Retention Updated", `${title} retention ${checked ? "enabled" : "disabled"}.`);
    }
  };

  const confirmDisable = () => {
    setOn(false);
    setConfirmOpen(false);
    toast.success("Retention Disabled", `${title} retention has been turned off. Data will be purged after the retention period.`);
  };

  return (
    <>
      <div className="flex items-center gap-4 py-3.5 px-4 rounded-xl border border-beige-100 hover:bg-beige-50/40 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-semibold text-brown-800">{title}</p>
            <Badge variant="beige" size="sm">{duration}</Badge>
          </div>
          <p className="text-[11px] text-beige-500 mt-0.5">{description}</p>
        </div>
        <Switch checked={on} onCheckedChange={handleToggle} />
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-brown-900">
              <AlertTriangle className="w-5 h-5 text-gold-500" />
              Disable {title} Retention?
            </DialogTitle>
            <DialogDescription>
              Turning off retention for <strong>{title}</strong> means data older
              than <strong>{duration}</strong> will be permanently purged. This may
              affect compliance with GDPR and local regulations. This action cannot
              be undone once purging begins.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">Cancel</Button>
            </DialogClose>
            <Button variant="danger" size="sm" onClick={confirmDisable}>
              <AlertTriangle className="w-3.5 h-3.5" />
              Confirm Disable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ═══════════════════════════════════
   GENERAL ORG SETTINGS PAGE
   ═══════════════════════════════════ */
export default function GeneralSettingsPage() {
  const prefersReducedMotion = useReducedMotion();

  // Form state
  const [companyName, setCompanyName] = React.useState(orgDefaults.companyName);
  const [industry, setIndustry] = React.useState(orgDefaults.industry);
  const [companySize, setCompanySize] = React.useState(orgDefaults.companySize);
  const [primaryContact, setPrimaryContact] = React.useState(orgDefaults.primaryContact);
  const [contactEmail, setContactEmail] = React.useState(orgDefaults.contactEmail);
  const [contactPhone, setContactPhone] = React.useState(orgDefaults.contactPhone);
  const [currency, setCurrency] = React.useState(platformDefaults.defaultCurrency);
  const [timezone, setTimezone] = React.useState(platformDefaults.timezone);
  const [dateFormat, setDateFormat] = React.useState(platformDefaults.dateFormat);
  const [portalName, setPortalName] = React.useState("TechVista Delivery Portal");
  const [saving, setSaving] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);

  // File input refs
  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const faviconInputRef = React.useRef<HTMLInputElement>(null);

  // Track changes
  const markDirty = React.useCallback(() => { if (!dirty) setDirty(true); }, [dirty]);

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success("Logo Uploaded", "Company logo updated successfully.");
      markDirty();
    }
    e.target.value = "";
  };

  const handleFaviconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success("Favicon Uploaded", "Favicon updated successfully.");
      markDirty();
    }
    e.target.value = "";
  };

  const handleSave = () => {
    // Basic validation
    if (!companyName.trim()) {
      toast.error("Validation Error", "Company name is required.");
      return;
    }
    if (!contactEmail.trim() || !contactEmail.includes("@")) {
      toast.error("Validation Error", "Please enter a valid contact email address.");
      return;
    }
    if (!contactPhone.trim()) {
      toast.error("Validation Error", "Contact phone number is required.");
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setDirty(false);
      toast.success("Settings Saved", "Organization settings updated successfully.");
    }, 600);
  };

  // Animation variants — skip initial on client-side nav
  const animProps = prefersReducedMotion
    ? {}
    : { variants: stagger, initial: "hidden", animate: "show" };

  const childAnim = prefersReducedMotion ? {} : { variants: fadeUp };

  return (
    <TooltipProvider>
      <motion.div
        {...animProps}
        className="max-w-[1200px] mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div
          {...childAnim}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brown-500 to-brown-600 flex items-center justify-center shadow-md shadow-brown-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em] font-heading">
                General Settings
              </h1>
              <p className="text-[13px] text-beige-500 mt-1">
                Organization details, platform preferences, data retention, and branding.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {dirty && (
              <span className="text-[11px] text-gold-600 font-medium">Unsaved changes</span>
            )}
            <Button
              variant="gradient-primary"
              size="sm"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </motion.div>

        <motion.div
          {...childAnim}
          className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-500 to-teal-600 flex items-center justify-center shadow-md shrink-0">
              <UserCog className="w-5 h-5 text-white" aria-hidden />
            </div>
            <div className="min-w-0">
              <h2 className="text-[14px] font-semibold text-brown-800">Platform reviewers</h2>
              <p className="text-[12px] text-beige-500 mt-1 max-w-xl leading-relaxed">
                Provision reviewer accounts via the API. Sign in at{" "}
                <Link href="/auth/login" className="text-teal-600 hover:text-teal-700 font-medium">
                  /auth/login
                </Link>{" "}
                first so your access token is stored, then create a user — the one-time temporary password appears in the dialog only once.
              </p>
            </div>
          </div>
          <CreateReviewerUserDialog
            trigger={
              <Button variant="gradient-primary" size="sm" className="shrink-0 w-full sm:w-auto">
                <UserCog className="w-3.5 h-3.5" />
                Create reviewer user
              </Button>
            }
          />
        </motion.div>

        {/* Quick Nav to sub-pages */}
        <motion.div {...childAnim}>
          <p className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider mb-3">
            More Organization Settings
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ConfigNavCard
              href="/enterprise/admin/config/apg"
              icon={Shield}
              title="Policies"
              description="SLA templates, pricing rules, governance thresholds, stage gates"
              gradient="from-forest-400 to-forest-600"
            />
            <ConfigNavCard
              href="/enterprise/admin/config/integrations"
              icon={Plug}
              title="Integrations"
              description="SSO/Identity, HRIS, ERP, LMS, webhooks"
              gradient="from-teal-400 to-teal-600"
            />
            <ConfigNavCard
              href="/enterprise/admin/config/notifications"
              icon={Bot}
              title="Notifications"
              description="Email, Slack, in-app, and webhook notification rules"
              gradient="from-gold-400 to-gold-600"
            />
          </div>
        </motion.div>

        {/* Organization Details */}
        <motion.div
          {...childAnim}
          className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Building2 className="w-4 h-4 text-brown-500" />
            <h3 className="text-[14px] font-semibold text-brown-800">Organization Details</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Logo placeholder */}
            <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-beige-200 bg-beige-50/40">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brown-100 to-beige-200 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-brown-400" />
              </div>
              <input
                type="file"
                accept="image/svg+xml,image/png,image/jpeg"
                className="hidden"
                ref={logoInputRef}
                onChange={handleLogoSelect}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => logoInputRef.current?.click()}
              >
                <Upload className="w-3 h-3" />
                Upload Logo
              </Button>
              <p className="text-[10px] text-beige-400 text-center">SVG, PNG, or JPG. Max 2MB.</p>
            </div>

            {/* Company details */}
            <div className="lg:col-span-2">
              <div className="space-y-0">
                <SettingInputRow
                  id="company-name"
                  label="Company Name"
                  value={companyName}
                  icon={Building2}
                  onChange={(v) => { setCompanyName(v); markDirty(); }}
                />

                {/* Industry — Select dropdown */}
                <div className="flex items-center gap-3 py-3 border-b border-beige-100">
                  <Briefcase className="w-4 h-4 text-beige-400 shrink-0" aria-hidden="true" />
                  <Label htmlFor="industry" className="text-[12px] text-beige-500 font-medium w-36 shrink-0">Industry</Label>
                  <Select value={industry} onValueChange={(v) => { setIndustry(v); markDirty(); }}>
                    <SelectTrigger id="industry" className="h-9 text-[12px] bg-beige-50/60 max-w-[280px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {industryOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Company Size — Select dropdown */}
                <div className="flex items-center gap-3 py-3 border-b border-beige-100">
                  <Users className="w-4 h-4 text-beige-400 shrink-0" aria-hidden="true" />
                  <Label htmlFor="company-size" className="text-[12px] text-beige-500 font-medium w-36 shrink-0">Company Size</Label>
                  <Select value={companySize} onValueChange={(v) => { setCompanySize(v); markDirty(); }}>
                    <SelectTrigger id="company-size" className="h-9 text-[12px] bg-beige-50/60 max-w-[280px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {companySizeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <SettingInputRow
                  id="primary-contact"
                  label="Primary Contact"
                  value={primaryContact}
                  icon={Users}
                  onChange={(v) => { setPrimaryContact(v); markDirty(); }}
                />
                <SettingInputRow
                  id="contact-email"
                  label="Contact Email"
                  value={contactEmail}
                  icon={Mail}
                  type="email"
                  onChange={(v) => { setContactEmail(v); markDirty(); }}
                />
                <SettingInputRow
                  id="contact-phone"
                  label="Contact Phone"
                  value={contactPhone}
                  icon={Phone}
                  type="tel"
                  onChange={(v) => { setContactPhone(v); markDirty(); }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Platform Settings + Branding */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Platform Settings */}
          <motion.div
            {...childAnim}
            className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Globe className="w-4 h-4 text-teal-500" />
              <h3 className="text-[14px] font-semibold text-brown-800">Platform Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-[12px] text-brown-700 flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-beige-400" />
                  Default Currency
                </Label>
                <Select value={currency} onValueChange={(v) => { setCurrency(v); markDirty(); }}>
                  <SelectTrigger id="currency" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="PKR">PKR (₨)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-[12px] text-brown-700 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-beige-400" />
                  Timezone
                </Label>
                <Select value={timezone} onValueChange={(v) => { setTimezone(v); markDirty(); }}>
                  <SelectTrigger id="timezone" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Karachi">Asia/Karachi (UTC+5)</SelectItem>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    <SelectItem value="Asia/Dubai">Asia/Dubai (UTC+4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format" className="text-[12px] text-brown-700 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-beige-400" />
                  Date Format
                </Label>
                <Select value={dateFormat} onValueChange={(v) => { setDateFormat(v); markDirty(); }}>
                  <SelectTrigger id="date-format" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MMM DD, YYYY">MMM DD, YYYY (Mar 06, 2026)</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (06/03/2026)</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (03/06/2026)</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2026-03-06)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Branding Customization */}
          <motion.div
            {...childAnim}
            className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Palette className="w-4 h-4 text-gold-500" />
              <h3 className="text-[14px] font-semibold text-brown-800">Branding</h3>
            </div>

            <div className="space-y-4">
              {/* Brand colors preview */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-[12px] text-brown-700">Brand Colors</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-beige-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-[200px]">
                        Brand colors are set by the platform theme. Contact support to customize your organization&apos;s color palette.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Primary", color: "bg-brown-500", hex: "#A67763" },
                    { name: "Secondary", color: "bg-forest-500", hex: "#4D5741" },
                    { name: "Accent", color: "bg-teal-500", hex: "#5B9BA2" },
                    { name: "Warning", color: "bg-gold-500", hex: "#D0B060" },
                    { name: "Surface", color: "bg-beige-100", hex: "#C9B09D" },
                  ].map((c) => (
                    <div key={c.name} className="flex flex-col items-center gap-1.5">
                      <div className={cn("w-10 h-10 rounded-xl border border-beige-200/60", c.color)} />
                      <span className="text-[9px] font-medium text-beige-500">{c.name}</span>
                      <span className="text-[8px] font-mono text-beige-400">{c.hex}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom portal title */}
              <div className="space-y-2">
                <Label htmlFor="portal-name" className="text-[12px] text-brown-700">Portal Display Name</Label>
                <Input
                  id="portal-name"
                  value={portalName}
                  onChange={(e) => { setPortalName(e.target.value); markDirty(); }}
                  className="h-9 text-[12px]"
                />
              </div>

              {/* Favicon upload */}
              <div className="space-y-2">
                <Label className="text-[12px] text-brown-700">Favicon</Label>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-beige-200 bg-beige-50/40">
                  <div className="w-8 h-8 rounded-lg bg-brown-100 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-brown-400" />
                  </div>
                  <input
                    type="file"
                    accept="image/png,image/x-icon"
                    className="hidden"
                    ref={faviconInputRef}
                    onChange={handleFaviconSelect}
                  />
                  <button
                    onClick={() => faviconInputRef.current?.click()}
                    className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded"
                  >
                    Upload favicon (32×32 px)
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Data Retention Policies */}
        <motion.div
          {...childAnim}
          className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Database className="w-4 h-4 text-forest-500" />
            <h3 className="text-[14px] font-semibold text-brown-800">Data Retention Policies</h3>
            <Badge variant="forest" size="sm">GDPR Compliant</Badge>
          </div>

          <p className="text-[11px] text-beige-500 mb-4 leading-relaxed">
            Configure how long different categories of data are retained. Policies comply with GDPR and local regulations.
            Disabling a category will schedule permanent deletion after its retention window expires.
          </p>

          <div className="space-y-3">
            <RetentionRow
              title="Project Data"
              description="Completed project deliverables, evidence files, and task history"
              duration="7 years"
              enabled={true}
            />
            <RetentionRow
              title="Audit Logs"
              description="User actions, system events, and compliance audit trail"
              duration="5 years"
              enabled={true}
            />
            <RetentionRow
              title="User Sessions"
              description="Login history, session tokens, and access patterns"
              duration="90 days"
              enabled={true}
            />
            <RetentionRow
              title="Analytics Data"
              description="Aggregated performance metrics and trend data"
              duration="3 years"
              enabled={true}
            />
            <RetentionRow
              title="Draft SOWs"
              description="Unpublished statement of work documents and parsing artifacts"
              duration="1 year"
              enabled={false}
            />
          </div>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
}
