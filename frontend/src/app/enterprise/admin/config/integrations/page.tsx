"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plug,
  KeyRound,
  Users,
  Building2,
  GraduationCap,
  Webhook,
  Clock,
  ExternalLink,
  Copy,
  CheckCircle2,
  Plus,
  Shield,
  AlertCircle,
  Pencil,
  Trash2,
  Zap,
  Unplug,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/stores/toast-store";
import {
  Badge, Switch, Button, Input,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui";

/* ── Integration data (H4) ── */
interface IntegrationConfig {
  id: string;
  name: string;
  category: "sso" | "hris" | "erp" | "lms" | "webhook";
  description: string;
  icon: React.ElementType;
  gradient: string;
  status: "connected" | "not_configured" | "error";
  provider?: string;
  lastSynced?: string;
}

/* ── Per-category configure messages ── */
const configureMessages: Record<string, { title: string; description: string }> = {
  sso: { title: "Configure SSO", description: "Opening SAML 2.0 / OIDC identity provider setup wizard..." },
  hris: { title: "Configure HRIS", description: "Opening HR system connector — select BambooHR, Workday, or SAP SuccessFactors..." },
  erp: { title: "Configure ERP", description: "Opening ERP/Finance connector — select SAP, Oracle, or NetSuite..." },
  lms: { title: "Configure LMS", description: "Opening Learning Management System connector — select Cornerstone, Docebo, or custom API..." },
};

const integrations: IntegrationConfig[] = [
  {
    id: "int-sso",
    name: "SSO / Identity Provider",
    category: "sso",
    description: "SAML 2.0 or OIDC-based single sign-on. Supports Azure AD, Okta, Google Workspace, and custom providers.",
    icon: KeyRound,
    gradient: "from-brown-400 to-brown-600",
    status: "connected",
    provider: "Azure AD (SAML 2.0)",
    lastSynced: "2 min ago",
  },
  {
    id: "int-hris",
    name: "HRIS Integration",
    category: "hris",
    description: "Sync employee data, org charts, and department structures from your HR system. Supports BambooHR, Workday, SAP SuccessFactors.",
    icon: Users,
    gradient: "from-teal-400 to-teal-600",
    status: "connected",
    provider: "BambooHR",
    lastSynced: "1 hour ago",
  },
  {
    id: "int-erp",
    name: "ERP / Finance System",
    category: "erp",
    description: "Connect your ERP for automated invoice reconciliation, budget tracking, and financial reporting. Supports SAP, Oracle, NetSuite.",
    icon: Building2,
    gradient: "from-gold-400 to-gold-600",
    status: "not_configured",
  },
  {
    id: "int-lms",
    name: "Learning Management System",
    category: "lms",
    description: "Sync skill certifications and training completions. Supports Cornerstone, Docebo, and custom LMS via API.",
    icon: GraduationCap,
    gradient: "from-forest-400 to-forest-600",
    status: "not_configured",
  },
  {
    id: "int-webhook",
    name: "Webhooks",
    category: "webhook",
    description: "Configure outbound webhook endpoints for real-time event notifications. Supports milestone completion, payment release, escalation events.",
    icon: Webhook,
    gradient: "from-teal-500 to-forest-500",
    status: "connected",
    provider: "3 endpoints active",
    lastSynced: "Just now",
  },
];

/* ── Webhook endpoints ── */
interface WebhookEndpoint {
  id: string;
  url: string;
  event: string;
  status: "active" | "inactive";
  lastTriggered?: string;
}

const initialWebhookEndpoints: WebhookEndpoint[] = [
  { id: "wh-1", url: "https://api.acme.com/hooks/glimmora-delivery", event: "milestone.completed", status: "active", lastTriggered: "12 min ago" },
  { id: "wh-2", url: "https://hooks.internal.net/sow-events", event: "sow.status_changed", status: "active", lastTriggered: "1 hour ago" },
  { id: "wh-3", url: "https://staging.example.io/webhooks/alerts", event: "escalation.triggered", status: "inactive" },
];

/* ── Available webhook event types ── */
const webhookEventTypes = [
  "milestone.completed",
  "sow.status_changed",
  "escalation.triggered",
  "payment.released",
  "task.submitted",
  "review.completed",
];

/* ── Status config ── */
const statusConfig = {
  connected: { variant: "forest" as const, label: "Connected", icon: CheckCircle2 },
  not_configured: { variant: "beige" as const, label: "Not Configured", icon: AlertCircle },
  error: { variant: "danger" as const, label: "Error", icon: AlertCircle },
};

/* ── Integration card ── */
function IntegrationCard({ integration }: { integration: IntegrationConfig }) {
  const [connected, setConnected] = React.useState(integration.status === "connected");
  const Icon = integration.icon;
  const currentStatus = connected ? "connected" : "not_configured";
  const sConfig = statusConfig[currentStatus];
  const msg = configureMessages[integration.category];

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white/70 backdrop-blur-sm p-5 transition-all hover:shadow-lg",
        connected
          ? "border-beige-200/50 hover:shadow-brown-100/15"
          : "border-beige-200/30"
      )}
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-md shrink-0",
            integration.gradient
          )}
        >
          <Icon className="w-5.5 h-5.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[15px] font-semibold text-brown-800">{integration.name}</h3>
          </div>
          <p className="text-[11px] text-beige-500 leading-relaxed">
            {integration.description}
          </p>
        </div>
      </div>

      {/* Status + Provider */}
      <div className="flex items-center justify-between pt-3 border-t border-beige-100">
        <div className="flex items-center gap-3">
          <Badge variant={sConfig.variant} size="sm" dot>
            {sConfig.label}
          </Badge>
          {connected && integration.provider && (
            <span className="text-[10px] font-medium text-beige-600">
              {integration.provider}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {connected && (
            <Button
              variant="ghost"
              size="sm"
              className="text-beige-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => {
                setConnected(false);
                toast.info(`${integration.name} Disconnected`, "Integration has been disconnected. You can reconnect at any time.");
              }}
            >
              <Unplug className="w-3 h-3" />
              Disconnect
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!connected) {
                setConnected(true);
                toast.success(msg.title, msg.description);
              } else {
                toast.info(msg.title, msg.description);
              }
            }}
          >
            {connected ? "Configure" : "Connect"}
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Last synced */}
      {connected && integration.lastSynced && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-beige-100">
          <Clock className="w-3 h-3 text-beige-400" />
          <span className="text-[10px] text-beige-500">Last synced: {integration.lastSynced}</span>
        </div>
      )}
    </div>
  );
}

