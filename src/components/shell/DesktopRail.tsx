"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavItem } from "@/config/schemas/nav";
import { DynamicIcon } from "./DynamicIcon";
import { ThemeSwitch } from "./ThemeSwitch";
import { ShieldCheck, ChevronRight, LogOut, Sliders } from "lucide-react";

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
    window.location.href = "/login";
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-surface border-r border-line select-none z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-line">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-surface-2 border border-line flex items-center justify-center p-1 shadow-sm group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="Nuralix Logo"
              width={28}
              height={28}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-text font-sans">Nuralix</span>
            </div>
            <p className="text-[11px] text-text-muted truncate max-w-[150px]">
              {companyName} · {industry}
            </p>
          </div>
        </Link>
      </div>

      {/* Nav List grouped */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Customize Dashboard Option in side panel */}
        <Link
          href="/?customize=true"
          className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-brass bg-brass-soft/50 border border-brass/30 hover:bg-brass-soft transition-all btn-tactile w-full shadow-xs"
        >
          <Sliders className="w-3.5 h-3.5 text-brass shrink-0" />
          <span>Customize Dashboard</span>
        </Link>

        {groups.map(group => {
          const items = navItems.filter(item => item.group === group.key);
          if (items.length === 0) return null;

          return (
            <div key={group.key} className="space-y-1">
              <div className="px-2 text-[10px] uppercase font-bold tracking-wider text-text-muted">
                {group.label}
              </div>
              <nav className="space-y-0.5">
                {items.map(item => {
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all btn-tactile ${
                        isActive
                          ? "bg-surface-2 text-text border-l-2 border-brass pl-[8px] shadow-sm"
                          : "text-text-muted hover:text-text hover:bg-surface-2/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <DynamicIcon
                          name={item.icon}
                          className={`w-4 h-4 ${isActive ? "text-brass" : "text-text-muted"}`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface border border-line text-text-muted font-mono">
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
      <div className="p-3 border-t border-line space-y-3 bg-surface">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted mb-1 px-1">
            Appearance
          </div>
          <ThemeSwitch />
        </div>

        {/* User profile & logout */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-surface-2 border border-line text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-brass/20 text-brass font-bold text-xs flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div className="truncate">
              <div className="font-semibold text-text truncate">{companyName}</div>
              <div className="text-[10px] text-text-muted flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-jade" />
                <span>Verified Account</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            className="p-1 rounded text-text-muted hover:text-rust hover:bg-surface transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
