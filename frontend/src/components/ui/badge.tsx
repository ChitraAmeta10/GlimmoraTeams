"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-body font-semibold tracking-wide transition-colors",
  {
    variants: {
      variant: {
        brown: "bg-brown-100 text-brown-700",
        forest: "bg-forest-100 text-forest-700",
        teal: "bg-teal-100 text-teal-700",
        gold: "bg-gold-100 text-gold-800",
        beige: "bg-beige-200 text-beige-800",
        danger: "bg-red-100 text-red-700",
        glass: "glass text-brown-700",
        "gradient-brown": "bg-gradient-to-r from-brown-500 to-brown-600 text-white",
        "gradient-forest": "bg-gradient-to-r from-forest-500 to-teal-500 text-white",
        "gradient-gold": "bg-gradient-to-r from-gold-500 to-gold-600 text-white",
      },
      size: {
        sm: "px-2.5 py-0.5 text-[0.65rem]",
        md: "px-3.5 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "brown",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {dot && (
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
        )}
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
