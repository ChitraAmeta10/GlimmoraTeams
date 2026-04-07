"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { CheckCircle2, Circle, Clock, AlertTriangle } from "lucide-react";

interface TimelineStep {
  label: string;
  description?: string;
  timestamp?: string;
  status: "completed" | "current" | "upcoming" | "error";
}

interface StatusTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    line: "bg-forest-500",
    dot: "bg-forest-500 text-white",
    label: "text-brown-800 font-semibold",
    desc: "text-beige-600",
  },
  current: {
    icon: Clock,
    line: "bg-beige-200",
    dot: "bg-teal-500 text-white ring-4 ring-teal-100",
    label: "text-brown-900 font-semibold",
    desc: "text-teal-700",
  },
  upcoming: {
    icon: Circle,
    line: "bg-beige-200",
    dot: "bg-beige-200 text-beige-500",
    label: "text-beige-500",
    desc: "text-beige-400",
  },
  error: {
    icon: AlertTriangle,
    line: "bg-beige-200",
    dot: "bg-[var(--danger)] text-white",
    label: "text-brown-800 font-semibold",
    desc: "text-[var(--danger)]",
  },
};

export function StatusTimeline({ steps, className }: StatusTimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {steps.map((step, i) => {
        const config = statusConfig[step.status];
        const Icon = config.icon;
        const isLast = i === steps.length - 1;

        return (
          <div key={i} className="flex gap-4 pb-6 last:pb-0">
            {/* Vertical line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all",
                  config.dot
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              {!isLast && (
                <div className={cn("w-0.5 flex-1 mt-1", config.line)} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-1">
              <p className={cn("text-sm", config.label)}>{step.label}</p>
              {step.description && (
                <p className={cn("text-xs mt-0.5", config.desc)}>
                  {step.description}
                </p>
              )}
              {step.timestamp && (
                <p className="text-[10px] text-beige-400 mt-1">
                  {step.timestamp}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
