"use client";

import React, { useState } from "react";
import { DesktopRail } from "./DesktopRail";
import { TabletRail } from "./TabletRail";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomBar } from "./MobileBottomBar";
import { ChatDock, ContextChip } from "./ChatDock";
import { CommandPalette } from "@/components/search/CommandPalette";
import { NavItem } from "@/config/schemas/nav";
import { MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";

interface AppShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  companyName?: string;
  industry?: string;
}

export function AppShell({
  children,
  navItems,
  companyName: initialCompanyName = "Apex Analytics",
  industry: initialIndustry = "B2B SaaS",
}: AppShellProps) {
  const pathname = usePathname();
  const [chatOpen, setChatOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [industry, setIndustry] = useState(initialIndustry);

  // Close search or chat overlay when Escape key is pressed
  useEscapeKey(() => {
    if (searchOpen) setSearchOpen(false);
    if (chatOpen) setChatOpen(false);
  }, Boolean(searchOpen || chatOpen));

  // Global keyboard shortcut for ⌘K / Ctrl+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [items, setItems] = useState<NavItem[]>(navItems);
  const [features, setFeatures] = useState<{
    enableAiCopilot: boolean;
    enableDailyCheckin: boolean;
    enableCommandPalette: boolean;
    enableWhatsApp: boolean;
    enableToolsCatalog: boolean;
  }>({
    enableAiCopilot: true,
    enableDailyCheckin: true,
    enableCommandPalette: true,
    enableWhatsApp: true,
    enableToolsCatalog: true,
  });

  // Sync navItems prop if changes
  React.useEffect(() => {
    if (navItems && navItems.length > 0) {
      setItems(navItems);
    }
  }, [navItems]);

  // Fetch dynamic navigation and feature toggles from backend
  React.useEffect(() => {
    fetch("/api/public/config")
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          if (Array.isArray(d.nav) && d.nav.length > 0) {
            setItems(d.nav.filter((n: NavItem) => n.enabled !== false));
          }
          if (d.features) {
            setFeatures(d.features);
          }
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    try {
      const savedProfileStr = localStorage.getItem("nuralix_business_profile");
      if (savedProfileStr) {
        const saved = JSON.parse(savedProfileStr);
        if (saved.name) setCompanyName(saved.name);
        if (saved.industryLabel) {
          setIndustry(saved.industryLabel);
        } else if (saved.industry) {
          setIndustry(saved.industry);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const [contextChips, setContextChips] = useState<ContextChip[]>([
    { id: "chip_dash", label: "Dashboard: Q3 Live Data", type: "page" },
    { id: "chip_runway", label: "Runway: 7.2 months", type: "metric" },
  ]);

  const handleRemoveChip = (id: string) => {
    setContextChips(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col md:flex-row relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-white">
      {/* Ambient background glow aura */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[300px] bg-gradient-to-br from-cyan-500/5 via-violet-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[300px] bg-gradient-to-tl from-cyan-500/5 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Desktop Left Rail (lg+) */}
      <DesktopRail
        navItems={items}
        companyName={companyName}
        industry={industry}
        onOpenSearch={() => features.enableCommandPalette && setSearchOpen(true)}
      />

      {/* Tablet Icon Rail (md) */}
      <TabletRail
        navItems={items}
        onOpenSearch={() => features.enableCommandPalette && setSearchOpen(true)}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0 md:ml-16 lg:ml-64">
        {/* Mobile Header (xs/sm) */}
        <MobileHeader
          companyName={companyName}
          onOpenChat={() => setChatOpen(true)}
          onOpenSearch={() => features.enableCommandPalette && setSearchOpen(true)}
        />

        {/* Page Content Container with Container Queries support */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1560px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Floating AI Executive Launcher Button (Desktop & Tablet) - hidden on /chat or if disabled */}
      {features.enableAiCopilot && pathname !== "/chat" && (
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          aria-label="Open AI Workspace"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600 text-white shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all text-xs font-bold border border-cyan-400/40 font-sans cursor-pointer group"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <MessageSquare className="w-4 h-4 text-white group-hover:rotate-6 transition-transform" />
          <span>Ask Executive AI</span>
        </button>
      )}

      {/* Universal Command Palette / Spotlight Search Modal */}
      {features.enableCommandPalette && (
        <CommandPalette
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      )}

      {/* Slide-over Chat Dock */}
      <ChatDock
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        activeContextChips={contextChips}
        onRemoveChip={handleRemoveChip}
      />

      {/* Mobile Bottom Tab Bar (xs/sm) */}
      <MobileBottomBar navItems={items} />
    </div>
  );
}
