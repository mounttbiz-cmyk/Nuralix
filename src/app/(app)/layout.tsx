import React from "react";
import { AppShell } from "@/components/shell/AppShell";
import { resolveTenantConfig } from "@/config/resolver";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = resolveTenantConfig({
    industry: "saas",
    businessModel: "subscription",
    plan: "growth",
  });

  return (
    <AuthGuard>
      <AppShell
        navItems={config.nav}
        companyName="Apex Analytics"
        industry="B2B SaaS"
      >
        {children}
      </AppShell>
    </AuthGuard>
  );
}
