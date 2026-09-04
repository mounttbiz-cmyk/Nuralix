"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavItem } from "@/config/schemas/nav";
import { DynamicIcon } from "./DynamicIcon";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";

interface TabletRailProps {
  navItems: NavItem[];
}

export function TabletRail({ navItems }: TabletRailProps) {
  const pathname = usePathname();
  const { resolvedTheme, cycleTheme } = useTheme();

  return (
    <aside className="hidden md:flex lg:hidden flex-col items-center w-16 h-screen sticky top-0 bg-surface border-r border-line select-none z-30 py-3">
      {/* Brand Icon with Ribbon Logo */}
      <Link
        href="/"
        className="w-10 h-10 rounded-lg bg-surface-2 border border-line flex items-center justify-center p-1 shadow-sm mb-6"
        title="Nuralix OS"
      >
        <Image
          src="/logo.png"
          alt="Nuralix Logo"
          width={28}
          height={28}
          className="object-contain"
        />
      </Link>

      {/* Icon Navigation list */}
      <nav className="flex-1 flex flex-col items-center gap-2 overflow-y-auto w-full px-2">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.id}
              href={item.href}
              title={item.label}
              className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors btn-tactile group ${
                isActive
                  ? "bg-surface-2 text-brass border border-line-strong"
                  : "text-text-muted hover:text-text hover:bg-surface-2/60"
              }`}
            >
              <DynamicIcon name={item.icon} className="w-5 h-5" />
              {item.badge && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brass" />
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
