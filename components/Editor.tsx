"use client";

import React, { useEffect, useRef } from "react";
import MonacoEditor, { OnMount } from "@monaco-editor/react";

interface EditorProps {
  code: string;
  setCode: (code: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  issues?: {
    line: number;
    column: number;
    message: string;
    severityLabel: "error" | "warning";
  }[];
}

export default function Editor({ code, setCode, onAnalyze, isLoading, issues = [] }: EditorProps) {
  const monacoRef = useRef<any>(null);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      padding: { top: 16, bottom: 16 },
      lineNumbersMinChars: 3,
      glyphMargin: true,
    });
  };

  useEffect(() => {
    if (!monacoRef.current || !editorRef.current) return;

    const monaco = monacoRef.current;
    const model = editorRef.current.getModel();

    if (model) {
      const markers = issues.map((issue) => ({
        startLineNumber: issue.line,
        startColumn: issue.column || 1,
        endLineNumber: issue.line,
        endColumn: issue.column + 10 || 20, // Rough estimate, or we could find the word
        message: issue.message,
        severity: issue.severityLabel === "error" ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning,
      }));

      monaco.editor.setModelMarkers(model, "owner", markers);
    }
  }, [issues]);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Analisador Técnico</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Insira o código JavaScript para análise de saúde instantânea.</p>
        </div>
        <button
          onClick={onAnalyze}
          disabled={isLoading}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analisando...</span>
            </div>
          ) : (
            "Analisar"
          )}
        </button>
      </div>

      <div className="relative h-[450px] overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <MonacoEditor
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorDidMount}
          options={{
            renderValidationDecorations: "on",
          }}
        />
        <div className="absolute bottom-2 right-6 z-10 rounded-md bg-zinc-200/50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm dark:bg-zinc-800/50">
          ES6+ JavaScript
        </div>
      </div>
    </div>
  );
}
