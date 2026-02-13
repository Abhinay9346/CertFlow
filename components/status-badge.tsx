"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "Pending" | "Approved" | "Rejected";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        status === "Pending" &&
          "bg-warning/15 text-warning",
        status === "Approved" &&
          "bg-success/15 text-success",
        status === "Rejected" &&
          "bg-destructive/15 text-destructive",
        className
      )}
    >
      {status}
    </span>
  );
}
