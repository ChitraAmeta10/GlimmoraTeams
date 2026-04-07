"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookMarked,
  Plus,
  Search,
  Shield,
  Tag,
  Calendar,
  User,
  FileText,
  ArrowLeft,
  Filter,
  CheckCircle2,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/stores/toast-store";
import {
  Button,
  Badge,
  Input,
  Label,
  Textarea,
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
} from "@/components/ui";

/* ── Mock clause data ── */
const mockClauses = [
  {
    id: "cl-001",
    name: "Standard Payment Net-30",
    category: "Payment Terms",
    status: "Active" as const,
    industry: "All Industries",
    lastUpdated: "Mar 3, 2026",
    usedCount: 34,
    author: "Sarah Chen",
    clauseText:
      "Payment shall be made within thirty (30) calendar days from the date of invoice receipt. All invoices must be submitted through the platform's integrated billing system with appropriate milestone evidence attached. Late payments shall incur a penalty of 1.5% per month on the outstanding balance. The enterprise client agrees to maintain sufficient escrow funds to cover all active project milestones.",
  },
  {
    id: "cl-002",
    name: "HIPAA Compliance Requirement",
    category: "Compliance",
    status: "Active" as const,
    industry: "Healthcare",
    lastUpdated: "Feb 28, 2026",
    usedCount: 12,
    author: "James Wright",
    clauseText:
      "All contributors and platform operations must comply with HIPAA (Health Insurance Portability and Accountability Act) regulations. Protected Health Information (PHI) must be encrypted at rest and in transit. Access controls must follow the minimum necessary standard. A Business Associate Agreement (BAA) will be executed prior to any data handling.",
  },
  {
    id: "cl-003",
    name: "SOC 2 Type II Certification",
    category: "Data Security",
    status: "Active" as const,
    industry: "Technology",
    lastUpdated: "Mar 1, 2026",
    usedCount: 28,
    author: "Priya Nair",
    clauseText:
      "The service provider shall maintain SOC 2 Type II certification throughout the duration of the engagement. Annual audit reports shall be made available upon request. Any material changes to security controls must be communicated within 48 hours.",
  },
  {
    id: "cl-004",
    name: "IP Assignment Full Transfer",
    category: "IP Rights",
    status: "Active" as const,
    industry: "All Industries",
    lastUpdated: "Mar 5, 2026",
    usedCount: 41,
    author: "Sarah Chen",
    clauseText:
      "All intellectual property created during the course of this engagement, including but not limited to source code, designs, documentation, and derivative works, shall be the exclusive property of the enterprise client upon acceptance and payment release. Contributors waive all moral rights to the extent permitted by law.",
  },
  {
    id: "cl-005",
    name: "SLA 99.9% Uptime Guarantee",
    category: "SLA",
    status: "Active" as const,
    industry: "Technology",
    lastUpdated: "Feb 20, 2026",
    usedCount: 19,
    author: "James Wright",
    clauseText:
      "The platform guarantees 99.9% uptime for all production services, measured monthly. Scheduled maintenance windows are excluded from uptime calculations. Service credits will be issued for any downtime exceeding the SLA threshold: 10% credit for 99.0-99.9%, 25% credit for 95.0-99.0%, and 50% credit for below 95.0%.",
  },
  {
    id: "cl-006",
    name: "GDPR Data Processing Agreement",
    category: "Compliance",
    status: "Active" as const,
    industry: "All Industries",
    lastUpdated: "Feb 25, 2026",
    usedCount: 22,
    author: "Priya Nair",
    clauseText:
      "Data processing shall comply with the General Data Protection Regulation (EU) 2016/679. A Data Processing Agreement (DPA) will govern all personal data handling. Data subjects retain the right to access, rectification, erasure, and portability. Cross-border data transfers must utilize Standard Contractual Clauses (SCCs) or equivalent safeguards.",
  },
  {
    id: "cl-007",
    name: "Mutual NDA Standard",
    category: "Confidentiality",
    status: "Active" as const,
    industry: "All Industries",
    lastUpdated: "Mar 2, 2026",
    usedCount: 38,
    author: "Sarah Chen",
    clauseText:
      "Both parties agree to maintain the confidentiality of all proprietary information exchanged during the engagement. Confidential information shall not be disclosed to third parties without prior written consent. This obligation survives termination of the agreement for a period of three (3) years. Exceptions include information that becomes publicly available through no fault of the receiving party.",
  },
  {
    id: "cl-008",
    name: "Force Majeure Standard",
    category: "Liability",
    status: "Archived" as const,
    industry: "All Industries",
    lastUpdated: "Jan 15, 2026",
    usedCount: 15,
    author: "James Wright",
    clauseText:
      "Neither party shall be liable for delays or failures in performance resulting from causes beyond their reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, epidemics, government orders, or internet outages. The affected party must provide notice within 72 hours and make reasonable efforts to mitigate the impact.",
  },
  {
    id: "cl-009",
    name: "Termination for Convenience",
    category: "Termination",
    status: "Active" as const,
    industry: "All Industries",
    lastUpdated: "Feb 18, 2026",
    usedCount: 26,
    author: "Priya Nair",
    clauseText:
      "Either party may terminate this agreement for convenience upon thirty (30) days written notice. Upon termination, the enterprise client shall pay for all accepted deliverables and work-in-progress at pro-rated rates. All project data shall be exported and transferred within fourteen (14) days of termination.",
  },
  {
    id: "cl-010",
    name: "Indemnification Mutual",
    category: "Liability",
    status: "Active" as const,
    industry: "All Industries",
    lastUpdated: "Feb 22, 2026",
    usedCount: 18,
    author: "James Wright",
    clauseText:
      "Each party agrees to indemnify and hold harmless the other party from any claims, damages, or expenses arising from the indemnifying party's breach of this agreement, negligence, or willful misconduct. Indemnification obligations are subject to prompt notification and reasonable cooperation in defense.",
  },
];

