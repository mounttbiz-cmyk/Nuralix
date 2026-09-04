"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (mode: ThemeMode) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");
  const [mounted, setMounted] = useState(false);

  // Apply resolved theme to DOM
  const applyTheme = (mode: ThemeMode) => {
    let resolved: ResolvedTheme = "dark";
    if (mode === "system") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      resolved = mode;
    }

    setResolvedTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolved);

    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) {
      meta.setAttribute("content", resolved);
    }
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem("nuralix-theme", mode);
    applyTheme(mode);
  };

  const cycleTheme = () => {
    const cycleOrder: ThemeMode[] = ["light", "dark", "system"];
    const nextIndex = (cycleOrder.indexOf(theme) + 1) % cycleOrder.length;
    setTheme(cycleOrder[nextIndex]);
  };

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("nuralix-theme") as ThemeMode | null;
    const initialMode = stored && ["light", "dark", "system"].includes(stored) ? stored : "system";
    setThemeState(initialMode);
    applyTheme(initialMode);

    // Live system listener
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      const currentStored = localStorage.getItem("nuralix-theme") || "system";
      if (currentStored === "system") {
        applyTheme("system");
      }
    };
    mediaQuery.addEventListener("change", handleSystemChange);

    // Keyboard shortcut: ⌘/Ctrl + Shift + L to cycle themes
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "L" || e.key === "l")) {
        e.preventDefault();
        cycleTheme();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
