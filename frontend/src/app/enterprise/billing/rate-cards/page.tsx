"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeDollarSign,
  DollarSign,
  TrendingUp,
  Layers,
  Code2,
  Palette,
  Bug,
  Server,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ArrowUpRight,
  Search,
  Calendar,
  Globe,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { stagger, fadeUp, scaleIn } from "@/lib/utils/motion-variants";
import { toast } from "@/lib/stores/toast-store";
import {
  Badge,
  Button,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui";

/* ---------- Types ---------- */
interface RateCard {
  id: string;
  skill: string;
  level: "Junior" | "Mid" | "Senior";
  region: string;
  hourlyRate: number;
  dailyRate: number;
  currency: string;
  effectiveFrom: string;
  status: "active" | "draft";
  icon: React.ElementType;
  gradient: string;
  shadow: string;
}

/* ---------- Constants ---------- */
const regions = ["Global", "South Asia", "Middle East", "Southeast Asia", "Africa", "Europe", "North America"];

const skillIconMap: Record<string, { icon: React.ElementType; gradient: string; shadow: string }> = {
  "Frontend Development": { icon: Code2, gradient: "from-teal-500 to-teal-600", shadow: "shadow-teal-500/20" },
  "Backend Development": { icon: Server, gradient: "from-brown-400 to-brown-600", shadow: "shadow-brown-400/20" },
  "UI/UX Design": { icon: Palette, gradient: "from-gold-400 to-gold-500", shadow: "shadow-gold-400/20" },
  "QA Engineering": { icon: Bug, gradient: "from-teal-400 to-forest-500", shadow: "shadow-teal-400/20" },
};

const defaultIconConfig = { icon: Code2, gradient: "from-forest-500 to-teal-500", shadow: "shadow-forest-500/20" };

/* ---------- Mock data ---------- */
const initialRateCards: RateCard[] = [
  { id: "rc-1", skill: "Frontend Development", level: "Junior", region: "South Asia", hourlyRate: 25, dailyRate: 200, currency: "USD", effectiveFrom: "2026-01-15", status: "active", icon: Code2, gradient: "from-teal-500 to-teal-600", shadow: "shadow-teal-500/20" },
  { id: "rc-2", skill: "Frontend Development", level: "Mid", region: "South Asia", hourlyRate: 50, dailyRate: 400, currency: "USD", effectiveFrom: "2026-01-15", status: "active", icon: Code2, gradient: "from-teal-400 to-forest-500", shadow: "shadow-teal-400/20" },
  { id: "rc-3", skill: "Frontend Development", level: "Senior", region: "Global", hourlyRate: 85, dailyRate: 680, currency: "USD", effectiveFrom: "2026-01-15", status: "active", icon: Code2, gradient: "from-forest-500 to-forest-600", shadow: "shadow-forest-500/20" },
  { id: "rc-4", skill: "Backend Development", level: "Junior", region: "South Asia", hourlyRate: 30, dailyRate: 240, currency: "USD", effectiveFrom: "2026-02-01", status: "active", icon: Server, gradient: "from-brown-400 to-brown-600", shadow: "shadow-brown-400/20" },
  { id: "rc-5", skill: "Backend Development", level: "Mid", region: "Middle East", hourlyRate: 55, dailyRate: 440, currency: "USD", effectiveFrom: "2026-02-01", status: "active", icon: Server, gradient: "from-brown-500 to-brown-600", shadow: "shadow-brown-500/20" },
  { id: "rc-6", skill: "Backend Development", level: "Senior", region: "Global", hourlyRate: 95, dailyRate: 760, currency: "USD", effectiveFrom: "2026-02-01", status: "active", icon: Server, gradient: "from-brown-600 to-brown-700", shadow: "shadow-brown-600/20" },
  { id: "rc-7", skill: "UI/UX Design", level: "Junior", region: "Southeast Asia", hourlyRate: 28, dailyRate: 224, currency: "USD", effectiveFrom: "2026-01-20", status: "active", icon: Palette, gradient: "from-gold-400 to-gold-500", shadow: "shadow-gold-400/20" },
  { id: "rc-8", skill: "UI/UX Design", level: "Mid", region: "South Asia", hourlyRate: 50, dailyRate: 400, currency: "USD", effectiveFrom: "2026-01-20", status: "active", icon: Palette, gradient: "from-gold-500 to-gold-600", shadow: "shadow-gold-500/20" },
  { id: "rc-9", skill: "UI/UX Design", level: "Senior", region: "Global", hourlyRate: 75, dailyRate: 600, currency: "USD", effectiveFrom: "2026-01-20", status: "active", icon: Palette, gradient: "from-gold-600 to-brown-500", shadow: "shadow-gold-600/20" },
  { id: "rc-10", skill: "QA Engineering", level: "Mid", region: "Africa", hourlyRate: 40, dailyRate: 320, currency: "USD", effectiveFrom: "2026-03-01", status: "draft", icon: Bug, gradient: "from-teal-400 to-forest-500", shadow: "shadow-teal-400/20" },
];

/* ---------- Helpers ---------- */
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "PKR" ? "PKR" : currency === "EUR" ? "EUR" : currency === "GBP" ? "GBP" : "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const levelConfig = {
  Junior: { variant: "teal" as const, dot: true },
  Mid: { variant: "gold" as const, dot: true },
  Senior: { variant: "brown" as const, dot: true },
};

