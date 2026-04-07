"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/layout";
import { enterpriseNav } from "@/lib/config/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import OnboardingModal from "./onboarding/components/OnboardingModal";

export default function EnterpriseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOnboardingComplete = useAuthStore((s) => s.isOnboardingComplete);
  const isOnboarding = pathname.startsWith("/enterprise/onboarding");

  return (
    <>
      <AppShell config={enterpriseNav}>
        {isOnboarding ? null : children}
      </AppShell>
      {(isOnboarding || !isOnboardingComplete) && <OnboardingModal />}
    </>
  );
}
