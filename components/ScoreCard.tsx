"use client";

import React from "react";

interface ScoreCardProps {
  score: number | null;
}

export default function ScoreCard({ score }: ScoreCardProps) {
  const getScoreColor = (value: number) => {
    if (value >= 90) return "text-emerald-500 dark:text-emerald-400";
    if (value >= 70) return "text-amber-500 dark:text-amber-400";
    return "text-rose-500 dark:text-rose-400";
  };

  const getScoreLabel = (value: number) => {
    if (value >= 90) return "Excelente";
    if (value >= 70) return "Bom";
    return "Crítico";
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Code Health Score</p>
      <div className="relative">
        <div className={`text-8xl font-black tracking-tighter ${score !== null ? getScoreColor(score) : "text-zinc-200 dark:text-zinc-800"}`}>
          {score !== null ? score : "--"}
        </div>
        {score !== null && (
          <div className="absolute -right-8 bottom-4 text-sm font-bold text-zinc-400 dark:text-zinc-600">/100</div>
        )}
      </div>
      {score !== null && (
        <div className={`rounded-full bg-zinc-100 px-4 py-1 text-xs font-bold uppercase tracking-wider dark:bg-zinc-900 ${getScoreColor(score)}`}>
          {getScoreLabel(score)}
        </div>
      )}
      <p className="max-w-[200px] text-center text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
        Baseado em complexidade ciclomática, duplicação e boas práticas.
      </p>
    </div>
  );
}
