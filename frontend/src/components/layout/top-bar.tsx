"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ModuleConfig } from "@/lib/config/navigation";
import { mockPlans, mockTeams } from "@/mocks/data/enterprise-projects";
import { mockSOWs } from "@/mocks/data/enterprise-sow";

const segmentLabels: Record<string, string> = {
  apg: "Policies", "sow-forms": "SOW Intake Forms", "clause-library": "Clause Library",
  "review-rubrics": "Review Rubrics", sow: "SOW Repository", intake: "Create New SOW",
  upload: "Upload SOW", generate: "Generate SOW", review: "Review Draft", users: "Contributors",
};
const templateNames: Record<string, string> = {
  "tpl-001": "Healthcare Standard SOW", "tpl-002": "FinTech Compliance SOW",
  "tpl-003": "Technology Platform SOW", "tpl-004": "Retail E-Commerce SOW",
  "tpl-005": "General Purpose SOW", "tpl-006": "Government RFP SOW",
};

function getFriendlyLabel(segment: string, _prev: string[]): string | null {
  if (segmentLabels[segment]) return segmentLabels[segment];
  const plan = mockPlans.find((p) => p.id === segment);
  if (plan) return plan.title;
  const sow = mockSOWs.find((s) => s.id === segment);
  if (sow) return sow.title;
  const team = mockTeams.find((t) => t.id === segment);
  if (team) return team.name;
  if (templateNames[segment]) return templateNames[segment];
  return null;
}

interface TopBarProps { config: ModuleConfig; }

export function TopBar({ config }: TopBarProps) {
  const pathname = usePathname();
  const { openMobile } = useSidebarStore();
  const [searchFocused, setSearchFocused] = React.useState(false);

  const breadcrumbs = React.useMemo(() => {
    const allSegments = pathname.split("/").filter(Boolean);
    const hiddenPrefixes = ["enterprise"];
    const crumbs = allSegments
      .map((seg, i) => ({
        seg,
        label: getFriendlyLabel(seg, allSegments.slice(0, i)) ??
          seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        href: "/" + allSegments.slice(0, i + 1).join("/"),
        hidden: hiddenPrefixes.includes(seg),
      }))
      .filter((crumb) => !crumb.hidden);
    const dashboardHref = "/" + allSegments.slice(0, allSegments.indexOf("enterprise") + 1).join("/") + "/dashboard";
    const isOnDashboard = crumbs.length === 1 && crumbs[0].seg === "dashboard";
    if (!isOnDashboard) crumbs.unshift({ seg: "dashboard", label: "Dashboard", href: dashboardHref, hidden: false });
    return crumbs.map((c, i) => ({ ...c, isLast: i === crumbs.length - 1 }));
  }, [pathname]);

  const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard";

  return (
    <header
      className="sticky top-0 z-30"
      style={{
        background: "rgba(255, 255, 255, 0.72)",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        height: 52,
      }}
    >
      <div className="flex items-center justify-between h-full px-8">
        <div className="flex items-center gap-3">
          <button onClick={openMobile} className="lg:hidden p-1.5 -ml-1 rounded-lg text-gray-400 hover:bg-white/50 transition-all">
            <Menu className="w-5 h-5" />
          </button>

          <nav className="hidden sm:flex items-center gap-1.5 text-[13px]">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={crumb.href}>
                {i > 0 && <span className="text-gray-300 text-[11px]">/</span>}
                {crumb.isLast ? (
                  <span className="font-medium text-gray-800">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="text-gray-400 hover:text-gray-600 transition-colors">{crumb.label}</Link>
                )}
              </React.Fragment>
            ))}
          </nav>

          <span className="sm:hidden text-[14px] font-medium text-gray-800">{pageTitle}</span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search */}
          <div
            className={cn(
              "relative hidden md:flex items-center gap-2 rounded-full transition-all duration-300",
              searchFocused ? "w-60" : "w-52"
            )}
            style={{
              background: searchFocused ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)",
              border: searchFocused ? "1px solid rgba(0,0,0,0.10)" : "1px solid rgba(0,0,0,0.06)",
              padding: "6px 14px",
              boxShadow: searchFocused ? "0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)" : "inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            <Search className="w-[13px] h-[13px] shrink-0 text-gray-400" />
            <input
              type="text"
              placeholder="Search everything…"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="border-none outline-none bg-transparent w-full text-[13px] text-gray-700 placeholder:text-gray-400"
            />
            {!searchFocused && (
              <kbd className="font-mono whitespace-nowrap shrink-0 text-[9px] text-gray-400 bg-black/[0.04] border border-black/[0.06] px-1.5 py-px rounded">⌘K</kbd>
            )}
          </div>

          {/* Bell */}
          <button className="relative flex items-center justify-center w-8 h-8 rounded-full text-gray-500 bg-white/50 border border-white/30 hover:bg-white/70 transition-all">
            <Bell className="w-[14px] h-[14px]" />
            <span className="absolute top-1.5 right-1.5 w-[6px] h-[6px] rounded-full bg-brown-500" style={{ boxShadow: "0 0 6px rgba(166,119,99,0.5)" }} />
          </button>

          {/* Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-teal-200/40 focus:ring-offset-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-white text-xs font-semibold transition-shadow"
                  style={{
                    background: "linear-gradient(135deg, #A67763, #D0B060)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  }}
                >
                  PN
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-semibold"
                    style={{ background: "linear-gradient(135deg, #5B9BA2, #4D5741)" }}>PN</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Priya Nair</p>
                    <p className="text-xs text-gray-400">priya@enterprise.com</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><User className="w-4 h-4" /> <span>Profile</span></DropdownMenuItem>
              <DropdownMenuItem><Settings className="w-4 h-4" /> <span>Settings</span></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[var(--danger)] focus:text-[var(--danger-hover)] focus:bg-[var(--danger-light)]">
                <LogOut className="w-4 h-4" /> <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
