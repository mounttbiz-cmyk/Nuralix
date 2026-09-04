"use client";

import React, { useState } from "react";
import { DesktopRail } from "./DesktopRail";
import { TabletRail } from "./TabletRail";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomBar } from "./MobileBottomBar";
import { ChatDock, ContextChip } from "./ChatDock";
import { NavItem } from "@/config/schemas/nav";
import { MessageSquare } from "lucide-react";

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
  const [chatOpen, setChatOpen] = useState(false);
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [industry, setIndustry] = useState(initialIndustry);

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
    <div className="min-h-screen bg-bg text-text flex flex-col md:flex-row">
      {/* Desktop Left Rail (lg+) */}
      <DesktopRail navItems={navItems} companyName={companyName} industry={industry} />

      {/* Tablet Icon Rail (md) */}
      <TabletRail navItems={navItems} />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Mobile Header (xs/sm) */}
        <MobileHeader companyName={companyName} onOpenChat={() => setChatOpen(true)} />

        {/* Page Content Container with Container Queries support */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1560px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Floating AI Executive Launcher Button (Desktop & Tablet) */}
      <button
        type="button"
        onClick={() => setChatOpen(true)}
        aria-label="Open AI Executive Chat"
        className="hidden md:flex fixed bottom-6 right-6 z-30 items-center gap-2 px-4 py-2.5 rounded-full bg-brass text-white font-semibold text-xs shadow-lg hover:brightness-110 btn-tactile cursor-pointer"
      >
        <MessageSquare className="w-4 h-4 text-white" />
        <span>Ask Executive AI</span>
      </button>

      {/* Slide-over Chat Dock */}
      <ChatDock
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        activeContextChips={contextChips}
        onRemoveChip={handleRemoveChip}
      />

      {/* Mobile Bottom Tab Bar (xs/sm) */}
      <MobileBottomBar navItems={navItems} />
    </div>
  );
}
