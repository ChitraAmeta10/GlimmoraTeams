"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface MeshBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "warm" | "cool" | "dark";
  animated?: boolean;
}

export function MeshBackground({
  className,
  variant = "default",
  animated = true,
  children,
  ...props
}: MeshBackgroundProps) {
  const meshStyles = {
    default: (
      <>
        <div
          className={cn(
            "absolute w-[600px] h-[600px] rounded-full opacity-[0.07] blur-3xl",
            "bg-brown-400 top-[-10%] left-[-5%]",
            animated && "animate-[mesh-move_20s_ease-in-out_infinite]"
          )}
        />
        <div
          className={cn(
            "absolute w-[500px] h-[500px] rounded-full opacity-[0.05] blur-3xl",
            "bg-teal-400 bottom-[-10%] right-[-5%]",
            animated &&
              "animate-[mesh-move_25s_ease-in-out_infinite_reverse]"
          )}
        />
        <div
          className={cn(
            "absolute w-[400px] h-[400px] rounded-full opacity-[0.04] blur-3xl",
            "bg-gold-400 top-[40%] left-[50%]",
            animated && "animate-[mesh-move_30s_ease-in-out_infinite]"
          )}
        />
      </>
    ),
    warm: (
      <>
        <div
          className={cn(
            "absolute w-[600px] h-[600px] rounded-full opacity-[0.08] blur-3xl",
            "bg-brown-400 top-[-10%] right-[10%]",
            animated && "animate-[mesh-move_20s_ease-in-out_infinite]"
          )}
        />
        <div
          className={cn(
            "absolute w-[500px] h-[500px] rounded-full opacity-[0.06] blur-3xl",
            "bg-gold-400 bottom-[10%] left-[-5%]",
            animated &&
              "animate-[mesh-move_25s_ease-in-out_infinite_reverse]"
          )}
        />
      </>
    ),
    cool: (
      <>
        <div
          className={cn(
            "absolute w-[600px] h-[600px] rounded-full opacity-[0.07] blur-3xl",
            "bg-teal-400 top-[-10%] left-[20%]",
            animated && "animate-[mesh-move_22s_ease-in-out_infinite]"
          )}
        />
        <div
          className={cn(
            "absolute w-[500px] h-[500px] rounded-full opacity-[0.05] blur-3xl",
            "bg-forest-400 bottom-[-5%] right-[10%]",
            animated &&
              "animate-[mesh-move_28s_ease-in-out_infinite_reverse]"
          )}
        />
      </>
    ),
    dark: (
      <>
        <div
          className={cn(
            "absolute w-[500px] h-[500px] rounded-full opacity-[0.12] blur-3xl",
            "bg-brown-600 top-[-15%] left-[10%]",
            animated && "animate-[mesh-move_20s_ease-in-out_infinite]"
          )}
        />
        <div
          className={cn(
            "absolute w-[400px] h-[400px] rounded-full opacity-[0.10] blur-3xl",
            "bg-teal-700 bottom-[5%] right-[5%]",
            animated &&
              "animate-[mesh-move_26s_ease-in-out_infinite_reverse]"
          )}
        />
      </>
    ),
  };

  return (
    <div
      className={cn(
        "relative",
        variant === "dark" ? "bg-brown-950" : "bg-beige-50",
        className
      )}
      {...props}
    >
      {/* Blobs clipped to their own container so they never affect layout or overflow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {meshStyles[variant]}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
