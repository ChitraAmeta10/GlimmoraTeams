"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Target,
  CheckCircle2,
  XCircle,
  Fingerprint,
  Star,
  Clock,
  Award,
  Bell,
  DollarSign,
  CalendarClock,
  Layers,
  ListChecks,
  BrainCircuit,
  Send,
  FileText,
  Shield,
  ArrowRight,
  Sparkles,
  CircleCheck,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, fadeIn, scaleIn } from "@/lib/utils/motion-variants";
import {
  Badge,
  Progress,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Textarea,
  Avatar,
  AvatarFallback,
} from "@/components/ui";
import { MetricRing } from "@/components/enterprise/metric-ring";
import { mockTeams, mockPlans } from "@/mocks/data/enterprise-projects";
import type { TeamPool, TeamMember } from "@/types/enterprise";

/* ── Track-color config ── */
const trackConfig: Record<
  string,
  { label: string; gradient: string; bg: string; text: string; ring: string }
> = {
  women: {
    label: "Women's Program",
    gradient: "from-teal-400 to-teal-500",
    bg: "bg-teal-100",
    text: "text-teal-700",
    ring: "ring-teal-300",
  },
  student: {
    label: "University Track",
    gradient: "from-gold-400 to-gold-500",
    bg: "bg-gold-100",
    text: "text-gold-700",
    ring: "ring-gold-300",
  },
  general: {
    label: "General",
    gradient: "from-beige-400 to-beige-500",
    bg: "bg-gray-200",
    text: "text-gray-600",
    ring: "ring-gray-300",
  },
};

/* ── Availability config ── */
const availConfig: Record<
  string,
  { label: string; variant: "forest" | "gold" | "beige" }
> = {
  full_time: { label: "Full-time", variant: "forest" },
  part_time: { label: "Part-time", variant: "gold" },
  limited: { label: "Limited", variant: "beige" },
};

/* ── Complexity config ── */
const complexityConfig: Record<
  string,
  { variant: "forest" | "gold" | "brown" | "teal"; label: string }
> = {
  low: { variant: "forest", label: "Low" },
  medium: { variant: "teal", label: "Medium" },
  high: { variant: "gold", label: "High" },
  critical: { variant: "brown", label: "Critical" },
};

/* ── Format currency ── */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/* ── Format hours ── */
function formatHours(hours: number): string {
  if (hours >= 1000) {
    return `${(hours / 1000).toFixed(1)}k hrs`;
  }
  return `${hours} hrs`;
}

/* ── Avatar stack ── */
function AvatarStack({
  members,
  max = 5,
}: {
  members: TeamMember[];
  max?: number;
}) {
  const shown = members.slice(0, max);
  const remaining = members.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {shown.map((m) => {
        const track = trackConfig[m.track];
        return (
          <div
            key={m.id}
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-white bg-gradient-to-br",
              track.gradient
            )}
          >
            {m.avatar}
          </div>
        );
      })}
      {remaining > 0 && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-brown-600 ring-2 ring-white bg-gray-200">
          +{remaining}
        </div>
      )}
    </div>
  );
}

