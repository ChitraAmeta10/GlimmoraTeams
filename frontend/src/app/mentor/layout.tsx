"use client";

import { AppShell } from "@/components/layout";
import { mentorNav } from "@/lib/config/navigation";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell config={mentorNav}>{children}</AppShell>;
}
