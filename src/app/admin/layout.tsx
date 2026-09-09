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
    <div className="min-h-screen bg-bg text-text antialiased">
      {children}
    </div>
  );
}
