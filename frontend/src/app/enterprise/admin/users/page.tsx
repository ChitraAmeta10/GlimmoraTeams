"use client";

import * as React from "react";
import {
  Search,
  UserPlus,
  Users,
  UserCheck,
  Star,
  Briefcase,
  FileUp,
  Upload,
  X,
  Loader2,
  Check,
  Eye,
  MoreHorizontal,
  Ban,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/stores/toast-store";
import {
  Badge,
  Button,
  Input,
  Avatar,
  AvatarFallback,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Label,
} from "@/components/ui";

/* ── Contributor mock data (H5) ── */
interface Contributor {
  id: string;
  anonymizedId: string;
  skills: string[];
  track: "women" | "student" | "general";
  tasksCompleted: number;
  rating: number;
  status: "active" | "inactive" | "onboarding";
}

const mockContributors: Contributor[] = [
  { id: "c-001", anonymizedId: "CTR-A7X", skills: ["Full-Stack", "TypeScript", "React"], track: "women", tasksCompleted: 34, rating: 4.8, status: "active" },
  { id: "c-002", anonymizedId: "CTR-B3K", skills: ["Backend", "NestJS", "PostgreSQL"], track: "student", tasksCompleted: 28, rating: 4.7, status: "active" },
  { id: "c-003", anonymizedId: "CTR-C9R", skills: ["DevOps", "AWS", "Terraform"], track: "general", tasksCompleted: 45, rating: 4.9, status: "active" },
  { id: "c-004", anonymizedId: "CTR-D2M", skills: ["Backend", "Finance", "API"], track: "women", tasksCompleted: 22, rating: 4.6, status: "active" },
  { id: "c-005", anonymizedId: "CTR-E5L", skills: ["Full-Stack", "HR", "React"], track: "student", tasksCompleted: 19, rating: 4.5, status: "active" },
  { id: "c-006", anonymizedId: "CTR-F8W", skills: ["QA", "Playwright", "k6"], track: "general", tasksCompleted: 31, rating: 4.7, status: "active" },
  { id: "c-007", anonymizedId: "CTR-G1N", skills: ["Design", "Figma", "CSS"], track: "women", tasksCompleted: 26, rating: 4.8, status: "active" },
  { id: "c-008", anonymizedId: "CTR-H4P", skills: ["Mobile", "React Native"], track: "student", tasksCompleted: 15, rating: 4.6, status: "onboarding" },
  { id: "c-009", anonymizedId: "CTR-I6T", skills: ["Backend", "Security", "Node.js"], track: "women", tasksCompleted: 37, rating: 4.8, status: "active" },
  { id: "c-010", anonymizedId: "CTR-J2Y", skills: ["UX", "Figma", "Prototype"], track: "general", tasksCompleted: 23, rating: 4.5, status: "inactive" },
  { id: "c-011", anonymizedId: "CTR-K7Q", skills: ["Mobile", "iOS", "Android"], track: "student", tasksCompleted: 12, rating: 4.4, status: "onboarding" },
  { id: "c-012", anonymizedId: "CTR-L3V", skills: ["QA", "Mobile Testing"], track: "women", tasksCompleted: 29, rating: 4.6, status: "active" },
];

/* ── Track badge config ── */
const trackConfig: Record<string, { variant: "teal" | "gold" | "beige"; label: string }> = {
  women: { variant: "teal", label: "Women" },
  student: { variant: "gold", label: "Student" },
  general: { variant: "beige", label: "General" },
};

/* ── Status badge config ── */
const statusConfig: Record<string, { variant: "forest" | "gold" | "beige"; label: string }> = {
  active: { variant: "forest", label: "Active" },
  inactive: { variant: "beige", label: "Inactive" },
  onboarding: { variant: "gold", label: "Onboarding" },
};

/* ── Rating stars ── */
function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3 h-3 text-gold-500 fill-gold-500" />
      <span className="text-[12px] font-bold text-brown-800 tabular-nums">{rating.toFixed(1)}</span>
    </div>
  );
}

