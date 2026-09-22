"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavItem } from "@/config/schemas/nav";
import { DynamicIcon } from "./DynamicIcon";
import { Sun, Moon, Globe, Search } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { WEBSITE_URL } from "@/config/urls";

interface TabletRailProps {
  navItems: NavItem[];
  onOpenSearch?: () => void;
}

export function TabletRail({ navItems, onOpenSearch }: TabletRailProps) {
  const pathname = usePathname();
  const { resolvedTheme, cycleTheme } = useTheme();

  return (
    <aside className="hidden md:flex lg:hidden flex-col items-center w-16 h-screen fixed inset-y-0 left-0 bg-surface/95 dark:bg-[#080C16]/95 backdrop-blur-2xl border-r border-line select-none z-30 py-3 transition-colors">
      {/* Brand Icon with Ribbon Logo */}
      <Link
        href="/dashboard"
        className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 via-yellow-500/10 to-transparent border border-amber-400/40 flex items-center justify-center p-1.5 shadow-lg shadow-amber-500/15 mb-3 hover:scale-105 transition-transform"
        title="BizzPal Dashboard"
      >
        <Image
          src="/logo.png"
          alt="BizzPal Logo"
          width={28}
          height={28}
          className="object-contain drop-shadow"
        />
      </Link>

      {/* Quick Search Button */}
      <button
        type="button"
        onClick={onOpenSearch}
        title="Search tools, pages… (⌘K)"
        className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-amber-400 hover:bg-surface-2 transition-all btn-tactile mb-3"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Icon Navigation list */}
      <nav className="flex-1 flex flex-col items-center gap-2 overflow-y-auto w-full px-2">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.id}
              href={item.href}
              title={item.label}
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all btn-tactile group ${
                isActive
                  ? "bg-gradient-to-br from-amber-500/25 via-yellow-500/15 to-transparent text-amber-500 dark:text-amber-400 border border-amber-400/40 shadow-sm shadow-amber-500/15"
                  : "text-text-muted hover:text-text hover:bg-white/[0.05]"
              }`}
            >
              <DynamicIcon name={item.icon} className={`w-5 h-5 ${isActive ? "text-amber-500 dark:text-amber-400" : "text-text-muted"}`} />
              {item.badge && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-surface" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom theme cycler button */}
      <div className="pt-2 border-t border-line w-full flex justify-center">
        <button
          type="button"
          onClick={cycleTheme}
          title="Cycle Theme (⌘⇧L)"
          className="w-10 h-10 rounded-lg flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-colors btn-tactile"
        >
          {resolvedTheme === "dark" ? (
            <Moon className="w-4 h-4 text-brass" />
          ) : (
            <Sun className="w-4 h-4 text-brass" />
          )}
        </button>
      </div>
    </aside>
  );
}
