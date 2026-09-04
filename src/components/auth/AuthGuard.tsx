"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Check if user has authenticated
    const session = localStorage.getItem("nuralix_user_session");
    if (!session) {
      router.push("/landing");
    } else {
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
