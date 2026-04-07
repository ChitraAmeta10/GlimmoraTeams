"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreateReviewerUserDialog } from "@/components/enterprise/create-reviewer-user-dialog";
import {
  Shield,
  Plus,
  Users,
  ChevronDown,
  ChevronUp,
  Lock,
  Sparkles,
  FileText,
  FolderKanban,
  CircleDollarSign,
  UserCog,
  BarChart3,
  Pencil,
  Trash2,
  Search,
  Info,
  Loader2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
// Direct initial/animate used instead of stagger variants (fixes Next.js client-nav animation bug)
import {
  Badge,
  Switch,
  Input,
  Label,
  Textarea,
  Checkbox,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui";
import { toast } from "@/lib/stores/toast-store";
import { mockRoles } from "@/mocks/data/enterprise-analytics";

/* ── Permission grid categories with sub-permissions ── */
const permissionGrid = [
  { key: "SOW", icon: FileText, permissions: { read: "sow:read", write: "sow:edit", full: "sow:*" } },
  { key: "Project", icon: FolderKanban, permissions: { read: "project:read", write: "project:edit", full: "project:*" } },
  { key: "Billing", icon: CircleDollarSign, permissions: { read: "billing:read", write: "billing:edit", full: "billing:*" } },
  { key: "Team", icon: Users, permissions: { read: "team:read", write: "team:edit", full: "team:*" } },
  { key: "Admin", icon: UserCog, permissions: { read: "admin:users", write: "admin:config", full: "admin:*" } },
  { key: "Analytics", icon: BarChart3, permissions: { read: "analytics:read", write: "analytics:cost", full: "analytics:*" } },
];

/* ── Human-readable permission labels ── */
const permissionLabels: Record<string, string> = {
  "sow:read": "SOW Read",
  "sow:edit": "SOW Write",
  "sow:*": "SOW Full",
  "project:read": "Project Read",
  "project:edit": "Project Write",
  "project:*": "Project Full",
  "billing:read": "Billing Read",
  "billing:edit": "Billing Write",
  "billing:*": "Billing Full",
  "team:read": "Team Read",
  "team:edit": "Team Write",
  "team:*": "Team Full",
  "admin:users": "Admin Users",
  "admin:config": "Admin Config",
  "admin:*": "Admin Full",
  "analytics:read": "Analytics Read",
  "analytics:cost": "Analytics Cost",
  "analytics:*": "Analytics Full",
};

/* ── Helper to check permission ── */
function hasPermission(rolePerms: string[], perm: string): boolean {
  return (
    rolePerms.includes(perm) ||
    rolePerms.some(
      (p) => p.endsWith(":*") && perm.startsWith(p.replace(":*", ":"))
    ) ||
    rolePerms.includes(perm.split(":")[0] + ":*")
  );
}

/* ── Pluralize helper ── */
function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

/* ── Create Role Dialog ── */
function CreateRoleDialog({ trigger, onCreated }: { trigger: React.ReactNode; onCreated: (role: { name: string; description: string; permissions: string[] }) => void }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedPerms, setSelectedPerms] = React.useState<string[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<{ name?: string; perms?: string }>({});

  const togglePerm = (perm: string) => {
    setSelectedPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
    // Clear perm error when user selects something
    if (errors.perms) setErrors((e) => ({ ...e, perms: undefined }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Role name is required";
    if (selectedPerms.length === 0) newErrors.perms = "Select at least one permission";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      onCreated({ name: name.trim(), description: description.trim(), permissions: selectedPerms });
      toast.success("Role created", `"${name.trim()}" has been added to your organization.`);
      setSaving(false);
      setOpen(false);
      setName("");
      setDescription("");
      setSelectedPerms([]);
      setErrors({});
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setErrors({}); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle className="text-brown-900 font-heading">Create Custom Role</DialogTitle>
          <DialogDescription className="text-beige-500">
            Define a new role with specific permissions for your organization.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role-name" className="text-[12px] text-brown-700">Role Name</Label>
            <Input
              id="role-name"
              placeholder="e.g. Project Lead"
              value={name}
              onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((er) => ({ ...er, name: undefined })); }}
            />
            {errors.name && (
              <p className="text-[11px] text-red-500 font-medium">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role-description" className="text-[12px] text-brown-700">Description</Label>
            <Textarea
              id="role-description"
              placeholder="Describe what this role can do..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-20 text-[12px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[12px] text-brown-700">
              Permissions ({selectedPerms.length} selected)
            </Label>
            {errors.perms && (
              <p className="text-[11px] text-red-500 font-medium">{errors.perms}</p>
            )}
            <div className="rounded-xl border border-beige-100 bg-beige-50/40 p-4 max-h-[240px] overflow-y-auto">
              {permissionGrid.map((cat) => {
                const CatIcon = cat.icon;
                return (
                  <div key={cat.key} className="mb-3 last:mb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <CatIcon className="w-3.5 h-3.5 text-beige-400" />
                      <span className="text-[11px] font-semibold text-brown-700">{cat.key}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pl-5">
                      {Object.entries(cat.permissions).map(([level, perm]) => (
                        <label
                          key={perm}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <Checkbox
                            checked={selectedPerms.includes(perm)}
                            onCheckedChange={() => togglePerm(perm)}
                          />
                          <span className="text-[11px] text-beige-600 group-hover:text-brown-700 transition-colors">
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="gradient-primary"
            size="sm"
            onClick={handleCreate}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                Create Role
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Edit Role Dialog (for custom roles) ── */
function EditRoleDialog({
  role,
  trigger,
  onSaved,
}: {
  role: { name: string; description: string; permissions: string[] };
  trigger: React.ReactNode;
  onSaved: (updated: { name: string; description: string; permissions: string[] }) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(role.name);
  const [description, setDescription] = React.useState(role.description);
  const [selectedPerms, setSelectedPerms] = React.useState<string[]>(role.permissions);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setName(role.name);
      setDescription(role.description);
      setSelectedPerms([...role.permissions]);
    }
  }, [open, role]);

  const togglePerm = (perm: string) => {
    setSelectedPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;
    setSaving(true);
    setTimeout(() => {
      onSaved({ name: name.trim(), description: description.trim(), permissions: selectedPerms });
      toast.success("Role updated", `"${name.trim()}" permissions have been saved.`);
      setSaving(false);
      setOpen(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle className="text-brown-900 font-heading">Edit Role</DialogTitle>
          <DialogDescription className="text-beige-500">
            Modify the permissions for &ldquo;{role.name}&rdquo;.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-role-name" className="text-[12px] text-brown-700">Role Name</Label>
            <Input
              id="edit-role-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-role-desc" className="text-[12px] text-brown-700">Description</Label>
            <Textarea
              id="edit-role-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-20 text-[12px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[12px] text-brown-700">
              Permissions ({selectedPerms.length} selected)
            </Label>
            <div className="rounded-xl border border-beige-100 bg-beige-50/40 p-4 max-h-[240px] overflow-y-auto">
              {permissionGrid.map((cat) => {
                const CatIcon = cat.icon;
                return (
                  <div key={cat.key} className="mb-3 last:mb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <CatIcon className="w-3.5 h-3.5 text-beige-400" />
                      <span className="text-[11px] font-semibold text-brown-700">{cat.key}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pl-5">
                      {Object.entries(cat.permissions).map(([level, perm]) => (
                        <label
                          key={perm}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <Checkbox
                            checked={selectedPerms.includes(perm)}
                            onCheckedChange={() => togglePerm(perm)}
                          />
                          <span className="text-[11px] text-beige-600 group-hover:text-brown-700 transition-colors">
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="gradient-primary"
            size="sm"
            onClick={handleSave}
            disabled={saving || !name.trim()}
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Delete Role Confirmation ── */
function DeleteRoleDialog({
  roleName,
  trigger,
  onConfirm,
}: {
  roleName: string;
  trigger: React.ReactNode;
  onConfirm: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => {
      onConfirm();
      toast.success("Role deleted", `"${roleName}" has been removed.`);
      setDeleting(false);
      setOpen(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-brown-900 font-heading">Delete Role</DialogTitle>
          <DialogDescription className="text-beige-500">
            Are you sure you want to delete &ldquo;{roleName}&rdquo;? Users with this role will lose their custom permissions and revert to the default Viewer role.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                Delete Role
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Role card component ── */
function RoleCard({
  role,
  onEdit,
  onDelete,
}: {
  role: (typeof mockRoles)[0];
  onEdit?: (updated: { name: string; description: string; permissions: string[] }) => void;
  onDelete?: () => void;
}) {
  const [expanded, setExpanded] = React.useState(false);

  const accentGradients: Record<string, string> = {
    Owner: "from-brown-400 to-brown-600",
    Admin: "from-teal-400 to-teal-600",
    Manager: "from-forest-400 to-forest-600",
    Viewer: "from-beige-400 to-beige-500",
    "Finance Lead": "from-gold-400 to-gold-600",
  };

  return (
    <div
      className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-hidden hover:shadow-lg hover:shadow-brown-100/15 transition-all"
    >
      {/* Card header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-sm",
                accentGradients[role.name] || "from-brown-400 to-brown-600"
              )}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-semibold text-brown-800">{role.name}</h3>
                <Badge variant={role.isSystem ? "teal" : "gold"} size="sm">
                  {role.isSystem ? "System" : "Custom"}
                </Badge>
              </div>
              <p className="text-[11px] text-beige-500 mt-0.5">{role.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Custom role actions */}
            {!role.isSystem && onEdit && onDelete && (
              <div className="flex items-center gap-1">
                <EditRoleDialog
                  role={role}
                  onSaved={onEdit}
                  trigger={
                    <Button variant="ghost" size="icon-sm" aria-label={`Edit ${role.name}`}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  }
                />
                <DeleteRoleDialog
                  roleName={role.name}
                  onConfirm={onDelete}
                  trigger={
                    <Button variant="ghost" size="icon-sm" aria-label={`Delete ${role.name}`} className="text-red-400 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  }
                />
              </div>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 bg-beige-100/80 rounded-lg px-2.5 py-1">
                    <Users className="w-3 h-3 text-beige-500" />
                    <span className="text-[11px] font-bold text-brown-700">{role.userCount}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{role.userCount} {pluralize(role.userCount, "user", "users")} assigned to this role</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Permission count + tags */}
        <div className="flex items-center gap-2 mt-3 mb-2">
          <Badge variant="beige" size="sm">
            {role.permissions.length} {pluralize(role.permissions.length, "permission", "permissions")}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {role.permissions.map((perm) => (
            <span
              key={perm}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-beige-100 text-beige-700"
              title={perm}
            >
              {permissionLabels[perm] || perm}
            </span>
          ))}
        </div>

        {/* Expand toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 px-0 h-auto text-[11px] font-semibold text-teal-600 hover:text-teal-700"
          aria-expanded={expanded}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              Hide permission grid
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              View permission grid
            </>
          )}
        </Button>
      </div>

      {/* Expandable permission grid */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="border-t border-beige-100 bg-beige-50/40 px-5 py-4">
              {/* System role notice */}
              {role.isSystem && (
                <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-teal-50 border border-teal-100">
                  <Info className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                  <span className="text-[11px] text-teal-700">
                    System roles are managed by the platform and cannot be modified.
                  </span>
                </div>
              )}

              {/* Grid header */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="text-[10px] font-semibold text-beige-500 uppercase tracking-wider">Category</div>
                <div className="text-[10px] font-semibold text-beige-500 uppercase tracking-wider text-center">Read</div>
                <div className="text-[10px] font-semibold text-beige-500 uppercase tracking-wider text-center">Write</div>
                <div className="text-[10px] font-semibold text-beige-500 uppercase tracking-wider text-center">Full</div>
              </div>

              {/* Grid rows */}
              {permissionGrid.map((cat) => {
                const CatIcon = cat.icon;
                return (
                  <div
                    key={cat.key}
                    className="grid grid-cols-4 gap-2 py-2 border-b border-beige-100 last:border-0 items-center"
                  >
                    <div className="flex items-center gap-2">
                      <CatIcon className="w-3.5 h-3.5 text-beige-400" />
                      <span className="text-[12px] font-medium text-brown-700">{cat.key}</span>
                    </div>
                    <div className="flex justify-center">
                      <Switch
                        checked={hasPermission(role.permissions, cat.permissions.read)}
                        disabled
                        aria-label={`${cat.key} read permission`}
                        className="scale-75 pointer-events-none"
                      />
                    </div>
                    <div className="flex justify-center">
                      <Switch
                        checked={hasPermission(role.permissions, cat.permissions.write)}
                        disabled
                        aria-label={`${cat.key} write permission`}
                        className="scale-75 pointer-events-none"
                      />
                    </div>
                    <div className="flex justify-center">
                      <Switch
                        checked={hasPermission(role.permissions, cat.permissions.full)}
                        disabled
                        aria-label={`${cat.key} full permission`}
                        className="scale-75 pointer-events-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════
   ROLES & PERMISSIONS PAGE
   ═══════════════════════════════ */
export default function RolesPage() {
  const [roles, setRoles] = React.useState(mockRoles);
  const [search, setSearch] = React.useState("");

  const systemRoles = roles.filter((r) => r.isSystem);
  const customRoles = roles.filter((r) => !r.isSystem);

  const systemCount = systemRoles.length;
  const customCount = customRoles.length;
  const totalUsers = roles.reduce((sum, r) => sum + r.userCount, 0);

  // Filter by search
  const filteredSystem = systemRoles.filter(
    (r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())
  );
  const filteredCustom = customRoles.filter(
    (r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateRole = (newRole: { name: string; description: string; permissions: string[] }) => {
    setRoles((prev) => [
      ...prev,
      {
        id: `role-${String(prev.length + 1).padStart(3, "0")}`,
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions,
        userCount: 0,
        isSystem: false,
      },
    ]);
  };

  const handleEditRole = (roleId: string) => (updated: { name: string; description: string; permissions: string[] }) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === roleId ? { ...r, name: updated.name, description: updated.description, permissions: updated.permissions } : r
      )
    );
  };

  const handleDeleteRole = (roleId: string) => () => {
    setRoles((prev) => prev.filter((r) => r.id !== roleId));
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 animate-fade-up"
      >
        <div>
          <h1 className="text-[22px] font-bold text-brown-900 tracking-[-0.02em] font-heading">
            Roles & Access
          </h1>
          <p className="text-[13px] text-beige-500 mt-1">
            Define access levels and permission sets for your organization.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CreateReviewerUserDialog
            trigger={
              <Button variant="outline" size="sm">
                <Users className="w-3.5 h-3.5" />
                Create reviewer user
              </Button>
            }
          />
          <CreateRoleDialog
            onCreated={handleCreateRole}
            trigger={
              <Button variant="gradient-primary" size="sm">
                <Plus className="w-3.5 h-3.5" />
                Create Role
              </Button>
            }
          />
        </div>
      </div>

      {/* Summary bar + search */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-3 rounded-xl border border-beige-200/50 bg-white/60 backdrop-blur-sm animate-fade-up [animation-delay:100ms]"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-beige-400" />
            <span className="text-[12px] text-beige-600">
              <span className="font-semibold text-brown-800">{systemCount}</span>{" "}
              system {pluralize(systemCount, "role", "roles")}
            </span>
          </div>
          <div className="w-px h-4 bg-beige-200" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span className="text-[12px] text-beige-600">
              <span className="font-semibold text-brown-800">{customCount}</span>{" "}
              custom {pluralize(customCount, "role", "roles")}
            </span>
          </div>
          <div className="w-px h-4 bg-beige-200" />
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-500" />
            <span className="text-[12px] text-beige-600">
              <span className="font-semibold text-brown-800">{totalUsers}</span>{" "}
              total {pluralize(totalUsers, "user", "users")}
            </span>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-beige-400" />
          <Input
            placeholder="Search roles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8 w-56 text-[12px]"
          />
        </div>
      </div>

      {/* System Roles Section */}
      <div
        className="space-y-3 animate-fade-up [animation-delay:200ms]"
      >
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-beige-400" />
          <h2 className="text-[14px] font-semibold text-brown-800">System Roles</h2>
          <span className="text-[11px] text-beige-500">— managed by platform</span>
        </div>
        {filteredSystem.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredSystem.map((role) => (
              <RoleCard key={role.id} role={role} />
            ))}
          </div>
        ) : (
          <p className="text-[12px] text-beige-500 py-4 text-center">No system roles match your search.</p>
        )}
      </div>

      {/* Custom Roles Section */}
      <div
        className="space-y-3 animate-fade-up [animation-delay:300ms]"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold-500" />
          <h2 className="text-[14px] font-semibold text-brown-800">Custom Roles</h2>
          <span className="text-[11px] text-beige-500">— created by your organization</span>
        </div>
        {filteredCustom.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCustom.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                onEdit={handleEditRole(role.id)}
                onDelete={handleDeleteRole(role.id)}
              />
            ))}
          </div>
        ) : customRoles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-beige-300 bg-beige-50/40 px-6 py-8 text-center">
            <Sparkles className="w-8 h-8 text-gold-300 mx-auto mb-3" />
            <p className="text-[13px] font-semibold text-brown-700">No custom roles yet</p>
            <p className="text-[12px] text-beige-500 mt-1">
              Create a custom role to define specific permission sets for your team members.
            </p>
          </div>
        ) : (
          <p className="text-[12px] text-beige-500 py-4 text-center">No custom roles match your search.</p>
        )}
      </div>
    </div>
  );
}
