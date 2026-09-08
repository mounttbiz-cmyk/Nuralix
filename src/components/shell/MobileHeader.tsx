"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sun, Moon, Sparkles, Globe, Search } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { WEBSITE_URL } from "@/config/urls";

interface MobileHeaderProps {
  companyName?: string;
  onOpenChat?: () => void;
  onOpenSearch?: () => void;
}

export function MobileHeader({
  companyName = "Apex Labs",
  onOpenChat,
  onOpenSearch,
}: MobileHeaderProps) {
  const { resolvedTheme, cycleTheme } = useTheme();

  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-[#080C16]/95 backdrop-blur-xl border-b border-white/[0.08] pt-[env(safe-area-inset-top)]">
      <Link href="/dashboard" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 via-violet-500/20 to-transparent border border-cyan-500/30 flex items-center justify-center p-1 shadow-sm">
          <Image
            src="/logo.png"
            alt="Nuralix Logo"
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-xs tracking-tight text-white leading-tight font-sans">Nuralix</span>
          <span className="text-[10px] text-text-muted leading-tight truncate max-w-[120px]">
            {companyName}
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        {onOpenSearch && (
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/[0.08] bg-surface-2/80 text-text-muted hover:text-cyan-400 btn-tactile"
            aria-label="Open search"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        )}

        {onOpenChat && (
          <button
            type="button"
            onClick={onOpenChat}
            className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 btn-tactile"
            aria-label="Open AI Workspace"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Copilot</span>
          </button>
        )}

        <button
          type="button"
          onClick={cycleTheme}
          aria-label="Cycle theme"
          className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/[0.08] bg-surface-2/80 text-text-muted hover:text-text btn-tactile"
        >
          {resolvedTheme === "dark" ? (
            <Moon className="w-3.5 h-3.5 text-cyan-400" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-cyan-400" />
          )}
        </button>
      </div>
    </header>
  );
}
