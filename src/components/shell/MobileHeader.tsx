"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";

interface MobileHeaderProps {
  companyName?: string;
  onOpenChat?: () => void;
}

export function MobileHeader({
  companyName = "Apex Labs",
  onOpenChat,
}: MobileHeaderProps) {
  const { resolvedTheme, cycleTheme } = useTheme();

  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-surface/95 backdrop-blur-md border-b border-line pt-[env(safe-area-inset-top)]">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-surface-2 border border-line flex items-center justify-center p-1 shadow-sm">
          <Image
            src="/logo.png"
            alt="Nuralix Logo"
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xs tracking-tight text-text leading-tight font-sans">Nuralix</span>
          <span className="text-[10px] text-text-muted leading-tight truncate max-w-[120px]">
            {companyName}
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-1.5">
        {onOpenChat && (
          <button
            type="button"
            onClick={onOpenChat}
            className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-brass-soft text-brass border border-brass/30 btn-tactile"
            aria-label="Open AI Executive Chat"
          >
            <Sparkles className="w-3.5 h-3.5 text-brass" />
            <span>AI Executive</span>
          </button>
        )}

        <button
          type="button"
          onClick={cycleTheme}
          aria-label="Cycle theme"
          className="w-8 h-8 rounded-lg flex items-center justify-center border border-line bg-surface-2 text-text-muted hover:text-text btn-tactile"
        >
          {resolvedTheme === "dark" ? (
            <Moon className="w-3.5 h-3.5 text-brass" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-brass" />
          )}
        </button>
      </div>
    </header>
  );
}
