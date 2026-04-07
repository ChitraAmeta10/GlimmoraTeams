/* ══════════════════════════════════════════════════════════════
   Enterprise Admin Console — TypeScript Interfaces
   All mock entities cross-reference by ID for seamless drill-down
   ══════════════════════════════════════════════════════════════ */

export type SowStatus = "draft" | "in_review" | "pending_commercial_review" | "approved" | "rejected" | "archived";
export type SowIntakeMode = "ai_generated" | "manual_upload";
export type DataSensitivity = "public" | "internal" | "confidential" | "restricted";
export type ConfidentialityLevel = "public" | "internal" | "confidential" | "restricted";
export type PlanStatus = "draft" | "pending_review" | "approved" | "in_progress" | "completed";
export type DependencyType = "blocks" | "related";
export type SkillSource = "ai" | "manual";
export type DecompositionItemStatus = "proposed" | "accepted" | "modified" | "deleted";
export type TeamStatus = "forming" | "ready" | "approved" | "active" | "disbanded";
export type ProjectHealth = "on_track" | "at_risk" | "behind" | "completed";
export type TaskStatus = "backlog" | "in_progress" | "in_review" | "rework" | "accepted" | "rejected";
export type MilestoneStatus = "upcoming" | "in_progress" | "completed" | "overdue";
export type ReviewDecision = "approved" | "rejected" | "rework_requested";
export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue" | "cancelled";
export type EscrowStatus = "held" | "partially_released" | "released" | "disputed";
export type AuditAction = "created" | "updated" | "approved" | "rejected" | "escalated" | "completed" | "archived";
export type UserRole = "owner" | "admin" | "manager" | "viewer";
export type NotificationChannel = "email" | "in_app" | "slack" | "webhook";

/* ── SOW Approval Pipeline (5-Stage per FSD v2.7) ── */
export type ApprovalStage = "business" | "commercial" | "legal" | "security" | "final";
export type ApprovalStageStatus = "pending" | "in_review" | "approved" | "rejected";

export interface SOWApprovalStage {
  stage: ApprovalStage;
  status: ApprovalStageStatus;
  reviewer?: string;
  reviewedAt?: string;
  comments?: string;
}

/* ── Risk & Hallucination (SOW V2.1 Section 6.2.7 + UX Flow B4) ── */
export interface RiskScoreBreakdown {
  completeness: number;
  confidence: number;
  compliance: number;
  patternMatch: number;
  overall: number;
}

export interface HallucinationFlag {
  id: string;
  clause: string;
  severity: "low" | "medium" | "high";
  reason: string;
  suggestion: string;
  resolved: boolean;
}

/* ── SOW ── */
export interface SOW {
  id: string;
  title: string;
  client: string;
  status: SowStatus;
  intakeMode: SowIntakeMode;
  confidentiality: ConfidentialityLevel;
  dataSensitivity: DataSensitivity;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  fileSize: string;
  pages: number;
  parsedSections: number;
  totalSections: number;
  aiConfidence: number;
  riskScore: RiskScoreBreakdown;
  tags: string[];
  estimatedBudget: number;
  estimatedDuration: string;
  planId?: string;
  stakeholders: string[];
  slaCompliance?: number;
  hallucinationFlags?: HallucinationFlag[];
  templateId?: string;
  industry?: string;
  gapAnalysisScore?: number;
  approvalStages: SOWApprovalStage[];
}

export interface SOWSection {
  id: string;
  sowId: string;
  title: string;
  content: string;
  aiSuggestion?: string;
  confidence: number;
  order: number;
}

export interface DecompositionPlan {
  id: string;
  sowId: string;
  title: string;
  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
  totalTasks: number;
  totalSubtasks: number;
  totalMilestones: number;
  estimatedHours: number;
  estimatedCost: number;
  complexity: "low" | "medium" | "high" | "critical";
  version: number;
  teamId?: string;
  projectId?: string;
  aiConfidence: number;
  criticalPathDuration: number;
  uniqueSkills: number;
  dependencyCount: number;
}

export interface PlanMilestone {
  id: string;
  planId: string;
  title: string;
  description: string;
  order: number;
  estimatedHours: number;
  taskCount: number;
  subtaskCount: number;
  itemStatus: DecompositionItemStatus;
  aiConfidence: number;
}

export interface DecompositionTask {
  id: string;
  planId: string;
  milestoneId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high" | "critical";
  estimatedHours: number;
  skillsRequired: SkillTag[];
  dependencies: TaskDependency[];
  phase: number;
  order: number;
  assigneeId?: string;
  acceptanceCriteria: string[];
  aiConfidence: number;
  itemStatus: DecompositionItemStatus;
  subtasks: Subtask[];
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  estimatedHours: number;
  skillsRequired: SkillTag[];
  itemStatus: DecompositionItemStatus;
  aiConfidence: number;
}