/* ── Webhook row ── */
function WebhookRow({
  endpoint,
  onToggle,
  onDelete,
  onEdit,
}: {
  endpoint: WebhookEndpoint;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (endpoint: WebhookEndpoint) => void;
}) {
  const [copied, setCopied] = React.useState(false);
  const [testing, setTesting] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(endpoint.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTest = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      toast.success("Test Successful", "Webhook responded with 200 OK.");
    }, 1500);
  };

  return (
    <div className="flex items-center gap-4 py-3 border-b border-beige-100 last:border-0">
      <Switch
        checked={endpoint.status === "active"}
        onCheckedChange={() => onToggle(endpoint.id)}
        aria-label={`Toggle ${endpoint.event}`}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge
            variant={endpoint.status === "active" ? "forest" : "beige"}
            size="sm"
            dot
          >
            {endpoint.status === "active" ? "Active" : "Inactive"}
          </Badge>
          <span className="text-[10px] font-semibold text-beige-500 uppercase tracking-wider">
            {endpoint.event}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <code className="text-[11px] text-brown-700 font-mono truncate block">
            {endpoint.url}
          </code>
          <button
            onClick={handleCopy}
            className="shrink-0 text-beige-400 hover:text-teal-600 transition-colors"
            aria-label="Copy URL"
          >
            {copied ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-forest-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
      {endpoint.lastTriggered && (
        <div className="flex items-center gap-1 shrink-0">
          <Clock className="w-3 h-3 text-beige-400" />
          <span className="text-[10px] text-beige-500">{endpoint.lastTriggered}</span>
        </div>
      )}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleTest}
          disabled={testing}
          aria-label="Test webhook"
        >
          {testing ? (
            <span className="w-3 h-3 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Zap className="w-3 h-3" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onEdit(endpoint)}
          aria-label="Edit endpoint"
        >
          <Pencil className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-beige-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => onDelete(endpoint.id)}
          aria-label="Delete endpoint"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   INTEGRATIONS PAGE (H4)
   ═══════════════════════════════════ */
export default function IntegrationsPage() {
  const connectedCount = integrations.filter((i) => i.status === "connected").length;
  const [endpoints, setEndpoints] = React.useState<WebhookEndpoint[]>(initialWebhookEndpoints);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newUrl, setNewUrl] = React.useState("");
  const [newEvent, setNewEvent] = React.useState(webhookEventTypes[0]);
  const [addError, setAddError] = React.useState("");

  /* Edit endpoint dialog state */
  const [editEndpointOpen, setEditEndpointOpen] = React.useState(false);
  const [editEndpointTarget, setEditEndpointTarget] = React.useState<WebhookEndpoint | null>(null);
  const [editUrl, setEditUrl] = React.useState("");
  const [editUrlError, setEditUrlError] = React.useState("");

  const handleOpenEdit = (ep: WebhookEndpoint) => {
    setEditEndpointTarget(ep);
    setEditUrl(ep.url);
    setEditUrlError("");
    setEditEndpointOpen(true);
  };

  const handleSaveEdit = () => {
    setEditUrlError("");
    if (!editUrl.trim()) {
      setEditUrlError("Webhook URL is required.");
      return;
    }
    try {
      new URL(editUrl);
    } catch {
      setEditUrlError("Please enter a valid URL.");
      return;
    }
    if (editEndpointTarget) {
      setEndpoints((prev) =>
        prev.map((e) => (e.id === editEndpointTarget.id ? { ...e, url: editUrl.trim() } : e))
      );
      toast.success("Endpoint Updated", `Updated ${editEndpointTarget.event} webhook URL.`);
    }
    setEditEndpointOpen(false);
    setEditEndpointTarget(null);
  };

  const handleToggleEndpoint = (id: string) => {
    const ep = endpoints.find((e) => e.id === id);
    if (!ep) return;
    const newStatus = ep.status === "active" ? "inactive" : "active";
    setEndpoints((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
    toast.info(
      `Webhook ${newStatus === "active" ? "Enabled" : "Disabled"}`,
      `${ep.event} endpoint is now ${newStatus}.`
    );
  };

  const handleDeleteEndpoint = (id: string) => {
    const ep = endpoints.find((e) => e.id === id);
    setEndpoints((prev) => prev.filter((e) => e.id !== id));
    toast.success("Endpoint Deleted", `Removed ${ep?.event ?? "webhook"} endpoint.`);
  };

  const handleAddEndpoint = () => {
    setAddError("");
    if (!newUrl.trim()) {
      setAddError("Webhook URL is required.");
      return;
    }
    try {
      new URL(newUrl);
    } catch {
      setAddError("Please enter a valid URL (e.g. https://api.example.com/hooks).");
      return;
    }
    const newEndpoint: WebhookEndpoint = {
      id: `wh-${Date.now()}`,
      url: newUrl.trim(),
      event: newEvent,
      status: "active",
    };
    setEndpoints((prev) => [...prev, newEndpoint]);
    toast.success("Endpoint Added", `New ${newEvent} webhook endpoint created and active.`);
    setNewUrl("");
    setNewEvent(webhookEventTypes[0]);
    setShowAddForm(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Back link */}
      <div className="animate-fade-up">
        <Link
          href="/enterprise/admin/config"
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to General
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 animate-fade-up">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-teal-400 to-teal-600 shadow-sm shrink-0">
            <Plug className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em] font-heading">
              Integrations
            </h1>
            <p className="text-[13px] text-beige-500 mt-1">
              Connect SSO/Identity, HRIS, ERP, LMS, and Webhook services.
            </p>
          </div>
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex items-center gap-4 px-5 py-3 rounded-xl border border-beige-200/50 bg-white/60 backdrop-blur-sm animate-fade-up [animation-delay:100ms]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-forest-500" />
          <span className="text-[12px] text-beige-600">
            <span className="font-semibold text-brown-800">{connectedCount}</span> connected
          </span>
        </div>
        <div className="w-px h-4 bg-beige-200" />
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-beige-400" />
          <span className="text-[12px] text-beige-600">
            <span className="font-semibold text-brown-800">{integrations.length - connectedCount}</span> not configured
          </span>
        </div>
        <div className="w-px h-4 bg-beige-200" />
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-teal-500" />
          <span className="text-[12px] text-beige-600">
            <span className="font-semibold text-brown-800">{integrations.length}</span> total integrations
          </span>
        </div>
      </div>

      {/* Integration cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-up [animation-delay:150ms]">
        {integrations
          .filter((i) => i.category !== "webhook")
          .map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
      </div>

      {/* Webhook Section */}
      {(() => {
        const webhookIntegration = integrations.find((i) => i.category === "webhook")!;
        return (
          <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6 animate-fade-up [animation-delay:200ms]">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-sm", webhookIntegration.gradient)}>
                  <Webhook className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-brown-800">
                      {webhookIntegration.name}
                    </h3>
                    <Badge variant={endpoints.length > 0 ? "forest" : "beige"} size="sm" dot>
                      {endpoints.length > 0 ? "Connected" : "No Endpoints"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-beige-500 mt-0.5">
                    Outbound webhook URLs that receive event payloads.
                  </p>
                </div>
              </div>
              <Button
                variant="gradient-primary"
                size="sm"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus className="w-3 h-3" />
                Add Endpoint
              </Button>
            </div>

            {/* Add endpoint form */}
            {showAddForm && (
              <div className="mb-4 p-4 rounded-xl border-2 border-dashed border-brown-200 bg-gradient-to-br from-brown-50/40 to-white/80 space-y-3 animate-fade-up">
                <p className="text-[12px] font-semibold text-brown-800">New Webhook Endpoint</p>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-brown-700 uppercase tracking-wider mb-1 block">
                      Webhook URL
                    </label>
                    <Input
                      placeholder="https://api.example.com/hooks/glimmora"
                      value={newUrl}
                      onChange={(e) => { setNewUrl(e.target.value); setAddError(""); }}
                      error={addError || undefined}
                    />
                    {addError && (
                      <p className="text-[10px] text-red-500 mt-1">{addError}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-brown-700 uppercase tracking-wider mb-1 block">
                      Event Type
                    </label>
                    <select
                      value={newEvent}
                      onChange={(e) => setNewEvent(e.target.value)}
                      className="h-9 w-full rounded-xl border border-beige-200 bg-white/80 px-3 text-[12px] text-brown-800 focus:outline-none focus:ring-2 focus:ring-brown-200/30 focus:border-brown-200/50"
                    >
                      {webhookEventTypes.map((evt) => (
                        <option key={evt} value={evt}>{evt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button variant="gradient-primary" size="sm" onClick={handleAddEndpoint}>
                    <Save className="w-3 h-3" />
                    Save Endpoint
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setShowAddForm(false); setNewUrl(""); setAddError(""); }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="mb-3">
              <Badge variant="beige" size="sm">{endpoints.length} configured</Badge>
            </div>

            {endpoints.length === 0 ? (
              <div className="py-8 text-center">
                <Webhook className="w-8 h-8 text-beige-300 mx-auto mb-2" />
                <p className="text-[12px] text-beige-500">No webhook endpoints configured.</p>
                <p className="text-[11px] text-beige-400 mt-1">Click &quot;Add Endpoint&quot; to create one.</p>
              </div>
            ) : (
              <div>
                {endpoints.map((endpoint) => (
                  <WebhookRow
                    key={endpoint.id}
                    endpoint={endpoint}
                    onToggle={handleToggleEndpoint}
                    onDelete={handleDeleteEndpoint}
                    onEdit={handleOpenEdit}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Edit Endpoint Dialog */}
      <Dialog open={editEndpointOpen} onOpenChange={setEditEndpointOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Endpoint</DialogTitle>
            <DialogDescription>
              Update the webhook URL for this endpoint.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-semibold text-brown-700 uppercase tracking-wider mb-1 block">
                Event Type
              </label>
              <div className="h-9 flex items-center px-3 rounded-xl border border-beige-200 bg-beige-50/60 text-[12px] text-beige-600 font-mono">
                {editEndpointTarget?.event}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-brown-700 uppercase tracking-wider mb-1 block">
                Webhook URL
              </label>
              <Input
                placeholder="https://api.example.com/hooks"
                value={editUrl}
                onChange={(e) => { setEditUrl(e.target.value); setEditUrlError(""); }}
                error={editUrlError || undefined}
              />
              {editUrlError && (
                <p className="text-[10px] text-red-500 mt-1">{editUrlError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditEndpointOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient-primary" size="sm" onClick={handleSaveEdit}>
              <Save className="w-3 h-3" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
