"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";
import { ThemeSwitch } from "@/components/shell/ThemeSwitch";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Verify developer superadmin session
    const sessionStr = localStorage.getItem("nuralix_admin_session");
    if (!sessionStr) {
      router.push("/admin/login");
    } else {
      try {
        const parsed = JSON.parse(sessionStr);
        if (parsed.role === "platform_admin") {
          setAuthorized(true);
        } else {
          router.push("/admin/login");
        }
      } catch (e) {
        router.push("/admin/login");
      }
    }
  }, [router]);

  const handleAdminLogout = () => {
    localStorage.removeItem("nuralix_admin_session");
    router.push("/login");
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-xs text-text-muted">
        Verifying developer authorization…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-surface border-b border-line px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text btn-tactile"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="h-4 w-px bg-line" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-surface-2 flex items-center justify-center p-0.5 border border-line">
              <Image
                src="/logo.png"
                alt="Logo"
                width={18}
                height={18}
                className="object-contain"
              />
            </div>
            <span className="text-xs font-bold text-text uppercase tracking-wider font-sans">
              Superadmin Control Plane (§15)
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber/15 text-amber font-mono font-bold">
              DEVELOPER_ACCESS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-36">
            <ThemeSwitch compact />
          </div>
          <button
            type="button"
            onClick={handleAdminLogout}
            title="Exit Superadmin Session"
            className="text-xs text-text-muted hover:text-rust p-1.5 rounded-lg border border-line hover:bg-surface-2 transition-colors flex items-center gap-1 font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 max-w-[1560px] mx-auto">
        {children}
      </main>
    </div>
  );
}
