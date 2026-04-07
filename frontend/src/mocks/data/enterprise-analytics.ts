import type { AnalyticsDataset, ActivityEvent, AuditEntry, OrgUser, RoleDefinition, APGRule, NotificationRule } from "@/types/enterprise";

export const mockAnalytics: AnalyticsDataset[] = [
  {
    id: "delivery-performance",
    title: "Delivery Performance",
    metrics: [
      { label: "On-Time Delivery", value: 87, change: 4.2, changeType: "positive", unit: "%" },
      { label: "Avg Cycle Time", value: 14.2, change: -1.8, changeType: "positive", unit: "days" },
      { label: "First-Pass Acceptance", value: 78, change: 6.1, changeType: "positive", unit: "%" },
      { label: "Rework Rate", value: 12, change: -3.2, changeType: "positive", unit: "%" },
    ],
    timeSeries: [
      { date: "Jan", value: 82 }, { date: "Feb", value: 85 }, { date: "Mar", value: 87 },
      { date: "Apr", value: 84 }, { date: "May", value: 89 }, { date: "Jun", value: 91 },
    ],
  },
  {
    id: "quality-metrics",
    title: "Quality Metrics",
    metrics: [
      { label: "Acceptance Rate", value: 92, change: 3.5, changeType: "positive", unit: "%" },
      { label: "Defect Density", value: 0.8, change: -0.3, changeType: "positive", unit: "/KLOC" },
      { label: "Test Coverage", value: 94, change: 2.1, changeType: "positive", unit: "%" },
      { label: "Avg Review Score", value: 4.6, change: 0.2, changeType: "positive", unit: "/5" },
    ],
    timeSeries: [
      { date: "Jan", value: 88 }, { date: "Feb", value: 90 }, { date: "Mar", value: 92 },
      { date: "Apr", value: 91 }, { date: "May", value: 93 }, { date: "Jun", value: 94 },
    ],
  },
  {
    id: "team-performance",
    title: "Team Performance",
    metrics: [
      { label: "Active Contributors", value: 21, change: 5, changeType: "positive" },
      { label: "Avg Task Completion", value: 3.2, change: -0.5, changeType: "positive", unit: "days" },
      { label: "Team Utilization", value: 82, change: 1.8, changeType: "positive", unit: "%" },
      { label: "Skill Match Score", value: 91, change: 2.4, changeType: "positive", unit: "%" },
    ],
    timeSeries: [
      { date: "Jan", value: 16 }, { date: "Feb", value: 18 }, { date: "Mar", value: 21 },
      { date: "Apr", value: 20 }, { date: "May", value: 23 }, { date: "Jun", value: 25 },
    ],
  },
  {
    id: "cost-analytics",
    title: "Cost Analytics",
    metrics: [
      { label: "Budget Utilized", value: 68, change: 5.2, changeType: "neutral", unit: "%" },
      { label: "Cost per Task", value: 2340, change: -180, changeType: "positive", unit: "$" },
      { label: "ROI Index", value: 3.2, change: 0.4, changeType: "positive", unit: "x" },
      { label: "Forecast Accuracy", value: 91, change: 1.5, changeType: "positive", unit: "%" },
    ],
    timeSeries: [
      { date: "Jan", value: 45000 }, { date: "Feb", value: 82000 }, { date: "Mar", value: 165000 },
      { date: "Apr", value: 210000 }, { date: "May", value: 98000 }, { date: "Jun", value: 50700 },
    ],
  },
];

