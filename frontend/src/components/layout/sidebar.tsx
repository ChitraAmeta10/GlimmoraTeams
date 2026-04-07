"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import type { ModuleConfig } from "@/lib/config/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  config: ModuleConfig;
}

export function Sidebar({ config }: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, toggle, closeMobile } = useSidebarStore();
  const [expandedSections, setExpandedSections] = React.useState<
    Record<number, boolean>
  >({});

  React.useEffect(() => {
    const initial: Record<number, boolean> = {};
    config.sections.forEach((_, idx) => {
      initial[idx] = true;
    });
    setExpandedSections(initial);
  }, [config.sections]);

  function toggleSection(idx: number) {
    setExpandedSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  const allHrefs = React.useMemo(
    () => config.sections.flatMap((s) => s.items.map((i) => i.href)),
    [config.sections]
  );

  function isActive(href: string) {
    if (pathname === href) return true;
    if (
      href === config.basePath + "/dashboard" ||
      href === config.basePath + "/overview"
    )
      return false;
    const hasMoreSpecific = allHrefs.some(
      (h) =>
        h !== href && h.startsWith(href + "/") && pathname.startsWith(h)
    );
    if (hasMoreSpecific) return false;
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div
        className={cn(
          "flex items-center shrink-0",
          isCollapsed ? "px-3 justify-center" : "px-5"
        )}
        style={{ height: 52 }}
      >
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #A67763, #D0B060)",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              <Sparkles className="w-[14px] h-[14px] text-white" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.12 }}
                  className="min-w-0"
                >
                  <p className="text-[13.5px] font-semibold tracking-[-0.02em] leading-tight text-gray-900">
                    Glimmora
                  </p>
                  <p className="text-[8px] tracking-[0.14em] uppercase leading-tight text-gray-400">
                    {config.shortName}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
          {!isCollapsed && (
            <button
              onClick={toggle}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-all shrink-0"
            >
              <PanelLeftClose className="w-[14px] h-[14px]" />
            </button>
          )}
          {isCollapsed && (
            <button
              onClick={toggle}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-all shrink-0"
            >
              <PanelLeftOpen className="w-[14px] h-[14px]" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav
        className={cn(
          "flex-1 overflow-y-auto pb-6",
          isCollapsed ? "px-2 pt-3" : "px-3 pt-4"
        )}
        style={{ scrollbarWidth: "none" }}
      >
        <TooltipProvider delayDuration={0}>
          {config.sections.map((section, sIdx) => {
            const isExpanded = expandedSections[sIdx] ?? true;
            const hasSectionTitle = !!section.title;

            return (
              <div key={sIdx} className="pb-1">
                {hasSectionTitle && !isCollapsed && (
                  <button
                    onClick={() => toggleSection(sIdx)}
                    className="flex items-center justify-between w-full px-3 mb-1 group"
                    style={{
                      marginTop: sIdx > 0 ? 18 : 4,
                      paddingTop: 4,
                      paddingBottom: 4,
                    }}
                  >
                    <span className="font-semibold uppercase text-[8.5px] tracking-[0.18em] text-gray-400">
                      {section.title}
                    </span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 0 : -90 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ChevronDown className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </button>
                )}

                {hasSectionTitle && isCollapsed && sIdx > 0 && (
                  <div className="my-2" />
                )}

                <AnimatePresence initial={false}>
                  {(isExpanded || isCollapsed || !hasSectionTitle) && (
                    <motion.div
                      initial={
                        hasSectionTitle
                          ? { height: 0, opacity: 0 }
                          : false
                      }
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.2,
                        ease: "easeInOut",
                      }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5">
                        {section.items.map((item) => {
                          const active = isActive(item.href);
                          const Icon = item.icon;

                          const link = (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => closeMobile()}
                              className={cn(
                                "group/item relative flex items-center gap-2.5 rounded-xl transition-colors duration-150",
                                isCollapsed
                                  ? "justify-center px-2 py-2.5"
                                  : "px-3 py-[8px]",
                                active
                                  ? "text-brown-700 font-medium"
                                  : "text-gray-500 hover:text-gray-600 hover:bg-white/40"
                              )}
                              style={{
                                fontSize: "12.5px",
                                ...(active ? {
                                  background: "linear-gradient(90deg, rgba(166,119,99,0.09) 0%, transparent 80%)",
                                } : {}),
                              }}
                            >

                              <Icon
                                className={cn(
                                  "shrink-0",
                                  isCollapsed
                                    ? "w-4 h-4"
                                    : "w-[14px] h-[14px]"
                                )}
                              />
                              <AnimatePresence>
                                {!isCollapsed && (
                                  <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="whitespace-nowrap overflow-hidden"
                                  >
                                    {item.label}
                                  </motion.span>
                                )}
                              </AnimatePresence>

                              {item.badge && !isCollapsed && (
                                <span className="ml-auto font-mono text-[10px] text-gray-400">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          );

                          if (isCollapsed) {
                            return (
                              <Tooltip key={item.href}>
                                <TooltipTrigger asChild>
                                  {link}
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  {item.label}
                                </TooltipContent>
                              </Tooltip>
                            );
                          }
                          return (
                            <React.Fragment key={item.href}>
                              {link}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </TooltipProvider>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <motion.aside
        animate={{ width: isCollapsed ? 64 : 220 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:flex flex-col fixed top-0 left-0 h-screen z-40 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(246,241,239,0.45) 0%, rgba(255,255,255,0.98) 100%)",
          borderRight: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px] lg:hidden"
              onClick={closeMobile}
            />
            <motion.aside
              initial={{ x: -220 }}
              animate={{ x: 0 }}
              exit={{ x: -220 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-screen w-[220px] z-50 lg:hidden overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(246,241,239,0.5) 0%, rgba(255,255,255,1) 100%)",
                borderRight: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "4px 0 30px rgba(0,0,0,0.04)",
              }}
            >
              <button
                onClick={closeMobile}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:bg-white/50 z-20"
              >
                <X className="w-4 h-4" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
