"use client";

import React from "react";

interface FunctionMetric {
  name: string;
  line: number;
  lines: number;
  complexity: number;
  params: number;
  nesting: number;
}

interface FunctionsListProps {
  functions: FunctionMetric[];
}

export default function FunctionsList({ functions }: FunctionsListProps) {
  const getComplexityColor = (value: number) => {
    if (value > 15) return "text-rose-500 font-bold";
    if (value > 10) return "text-amber-500 font-medium";
    return "text-zinc-600 dark:text-zinc-400";
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Funções Analisadas</h3>
        <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:bg-zinc-900 dark:text-zinc-500">
          {functions.length} Total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-100 uppercase tracking-wider dark:border-zinc-900">
              <th className="pb-3 pr-4 font-semibold text-zinc-400 dark:text-zinc-600">Nome</th>
              <th className="pb-3 pr-4 text-right font-semibold text-zinc-400 dark:text-zinc-600">Linhas</th>
              <th className="pb-3 pr-4 text-right font-semibold text-zinc-400 dark:text-zinc-600">Complex.</th>
              <th className="pb-3 pr-4 text-right font-semibold text-zinc-400 dark:text-zinc-600">Params</th>
              <th className="pb-3 text-right font-semibold text-zinc-400 dark:text-zinc-600">Nesting</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
            {functions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500 dark:text-zinc-500">
                  Nenhuma função detectada.
                </td>
              </tr>
            ) : (
              functions.map((fn) => (
                <tr key={`${fn.name}-${fn.line}`} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <td className="py-3 pr-4">
                    <div className="flex flex-col">
                      <span className="font-mono font-medium text-zinc-900 dark:text-zinc-200">{fn.name}</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-600">linha {fn.line}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-right text-zinc-600 dark:text-zinc-400">{fn.lines}</td>
                  <td className={`py-3 pr-4 text-right ${getComplexityColor(fn.complexity)}`}>{fn.complexity}</td>
                  <td className="py-3 pr-4 text-right text-zinc-600 dark:text-zinc-400">{fn.params}</td>
                  <td className="py-3 text-right text-zinc-600 dark:text-zinc-400">{fn.nesting}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
