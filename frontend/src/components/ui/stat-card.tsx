"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const statCardVariants = cva(
  "rounded-2xl p-6 transition-all duration-300 relative overflow-hidden",
  {
    variants: {
      variant: {
        glass: "glass",
        solid: "bg-white border border-beige-200 shadow-sm",
        "gradient-brown":
          "bg-gradient-to-br from-brown-500 to-brown-700 text-white",
        "gradient-forest":
          "bg-gradient-to-br from-forest-500 to-teal-600 text-white",
        "gradient-teal":
          "bg-gradient-to-br from-teal-500 to-teal-700 text-white",
        "gradient-gold":
          "bg-gradient-to-br from-gold-400 to-gold-600 text-white",
        "gradient-mixed":
          "bg-gradient-to-br from-brown-500 to-gold-500 text-white",
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-1 hover:shadow-xl cursor-pointer",
        glow: "hover:shadow-lg hover:shadow-brown-500/15 cursor-pointer",
      },
    },
    defaultVariants: {
      variant: "glass",
      hover: "lift",
    },
  }
);

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  subtitle?: string;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      variant,
      hover,
      label,
      value,
      change,
      changeType = "neutral",
      icon,
      subtitle,
      ...props
    },
    ref
  ) => {
    const isGradient = variant?.startsWith("gradient-");
    const changeColors = {
      positive: isGradient ? "text-white/80" : "text-forest-600",
      negative: isGradient ? "text-white/80" : "text-red-500",
      neutral: isGradient ? "text-white/60" : "text-beige-600",
    };

    return (
      <div
        ref={ref}
        className={cn(statCardVariants({ variant, hover, className }))}
        {...props}
      >
        {/* Decorative gradient orb for gradient variants */}
        {isGradient && (
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10 blur-xl" />
        )}

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <p
              className={cn(
                "text-xs font-semibold uppercase tracking-wider",
                isGradient ? "text-white/70" : "text-beige-600"
              )}
            >
              {label}
            </p>
            {icon && (
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-xl",
                  isGradient ? "bg-white/15" : "bg-brown-50"
                )}
              >
                {icon}
              </div>
            )}
          </div>

          <p
            className={cn(
              "font-heading text-3xl font-bold tracking-tight",
              isGradient ? "text-white" : "text-brown-950"
            )}
          >
            {value}
          </p>

          {(change || subtitle) && (
            <div className="flex items-center gap-2 mt-2">
              {change && (
                <span
                  className={cn(
                    "text-xs font-semibold",
                    changeColors[changeType]
                  )}
                >
                  {changeType === "positive" && "+"}{change}
                </span>
              )}
              {subtitle && (
                <span
                  className={cn(
                    "text-xs",
                    isGradient ? "text-white/50" : "text-beige-500"
                  )}
                >
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
StatCard.displayName = "StatCard";

export { StatCard };
