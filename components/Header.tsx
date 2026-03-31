"use client";

import React from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/70 backdrop-blur-md dark:border-zinc-800 dark:bg-black/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-sky-600 border border-cyan-400/20 shadow-lg shadow-cyan-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Code <span className="bg-gradient-to-r from-cyan-500 to-sky-600 bg-clip-text text-transparent">Health</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="https://github.com/ygorevaldt/code-health-tool"
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              Documentation
            </a>
            <a
              href="https://github.com/ygorevaldt"
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              GitHub
            </a>
          </nav>
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
