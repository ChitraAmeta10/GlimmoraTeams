import type { SOWClause, EthicsScreeningItem, RegulatoryItem, SOWGenerationParams, HallucinationLayerStatus } from "@/types/enterprise";

/* ══════════════════════════════════════════════
   Mock Clauses — tagged from parsed SOW sections
   ══════════════════════════════════════════════ */

export const mockSOWClauses: SOWClause[] = [
  // sow-001: Enterprise Resource Planning Platform
  { id: "cl-001", sowId: "sow-001", text: "Client provides UAT resources within 2 weeks of milestone delivery.", type: "dependency", sectionRef: "Dependencies & Assumptions", confidence: 90, isProhibited: false },
  { id: "cl-002", sowId: "sow-001", text: "Third-party banking API availability for financial module integrations.", type: "dependency", sectionRef: "Dependencies & Assumptions", confidence: 88, isProhibited: false },
  { id: "cl-003", sowId: "sow-001", text: "Access to existing ERP data and schema for migration planning.", type: "assumption", sectionRef: "Dependencies & Assumptions", confidence: 92, isProhibited: false },
  { id: "cl-004", sowId: "sow-001", text: "Client IT team available for environment setup and DNS configuration.", type: "assumption", sectionRef: "Dependencies & Assumptions", confidence: 85, isProhibited: false },
  { id: "cl-005", sowId: "sow-001", text: "Platform must support minimum 10,000 concurrent users under load.", type: "constraint", sectionRef: "Technical Requirements", confidence: 98, isProhibited: false },
  { id: "cl-006", sowId: "sow-001", text: "All infrastructure deployed on AWS EKS with Terraform IaC — no manual provisioning.", type: "constraint", sectionRef: "Technical Requirements", confidence: 96, isProhibited: false },
  { id: "cl-007", sowId: "sow-001", text: "Each deliverable must pass automated test suite with >90% code coverage.", type: "acceptance_criteria", sectionRef: "Acceptance Criteria", confidence: 95, isProhibited: false },
  { id: "cl-008", sowId: "sow-001", text: "Load testing: p95 response time < 200ms for all API endpoints.", type: "acceptance_criteria", sectionRef: "Acceptance Criteria", confidence: 94, isProhibited: false },
  { id: "cl-009", sowId: "sow-001", text: "Final acceptance sign-off required from client product owner.", type: "acceptance_criteria", sectionRef: "Acceptance Criteria", confidence: 96, isProhibited: false },
  { id: "cl-010", sowId: "sow-001", text: "SOC 2 Type II compliance required for all production systems.", type: "security", sectionRef: "Security & Compliance", confidence: 94, isProhibited: false },
  { id: "cl-011", sowId: "sow-001", text: "AES-256 encryption at rest, TLS 1.3 in transit for all data.", type: "security", sectionRef: "Security & Compliance", confidence: 97, isProhibited: false },
  { id: "cl-012", sowId: "sow-001", text: "RBAC with MFA required for all privileged access.", type: "security", sectionRef: "Security & Compliance", confidence: 93, isProhibited: false },
  { id: "cl-013", sowId: "sow-001", text: "6-month post-launch warranty with 24/7 monitoring.", type: "warranty", sectionRef: "Support & Maintenance", confidence: 91, isProhibited: false },
  { id: "cl-014", sowId: "sow-001", text: "4-hour SLA for P1 incidents, 8-hour SLA for P2.", type: "sla", sectionRef: "Support & Maintenance", confidence: 90, isProhibited: false },
  { id: "cl-015", sowId: "sow-001", text: "All intellectual property created during the engagement belongs to the client.", type: "ip", sectionRef: "Security & Compliance", confidence: 92, isProhibited: false },

  // sow-002: Mobile Banking App Redesign
  { id: "cl-020", sowId: "sow-002", text: "PCI DSS Level 1 compliance required for payment processing.", type: "security", sectionRef: "Compliance Requirements", confidence: 96, isProhibited: false },
  { id: "cl-021", sowId: "sow-002", text: "Biometric authentication (fingerprint, face ID) for mobile access.", type: "security", sectionRef: "Security Architecture", confidence: 93, isProhibited: false },
  { id: "cl-022", sowId: "sow-002", text: "App must support iOS 15+ and Android 12+ minimum.", type: "constraint", sectionRef: "Technical Requirements", confidence: 97, isProhibited: false },
  { id: "cl-023", sowId: "sow-002", text: "Offline mode required for balance viewing and recent transactions.", type: "constraint", sectionRef: "Functional Requirements", confidence: 91, isProhibited: false },
  { id: "cl-024", sowId: "sow-002", text: "WCAG 2.1 AA accessibility compliance for all screens.", type: "ethical", sectionRef: "Accessibility", confidence: 94, isProhibited: false },
  { id: "cl-025", sowId: "sow-002", text: "User data must remain within EU data centers (GDPR compliance).", type: "constraint", sectionRef: "Data Residency", confidence: 98, isProhibited: false },
  { id: "cl-026", sowId: "sow-002", text: "Existing mobile banking API must remain backward compatible.", type: "dependency", sectionRef: "Integration Requirements", confidence: 89, isProhibited: false },
  { id: "cl-027", sowId: "sow-002", text: "Performance: app launch < 2s on mid-range devices.", type: "acceptance_criteria", sectionRef: "Performance", confidence: 92, isProhibited: false },
  { id: "cl-028", sowId: "sow-002", text: "Unlimited liability for data breaches involving customer financial data.", type: "liability", sectionRef: "Legal Terms", confidence: 88, isProhibited: true, prohibitedReason: "Unlimited liability clauses violate standard risk allocation policy. Recommend capping at 2x contract value." },

  // sow-003: Supply Chain Analytics Dashboard
  { id: "cl-030", sowId: "sow-003", text: "Real-time data pipeline must achieve < 500ms end-to-end latency.", type: "constraint", sectionRef: "Performance Requirements", confidence: 85, isProhibited: false },
  { id: "cl-031", sowId: "sow-003", text: "Integration with SAP ERP and Oracle SCM required.", type: "dependency", sectionRef: "Integration Requirements", confidence: 78, isProhibited: false },
  { id: "cl-032", sowId: "sow-003", text: "Dashboard must support 500+ concurrent users without degradation.", type: "acceptance_criteria", sectionRef: "Performance Requirements", confidence: 82, isProhibited: false },
  { id: "cl-033", sowId: "sow-003", text: "Data classified as Internal — standard access controls apply.", type: "security", sectionRef: "Data Classification", confidence: 90, isProhibited: false },
  { id: "cl-034", sowId: "sow-003", text: "Non-exclusive license granted to client for derivative analytics models.", type: "ip", sectionRef: "IP Terms", confidence: 76, isProhibited: false },
  { id: "cl-035", sowId: "sow-003", text: "Vendor may use anonymized supply chain data for model improvement.", type: "ip", sectionRef: "IP Terms", confidence: 72, isProhibited: true, prohibitedReason: "Data reuse clause requires explicit opt-in consent. Standard terms prohibit implicit data sharing for vendor benefit." },
  { id: "cl-036", sowId: "sow-003", text: "ISO 27001 certification required for hosting environment.", type: "security", sectionRef: "Security Requirements", confidence: 88, isProhibited: false },

  // sow-004: Healthcare Patient Portal (draft — fewer clauses)
  { id: "cl-040", sowId: "sow-004", text: "HIPAA BAA must be signed before any PHI is processed.", type: "security", sectionRef: "Compliance", confidence: 70, isProhibited: false },
  { id: "cl-041", sowId: "sow-004", text: "System must achieve 99.99% uptime SLA.", type: "sla", sectionRef: "SLA Requirements", confidence: 65, isProhibited: true, prohibitedReason: "99.99% uptime exceeds industry standard for non-critical healthcare portals (99.9%). May create unrealistic contractual obligations." },

  // sow-005: E-Commerce Platform Migration
  { id: "cl-050", sowId: "sow-005", text: "Zero-downtime migration with parallel running period of 30 days.", type: "constraint", sectionRef: "Migration Strategy", confidence: 96, isProhibited: false },
  { id: "cl-051", sowId: "sow-005", text: "All existing customer data (10M+ records) must be migrated with 100% fidelity.", type: "acceptance_criteria", sectionRef: "Data Migration", confidence: 97, isProhibited: false },
  { id: "cl-052", sowId: "sow-005", text: "Platform must handle Black Friday peak: 50K concurrent sessions.", type: "constraint", sectionRef: "Performance", confidence: 95, isProhibited: false },
  { id: "cl-053", sowId: "sow-005", text: "AWS hosting with multi-AZ deployment across us-east-1 and eu-west-1.", type: "constraint", sectionRef: "Infrastructure", confidence: 98, isProhibited: false },
  { id: "cl-054", sowId: "sow-005", text: "PCI DSS Level 2 compliance for payment processing.", type: "security", sectionRef: "Compliance", confidence: 97, isProhibited: false },
  { id: "cl-055", sowId: "sow-005", text: "Rollback capability within 4 hours if migration issues detected.", type: "acceptance_criteria", sectionRef: "Migration Strategy", confidence: 94, isProhibited: false },
  { id: "cl-056", sowId: "sow-005", text: "Termination for convenience with 30-day notice and pro-rata payment.", type: "termination", sectionRef: "Contract Terms", confidence: 93, isProhibited: false },
];

