"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Clock,
  Mail,
  Shield,
  UserCog,
  Ban,
  RefreshCcw,
  Check,
  FolderKanban,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, slideInRight } from "@/lib/utils/motion-variants";
import {
  Badge,
  Avatar,
  AvatarFallback,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Checkbox,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui";
import { StatusTimeline } from "@/components/enterprise/status-timeline";
import { mockOrgUsers, mockRoles } from "@/mocks/data/enterprise-analytics";

/* ── Role badge colors ── */
const roleBadgeVariant: Record<string, "brown" | "teal" | "forest" | "beige"> = {
  owner: "brown",
  admin: "teal",
  manager: "forest",
  viewer: "beige",
};

/* ── Status badge ── */
const statusConfig: Record<
  string,
  { variant: "forest" | "gold" | "danger"; label: string }
> = {
  active: { variant: "forest", label: "Active" },
  invited: { variant: "gold", label: "Invited" },
  suspended: { variant: "danger", label: "Suspended" },
};

/* ── Mock activity for this user ── */
const mockUserActivity = [
  {
    label: "Approved milestone completion",
    description: "Infrastructure & Auth — 4 deliverables verified",
    timestamp: "Mar 6, 2026 10:30 AM",
    status: "completed" as const,
  },
  {
    label: "Released escrow funds",
    description: "$55,000 for Milestone 1",
    timestamp: "Mar 5, 2026 5:00 PM",
    status: "completed" as const,
  },
  {
    label: "Uploaded new SOW document",
    description: "Healthcare Patient Portal — 24 pages",
    timestamp: "Mar 5, 2026 9:00 AM",
    status: "completed" as const,
  },
  {
    label: "Updated APG quality threshold",
    description: "Changed from 80 to 85",
    timestamp: "Mar 3, 2026 9:30 AM",
    status: "current" as const,
  },
  {
    label: "Invited new team member",
    description: "Sara Mahmood — Operations Manager",
    timestamp: "Mar 5, 2026 2:00 PM",
    status: "upcoming" as const,
  },
];

/* ── All permission categories ── */
const permissionCategories = [
  {
    category: "SOW Management",
    permissions: ["sow:read", "sow:edit", "sow:*"],
  },
  {
    category: "Project Management",
    permissions: ["project:read", "project:edit", "project:*"],
  },
  {
    category: "Billing & Finance",
    permissions: ["billing:read", "billing:edit", "billing:*"],
  },
  {
    category: "Team Management",
    permissions: ["team:read", "team:edit", "team:*"],
  },
  {
    category: "Administration",
    permissions: ["admin:users", "admin:config", "admin:*"],
  },
  {
    category: "Analytics",
    permissions: ["analytics:read", "analytics:cost", "analytics:*"],
  },
];

/* ── Info row ── */
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-beige-100 last:border-0">
      <Icon className="w-4 h-4 text-beige-400 shrink-0" />
      <span className="text-[12px] text-beige-500 font-medium w-32 shrink-0">
        {label}
      </span>
      <span className="text-[13px] text-brown-800 font-medium">{value}</span>
    </div>
  );
}

/* ══════════════════════════════════════════
   USER DETAIL PAGE
   ══════════════════════════════════════════ */
