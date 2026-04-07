"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  UsersRound,
  Layers,
  Clock,
  Target,
  ArrowRight,
  Sparkles,
  Brain,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Send,
  UserCheck,
  Timer,
  X,
  Search,
  Wand2,
  UserCog,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, fadeIn, scaleIn } from "@/lib/utils/motion-variants";
import {
  Badge,
  Progress,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from "@/components/ui";
import { MetricRing } from "@/components/enterprise/metric-ring";
import {
  mockTeams,
  mockPlans,
  mockAssignments,
} from "@/mocks/data/enterprise-projects";
import type {
  TeamPool,
  Assignment,
  DecompositionPlan,
  TeamStatus,
  AssignmentStatus,
} from "@/types/enterprise";

/* ══════════════════════════════════════════════════════════════
   CONSTANTS & CONFIGS
   ══════════════════════════════════════════════════════════════ */

const NOW = new Date();

const teamStatusConfig: Record<
  TeamStatus,
  { variant: "gold" | "teal" | "forest" | "brown" | "beige"; label: string }
> = {
  forming: { variant: "gold", label: "Forming" },
  ready: { variant: "teal", label: "Ready" },
  approved: { variant: "forest", label: "Approved" },
  active: { variant: "brown", label: "Active" },
  disbanded: { variant: "beige", label: "Disbanded" },
};

const assignmentStatusConfig: Record<
  AssignmentStatus,
  { variant: "gold" | "forest" | "brown" | "beige"; label: string }
> = {
  pending_response: { variant: "gold", label: "Pending" },
  accepted: { variant: "forest", label: "Accepted" },
  declined: { variant: "brown", label: "Declined" },
  timed_out: { variant: "beige", label: "Timed Out" },
};

const complexityConfig: Record<
  string,
  { variant: "forest" | "teal" | "gold" | "brown"; label: string }
> = {
  low: { variant: "forest", label: "Low" },
  medium: { variant: "teal", label: "Medium" },
  high: { variant: "gold", label: "High" },
  critical: { variant: "brown", label: "Critical" },
};

/* ── Derived data ── */
function getFormationQueueItems(): {
  plan: DecompositionPlan;
  team?: TeamPool;
}[] {
  const items: { plan: DecompositionPlan; team?: TeamPool }[] = [];

  /* Plans with status "approved" that need team formation */
  const approvedPlans = mockPlans.filter((p) => p.status === "approved");
  for (const plan of approvedPlans) {
    const team = mockTeams.find((t) => t.planId === plan.id);
    if (!team || team.status === "forming" || team.status === "ready") {
      items.push({ plan, team });
    }
  }

  /* Teams that are forming/ready but whose plan isn't "approved" (catch-all) */
  const formingTeams = mockTeams.filter(
    (t) =>
      (t.status === "forming" || t.status === "ready") &&
      !items.some((i) => i.team?.id === t.id)
  );
  for (const team of formingTeams) {
    const plan = mockPlans.find((p) => p.id === team.planId);
    if (plan) items.push({ plan, team });
  }

  return items;
}

function getActiveTeams(): TeamPool[] {
  return mockTeams.filter((t) => t.status === "active");
}

function getPendingAssignments(): Assignment[] {
  return mockAssignments;
}

function getHoursLeft(respondBy: string): number {
  const deadline = new Date(respondBy);
  return (deadline.getTime() - NOW.getTime()) / (1000 * 60 * 60);
}

function getSlaColor(hoursLeft: number): {
  label: string;
  text: string;
  bg: string;
  dot: string;
  ring: string;
} {
  if (hoursLeft > 48)
    return {
      label: "Safe",
      text: "text-forest-700",
      bg: "bg-forest-50",
      dot: "bg-forest-500",
      ring: "ring-forest-200",
    };
  if (hoursLeft > 24)
    return {
      label: "Normal",
      text: "text-teal-700",
      bg: "bg-teal-50",
      dot: "bg-teal-500",
      ring: "ring-teal-200",
    };
  if (hoursLeft > 12)
    return {
      label: "Approaching",
      text: "text-gold-700",
      bg: "bg-gold-50",
      dot: "bg-gold-500",
      ring: "ring-gold-200",
    };
  return {
    label: "Critical",
    text: "text-gray-700",
    bg: "bg-brown-50",
    dot: "bg-brown-600",
    ring: "ring-brown-200",
  };
}

function formatHoursLeft(hoursLeft: number): string {
  if (hoursLeft <= 0) return "Expired";
  if (hoursLeft < 1) return `${Math.round(hoursLeft * 60)}m`;
  if (hoursLeft < 24) return `${Math.round(hoursLeft)}h`;
  const days = Math.floor(hoursLeft / 24);
  const hrs = Math.round(hoursLeft % 24);
  return `${days}d ${hrs}h`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ══════════════════════════════════════════════════════════════
   MINI STAT CARD
   ══════════════════════════════════════════════════════════════ */
function MiniStat({
  label,
  value,
  icon: Icon,
  accent,
  subtext,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent: string;
  subtext?: string;
}) {
  return (
    <motion.div variants={scaleIn} className="card-parchment flex items-center gap-5 px-5 py-5">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", accent)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-medium text-gray-400">{label}</div>
        <div className="num-display text-[28px] text-gray-900 leading-none mt-1">{value}</div>
        {subtext && <div className="text-[10px] text-gray-400 mt-1">{subtext}</div>}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   FORMATION QUEUE CARD
   ══════════════════════════════════════════════════════════════ */
function FormationQueueCard({
  plan,
  team,
}: {
  plan: DecompositionPlan;
  team?: TeamPool;
}) {
  const [formTeamOpen, setFormTeamOpen] = React.useState(false);
  const complexity = complexityConfig[plan.complexity];
  const matchColor = team
    ? team.matchScore >= 90
      ? "forest"
      : team.matchScore >= 80
        ? "teal"
        : "gold"
    : "brown";

  return (
    <motion.div variants={fadeUp}>
      <div className="card-parchment overflow-hidden hover:shadow-md transition-all duration-300">
        <div className="p-5">
          {/* Top row: Plan info */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-bold text-gray-900 truncate">
                {plan.title}
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                SOW: {plan.sowId} &middot; {plan.totalTasks} tasks &middot;{" "}
                {plan.estimatedHours.toLocaleString()}h estimated
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-3">
              <Badge variant={complexity.variant} size="sm">
                {complexity.label}
              </Badge>
              {team && (
                <Badge variant={teamStatusConfig[team.status].variant} size="sm" dot>
                  {teamStatusConfig[team.status].label}
                </Badge>
              )}
            </div>
          </div>

          {/* Required skills */}
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            {(team?.requiredSkills ?? []).slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-100/50"
              >
                {skill}
              </span>
            ))}
            {(team?.requiredSkills?.length ?? 0) > 5 && (
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-gray-200 text-gray-400">
                +{(team?.requiredSkills?.length ?? 0) - 5}
              </span>
            )}
          </div>

          {/* Bottom row: Action area */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            {team ? (
              <>
                {/* Team exists - show match score + members + action */}
                <div className="flex items-center gap-4">
                  <MetricRing
                    value={team.matchScore}
                    size={52}
                    strokeWidth={4}
                    color={matchColor}
                    label="Match"
                  />
                  <div>
                    <p className="text-[12px] font-semibold text-gray-800">
                      {team.totalMembers} contributors matched
                    </p>
                    <div className="flex -space-x-1.5 mt-1">
                      {team.members.slice(0, 4).map((m) => (
                        <div
                          key={m.id}
                          className="w-6 h-6 rounded-full bg-gradient-to-br from-brown-300 to-brown-400 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white"
                        >
                          {m.avatar}
                        </div>
                      ))}
                      {team.totalMembers > 4 && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-500">
                          +{team.totalMembers - 4}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  href={`/enterprise/team/${team.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-brown-500 to-brown-600 text-white text-[11px] font-semibold shadow-sm hover:shadow-md hover:from-brown-600 hover:to-brown-700 transition-all group/btn"
                >
                  Review Matches
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </>
            ) : (
              <>
                {/* No team yet — trigger matching engine */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-gold-500" />
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Ready for AI matching
                  </p>
                </div>
                <button
                  onClick={() => setFormTeamOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-white text-[11px] font-semibold shadow-sm hover:shadow-md hover:from-gold-600 hover:to-gold-700 transition-all group/btn"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Form Team
                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
                <FormTeamDialog
                  open={formTeamOpen}
                  onOpenChange={setFormTeamOpen}
                  plan={plan}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ACTIVE TEAM CARD
   ══════════════════════════════════════════════════════════════ */
function ActiveTeamCard({ team }: { team: TeamPool }) {
  const plan = mockPlans.find((p) => p.id === team.planId);
  const matchColor =
    team.matchScore >= 90
      ? "forest"
      : team.matchScore >= 80
        ? "teal"
        : "gold";

  return (
    <motion.div variants={fadeUp}>
      <Link
        href={`/enterprise/team/${team.id}`}
        className="group block"
      >
        <div className="card-parchment p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-bold text-gray-900 group-hover:text-gray-700 transition-colors truncate">
                {team.name}
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {plan?.title ?? team.planId}
              </p>
            </div>
            <Badge variant={teamStatusConfig[team.status].variant} size="sm" dot>
              {teamStatusConfig[team.status].label}
            </Badge>
          </div>

          {/* Middle: Match ring + avatar stack */}
          <div className="flex items-center gap-5">
            <MetricRing
              value={team.matchScore}
              size={64}
              strokeWidth={5}
              color={matchColor}
              label="Match"
            />
            <div className="flex-1 space-y-3">
              {/* Avatar stack */}
              <div>
                <p className="text-[10px] text-gray-400 mb-1.5">Team</p>
                <div className="flex -space-x-2">
                  {team.members.slice(0, 4).map((m) => (
                    <TooltipProvider key={m.id} delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brown-300 to-brown-500 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white cursor-default hover:scale-110 hover:z-10 transition-transform">
                            {m.avatar}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-[11px]">{m.displayName}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {team.totalMembers > 4 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[9px] font-bold text-gray-500">
                      +{team.totalMembers - 4}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <UsersRound className="w-3 h-3 text-gray-400" />
                  <span className="text-[11px] font-semibold text-gray-800">
                    {team.totalMembers}
                  </span>
                  <span className="text-[10px] text-gray-400">members</span>
                </div>
                <div className="w-px h-4 bg-gray-200" />
                <div className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-gray-400" />
                  <span className="text-[11px] font-semibold text-gray-800">
                    {team.requiredSkills.length}
                  </span>
                  <span className="text-[10px] text-gray-400">skills</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="flex items-center gap-1.5 mt-4 flex-wrap">
            {team.requiredSkills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-500"
              >
                {skill}
              </span>
            ))}
            {team.requiredSkills.length > 4 && (
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-gray-200 text-gray-400">
                +{team.requiredSkills.length - 4}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-forest-400" />
              <span className="text-[10px] text-gray-400">
                Anonymized &middot; AI-governed
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brown-500 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   FORM TEAM DIALOG (SOW Flow D1 — Trigger Matching Engine)
   ══════════════════════════════════════════════════════════════ */
type FormTeamStep = "confirm" | "matching" | "success";

function FormTeamDialog({
  open,
  onOpenChange,
  plan,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  plan: DecompositionPlan;
}) {
  const [step, setStep] = React.useState<FormTeamStep>("confirm");

  const handleStart = () => {
    setStep("matching");
    /* Simulate AI matching engine */
    setTimeout(() => setStep("success"), 2200);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => setStep("confirm"), 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[480px]">
        {step === "confirm" && (
          <>
            <DialogHeader>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center mx-auto mb-3 shadow-md shadow-gold-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-center text-[17px]">
                Start Team Formation
              </DialogTitle>
              <DialogDescription className="text-center text-[12px]">
                The AI Matching Engine will analyze the Skill Genome to find the
                best contributors for &ldquo;{plan.title}&rdquo;.
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400">Tasks to staff</span>
                <span className="font-semibold text-gray-800">{plan.totalTasks}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400">Estimated hours</span>
                <span className="font-semibold text-gray-800">{plan.estimatedHours.toLocaleString()}h</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400">Complexity</span>
                <Badge variant={complexityConfig[plan.complexity].variant} size="sm">
                  {complexityConfig[plan.complexity].label}
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-teal-50/60 border border-teal-100/50 mb-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-teal-700 leading-relaxed">
                Contributors are matched anonymously based on verified skills.
                No resumes, no bidding, no bias. Each match includes an
                AI-generated explanation.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" size="md" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="gradient-primary" size="md" onClick={handleStart}>
                <Brain className="w-3.5 h-3.5" />
                Run Matching Engine
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "matching" && (
          <div className="py-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 mx-auto mb-5 flex items-center justify-center shadow-md"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <p className="text-[14px] font-semibold text-gray-900">
              Matching Engine Running...
            </p>
            <p className="text-[11px] text-gray-400 mt-1 max-w-[280px] mx-auto">
              Analyzing Skill Genome data across contributor pool for{" "}
              {plan.totalTasks} tasks
            </p>
            <div className="mt-4 max-w-[200px] mx-auto">
              <Progress value={65} className="h-1.5" />
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-forest-400 to-forest-600 mx-auto mb-5 flex items-center justify-center shadow-md"
            >
              <CheckCircle2 className="w-7 h-7 text-white" />
            </motion.div>
            <h3 className="text-[16px] font-bold text-gray-900 mb-1">
              Team Matched Successfully
            </h3>
            <p className="text-[12px] text-gray-500 max-w-[320px] mx-auto mb-1">
              Found optimal contributors for all {plan.totalTasks} tasks with
              a 92% average match score.
            </p>
            <p className="text-[11px] text-gray-400 mb-6">
              Review the proposed team composition before sending invitations
            </p>

            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" onClick={handleClose}>
                Close
              </Button>
              <Link href={`/enterprise/team/team-001`}>
                <Button variant="gradient-primary" size="sm">
                  <ArrowRight className="w-3 h-3" />
                  Review Matches
                </Button>
              </Link>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ══════════════════════════════════════════════════════════════
   REASSIGNMENT DIALOG (SOW Flows D3 + D5)
   — Shows decline reason (D5 Step 1)
   — Method-specific sub-flows (D5 Steps 3a-3c)
   — Admin Override with mandatory reason + audit warning (D3)
   ══════════════════════════════════════════════════════════════ */
const reassignMethods = [
  {
    id: "next_best" as const,
    label: "Next Best Match",
    description: "Auto-select next ranked candidate from matching results",
    icon: Wand2,
    accent: "bg-forest-100 text-forest-600",
  },
  {
    id: "rerun" as const,
    label: "Re-run Matching",
    description: "Fresh matching run excluding the previous contributor",
    icon: RefreshCw,
    accent: "bg-teal-100 text-teal-600",
  },
  {
    id: "manual" as const,
    label: "Manual Selection",
    description: "Search and pick a contributor directly",
    icon: Search,
    accent: "bg-gold-100 text-gold-600",
  },
  {
    id: "override" as const,
    label: "Admin Override",
    description: "Assign any contributor with mandatory reason (audit logged)",
    icon: UserCog,
    accent: "bg-brown-100 text-brown-600",
  },
];

/* Mock candidates for sub-flow steps */
const mockNextCandidate = {
  id: "m-025",
  avatar: "N3",
  displayName: "Contributor N-3W",
  matchScore: 84,
  skills: ["Mobile", "iOS", "Swift"],
  deliveries: 18,
  rating: 4.5,
  whyMatched:
    "84% skills overlap on Mobile + iOS. 18 completed deliveries with 4.5 avg rating. Available immediately with full-time capacity.",
};

const mockRerunCandidates = [
  { id: "m-025", avatar: "N3", displayName: "Contributor N-3W", matchScore: 84, skills: ["Mobile", "iOS", "Swift"] },
  { id: "m-026", avatar: "O5", displayName: "Contributor O-5K", matchScore: 81, skills: ["Mobile", "Android", "Kotlin"] },
  { id: "m-027", avatar: "P9", displayName: "Contributor P-9J", matchScore: 78, skills: ["Mobile", "React Native"] },
];

const mockSearchResults = [
  { id: "m-028", avatar: "R1", displayName: "Contributor R-1X", matchScore: 76, skills: ["Mobile", "Flutter"] },
  { id: "m-029", avatar: "S4", displayName: "Contributor S-4B", matchScore: 72, skills: ["iOS", "Objective-C"] },
  { id: "m-025", avatar: "N3", displayName: "Contributor N-3W", matchScore: 84, skills: ["Mobile", "iOS", "Swift"] },
];

type ReassignMethod = (typeof reassignMethods)[number]["id"];
type ReassignStep = "select_method" | "method_detail" | "processing" | "success";

function ReassignDialog({
  open,
  onOpenChange,
  assignment,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  assignment: Assignment;
}) {
  const [method, setMethod] = React.useState<ReassignMethod | null>(null);
  const [step, setStep] = React.useState<ReassignStep>("select_method");
  const [overrideReason, setOverrideReason] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCandidate, setSelectedCandidate] = React.useState<string | null>(null);

  const handleMethodContinue = () => {
    if (!method) return;
    setStep("method_detail");
  };

  const handleAssign = () => {
    if (method === "override" && !overrideReason.trim()) return;
    setStep("processing");
    setTimeout(() => setStep("success"), 1500);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setMethod(null);
      setStep("select_method");
      setOverrideReason("");
      setSearchQuery("");
      setSelectedCandidate(null);
    }, 200);
  };

  const filteredSearchResults = searchQuery.trim()
    ? mockSearchResults.filter(
        (c) =>
          c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : mockSearchResults;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[540px]">
        {/* ── Step 1: Method selection + decline reason ── */}
        {step === "select_method" && (
          <>
            <DialogHeader>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brown-500 to-brown-600 flex items-center justify-center mx-auto mb-3 shadow-md shadow-brown-500/20">
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-center text-[17px]">
                Reassign Task
              </DialogTitle>
              <DialogDescription className="text-center text-[12px]">
                &ldquo;{assignment.taskTitle}&rdquo; was declined by{" "}
                {assignment.memberDisplayName}. Choose a reassignment method.
              </DialogDescription>
            </DialogHeader>

            {/* Decline reason (SOW D5 Step 1) */}
            {assignment.declineReason && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-brown-50/60 border border-brown-200/40 mt-1">
                <AlertTriangle className="w-4 h-4 text-brown-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-semibold text-gray-700 mb-0.5">
                    Decline Reason
                  </p>
                  <p className="text-[11px] text-brown-600 leading-relaxed">
                    {assignment.declineReason}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2 my-4">
              {reassignMethods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left",
                    method === m.id
                      ? "border-brown-300 bg-brown-50/60 ring-1 ring-brown-200"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-white/90"
                  )}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                      m.accent
                    )}
                  >
                    <m.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-gray-900">
                      {m.label}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {m.description}
                    </p>
                  </div>
                  {method === m.id && (
                    <CheckCircle2 className="w-4 h-4 text-brown-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" size="md" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="gradient-primary"
                size="md"
                onClick={handleMethodContinue}
                disabled={!method}
              >
                Continue
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ── Step 2: Method-specific sub-flow ── */}
        {step === "method_detail" && method === "next_best" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-[15px]">
                Next Best Match
              </DialogTitle>
              <DialogDescription className="text-[11px]">
                Next ranked candidate from the original matching results.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-xl border border-gray-200 bg-white p-4 my-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-forest-300 to-forest-500 flex items-center justify-center text-[11px] font-bold text-white">
                  {mockNextCandidate.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-gray-900">
                    {mockNextCandidate.displayName}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {mockNextCandidate.skills.map((s) => (
                      <span key={s} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[18px] font-bold text-forest-600">{mockNextCandidate.matchScore}%</p>
                  <p className="text-[9px] text-gray-400">Match</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-gray-400 mb-3">
                <span>{mockNextCandidate.deliveries} deliveries</span>
                <span>{mockNextCandidate.rating}/5.0 rating</span>
              </div>
              <div className="p-2.5 rounded-lg bg-forest-50/60 border border-forest-100/50">
                <p className="text-[10px] font-semibold text-forest-700 mb-0.5">Why Matched</p>
                <p className="text-[10px] text-forest-600 leading-relaxed">
                  {mockNextCandidate.whyMatched}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="md" onClick={() => setStep("select_method")}>
                Back
              </Button>
              <Button variant="gradient-primary" size="md" onClick={handleAssign}>
                <UserCheck className="w-3.5 h-3.5" />
                Assign Contributor
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "method_detail" && method === "rerun" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-[15px]">
                Re-run Matching Results
              </DialogTitle>
              <DialogDescription className="text-[11px]">
                Fresh matching excluding {assignment.memberDisplayName}. Select a contributor.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 my-3">
              {mockRerunCandidates.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCandidate(c.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all text-left",
                    selectedCandidate === c.id
                      ? "border-teal-300 bg-teal-50/60 ring-1 ring-teal-200"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  )}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-300 to-teal-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {c.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-gray-900">{c.displayName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {c.skills.map((s) => (
                        <span key={s} className="text-[8px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[14px] font-bold text-teal-600">{c.matchScore}%</p>
                    <p className="text-[9px] text-gray-400">Match</p>
                  </div>
                  {selectedCandidate === c.id && (
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" size="md" onClick={() => { setStep("select_method"); setSelectedCandidate(null); }}>
                Back
              </Button>
              <Button variant="gradient-primary" size="md" onClick={handleAssign} disabled={!selectedCandidate}>
                <UserCheck className="w-3.5 h-3.5" />
                Assign Selected
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "method_detail" && method === "manual" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-[15px]">
                Manual Selection
              </DialogTitle>
              <DialogDescription className="text-[11px]">
                Search all contributors. No matching engine ranking applied.
              </DialogDescription>
            </DialogHeader>

            <div className="relative my-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 rounded-xl bg-white border border-gray-200 pl-9 pr-4 text-[12px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brown-200/30 focus:border-brown-200/50"
              />
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {filteredSearchResults.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCandidate(c.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all text-left",
                    selectedCandidate === c.id
                      ? "border-gold-300 bg-gold-50/60 ring-1 ring-gold-200"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                    {c.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-gray-900">{c.displayName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {c.skills.map((s) => (
                        <span key={s} className="text-[8px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[12px] font-bold text-gold-600 shrink-0">{c.matchScore}%</span>
                  {selectedCandidate === c.id && (
                    <CheckCircle2 className="w-4 h-4 text-gold-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <DialogFooter className="mt-3">
              <Button variant="outline" size="md" onClick={() => { setStep("select_method"); setSelectedCandidate(null); setSearchQuery(""); }}>
                Back
              </Button>
              <Button variant="gradient-primary" size="md" onClick={handleAssign} disabled={!selectedCandidate}>
                <UserCheck className="w-3.5 h-3.5" />
                Assign Selected
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "method_detail" && method === "override" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-[15px]">
                Admin Override
              </DialogTitle>
              <DialogDescription className="text-[11px]">
                Assign any contributor directly. A mandatory reason is required.
              </DialogDescription>
            </DialogHeader>

            {/* Audit warning (SOW D3 Step 2) */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gold-50/70 border border-gold-200/50 mt-1">
              <AlertTriangle className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-gold-700 leading-relaxed">
                This action overrides the matching engine recommendation and will
                be logged in the audit trail with an <strong>ADMIN_OVERRIDE</strong> tag.
              </p>
            </div>

            {/* Contributor selection */}
            <div className="relative my-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search contributor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 rounded-xl bg-white border border-gray-200 pl-9 pr-4 text-[12px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brown-200/30 focus:border-brown-200/50"
              />
            </div>

            <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
              {filteredSearchResults.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCandidate(c.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3.5 py-2 rounded-lg border transition-all text-left",
                    selectedCandidate === c.id
                      ? "border-brown-300 bg-brown-50/60 ring-1 ring-brown-200"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  )}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brown-300 to-brown-500 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                    {c.avatar}
                  </div>
                  <p className="text-[11px] font-semibold text-gray-900 flex-1">{c.displayName}</p>
                  <span className="text-[11px] font-bold text-brown-600 shrink-0">{c.matchScore}%</span>
                  {selectedCandidate === c.id && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-brown-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Mandatory reason (SOW D3 Step 2) */}
            <div className="mt-3">
              <label className="text-[11px] font-semibold text-gray-800 mb-1.5 block">
                Override Reason <span className="text-brown-500">*</span>
              </label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Provide a reason for overriding the matching engine recommendation..."
                rows={3}
                className="w-full rounded-xl bg-white border border-gray-200 px-3.5 py-2.5 text-[12px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brown-200/30 focus:border-brown-200/50 resize-none"
              />
              {!overrideReason.trim() && selectedCandidate && (
                <p className="text-[10px] text-brown-500 mt-1">
                  A reason is required to proceed with an admin override.
                </p>
              )}
            </div>

            <DialogFooter className="mt-3">
              <Button variant="outline" size="md" onClick={() => { setStep("select_method"); setSelectedCandidate(null); setOverrideReason(""); setSearchQuery(""); }}>
                Back
              </Button>
              <Button
                variant="gradient-primary"
                size="md"
                onClick={handleAssign}
                disabled={!selectedCandidate || !overrideReason.trim()}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Override & Assign
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ── Step 3: Processing ── */}
        {step === "processing" && (
          <div className="py-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-brown-400 to-brown-600 mx-auto mb-5 flex items-center justify-center shadow-md"
            >
              <Brain className="w-7 h-7 text-white" />
            </motion.div>
            <p className="text-[14px] font-semibold text-gray-900">
              {method === "next_best"
                ? "Assigning next best contributor..."
                : method === "rerun"
                  ? "Creating new assignment..."
                  : method === "manual"
                    ? "Processing manual assignment..."
                    : "Applying admin override..."}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              {method === "override"
                ? "Override will be flagged in the audit trail"
                : "Matching engine is updating assignments"}
            </p>
          </div>
        )}

        {/* ── Step 4: Success ── */}
        {step === "success" && (
          <div className="py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-forest-400 to-forest-600 mx-auto mb-5 flex items-center justify-center shadow-md"
            >
              <CheckCircle2 className="w-7 h-7 text-white" />
            </motion.div>
            <h3 className="text-[16px] font-bold text-gray-900 mb-1">
              Reassignment Complete
            </h3>
            <p className="text-[12px] text-gray-500 max-w-[320px] mx-auto mb-1">
              A new contributor has been matched to &ldquo;
              {assignment.taskTitle}&rdquo; and notified.
            </p>
            <p className="text-[11px] text-gray-400 mb-1">
              SLA response timer has been restarted (72 hours)
            </p>
            {method === "override" && (
              <p className="text-[10px] text-gold-600 font-medium mb-4">
                ADMIN_OVERRIDE logged in audit trail
              </p>
            )}
            {method !== "override" && <div className="mb-4" />}

            <div className="flex items-center justify-center gap-3">
              <Link href={`/enterprise/team/${assignment.teamId}`}>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-3 h-3" />
                  View Team
                </Button>
              </Link>
              <Button variant="gradient-primary" size="sm" onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ══════════════════════════════════════════════════════════════
   PENDING RESPONSE ROW
   ══════════════════════════════════════════════════════════════ */
function PendingResponseRow({ assignment }: { assignment: Assignment }) {
  const [reassignOpen, setReassignOpen] = React.useState(false);
  const hoursLeft = getHoursLeft(assignment.respondBy);
  const sla = getSlaColor(hoursLeft);
  const statusCfg = assignmentStatusConfig[assignment.status];

  return (
    <>
      <motion.div
        variants={fadeUp}
        className="group flex items-center gap-4 px-5 py-4 rounded-xl border border-gray-200/30 bg-white/50 hover:bg-white hover:shadow-md transition-all"
      >
        {/* Avatar + Name — clickable to team detail */}
        <Link
          href={`/enterprise/team/${assignment.teamId}`}
          className="flex items-center gap-3 min-w-[180px] hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brown-300 to-brown-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
            {assignment.memberAvatar}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-gray-900 truncate group-hover:text-gray-700 transition-colors">
              {assignment.memberDisplayName}
            </p>
            <p className="text-[10px] text-gray-400 truncate">
              {assignment.teamName}
            </p>
          </div>
        </Link>

        {/* Task */}
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-medium text-gray-800 truncate">
            {assignment.taskTitle}
          </p>
          <p className="text-[10px] text-gray-400 truncate">
            {assignment.projectName}
          </p>
        </div>

        {/* Sent at */}
        <div className="hidden lg:block min-w-[120px]">
          <p className="text-[10px] text-gray-400">Sent</p>
          <p className="text-[11px] font-medium text-gray-700">
            {formatDate(assignment.sentAt)}
          </p>
        </div>

        {/* SLA Timer */}
        <div className="min-w-[100px] text-right">
          {assignment.status === "pending_response" ? (
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ring-1",
                sla.bg,
                sla.ring
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full animate-pulse",
                  sla.dot
                )}
              />
              <Timer className={cn("w-3 h-3", sla.text)} />
              <span className={cn("text-[11px] font-bold tabular-nums", sla.text)}>
                {formatHoursLeft(hoursLeft)}
              </span>
            </div>
          ) : assignment.status === "accepted" ? (
            <p className="text-[11px] font-semibold text-forest-600">
              Responded {formatDate(assignment.respondedAt!)}
            </p>
          ) : (
            <p className="text-[11px] font-semibold text-brown-600">
              {assignment.respondedAt
                ? formatDate(assignment.respondedAt)
                : "---"}
            </p>
          )}
        </div>

        {/* Status + Action */}
        <div className="flex items-center gap-2 min-w-[140px] justify-end">
          <Badge variant={statusCfg.variant} size="sm" dot>
            {statusCfg.label}
          </Badge>
          {assignment.status === "declined" && (
            <button
              onClick={() => setReassignOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-brown-500 to-brown-600 text-white text-[10px] font-semibold shadow-sm hover:shadow-md hover:from-brown-600 hover:to-brown-700 transition-all"
            >
              <RefreshCw className="w-3 h-3" />
              Reassign
            </button>
          )}
        </div>
      </motion.div>

      {/* Reassignment Dialog (SOW D5) */}
      <ReassignDialog
        open={reassignOpen}
        onOpenChange={setReassignOpen}
        assignment={assignment}
      />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   SLA LEGEND BAR
   ══════════════════════════════════════════════════════════════ */
function SlaLegend() {
  const items = [
    { label: "> 48h — Safe", dot: "bg-forest-500", text: "text-forest-700" },
    { label: "24-48h — Normal", dot: "bg-teal-500", text: "text-teal-700" },
    {
      label: "12-24h — Approaching",
      dot: "bg-gold-500",
      text: "text-gold-700",
    },
    {
      label: "< 12h — Critical",
      dot: "bg-brown-600",
      text: "text-gray-700",
    },
  ];

  return (
    <motion.div
      variants={fadeIn}
      className="flex items-center gap-5 px-5 py-3 rounded-xl bg-gradient-to-r from-beige-50/80 to-brown-50/50 border border-gray-200"
    >
      <div className="flex items-center gap-1.5">
        <Timer className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[10px] font-semibold text-gray-700">
          SLA Response Window
        </span>
      </div>
      <div className="w-px h-4 bg-gray-200" />
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={cn("w-2 h-2 rounded-full", item.dot)} />
          <span className={cn("text-[10px] font-medium", item.text)}>
            {item.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN TEAMS PAGE
   ══════════════════════════════════════════════════════════════ */
export default function TeamsPage() {
  const [activeTab, setActiveTab] = React.useState<
    "formation" | "active" | "pending"
  >("formation");

  /* Derived data */
  const formationQueue = getFormationQueueItems();
  const activeTeams = getActiveTeams();
  const allAssignments = getPendingAssignments();
  const pendingAssignments = allAssignments.filter(
    (a) => a.status === "pending_response"
  );
  const nonDisbandedTeams = mockTeams.filter((t) => t.status !== "disbanded");
  const avgMatchScore =
    nonDisbandedTeams.length > 0
      ? Math.round(
          nonDisbandedTeams.reduce((s, t) => s + t.matchScore, 0) /
            nonDisbandedTeams.length
        )
      : 0;

  /* Check if any pending response has SLA < 24h for urgency badge */
  const hasUrgent = pendingAssignments.some((a) => {
    const hrs = getHoursLeft(a.respondBy);
    return hrs < 24;
  });

  /* Tab definitions */
  const tabs = [
    {
      key: "formation" as const,
      label: "Formation Queue",
      count: formationQueue.length,
      urgent: false,
    },
    {
      key: "active" as const,
      label: "Active Teams",
      count: activeTeams.length,
      urgent: false,
    },
    {
      key: "pending" as const,
      label: "Pending Responses",
      count: pendingAssignments.length,
      urgent: hasUrgent,
    },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-6"
    >
      {/* ── Page Header ── */}
      <motion.div variants={fadeUp} className="mb-2">
        <h1 className="font-heading text-[28px] font-semibold text-gray-900 tracking-tight leading-tight">Teams</h1>
        <p className="text-[13px] text-gray-400 mt-1.5">
          AI-matched team formation, contributor assignments, and response tracking across all projects.
        </p>
      </motion.div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniStat
          label="Formation Queue"
          value={formationQueue.length}
          icon={Layers}
          accent="bg-gradient-to-br from-gold-400 to-gold-600"
          subtext="Plans awaiting teams"
        />
        <MiniStat
          label="Active Teams"
          value={activeTeams.length}
          icon={UserCheck}
          accent="bg-gradient-to-br from-forest-400 to-forest-600"
          subtext="Delivering projects"
        />
        <MiniStat
          label="Pending Responses"
          value={pendingAssignments.length}
          icon={Send}
          accent="bg-gradient-to-br from-teal-400 to-teal-600"
          subtext={
            hasUrgent
              ? "Some approaching SLA deadline"
              : "All within SLA window"
          }
        />
        <MiniStat
          label="Avg Match Score"
          value={`${avgMatchScore}%`}
          icon={Target}
          accent="bg-gradient-to-br from-brown-400 to-brown-600"
          subtext="Across non-disbanded teams"
        />
      </div>

      {/* ── Tab Navigation ── */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-0 border-b border-gray-200 overflow-x-auto"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 whitespace-nowrap",
              activeTab === tab.key
                ? "text-gray-800 border-brown-500"
                : "text-gray-400 border-transparent hover:text-gray-600"
            )}
          >
            {tab.label}
            <span
              className={cn(
                "ml-1.5 text-[10px] px-1.5 py-0.5 rounded-md font-bold",
                activeTab === tab.key
                  ? tab.urgent
                    ? "bg-gold-100 text-gold-800"
                    : "bg-brown-100 text-gray-700"
                  : tab.urgent
                    ? "bg-gold-100 text-gold-700 animate-pulse"
                    : "bg-gray-100 text-gray-400"
              )}
            >
              {tab.count}
            </span>
            {tab.urgent && activeTab !== tab.key && (
              <AlertTriangle className="w-3 h-3 text-gold-600 inline ml-1" />
            )}
          </button>
        ))}
      </motion.div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        {activeTab === "formation" && (
          <motion.div
            key="formation"
            variants={stagger}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="space-y-4"
          >
            {/* AI engine callout */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-brown-50/80 via-beige-50/80 to-teal-50/80 border border-gray-200 p-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[12px] text-gray-800 font-semibold">
                  Instant Team Formation Engine
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Approved plans are matched with contributors using the Skill
                  Genome. Each candidate includes an AI-generated explanation of
                  why they were selected. No resumes, no bidding.
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-forest-400 shrink-0" />
            </motion.div>

            {formationQueue.length === 0 ? (
              <motion.div
                variants={fadeIn}
                className="text-center py-16 rounded-2xl border border-gray-200 bg-white/50"
              >
                <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-[14px] font-medium text-gray-400">
                  No plans in the formation queue
                </p>
                <p className="text-[12px] text-gray-400 mt-1">
                  Approve a decomposition plan to start team formation
                </p>
              </motion.div>
            ) : (
              <motion.div variants={stagger} className="space-y-3">
                {formationQueue.map(({ plan, team }) => (
                  <FormationQueueCard
                    key={plan.id}
                    plan={plan}
                    team={team}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === "active" && (
          <motion.div
            key="active"
            variants={stagger}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="space-y-4"
          >
            {activeTeams.length === 0 ? (
              <motion.div
                variants={fadeIn}
                className="text-center py-16 rounded-2xl border border-gray-200 bg-white/50"
              >
                <UsersRound className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-[14px] font-medium text-gray-400">
                  No active teams
                </p>
                <p className="text-[12px] text-gray-400 mt-1">
                  Teams will appear here once formation is approved and
                  contributors accept assignments
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {activeTeams.map((team) => (
                  <ActiveTeamCard key={team.id} team={team} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "pending" && (
          <motion.div
            key="pending"
            variants={stagger}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="space-y-4"
          >
            {/* SLA Legend */}
            <SlaLegend />

            {/* Column headers */}
            <div className="flex items-center gap-4 px-5 py-2">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider min-w-[180px]">
                Contributor
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex-1">
                Task / Project
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider hidden lg:block min-w-[120px]">
                Sent
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider min-w-[100px] text-right">
                SLA Timer
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider min-w-[140px] text-right">
                Status
              </span>
            </div>

            {allAssignments.length === 0 ? (
              <motion.div
                variants={fadeIn}
                className="text-center py-16 rounded-2xl border border-gray-200 bg-white/50"
              >
                <Send className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-[14px] font-medium text-gray-400">
                  No pending assignments
                </p>
                <p className="text-[12px] text-gray-400 mt-1">
                  Assignments will appear when teams are formed and invitations
                  are sent
                </p>
              </motion.div>
            ) : (
              <motion.div variants={stagger} className="space-y-2">
                {allAssignments.map((assignment) => (
                  <PendingResponseRow
                    key={assignment.id}
                    assignment={assignment}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
