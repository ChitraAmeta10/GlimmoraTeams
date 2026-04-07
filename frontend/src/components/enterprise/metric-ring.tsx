"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface MetricRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: "brown" | "forest" | "teal" | "gold";
  label?: string;
  className?: string;
}

const colorMap = {
  brown: { stroke: "#A67763", bg: "#F6F1EF" },
  forest: { stroke: "#4D5741", bg: "#EDEEEC" },
  teal: { stroke: "#5B9BA2", bg: "#EEF5F5" },
  gold: { stroke: "#D0B060", bg: "#FAF7EF" },
};

export function MetricRing({
  value,
  max = 100,
  size = 80,
  strokeWidth = 6,
  color = "teal",
  label,
  className,
}: MetricRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference * (1 - progress);
  const colors = colorMap[color];

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.bg}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold text-brown-900 tracking-tight">
          {max === 100 ? Math.round(value) : value}
          {max === 100 && <span className="text-[10px] text-beige-500">%</span>}
        </span>
        {label && (
          <span className="text-[9px] text-beige-500 font-medium">{label}</span>
        )}
      </div>
    </div>
  );
}
