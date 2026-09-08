"use client";

import React from "react";
import Link from "next/link";
import { ThemeSwitch } from "@/components/shell/ThemeSwitch";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { Sun, Moon, Monitor, Eye, Palette, Check, Globe, ArrowUpRight, Layers } from "lucide-react";

export default function AppearancePage() {
  const { theme, resolvedTheme } = useTheme();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="space-y-3 pb-4 border-b border-line">
        <h1 className="text-lg font-bold text-text">Platform Settings</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/settings/appearance"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brass text-white shadow-xs flex items-center gap-1.5"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Appearance & Theme</span>
          </Link>
          <Link
            href="/settings/tools"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-text-muted hover:text-text bg-surface border border-line flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Connected Business Tools</span>
          </Link>
        </div>
      </div>

      {/* Theme selection card */}
      <div className="p-5 rounded-xl border border-line bg-surface shadow-theme space-y-5">
        <div>
          <h2 className="text-xs font-bold text-text uppercase tracking-wider">
            Color Palette & Mode
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Switch between light boardroom cool paper and dark deep ink navy.
          </p>
        </div>

        <div className="max-w-xs">
          <ThemeSwitch />
        </div>

        <div className="p-3.5 rounded-lg bg-surface-2 border border-line text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-text">
            <span>Active State:</span>
            <span className="capitalize text-brass">{theme} mode</span>
            <span className="text-text-muted font-normal">
              (Resolved to {resolvedTheme})
            </span>
          </div>
          <p className="text-[11px] text-text-muted">
            Keyboard shortcut: <code className="font-mono bg-surface px-1 py-0.5 rounded border border-line">⌘ + Shift + L</code> cycles between Light, Dark, and System anywhere in the application.
          </p>
        </div>
      </div>

      {/* Design Tokens Inspection (§3.1) */}
      <div className="p-5 rounded-xl border border-line bg-surface shadow-theme space-y-4">
        <div>
          <h2 className="text-xs font-bold text-text uppercase tracking-wider">
            Active Design Tokens (§3.1 Token Contract)
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            All colors read directly from CSS variables. No hex hardcoding.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-line bg-bg space-y-1">
            <span className="text-[10px] text-text-muted font-mono block">--bg</span>
            <div className="w-6 h-6 rounded bg-bg border border-line" />
            <span className="font-semibold text-text">Background</span>
          </div>

          <div className="p-3 rounded-lg border border-line bg-surface space-y-1">
            <span className="text-[10px] text-text-muted font-mono block">--surface</span>
            <div className="w-6 h-6 rounded bg-surface border border-line" />
            <span className="font-semibold text-text">Surface Card</span>
          </div>

          <div className="p-3 rounded-lg border border-line bg-surface-2 space-y-1">
            <span className="text-[10px] text-text-muted font-mono block">--brass</span>
            <div className="w-6 h-6 rounded bg-brass" />
            <span className="font-semibold text-brass">Boardroom Accent</span>
          </div>

          <div className="p-3 rounded-lg border border-line bg-surface space-y-1">
            <span className="text-[10px] text-text-muted font-mono block">--jade</span>
            <div className="w-6 h-6 rounded bg-jade" />
            <span className="font-semibold text-jade">Positive Delta</span>
          </div>
        </div>
      </div>

      {/* Nuralix Website Link */}
      <div className="p-5 rounded-xl border border-line bg-surface shadow-theme space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>Nuralix Website</span>
            </h2>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Launch the public 3D interactive intelligence experience, product vision, and platform showcases.
            </p>
          </div>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-surface-2 hover:bg-surface border border-line hover:border-line-strong text-xs font-semibold text-text btn-tactile transition-all shrink-0 shadow-xs"
          >
            <span>Open Website</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-text-muted" />
          </a>
        </div>
      </div>
    </div>
  );
}