/* ══════════════════════════════════════════════
   Ethics Screening Results — per SOW
   ══════════════════════════════════════════════ */

export const mockEthicsScreening: Record<string, EthicsScreeningItem[]> = {
  "sow-001": [
    { id: "eth-001", criterion: "Non-Discrimination", description: "No discriminatory requirements in hiring or team formation", status: "pass", details: "SOW contains no discriminatory language. Team formation based on skills only." },
    { id: "eth-002", criterion: "Labor Standards", description: "Compliance with ILO and local labor regulations", status: "pass", details: "Work hours, compensation, and conditions align with ILO core conventions." },
    { id: "eth-003", criterion: "Accessibility", description: "WCAG 2.1 AA compliance specified", status: "pass", details: "Accessibility requirements explicitly stated in acceptance criteria." },
    { id: "eth-004", criterion: "Environmental Impact", description: "Green hosting and sustainable practices", status: "warning", details: "No explicit environmental requirements. Recommend adding green hosting clause." },
    { id: "eth-005", criterion: "Data Ethics", description: "Responsible data handling and privacy", status: "pass", details: "Data handling aligns with ethical data processing standards." },
    { id: "eth-006", criterion: "Diversity Targets", description: "Inclusive team composition requirements", status: "not_applicable", details: "No specific diversity targets set. Optional per enterprise policy." },
  ],
  "sow-002": [
    { id: "eth-010", criterion: "Non-Discrimination", description: "No discriminatory requirements in hiring or team formation", status: "pass", details: "SOW language reviewed and clear of discriminatory terms." },
    { id: "eth-011", criterion: "Labor Standards", description: "Compliance with ILO and local labor regulations", status: "pass", details: "All labor standards met." },
    { id: "eth-012", criterion: "Accessibility", description: "WCAG 2.1 AA compliance specified", status: "pass", details: "WCAG 2.1 AA explicitly required for all mobile screens." },
    { id: "eth-013", criterion: "Environmental Impact", description: "Green hosting and sustainable practices", status: "pass", details: "Cloud provider uses 100% renewable energy." },
    { id: "eth-014", criterion: "Data Ethics", description: "Responsible data handling and privacy", status: "pass", details: "GDPR compliance with data minimization principles applied." },
    { id: "eth-015", criterion: "Financial Inclusion", description: "Equitable access to banking services", status: "pass", details: "App designed for inclusive access including low-bandwidth modes." },
  ],
  "sow-003": [
    { id: "eth-020", criterion: "Non-Discrimination", description: "No discriminatory requirements", status: "pass", details: "No issues detected." },
    { id: "eth-021", criterion: "Labor Standards", description: "Compliance with labor regulations", status: "pass", details: "Standards met." },
    { id: "eth-022", criterion: "Accessibility", description: "WCAG compliance", status: "warning", details: "No accessibility requirements specified. Dashboard should meet WCAG 2.1 AA." },
    { id: "eth-023", criterion: "Environmental Impact", description: "Sustainable practices", status: "not_applicable", details: "Not assessed for analytics platform." },
    { id: "eth-024", criterion: "Data Ethics", description: "Responsible data handling", status: "warning", details: "Data reuse clause (cl-035) flagged — vendor data sharing needs explicit consent." },
    { id: "eth-025", criterion: "Supply Chain Transparency", description: "Ethical sourcing of data", status: "pass", details: "Data sources are first-party enterprise systems." },
  ],
  "sow-004": [
    { id: "eth-030", criterion: "Non-Discrimination", description: "No discriminatory requirements", status: "not_applicable", details: "SOW not yet parsed." },
    { id: "eth-031", criterion: "Labor Standards", description: "Compliance with labor regulations", status: "not_applicable", details: "SOW not yet parsed." },
    { id: "eth-032", criterion: "Patient Privacy", description: "HIPAA compliance for patient data", status: "warning", details: "HIPAA BAA clause flagged as potentially hallucinated — needs verification." },
    { id: "eth-033", criterion: "Accessibility", description: "Healthcare accessibility requirements", status: "not_applicable", details: "SOW not yet parsed." },
  ],
  "sow-005": [
    { id: "eth-040", criterion: "Non-Discrimination", description: "No discriminatory requirements", status: "pass", details: "No issues." },
    { id: "eth-041", criterion: "Labor Standards", description: "Compliance with labor regulations", status: "pass", details: "All standards met." },
    { id: "eth-042", criterion: "Accessibility", description: "WCAG compliance", status: "pass", details: "E-commerce platform meets WCAG 2.1 AA." },
    { id: "eth-043", criterion: "Environmental Impact", description: "Sustainable hosting", status: "pass", details: "Multi-region AWS with carbon offset program." },
    { id: "eth-044", criterion: "Data Ethics", description: "Customer data handling", status: "pass", details: "10M+ customer records handled with encryption and access controls." },
    { id: "eth-045", criterion: "Consumer Protection", description: "Fair pricing and transparency", status: "pass", details: "Platform pricing transparency maintained post-migration." },
  ],
};

