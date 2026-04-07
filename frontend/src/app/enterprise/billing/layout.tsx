"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wallet,
  Receipt,
  BadgeDollarSign,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const billingTabs: { label: string; href: string; icon: typeof Wallet; exact?: boolean }[] = [
  { label: "Overview", href: "/enterprise/billing", icon: Wallet, exact: true },
  { label: "Invoices", href: "/enterprise/billing/invoices", icon: Receipt },
  { label: "Rate Cards", href: "/enterprise/billing/rate-cards", icon: BadgeDollarSign },
  { label: "Task Pricing", href: "/enterprise/billing/pricing", icon: DollarSign },
  { label: "Reports", href: "/enterprise/billing/reports", icon: BarChart3 },
];

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-5">
      {/* Tab Navigation */}
      <nav className="flex items-center gap-1 rounded-xl bg-beige-100/80 p-1 backdrop-blur-sm overflow-x-auto">
        {billingTabs.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-[13px] font-medium transition-all duration-200",
                "hover:text-brown-700",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-500 focus-visible:ring-offset-2",
                isActive
                  ? "bg-white text-brown-900 shadow-sm font-semibold"
                  : "text-beige-600"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", isActive ? "text-brown-600" : "text-beige-400")} />
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Page Content */}
      {children}
    </div>
  );
}
