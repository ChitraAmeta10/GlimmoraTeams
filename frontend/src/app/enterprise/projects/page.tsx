"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  Users,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  Briefcase,
  CircleDollarSign,
  Calendar,
  ShieldCheck,
  FileText,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  LayoutGrid,
  LayoutList,
  Search,
  ListChecks,
  ArrowUpDown,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, scaleIn } from "@/lib/utils/motion-variants";
import {
  Badge,
  Progress,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui";
import { MetricRing } from "@/components/enterprise/metric-ring";
import { mockProjects } from "@/mocks/data/enterprise-projects";
import type { Project, ProjectHealth } from "@/types/enterprise";

/* -- Health config -- */
const healthConfig: Record<
  ProjectHealth,
  {
    label: string;
    dot: string;
    badge: "forest" | "gold" | "danger" | "teal";
    progress: "forest" | "gold" | "brown" | "teal";
    ring: "forest" | "gold" | "brown" | "teal";
  }
> = {
  on_track: {
    label: "On Track",
    dot: "bg-forest-500",
    badge: "forest",
    progress: "forest",
    ring: "forest",
  },
  at_risk: {
    label: "At Risk",
    dot: "bg-gold-500",
    badge: "gold",
    progress: "gold",
    ring: "gold",
  },
  behind: {
    label: "Behind",
    dot: "bg-[var(--danger)]",
    badge: "danger",
    progress: "brown",
    ring: "brown",
  },
  completed: {
    label: "Completed",
    dot: "bg-teal-500",
    badge: "teal",
    progress: "teal",
    ring: "teal",
  },
};

/* -- Filter tabs -- */
const filterTabs: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "on_track", label: "On Track" },
  { key: "at_risk", label: "At Risk" },
  { key: "behind", label: "Behind" },
  { key: "completed", label: "Completed" },
];

/* -- SLA color helper -- */
function slaColor(sla: number) {
  if (sla >= 95) return "text-forest-700 bg-forest-50";
  if (sla >= 85) return "text-gold-700 bg-gold-50";
  return "text-brown-700 bg-brown-50";
}

/* -- Format date helper -- */
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}

/* -- Project Card (Grid View) -- */
function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const hc = healthConfig[project.health];
  const budgetPct = Math.round((project.spent / project.budget) * 100);

  return (
    <Link href={`/enterprise/projects/${project.id}`}>
      <motion.div
        variants={scaleIn}
        className="group rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-5 hover:shadow-xl hover:shadow-brown-100/25 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-bold text-brown-900 truncate group-hover:text-brown-700 transition-colors">
              {project.title}
            </h3>
            <p className="text-[11px] text-beige-500 mt-0.5">
              {project.client}
            </p>
          </div>
          <MetricRing
            value={project.apgScore}
            size={56}
            strokeWidth={5}
            color={hc.ring}
            label="APG"
          />
        </div>

        {/* Health + Progress */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full", hc.dot)} />
              <span className="text-[11px] font-semibold text-brown-700">
                {hc.label}
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-brown-800">
              {project.progress}%
            </span>
          </div>
          <Progress value={project.progress} size="sm" variant={hc.progress} />
        </div>

        {/* SLA + Dates row */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="space-y-0.5">
            <p className="text-[9px] text-beige-400 uppercase tracking-wider font-medium">
              SLA
            </p>
            <span
              className={cn(
                "text-[11px] font-bold px-1.5 py-0.5 rounded-md inline-block",
                slaColor(project.slaCompliance)
              )}
            >
              {project.slaCompliance}%
            </span>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] text-beige-400 uppercase tracking-wider font-medium">
              Start
            </p>
            <p className="text-[10px] font-medium text-brown-700">
              {fmtDate(project.startDate)}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] text-beige-400 uppercase tracking-wider font-medium">
              End
            </p>
            <p className="text-[10px] font-medium text-brown-700">
              {fmtDate(project.endDate)}
            </p>
          </div>
        </div>

        {/* Budget */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CircleDollarSign className="w-3.5 h-3.5 text-beige-400" />
            <span className="text-[11px] text-beige-600">
              ${(project.spent / 1000).toFixed(0)}k
              <span className="text-beige-400">
                {" "}
                / ${(project.budget / 1000).toFixed(0)}k
              </span>
            </span>
          </div>
          <span
            className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
              budgetPct > 85
                ? "bg-gold-50 text-gold-700"
                : "bg-beige-100 text-beige-600"
            )}
          >
            {budgetPct}%
          </span>
        </div>

        {/* Bottom row: Team + Tasks + SOW link */}
        <div className="mt-4 pt-3 border-t border-beige-100/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {Array.from({ length: Math.min(project.teamSize, 4) }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white"
                    style={{
                      background: ["#A67763", "#5B9BA2", "#4D5741", "#D0B060"][
                        i % 4
                      ],
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                )
              )}
              {project.teamSize > 4 && (
                <div className="w-6 h-6 rounded-full bg-beige-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-beige-600">
                  +{project.teamSize - 4}
                </div>
              )}
            </div>
            <span className="text-[10px] text-beige-500">
              {project.teamSize}
            </span>
          </div>

          <div className="text-[11px] text-beige-600">
            <span className="font-bold text-brown-800">
              {project.tasksCompleted}
            </span>
            <span className="text-beige-400">/{project.tasksTotal}</span>
            <span className="text-beige-400 ml-0.5">tasks</span>
          </div>
        </div>

        {/* SOW Link + Escalations */}
        <div className="mt-2 flex items-center justify-between">
          <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); router.push(`/enterprise/sow/${project.sowId}`); }}
            className="text-[10px] text-teal-600 font-medium flex items-center gap-1 truncate max-w-[60%] hover:text-teal-700 hover:underline transition-colors"
          >
            <FileText className="w-3 h-3 shrink-0" />
            {project.sowTitle}
          </button>
          {project.escalations > 0 && (
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-gold-600" />
              <span className="text-[10px] font-semibold text-gold-700">
                {project.escalations}
              </span>
            </span>
          )}
        </div>

        {/* Hover arrow */}
        <div className="mt-3 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-teal-600 font-semibold flex items-center gap-1">
            View Details <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

