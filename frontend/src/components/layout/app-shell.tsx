"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { Toaster } from "@/components/ui/toaster";
import type { ModuleConfig } from "@/lib/config/navigation";

interface AppShellProps {
  config: ModuleConfig;
  children: React.ReactNode;
}

export function AppShell({ config, children }: AppShellProps) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div
      className="min-h-screen relative overflow-x-clip"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 80% -10%, color-mix(in srgb, var(--color-gold-200) 12%, transparent) 0%, transparent 70%),
          radial-gradient(ellipse 60% 60% at -5% 60%, color-mix(in srgb, var(--color-teal-200) 8%, transparent) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 50% 100%, color-mix(in srgb, var(--color-brown-200) 6%, transparent) 0%, transparent 50%),
          linear-gradient(180deg, var(--color-beige-50) 0%, #FFFFFF 40%, var(--color-gray-50) 100%)
        `,
      }}
    >

      <Sidebar config={config} />

      <motion.div
        animate={{ marginLeft: isCollapsed ? 64 : 220 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 min-h-screen lg:ml-[220px] ml-0"
      >
        <TopBar config={config} />
        <main className="px-8 py-8 pb-20" style={{ maxWidth: 1380 }}>
          {children}
        </main>
      </motion.div>

      <Toaster />
    </div>
  );
}
