import type {
  DecompositionPlan,
  DecompositionTask,
  PlanMilestone,
  Subtask,
  SkillTag,
  TaskDependency,
  AIRecommendation,
  PlanValidationResult,
  PlanVersion,
  TeamPool,
  TeamMember,
  Assignment,
  Project,
  Milestone,
  Deliverable,
} from "@/types/enterprise";

/* ── Helpers ── */
const skill = (name: string, source: "ai" | "manual" = "ai", confidence = 0.9): SkillTag => ({
  name, source, confidence,
});
const dep = (targetId: string, type: "blocks" | "related" = "blocks"): TaskDependency => ({
  targetId, type,
});

/* ══════════════════════════════════════════════════════════════
   DECOMPOSITION PLANS — 4 plans with full metadata
   ══════════════════════════════════════════════════════════════ */
export const mockPlans: DecompositionPlan[] = [
  {
    id: "plan-001",
    sowId: "sow-001",
    title: "ERP Platform Decomposition",
    status: "in_progress",
    createdAt: "2026-02-16T08:00:00Z",
    updatedAt: "2026-03-02T10:00:00Z",
    totalTasks: 10,
    totalSubtasks: 18,
    totalMilestones: 4,
    estimatedHours: 3360,
    estimatedCost: 285000,
    complexity: "high",
    version: 2,
    teamId: "team-001",
    projectId: "proj-001",
    aiConfidence: 87,
    criticalPathDuration: 2100,
    uniqueSkills: 13,
    dependencyCount: 14,
  },
  {
    id: "plan-002",
    sowId: "sow-002",
    title: "Mobile Banking Decomposition",
    status: "approved",
    createdAt: "2026-02-22T09:00:00Z",
    updatedAt: "2026-02-26T15:00:00Z",
    totalTasks: 8,
    totalSubtasks: 12,
    totalMilestones: 3,
    estimatedHours: 2240,
    estimatedCost: 180000,
    complexity: "medium",
    version: 1,
    teamId: "team-002",
    projectId: "proj-002",
    aiConfidence: 92,
    criticalPathDuration: 1400,
    uniqueSkills: 9,
    dependencyCount: 8,
  },
  {
    id: "plan-003",
    sowId: "sow-005",
    title: "E-Commerce Migration Decomposition",
    status: "completed",
    createdAt: "2025-11-15T10:00:00Z",
    updatedAt: "2026-01-10T12:00:00Z",
    totalTasks: 14,
    totalSubtasks: 24,
    totalMilestones: 5,
    estimatedHours: 4480,
    estimatedCost: 520000,
    complexity: "critical",
    version: 3,
    teamId: "team-003",
    projectId: "proj-003",
    aiConfidence: 81,
    criticalPathDuration: 3200,
    uniqueSkills: 16,
    dependencyCount: 22,
  },
  {
    id: "plan-004",
    sowId: "sow-003",
    title: "Supply Chain Analytics Decomposition",
    status: "draft",
    createdAt: "2026-03-04T14:00:00Z",
    updatedAt: "2026-03-04T14:00:00Z",
    totalTasks: 6,
    totalSubtasks: 10,
    totalMilestones: 3,
    estimatedHours: 1440,
    estimatedCost: 340000,
    complexity: "high",
    version: 1,
    aiConfidence: 74,
    criticalPathDuration: 960,
    uniqueSkills: 8,
    dependencyCount: 6,
  },
  {
    id: "plan-005",
    sowId: "sow-004",
    title: "Healthcare Portal Decomposition",
    status: "pending_review",
    createdAt: "2026-03-01T11:00:00Z",
    updatedAt: "2026-03-07T16:30:00Z",
    totalTasks: 9,
    totalSubtasks: 15,
    totalMilestones: 4,
    estimatedHours: 2800,
    estimatedCost: 245000,
    complexity: "high",
    version: 1,
    aiConfidence: 83,
    criticalPathDuration: 1800,
    uniqueSkills: 11,
    dependencyCount: 10,
  },
];

/* ══════════════════════════════════════════════════════════════
   PLAN MILESTONES — Three-level: Milestones → Tasks → Subtasks
   ══════════════════════════════════════════════════════════════ */
export const mockPlanMilestones: PlanMilestone[] = [
  { id: "pm-001", planId: "plan-001", title: "Infrastructure & Auth Foundation", description: "Core platform setup, authentication, and database layer", order: 1, estimatedHours: 320, taskCount: 4, subtaskCount: 6, itemStatus: "accepted", aiConfidence: 94 },
  { id: "pm-002", planId: "plan-001", title: "Finance Module Core", description: "General ledger, accounts payable, and payroll integration", order: 2, estimatedHours: 540, taskCount: 3, subtaskCount: 6, itemStatus: "accepted", aiConfidence: 88 },
  { id: "pm-003", planId: "plan-001", title: "HR & Workforce Management", description: "Employee records, org chart, and payroll processing", order: 3, estimatedHours: 240, taskCount: 2, subtaskCount: 4, itemStatus: "proposed", aiConfidence: 85 },
  { id: "pm-004", planId: "plan-001", title: "Reporting & QA", description: "Dynamic reporting engine, integration tests, and load testing", order: 4, estimatedHours: 260, taskCount: 2, subtaskCount: 4, itemStatus: "proposed", aiConfidence: 82 },

  /* ── Plan-002: Mobile Banking ── */
  { id: "pm-005", planId: "plan-002", title: "Core Banking APIs", description: "Account management, payment processing, and notification services", order: 1, estimatedHours: 800, taskCount: 3, subtaskCount: 4, itemStatus: "accepted", aiConfidence: 93 },
  { id: "pm-006", planId: "plan-002", title: "Mobile UI & UX", description: "App shell, transaction screens, and biometric authentication", order: 2, estimatedHours: 720, taskCount: 3, subtaskCount: 5, itemStatus: "accepted", aiConfidence: 91 },
  { id: "pm-007", planId: "plan-002", title: "Security & Compliance", description: "PCI-DSS compliance audit and penetration testing", order: 3, estimatedHours: 720, taskCount: 2, subtaskCount: 3, itemStatus: "accepted", aiConfidence: 90 },

  /* ── Plan-003: E-Commerce Migration ── */
  { id: "pm-008", planId: "plan-003", title: "Data Migration", description: "Legacy data extraction, transformation, and loading into new schema", order: 1, estimatedHours: 1200, taskCount: 3, subtaskCount: 5, itemStatus: "accepted", aiConfidence: 84 },
  { id: "pm-009", planId: "plan-003", title: "Catalog & Product Engine", description: "Product catalog, search indexing, and inventory management", order: 2, estimatedHours: 960, taskCount: 3, subtaskCount: 5, itemStatus: "accepted", aiConfidence: 82 },
  { id: "pm-010", planId: "plan-003", title: "Order Management", description: "Order lifecycle, fulfillment workflows, and returns processing", order: 3, estimatedHours: 800, taskCount: 3, subtaskCount: 5, itemStatus: "accepted", aiConfidence: 80 },
  { id: "pm-011", planId: "plan-003", title: "Payment & Checkout", description: "Multi-provider payment integration and checkout optimization", order: 4, estimatedHours: 720, taskCount: 3, subtaskCount: 5, itemStatus: "accepted", aiConfidence: 79 },
  { id: "pm-012", planId: "plan-003", title: "Launch & QA", description: "End-to-end testing, performance optimization, and production launch", order: 5, estimatedHours: 800, taskCount: 2, subtaskCount: 4, itemStatus: "accepted", aiConfidence: 78 },

  /* ── Plan-004: Supply Chain Analytics ── */
  { id: "pm-013", planId: "plan-004", title: "Data Pipeline", description: "Ingestion, transformation, and warehousing for supply chain data", order: 1, estimatedHours: 560, taskCount: 2, subtaskCount: 4, itemStatus: "proposed", aiConfidence: 76 },
  { id: "pm-014", planId: "plan-004", title: "Analytics Engine", description: "ML-powered demand forecasting and anomaly detection", order: 2, estimatedHours: 480, taskCount: 2, subtaskCount: 3, itemStatus: "proposed", aiConfidence: 73 },
  { id: "pm-015", planId: "plan-004", title: "Dashboard & Visualization", description: "Interactive dashboards with real-time supply chain metrics", order: 3, estimatedHours: 400, taskCount: 2, subtaskCount: 3, itemStatus: "proposed", aiConfidence: 72 },
];

/* ══════════════════════════════════════════════════════════════
   DECOMPOSITION TASKS (for plan-001) — with subtasks, acceptance criteria, AI confidence
   ══════════════════════════════════════════════════════════════ */