/* ══════════════════════════════════════════════
   Regulatory Alignment — per SOW
   ══════════════════════════════════════════════ */

export const mockRegulatoryAlignment: Record<string, RegulatoryItem[]> = {
  "sow-001": [
    { id: "reg-001", regulation: "SOC 2 Type II", description: "Service Organization Control audit compliance", status: "compliant", notes: "Explicitly required in security section." },
    { id: "reg-002", regulation: "GDPR (EU)", description: "General Data Protection Regulation", status: "partial", notes: "Data handling covered but no explicit DPO designation." },
    { id: "reg-003", regulation: "ISO 27001", description: "Information security management", status: "compliant", notes: "Security controls align with ISO 27001 Annex A." },
  ],
  "sow-002": [
    { id: "reg-010", regulation: "PCI DSS Level 1", description: "Payment Card Industry Data Security Standard", status: "compliant", notes: "Explicitly required for payment processing." },
    { id: "reg-011", regulation: "GDPR (EU)", description: "General Data Protection Regulation", status: "compliant", notes: "EU data residency and GDPR compliance fully specified." },
    { id: "reg-012", regulation: "PSD2 (EU)", description: "Payment Services Directive 2", status: "compliant", notes: "Strong Customer Authentication (SCA) implemented." },
    { id: "reg-013", regulation: "RBI Guidelines", description: "Reserve Bank of India digital payment guidelines", status: "partial", notes: "Partial coverage — needs review for Indian market launch." },
  ],
  "sow-003": [
    { id: "reg-020", regulation: "ISO 27001", description: "Information security management", status: "compliant", notes: "Required for hosting environment." },
    { id: "reg-021", regulation: "SOC 2 Type I", description: "Service Organization Control audit", status: "not_assessed", notes: "Not explicitly mentioned in SOW." },
    { id: "reg-022", regulation: "GDPR (EU)", description: "General Data Protection Regulation", status: "partial", notes: "Supply chain data may contain EU personal data — needs assessment." },
  ],
  "sow-004": [
    { id: "reg-030", regulation: "HIPAA", description: "Health Insurance Portability and Accountability Act", status: "partial", notes: "BAA clause present but may be hallucinated — needs verification." },
    { id: "reg-031", regulation: "HITECH Act", description: "Health Information Technology for Economic and Clinical Health", status: "not_assessed", notes: "Not yet assessed — SOW in draft." },
  ],
  "sow-005": [
    { id: "reg-040", regulation: "PCI DSS Level 2", description: "Payment Card Industry Data Security Standard", status: "compliant", notes: "Required for e-commerce payment processing." },
    { id: "reg-041", regulation: "GDPR (EU)", description: "General Data Protection Regulation", status: "compliant", notes: "EU customer data handling fully compliant." },
    { id: "reg-042", regulation: "CCPA", description: "California Consumer Privacy Act", status: "compliant", notes: "US customer privacy rights supported." },
    { id: "reg-043", regulation: "ISO 27001", description: "Information security management", status: "compliant", notes: "AWS infrastructure ISO 27001 certified." },
  ],
};

