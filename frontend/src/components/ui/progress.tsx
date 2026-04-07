"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const progressVariants = cva("relative w-full overflow-hidden rounded-full", {
  variants: {
    size: {
      sm: "h-1.5",
      md: "h-2.5",
      lg: "h-4",
    },
    background: {
      default: "bg-beige-200",
      glass: "bg-white/30",
    },
  },
  defaultVariants: {
    size: "md",
    background: "default",
  },
});

const indicatorVariants = cva(
  "h-full rounded-full transition-all duration-500 ease-out",
  {
    variants: {
      variant: {
        brown: "bg-brown-500",
        forest: "bg-forest-500",
        teal: "bg-teal-500",
        gold: "bg-gold-500",
        "gradient-brown": "bg-gradient-to-r from-brown-400 to-brown-600",
        "gradient-forest": "bg-gradient-to-r from-forest-500 to-teal-500",
        "gradient-mixed": "bg-gradient-to-r from-brown-500 to-gold-500",
        "gradient-full":
          "bg-gradient-to-r from-brown-500 via-gold-500 to-teal-500",
      },
    },
    defaultVariants: {
      variant: "gradient-brown",
    },
  }
);

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof indicatorVariants> {
  showValue?: boolean;
}

const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    { className, value, size, background, variant, showValue, ...props },
    ref
  ) => (
    <div className="relative w-full">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(progressVariants({ size, background, className }))}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(indicatorVariants({ variant }))}
          style={{ width: `${value || 0}%` }}
        />
      </ProgressPrimitive.Root>
      {showValue && (
        <span className="absolute right-0 -top-5 text-xs font-semibold text-brown-700 font-mono">
          {value}%
        </span>
      )}
    </div>
  )
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
