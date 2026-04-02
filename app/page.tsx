"use client";

import { useMemo, useState } from "react";
import Header from "../components/Header";
import Editor from "../components/Editor";
import ScoreCard from "../components/ScoreCard";
import MetricCard from "../components/MetricCard";
import IssuesList from "../components/IssuesList";
import FunctionsList from "../components/FunctionsList";
import type { ProjectType } from "../lib/analyzer/types";

// Types
type Issue = {
  ruleId: string;
  message: string;
  line: number;
  column: number;
  severityLabel: "error" | "warning";
  category: string;
};

type FunctionMetric = {
  name: string;
  line: number;
  lines: number;
  complexity: number;
  params: number;
  nesting: number;
};

type Recommendation = {
  message: string;
  severity: "low" | "medium" | "high";
  location?: string;
  suggestion: string;
};

type AnalysisResult = {
  lint: {
    issues: Issue[];
    totalIssues: number;
  };
  complexity: {
    functions: FunctionMetric[];
  };
  ast: {
    functions: FunctionMetric[];
  };
  score: {
    overall: number;
    maintainability: number;
    readability: number;
    complexity: number;
    duplication: number;
  };
  recommendations: Recommendation[];
};

const DEFAULT_CODE = `// Escreva ou cole seu código aqui.`;

export default function HomePage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [projectType, setProjectType] = useState<ProjectType>("javascript");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, type: projectType }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload?.error || "Falha na análise");
      }

      const payload = (await response.json()) as AnalysisResult;
      setResult(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  const recommendations = useMemo(() => result?.recommendations || [], [result]);

  return (
    <div className="min-h-screen bg-slate-50 transition-colors dark:bg-black">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Editor and Recommendations */}
          <div className={`flex flex-col gap-8 transition-all duration-500 ease-in-out ${isFocused ? "lg:col-span-12" : "lg:col-span-8"}`}>
            <Editor
              code={code}
              setCode={setCode}
              onAnalyze={handleAnalyze}
              isLoading={loading}
              projectType={projectType}
              setProjectType={setProjectType}
              issues={result?.lint?.issues}
              isFocused={isFocused}
              onToggleFocus={() => setIsFocused(!isFocused)}
            />

            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-400">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {result && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Principais Recomendações</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="group flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${rec.severity === "high"
                            ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
                            : rec.severity === "medium"
                              ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                            }`}
                        >
                          {rec.severity}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{rec.message}</p>
                      <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{rec.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Score and Metrics */}
          <div className={`flex flex-col gap-8 transition-all duration-500 ease-in-out ${isFocused ? "lg:col-span-12" : "lg:col-span-4"}`}>
            <ScoreCard score={result ? result.score.overall : null} />

            {result && (
              <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard label="Manutenibilidade" value={result.score.maintainability} />
                  <MetricCard label="Complexidade" value={result.score.complexity} />
                  <MetricCard label="Legibilidade" value={result.score.readability} />
                  <MetricCard label="Duplicação" value={result.score.duplication} />
                </div>

                <IssuesList issues={result.lint.issues} />

                <FunctionsList functions={result.ast.functions} />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-zinc-200 py-12 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 text-center text-xs text-zinc-400 dark:text-zinc-600">
          <p>© 2026 Code Health Tool. Inspirado por SonarQube, Linear e Vercel.</p>
          <p className="mt-2">
            Desenvolvido por{" "}
            <a
              href="https://github.com/ygorevaldt"
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium text-zinc-500 transition hover:text-cyan-500 dark:text-zinc-400 dark:hover:text-cyan-400"
            >
              Ygor Evaldt
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
