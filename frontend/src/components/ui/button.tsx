"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-body text-sm font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-brown-500 text-white shadow-md hover:bg-brown-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brown-500/25 active:translate-y-0",
        secondary:
          "bg-forest-500 text-white shadow-md hover:bg-forest-600 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0",
        outline:
          "border-[1.5px] border-brown-300 text-brown-600 bg-transparent hover:border-brown-500 hover:bg-brown-50",
        ghost:
          "text-teal-600 bg-transparent hover:bg-teal-50 hover:text-teal-700",
        gold:
          "bg-gold-500 text-gold-950 shadow-md hover:bg-gold-600 hover:text-white hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0",
        danger:
          "bg-red-500 text-white shadow-md hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0",
        glass:
          "glass text-brown-800 hover:bg-white/70 hover:-translate-y-0.5",
        "gradient-primary":
          "bg-gradient-to-r from-brown-500 to-brown-600 text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brown-500/25 active:translate-y-0",
        "gradient-cta":
          "bg-gradient-to-r from-brown-500 to-gold-500 text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brown-500/20 active:translate-y-0",
        "gradient-forest":
          "bg-gradient-to-r from-forest-500 to-teal-500 text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0",
        link:
          "text-teal-600 underline-offset-4 hover:underline hover:text-teal-700 p-0 h-auto",
      },
      size: {
        sm: "h-8 px-4 text-xs rounded-lg",
        md: "h-10 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg rounded-2xl",
        icon: "h-10 w-10 rounded-lg",
        "icon-sm": "h-8 w-8 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