export const mockActivityFeed: ActivityEvent[] = [
  { id: "act-001", timestamp: "2026-03-06T10:30:00Z", actor: "Priya Nair", initials: "PN", action: "approved milestone", target: "Infrastructure & Auth", type: "milestone", color: "from-brown-400 to-brown-600" },
  { id: "act-002", timestamp: "2026-03-06T09:45:00Z", actor: "Contributor A-7X", initials: "A7", action: "submitted evidence for", target: "AP UI Components", type: "task", color: "from-teal-400 to-teal-600" },
  { id: "act-003", timestamp: "2026-03-06T09:15:00Z", actor: "APG System", initials: "AG", action: "flagged quality concern on", target: "Auth Service MFA", type: "escalation", color: "from-gold-400 to-gold-600" },
  { id: "act-004", timestamp: "2026-03-05T17:00:00Z", actor: "Contributor B-3K", initials: "B3", action: "completed rework on", target: "Database Schema v2", type: "task", color: "from-forest-400 to-forest-600" },
  { id: "act-005", timestamp: "2026-03-05T15:30:00Z", actor: "Finance Team", initials: "FT", action: "released escrow for", target: "Milestone 1 — $55,000", type: "payment", color: "from-brown-400 to-gold-500" },
  { id: "act-006", timestamp: "2026-03-05T14:00:00Z", actor: "Contributor D-2M", initials: "D2", action: "started working on", target: "General Ledger API", type: "task", color: "from-teal-500 to-forest-500" },
  { id: "act-007", timestamp: "2026-03-05T11:30:00Z", actor: "Mentor R-4H", initials: "R4", action: "reviewed and approved", target: "Monorepo Infrastructure", type: "review", color: "from-forest-500 to-teal-400" },
  { id: "act-008", timestamp: "2026-03-05T09:00:00Z", actor: "Priya Nair", initials: "PN", action: "uploaded new SOW", target: "Healthcare Patient Portal", type: "sow", color: "from-brown-400 to-brown-600" },
];

export const mockAuditLog: AuditEntry[] = [
  { id: "aud-001", timestamp: "2026-03-06T10:30:00Z", actor: "Priya Nair", actorRole: "Owner", action: "approved", resource: "Milestone: Infrastructure & Auth", resourceType: "project", details: "Approved milestone completion with 4 deliverables verified.", ipAddress: "203.0.113.42" },
  { id: "aud-002", timestamp: "2026-03-06T09:15:00Z", actor: "APG System", actorRole: "System", action: "escalated", resource: "Task: Auth Service MFA", resourceType: "project", details: "Quality threshold breach detected. Rework requested automatically.", ipAddress: "10.0.0.1" },
  { id: "aud-003", timestamp: "2026-03-05T17:00:00Z", actor: "Priya Nair", actorRole: "Owner", action: "approved", resource: "Escrow Release: $55,000", resourceType: "billing", details: "Released escrow funds for Milestone 1 completion.", ipAddress: "203.0.113.42" },
  { id: "aud-004", timestamp: "2026-03-05T14:20:00Z", actor: "Rahul Kumar", actorRole: "Admin", action: "updated", resource: "Team: ERP Delivery Squad", resourceType: "team", details: "Added Contributor G-1N to the team with part-time availability.", ipAddress: "198.51.100.15" },
  { id: "aud-005", timestamp: "2026-03-05T11:00:00Z", actor: "Priya Nair", actorRole: "Owner", action: "created", resource: "SOW: Healthcare Patient Portal", resourceType: "sow", details: "Uploaded SOW document (1.2 MB, 24 pages).", ipAddress: "203.0.113.42" },
  { id: "aud-006", timestamp: "2026-03-04T16:30:00Z", actor: "System", actorRole: "System", action: "completed", resource: "SOW Parsing: Supply Chain Analytics", resourceType: "sow", details: "AI parsing completed 7/15 sections. Confidence: 72%.", ipAddress: "10.0.0.1" },
  { id: "aud-007", timestamp: "2026-03-04T14:00:00Z", actor: "Priya Nair", actorRole: "Owner", action: "created", resource: "Plan: Supply Chain Analytics", resourceType: "plan", details: "Created draft decomposition plan with 18 initial tasks.", ipAddress: "203.0.113.42" },
  { id: "aud-008", timestamp: "2026-03-03T09:30:00Z", actor: "Rahul Kumar", actorRole: "Admin", action: "updated", resource: "APG Rule: Quality Threshold", resourceType: "config", details: "Changed minimum acceptance score from 80 to 85.", ipAddress: "198.51.100.15" },
];