/* ── Stat mini card ── */
function StatMini({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-beige-200/50 bg-white/70 backdrop-blur-sm px-4 py-3">
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br",
          accent
        )}
      >
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-[20px] font-bold text-brown-900 leading-none">{value}</p>
        <p className="text-[10px] text-beige-500 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

/* ── Bulk Import Dialog ── */
function BulkImportDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-brown-900 font-heading">Bulk Import Contributors</DialogTitle>
          <DialogDescription className="text-beige-500">
            Upload a CSV file with contributor data. Expected columns: Anonymized ID, Skills (comma-separated), Track, Status.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Drop zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
              dragOver
                ? "border-teal-400 bg-teal-50/50"
                : "border-beige-200 bg-beige-50/40"
            )}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mx-auto mb-3 shadow-md">
              <FileUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-[13px] font-semibold text-brown-800 mb-1">
              Drop your CSV file here
            </p>
            <p className="text-[11px] text-beige-500 mb-3">
              or click to browse your files
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Choose File", "File upload requires backend integration. Accepts CSV files.")}
            >
              <Upload className="w-3.5 h-3.5" />
              Choose File
            </Button>
          </div>

          {/* Template download */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-beige-100">
            <span className="text-[11px] text-beige-500">Need a template?</span>
            <Button
              variant="link"
              size="sm"
              onClick={() => toast.info("Download Template", "CSV template download requires backend integration.")}
              className="text-teal-600 hover:text-teal-700"
            >
              Download CSV Template
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="gradient-primary" size="sm" disabled>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Add Contributor Dialog ── */
function AddContributorDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [track, setTrack] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleInvite = () => {
    if (!email.trim()) { setError("Email is required"); return; }
    if (!track) { setError("Select a track"); return; }
    setSaving(true);
    setTimeout(() => {
      toast.success("Invitation sent", `Contributor invite sent to ${email.trim()}.`);
      setSaving(false);
      setOpen(false);
      setEmail("");
      setTrack("");
      setError("");
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setError(""); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-brown-900 font-heading">Add Contributor</DialogTitle>
          <DialogDescription className="text-beige-500">
            Send an invitation to join the contributor pool. They will receive onboarding instructions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="contributor-email" className="text-[12px] text-brown-700">Email Address</Label>
            <Input
              id="contributor-email"
              type="email"
              placeholder="contributor@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contributor-track" className="text-[12px] text-brown-700">Track / Segment</Label>
            <Select value={track} onValueChange={(v) => { setTrack(v); if (error) setError(""); }}>
              <SelectTrigger id="contributor-track">
                <SelectValue placeholder="Select track" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-[11px] text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="gradient-primary" size="sm" onClick={handleInvite} disabled={saving}>
            {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Sending...</> : <><Check className="w-3.5 h-3.5" />Send Invite</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ═══════════════════════════════════
   CONTRIBUTOR MANAGEMENT PAGE (H5)
   ═══════════════════════════════════ */
export default function ContributorManagementPage() {
  const [search, setSearch] = React.useState("");
  const [segmentFilter, setSegmentFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filteredContributors = mockContributors.filter((c) => {
    const matchesSearch =
      c.anonymizedId.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesSegment = segmentFilter === "all" || c.track === segmentFilter;
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesSegment && matchesStatus;
  });

  const hasActiveFilters = segmentFilter !== "all" || statusFilter !== "all";

  const activeCount = mockContributors.filter((c) => c.status === "active").length;
  const womenCount = mockContributors.filter((c) => c.track === "women").length;
  const studentCount = mockContributors.filter((c) => c.track === "student").length;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 animate-fade-up">
        <div>
          <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em] font-heading">
            Contributor Management
          </h1>
          <p className="text-[13px] text-beige-500 mt-1">
            View anonymized contributor profiles, skills, and track segments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BulkImportDialog
            trigger={
              <Button variant="outline" size="sm">
                <Upload className="w-3.5 h-3.5" />
                Bulk Import
              </Button>
            }
          />
          <AddContributorDialog
            trigger={
              <Button variant="gradient-primary" size="sm">
                <UserPlus className="w-3.5 h-3.5" />
                Add Contributor
              </Button>
            }
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-up [animation-delay:50ms]">
        <StatMini icon={Users} label="Total Contributors" value={mockContributors.length} accent="from-brown-400 to-brown-600" />
        <StatMini icon={UserCheck} label="Active" value={activeCount} accent="from-forest-400 to-forest-600" />
        <StatMini icon={Users} label="Women Track" value={womenCount} accent="from-teal-400 to-teal-600" />
        <StatMini icon={Briefcase} label="Student Track" value={studentCount} accent="from-gold-400 to-gold-600" />
      </div>

      {/* Search + Segment Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 animate-fade-up [animation-delay:100ms]">
        <div className="flex-1">
          <Input
            placeholder="Search by anonymized ID or skill..."
            icon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={segmentFilter} onValueChange={setSegmentFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by segment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Segments</SelectItem>
            <SelectItem value="women">Women Track</SelectItem>
            <SelectItem value="student">Student Track</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="onboarding">Onboarding</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contributors table */}
      <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-hidden animate-fade-up [animation-delay:150ms]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Anonymized ID</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Track / Segment</TableHead>
              <TableHead className="text-center">Tasks Done</TableHead>
              <TableHead className="text-center">Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContributors.map((contributor) => {
              const tConfig = trackConfig[contributor.track];
              const sConfig = statusConfig[contributor.status];

              return (
                <TableRow
                  key={contributor.id}
                  className="group cursor-pointer hover:bg-beige-50/60 transition-colors"
                  onClick={() => toast.info("View Profile", `Contributor detail page for ${contributor.anonymizedId} coming in a future update.`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback className="text-[10px]">
                          {contributor.anonymizedId.slice(-3)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[13px] font-semibold font-mono text-brown-800">
                        {contributor.anonymizedId}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[240px]">
                      {contributor.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-beige-100 text-beige-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tConfig.variant} size="sm" dot>
                      {tConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-[13px] font-bold text-brown-800 tabular-nums">
                      {contributor.tasksCompleted}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <RatingStars rating={contributor.rating} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sConfig.variant} size="sm" dot>
                      {sConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => toast.info("View Profile", `Contributor detail page for ${contributor.anonymizedId} coming in a future update.`)}
                        >
                          <Eye className="w-3.5 h-3.5" /> <span>View Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {contributor.status === "active" ? (
                          <DropdownMenuItem
                            onClick={() => toast.success("Status Updated", `${contributor.anonymizedId} has been deactivated.`)}
                          >
                            <Ban className="w-3.5 h-3.5" /> <span>Deactivate</span>
                          </DropdownMenuItem>
                        ) : contributor.status === "inactive" ? (
                          <DropdownMenuItem
                            onClick={() => toast.success("Status Updated", `${contributor.anonymizedId} has been reactivated.`)}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" /> <span>Reactivate</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => toast.info("Onboarding", `${contributor.anonymizedId} is still in onboarding.`)}
                          >
                            <Clock className="w-3.5 h-3.5" /> <span>View Onboarding</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredContributors.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-[13px] text-beige-400">No contributors match your filters.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Count footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-beige-100 bg-beige-50/30">
          <span className="text-[11px] text-beige-500">
            Showing <span className="font-semibold text-brown-700">{filteredContributors.length}</span> of{" "}
            <span className="font-semibold text-brown-700">{mockContributors.length}</span> contributors
          </span>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSegmentFilter("all"); setStatusFilter("all"); }}
                className="text-teal-600 hover:text-teal-700"
              >
                <X className="w-3 h-3" />
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
