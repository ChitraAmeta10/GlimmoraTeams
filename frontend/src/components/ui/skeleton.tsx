"use client";

import { cn } from "@/lib/utils/cn";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl bg-beige-200/60 shimmer",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
