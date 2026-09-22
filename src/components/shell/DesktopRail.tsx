"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavItem } from "@/config/schemas/nav";
import { DynamicIcon } from "./DynamicIcon";
import { ThemeSwitch } from "./ThemeSwitch";
import { ShieldCheck, ChevronRight, LogOut, Sliders, Search, Sparkles } from "lucide-react";
import { QuickBusinessInputModal } from "../intake/QuickBusinessInputModal";
import { WEBSITE_URL } from "@/config/urls";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { StatusBadge } from "../ui/Badge";
import { Button } from "../ui/Button";

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
    localStorage.removeItem("bizzpal_user_session");
    window.location.href = WEBSITE_URL;
  };

  const [isQuickInputOpen, setIsQuickInputOpen] = React.useState(false);

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed inset-y-0 left-0 bg-surface/95 backdrop-blur-2xl border-r border-line select-none z-30 transition-colors">
      {/* Quick Business Input Modal */}
      <QuickBusinessInputModal
        isOpen={isQuickInputOpen}
        onClose={() => setIsQuickInputOpen(false)}
      />

      {/* Brand Header */}
      <div className="p-4 border-b border-line">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/20 via-gold/10 to-transparent border border-gold/40 flex items-center justify-center p-1.5 shadow-lg shadow-[0_8px_20px_-6px_var(--gold-glow)] group-hover:scale-105 group-hover:border-gold/70 transition-all shrink-0">
            <Image
              src="/logo-icon.png"
              alt="BizzPal Logo"
              width={28}
              height={28}
              className="object-contain drop-shadow"
              priority
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-text font-sans whitespace-nowrap">
                Bizz<span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">Pal</span><span className="text-[10px] text-gold/80 align-super">™</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 font-bold font-mono shrink-0">
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
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-text-muted hover:text-text hover:border-white/[0.14] transition-all text-xs group cursor-pointer"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Search className="w-3.5 h-3.5 text-text-muted group-hover:text-amber-400 transition-colors shrink-0" />
            <span className="text-[11px] font-medium truncate">Search tools, pages…</span>
          </div>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-text-muted font-mono font-semibold shrink-0">
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
              <div className="px-3 text-[10px] uppercase font-bold tracking-widest text-text-muted/70 font-mono">
                {group.label}
              </div>
              <nav className="space-y-0.5">
                {items.map(item => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`relative flex items-center justify-between pl-3.5 pr-3 py-2 rounded-xl text-xs font-medium transition-all btn-tactile ${
                        isActive
                          ? "bg-amber-400/10 text-amber-300 font-semibold"
                          : "text-text-muted hover:text-text hover:bg-white/[0.03]"
                      }`}
                    >
                      {isActive && (
                        <span
                          className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-amber-400"
                          aria-hidden="true"
                        />
                      )}
                      <div className="flex items-center gap-2.5">
                        <DynamicIcon
                          name={item.icon}
                          className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-text-muted group-hover:text-text"}`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 font-mono font-semibold">
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
      <div className="p-3 border-t border-line space-y-3 bg-surface/90 transition-colors">
        <Button
          type="button"
          variant="primary"
          size="md"
          fullWidth
          onClick={() => setIsQuickInputOpen(true)}
          icon={<Sparkles className="w-3.5 h-3.5" />}
        >
          Quick Business Input
        </Button>

        <div>
          <div className="text-[10px] uppercase font-bold tracking-widest text-text-muted mb-1.5 px-1">
            Appearance
          </div>
          <ThemeSwitch />
        </div>

        {/* User profile & logout */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-[#1a1206] font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
                {initials}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#080C16]" />
            </div>
            <div className="truncate">
              <div className="font-semibold text-text truncate">{companyName}</div>
              <div className="text-[10px] text-text-muted flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified Enterprise</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-text-muted hover:text-rose-400 hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