/* ══════════════════════════════════════════════
   AI Generation Parameters — for AI-generated SOWs only
   ══════════════════════════════════════════════ */

export const mockGenerationParams: Record<string, SOWGenerationParams> = {
  "sow-002": {
    templateUsed: "FinTech Mobile Application",
    templateId: "tpl-fintech",
    industry: "Financial Services",
    projectType: "Mobile App Redesign",
    wizardStepsCompleted: 10,
    totalWizardSteps: 10,
    generatedAt: "2026-02-20T09:15:00Z",
    generationDuration: "12 min 34 sec",
    guardrailsPassed: 8,
    totalGuardrails: 8,
  },
  "sow-004": {
    templateUsed: "Healthcare Patient Portal",
    templateId: "tpl-healthcare",
    industry: "Healthcare",
    projectType: "Patient Portal",
    wizardStepsCompleted: 4,
    totalWizardSteps: 10,
    generatedAt: "2026-03-05T08:30:00Z",
    generationDuration: "In progress",
    guardrailsPassed: 3,
    totalGuardrails: 8,
  },
};

/* ══════════════════════════════════════════════
   8-Layer Hallucination Prevention Status
   ══════════════════════════════════════════════ */

export const mockHallucinationLayers: Record<string, HallucinationLayerStatus[]> = {
  "sow-002": [
    { layer: 1, name: "Input Validation", description: "Schema enforcement on every parameter", status: "passed", details: "All 10 wizard parameters validated against schema." },
    { layer: 2, name: "Template Locking", description: "Immutable clause structures prevent drift", status: "passed", details: "FinTech template clauses locked — no structural deviation." },
    { layer: 3, name: "Clause Library", description: "Pre-vetted legal & technical clause bank", status: "passed", details: "12 clauses sourced from vetted library. 1 custom clause flagged for review." },
    { layer: 4, name: "Completeness Checks", description: "Every required section validated pre-output", status: "passed", details: "All 8 required sections present and populated." },
    { layer: 5, name: "Confidence Scoring", description: "Per-section confidence with 90% min gate", status: "passed", details: "All sections above 90% threshold. Lowest: 91% (Security Architecture)." },
    { layer: 6, name: "Pattern Matching", description: "Cross-reference against industry baselines", status: "passed", details: "SOW structure matches 94% of FinTech industry baseline patterns." },
    { layer: 7, name: "Human Approval", description: "Mandatory review gate before finalization", status: "passed", details: "Reviewed and approved by Priya Nair on 2026-02-20." },
    { layer: 8, name: "Audit Logging", description: "Every AI decision logged with full trace", status: "passed", details: "47 AI decisions logged with full provenance chain." },
  ],
  "sow-004": [
    { layer: 1, name: "Input Validation", description: "Schema enforcement on every parameter", status: "passed", details: "4 of 10 wizard parameters validated." },
    { layer: 2, name: "Template Locking", description: "Immutable clause structures prevent drift", status: "passed", details: "Healthcare template loaded." },
    { layer: 3, name: "Clause Library", description: "Pre-vetted legal & technical clause bank", status: "warning", details: "HIPAA BAA clause not found in library — may be hallucinated." },
    { layer: 4, name: "Completeness Checks", description: "Every required section validated", status: "failed", details: "0 of 12 required sections completed. Wizard incomplete." },
    { layer: 5, name: "Confidence Scoring", description: "Per-section confidence with 90% min gate", status: "skipped", details: "No sections generated yet." },
    { layer: 6, name: "Pattern Matching", description: "Cross-reference against industry baselines", status: "skipped", details: "Insufficient data for pattern matching." },
    { layer: 7, name: "Human Approval", description: "Mandatory review gate", status: "skipped", details: "Not yet submitted for review." },
    { layer: 8, name: "Audit Logging", description: "AI decision logging", status: "passed", details: "12 AI decisions logged so far." },
  ],
};

/* ══════════════════════════════════════════════
   Data Sensitivity Handling Requirements
   ══════════════════════════════════════════════ */

export const sensitivityHandlingRequirements: Record<string, string[]> = {
  public: [
    "No special handling required",
    "Can be shared externally",
    "Standard access controls",
  ],
  internal: [
    "Internal access only — no external sharing without approval",
    "Standard encryption at rest",
    "Access logging required",
  ],
  confidential: [
    "Need-to-know access only",
    "AES-256 encryption at rest and in transit",
    "Full audit trail for all access",
    "Data Loss Prevention (DLP) controls active",
    "No data export without management approval",
  ],
  restricted: [
    "Named-user access with explicit authorization",
    "Hardware security module (HSM) key management",
    "Full audit trail with tamper-proof logging",
    "Data Loss Prevention (DLP) with real-time alerting",
    "Geographic data residency restrictions enforced",
    "Quarterly access review required",
    "Incident response plan activated",
  ],
};
