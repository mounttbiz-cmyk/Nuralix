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
import { motion, AnimatePresence } from "framer-motion";

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
      setItems(navItems.filter(item => item.enabled !== false));
    }
  }, [navItems]);

  // Fetch dynamic navigation and feature toggles with real-time Superadmin listeners
  React.useEffect(() => {
    let mounted = true;

    const fetchConfig = () => {
      // 1. Instant check from localStorage
      if (typeof window !== "undefined") {
        try {
          const savedNav = localStorage.getItem("bizzpal_dashboard_nav");
          if (savedNav) {
            const parsedNav = JSON.parse(savedNav);
            if (mounted && Array.isArray(parsedNav) && parsedNav.length > 0) {
              setItems(parsedNav.filter((n: NavItem) => n.enabled !== false));
            }
          }
          const savedFeatures = localStorage.getItem("bizzpal_dashboard_features");
          if (savedFeatures) {
            const parsedFeatures = JSON.parse(savedFeatures);
            if (mounted && parsedFeatures) {
              setFeatures(parsedFeatures);
            }
          }
        } catch {}
      }

      // 2. Fetch from backend
      fetch("/api/public/config", { cache: "no-store", headers: { "Cache-Control": "no-cache" } })
        .then(r => r.json())
        .then(d => {
          if (!mounted) return;
          if (d.success) {
            if (Array.isArray(d.nav) && d.nav.length > 0) {
              setItems(d.nav.filter((n: NavItem) => n.enabled !== false));
              try {
                localStorage.setItem("bizzpal_dashboard_nav", JSON.stringify(d.nav));
              } catch {}
            }
            if (d.features) {
              setFeatures(d.features);
              try {
                localStorage.setItem("bizzpal_dashboard_features", JSON.stringify(d.features));
              } catch {}
            }
          }
        })
        .catch(() => {});
    };

    fetchConfig();

    window.addEventListener("bizzpal_config_updated", fetchConfig);
    window.addEventListener("storage", fetchConfig);
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("bizzpal_channel");
      bc.onmessage = () => fetchConfig();
    } catch {}

    return () => {
      mounted = false;
      window.removeEventListener("bizzpal_config_updated", fetchConfig);
      window.removeEventListener("storage", fetchConfig);
      if (bc) bc.close();
    };
  }, []);

  React.useEffect(() => {
    const syncProfile = () => {
      try {
        const savedProfileStr = localStorage.getItem("bizzpal_business_profile");
        if (savedProfileStr) {
          const saved = JSON.parse(savedProfileStr);
          if (saved.name) setCompanyName(saved.name);
          if (saved.industryLabel) {
            setIndustry(saved.industryLabel);
          } else if (saved.industry) {
            setIndustry(saved.industry);
          }
        } else {
          fetch("/api/business/intake")
            .then(r => r.json())
            .then(d => {
              if (d.success && d.business) {
                if (d.business.name) setCompanyName(d.business.name);
                if (d.business.industry_label || d.business.industryLabel) {
                  setIndustry(d.business.industry_label || d.business.industryLabel);
                }
                try {
                  localStorage.setItem("bizzpal_business_profile", JSON.stringify(d.business));
                } catch {}
              }
            })
            .catch(() => {});
        }
      } catch (e) {
        // ignore
      }
    };

    syncProfile();
    window.addEventListener("bizzpal_profile_updated", syncProfile);
    window.addEventListener("storage", syncProfile);
    return () => {
      window.removeEventListener("bizzpal_profile_updated", syncProfile);
      window.removeEventListener("storage", syncProfile);
    };
  }, []);

  const [contextChips, setContextChips] = useState<ContextChip[]>([
    { id: "chip_dash", label: "Dashboard: Q3 Live Data", type: "page" },
    { id: "chip_runway", label: "Runway: 7.2 months", type: "metric" },
  ]);

  const handleRemoveChip = (id: string) => {
    setContextChips(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div data-glass-scope="app" className="min-h-screen bg-bg text-text flex flex-col md:flex-row relative overflow-x-hidden selection:bg-gold/25 selection:text-gold-light">
      {/* Ambient subtle champagne gold background depth — restrained and luxurious, not overpowering */}
      <div className="fixed top-0 left-1/4 w-[650px] h-[350px] bg-gradient-to-br from-gold/[0.04] via-transparent to-transparent blur-3xl pointer-events-none -z-10 dark:block hidden" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[350px] bg-gradient-to-tl from-gold/[0.03] via-transparent to-transparent blur-3xl pointer-events-none -z-10 dark:block hidden" />
      <div className="fixed top-0 left-1/4 w-[650px] h-[350px] bg-gradient-to-br from-gold/[0.03] to-transparent blur-3xl pointer-events-none -z-10 dark:hidden block" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[350px] bg-gradient-to-tl from-slate-200/30 to-transparent blur-3xl pointer-events-none -z-10 dark:hidden block" />

      {/* Vivid color blobs the liquid-glass panels refract — dark mode only, sit above the base ambient glow */}
      <div className="glass-ambient fixed top-[-10%] left-[8%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-400/25 via-orange-400/10 to-transparent blur-[110px] pointer-events-none -z-10 dark:block hidden" />
      <div className="glass-ambient fixed top-[15%] right-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-violet-500/20 via-fuchsia-500/10 to-transparent blur-[110px] pointer-events-none -z-10 dark:block hidden" />
      <div className="glass-ambient fixed bottom-[-15%] left-[30%] w-[700px] h-[500px] rounded-full bg-gradient-to-t from-cyan-400/15 via-blue-500/10 to-transparent blur-[120px] pointer-events-none -z-10 dark:block hidden" />

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
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0 md:ml-16 lg:ml-64 relative">
        {/* Ambient Top Glow specific to main column */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gold/[0.02] to-transparent pointer-events-none z-0" />
        
        {/* Mobile Header (xs/sm) */}
        <MobileHeader
          companyName={companyName}
          onOpenChat={() => setChatOpen(true)}
          onOpenSearch={() => features.enableCommandPalette && setSearchOpen(true)}
        />

        {/* Page Content Container with Framer Motion Page Transitions */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1560px] w-full mx-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating AI Executive Launcher Button (Desktop & Tablet) - Signature BizzPal Champagne Gold */}
      {features.enableAiCopilot && pathname !== "/chat" && (
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          aria-label="Open AI Workspace"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full btn-gold-gradient shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs font-bold font-sans cursor-pointer group"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-950/40 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-950" />
          </span>
          <MessageSquare className="w-4 h-4 text-[#120E05] group-hover:rotate-6 transition-transform" />
          <span className="font-bold tracking-wide text-[#120E05]">Ask Executive AI</span>
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
