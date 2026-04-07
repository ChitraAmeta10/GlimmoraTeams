"use client";

import { AppShell } from "@/components/layout";
import { analyticsNav } from "@/lib/config/navigation";

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell config={analyticsNav}>{children}</AppShell>;
}