export default function UserDetailPage() {
  const { userId } = useParams();
  const user = mockOrgUsers.find((u) => u.id === userId) || mockOrgUsers[0];
  const userRole = mockRoles.find(
    (r) => r.name.toLowerCase() === user.role
  );
  const userPermissions = userRole?.permissions || [];

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  const sConf = statusConfig[user.status];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-6"
    >
      {/* Back link */}
      <motion.div variants={fadeUp}>
        <Link
          href="/enterprise/admin/users"
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Users
        </Link>
      </motion.div>

      {/* User header card */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar size="xl">
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em]">
                {user.name}
              </h1>
              <Badge variant={roleBadgeVariant[user.role] || "beige"} size="md">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
              <Badge variant={sConf.variant} size="sm" dot>
                {sConf.label}
              </Badge>
            </div>
            <p className="text-[13px] text-beige-500 mt-1">{user.email}</p>
            {user.department && (
              <p className="text-[12px] text-beige-400 mt-0.5">
                {user.department} Department
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Select defaultValue={user.role}>
              <SelectTrigger className="w-[140px] h-9 text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>

            {user.status === "active" ? (
              <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gold-200 text-gold-700 text-[11px] font-semibold hover:bg-gold-50 transition-all">
                <Ban className="w-3.5 h-3.5" />
                Suspend
              </button>
            ) : user.status === "suspended" ? (
              <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-forest-200 text-forest-600 text-[11px] font-semibold hover:bg-forest-50 transition-all">
                <RefreshCcw className="w-3.5 h-3.5" />
                Reactivate
              </button>
            ) : null}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp}>
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          {/* Profile tab */}
          <TabsContent value="profile">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              {/* Details */}
              <motion.div
                variants={slideInRight}
                className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6"
              >
                <h3 className="text-[14px] font-semibold text-brown-800 mb-3 flex items-center gap-2">
                  <UserCog className="w-4 h-4 text-beige-400" />
                  User Details
                </h3>
                <div>
                  <InfoRow icon={Mail} label="Email" value={user.email} />
                  <InfoRow
                    icon={Briefcase}
                    label="Department"
                    value={user.department || "Unassigned"}
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Joined"
                    value={new Date(user.joinedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  />
                  <InfoRow
                    icon={Clock}
                    label="Last Active"
                    value={
                      user.lastActive
                        ? new Date(user.lastActive).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Never"
                    }
                  />
                  <InfoRow
                    icon={Shield}
                    label="Role"
                    value={
                      user.role.charAt(0).toUpperCase() + user.role.slice(1)
                    }
                  />
                </div>
              </motion.div>

              {/* Stats card */}
              <motion.div
                variants={slideInRight}
                className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6"
              >
                <h3 className="text-[14px] font-semibold text-brown-800 mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-gold-500" />
                  Activity Summary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-brown-50/60 p-4 text-center">
                    <FolderKanban className="w-5 h-5 text-brown-400 mx-auto mb-2" />
                    <p className="text-[24px] font-bold text-brown-900 leading-none">
                      {user.projectsManaged}
                    </p>
                    <p className="text-[11px] text-beige-500 mt-1">
                      Projects Managed
                    </p>
                  </div>
                  <div className="rounded-xl bg-teal-50/60 p-4 text-center">
                    <Zap className="w-5 h-5 text-teal-400 mx-auto mb-2" />
                    <p className="text-[24px] font-bold text-brown-900 leading-none">
                      {user.actionsCount}
                    </p>
                    <p className="text-[11px] text-beige-500 mt-1">
                      Total Actions
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Activity tab */}
          <TabsContent value="activity">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6"
            >
              <h3 className="text-[14px] font-semibold text-brown-800 mb-5">
                Recent Activity
              </h3>
              <StatusTimeline steps={mockUserActivity} />
            </motion.div>
          </TabsContent>

          {/* Permissions tab */}
          <TabsContent value="permissions">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[14px] font-semibold text-brown-800">
                  Role Permissions
                </h3>
                <Badge variant="teal" size="sm">
                  {userRole?.name || user.role} role
                </Badge>
              </div>

              <div className="space-y-5">
                {permissionCategories.map((cat) => (
                  <div key={cat.category}>
                    <h4 className="text-[12px] font-semibold text-brown-700 uppercase tracking-wider mb-2">
                      {cat.category}
                    </h4>
                    <div className="space-y-2">
                      {cat.permissions.map((perm) => {
                        const hasPermission =
                          userPermissions.includes(perm) ||
                          userPermissions.some(
                            (p) =>
                              p.endsWith(":*") &&
                              perm.startsWith(p.replace(":*", ":"))
                          );
                        return (
                          <div
                            key={perm}
                            className="flex items-center gap-3 py-1.5 px-3 rounded-lg hover:bg-beige-50/60 transition-colors"
                          >
                            <Checkbox
                              checked={hasPermission}
                              disabled
                              className="pointer-events-none"
                            />
                            <span
                              className={cn(
                                "text-[12px] font-mono",
                                hasPermission
                                  ? "text-brown-800"
                                  : "text-beige-400"
                              )}
                            >
                              {perm}
                            </span>
                            {hasPermission && (
                              <Check className="w-3 h-3 text-forest-500 ml-auto" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
