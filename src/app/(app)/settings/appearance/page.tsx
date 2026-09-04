"use client";

import React from "react";
import { ThemeSwitch } from "@/components/shell/ThemeSwitch";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { Sun, Moon, Monitor, Eye, Palette, Check } from "lucide-react";

export default function AppearancePage() {
  const { theme, resolvedTheme } = useTheme();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-lg font-bold text-text">Appearance & Display Settings</h1>
        <p className="text-xs text-text-muted mt-0.5">
          Configure interface theme, density, tabular typography, and system synchronization.
        </p>
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
    </div>
  );
}
