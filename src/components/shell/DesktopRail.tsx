"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavItem } from "@/config/schemas/nav";
import { DynamicIcon } from "./DynamicIcon";
import { ThemeSwitch } from "./ThemeSwitch";
import { ShieldCheck, ChevronRight, LogOut, Sliders, Search } from "lucide-react";
import { WEBSITE_URL } from "@/config/urls";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";

interface DesktopRailProps {
  navItems: NavItem[];
  companyName?: string;
  industry?: string;
  onOpenSearch?: () => void;
}

export function DesktopRail({
  navItems,
  companyName = "Apex Labs",
  industry = "B2B SaaS",
  onOpenSearch,
}: DesktopRailProps) {
  const pathname = usePathname();

  const groups: { key: NavItem["group"]; label: string }[] = [
    { key: "core", label: "Core" },
    { key: "intelligence", label: "Executive Intelligence" },
    { key: "management", label: "Operations & Execution" },
    { key: "system", label: "Platform" },
  ];

  const initials = companyName
    ? companyName
        .split(" ")
        .filter(Boolean)
        .map(w => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "NB"
    : "NB";

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (e) {
      // ignore
    }
    localStorage.removeItem("nuralix_user_session");
    window.location.href = WEBSITE_URL;
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed inset-y-0 left-0 bg-surface/95 dark:bg-[#080C16]/95 backdrop-blur-2xl border-r border-line select-none z-30 transition-colors">
      {/* Brand Header */}
      <div className="p-4 border-b border-line">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 via-violet-500/20 to-transparent border border-cyan-500/30 flex items-center justify-center p-1.5 shadow-lg shadow-cyan-500/10 group-hover:scale-105 group-hover:border-cyan-500/50 transition-all">
            <Image
              src="/logo.png"
              alt="Nuralix Logo"
              width={26}
              height={26}
              className="object-contain drop-shadow"
              priority
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white font-sans">
                Nuralix
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-semibold font-mono">
                AI OS
              </span>
            </div>
            <p className="text-[11px] text-text-muted truncate max-w-[150px] font-medium mt-0.5">
              {companyName}
            </p>
          </div>
        </Link>
      </div>

      {/* Quick Command Prompt / Search bar */}
      <div className="px-3 pt-3">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-surface-2 border border-line text-text-muted hover:text-text hover:border-cyan-500/30 transition-all text-xs group cursor-pointer"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Search className="w-3.5 h-3.5 text-text-muted group-hover:text-cyan-400 transition-colors shrink-0" />
            <span className="text-[11px] font-medium truncate">Search tools, pages…</span>
          </div>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-line text-text-muted font-mono font-semibold group-hover:border-cyan-500/30 shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Nav List grouped */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {groups.map(group => {
          const items = navItems.filter(item => item.group === group.key);
          if (items.length === 0) return null;

          return (
            <div key={group.key} className="space-y-1">
              <div className="px-3 text-[10px] uppercase font-bold tracking-widest text-text-muted">
                {group.label}
              </div>
              <nav className="space-y-0.5">
                {items.map(item => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all btn-tactile ${
                        isActive
                          ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-l-2 border-cyan-500 pl-[10px] shadow-sm font-semibold"
                          : "text-text-muted hover:text-text hover:bg-surface-2"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <DynamicIcon
                          name={item.icon}
                          className={`w-4 h-4 ${isActive ? "text-cyan-500 dark:text-cyan-400" : "text-text-muted group-hover:text-text"}`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 font-mono font-medium">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* Footer Controls & User Menu */}
      <div className="p-3 border-t border-line space-y-3 bg-surface/90 dark:bg-[#080C16]/90 transition-colors">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-widest text-text-muted mb-1.5 px-1">
            Appearance
          </div>
          <ThemeSwitch />
        </div>

        {/* User profile & logout */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-surface-2 border border-line text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-line shadow-sm shrink-0">
                {initials}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-jade ring-2 ring-surface" />
            </div>
            <div className="truncate">
              <div className="font-semibold text-text truncate">{companyName}</div>
              <div className="text-[10px] text-text-muted flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-jade" />
                <span>Verified Enterprise</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-text-muted hover:text-rust hover:bg-surface transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
