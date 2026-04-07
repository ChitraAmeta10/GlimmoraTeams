"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X, CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-xl p-4 shadow-xl transition-all",
  {
    variants: {
      variant: {
        default: "glass-heavy border border-beige-200/50 text-brown-900",
        success: "bg-forest-50 border border-forest-200 text-forest-900",
        warning: "bg-gold-50 border border-gold-200 text-gold-900",
        error: "bg-red-50 border border-red-200 text-red-900",
        info: "bg-teal-50 border border-teal-200 text-teal-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const toastIcons = {
  default: null,
  success: <CheckCircle2 className="h-5 w-5 text-forest-500 shrink-0" />,
  warning: <AlertTriangle className="h-5 w-5 text-gold-600 shrink-0" />,
  error: <XCircle className="h-5 w-5 text-red-500 shrink-0" />,
  info: <Info className="h-5 w-5 text-teal-600 shrink-0" />,
};

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title: string;
  description?: string;
  onClose?: () => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", title, description, onClose, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), "animate-slide-up", className)}
        {...props}
      >
        {variant && toastIcons[variant]}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          {description && (
            <p className="text-xs mt-0.5 opacity-70">{description}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="shrink-0 rounded-md p-1 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
Toast.displayName = "Toast";

export { Toast, toastVariants };
