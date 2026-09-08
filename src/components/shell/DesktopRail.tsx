"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavItem } from "@/config/schemas/nav";
import { DynamicIcon } from "./DynamicIcon";
import { ThemeSwitch } from "./ThemeSwitch";
import { ShieldCheck, ChevronRight, LogOut, Sliders } from "lucide-react";
import { WEBSITE_URL } from "@/config/urls";

interface DesktopRailProps {
  navItems: NavItem[];
  companyName?: string;
  industry?: string;
}

export function DesktopRail({
  navItems,
  companyName = "Apex Labs",
  industry = "B2B SaaS",
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

  const handleLogout = () => {
    localStorage.removeItem("nuralix_user_session");
    window.location.href = WEBSITE_URL;
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#080C16]/95 backdrop-blur-2xl border-r border-white/[0.07] select-none z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/[0.07]">
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
              <span className="font-extrabold text-sm tracking-tight text-white font-sans bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text">
                Nuralix
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold font-mono">
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
        <Link
          href="/chat"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-2/60 border border-white/[0.06] text-text-muted hover:text-text hover:border-cyan-500/30 hover:bg-surface-2 transition-all text-xs group"
        >
          <span className="text-[11px] font-medium group-hover:text-slate-200">Ask Copilot / Search</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-white/10 text-text-muted font-mono font-semibold group-hover:border-cyan-500/30">
            ⌘K
          </kbd>
        </Link>
      </div>

      {/* Nav List grouped */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Customize Dashboard Option in side panel */}
        <Link
          href="/dashboard?customize=true"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all btn-tactile w-full shadow-sm"
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Customize Dashboard</span>
        </Link>

        {groups.map(group => {
          const items = navItems.filter(item => item.group === group.key);
          if (items.length === 0) return null;

          return (
            <div key={group.key} className="space-y-1">
              <div className="px-3 text-[10px] uppercase font-bold tracking-widest text-text-muted/70">
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
                          ? "bg-gradient-to-r from-cyan-500/20 via-violet-500/10 to-transparent text-white border-l-2 border-cyan-400 pl-[10px] shadow-sm font-semibold"
                          : "text-text-muted hover:text-text hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <DynamicIcon
                          name={item.icon}
                          className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-text-muted group-hover:text-slate-300"}`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono font-medium">
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
      <div className="p-3 border-t border-white/[0.07] space-y-3 bg-[#080C16]/90">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-widest text-text-muted/70 mb-1 px-1">
            Appearance
          </div>
          <ThemeSwitch />
        </div>

        {/* User profile & logout */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-surface-2/60 border border-white/[0.07] text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white/10 shadow-sm shrink-0">
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