/* ================================================================
   PROJECTS LIST PAGE
   ================================================================ */
type SortKey = "title" | "health" | "progress" | "tasks" | "team" | "budget" | "sla" | "startDate";

const healthOrder: Record<ProjectHealth, number> = { behind: 0, at_risk: 1, on_track: 2, completed: 3 };

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = React.useState("all");
  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<SortKey>("title");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");

  /* Filter by status + search */
  const filtered = React.useMemo(() => {
    let results = activeFilter === "all"
      ? mockProjects
      : mockProjects.filter((p) => p.health === activeFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.client.toLowerCase().includes(q) ||
          p.sowTitle.toLowerCase().includes(q)
      );
    }

    return results;
  }, [activeFilter, searchQuery]);

  /* Sort (table view only) */
  const sorted = React.useMemo(() => {
    if (viewMode !== "table") return filtered;
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      switch (sortKey) {
        case "title": return dir * a.title.localeCompare(b.title);
        case "health": return dir * (healthOrder[a.health] - healthOrder[b.health]);
        case "progress": return dir * (a.progress - b.progress);
        case "tasks": return dir * (a.tasksCompleted - b.tasksCompleted);
        case "team": return dir * (a.teamSize - b.teamSize);
        case "budget": return dir * (a.budget - b.budget);
        case "sla": return dir * (a.slaCompliance - b.slaCompliance);
        case "startDate": return dir * (new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        default: return 0;
      }
    });
    return arr;
  }, [filtered, sortKey, sortDir, viewMode]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  /* Summary stats */
  const activeProjects = mockProjects.filter(
    (p) => p.health !== "completed"
  ).length;
  const totalBudget = mockProjects.reduce((s, p) => s + p.budget, 0);
  const totalTasks = mockProjects.reduce((s, p) => s + p.tasksTotal, 0);
  const avgSla = Math.round(
    mockProjects.reduce((s, p) => s + p.slaCompliance, 0) / mockProjects.length
  );

  const stats = [
    {
      icon: Briefcase,
      label: "Active Projects",
      value: activeProjects,
      color: "from-brown-400 to-brown-600",
    },
    {
      icon: ListChecks,
      label: "Total Tasks",
      value: totalTasks,
      color: "from-teal-400 to-teal-600",
    },
    {
      icon: DollarSign,
      label: "Total Budget",
      value: `$${(totalBudget / 1000).toFixed(0)}k`,
      color: "from-forest-400 to-forest-600",
    },
    {
      icon: ShieldCheck,
      label: "Avg SLA Compliance",
      value: `${avgSla}%`,
      color: "from-gold-400 to-gold-600",
    },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em]">
            Projects
          </h1>
          <p className="text-[13px] text-beige-500 mt-1">
            Monitor active projects, track milestones, and manage delivery
            outcomes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-beige-200/60 bg-white/60 p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "grid"
                  ? "bg-brown-100 text-brown-700"
                  : "text-beige-400 hover:text-brown-600"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "table"
                  ? "bg-brown-100 text-brown-700"
                  : "text-beige-400 hover:text-brown-600"
              )}
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
          </div>
          <Link
            href="/enterprise/sow/intake"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brown-600 hover:bg-brown-700 text-white text-[12px] font-semibold shadow-md hover:shadow-lg hover:shadow-brown-500/25 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            New SOW
          </Link>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 flex items-center gap-3"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shrink-0",
                stat.color
              )}
            >
              <stat.icon className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[20px] font-bold text-brown-900 tracking-tight leading-none">
                {stat.value}
              </p>
              <p className="text-[10px] text-beige-500 mt-0.5 font-medium">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Search + Filter Row */}
      <motion.div variants={fadeUp} className="space-y-0">
        {/* Search bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-beige-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects by name, client, or SOW..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 rounded-xl bg-white/60 border border-beige-200/60 pl-10 pr-4 text-[13px] text-brown-800 placeholder:text-beige-400 transition-all focus:outline-none focus:ring-2 focus:ring-brown-200/40 focus:border-brown-200/60 focus:bg-white/80"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-0 border-b border-beige-200/60">
        {filterTabs.map((tab) => {
          const count =
            tab.key === "all"
              ? mockProjects.length
              : mockProjects.filter((p) => p.health === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={cn(
                "px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 flex items-center gap-1.5",
                activeFilter === tab.key
                  ? "text-brown-800 border-brown-500"
                  : "text-beige-500 border-transparent hover:text-brown-600"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                  activeFilter === tab.key
                    ? "bg-brown-100 text-brown-700"
                    : "bg-beige-100 text-beige-500"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
        </div>
      </motion.div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-12 flex flex-col items-center text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-beige-100 flex items-center justify-center mb-4">
            <FolderOpen className="w-7 h-7 text-beige-400" />
          </div>
          <h3 className="text-[15px] font-bold text-brown-800">No projects found</h3>
          <p className="text-[13px] text-beige-500 mt-1 max-w-sm">
            {searchQuery.trim()
              ? `No projects match "${searchQuery}". Try adjusting your search or filters.`
              : "No projects in this category. Start by uploading a SOW to create your first project."}
          </p>
          {!searchQuery.trim() && (
            <Link
              href="/enterprise/sow/intake"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brown-600 hover:bg-brown-700 text-white text-[12px] font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              New SOW
            </Link>
          )}
        </motion.div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && filtered.length > 0 && (
        <motion.div
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      )}

      {/* Table View */}
      {viewMode === "table" && filtered.length > 0 && (
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow>
                {([
                  ["title", "Project"],
                  ["health", "Health"],
                  ["progress", "Progress"],
                  ["tasks", "Tasks"],
                  ["team", "Team"],
                  ["budget", "Budget"],
                  ["sla", "SLA"],
                  ["startDate", "Dates"],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <TableHead key={key}>
                    <button
                      onClick={() => toggleSort(key)}
                      className="flex items-center gap-1 hover:text-brown-700 transition-colors group"
                    >
                      {label}
                      <ArrowUpDown
                        className={cn(
                          "w-3 h-3 transition-colors",
                          sortKey === key ? "text-brown-600" : "text-beige-300 group-hover:text-beige-500"
                        )}
                      />
                    </button>
                  </TableHead>
                ))}
                <TableHead>SOW</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((project) => {
                const hc = healthConfig[project.health];
                return (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Link
                        href={`/enterprise/projects/${project.id}`}
                        className="group"
                      >
                        <p className="text-[13px] font-bold text-brown-900 group-hover:text-teal-700 transition-colors">
                          {project.title}
                        </p>
                        <p className="text-[11px] text-beige-500">
                          {project.client}
                        </p>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={hc.badge} size="sm" dot>
                        {hc.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <Progress
                          value={project.progress}
                          size="sm"
                          variant={hc.progress}
                          className="flex-1"
                        />
                        <span className="text-[11px] font-mono font-bold text-brown-800 w-8 text-right">
                          {project.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[12px] text-brown-800">
                        <span className="font-bold">
                          {project.tasksCompleted}
                        </span>
                        <span className="text-beige-400">
                          /{project.tasksTotal}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-beige-400" />
                        <span className="text-[12px] font-semibold text-brown-800">
                          {project.teamSize}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[12px] text-brown-800">
                        ${(project.budget / 1000).toFixed(0)}k
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "text-[11px] font-bold px-2 py-0.5 rounded-md inline-block",
                          slaColor(project.slaCompliance)
                        )}
                      >
                        {project.slaCompliance}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-[10px] text-beige-600 space-y-0.5">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-beige-400" />
                          {fmtDate(project.startDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-beige-400" />
                          {fmtDate(project.endDate)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/enterprise/sow/${project.sowId}`}
                        className="text-[10px] text-teal-600 font-medium flex items-center gap-1 max-w-[120px] truncate hover:text-teal-700 hover:underline transition-colors"
                      >
                        <FileText className="w-3 h-3 shrink-0" />
                        {project.sowTitle}
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </motion.div>
  );
}
