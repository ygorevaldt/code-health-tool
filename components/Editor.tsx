"use client";

import React, { useEffect, useRef } from "react";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import type { ProjectType } from "../lib/analyzer/types";

interface EditorProps {
  code: string;
  setCode: (code: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  isFocused?: boolean;
  onToggleFocus?: () => void;
  projectType: ProjectType;
  setProjectType: (type: ProjectType) => void;
  issues?: {
    line: number;
    column: number;
    message: string;
    severityLabel: "error" | "warning";
  }[];
}

const FRAMEWORKS: { id: ProjectType; label: string; icon: React.ReactNode }[] = [
  {
    id: "javascript",
    label: "JavaScript",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3H21V21H3V3Z" fill="#F7DF1E" />
        <path d="M21 16.5H18.5V19.5H16V21H21V16.5ZM16.5 13.5V15.5H18.5V13.5H16.5Z" fill="black" />
        <path d="M7.5 15H9.5V16.5H7.5V15ZM9.5 18H11V21H7.5V19.5H9.5V18Z" fill="black" />
      </svg>
    ),
  },
  {
    id: "react",
    label: "React",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="2.5" fill="#61DAFB" />
        <path d="M12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7Z" stroke="#61DAFB" strokeWidth="1.2" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" stroke="#61DAFB" strokeWidth="1.2" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" stroke="#61DAFB" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: "vue",
    label: "Vue",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 3L12 21L22.5 3H17.5L12 12.5L6.5 3H1.5Z" fill="#41B883" />
        <path d="M6.5 3L12 12.5L17.5 3H13.5L12 5.5L10.5 3H6.5Z" fill="#34495E" />
      </svg>
    ),
  },
  {
    id: "angular",
    label: "Angular",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 5.5L3.5 17.5L12 22L20.5 17.5L22 5.5L12 2Z" fill="#DD0031" />
        <path d="M12 4.5L18.5 16.5H16.5L15 13H9L7.5 16.5H5.5L12 4.5ZM12 7.5L10 11.5H14L12 7.5Z" fill="white" />
      </svg>
    ),
  },
  {
    id: "angularjs",
    label: "AngularJS",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 5.5L3.5 17.5L12 22L20.5 17.5L22 5.5L12 2Z" fill="#B52E31" />
        <path d="M12 4.5L18.5 16.5H16.5L15 13H9L7.5 16.5H5.5L12 4.5ZM12 7.5L10 11.5H14L12 7.5Z" fill="white" />
      </svg>
    ),
  },
  {
    id: "typescript",
    label: "TypeScript",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3H21V21H3V3Z" fill="#3178C6" />
        <path d="M14.5 14.5H17V17H14.5V14.5ZM17 11.5H19.5V14H17V11.5ZM19.5 8.5V11H21V19.5H19.5V17H17V19.5H14.5V17.5H13V15.5H14.5V17H17V14.5H14.5V13H16V11.5H17V14H19.5V11.5ZM10.5 14H12V15.5H10.5V14ZM12 17H13.5V19.5H10V18H11V15.5H12V17ZM6 14H8V15.5H6V14ZM8 17H9.5V19.5H6V18H7V15.5H8V17Z" fill="white" />
      </svg>
    ),
  },
  {
    id: "node",
    label: "Node.js",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L4 6.5V15.5L12 20L20 15.5V6.5L12 2Z" fill="#339933" opacity="0.8" />
        <path d="M12 5L7 7.8V13.2L12 16L17 13.2V7.8L12 5Z" fill="white" />
      </svg>
    ),
  },
];

export default function Editor({
  code,
  setCode,
  onAnalyze,
  isLoading,
  isFocused = false,
  onToggleFocus,
  projectType,
  setProjectType,
  issues = []
}: EditorProps) {
  const monacoRef = useRef<any>(null);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.updateOptions({
      fontSize: 14,
      fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      padding: { top: 20, bottom: 20 },
      lineNumbersMinChars: 3,
      glyphMargin: true,
      folding: true,
      lineDecorationsWidth: 10,
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
        endColumn: issue.column + 10 || 20,
        message: issue.message,
        severity: issue.severityLabel === "error" ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning,
      }));

      monaco.editor.setModelMarkers(model, "owner", markers);
    }
  }, [issues]);

  // Update language based on project type
  const editorLanguage = projectType === "typescript" || projectType === "angular" || projectType === "react" ? "typescript" : "javascript";

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50 backdrop-blur-sm">
      {/* Upper Header: Title and Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 pt-5 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 16 4-4-4-4" />
              <path d="m6 8-4 4 4 4" />
              <path d="m14.5 4-5 16" />
            </svg>
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white truncate">Analisador de Código</h2>
            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-500">Health Check Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFocus}
            title={isFocused ? "Sair do Modo Foco" : "Modo Foco"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition-all hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white active:scale-95"
          >
            {isFocused ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14h6v6M20 10h-6V4"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6"/></svg>
            )}
          </button>
          
          <button
            onClick={onAnalyze}
            disabled={isLoading}
            className={`group relative overflow-hidden inline-flex flex-1 sm:flex-none h-10 items-center justify-center rounded-xl px-6 text-xs font-bold uppercase tracking-widest transition-all active:scale-95 shadow-md ${
              isLoading 
                ? "bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-900 dark:text-zinc-600" 
                : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Analisando</span>
              </div>
            ) : (
              <span className="flex items-center gap-2">
                Analisar
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                  <path d="M5 12h14m-7-7 7 7-7 7"/>
                </svg>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sub Header: Framework Selection (Segmented Control style) */}
      <div className="px-5">
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-2xl overflow-x-auto no-scrollbar border border-zinc-200/50 dark:border-zinc-800/50">
          {FRAMEWORKS.map((fw) => (
            <button
              key={fw.id}
              onClick={() => setProjectType(fw.id)}
              className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-2 rounded-xl text-[11px] font-bold transition-all duration-300 ${
                projectType === fw.id
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300"
              }`}
            >
              <span className={`transition-all duration-300 ${projectType === fw.id ? "grayscale-0 scale-110" : "grayscale opacity-60"}`}>
                {fw.icon}
              </span>
              <span className={projectType === fw.id ? "inline" : "hidden sm:inline"}>{fw.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Main Section */}
      <div className={`relative px-4 pb-4 overflow-hidden transition-all duration-700 ease-in-out ${isFocused ? "h-[750px]" : "h-[500px]"}`}>
        <div className="h-full rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-inner bg-[#1e1e1e]">
          <MonacoEditor
            height="100%"
            language={editorLanguage}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            onMount={handleEditorDidMount}
            options={{
              renderValidationDecorations: "on",
              wordWrap: "on",
              smoothScrolling: true,
              cursorBlinking: "expand",
              cursorSmoothCaretAnimation: "on",
            }}
          />
        </div>
        
        {/* Subtle Indicator Overlay */}
        <div className="absolute top-8 right-10 pointer-events-none">
          <div className="flex items-center gap-3 rounded-full bg-zinc-900/80 px-3 py-1 text-[10px] font-black text-zinc-500 backdrop-blur-md dark:bg-zinc-100/10 border border-white/5 uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
            {FRAMEWORKS.find(f => f.id === projectType)?.label} Mode
          </div>
        </div>
      </div>
    </div>
  );
}