export const mockTasks: DecompositionTask[] = [
  {
    id: "task-001", planId: "plan-001", milestoneId: "pm-001",
    title: "Setup monorepo infrastructure",
    description: "Initialize Turborepo with shared configs, ESLint, Prettier, TypeScript.",
    status: "accepted", priority: "critical", estimatedHours: 40,
    skillsRequired: [skill("DevOps"), skill("TypeScript")],
    dependencies: [],
    phase: 1, order: 1, aiConfidence: 96, itemStatus: "accepted",
    acceptanceCriteria: ["Turborepo workspace configured", "Shared ESLint + Prettier configs", "CI/CD pipeline with GitHub Actions", "All apps build successfully"],
    subtasks: [
      { id: "st-001", taskId: "task-001", title: "Configure Turborepo workspaces", estimatedHours: 8, skillsRequired: [skill("DevOps")], itemStatus: "accepted", aiConfidence: 98 },
      { id: "st-002", taskId: "task-001", title: "Setup shared TypeScript configs", estimatedHours: 4, skillsRequired: [skill("TypeScript")], itemStatus: "accepted", aiConfidence: 95 },
    ],
  },
  {
    id: "task-002", planId: "plan-001", milestoneId: "pm-001",
    title: "Auth service with Keycloak",
    description: "Implement OIDC auth with RBAC, MFA support, session management.",
    status: "accepted", priority: "critical", estimatedHours: 120,
    skillsRequired: [skill("Backend"), skill("Security")],
    dependencies: [dep("task-001")],
    phase: 1, order: 2, aiConfidence: 91, itemStatus: "accepted",
    acceptanceCriteria: ["OIDC authentication flow working", "RBAC with 4 role levels", "MFA via TOTP and SMS", "Session management with refresh tokens"],
    subtasks: [
      { id: "st-003", taskId: "task-002", title: "Keycloak realm configuration", estimatedHours: 16, skillsRequired: [skill("Backend")], itemStatus: "accepted", aiConfidence: 93 },
      { id: "st-004", taskId: "task-002", title: "RBAC middleware implementation", estimatedHours: 24, skillsRequired: [skill("Backend"), skill("Security")], itemStatus: "accepted", aiConfidence: 90 },
    ],
  },
  {
    id: "task-003", planId: "plan-001", milestoneId: "pm-001",
    title: "Database schema design",
    description: "PostgreSQL schema for all 5 modules with migration scripts.",
    status: "in_review", priority: "high", estimatedHours: 80,
    skillsRequired: [skill("Database"), skill("Architecture")],
    dependencies: [dep("task-001")],
    phase: 1, order: 3, aiConfidence: 88, itemStatus: "accepted",
    acceptanceCriteria: ["Schema for all 5 modules designed", "Migration scripts generated", "Seed data for dev environment", "ERD documentation complete"],
    subtasks: [
      { id: "st-005", taskId: "task-003", title: "Design normalized schema", estimatedHours: 32, skillsRequired: [skill("Database")], itemStatus: "accepted", aiConfidence: 90 },
    ],
  },
  {
    id: "task-008", planId: "plan-001", milestoneId: "pm-001",
    title: "Frontend design system",
    description: "Component library, theme tokens, accessibility compliance.",
    status: "accepted", priority: "high", estimatedHours: 80,
    skillsRequired: [skill("Frontend"), skill("Design")],
    dependencies: [dep("task-001")],
    phase: 1, order: 4, aiConfidence: 95, itemStatus: "accepted",
    acceptanceCriteria: ["25+ reusable components", "Tailwind theme tokens configured", "WCAG 2.1 AA compliance", "Storybook documentation"],
    subtasks: [
      { id: "st-006", taskId: "task-008", title: "Build core UI primitives", estimatedHours: 32, skillsRequired: [skill("Frontend")], itemStatus: "accepted", aiConfidence: 97 },
    ],
  },
  {
    id: "task-004", planId: "plan-001", milestoneId: "pm-002",
    title: "Finance module — General Ledger",
    description: "Chart of accounts, journal entries, trial balance, financial statements.",
    status: "in_progress", priority: "high", estimatedHours: 160,
    skillsRequired: [skill("Backend"), skill("Finance")],
    dependencies: [dep("task-002"), dep("task-003")],
    phase: 2, order: 1, aiConfidence: 85, itemStatus: "accepted",
    acceptanceCriteria: ["Chart of accounts CRUD", "Double-entry journal posting", "Trial balance generation", "P&L and balance sheet reports"],
    subtasks: [
      { id: "st-007", taskId: "task-004", title: "Chart of accounts API", estimatedHours: 40, skillsRequired: [skill("Backend"), skill("Finance")], itemStatus: "accepted", aiConfidence: 87 },
      { id: "st-008", taskId: "task-004", title: "Journal entry engine", estimatedHours: 48, skillsRequired: [skill("Backend"), skill("Finance")], itemStatus: "proposed", aiConfidence: 83 },
    ],
  },
  {
    id: "task-005", planId: "plan-001", milestoneId: "pm-002",
    title: "Finance module — Accounts Payable",
    description: "Vendor management, invoice processing, payment scheduling.",
    status: "in_progress", priority: "high", estimatedHours: 120,
    skillsRequired: [skill("Backend"), skill("Finance")],
    dependencies: [dep("task-004")],
    phase: 2, order: 2, aiConfidence: 84, itemStatus: "accepted",
    acceptanceCriteria: ["Vendor CRUD with approval flow", "Invoice OCR processing", "Payment scheduling with reminders", "Three-way matching"],
    subtasks: [
      { id: "st-009", taskId: "task-005", title: "Vendor management API", estimatedHours: 24, skillsRequired: [skill("Backend")], itemStatus: "accepted", aiConfidence: 88 },
      { id: "st-010", taskId: "task-005", title: "Invoice processing pipeline", estimatedHours: 36, skillsRequired: [skill("Backend"), skill("Finance")], itemStatus: "proposed", aiConfidence: 80 },
    ],
  },
  {
    id: "task-007", planId: "plan-001", milestoneId: "pm-002",
    title: "HR module — Payroll integration",
    description: "Payroll calculation, tax withholding, direct deposit.",
    status: "backlog", priority: "medium", estimatedHours: 140,
    skillsRequired: [skill("Backend"), skill("Finance"), skill("HR")],
    dependencies: [dep("task-004"), dep("task-006", "related")],
    phase: 2, order: 3, aiConfidence: 79, itemStatus: "proposed",
    acceptanceCriteria: ["Payroll run engine", "Tax calculation service", "Direct deposit API integration", "Payslip PDF generation"],
    subtasks: [
      { id: "st-013", taskId: "task-007", title: "Payroll calculation engine", estimatedHours: 56, skillsRequired: [skill("Backend"), skill("Finance")], itemStatus: "proposed", aiConfidence: 78 },
      { id: "st-014", taskId: "task-007", title: "Tax withholding rules", estimatedHours: 32, skillsRequired: [skill("Finance"), skill("HR")], itemStatus: "proposed", aiConfidence: 76 },
    ],
  },
  {
    id: "task-006", planId: "plan-001", milestoneId: "pm-003",
    title: "HR module — Employee records",
    description: "Employee profiles, org chart, document management.",
    status: "backlog", priority: "medium", estimatedHours: 100,
    skillsRequired: [skill("Full-Stack"), skill("HR")],
    dependencies: [dep("task-002")],
    phase: 3, order: 1, aiConfidence: 86, itemStatus: "proposed",
    acceptanceCriteria: ["Employee CRUD with photo upload", "Org chart visualization", "Document management with versioning", "Employee search and filters"],
    subtasks: [
      { id: "st-011", taskId: "task-006", title: "Employee profile API", estimatedHours: 32, skillsRequired: [skill("Full-Stack")], itemStatus: "proposed", aiConfidence: 89 },
      { id: "st-012", taskId: "task-006", title: "Org chart component", estimatedHours: 24, skillsRequired: [skill("Full-Stack"), skill("HR")], itemStatus: "proposed", aiConfidence: 84 },
    ],
  },
  {
    id: "task-009", planId: "plan-001", milestoneId: "pm-004",
    title: "Reporting engine",
    description: "Dynamic report builder with PDF/CSV export, scheduled reports.",
    status: "backlog", priority: "medium", estimatedHours: 160,
    skillsRequired: [skill("Full-Stack"), skill("Data")],
    dependencies: [dep("task-004"), dep("task-006", "related")],
    phase: 4, order: 1, aiConfidence: 82, itemStatus: "proposed",
    acceptanceCriteria: ["Drag-and-drop report builder", "PDF and CSV export", "Scheduled report delivery", "Template library with 10+ presets"],
    subtasks: [
      { id: "st-015", taskId: "task-009", title: "Report builder UI", estimatedHours: 48, skillsRequired: [skill("Full-Stack")], itemStatus: "proposed", aiConfidence: 84 },
      { id: "st-016", taskId: "task-009", title: "Export engine (PDF/CSV)", estimatedHours: 32, skillsRequired: [skill("Full-Stack"), skill("Data")], itemStatus: "proposed", aiConfidence: 80 },
    ],
  },
  {
    id: "task-010", planId: "plan-001", milestoneId: "pm-004",
    title: "Integration testing suite",
    description: "E2E tests with Playwright, API contract tests, load testing.",
    status: "backlog", priority: "high", estimatedHours: 100,
    skillsRequired: [skill("QA"), skill("DevOps")],
    dependencies: [dep("task-004"), dep("task-005"), dep("task-006", "related")],
    phase: 4, order: 2, aiConfidence: 90, itemStatus: "proposed",
    acceptanceCriteria: ["50+ E2E test scenarios", "API contract test coverage >90%", "Load test benchmarks established", "CI/CD integration with test gates"],
    subtasks: [
      { id: "st-017", taskId: "task-010", title: "E2E test framework setup", estimatedHours: 16, skillsRequired: [skill("QA")], itemStatus: "proposed", aiConfidence: 93 },
      { id: "st-018", taskId: "task-010", title: "Critical path test scenarios", estimatedHours: 40, skillsRequired: [skill("QA"), skill("DevOps")], itemStatus: "proposed", aiConfidence: 88 },
    ],
  },

  /* ══════════════════════════════════════════════════════════════
     PLAN-002: Mobile Banking — 8 tasks, 12 subtasks
     ══════════════════════════════════════════════════════════════ */
  {
    id: "task-011", planId: "plan-002", milestoneId: "pm-005",
    title: "Account management APIs",
    description: "RESTful endpoints for account creation, balance inquiry, transaction history, and account settings.",
    status: "accepted", priority: "critical", estimatedHours: 280,
    skillsRequired: [skill("Backend"), skill("Banking")],
    dependencies: [],
    phase: 1, order: 1, aiConfidence: 94, itemStatus: "accepted",
    acceptanceCriteria: ["Account CRUD with KYC validation", "Real-time balance endpoint", "Paginated transaction history", "Account freeze/unfreeze flow"],
    subtasks: [
      { id: "st-019", taskId: "task-011", title: "Account CRUD endpoints", estimatedHours: 60, skillsRequired: [skill("Backend"), skill("Banking")], itemStatus: "accepted", aiConfidence: 95 },
      { id: "st-020", taskId: "task-011", title: "Transaction processing", estimatedHours: 80, skillsRequired: [skill("Backend"), skill("Banking")], itemStatus: "accepted", aiConfidence: 92 },
    ],
  },
  {
    id: "task-012", planId: "plan-002", milestoneId: "pm-005",
    title: "Payment gateway integration",
    description: "Multi-provider payment gateway with fallback routing, idempotency, and reconciliation.",
    status: "in_progress", priority: "critical", estimatedHours: 320,
    skillsRequired: [skill("Backend"), skill("Payments"), skill("Security")],
    dependencies: [dep("task-011")],
    phase: 1, order: 2, aiConfidence: 90, itemStatus: "accepted",
    acceptanceCriteria: ["Support 3+ payment providers", "Automatic failover between gateways", "Idempotent transaction processing", "Daily reconciliation reports"],
    subtasks: [
      { id: "st-021", taskId: "task-012", title: "Gateway adapter layer", estimatedHours: 80, skillsRequired: [skill("Backend"), skill("Payments")], itemStatus: "accepted", aiConfidence: 91 },
    ],
  },
  {
    id: "task-013", planId: "plan-002", milestoneId: "pm-005",
    title: "Notification service",
    description: "Multi-channel notification system supporting SMS, push, and in-app alerts for transactions.",
    status: "backlog", priority: "medium", estimatedHours: 200,
    skillsRequired: [skill("Backend"), skill("Messaging")],
    dependencies: [dep("task-011")],
    phase: 1, order: 3, aiConfidence: 88, itemStatus: "accepted",
    acceptanceCriteria: ["SMS delivery via Twilio/SNS", "Push notifications for iOS and Android", "In-app notification center", "User preference management"],
    subtasks: [
      { id: "st-022", taskId: "task-013", title: "SMS and push provider integration", estimatedHours: 80, skillsRequired: [skill("Backend"), skill("Messaging")], itemStatus: "accepted", aiConfidence: 90 },
    ],
  },
  {
    id: "task-014", planId: "plan-002", milestoneId: "pm-006",
    title: "Mobile app shell & navigation",
    description: "React Native app scaffold with tab navigation, deep linking, and theme system.",
    status: "accepted", priority: "high", estimatedHours: 240,
    skillsRequired: [skill("React Native"), skill("UI/UX")],
    dependencies: [],
    phase: 2, order: 1, aiConfidence: 93, itemStatus: "accepted",
    acceptanceCriteria: ["Bottom tab navigation with 5 sections", "Deep link support for notifications", "Dark/light theme switching", "Splash screen and loading states"],
    subtasks: [
      { id: "st-024", taskId: "task-014", title: "Navigation architecture", estimatedHours: 40, skillsRequired: [skill("React Native")], itemStatus: "accepted", aiConfidence: 95 },
      { id: "st-025", taskId: "task-014", title: "Theme system", estimatedHours: 30, skillsRequired: [skill("React Native"), skill("UI/UX")], itemStatus: "accepted", aiConfidence: 92 },
    ],
  },
  {
    id: "task-015", planId: "plan-002", milestoneId: "pm-006",
    title: "Transaction screens",
    description: "Account dashboard, fund transfer flow, bill payment, and transaction detail views.",
    status: "in_progress", priority: "high", estimatedHours: 280,
    skillsRequired: [skill("React Native"), skill("UI/UX")],
    dependencies: [dep("task-014")],
    phase: 2, order: 2, aiConfidence: 89, itemStatus: "accepted",
    acceptanceCriteria: ["Account dashboard with balance card", "Send money flow with confirmation", "Bill payment with payee management", "Transaction detail with receipt download"],
    subtasks: [
      { id: "st-026", taskId: "task-015", title: "Account dashboard UI", estimatedHours: 60, skillsRequired: [skill("React Native"), skill("UI/UX")], itemStatus: "accepted", aiConfidence: 91 },
      { id: "st-027", taskId: "task-015", title: "Transfer flow UI", estimatedHours: 80, skillsRequired: [skill("React Native"), skill("UI/UX")], itemStatus: "accepted", aiConfidence: 87 },
    ],
  },
  {
    id: "task-016", planId: "plan-002", milestoneId: "pm-006",
    title: "Biometric authentication",
    description: "Face ID, Touch ID, and fingerprint authentication with secure enclave storage.",
    status: "backlog", priority: "critical", estimatedHours: 200,
    skillsRequired: [skill("React Native"), skill("Security")],
    dependencies: [dep("task-014")],
    phase: 2, order: 3, aiConfidence: 86, itemStatus: "accepted",
    acceptanceCriteria: ["Face ID support on iOS", "Touch ID / Fingerprint on Android", "Fallback to PIN/password", "Secure token storage in keychain"],
    subtasks: [
      { id: "st-028", taskId: "task-016", title: "Face ID / Touch ID integration", estimatedHours: 60, skillsRequired: [skill("React Native"), skill("Security")], itemStatus: "accepted", aiConfidence: 88 },
    ],
  },
  {
    id: "task-017", planId: "plan-002", milestoneId: "pm-007",
    title: "PCI-DSS compliance audit",
    description: "Full PCI-DSS Level 1 compliance assessment, gap analysis, and remediation.",
    status: "backlog", priority: "critical", estimatedHours: 360,
    skillsRequired: [skill("Security"), skill("Compliance")],
    dependencies: [dep("task-012")],
    phase: 3, order: 1, aiConfidence: 85, itemStatus: "accepted",
    acceptanceCriteria: ["SAQ-D questionnaire complete", "Network segmentation verified", "Encryption at rest and in transit", "Vulnerability scan passing"],
    subtasks: [
      { id: "st-029", taskId: "task-017", title: "Security assessment", estimatedHours: 120, skillsRequired: [skill("Security"), skill("Compliance")], itemStatus: "accepted", aiConfidence: 86 },
      { id: "st-030", taskId: "task-017", title: "Remediation", estimatedHours: 80, skillsRequired: [skill("Security")], itemStatus: "accepted", aiConfidence: 83 },
    ],
  },
  {
    id: "task-018", planId: "plan-002", milestoneId: "pm-007",
    title: "Penetration testing",
    description: "Automated and manual penetration testing of APIs, mobile app, and infrastructure.",
    status: "backlog", priority: "high", estimatedHours: 360,
    skillsRequired: [skill("Security"), skill("QA")],
    dependencies: [dep("task-017", "related")],
    phase: 3, order: 2, aiConfidence: 87, itemStatus: "accepted",
    acceptanceCriteria: ["OWASP Top 10 coverage", "API fuzzing with no critical findings", "Mobile app DAST scan", "Penetration test report with remediation plan"],
    subtasks: [
      { id: "st-031", taskId: "task-018", title: "Automated scanning", estimatedHours: 60, skillsRequired: [skill("Security"), skill("QA")], itemStatus: "accepted", aiConfidence: 89 },
    ],
  },

  /* ══════════════════════════════════════════════════════════════
     PLAN-003: E-Commerce Migration — 14 tasks, 24 subtasks (2 per task, all accepted)
     ══════════════════════════════════════════════════════════════ */
  {
    id: "task-019", planId: "plan-003", milestoneId: "pm-008",
    title: "Legacy database extraction",
    description: "Extract product, customer, and order data from legacy Oracle DB with data quality validation.",
    status: "accepted", priority: "critical", estimatedHours: 400,
    skillsRequired: [skill("Database"), skill("ETL")],
    dependencies: [],
    phase: 1, order: 1, aiConfidence: 86, itemStatus: "accepted",
    acceptanceCriteria: ["All legacy tables mapped to extraction queries", "Data quality report generated", "Incremental extraction support", "Extraction audit trail"],
    subtasks: [
      { id: "st-032", taskId: "task-019", title: "Schema mapping and extraction scripts", estimatedHours: 120, skillsRequired: [skill("Database"), skill("ETL")], itemStatus: "accepted", aiConfidence: 88 },
      { id: "st-033", taskId: "task-019", title: "Data quality validation rules", estimatedHours: 80, skillsRequired: [skill("Database")], itemStatus: "accepted", aiConfidence: 84 },
    ],
  },
  {
    id: "task-020", planId: "plan-003", milestoneId: "pm-008",
    title: "Data transformation pipeline",
    description: "Transform legacy data formats to new schema with cleansing, deduplication, and enrichment.",
    status: "accepted", priority: "critical", estimatedHours: 440,
    skillsRequired: [skill("ETL"), skill("Python")],
    dependencies: [dep("task-019")],
    phase: 1, order: 2, aiConfidence: 83, itemStatus: "accepted",
    acceptanceCriteria: ["Transformation rules for all entity types", "Deduplication with >99% accuracy", "Data enrichment from external sources", "Rollback capability for failed batches"],
    subtasks: [
      { id: "st-034", taskId: "task-020", title: "Transformation rule engine", estimatedHours: 100, skillsRequired: [skill("ETL"), skill("Python")], itemStatus: "accepted", aiConfidence: 85 },
      { id: "st-035", taskId: "task-020", title: "Deduplication and cleansing", estimatedHours: 80, skillsRequired: [skill("ETL")], itemStatus: "accepted", aiConfidence: 81 },
    ],
  },
  {
    id: "task-021", planId: "plan-003", milestoneId: "pm-008",
    title: "Data loading and verification",
    description: "Bulk load transformed data into new PostgreSQL schema with integrity checks.",
    status: "accepted", priority: "high", estimatedHours: 360,
    skillsRequired: [skill("Database"), skill("DevOps")],
    dependencies: [dep("task-020")],
    phase: 1, order: 3, aiConfidence: 82, itemStatus: "accepted",
    acceptanceCriteria: ["All entity types loaded successfully", "Referential integrity verified", "Row count reconciliation passing", "Performance benchmarks for bulk load"],
    subtasks: [
      { id: "st-036", taskId: "task-021", title: "Bulk loading scripts", estimatedHours: 80, skillsRequired: [skill("Database"), skill("DevOps")], itemStatus: "accepted", aiConfidence: 84 },
    ],
  },
  {
    id: "task-022", planId: "plan-003", milestoneId: "pm-009",
    title: "Product catalog service",
    description: "Product CRUD API with category hierarchy, variants, and attribute management.",
    status: "accepted", priority: "critical", estimatedHours: 320,
    skillsRequired: [skill("Backend"), skill("E-Commerce")],
    dependencies: [dep("task-021")],
    phase: 2, order: 1, aiConfidence: 84, itemStatus: "accepted",
    acceptanceCriteria: ["Product CRUD with variant support", "Category tree with unlimited nesting", "Attribute-based filtering", "Bulk import/export via CSV"],
    subtasks: [
      { id: "st-037", taskId: "task-022", title: "Product CRUD API", estimatedHours: 80, skillsRequired: [skill("Backend"), skill("E-Commerce")], itemStatus: "accepted", aiConfidence: 86 },
      { id: "st-038", taskId: "task-022", title: "Category hierarchy engine", estimatedHours: 60, skillsRequired: [skill("Backend")], itemStatus: "accepted", aiConfidence: 83 },
    ],
  },
  {
    id: "task-023", planId: "plan-003", milestoneId: "pm-009",
    title: "Search indexing with Elasticsearch",
    description: "Full-text search with faceted filtering, autocomplete, and relevance tuning.",
    status: "accepted", priority: "high", estimatedHours: 280,
    skillsRequired: [skill("Backend"), skill("Elasticsearch")],
    dependencies: [dep("task-022")],
    phase: 2, order: 2, aiConfidence: 81, itemStatus: "accepted",
    acceptanceCriteria: ["Full-text search with typo tolerance", "Faceted filtering by category, price, attributes", "Autocomplete with product suggestions", "Search analytics dashboard"],
    subtasks: [
      { id: "st-039", taskId: "task-023", title: "Elasticsearch index design", estimatedHours: 60, skillsRequired: [skill("Backend"), skill("Elasticsearch")], itemStatus: "accepted", aiConfidence: 83 },
      { id: "st-040", taskId: "task-023", title: "Autocomplete and relevance tuning", estimatedHours: 50, skillsRequired: [skill("Backend")], itemStatus: "accepted", aiConfidence: 79 },
    ],
  },
  {
    id: "task-024", planId: "plan-003", milestoneId: "pm-009",
    title: "Inventory management system",
    description: "Real-time stock tracking, warehouse allocation, and low-stock alerts.",
    status: "accepted", priority: "high", estimatedHours: 360,
    skillsRequired: [skill("Backend"), skill("E-Commerce")],
    dependencies: [dep("task-022")],
    phase: 2, order: 3, aiConfidence: 80, itemStatus: "accepted",
    acceptanceCriteria: ["Real-time stock levels per warehouse", "Automatic reorder point alerts", "Reserved stock for pending orders", "Inventory adjustment audit trail"],
    subtasks: [
      { id: "st-041", taskId: "task-024", title: "Stock tracking and warehouse allocation", estimatedHours: 140, skillsRequired: [skill("Backend"), skill("E-Commerce")], itemStatus: "accepted", aiConfidence: 82 },
    ],
  },
  {
    id: "task-025", planId: "plan-003", milestoneId: "pm-010",
    title: "Order lifecycle management",
    description: "End-to-end order processing from cart to delivery with state machine.",
    status: "accepted", priority: "critical", estimatedHours: 280,
    skillsRequired: [skill("Backend"), skill("E-Commerce")],
    dependencies: [dep("task-024"), dep("task-022")],
    phase: 3, order: 1, aiConfidence: 81, itemStatus: "accepted",
    acceptanceCriteria: ["Order state machine with 8 states", "Cart to checkout conversion", "Order confirmation emails", "Order cancellation within SLA window"],
    subtasks: [
      { id: "st-043", taskId: "task-025", title: "Order state machine", estimatedHours: 60, skillsRequired: [skill("Backend"), skill("E-Commerce")], itemStatus: "accepted", aiConfidence: 83 },
      { id: "st-044", taskId: "task-025", title: "Cart and checkout flow", estimatedHours: 80, skillsRequired: [skill("Backend")], itemStatus: "accepted", aiConfidence: 80 },
    ],
  },
  {
    id: "task-026", planId: "plan-003", milestoneId: "pm-010",
    title: "Fulfillment workflow engine",
    description: "Pick, pack, ship workflow with carrier integration and tracking updates.",
    status: "accepted", priority: "high", estimatedHours: 260,
    skillsRequired: [skill("Backend"), skill("E-Commerce")],
    dependencies: [dep("task-025")],
    phase: 3, order: 2, aiConfidence: 79, itemStatus: "accepted",
    acceptanceCriteria: ["Pick list generation per warehouse", "Packing slip with barcode", "Multi-carrier shipping label generation", "Real-time tracking webhook integration"],
    subtasks: [
      { id: "st-045", taskId: "task-026", title: "Fulfillment state machine", estimatedHours: 60, skillsRequired: [skill("Backend")], itemStatus: "accepted", aiConfidence: 81 },
      { id: "st-046", taskId: "task-026", title: "Carrier integration adapters", estimatedHours: 70, skillsRequired: [skill("Backend"), skill("E-Commerce")], itemStatus: "accepted", aiConfidence: 77 },
    ],
  },
  {
    id: "task-027", planId: "plan-003", milestoneId: "pm-010",
    title: "Returns and refund processing",
    description: "Return merchandise authorization, inspection workflow, and refund calculation.",
    status: "accepted", priority: "medium", estimatedHours: 260,
    skillsRequired: [skill("Backend"), skill("E-Commerce")],
    dependencies: [dep("task-025")],
    phase: 3, order: 3, aiConfidence: 78, itemStatus: "accepted",
    acceptanceCriteria: ["RMA request with reason codes", "Return shipping label generation", "Inspection and grading workflow", "Automatic refund calculation and processing"],
    subtasks: [
      { id: "st-047", taskId: "task-027", title: "RMA workflow and refund engine", estimatedHours: 110, skillsRequired: [skill("Backend"), skill("E-Commerce")], itemStatus: "accepted", aiConfidence: 80 },
    ],
  },
  {
    id: "task-028", planId: "plan-003", milestoneId: "pm-011",
    title: "Payment provider integration",
    description: "Stripe, PayPal, and bank transfer payment methods with retry logic.",
    status: "accepted", priority: "critical", estimatedHours: 240,
    skillsRequired: [skill("Backend"), skill("Payment")],
    dependencies: [dep("task-025")],
    phase: 4, order: 1, aiConfidence: 80, itemStatus: "accepted",
    acceptanceCriteria: ["Stripe integration with webhooks", "PayPal checkout flow", "Bank transfer with reference matching", "Payment retry with exponential backoff"],
    subtasks: [
      { id: "st-049", taskId: "task-028", title: "Stripe adapter and webhooks", estimatedHours: 60, skillsRequired: [skill("Backend"), skill("Payment")], itemStatus: "accepted", aiConfidence: 82 },
      { id: "st-050", taskId: "task-028", title: "PayPal integration", estimatedHours: 50, skillsRequired: [skill("Backend"), skill("Payment")], itemStatus: "accepted", aiConfidence: 79 },
    ],
  },
  {
    id: "task-029", planId: "plan-003", milestoneId: "pm-011",
    title: "Checkout flow optimization",
    description: "Streamlined checkout with address validation, tax calculation, and discount engine.",
    status: "accepted", priority: "high", estimatedHours: 240,
    skillsRequired: [skill("Frontend"), skill("E-Commerce")],
    dependencies: [dep("task-028")],
    phase: 4, order: 2, aiConfidence: 79, itemStatus: "accepted",
    acceptanceCriteria: ["Single-page checkout with progress", "Address validation via API", "Real-time tax calculation", "Coupon and discount code engine"],
    subtasks: [
      { id: "st-051", taskId: "task-029", title: "Checkout UI components", estimatedHours: 60, skillsRequired: [skill("Frontend"), skill("E-Commerce")], itemStatus: "accepted", aiConfidence: 81 },
      { id: "st-052", taskId: "task-029", title: "Tax and discount engine", estimatedHours: 50, skillsRequired: [skill("Backend"), skill("E-Commerce")], itemStatus: "accepted", aiConfidence: 77 },
    ],
  },
  {
    id: "task-030", planId: "plan-003", milestoneId: "pm-011",
    title: "Subscription billing",
    description: "Recurring payment support for subscription products with proration and dunning.",
    status: "accepted", priority: "medium", estimatedHours: 240,
    skillsRequired: [skill("Backend"), skill("Payment")],
    dependencies: [dep("task-028")],
    phase: 4, order: 3, aiConfidence: 77, itemStatus: "accepted",
    acceptanceCriteria: ["Recurring billing schedules", "Proration for mid-cycle changes", "Dunning management with retry", "Subscription analytics dashboard"],
    subtasks: [
      { id: "st-053", taskId: "task-030", title: "Billing cycle and dunning engine", estimatedHours: 100, skillsRequired: [skill("Backend"), skill("Payment")], itemStatus: "accepted", aiConfidence: 79 },
    ],
  },
  {
    id: "task-031", planId: "plan-003", milestoneId: "pm-012",
    title: "End-to-end test suite",
    description: "Comprehensive E2E tests covering all purchase flows, edge cases, and regression scenarios.",
    status: "accepted", priority: "high", estimatedHours: 400,
    skillsRequired: [skill("QA"), skill("E-Commerce")],
    dependencies: [dep("task-029"), dep("task-026")],
    phase: 5, order: 1, aiConfidence: 79, itemStatus: "accepted",
    acceptanceCriteria: ["100+ E2E test scenarios", "Cross-browser coverage (Chrome, Firefox, Safari)", "Mobile responsive tests", "Performance regression benchmarks"],
    subtasks: [
      { id: "st-055", taskId: "task-031", title: "Test scenario design and framework", estimatedHours: 80, skillsRequired: [skill("QA")], itemStatus: "accepted", aiConfidence: 81 },
      { id: "st-056", taskId: "task-031", title: "Purchase flow test automation", estimatedHours: 100, skillsRequired: [skill("QA"), skill("E-Commerce")], itemStatus: "accepted", aiConfidence: 78 },
    ],
  },
  {
    id: "task-032", planId: "plan-003", milestoneId: "pm-012",
    title: "Production launch and monitoring",
    description: "Blue-green deployment, CDN configuration, monitoring dashboards, and runbook.",
    status: "accepted", priority: "critical", estimatedHours: 400,
    skillsRequired: [skill("DevOps"), skill("QA")],
    dependencies: [dep("task-031")],
    phase: 5, order: 2, aiConfidence: 77, itemStatus: "accepted",
    acceptanceCriteria: ["Blue-green deployment with instant rollback", "CDN configuration for static assets", "Monitoring dashboards with alerting", "Operations runbook documented"],
    subtasks: [
      { id: "st-057", taskId: "task-032", title: "Deployment pipeline and CDN", estimatedHours: 80, skillsRequired: [skill("DevOps")], itemStatus: "accepted", aiConfidence: 79 },
      { id: "st-058", taskId: "task-032", title: "Monitoring and alerting setup", estimatedHours: 60, skillsRequired: [skill("DevOps"), skill("QA")], itemStatus: "accepted", aiConfidence: 76 },
    ],
  },

  /* ══════════════════════════════════════════════════════════════
     PLAN-004: Supply Chain Analytics — 6 tasks, 10 subtasks (all backlog/proposed)
     ══════════════════════════════════════════════════════════════ */
  {
    id: "task-033", planId: "plan-004", milestoneId: "pm-013",
    title: "Data ingestion framework",
    description: "Multi-source data ingestion from ERP, WMS, and IoT sensors via streaming and batch pipelines.",
    status: "backlog", priority: "critical", estimatedHours: 300,
    skillsRequired: [skill("Data Engineering"), skill("Python")],
    dependencies: [],
    phase: 1, order: 1, aiConfidence: 78, itemStatus: "proposed",
    acceptanceCriteria: ["Kafka-based streaming ingestion", "Batch ingestion from S3/SFTP", "Schema validation and dead-letter queue", "Data lineage tracking"],
    subtasks: [
      { id: "st-059", taskId: "task-033", title: "Streaming pipeline with Kafka", estimatedHours: 80, skillsRequired: [skill("Data Engineering")], itemStatus: "proposed", aiConfidence: 79 },
      { id: "st-060", taskId: "task-033", title: "Batch ingestion adapters", estimatedHours: 60, skillsRequired: [skill("Data Engineering"), skill("Python")], itemStatus: "proposed", aiConfidence: 76 },
    ],
  },
  {
    id: "task-034", planId: "plan-004", milestoneId: "pm-013",
    title: "Data warehouse design",
    description: "Star-schema data warehouse for supply chain metrics with incremental refresh.",
    status: "backlog", priority: "high", estimatedHours: 260,
    skillsRequired: [skill("Data Engineering"), skill("Database")],
    dependencies: [dep("task-033")],
    phase: 1, order: 2, aiConfidence: 75, itemStatus: "proposed",
    acceptanceCriteria: ["Star schema with fact and dimension tables", "Incremental refresh under 15 minutes", "Data quality checks on every load", "Partitioning strategy for 2+ years of data"],
    subtasks: [
      { id: "st-061", taskId: "task-034", title: "Star schema design", estimatedHours: 60, skillsRequired: [skill("Data Engineering"), skill("Database")], itemStatus: "proposed", aiConfidence: 77 },
      { id: "st-062", taskId: "task-034", title: "ETL orchestration with Airflow", estimatedHours: 60, skillsRequired: [skill("Data Engineering"), skill("Python")], itemStatus: "proposed", aiConfidence: 74 },
    ],
  },
  {
    id: "task-035", planId: "plan-004", milestoneId: "pm-014",
    title: "Demand forecasting model",
    description: "ML-based demand forecasting with seasonal decomposition, external factor integration, and confidence intervals.",
    status: "backlog", priority: "critical", estimatedHours: 260,
    skillsRequired: [skill("ML"), skill("Python")],
    dependencies: [dep("task-034")],
    phase: 2, order: 1, aiConfidence: 72, itemStatus: "proposed",
    acceptanceCriteria: ["MAPE below 15% on test data", "Seasonal and trend decomposition", "External factor integration (weather, holidays)", "Confidence interval bands"],
    subtasks: [
      { id: "st-063", taskId: "task-035", title: "Feature engineering pipeline", estimatedHours: 60, skillsRequired: [skill("ML"), skill("Python")], itemStatus: "proposed", aiConfidence: 74 },
      { id: "st-064", taskId: "task-035", title: "Model training and evaluation", estimatedHours: 60, skillsRequired: [skill("ML")], itemStatus: "proposed", aiConfidence: 71 },
    ],
  },
  {
    id: "task-036", planId: "plan-004", milestoneId: "pm-014",
    title: "Anomaly detection engine",
    description: "Real-time anomaly detection for supply chain disruptions using statistical and ML approaches.",
    status: "backlog", priority: "high", estimatedHours: 220,
    skillsRequired: [skill("ML"), skill("Data Engineering")],
    dependencies: [dep("task-034")],
    phase: 2, order: 2, aiConfidence: 70, itemStatus: "proposed",
    acceptanceCriteria: ["Detection within 5 minutes of anomaly", "False positive rate below 5%", "Alert routing by severity", "Historical anomaly analysis view"],
    subtasks: [
      { id: "st-065", taskId: "task-036", title: "Statistical anomaly detection", estimatedHours: 50, skillsRequired: [skill("ML"), skill("Data Engineering")], itemStatus: "proposed", aiConfidence: 72 },
    ],
  },
  {
    id: "task-037", planId: "plan-004", milestoneId: "pm-015",
    title: "Interactive analytics dashboard",
    description: "Real-time supply chain dashboard with drill-down, filtering, and export capabilities.",
    status: "backlog", priority: "high", estimatedHours: 220,
    skillsRequired: [skill("React"), skill("D3.js")],
    dependencies: [dep("task-035"), dep("task-036", "related")],
    phase: 3, order: 1, aiConfidence: 73, itemStatus: "proposed",
    acceptanceCriteria: ["KPI cards with real-time updates", "Drill-down from summary to detail", "Date range and dimension filtering", "PDF and CSV export"],
    subtasks: [
      { id: "st-066", taskId: "task-037", title: "Dashboard layout and KPI cards", estimatedHours: 50, skillsRequired: [skill("React"), skill("D3.js")], itemStatus: "proposed", aiConfidence: 75 },
      { id: "st-067", taskId: "task-037", title: "Chart components and drill-down", estimatedHours: 50, skillsRequired: [skill("React"), skill("D3.js")], itemStatus: "proposed", aiConfidence: 72 },
    ],
  },
  {
    id: "task-038", planId: "plan-004", milestoneId: "pm-015",
    title: "Supply chain map visualization",
    description: "Geographic supply chain map with node health indicators, route visualization, and disruption overlays.",
    status: "backlog", priority: "medium", estimatedHours: 180,
    skillsRequired: [skill("React"), skill("D3.js"), skill("DevOps")],
    dependencies: [dep("task-037")],
    phase: 3, order: 2, aiConfidence: 71, itemStatus: "proposed",
    acceptanceCriteria: ["Interactive world map with supplier nodes", "Route visualization with transit times", "Disruption overlay with severity colors", "Node click for detail panel"],
    subtasks: [
      { id: "st-068", taskId: "task-038", title: "Geo map with supplier nodes", estimatedHours: 50, skillsRequired: [skill("React"), skill("D3.js")], itemStatus: "proposed", aiConfidence: 73 },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════
   AI RECOMMENDATIONS (for plan-001) — Decomposition Assistant
   ══════════════════════════════════════════════════════════════ */
export const mockAIRecommendations: AIRecommendation[] = [
  {
    id: "rec-001", planId: "plan-001", type: "split", severity: "warning",
    title: "Consider splitting high-complexity task",
    description: "Task 'Finance module — General Ledger' has 160 estimated hours and spans multiple domains. Splitting into smaller tasks would improve delivery predictability.",
    affectedTaskId: "task-004", suggestion: "Split into 'Chart of Accounts' (60h) and 'Journal Engine + Reporting' (100h)",
    dismissed: false,
  },
  {
    id: "rec-002", planId: "plan-001", type: "dependency", severity: "info",
    title: "Missing dependency detected",
    description: "Task 'HR Payroll integration' uses financial data but does not explicitly depend on 'Finance General Ledger'. This could cause integration issues.",
    affectedTaskId: "task-007", suggestion: "Add blocking dependency from task-007 to task-004",
    dismissed: false,
  },
  {
    id: "rec-003", planId: "plan-001", type: "skill_gap", severity: "critical",
    title: "Skill gap: limited Finance + HR expertise",
    description: "Only 2 contributors in the talent pool have combined Finance and HR skills. Task 'Payroll integration' requires this rare combination.",
    affectedTaskId: "task-007", suggestion: "Consider relaxing skill requirements or splitting the task by domain",
    dismissed: false,
  },
  {
    id: "rec-004", planId: "plan-001", type: "effort", severity: "info",
    title: "Optimistic estimate detected",
    description: "Task 'Database schema design' at 80h is below the historical average of 110h for similar complexity. Consider revising upward.",
    affectedTaskId: "task-003", suggestion: "Increase estimate to 100-120h based on historical data for 5-module schemas",
    dismissed: true,
  },
  {
    id: "rec-005", planId: "plan-001", type: "risk", severity: "warning",
    title: "Critical path bottleneck",
    description: "Tasks task-004 and task-005 are sequential on the critical path with combined 280h. Any delay cascades to HR and Reporting milestones.",
    suggestion: "Consider parallelizing AP vendor management with GL development where possible",
    dismissed: false,
  },

  /* ── Plan-002 recommendations ── */
  {
    id: "rec-006", planId: "plan-002", type: "risk", severity: "warning",
    title: "Payment gateway integration complexity",
    description: "Multi-provider payment gateway with fallback routing (task-012) at 320h is aggressive. Historical data shows similar integrations averaging 400-450h due to provider API inconsistencies and certification requirements.",
    affectedTaskId: "task-012", suggestion: "Increase estimate to 400h and add a buffer milestone for gateway certification delays",
    dismissed: false,
  },
  {
    id: "rec-007", planId: "plan-002", type: "dependency", severity: "info",
    title: "Security testing timeline overlap",
    description: "PCI-DSS compliance audit (task-017) and penetration testing (task-018) are marked as related but could run in parallel. Starting pen testing earlier against staging environments would reduce total timeline by 2-3 weeks.",
    affectedTaskId: "task-018", suggestion: "Convert to parallel execution with task-017 using a shared staging environment",
    dismissed: false,
  },

  /* ── Plan-004 recommendations ── */
  {
    id: "rec-008", planId: "plan-004", type: "skill_gap", severity: "critical",
    title: "ML model data quality dependency",
    description: "Demand forecasting model (task-035) assumes clean historical data, but the data pipeline (task-033) has no explicit data quality validation step. Poor data quality is the #1 cause of ML model failures in supply chain analytics.",
    affectedTaskId: "task-035", suggestion: "Add a dedicated data quality validation task between pipeline and model training, or add data profiling subtask to task-033",
    dismissed: false,
  },
  {
    id: "rec-009", planId: "plan-004", type: "effort", severity: "warning",
    title: "Dashboard rendering performance risk",
    description: "Interactive analytics dashboard (task-037) with D3.js will render large datasets (2+ years of supply chain data). Without virtualization and server-side aggregation, initial load times could exceed 10 seconds.",
    affectedTaskId: "task-037", suggestion: "Add pre-aggregation layer in the data warehouse and implement virtual scrolling for large dataset charts",
    dismissed: false,
  },
];

/* ══════════════════════════════════════════════════════════════
   PLAN VALIDATION RESULTS (for plan-001)
   ══════════════════════════════════════════════════════════════ */
export const mockValidationResults: PlanValidationResult[] = [
  { field: "All tasks have descriptions", status: "passed", message: "10/10 tasks have descriptions" },
  { field: "Effort estimates complete", status: "passed", message: "All tasks have hour estimates" },
  { field: "Skills tags assigned", status: "passed", message: "All tasks have at least 1 skill tag" },
  { field: "Acceptance criteria defined", status: "passed", message: "10/10 tasks have acceptance criteria" },
  { field: "Dependencies validated", status: "warning", message: "1 task has a soft dependency that may need review" },
  { field: "Budget within SOW limits", status: "passed", message: "Estimated cost $285K is within $300K SOW ceiling" },
  { field: "Critical path feasible", status: "warning", message: "Critical path (2,100h) is tight for 6-month timeline" },
  { field: "Skill coverage available", status: "error", message: "Finance+HR combination has only 2 matching contributors" },
];

/* ══════════════════════════════════════════════════════════════
   PLAN VERSIONS (for plan-001)
   ══════════════════════════════════════════════════════════════ */
export const mockPlanVersions: PlanVersion[] = [
  { version: 1, createdAt: "2026-02-16T08:00:00Z", createdBy: "AI Decomposition Engine", changes: "Initial decomposition from SOW sow-001. Generated 10 tasks across 4 milestones.", status: "draft" },
  { version: 2, createdAt: "2026-02-18T14:30:00Z", createdBy: "Priya Nair", changes: "Added acceptance criteria to all tasks. Split Phase 2 into separate finance subtasks. Adjusted effort estimates.", status: "in_progress" },
];

/* ══════════════════════════════════════════════════════════════
   TEAM POOLS
   ══════════════════════════════════════════════════════════════ */
const makeMember = (
  id: string,
  name: string,
  initials: string,
  skills: string[],
  match: number,
  track: TeamMember["track"],
  completed: number,
  rating: number,
  avail: TeamMember["availability"] = "full_time",
  whyMatched?: string
): TeamMember => ({
  id,
  anonymousId: `anon-${id}`,
  displayName: name,
  avatar: initials,
  skills,
  matchScore: match,
  availability: avail,
  track,
  tasksCompleted: completed,
  rating,
  whyMatched,
});

export const mockTeams: TeamPool[] = [
  {
    id: "team-001",
    planId: "plan-001",
    projectId: "proj-001",
    name: "ERP Delivery Squad",
    status: "active",
    createdAt: "2026-02-18T10:00:00Z",
    matchScore: 92,
    totalMembers: 7,
    requiredSkills: ["Full-Stack", "Backend", "DevOps", "Finance", "QA", "Design"],
    taskAssignments: { "task-001": "m-003", "task-002": "m-002", "task-003": "m-002", "task-004": "m-004", "task-005": "m-004", "task-006": "m-005", "task-007": "m-006", "task-008": "m-007", "task-009": "m-001", "task-010": "m-006" },
    members: [
      makeMember("m-001", "Contributor A-7X", "A7", ["Full-Stack", "TypeScript", "React"], 95, "women", 34, 4.8, "full_time", "95% skills overlap on TypeScript + React. 34 completed deliveries with 4.8 avg rating. Full-time availability aligns with sprint cadence."),
      makeMember("m-002", "Contributor B-3K", "B3", ["Backend", "NestJS", "PostgreSQL"], 93, "student", 28, 4.7, "full_time", "Strong NestJS + PostgreSQL match (93%). 28 past deliveries in backend domain. On-time delivery rate: 96%."),
      makeMember("m-003", "Contributor C-9R", "C9", ["DevOps", "AWS", "Terraform"], 90, "general", 45, 4.9, "full_time", "Top-ranked DevOps contributor. 45 completed tasks with 4.9 rating. AWS + Terraform exact match for infrastructure requirements."),
      makeMember("m-004", "Contributor D-2M", "D2", ["Backend", "Finance", "API"], 88, "women", 22, 4.6, "full_time", "Rare finance-domain backend skills. 88% match on API design. 22 deliveries in fintech projects specifically."),
      makeMember("m-005", "Contributor E-5L", "E5", ["Full-Stack", "HR", "React"], 91, "student", 19, 4.5, "full_time", "Full-stack + HR module expertise. 91% skills match. Learning-track contributor with rapid skill growth trajectory."),
      makeMember("m-006", "Contributor F-8W", "F8", ["QA", "Playwright", "k6"], 87, "general", 31, 4.7, "full_time", "QA specialist with Playwright + k6 automation. 87% match. 31 test-focused deliveries with zero escaped defects."),
      makeMember("m-007", "Contributor G-1N", "G1", ["Design", "Figma", "CSS"], 94, "women", 26, 4.8, "part_time", "Design-system specialist. 94% match for UI/CSS tasks. Part-time but high-output: 26 accepted deliveries."),
    ],
  },
  {
    id: "team-002",
    planId: "plan-002",
    projectId: "proj-002",
    name: "Mobile Banking Team",
    status: "ready",
    createdAt: "2026-02-24T09:00:00Z",
    matchScore: 89,
    totalMembers: 5,
    requiredSkills: ["Mobile", "React Native", "Backend", "Security", "UX"],
    taskAssignments: { "task-mb-001": "m-008", "task-mb-002": "m-009", "task-mb-003": "m-010", "task-mb-004": "m-011", "task-mb-005": "m-012" },
    members: [
      makeMember("m-008", "Contributor H-4P", "H4", ["Mobile", "React Native"], 92, "student", 15, 4.6, "full_time", "React Native specialist with 92% skills overlap. 15 mobile-app deliveries. Fast learner — completed security module certification."),
      makeMember("m-009", "Contributor I-6T", "I6", ["Backend", "Security", "Node.js"], 90, "women", 37, 4.8, "full_time", "Security-first backend engineer. PCI-DSS experience from 3 fintech projects. 90% match with 37 deliveries."),
      makeMember("m-010", "Contributor J-2Y", "J2", ["UX", "Figma", "Prototype"], 88, "general", 23, 4.5, "full_time", "UX researcher + designer. 88% match. 23 deliveries including 5 mobile banking prototypes."),
      makeMember("m-011", "Contributor K-7Q", "K7", ["Mobile", "iOS", "Android"], 86, "student", 12, 4.4, "full_time", "Cross-platform mobile dev. iOS + Android native experience. 86% skills match. Growing contributor with strong reviews."),
      makeMember("m-012", "Contributor L-3V", "L3", ["QA", "Mobile Testing"], 85, "women", 29, 4.6, "full_time", "Mobile QA specialist. Appium + Detox experience. 85% match. 29 test deliveries with regression-zero record."),
    ],
  },
  {
    id: "team-003",
    planId: "plan-003",
    projectId: "proj-003",
    name: "E-Commerce Migration Crew",
    status: "disbanded",
    createdAt: "2025-11-20T10:00:00Z",
    matchScore: 94,
    totalMembers: 9,
    requiredSkills: ["Full-Stack", "AWS", "Migration", "E-Commerce", "DevOps", "Data"],
    members: [
      makeMember("m-013", "Contributor M-5Z", "M5", ["Full-Stack", "E-Commerce"], 96, "general", 52, 4.9, "full_time", "Top 5% contributor. 96% match. Led 3 prior e-commerce migrations."),
      makeMember("m-014", "Contributor N-8A", "N8", ["AWS", "Migration", "Data"], 94, "women", 41, 4.8, "full_time", "AWS migration specialist. 94% match. 41 deliveries in data pipeline domain."),
      makeMember("m-015", "Contributor O-1B", "O1", ["Backend", "Node.js", "GraphQL"], 91, "student", 33, 4.7, "full_time", "GraphQL API expert. 91% match. Contributed to 2 prior migration projects."),
    ],
  },
  {
    id: "team-004",
    planId: "plan-005",
    name: "Healthcare Portal Team",
    status: "forming",
    createdAt: "2026-03-08T11:00:00Z",
    matchScore: 86,
    totalMembers: 5,
    requiredSkills: ["React", "Backend", "HIPAA", "Data", "DevOps"],
    taskAssignments: { "task-hp-001": "m-016", "task-hp-002": "m-017", "task-hp-003": "m-018", "task-hp-004": "m-019", "task-hp-005": "m-020" },
    members: [
      makeMember("m-016", "Contributor P-4R", "P4", ["React", "TypeScript", "A11y"], 91, "women", 27, 4.7, "full_time", "Accessibility-first frontend dev. 91% match. 27 deliveries including 4 healthcare UIs meeting WCAG AAA."),
      makeMember("m-017", "Contributor Q-6N", "Q6", ["Backend", "HIPAA", "Node.js"], 89, "general", 38, 4.8, "full_time", "HIPAA-certified backend engineer. 89% match. 38 deliveries in healthcare/compliance domain."),
      makeMember("m-018", "Contributor R-2W", "R2", ["Data", "PostgreSQL", "ETL"], 85, "student", 14, 4.5, "full_time", "Data pipeline engineer. 85% match. 14 deliveries. Completed healthcare data governance course."),
      makeMember("m-019", "Contributor S-8J", "S8", ["DevOps", "Docker", "AWS"], 84, "women", 31, 4.6, "full_time", "Cloud infra specialist. 84% match. HIPAA-compliant AWS deployments in 2 prior projects."),
      makeMember("m-020", "Contributor T-1F", "T1", ["QA", "Security Testing", "OWASP"], 82, "general", 20, 4.4, "part_time", "Security QA with OWASP expertise. 82% match. Part-time but consistent 4.4 rating across 20 deliveries."),
    ],
  },
];

/* ══════════════════════════════════════════════════════════════
   ASSIGNMENTS — pending contributor responses with SLA timers
   Dates are relative to "now" so SLA timers always show realistic values.
   ══════════════════════════════════════════════════════════════ */
const _now = Date.now();
const _h = 3600000; // 1 hour in ms
function _ago(hours: number): string { return new Date(_now - hours * _h).toISOString(); }
function _ahead(hours: number): string { return new Date(_now + hours * _h).toISOString(); }

export const mockAssignments: Assignment[] = [
  { id: "asgn-001", teamId: "team-002", teamName: "Mobile Banking Team", memberId: "m-008", memberDisplayName: "Contributor H-4P", memberAvatar: "H4", taskId: "task-mb-001", taskTitle: "React Native App Shell", projectName: "Mobile Banking App Redesign", status: "pending_response", sentAt: _ago(44), respondBy: _ahead(28) },
  { id: "asgn-002", teamId: "team-002", teamName: "Mobile Banking Team", memberId: "m-009", memberDisplayName: "Contributor I-6T", memberAvatar: "I6", taskId: "task-mb-002", taskTitle: "Payment Gateway Integration", projectName: "Mobile Banking App Redesign", status: "accepted", sentAt: _ago(44), respondBy: _ahead(28), respondedAt: _ago(19) },
  { id: "asgn-003", teamId: "team-002", teamName: "Mobile Banking Team", memberId: "m-010", memberDisplayName: "Contributor J-2Y", memberAvatar: "J2", taskId: "task-mb-003", taskTitle: "UX Prototype & Usability Tests", projectName: "Mobile Banking App Redesign", status: "pending_response", sentAt: _ago(44), respondBy: _ahead(10) },
  { id: "asgn-004", teamId: "team-004", teamName: "Healthcare Portal Team", memberId: "m-016", memberDisplayName: "Contributor P-4R", memberAvatar: "P4", taskId: "task-hp-001", taskTitle: "Patient Portal UI", projectName: "Healthcare Portal", status: "pending_response", sentAt: _ago(23), respondBy: _ahead(49) },
  { id: "asgn-005", teamId: "team-004", teamName: "Healthcare Portal Team", memberId: "m-017", memberDisplayName: "Contributor Q-6N", memberAvatar: "Q6", taskId: "task-hp-002", taskTitle: "HIPAA-Compliant API Layer", projectName: "Healthcare Portal", status: "pending_response", sentAt: _ago(23), respondBy: _ahead(49) },
  { id: "asgn-006", teamId: "team-002", teamName: "Mobile Banking Team", memberId: "m-011", memberDisplayName: "Contributor K-7Q", memberAvatar: "K7", taskId: "task-mb-004", taskTitle: "Biometric Auth Module", projectName: "Mobile Banking App Redesign", status: "declined", sentAt: _ago(44), respondBy: _ahead(28), respondedAt: _ago(14), declineReason: "Scheduling conflict with existing commitment through end of March. Available from April onwards." },
];

/* ══════════════════════════════════════════════════════════════
   PROJECTS
   ══════════════════════════════════════════════════════════════ */
export const mockProjects: Project[] = [
  {
    id: "proj-001",
    planId: "plan-001",
    sowId: "sow-001",
    teamId: "team-001",
    title: "Enterprise Resource Planning Platform",
    client: "TechVista Solutions",
    health: "on_track",
    progress: 45,
    startDate: "2026-02-20",
    endDate: "2026-08-20",
    budget: 285000,
    spent: 98500,
    teamSize: 7,
    milestones: [],
    tasksTotal: 42,
    tasksCompleted: 14,
    apgScore: 87,
    escalations: 1,
    slaCompliance: 96,
    sowTitle: "Enterprise Resource Planning Platform",
  },
  {
    id: "proj-002",
    planId: "plan-002",
    sowId: "sow-002",
    teamId: "team-002",
    title: "Mobile Banking App Redesign",
    client: "FinServe Global",
    health: "at_risk",
    progress: 32,
    startDate: "2026-02-28",
    endDate: "2026-06-28",
    budget: 180000,
    spent: 42000,
    teamSize: 5,
    milestones: [],
    tasksTotal: 28,
    tasksCompleted: 8,
    apgScore: 72,
    escalations: 3,
    slaCompliance: 82,
    sowTitle: "Mobile Banking App Redesign",
  },
  {
    id: "proj-003",
    planId: "plan-003",
    sowId: "sow-005",
    teamId: "team-003",
    title: "E-Commerce Platform Migration",
    client: "ShopNova Retail",
    health: "completed",
    progress: 100,
    startDate: "2025-12-01",
    endDate: "2026-01-20",
    budget: 520000,
    spent: 495000,
    teamSize: 9,
    milestones: [],
    tasksTotal: 56,
    tasksCompleted: 56,
    apgScore: 95,
    escalations: 0,
    slaCompliance: 98,
    sowTitle: "E-Commerce Platform Migration",
  },
  {
    id: "proj-004",
    planId: "plan-001",
    sowId: "sow-001",
    teamId: "team-001",
    title: "CRM Integration Module",
    client: "TechVista Solutions",
    health: "behind",
    progress: 18,
    startDate: "2026-03-01",
    endDate: "2026-05-30",
    budget: 95000,
    spent: 15200,
    teamSize: 4,
    milestones: [],
    tasksTotal: 15,
    tasksCompleted: 2,
    apgScore: 64,
    escalations: 2,
    slaCompliance: 71,
    sowTitle: "Enterprise Resource Planning Platform",
  },
];

/* ══════════════════════════════════════════════════════════════
   MILESTONES (for proj-001)
   ══════════════════════════════════════════════════════════════ */
export const mockMilestones: Milestone[] = [
  { id: "ms-001", projectId: "proj-001", title: "Infrastructure & Auth", status: "completed", dueDate: "2026-03-20", progress: 100, tasksTotal: 8, tasksCompleted: 8, deliverables: 4, budget: 55000 },
  { id: "ms-002", projectId: "proj-001", title: "Finance Module", status: "in_progress", dueDate: "2026-04-30", progress: 62, tasksTotal: 12, tasksCompleted: 6, deliverables: 6, budget: 85000 },
  { id: "ms-003", projectId: "proj-001", title: "HR Module", status: "upcoming", dueDate: "2026-06-15", progress: 0, tasksTotal: 10, tasksCompleted: 0, deliverables: 5, budget: 75000 },
  { id: "ms-004", projectId: "proj-001", title: "Reporting & Integration", status: "upcoming", dueDate: "2026-08-10", progress: 0, tasksTotal: 12, tasksCompleted: 0, deliverables: 4, budget: 70000 },
];

/* ══════════════════════════════════════════════════════════════
   DELIVERABLES
   ══════════════════════════════════════════════════════════════ */
export const mockDeliverables: Deliverable[] = [
  { id: "del-001", projectId: "proj-001", milestoneId: "ms-002", taskId: "task-004", title: "General Ledger API Endpoints", submittedAt: "2026-03-03T14:00:00Z", submittedBy: "Contributor D-2M", status: "pending", evidenceFiles: 3 },
  { id: "del-002", projectId: "proj-001", milestoneId: "ms-002", taskId: "task-005", title: "Accounts Payable UI Components", submittedAt: "2026-03-02T10:30:00Z", submittedBy: "Contributor A-7X", status: "pending", evidenceFiles: 5 },
  { id: "del-003", projectId: "proj-001", milestoneId: "ms-001", taskId: "task-001", title: "Monorepo Infrastructure", submittedAt: "2026-02-28T16:00:00Z", submittedBy: "Contributor C-9R", status: "approved", evidenceFiles: 2, decision: "approved", decidedAt: "2026-03-01T09:00:00Z", reviewerNotes: "Excellent setup with comprehensive CI/CD." },
  { id: "del-004", projectId: "proj-001", milestoneId: "ms-001", taskId: "task-002", title: "Authentication Service", submittedAt: "2026-03-05T11:00:00Z", submittedBy: "Contributor B-3K", status: "rework", evidenceFiles: 4, decision: "rework_requested", decidedAt: "2026-03-05T15:00:00Z", reviewerNotes: "MFA flow needs refinement for edge cases." },
  { id: "del-005", projectId: "proj-002", milestoneId: "ms-002", taskId: "task-008", title: "Design System Components", submittedAt: "2026-03-01T13:00:00Z", submittedBy: "Contributor G-1N", status: "approved", evidenceFiles: 8, decision: "approved", decidedAt: "2026-03-02T10:00:00Z", reviewerNotes: "Beautiful and accessible components." },
  { id: "del-006", projectId: "proj-001", milestoneId: "ms-002", taskId: "task-003", title: "Database Schema v2", submittedAt: "2026-03-04T09:00:00Z", submittedBy: "Contributor B-3K", status: "pending", evidenceFiles: 2 },
];