/* ── Compact member row ── */
function CompactMemberRow({ member }: { member: TeamMember }) {
  const track = trackConfig[member.track];
  const avail = availConfig[member.availability];

  return (
    <motion.div
      variants={fadeUp}
      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 hover:bg-white hover:shadow-sm transition-all duration-200"
    >
      {/* Avatar */}
      <Avatar size="sm">
        <AvatarFallback
          className={cn(
            "bg-gradient-to-br text-white font-bold text-[10px]",
            track.gradient
          )}
        >
          {member.avatar}
        </AvatarFallback>
      </Avatar>

      {/* Name + anonymity */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[12px] font-semibold text-gray-900 truncate">
            {member.displayName}
          </p>
          <Fingerprint className="w-2.5 h-2.5 text-gray-400 shrink-0" />
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          {member.skills.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-[8px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500"
            >
              {s}
            </span>
          ))}
          {member.skills.length > 3 && (
            <span className="text-[8px] text-gray-400">
              +{member.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Match score */}
      <div className="text-right shrink-0 flex items-center gap-3">
        <span
          className={cn(
            "text-[12px] font-bold tabular-nums",
            member.matchScore >= 90
              ? "text-forest-600"
              : member.matchScore >= 80
              ? "text-teal-600"
              : "text-gold-600"
          )}
        >
          {member.matchScore}%
        </span>
        <Badge variant={avail.variant} size="sm">
          {avail.label}
        </Badge>
      </div>
    </motion.div>
  );
}

/* ── Success state after confirmation ── */
function ConfirmationSuccess({ team }: { team: TeamPool }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-[560px] mx-auto text-center py-16"
    >
      {/* Success animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.2,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-forest-400 to-forest-600 mx-auto mb-6 flex items-center justify-center shadow-md"
      >
        <CircleCheck className="w-10 h-10 text-white" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-[22px] font-bold text-gray-900 tracking-[-0.02em] mb-2"
      >
        Contributors Have Been Notified
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-[13px] text-gray-500 max-w-[420px] mx-auto mb-2"
      >
        {team.totalMembers} contributors across the{" "}
        <span className="font-semibold text-gray-700">{team.name}</span> have
        been notified of their assignments. SLA response timers are now active.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-2 text-[11px] text-gray-400 mb-8"
      >
        <Clock className="w-3.5 h-3.5" />
        <span>
          Contributors have 72 hours to accept or decline their assignments
        </span>
      </motion.div>

      {/* What happens next */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card-parchment p-5 mb-8 text-left"
      >
        <h4 className="text-[12px] font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-gold-500" />
          What Happens Next
        </h4>
        <div className="space-y-2.5">
          {[
            "Each contributor receives a notification with their assignment details",
            "Contributors review scope, timeline, and acceptance criteria",
            "APG monitors responses and flags timeout risks",
            "Once all contributors accept, the project automatically activates",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-forest-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[9px] font-bold text-forest-700">
                  {i + 1}
                </span>
              </div>
              <p className="text-[11px] text-gray-700 leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-center gap-3"
      >
        <Link href="/enterprise/team">
          <Button variant="outline" size="md">
            <Users className="w-4 h-4" />
            View Assignments
          </Button>
        </Link>
        <Link href={`/enterprise/team/${team.id}`}>
          <Button variant="gradient-primary" size="md">
            View Team Detail
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ── Already confirmed guard state ── */
function AlreadyConfirmedState({ team }: { team: TeamPool }) {
  const isActive = team.status === "active";

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[560px] mx-auto text-center py-16"
    >
      <motion.div
        variants={scaleIn}
        className={cn(
          "w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center",
          isActive
            ? "bg-forest-100 text-forest-600"
            : "bg-gray-200 text-gray-400"
        )}
      >
        {isActive ? (
          <Shield className="w-8 h-8" />
        ) : (
          <XCircle className="w-8 h-8" />
        )}
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="text-[20px] font-bold text-gray-900 tracking-[-0.02em] mb-2"
      >
        {isActive ? "Team Already Confirmed" : "Team Has Been Disbanded"}
      </motion.h2>

      <motion.p
        variants={fadeUp}
        className="text-[13px] text-gray-500 max-w-[400px] mx-auto mb-6"
      >
        {isActive
          ? `The ${team.name} is already active and contributors have been notified. You can view the project or manage the team.`
          : `The ${team.name} has been disbanded and is no longer available for confirmation.`}
      </motion.p>

      <motion.div
        variants={fadeUp}
        className="flex items-center justify-center gap-3"
      >
        <Link href="/enterprise/team">
          <Button variant="outline" size="md">
            <ArrowLeft className="w-4 h-4" />
            Back to Teams
          </Button>
        </Link>
        {isActive && team.projectId && (
          <Link href={`/enterprise/projects/${team.projectId}`}>
            <Button variant="gradient-primary" size="md">
              View Project
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── 404 state ── */
function NotFoundState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[480px] mx-auto text-center py-20"
    >
      <div className="w-14 h-14 rounded-full bg-gray-200 text-gray-400 mx-auto mb-5 flex items-center justify-center">
        <Users className="w-7 h-7" />
      </div>
      <h2 className="text-[18px] font-bold text-gray-900 mb-2">
        Team Not Found
      </h2>
      <p className="text-[13px] text-gray-400 mb-6">
        The team you are looking for does not exist or has been removed.
      </p>
      <Link href="/enterprise/team">
        <Button variant="outline" size="md">
          <ArrowLeft className="w-4 h-4" />
          Back to Teams
        </Button>
      </Link>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   CONFIRM TEAM PAGE
   ══════════════════════════════════════════ */
export default function ConfirmTeamPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const team = mockTeams.find((t) => t.id === teamId);
  const plan = team
    ? mockPlans.find((p) => p.id === team.planId)
    : undefined;

  const [notes, setNotes] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [confirmed, setConfirmed] = React.useState(false);

  /* ── 404 guard ── */
  if (!team) return <NotFoundState />;

  /* ── Only forming/ready teams can be confirmed ── */
  if (team.status !== "forming" && team.status !== "ready") {
    return <AlreadyConfirmedState team={team} />;
  }

  /* ── Success state ── */
  if (confirmed) {
    return <ConfirmationSuccess team={team} />;
  }

  /* ── Derived data ── */
  const memberSkills = new Set(team.members.flatMap((m) => m.skills));
  const coveredSkills = team.requiredSkills.filter((s) => memberSkills.has(s));
  const uncoveredSkills = team.requiredSkills.filter(
    (s) => !memberSkills.has(s)
  );
  const coverageCount = coveredSkills.length;
  const totalRequired = team.requiredSkills.length;
  const coveragePct = Math.round((coverageCount / totalRequired) * 100);

  const matchColor =
    team.matchScore >= 90
      ? "forest"
      : team.matchScore >= 80
      ? "teal"
      : "gold";

  const matchLabel =
    team.matchScore >= 95
      ? "Exceptional"
      : team.matchScore >= 90
      ? "Excellent"
      : team.matchScore >= 85
      ? "Strong"
      : team.matchScore >= 80
      ? "Good"
      : "Moderate";

  const complexity = plan
    ? complexityConfig[plan.complexity]
    : undefined;

  /* ── Skill-to-member mapping ── */
  const skillMemberMap: Record<string, string[]> = {};
  for (const skill of team.requiredSkills) {
    skillMemberMap[skill] = team.members
      .filter((m) => m.skills.includes(skill))
      .map((m) => m.displayName);
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[920px] mx-auto space-y-6"
    >
      {/* ── Header ── */}
      <motion.div variants={fadeUp} className="mb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-gold-50 text-gold-700">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                Confirmation
              </span>
            </div>
            <h1 className="font-heading text-[28px] font-semibold text-gray-900 tracking-tight leading-tight">
              Confirm Team Formation
            </h1>
            <p className="text-[12px] text-gray-400 mt-2">
              Review the team composition and confirm to notify all contributors.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 ml-14">
          <span className="text-[11px] font-semibold text-gray-700">
            {team.name}
          </span>
          {plan && (
            <>
              <span className="text-[10px] text-gray-400">/</span>
              <span className="text-[11px] text-gray-400">{plan.title}</span>
            </>
          )}
        </div>
      </motion.div>

      {/* ── Summary cards row ── */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
        {/* Members */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-brown-100 text-brown-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <AvatarStack members={team.members} max={4} />
          </div>
          <p className="text-[24px] font-bold text-gray-900 tracking-tight">
            {team.totalMembers}
          </p>
          <p className="text-[10px] text-gray-400 font-medium mt-0.5">
            Team Members
          </p>
        </div>

        {/* Match score */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col items-center justify-center">
          <MetricRing
            value={team.matchScore}
            size={68}
            strokeWidth={5}
            color={matchColor}
            label="Match"
          />
          <span
            className={cn(
              "text-[10px] font-semibold mt-2",
              matchColor === "forest"
                ? "text-forest-600"
                : matchColor === "teal"
                ? "text-teal-600"
                : "text-gold-600"
            )}
          >
            {matchLabel}
          </span>
        </div>

        {/* Skill coverage */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
            <Target className="w-4 h-4" />
          </div>
          <p className="text-[24px] font-bold text-gray-900 tracking-tight">
            {coverageCount}
            <span className="text-[14px] text-gray-400 font-medium">
              {" "}
              / {totalRequired}
            </span>
          </p>
          <p className="text-[10px] text-gray-400 font-medium mt-0.5">
            Required Skills Covered
          </p>
          <Progress
            value={coveragePct}
            size="sm"
            variant={coveragePct === 100 ? "forest" : "teal"}
            className="mt-2"
          />
        </div>
      </motion.div>

      {/* ── Cost & Timeline section ── */}
      {plan && (
        <motion.div
          variants={fadeUp}
          className="card-parchment p-6"
        >
          <h3 className="text-[14px] font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            Cost & Timeline Overview
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Estimated cost */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3 h-3 text-forest-500" />
                <span className="text-[10px] text-gray-400 font-medium">
                  Est. Cost
                </span>
              </div>
              <p className="text-[15px] font-bold text-gray-900">
                {formatCurrency(plan.estimatedCost)}
              </p>
            </div>

            {/* Estimated hours */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <CalendarClock className="w-3 h-3 text-teal-500" />
                <span className="text-[10px] text-gray-400 font-medium">
                  Est. Hours
                </span>
              </div>
              <p className="text-[15px] font-bold text-gray-900">
                {formatHours(plan.estimatedHours)}
              </p>
            </div>

            {/* Milestones */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-gold-500" />
                <span className="text-[10px] text-gray-400 font-medium">
                  Milestones
                </span>
              </div>
              <p className="text-[15px] font-bold text-gray-900">
                {plan.totalMilestones}
              </p>
            </div>

            {/* Tasks */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <ListChecks className="w-3 h-3 text-brown-500" />
                <span className="text-[10px] text-gray-400 font-medium">
                  Tasks
                </span>
              </div>
              <p className="text-[15px] font-bold text-gray-900">
                {plan.totalTasks}
              </p>
            </div>

            {/* Complexity */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <BrainCircuit className="w-3 h-3 text-brown-400" />
                <span className="text-[10px] text-gray-400 font-medium">
                  Complexity
                </span>
              </div>
              {complexity && (
                <Badge variant={complexity.variant} size="sm">
                  {complexity.label}
                </Badge>
              )}
            </div>

            {/* AI Confidence */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-gold-500" />
                <span className="text-[10px] text-gray-400 font-medium">
                  AI Confidence
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={plan.aiConfidence}
                  size="sm"
                  variant={
                    plan.aiConfidence >= 90
                      ? "forest"
                      : plan.aiConfidence >= 80
                      ? "teal"
                      : "gold"
                  }
                  className="flex-1"
                />
                <span className="text-[11px] font-bold text-gray-800 tabular-nums">
                  {plan.aiConfidence}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Compact team roster ── */}
      <motion.div
        variants={fadeUp}
        className="card-parchment p-5"
      >
        <h3 className="text-[14px] font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          Team Roster
          <span className="text-[11px] font-normal text-gray-400">
            (Anonymized)
          </span>
        </h3>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {team.members.map((member) => (
            <CompactMemberRow key={member.id} member={member} />
          ))}
        </motion.div>
      </motion.div>

      {/* ── Skill coverage analysis ── */}
      <motion.div
        variants={fadeUp}
        className="card-parchment p-5"
      >
        <h3 className="text-[14px] font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-gold-500" />
          Skill Coverage Analysis
        </h3>

        <div className="space-y-2.5">
          {team.requiredSkills.map((skill) => {
            const covered = memberSkills.has(skill);
            const memberNames = skillMemberMap[skill] || [];

            return (
              <div
                key={skill}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 border",
                  covered
                    ? "bg-forest-50/50 border-forest-200/50"
                    : "bg-gray-50/50 border-gray-200 border-dashed"
                )}
              >
                {covered ? (
                  <CheckCircle2 className="w-4 h-4 text-forest-500 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-gray-400 shrink-0" />
                )}
                <span
                  className={cn(
                    "text-[12px] font-semibold min-w-[100px]",
                    covered ? "text-forest-700" : "text-gray-400"
                  )}
                >
                  {skill}
                </span>
                <div className="flex-1 flex items-center gap-1.5 overflow-hidden">
                  {covered ? (
                    memberNames.map((name) => (
                      <span
                        key={name}
                        className="text-[9px] font-medium px-2 py-0.5 rounded-md bg-forest-100 text-forest-600 shrink-0"
                      >
                        {name}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-gray-400 italic">
                      No coverage
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {uncoveredSkills.length > 0 && (
          <div className="mt-3 rounded-lg bg-gold-50/60 border border-gold-200/50 p-3 flex items-start gap-2.5">
            <Star className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gold-700">
              <span className="font-semibold">
                {uncoveredSkills.length} uncovered skill
                {uncoveredSkills.length > 1 ? "s" : ""}
              </span>{" "}
              detected. APG will flag these gaps and may suggest additional
              contributors or re-assignment during project execution.
            </p>
          </div>
        )}
      </motion.div>

      {/* ── Confirmation notes ── */}
      <motion.div
        variants={fadeUp}
        className="card-parchment p-5"
      >
        <h3 className="text-[14px] font-bold text-gray-900 mb-2">
          Confirmation Notes
        </h3>
        <p className="text-[12px] text-gray-400 mb-3">
          Add notes for the team formation record. These will be included in the
          audit trail.
        </p>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes for the team formation record..."
          className="min-h-[100px]"
        />
      </motion.div>

      {/* ── Action buttons ── */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 pb-8"
      >
        <Link href={`/enterprise/team/${team.id}`} className="w-full sm:w-auto">
          <Button variant="outline" size="md" className="w-full sm:w-auto">
            <Undo2 className="w-4 h-4" />
            Request Changes
          </Button>
        </Link>
        <Button
          variant="gradient-primary"
          size="md"
          className="w-full sm:w-auto px-8"
          onClick={() => setDialogOpen(true)}
        >
          <Bell className="w-4 h-4" />
          Confirm & Notify Contributors
        </Button>
      </motion.div>

      {/* ── Confirmation dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[480px]">
          <DialogHeader>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brown-500 to-brown-600 flex items-center justify-center mx-auto mb-3 shadow-md shadow-brown-500/20">
              <Send className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-center text-[18px]">
              Confirm Team Formation?
            </DialogTitle>
            <DialogDescription className="text-center text-[13px]">
              {team.totalMembers} contributors will be notified and asked to
              accept or decline their assignments. SLA timers will begin
              immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl bg-gray-50/80 border border-gray-200 p-4 my-2">
            <h4 className="text-[11px] font-bold text-gray-900 mb-3 uppercase tracking-wider">
              What will happen
            </h4>
            <div className="space-y-2.5">
              {[
                {
                  icon: Bell,
                  text: "Each contributor receives an assignment notification",
                },
                {
                  icon: Clock,
                  text: "72-hour SLA response window begins immediately",
                },
                {
                  icon: Shield,
                  text: "APG monitors acceptance rates and flags risks",
                },
                {
                  icon: CheckCircle2,
                  text: "Project activates once all contributors accept",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-brown-100 flex items-center justify-center shrink-0">
                    <item.icon className="w-3 h-3 text-brown-600" />
                  </div>
                  <span className="text-[11px] text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team summary in dialog */}
          <div className="flex items-center justify-between rounded-lg bg-white border border-gray-200/30 px-3 py-2.5 my-1">
            <div className="flex items-center gap-2">
              <AvatarStack members={team.members} max={3} />
              <span className="text-[11px] font-semibold text-gray-800">
                {team.name}
              </span>
            </div>
            <span
              className={cn(
                "text-[11px] font-bold",
                matchColor === "forest"
                  ? "text-forest-600"
                  : matchColor === "teal"
                  ? "text-teal-600"
                  : "text-gold-600"
              )}
            >
              {team.matchScore}% match
            </span>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => setDialogOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="gradient-primary"
              size="md"
              onClick={() => {
                setDialogOpen(false);
                setConfirmed(true);
              }}
              className="flex-1"
            >
              <Send className="w-4 h-4" />
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
