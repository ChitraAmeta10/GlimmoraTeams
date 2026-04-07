"use client";

import { AppShell } from "@/components/layout";
import { contributorNav } from "@/lib/config/navigation";

export default function ContributorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell config={contributorNav}>{children}</AppShell>;
}
