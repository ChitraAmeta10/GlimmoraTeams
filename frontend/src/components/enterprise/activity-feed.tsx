"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import type { ActivityEvent } from "@/types/enterprise";

interface ActivityFeedProps {
  events: ActivityEvent[];
  maxItems?: number;
  className?: string;
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ActivityFeed({ events, maxItems = 8, className }: ActivityFeedProps) {
  const items = events.slice(0, maxItems);

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((event) => (
        <div key={event.id} className="flex items-start gap-3 group">
          <div
            className={cn(
              "w-7 h-7 rounded-full bg-gradient-to-br flex items-center justify-center text-[9px] font-bold text-white shrink-0",
              event.color
            )}
          >
            {event.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-brown-700 leading-relaxed">
              <span className="font-semibold">{event.actor}</span>{" "}
              {event.action}{" "}
              <span className="font-semibold">{event.target}</span>
            </p>
            <p className="text-[10px] text-beige-400 mt-0.5">
              {timeAgo(event.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
