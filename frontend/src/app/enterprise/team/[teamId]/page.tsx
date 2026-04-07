"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Star,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  EyeOff,
  Fingerprint,
  Target,
  TrendingUp,
  ChevronDown,
  Sparkles,
  ListChecks,
  BarChart3,
  Clock,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  stagger,
  fadeUp,
  fadeIn,
  scaleIn,
  slideInRight,
} from "@/lib/utils/motion-variants";
import {
  Badge,
  Button,
  Avatar,
  AvatarFallback,
  Progress,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui";
import { MetricRing } from "@/components/enterprise/metric-ring";
import {
  mockTeams,
  mockPlans,
  mockTasks,
} from "@/mocks/data/enterprise-projects";
import type { TeamMember, TeamStatus } from "@/types/enterprise";

/* ── Status config ── */
const teamStatusConfig: Record<
  TeamStatus,
  { variant: "gold" | "teal" | "forest" | "brown" | "beige"; label: string }
> = {
  forming: { variant: "gold", label: "Forming" },
  ready: { variant: "teal", label: "Ready" },
  approved: { variant: "teal", label: "Approved" },
  active: { variant: "forest", label: "Active" },
  disbanded: { variant: "beige", label: "Disbanded" },
};

/* ── Track badge config ── */
const trackConfig: Record<
  string,
  { label: string; gradient: string; bg: string; text: string; ring: string }
> = {
  women: {
    label: "Women's Program",
    gradient: "from-teal-400 to-teal-600",
    bg: "bg-teal-50",
    text: "text-teal-700",
    ring: "ring-teal-200",
  },
  student: {
    label: "University Track",
    gradient: "from-gold-400 to-gold-600",
    bg: "bg-gold-50",
    text: "text-gold-700",
    ring: "ring-gold-200",
  },
  general: {
    label: "General",
    gradient: "from-beige-400 to-beige-600",
    bg: "bg-gray-100",
    text: "text-gray-600",
    ring: "ring-gray-200",
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

/* ── Star rating ── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "w-3 h-3",
            star <= Math.round(rating)
              ? "text-gold-500 fill-gold-500"
              : "text-gray-300"
          )}
        />
      ))}
      <span className="ml-1 text-[10px] font-semibold text-gray-700">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

/* ── Match score color helper ── */
function matchScoreColor(score: number): "forest" | "teal" | "gold" {
  if (score >= 90) return "forest";
  if (score >= 80) return "teal";
  return "gold";
}

function matchScoreTextClass(score: number): string {
  if (score >= 90) return "text-forest-600";
  if (score >= 80) return "text-teal-600";
  return "text-gold-600";
}

/* ══════════════════════════════════════════
   MEMBER CARD — full detail with "Why Matched"
   ══════════════════════════════════════════ */
function MemberCard({ member }: { member: TeamMember }) {
  const [whyOpen, setWhyOpen] = React.useState(false);
  const track = trackConfig[member.track];
  const avail = availConfig[member.availability];

  return (
    <motion.div
      variants={scaleIn}
      className="group relative card-parchment overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Track accent stripe */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
          track.gradient
        )}
      />

      <div className="p-5 pt-4">
        {/* Header: avatar + name + track */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative">
            <Avatar size="lg">
              <AvatarFallback
                className={cn(
                  "bg-gradient-to-br text-white font-bold text-sm",
                  track.gradient
                )}
              >
                {member.avatar}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center",
                member.availability === "full_time"
                  ? "bg-forest-400"
                  : member.availability === "part_time"
                    ? "bg-gold-400"
                    : "bg-beige-400"
              )}
            >
              <Clock className="w-2 h-2 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-bold text-gray-900 truncate">
                {member.displayName}
              </p>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Fingerprint className="w-3 h-3 text-gray-400 shrink-0 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      Anonymized ID: {member.anonymousId}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <Badge variant={avail.variant} size="sm">
                {avail.label}
              </Badge>
              <span
                className={cn(
                  "text-[9px] font-bold px-2 py-0.5 rounded-md",
                  track.bg,
                  track.text
                )}
              >
                {track.label}
              </span>
            </div>
          </div>

          {/* Mini metric ring */}
          <MetricRing
            value={member.matchScore}
            size={40}
            strokeWidth={3.5}
            color={matchScoreColor(member.matchScore)}
          />
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {member.skills.map((skill) => (
            <span
              key={skill}
              className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 border border-gray-200"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Match score bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-400 font-medium">
              Match Score
            </span>
            <span
              className={cn(
                "text-[12px] font-bold",
                matchScoreTextClass(member.matchScore)
              )}
            >
              {member.matchScore}%
            </span>
          </div>
          <Progress
            value={member.matchScore}
            size="sm"
            variant={matchScoreColor(member.matchScore)}
          />
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-forest-500" />
            <span className="text-[11px] text-gray-700 font-medium">
              {member.tasksCompleted} deliveries
            </span>
          </div>
          <StarRating rating={member.rating} />
        </div>

        {/* Why Matched — collapsible */}
        {member.whyMatched && (
          <div className="mt-3">
            <button
              onClick={() => setWhyOpen(!whyOpen)}
              className="flex items-center gap-1.5 text-[10px] font-semibold text-teal-600 hover:text-teal-700 transition-colors w-full"
            >
              <Sparkles className="w-3 h-3" />
              Why matched
              <ChevronDown
                className={cn(
                  "w-3 h-3 ml-auto transition-transform duration-200",
                  whyOpen && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {whyOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 rounded-lg bg-teal-50/60 border border-teal-200/30 p-3">
                    <p className="text-[11px] text-teal-800 leading-relaxed">
                      {member.whyMatched}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   TASK ASSIGNMENT ROW
   ══════════════════════════════════════════ */
function TaskAssignmentRow({
  taskId,
  memberId,
  members,
}: {
  taskId: string;
  memberId: string;
  members: TeamMember[];
}) {
  const task = mockTasks.find((t) => t.id === taskId);
  const member = members.find((m) => m.id === memberId);
  const track = member ? trackConfig[member.track] : trackConfig.general;

  return (
    <div className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors group">
      {/* Task info */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-gray-900 truncate">
          {task?.title ?? taskId}
        </p>
        {task && (
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-gray-400 font-mono">
              {task.id}
            </span>
            <Badge
              variant={
                task.priority === "critical"
                  ? "gold"
                  : task.priority === "high"
                    ? "brown"
                    : "beige"
              }
              size="sm"
            >
              {task.priority}
            </Badge>
            {task.estimatedHours && (
              <span className="text-[10px] text-gray-400">
                {task.estimatedHours}h est.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Assigned member */}
      <div className="flex items-center gap-2 shrink-0">
        {member ? (
          <>
            <Avatar size="xs">
              <AvatarFallback
                className={cn(
                  "bg-gradient-to-br text-white font-bold text-[8px]",
                  track.gradient
                )}
              >
                {member.avatar}
              </AvatarFallback>
            </Avatar>
            <span className="text-[12px] font-medium text-gray-800 hidden sm:inline">
              {member.displayName}
            </span>
          </>
        ) : (
          <span className="text-[11px] text-gray-400 italic">
            {memberId}
          </span>
        )}
      </div>

      {/* Member match score mini bar */}
      {member && (
        <div className="w-20 shrink-0 hidden md:block">
          <div className="flex items-center justify-end gap-1.5">
            <div className="flex-1">
              <Progress
                value={member.matchScore}
                size="sm"
                variant={matchScoreColor(member.matchScore)}
              />
            </div>
            <span
              className={cn(
                "text-[10px] font-bold w-7 text-right",
                matchScoreTextClass(member.matchScore)
              )}
            >
              {member.matchScore}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   TEAM DETAIL PAGE
   ══════════════════════════════════════════ */
export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const team = mockTeams.find((t) => t.id === teamId);

  /* ── 404 state ── */
  if (!team) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[600px] mx-auto mt-24 text-center"
      >
        <div className="rounded-2xl border border-gray-200 bg-white p-12">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Team not found
          </h2>
          <p className="text-[13px] text-gray-400 mb-6">
            The team &quot;{teamId}&quot; doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/enterprise/team">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Teams
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  const status = teamStatusConfig[team.status];
  const plan = mockPlans.find((p) => p.id === team.planId);

  /* ── Skill coverage analysis ── */
  const memberSkills = new Set(team.members.flatMap((m) => m.skills));
  const coveredSkills = team.requiredSkills.filter((s) => memberSkills.has(s));
  const coveragePct =
    team.requiredSkills.length > 0
      ? Math.round((coveredSkills.length / team.requiredSkills.length) * 100)
      : 100;

  /* ── Track distribution ── */
  const trackCounts = team.members.reduce(
    (acc, m) => {
      acc[m.track] = (acc[m.track] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  /* ── Team stats ── */
  const totalDeliveries = team.members.reduce(
    (s, m) => s + m.tasksCompleted,
    0
  );
  const avgRating =
    team.members.length > 0
      ? team.members.reduce((s, m) => s + m.rating, 0) / team.members.length
      : 0;
  const fullTimeCount = team.members.filter(
    (m) => m.availability === "full_time"
  ).length;
  const partTimeCount = team.members.filter(
    (m) => m.availability === "part_time"
  ).length;
  const avgMatchScore =
    team.members.length > 0
      ? Math.round(
          team.members.reduce((s, m) => s + m.matchScore, 0) /
            team.members.length
        )
      : 0;

  /* ── Task assignments as entries ── */
  const assignmentEntries = team.taskAssignments
    ? Object.entries(team.taskAssignments)
    : [];

  return (
    <TooltipProvider delayDuration={200}>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="max-w-[1280px] mx-auto space-y-6"
      >
        {/* ── Header ── */}
        <motion.div variants={fadeUp} className="mb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1.5 mb-3">
                <Badge variant={status.variant} dot>{status.label}</Badge>
                <span className="inline-flex items-center text-[9px] font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {team.matchScore}% match
                </span>
              </div>
              <h1 className="font-heading text-[28px] font-semibold text-gray-900 tracking-tight leading-tight">{team.name}</h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap text-[12px] text-gray-400">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{team.totalMembers} members</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>{team.requiredSkills.length} required skills</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                {plan ? (
                  <Link href={`/enterprise/decomposition/${plan.id}`} className="text-brown-500 hover:text-brown-600 font-medium transition-colors">{plan.title}</Link>
                ) : (
                  <span>Plan: {team.planId}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {(team.status === "forming" || team.status === "ready") && (
                <Link href={`/enterprise/team/${team.id}/confirm`}>
                  <button className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-gradient-to-r from-brown-400 to-brown-600 hover:from-brown-500 hover:to-brown-700 px-5 py-2 rounded-xl transition-all">
                    <ShieldCheck className="w-3.5 h-3.5" /> Confirm Team
                  </button>
                </Link>
              )}
              {team.status === "active" && team.projectId && (
                <Link href={`/enterprise/projects/${team.projectId}`}>
                  <button className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
                    <ExternalLink className="w-3.5 h-3.5" /> View Project
                  </button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Privacy notice ── */}
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-2 rounded-lg bg-forest-50 px-3 py-2"
        >
          <div className="shrink-0">
            <EyeOff className="w-3.5 h-3.5 text-forest-500" />
          </div>
          <p className="text-[11px] text-teal-800 leading-relaxed">
            <span className="font-semibold">Privacy-first.</span> All
            contributor identities are anonymized. Skill-based matching only
            &mdash; no personal data is shared with enterprise clients.
          </p>
        </motion.div>

        {/* ── Main content: 2-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ─── Left Column (2/3) ─── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Assignments */}
            {assignmentEntries.length > 0 && (
              <motion.div
                variants={fadeUp}
                className="card-parchment overflow-hidden"
              >
                <div className="px-5 pt-5 pb-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[14px] font-bold text-gray-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center">
                        <ListChecks className="w-3.5 h-3.5 text-white" />
                      </div>
                      Task Assignments
                    </h2>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {assignmentEntries.length} tasks assigned
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-beige-100/60">
                  {assignmentEntries.map(([taskId, memberId]) => (
                    <TaskAssignmentRow
                      key={taskId}
                      taskId={taskId}
                      memberId={memberId}
                      members={team.members}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Team Members */}
            <motion.div variants={fadeUp}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[14px] font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brown-400 to-brown-600 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-white" />
                  </div>
                  Team Members
                </h2>
                <span className="text-[11px] text-gray-400">
                  {team.members.length} contributors
                </span>
              </div>
              <motion.div
                variants={stagger}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {team.members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* ─── Right Column (1/3) ─── */}
          <motion.div variants={slideInRight} className="space-y-5">
            {/* Skill Coverage */}
            <div className="card-parchment p-5">
              <h3 className="text-[13px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-teal-100 flex items-center justify-center">
                  <Target className="w-3 h-3 text-teal-600" />
                </div>
                Skill Coverage
              </h3>

              <div className="text-center mb-4">
                <MetricRing
                  value={coveragePct}
                  size={80}
                  strokeWidth={7}
                  color={coveragePct === 100 ? "forest" : "teal"}
                  label="Covered"
                  className="mx-auto"
                />
                <p className="text-[10px] text-gray-400 mt-1.5">
                  {coveredSkills.length} of {team.requiredSkills.length} skills
                  matched
                </p>
              </div>

              <div className="space-y-1.5">
                {team.requiredSkills.map((skill) => {
                  const covered = memberSkills.has(skill);
                  const memberCount = team.members.filter((m) =>
                    m.skills.includes(skill)
                  ).length;
                  return (
                    <div
                      key={skill}
                      className={cn(
                        "flex items-center justify-between py-2 px-2.5 rounded-lg transition-colors",
                        covered
                          ? "bg-forest-50/50"
                          : "bg-gray-50/50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {covered ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-forest-500" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-gray-400" />
                        )}
                        <span
                          className={cn(
                            "text-[12px] font-medium",
                            covered ? "text-gray-800" : "text-gray-400"
                          )}
                        >
                          {skill}
                        </span>
                      </div>
                      {covered && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-[10px] text-forest-600 font-mono bg-forest-100/60 px-1.5 py-0.5 rounded cursor-help">
                              {memberCount}x
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              {memberCount} member{memberCount !== 1 && "s"}{" "}
                              with this skill
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Track Distribution */}
            <div className="card-parchment p-5">
              <h3 className="text-[13px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center">
                  <BarChart3 className="w-3 h-3 text-gray-400" />
                </div>
                Track Distribution
              </h3>

              {/* Stacked bar */}
              <div className="h-3 rounded-full bg-gray-100 overflow-hidden flex mb-4">
                {(["women", "student", "general"] as const).map((key) => {
                  const count = trackCounts[key] || 0;
                  const pct =
                    team.totalMembers > 0
                      ? (count / team.totalMembers) * 100
                      : 0;
                  if (pct === 0) return null;
                  return (
                    <Tooltip key={key}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "h-full bg-gradient-to-r transition-all duration-500 first:rounded-l-full last:rounded-r-full cursor-help",
                            trackConfig[key].gradient
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {trackConfig[key].label}: {count} (
                          {Math.round(pct)}%)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>

              <div className="space-y-2.5">
                {(
                  [
                    ["women", "Women's Program"],
                    ["student", "University Track"],
                    ["general", "General"],
                  ] as const
                ).map(([key, label]) => {
                  const count = trackCounts[key] || 0;
                  const pct =
                    team.totalMembers > 0
                      ? Math.round((count / team.totalMembers) * 100)
                      : 0;
                  const cfg = trackConfig[key];
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-2.5 h-2.5 rounded-full bg-gradient-to-r",
                            cfg.gradient
                          )}
                        />
                        <span
                          className={cn(
                            "text-[11px] font-semibold",
                            cfg.text
                          )}
                        >
                          {label}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {count} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team Stats */}
            <div className="card-parchment p-5">
              <h3 className="text-[13px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-forest-100 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-forest-600" />
                </div>
                Team Stats
              </h3>

              <div className="space-y-3">
                {[
                  {
                    label: "Total Deliveries",
                    value: totalDeliveries.toLocaleString(),
                    icon: (
                      <CheckCircle2 className="w-3.5 h-3.5 text-forest-500" />
                    ),
                  },
                  {
                    label: "Average Rating",
                    value: `${avgRating.toFixed(1)}/5.0`,
                    icon: (
                      <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
                    ),
                  },
                  {
                    label: "Full-time",
                    value: fullTimeCount.toString(),
                    icon: (
                      <CheckCircle2 className="w-3.5 h-3.5 text-forest-500" />
                    ),
                  },
                  {
                    label: "Part-time",
                    value: partTimeCount.toString(),
                    icon: (
                      <Clock className="w-3.5 h-3.5 text-gold-500" />
                    ),
                  },
                  {
                    label: "Avg Match Score",
                    value: `${avgMatchScore}%`,
                    icon: (
                      <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                    ),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-1.5"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="text-[12px] text-gray-500">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[13px] font-bold text-gray-800 font-mono">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
