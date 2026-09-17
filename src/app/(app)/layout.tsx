import React from "react";
import { AppShell } from "@/components/shell/AppShell";
import { resolveTenantConfig } from "@/config/resolver";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { getActiveBusiness } from "@/lib/db";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const activeBiz = getActiveBusiness();
  const companyName = activeBiz?.name || "Nuralix Enterprise";
  const industryLabel = activeBiz?.industryLabel || "Technology & Enterprise Services";

  const config = resolveTenantConfig({
    industry: (activeBiz?.industry as any) || "saas",
    businessModel: "subscription",
    plan: "growth",
  });

  return (
    <AuthGuard>
      <AppShell
        navItems={config.nav}
        companyName={companyName}
        industry={industryLabel}
      >
        {children}
      </AppShell>
    </AuthGuard>
  );
}