const categoryColors: Record<string, string> = {
  "Payment Terms": "bg-brown-100 text-brown-700",
  "Data Security": "bg-teal-100 text-teal-700",
  SLA: "bg-gold-100 text-gold-700",
  "IP Rights": "bg-forest-100 text-forest-700",
  Termination: "bg-brown-100 text-brown-600",
  Confidentiality: "bg-teal-100 text-teal-600",
  Compliance: "bg-forest-100 text-forest-600",
  Liability: "bg-beige-200 text-beige-700",
};

export default function ClauseLibraryPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [selectedClause, setSelectedClause] = React.useState<
    (typeof mockClauses)[0] | null
  >(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Add / Edit clause dialog
  const [addClauseOpen, setAddClauseOpen] = React.useState(false);
  const [editClauseOpen, setEditClauseOpen] = React.useState(false);
  const [newClauseName, setNewClauseName] = React.useState("");
  const [newClauseCategory, setNewClauseCategory] = React.useState("");
  const [newClauseBody, setNewClauseBody] = React.useState("");

  // Delete confirmation dialog
  const [deleteClauseOpen, setDeleteClauseOpen] = React.useState(false);

  const filteredClauses = mockClauses.filter((clause) => {
    const matchesSearch =
      searchQuery === "" ||
      clause.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || clause.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      clause.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(mockClauses.map((c) => c.category))];

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 animate-fade-up">
        <div>
          <Link
            href="/enterprise/admin/config"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-teal-600 hover:text-teal-700 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to General
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brown-400 to-brown-600 flex items-center justify-center">
              <BookMarked className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em] font-heading">
              Clause Library
            </h1>
          </div>
          <p className="text-[13px] text-beige-500 mt-1">
            Manage pre-approved clauses used for SOW generation and
            hallucination prevention.
          </p>
        </div>
        <Button variant="gradient-primary" size="sm" onClick={() => { setNewClauseName(""); setNewClauseCategory(""); setNewClauseBody(""); setAddClauseOpen(true); }}>
          <Plus className="w-3.5 h-3.5" />
          Add Clause
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-up [animation-delay:50ms]">
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-brown-100 flex items-center justify-center">
              <FileText className="w-4 h-4 text-brown-600" />
            </div>
            <span className="text-[10px] font-bold text-beige-500 uppercase tracking-wider">
              Total Clauses
            </span>
          </div>
          <p className="text-[20px] font-bold text-brown-900">47</p>
          <p className="text-[10px] text-beige-500">in the library</p>
        </div>

        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-forest-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-forest-600" />
            </div>
            <span className="text-[10px] font-bold text-beige-500 uppercase tracking-wider">
              Active
            </span>
          </div>
          <p className="text-[20px] font-bold text-brown-900">42</p>
          <p className="text-[10px] text-beige-500">available for use</p>
        </div>

        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
              <Tag className="w-4 h-4 text-teal-600" />
            </div>
            <span className="text-[10px] font-bold text-beige-500 uppercase tracking-wider">
              Categories
            </span>
          </div>
          <p className="text-[20px] font-bold text-brown-900">8</p>
          <p className="text-[10px] text-beige-500">clause types</p>
        </div>

        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-beige-200 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-beige-600" />
            </div>
            <span className="text-[10px] font-bold text-beige-500 uppercase tracking-wider">
              Last Updated
            </span>
          </div>
          <p className="text-[20px] font-bold text-brown-900">Mar 5</p>
          <p className="text-[10px] text-beige-500">2026</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 animate-fade-up [animation-delay:100ms]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-beige-400" />
            <Input
              placeholder="Search clauses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-[13px]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-beige-400 hidden sm:block" />

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px] h-9 text-[13px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px] h-9 text-[13px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Clauses Table */}
      <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-hidden animate-fade-up [animation-delay:150ms]">
        <div className="px-5 py-4 border-b border-beige-100 flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-brown-900">
            All Clauses
          </h2>
          <span className="text-[11px] text-beige-500">
            {filteredClauses.length} clause
            {filteredClauses.length !== 1 ? "s" : ""} found
          </span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-beige-100 hover:bg-transparent">
                <TableHead className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider pl-5">
                  Clause Name
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
                  Category
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider hidden md:table-cell">
                  Industry
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider hidden lg:table-cell">
                  Last Updated
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider text-right pr-5">
                  Used
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClauses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-beige-100 flex items-center justify-center">
                        <Search className="w-5 h-5 text-beige-400" />
                      </div>
                      <p className="text-[13px] font-medium text-brown-800">No clauses match your filters</p>
                      <p className="text-[11px] text-beige-500">Try adjusting your search or filter criteria.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {filteredClauses.map((clause) => (
                <TableRow
                  key={clause.id}
                  className={cn(
                    "border-b border-beige-50 cursor-pointer transition-colors hover:bg-beige-50/60",
                    clause.status === "Archived" && "opacity-60"
                  )}
                  onClick={() => {
                    setSelectedClause(clause);
                    setDialogOpen(true);
                  }}
                >
                  <TableCell className="pl-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                          categoryColors[clause.category] ||
                            "bg-beige-100 text-beige-600"
                        )}
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-brown-900">
                          {clause.name}
                        </p>
                        <p className="text-[10px] text-beige-500 mt-0.5">
                          by {clause.author}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium",
                        categoryColors[clause.category] ||
                          "bg-beige-100 text-beige-600"
                      )}
                    >
                      <Tag className="w-3 h-3" />
                      {clause.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        clause.status === "Active" ? "forest" : "beige"
                      }
                      size="sm"
                      dot
                    >
                      {clause.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-[12px] text-beige-600">
                      {clause.industry}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-beige-400" />
                      <span className="text-[12px] text-beige-600">
                        {clause.lastUpdated}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-5">
                    <span className="text-[13px] font-semibold text-brown-800">
                      {clause.usedCount}
                    </span>
                    <span className="text-[10px] text-beige-500 ml-1">
                      uses
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Clause Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          {selectedClause && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      categoryColors[selectedClause.category] ||
                        "bg-beige-100 text-beige-600"
                    )}
                  >
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-[16px] font-bold text-brown-900">
                      {selectedClause.name}
                    </DialogTitle>
                    <DialogDescription className="text-[12px] text-beige-500 mt-0.5">
                      {selectedClause.category} &middot;{" "}
                      {selectedClause.industry}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      selectedClause.status === "Active" ? "forest" : "beige"
                    }
                    size="sm"
                    dot
                  >
                    {selectedClause.status}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-[11px] text-beige-500">
                    <User className="w-3 h-3" />
                    {selectedClause.author}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-beige-500">
                    <Calendar className="w-3 h-3" />
                    {selectedClause.lastUpdated}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-beige-500">
                    <Shield className="w-3 h-3" />
                    {selectedClause.usedCount} uses
                  </span>
                </div>

                {/* Clause Text */}
                <div className="rounded-xl bg-beige-50/80 border border-beige-200/50 p-4">
                  <h4 className="text-[11px] font-bold text-beige-500 uppercase tracking-wider mb-2">
                    Clause Text
                  </h4>
                  <p className="text-[13px] text-brown-800 leading-relaxed">
                    {selectedClause.clauseText}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="gradient-primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setNewClauseName(selectedClause.name);
                      setNewClauseCategory(selectedClause.category);
                      setNewClauseBody(selectedClause.clauseText);
                      setDialogOpen(false);
                      setEditClauseOpen(true);
                    }}
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit Clause
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDialogOpen(false);
                      setDeleteClauseOpen(true);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Clause Dialog */}
      <Dialog open={addClauseOpen} onOpenChange={setAddClauseOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-bold text-brown-900">
              Add New Clause
            </DialogTitle>
            <DialogDescription className="text-[12px] text-beige-500">
              Create a new pre-approved clause for SOW generation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-[12px] font-semibold text-brown-800">Name</Label>
              <Input
                placeholder="e.g. Standard Payment Net-30"
                value={newClauseName}
                onChange={(e) => setNewClauseName(e.target.value)}
                className="h-9 text-[13px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] font-semibold text-brown-800">Category</Label>
              <Select value={newClauseCategory} onValueChange={setNewClauseCategory}>
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] font-semibold text-brown-800">Clause Body</Label>
              <Textarea
                placeholder="Enter the clause text..."
                value={newClauseBody}
                onChange={(e) => setNewClauseBody(e.target.value)}
                className="min-h-[120px] text-[13px]"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="ghost" size="sm" onClick={() => setAddClauseOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gradient-primary"
              size="sm"
              disabled={!newClauseName.trim() || !newClauseCategory || !newClauseBody.trim()}
              onClick={() => {
                toast.success("Clause Added", `"${newClauseName}" has been added to the library.`);
                setAddClauseOpen(false);
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Clause
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Clause Dialog */}
      <Dialog open={editClauseOpen} onOpenChange={setEditClauseOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-bold text-brown-900">
              Edit Clause
            </DialogTitle>
            <DialogDescription className="text-[12px] text-beige-500">
              Update clause details. Changes apply to future SOW generation only.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-[12px] font-semibold text-brown-800">Name</Label>
              <Input
                placeholder="e.g. Standard Payment Net-30"
                value={newClauseName}
                onChange={(e) => setNewClauseName(e.target.value)}
                className="h-9 text-[13px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] font-semibold text-brown-800">Category</Label>
              <Select value={newClauseCategory} onValueChange={setNewClauseCategory}>
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] font-semibold text-brown-800">Clause Body</Label>
              <Textarea
                placeholder="Enter the clause text..."
                value={newClauseBody}
                onChange={(e) => setNewClauseBody(e.target.value)}
                className="min-h-[120px] text-[13px]"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="ghost" size="sm" onClick={() => setEditClauseOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gradient-primary"
              size="sm"
              disabled={!newClauseName.trim() || !newClauseCategory || !newClauseBody.trim()}
              onClick={() => {
                toast.success("Clause Updated", `"${newClauseName}" has been updated successfully.`);
                setEditClauseOpen(false);
              }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteClauseOpen} onOpenChange={setDeleteClauseOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-bold text-brown-900">
              Archive Clause
            </DialogTitle>
            <DialogDescription className="text-[12px] text-beige-500">
              Are you sure you want to archive this clause? It will be excluded
              from future SOW generation but retained for audit purposes.
            </DialogDescription>
          </DialogHeader>
          {selectedClause && (
            <div className="rounded-xl bg-beige-50/80 border border-beige-200/50 p-3 mt-2">
              <p className="text-[13px] font-semibold text-brown-900">
                {selectedClause.name}
              </p>
              <p className="text-[11px] text-beige-500 mt-0.5">
                {selectedClause.category} &middot; {selectedClause.usedCount} uses
              </p>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="ghost" size="sm" onClick={() => setDeleteClauseOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => {
                toast.success("Clause Archived", `"${selectedClause?.name}" has been archived.`);
                setDeleteClauseOpen(false);
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-50 to-beige-50 border border-teal-100/60 p-5 animate-fade-up [animation-delay:200ms]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-teal-900 mb-1">
              Hallucination Prevention System
            </h3>
            <p className="text-[12px] text-teal-700 leading-relaxed">
              Clauses in this library are used by the SOW Intelligence Engine
              during automated SOW generation. The hallucination prevention
              system cross-references generated contract language against
              approved clauses, flagging any AI-generated text that deviates
              from pre-approved templates. Only{" "}
              <span className="font-semibold">Active</span> clauses are
              included in the validation pipeline. Archived clauses are
              retained for audit trail purposes but excluded from new SOW
              generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