/* ---------- Rate Card Form Dialog ---------- */
function RateCardFormDialog({
  trigger,
  editCard,
  onSave,
  existingCards,
}: {
  trigger: React.ReactNode;
  editCard?: RateCard;
  onSave: (data: Omit<RateCard, "id" | "icon" | "gradient" | "shadow">) => void;
  existingCards: RateCard[];
}) {
  const [open, setOpen] = React.useState(false);
  const [skill, setSkill] = React.useState("");
  const [level, setLevel] = React.useState<string>("Junior");
  const [region, setRegion] = React.useState("Global");
  const [hourlyRate, setHourlyRate] = React.useState("");
  const [dailyRate, setDailyRate] = React.useState("");
  const [currency, setCurrency] = React.useState("USD");
  const [effectiveFrom, setEffectiveFrom] = React.useState("");
  const [conflictWarning, setConflictWarning] = React.useState("");

  // Reset form state when dialog opens
  React.useEffect(() => {
    if (open) {
      if (editCard) {
        setSkill(editCard.skill);
        setLevel(editCard.level);
        setRegion(editCard.region);
        setHourlyRate(editCard.hourlyRate.toString());
        setDailyRate(editCard.dailyRate.toString());
        setCurrency(editCard.currency);
        setEffectiveFrom(editCard.effectiveFrom);
      } else {
        setSkill("");
        setLevel("Junior");
        setRegion("Global");
        setHourlyRate("");
        setDailyRate("");
        setCurrency("USD");
        setEffectiveFrom(new Date().toISOString().split("T")[0]);
      }
      setConflictWarning("");
    }
  }, [open, editCard]);

  // Check for conflicts when key fields change
  React.useEffect(() => {
    if (!skill || !level || !region) {
      setConflictWarning("");
      return;
    }
    const conflict = existingCards.find(
      (c) =>
        c.skill.toLowerCase() === skill.toLowerCase() &&
        c.level === level &&
        c.region === region &&
        c.status === "active" &&
        c.id !== editCard?.id
    );
    if (conflict) {
      setConflictWarning(
        `An active rate card already exists for ${skill} / ${level} / ${region} ($${conflict.hourlyRate}/hr). Saving will create a duplicate.`
      );
    } else {
      setConflictWarning("");
    }
  }, [skill, level, region, existingCards, editCard]);

  const handleSubmit = () => {
    onSave({
      skill,
      level: level as RateCard["level"],
      region,
      hourlyRate: Number(hourlyRate),
      dailyRate: Number(dailyRate),
      currency,
      effectiveFrom: effectiveFrom || new Date().toISOString().split("T")[0],
      status: editCard?.status || "active",
    });
    setOpen(false);
    if (editCard) {
      toast.success("Rate Card Updated", `${skill} (${level}) rate card saved.`);
    } else {
      toast.success("Rate Card Added", `${skill} (${level}) added at $${hourlyRate}/hr.`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-brown-900 font-heading">
            {editCard ? "Edit Rate Card" : "Add Rate Card"}
          </DialogTitle>
          <DialogDescription className="text-beige-500">
            {editCard
              ? "Update the rate card details below."
              : "Define a new pricing tier for a skill, level, and region."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-[12px] text-brown-700">Skill Category</Label>
            <Input
              placeholder="e.g. Frontend Development"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label className="text-[12px] text-brown-700">Level</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Mid">Mid</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[12px] text-brown-700">Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[12px] text-brown-700">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="PKR">PKR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label className="text-[12px] text-brown-700">Hourly Rate</Label>
              <Input
                type="number"
                placeholder="0"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                icon={<DollarSign className="w-3.5 h-3.5" />}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[12px] text-brown-700">Daily Rate</Label>
              <Input
                type="number"
                placeholder="0"
                value={dailyRate}
                onChange={(e) => setDailyRate(e.target.value)}
                icon={<DollarSign className="w-3.5 h-3.5" />}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[12px] text-brown-700">Effective From</Label>
              <Input
                type="date"
                value={effectiveFrom}
                onChange={(e) => setEffectiveFrom(e.target.value)}
              />
            </div>
          </div>

          {conflictWarning && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-gold-50 border border-gold-200/60">
              <AlertTriangle className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-gold-700 leading-relaxed">
                {conflictWarning}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-xl border border-beige-200 text-[12px] font-semibold text-brown-700 hover:bg-beige-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!skill || !hourlyRate}
            className="px-4 py-2.5 rounded-xl bg-brown-600 hover:bg-brown-700 text-white text-[12px] font-semibold shadow-md hover:shadow-lg hover:shadow-brown-500/25 transition-all disabled:opacity-50"
          >
            {editCard ? "Save Changes" : "Add Rate Card"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Delete Confirmation Dialog ---------- */
function DeleteConfirmDialog({
  card,
  onConfirm,
}: {
  card: RateCard;
  onConfirm: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="p-2 rounded-lg text-beige-400 hover:text-[var(--danger)] hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-brown-900 font-heading">
            Delete Rate Card
          </DialogTitle>
          <DialogDescription className="text-beige-500">
            Are you sure you want to permanently delete the rate card for{" "}
            <span className="font-semibold text-brown-700">
              {card.skill} ({card.level})
            </span>{" "}
            in <span className="font-semibold text-brown-700">{card.region}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-xl border border-beige-200 text-[12px] font-semibold text-brown-700 hover:bg-beige-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              setOpen(false);
              toast.success(
                "Rate Card Deleted",
                `${card.skill} (${card.level}) in ${card.region} has been removed.`
              );
            }}
            className="px-4 py-2.5 rounded-xl bg-[var(--danger)] hover:bg-[var(--danger-hover)] text-white text-[12px] font-semibold shadow-md transition-all"
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Page ---------- */
export default function RateCardsPage() {
  const [rateCards, setRateCards] = React.useState(initialRateCards);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [skillFilter, setSkillFilter] = React.useState("all");
  const [regionFilter, setRegionFilter] = React.useState("all");

  // Derived data
  const uniqueSkills = React.useMemo(
    () => [...new Set(rateCards.map((c) => c.skill))].sort(),
    [rateCards]
  );
  const uniqueRegions = React.useMemo(
    () => [...new Set(rateCards.map((c) => c.region))].sort(),
    [rateCards]
  );

  const filtered = React.useMemo(() => {
    let list = [...rateCards];

    if (statusFilter !== "all") {
      list = list.filter((c) => c.status === statusFilter);
    }
    if (skillFilter !== "all") {
      list = list.filter((c) => c.skill === skillFilter);
    }
    if (regionFilter !== "all") {
      list = list.filter((c) => c.region === regionFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.skill.toLowerCase().includes(q) ||
          c.level.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q)
      );
    }

    return list;
  }, [rateCards, statusFilter, skillFilter, regionFilter, search]);

  const avgHourly = Math.round(
    rateCards.reduce((sum, r) => sum + r.hourlyRate, 0) / rateCards.length
  );
  const activeCount = rateCards.filter((r) => r.status === "active").length;

  const handleAddCard = (data: Omit<RateCard, "id" | "icon" | "gradient" | "shadow">) => {
    const iconConfig = skillIconMap[data.skill] || defaultIconConfig;
    const newCard: RateCard = {
      ...data,
      id: `rc-${Date.now()}`,
      icon: iconConfig.icon,
      gradient: iconConfig.gradient,
      shadow: iconConfig.shadow,
    };
    setRateCards((prev) => [...prev, newCard]);
  };

  const handleToggleStatus = (card: RateCard) => {
    const newStatus = card.status === "active" ? "draft" : "active";
    setRateCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, status: newStatus } : c))
    );
    toast.success(
      newStatus === "active" ? "Rate Card Activated" : "Rate Card Archived",
      `${card.skill} (${card.level}) is now ${newStatus === "active" ? "active" : "in draft"}.`
    );
  };

  const handleDeleteCard = (cardId: string) => {
    setRateCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto space-y-6"
    >
      {/* Page Header */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brown-500 to-gold-500 flex items-center justify-center shadow-md shadow-brown-500/20">
            <BadgeDollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brown-900 tracking-tight font-heading">
              Rate Cards
            </h1>
            <p className="text-sm text-beige-600 mt-0.5">
              Manage pricing tiers for different skill levels, regions, and contributor roles.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/enterprise/billing/pricing">
            <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-[1.5px] border-brown-300 text-brown-600 text-[12px] font-semibold hover:border-brown-500 hover:bg-brown-50 transition-all">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Task Pricing
            </button>
          </Link>
          <RateCardFormDialog
            trigger={
              <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brown-600 hover:bg-brown-700 text-white text-[12px] font-semibold shadow-md hover:shadow-lg hover:shadow-brown-500/25 transition-all hover:-translate-y-0.5">
                <Plus className="w-3.5 h-3.5" />
                Add Rate Card
              </button>
            }
            onSave={handleAddCard}
            existingCards={rateCards}
          />
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
              Active Rate Cards
            </span>
          </div>
          <p className="text-2xl font-bold text-brown-900 tracking-tight">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-forest-50 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5 text-forest-600" />
            </div>
            <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
              Avg Hourly Rate
            </span>
          </div>
          <p className="text-2xl font-bold text-brown-900 tracking-tight">${avgHourly}</p>
        </div>
        <div className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-gold-50 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-gold-600" />
            </div>
            <span className="text-[11px] font-semibold text-beige-500 uppercase tracking-wider">
              Total Cards
            </span>
          </div>
          <p className="text-2xl font-bold text-brown-900 tracking-tight">{rateCards.length}</p>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
      >
        <div className="flex-1 w-full sm:w-auto">
          <Input
            icon={<Search className="w-4 h-4" />}
            placeholder="Search by skill, level, or region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="w-full sm:w-36">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-44">
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue placeholder="Skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                {uniqueSkills.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-40">
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {uniqueRegions.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Rate Cards Table */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-beige-200/50 bg-white/70 backdrop-blur-sm overflow-hidden"
      >
        {/* Column Headers */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-5 py-3 bg-beige-50/40 border-b border-beige-100 text-[10px] font-semibold text-beige-500 uppercase tracking-wider">
          <div className="col-span-3">Skill</div>
          <div className="col-span-1">Level</div>
          <div className="col-span-1">Region</div>
          <div className="col-span-2 text-right">Hourly Rate</div>
          <div className="col-span-2 text-right">Daily Rate</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-2 text-center">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-beige-100/60">
          {filtered.map((card) => {
            const Icon = card.icon;
            const lConfig = levelConfig[card.level];

            return (
              <motion.div
                key={card.id}
                variants={scaleIn}
                className="group"
              >
                {/* Desktop row */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center px-5 py-4 hover:bg-beige-50/40 transition-colors">
                  <div className="col-span-3 flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-sm shrink-0",
                        card.gradient,
                        card.shadow
                      )}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[13px] font-semibold text-brown-900 block truncate">
                        {card.skill}
                      </span>
                      <span className="text-[10px] text-beige-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {formatDate(card.effectiveFrom)}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Badge variant={lConfig.variant} size="sm" dot={lConfig.dot}>
                      {card.level}
                    </Badge>
                  </div>
                  <div className="col-span-1">
                    <span className="text-[11px] font-medium text-beige-600 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-beige-400" />
                      {card.region}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-[14px] font-bold text-brown-900 tabular-nums">
                      {formatCurrency(card.hourlyRate, card.currency)}
                    </span>
                    <span className="text-[10px] text-beige-500 ml-1">/hr</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-[14px] font-bold text-brown-900 tabular-nums">
                      {formatCurrency(card.dailyRate, card.currency)}
                    </span>
                    <span className="text-[10px] text-beige-500 ml-1">/day</span>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Badge variant={card.status === "active" ? "forest" : "beige"} size="sm" dot>
                      {card.status === "active" ? "Active" : "Draft"}
                    </Badge>
                  </div>
                  <div className="col-span-2 flex justify-center gap-1">
                    <button
                      onClick={() => handleToggleStatus(card)}
                      className="p-2 rounded-lg text-beige-400 hover:text-brown-600 hover:bg-beige-50 transition-all opacity-0 group-hover:opacity-100"
                      title={card.status === "active" ? "Archive" : "Activate"}
                    >
                      {card.status === "active" ? (
                        <ToggleRight className="w-3.5 h-3.5 text-forest-500" />
                      ) : (
                        <ToggleLeft className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <RateCardFormDialog
                      trigger={
                        <button
                          className="p-2 rounded-lg text-beige-400 hover:text-brown-600 hover:bg-beige-50 transition-all opacity-0 group-hover:opacity-100"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      }
                      editCard={card}
                      onSave={(data) => {
                        const iconConfig = skillIconMap[data.skill] || defaultIconConfig;
                        setRateCards((prev) =>
                          prev.map((c) =>
                            c.id === card.id
                              ? { ...c, ...data, icon: iconConfig.icon, gradient: iconConfig.gradient, shadow: iconConfig.shadow }
                              : c
                          )
                        );
                      }}
                      existingCards={rateCards}
                    />
                    <DeleteConfirmDialog
                      card={card}
                      onConfirm={() => handleDeleteCard(card.id)}
                    />
                  </div>
                </div>

                {/* Mobile card */}
                <div className="lg:hidden p-4 hover:bg-beige-50/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-sm",
                          card.gradient,
                          card.shadow
                        )}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-brown-900">{card.skill}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant={lConfig.variant} size="sm" dot={lConfig.dot}>
                            {card.level}
                          </Badge>
                          <span className="text-[10px] text-beige-500">{card.region}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleStatus(card)}
                        className="p-2 rounded-lg text-beige-400 hover:text-brown-600 hover:bg-beige-50 transition-all"
                      >
                        {card.status === "active" ? (
                          <ToggleRight className="w-3.5 h-3.5 text-forest-500" />
                        ) : (
                          <ToggleLeft className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <RateCardFormDialog
                        trigger={
                          <button className="p-2 rounded-lg text-beige-400 hover:text-brown-600 hover:bg-beige-50 transition-all">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        }
                        editCard={card}
                        onSave={(data) => {
                          const iconConfig = skillIconMap[data.skill] || defaultIconConfig;
                          setRateCards((prev) =>
                            prev.map((c) =>
                              c.id === card.id
                                ? { ...c, ...data, icon: iconConfig.icon, gradient: iconConfig.gradient, shadow: iconConfig.shadow }
                                : c
                            )
                          );
                        }}
                        existingCards={rateCards}
                      />
                      <DeleteConfirmDialog
                        card={card}
                        onConfirm={() => handleDeleteCard(card.id)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-beige-100/60">
                    <div>
                      <p className="text-[10px] text-beige-500 uppercase tracking-wider">Hourly</p>
                      <p className="text-[14px] font-bold text-brown-900">
                        {formatCurrency(card.hourlyRate, card.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-beige-500 uppercase tracking-wider">Daily</p>
                      <p className="text-[14px] font-bold text-brown-900">
                        {formatCurrency(card.dailyRate, card.currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-beige-500 uppercase tracking-wider mb-0.5">
                        {formatDate(card.effectiveFrom)}
                      </p>
                      <Badge variant={card.status === "active" ? "forest" : "beige"} size="sm" dot>
                        {card.status === "active" ? "Active" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <BadgeDollarSign className="w-8 h-8 text-beige-300 mb-2" />
            <p className="text-sm text-beige-500">No rate cards match your filters</p>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setSkillFilter("all");
                setRegionFilter("all");
              }}
              className="mt-2 text-[12px] text-teal-600 hover:text-teal-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