export const mockOrgUsers: OrgUser[] = [
  { id: "user-001", name: "Priya Nair", email: "priya@enterprise.com", role: "owner", status: "active", joinedAt: "2025-08-15", lastActive: "2026-03-06T10:30:00Z", department: "Technology", projectsManaged: 4, actionsCount: 342 },
  { id: "user-002", name: "Rahul Kumar", email: "rahul@enterprise.com", role: "admin", status: "active", joinedAt: "2025-09-01", lastActive: "2026-03-06T09:15:00Z", department: "Engineering", projectsManaged: 2, actionsCount: 218 },
  { id: "user-003", name: "Aisha Khan", email: "aisha@enterprise.com", role: "manager", status: "active", joinedAt: "2025-10-20", lastActive: "2026-03-05T17:00:00Z", department: "Product", projectsManaged: 1, actionsCount: 156 },
  { id: "user-004", name: "Vikram Patel", email: "vikram@enterprise.com", role: "viewer", status: "active", joinedAt: "2025-11-10", lastActive: "2026-03-04T14:00:00Z", department: "Finance", projectsManaged: 0, actionsCount: 45 },
  { id: "user-005", name: "Sara Mahmood", email: "sara@enterprise.com", role: "manager", status: "invited", joinedAt: "2026-03-05", lastActive: "", department: "Operations", projectsManaged: 0, actionsCount: 0 },
  { id: "user-006", name: "James Wilson", email: "james@enterprise.com", role: "admin", status: "suspended", joinedAt: "2025-09-15", lastActive: "2026-02-20T11:00:00Z", department: "Security", projectsManaged: 1, actionsCount: 89 },
];

export const mockRoles: RoleDefinition[] = [
  { id: "role-001", name: "Owner", description: "Full platform access with billing and team management", permissions: ["sow:*", "project:*", "billing:*", "team:*", "admin:*", "analytics:*"], userCount: 1, isSystem: true },
  { id: "role-002", name: "Admin", description: "Administrative access excluding billing approvals", permissions: ["sow:*", "project:*", "billing:read", "team:*", "admin:users", "analytics:*"], userCount: 2, isSystem: true },
  { id: "role-003", name: "Manager", description: "Project and team management with limited admin", permissions: ["sow:read", "sow:edit", "project:*", "team:read", "analytics:read"], userCount: 2, isSystem: true },
  { id: "role-004", name: "Viewer", description: "Read-only access to projects and analytics", permissions: ["sow:read", "project:read", "analytics:read"], userCount: 1, isSystem: true },
  { id: "role-005", name: "Finance Lead", description: "Custom role for financial operations", permissions: ["billing:*", "project:read", "analytics:read", "analytics:cost"], userCount: 1, isSystem: false },
];

export const mockAPGRules: APGRule[] = [
  { id: "apg-001", name: "Quality Gate Threshold", description: "Minimum acceptance score for auto-approval", category: "quality", enabled: true, threshold: 85, action: "Flag for manual review if below threshold" },
  { id: "apg-002", name: "Timeline SLA Warning", description: "Alert when task exceeds estimated time by X%", category: "timeline", enabled: true, threshold: 120, action: "Send alert to project manager and contributor" },
  { id: "apg-003", name: "Budget Overrun Alert", description: "Alert when project spending exceeds X% of budget", category: "budget", enabled: true, threshold: 90, action: "Notify owner and freeze non-critical tasks" },
  { id: "apg-004", name: "Auto-Escalation", description: "Escalate to admin after X failed reviews", category: "escalation", enabled: true, threshold: 3, action: "Create escalation ticket and notify admin" },
  { id: "apg-005", name: "Response Time SLA", description: "Maximum hours before review must begin", category: "sla", enabled: true, threshold: 48, action: "Reassign to backup reviewer and alert manager" },
  { id: "apg-006", name: "Rework Limit", description: "Maximum rework cycles before escalation", category: "quality", enabled: false, threshold: 2, action: "Escalate to mentor for mediation" },
];

export const mockNotificationRules: NotificationRule[] = [
  { id: "notif-001", event: "New deliverable submitted", channels: ["email", "in_app"], enabled: true, recipients: ["Managers", "Reviewers"] },
  { id: "notif-002", event: "Milestone completed", channels: ["email", "in_app", "slack"], enabled: true, recipients: ["Owner", "Admins", "Finance"] },
  { id: "notif-003", event: "Escalation raised", channels: ["email", "in_app", "slack"], enabled: true, recipients: ["Owner", "Admins"] },
  { id: "notif-004", event: "Payment released", channels: ["email"], enabled: true, recipients: ["Owner", "Finance"] },
  { id: "notif-005", event: "SOW parsing complete", channels: ["in_app"], enabled: true, recipients: ["Owner", "Managers"] },
  { id: "notif-006", event: "Team formation ready", channels: ["email", "in_app"], enabled: false, recipients: ["Owner", "Managers"] },
];