export interface SkillTag {
  name: string;
  source: SkillSource;
  confidence?: number;
  proficiency?: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface TaskDependency {
  targetId: string;
  type: DependencyType;
}

export interface AIRecommendation {
  id: string;
  planId: string;
  type: "split" | "dependency" | "skill_gap" | "effort" | "risk";
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  affectedTaskId?: string;
  suggestion: string;
  dismissed: boolean;
}

export interface PlanValidationResult {
  field: string;
  status: "passed" | "warning" | "error";
  message: string;
}

export interface PlanVersion {
  version: number;
  createdAt: string;
  createdBy: string;
  changes: string;
  status: PlanStatus;
}

export type AssignmentStatus = "pending_response" | "accepted" | "declined" | "timed_out";

export interface TeamPool {
  id: string;
  planId: string;
  projectId?: string;
  name: string;
  status: TeamStatus;
  createdAt: string;
  matchScore: number;
  totalMembers: number;
  requiredSkills: string[];
  members: TeamMember[];
  taskAssignments?: Record<string, string>; /* taskId → memberId */
}

export interface TeamMember {
  id: string;
  anonymousId: string;
  displayName: string;
  avatar: string;
  skills: string[];
  matchScore: number;
  availability: "full_time" | "part_time" | "limited";
  track: "women" | "student" | "general";
  tasksCompleted: number;
  rating: number;
  whyMatched?: string;
}

export interface Assignment {
  id: string;
  teamId: string;
  teamName: string;
  memberId: string;
  memberDisplayName: string;
  memberAvatar: string;
  taskId: string;
  taskTitle: string;
  projectName: string;
  status: AssignmentStatus;
  sentAt: string;
  respondBy: string;
  respondedAt?: string;
  declineReason?: string;
}

export interface Project {
  id: string;
  planId: string;
  sowId: string;
  teamId: string;
  title: string;
  client: string;
  health: ProjectHealth;
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  teamSize: number;
  milestones: Milestone[];
  tasksTotal: number;
  tasksCompleted: number;
  apgScore: number;
  escalations: number;
  slaCompliance: number;
  sowTitle: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  status: MilestoneStatus;
  dueDate: string;
  progress: number;
  tasksTotal: number;
  tasksCompleted: number;
  deliverables: number;
  budget: number;
}

export interface Deliverable {
  id: string;
  projectId: string;
  milestoneId: string;
  taskId: string;
  title: string;
  submittedAt: string;
  submittedBy: string;
  status: "pending" | "approved" | "rejected" | "rework";
  evidenceFiles: number;
  reviewerNotes?: string;
  decision?: ReviewDecision;
  decidedAt?: string;
}

export interface Invoice {
  id: string;
  projectId: string;
  number: string;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  currency: string;
  lineItems: InvoiceLineItem[];
  milestoneId?: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface EscrowAccount {
  id: string;
  projectId: string;
  status: EscrowStatus;
  totalFunded: number;
  totalReleased: number;
  totalHeld: number;
  currency: string;
  releases: EscrowRelease[];
}

export interface EscrowRelease {
  id: string;
  milestoneId: string;
  amount: number;
  releasedAt: string;
  approvedBy: string;
  status: "pending" | "approved" | "released";
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: AuditAction;
  resource: string;
  resourceType: "sow" | "plan" | "team" | "project" | "review" | "billing" | "user" | "config";
  details: string;
  ipAddress: string;
}

export interface OrgUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "invited" | "suspended";
  joinedAt: string;
  lastActive: string;
  avatar?: string;
  department?: string;
  projectsManaged: number;
  actionsCount: number;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
}

export interface APGRule {
  id: string;
  name: string;
  description: string;
  category: "quality" | "timeline" | "budget" | "escalation" | "sla";
  enabled: boolean;
  threshold: number;
  action: string;
}

export interface NotificationRule {
  id: string;
  event: string;
  channels: NotificationChannel[];
  enabled: boolean;
  recipients: string[];
}

export interface AnalyticsMetric {
  label: string;
  value: number;
  change: number;
  changeType: "positive" | "negative" | "neutral";
  unit?: string;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}

export interface AnalyticsDataset {
  id: string;
  title: string;
  metrics: AnalyticsMetric[];
  timeSeries: TimeSeriesPoint[];
}

/* ── SOW Clauses (B6 Step 3: tagged clauses with types) ── */
export type ClauseType = "dependency" | "assumption" | "constraint" | "acceptance_criteria" | "ethical" | "security" | "ip" | "liability" | "confidentiality" | "sla" | "warranty" | "termination";

export interface SOWClause {
  id: string;
  sowId: string;
  text: string;
  type: ClauseType;
  sectionRef: string;
  confidence: number;
  isProhibited: boolean;
  prohibitedReason?: string;
}

/* ── Ethics Screening (B6 Step 6) ── */
export interface EthicsScreeningItem {
  id: string;
  criterion: string;
  description: string;
  status: "pass" | "fail" | "warning" | "not_applicable";
  details: string;
}

/* ── Regulatory Alignment (B6 Step 6) ── */
export interface RegulatoryItem {
  id: string;
  regulation: string;
  description: string;
  status: "compliant" | "non_compliant" | "partial" | "not_assessed";
  notes: string;
}

/* ── AI Generation Parameters (B6 Step 5 — for AI-Generated SOWs) ── */
export interface SOWGenerationParams {
  templateUsed: string;
  templateId: string;
  industry: string;
  projectType: string;
  wizardStepsCompleted: number;
  totalWizardSteps: number;
  generatedAt: string;
  generationDuration: string;
  guardrailsPassed: number;
  totalGuardrails: number;
}

/* ── 8-Layer Hallucination Prevention Status (B6 Step 5) ── */
export interface HallucinationLayerStatus {
  layer: number;
  name: string;
  description: string;
  status: "passed" | "warning" | "failed" | "skipped";
  details: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  actor: string;
  initials: string;
  action: string;
  target: string;
  type: "task" | "review" | "payment" | "escalation" | "milestone" | "sow" | "team";
  color: string;
}
