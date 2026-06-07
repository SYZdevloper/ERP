"use client";

import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const getStatusStyles = (statusVal: string) => {
    const s = statusVal.toLowerCase();
    switch (s) {
      case "draft":
        return "bg-slate-100 text-slate-600 border-slate-200";
      case "confirmed":
      case "approved":
      case "received":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "approval":
      case "pending":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "partially received":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "cancelled":
      case "rejected":
        return "bg-rose-50 text-rose-600 border-rose-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <Badge variant="outline" className={`font-medium text-[11px] hover:bg-transparent ${getStatusStyles(status)} ${className}`}>
      {status}
    </Badge>
  );
}
