"use client";

import { useEffect } from "react";

export const BUSINESS_DATA_UPDATED_EVENT = "nuralix_business_data_updated";

export function emitBusinessDataUpdated(metrics: any) {
  if (typeof window === "undefined") return;

  // 1. Sync to local storage business profile
  try {
    const existingStr = localStorage.getItem("nuralix_business_profile");
    const existing = existingStr ? JSON.parse(existingStr) : {};

    const updatedProfile = {
      ...existing,
      name: metrics.name || existing.name || "Apex Analytics",
      industry: metrics.industry || existing.industry || "saas",
      industryLabel: metrics.industryLabel || existing.industryLabel || "B2B SaaS",
      founderName: metrics.founderName || existing.founderName || "Founder",
      revenue: metrics.monthlyRevenue ?? existing.revenue ?? 500000,
      annualRevenue: metrics.annualRevenue ?? existing.annualRevenue ?? 6000000,
      burn: metrics.monthlyBurn ?? existing.burn ?? 150000,
      cash: metrics.cashOnHand ?? existing.cash ?? 1200000,
      cashOnHand: metrics.cashOnHand ?? existing.cashOnHand ?? 1200000,
      monthlyNetBurn: metrics.monthlyBurn ?? existing.monthlyNetBurn ?? 150000,
      teamSize: metrics.teamSize ?? existing.teamSize ?? 15,
      grossMargin: metrics.grossMargin ?? existing.grossMargin ?? 82,
      trend: metrics.trend || existing.trend,
      isUploadedData: true,
      lastUploadedAt: new Date().toISOString(),
      sourceFileName: metrics.sourceFileName || "uploaded_data.csv",
    };

    localStorage.setItem("nuralix_business_profile", JSON.stringify(updatedProfile));
  } catch (e) {
    console.error("Failed to update localStorage business profile:", e);
  }

  // 2. Dispatch custom window event
  window.dispatchEvent(
    new CustomEvent(BUSINESS_DATA_UPDATED_EVENT, {
      detail: metrics,
    })
  );
}

export function useBusinessDataSync(onUpdate: (metrics: any) => void) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (e: any) => {
      if (e.detail) {
        onUpdate(e.detail);
      }
    };

    const storageHandler = (e: StorageEvent) => {
      if (e.key === "nuralix_business_profile" && e.newValue) {
        try {
          onUpdate(JSON.parse(e.newValue));
        } catch {}
      }
    };

    window.addEventListener(BUSINESS_DATA_UPDATED_EVENT, handler);
    window.addEventListener("storage", storageHandler);

    return () => {
      window.removeEventListener(BUSINESS_DATA_UPDATED_EVENT, handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, [onUpdate]);
}

export function downloadFile(content: string, fileName: string, mimeType: string = "text/csv") {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
