"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const session = localStorage.getItem("nuralix_user_session");
      const profile = localStorage.getItem("nuralix_business_profile");

      if (session) {
        setChecked(true);
      } else if (profile) {
        // Auto-heal/restore user session from existing business profile
        const p = JSON.parse(profile);
        const autoSession = {
          id: `usr_${Date.now()}`,
          email: p.website ? `founder@${p.website.replace(/^https?:\/\//, "")}` : "founder@mycompany.in",
          name: p.founderName || "Founder",
          role: "owner",
          provider: "email",
          authenticatedAt: new Date().toISOString(),
        };
        localStorage.setItem("nuralix_user_session", JSON.stringify(autoSession));
        setChecked(true);
      } else {
        router.push("/login");
      }
    } catch (e) {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-xs text-text-muted">
        Loading Nuralix Business OS…
      </div>
    );
  }

  return <>{children}</>;
}
