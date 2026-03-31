"use client";

import React from "react";

interface Issue {
  ruleId: string;
  message: string;
  line: number;
  column: number;
  severityLabel: "error" | "warning";
}

interface IssuesListProps {
  issues: Issue[];
}

export default function IssuesList({ issues }: IssuesListProps) {
  if (issues.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-zinc-300 dark:text-zinc-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="mt-4 text-sm font-medium text-zinc-900 dark:text-white">Nenhuma issue encontrada</p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">Seu código está seguindo as regras configuradas.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Issues ({issues.length})</h3>
      <div className="flex flex-col gap-2">
        {issues.map((issue, index) => (
          <div
            key={`${issue.ruleId}-${index}`}
            className="group flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium leading-snug text-zinc-900 dark:text-zinc-100">{issue.message}</p>
                <div className="flex items-center gap-2 overflow-hidden text-xs text-zinc-500 dark:text-zinc-500">
                  <span className="font-mono text-zinc-400 dark:text-zinc-600">{issue.ruleId}</span>
                  <span>•</span>
                  <span>
                    Linha {issue.line}:{issue.column}
                  </span>
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                  issue.severityLabel === "error"
                    ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
                    : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                }`}
              >
                {issue.severityLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
