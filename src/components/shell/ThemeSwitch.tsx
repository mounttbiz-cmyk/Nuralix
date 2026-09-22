"use client";

import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, ThemeMode } from "@/lib/theme/ThemeProvider";

interface ThemeSwitchProps {
  compact?: boolean;
}

export function ThemeSwitch({ compact = false }: ThemeSwitchProps) {
  const { theme, setTheme } = useTheme();

  const options: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: "light", label: "Light", icon: <Sun className="w-3.5 h-3.5" /> },
    { mode: "dark", label: "Dark", icon: <Moon className="w-3.5 h-3.5" /> },
    { mode: "system", label: "System", icon: <Monitor className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl border border-slate-200/90 dark:border-white/[0.06] bg-slate-200/60 dark:bg-white/[0.03] backdrop-blur-md ${
        compact ? "scale-90" : "w-full"
      }`}
      role="radiogroup"
      aria-label="Color theme selection"
    >
      {options.map(opt => {
        const isActive = theme === opt.mode;
        return (
          <button
            key={opt.mode}
            type="button"
            onClick={() => setTheme(opt.mode)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 text-xs rounded-lg transition-all cursor-pointer ${
              isActive
                ? "bg-white dark:bg-amber-400/15 text-slate-950 dark:text-amber-300 font-bold shadow-xs border border-slate-300/80 dark:border-amber-400/30"
                : "text-slate-600 dark:text-text-muted hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.03]"
            }`}
            title={`Switch to ${opt.label} mode (⌘⇧L to cycle)`}
          >
            {opt.icon}
            {!compact && <span>{opt.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
