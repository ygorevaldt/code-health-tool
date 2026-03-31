"use client";

import React from "react";

interface MetricCardProps {
  label: string;
  value: number;
  className?: string;
  icon?: React.ReactNode;
}

export default function MetricCard({ label, value, className, icon }: MetricCardProps) {
  const isHigh = value >= 80;
  const isMedium = value >= 60;

  const colorClass = isHigh ? "text-emerald-500" : isMedium ? "text-amber-500" : "text-rose-500";

  return (
    <div className={`group flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">{label}</p>
        {icon && <div className="text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-600 dark:group-hover:text-zinc-400">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <p className={`text-3xl font-bold tracking-tight ${colorClass}`}>{value}</p>
        {label === "Duplication" && <span className="text-xs font-medium text-zinc-400 dark:text-zinc-600">%</span>}
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
        <div className={`h-full rounded-full ${isHigh ? "bg-emerald-500" : isMedium ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
