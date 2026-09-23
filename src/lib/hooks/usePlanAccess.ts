"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/firebase/authContext";
import { getUserPlanFromFirestore, saveUserPlanToFirestore } from "@/lib/firebase/firestore";

export const PLAN_ORDER = ["free", "starter", "growth", "enterprise"] as const;
export type PlanId = (typeof PLAN_ORDER)[number];

function planRank(planId: string | null | undefined): number {
  const idx = PLAN_ORDER.indexOf((planId || "free") as PlanId);
  return idx === -1 ? 0 : idx;
}

/**
 * Resolves the current user's active subscription plan (Firestore when signed in,
 * falling back to the local cache used before/without auth) and exposes plan-gating helpers.
 */
export function usePlanAccess() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<string>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function resolvePlan() {
      setLoading(true);
      try {
        if (user) {
          const remotePlan = await getUserPlanFromFirestore(user.uid);
          if (!cancelled) {
            if (remotePlan) {
              setPlan(remotePlan);
              localStorage.setItem("bizzpal_subscription_plan", remotePlan);
            } else {
              const local = localStorage.getItem("bizzpal_subscription_plan") || "free";
              setPlan(local);
            }
          }
          return;
        }
        const local = localStorage.getItem("bizzpal_subscription_plan") || "free";
        if (!cancelled) setPlan(local);
      } catch {
        if (!cancelled) setPlan(localStorage.getItem("bizzpal_subscription_plan") || "free");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    resolvePlan();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "bizzpal_subscription_plan" && e.newValue) setPlan(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
    };
  }, [user]);

  const activatePlan = useCallback(
    async (planId: string) => {
      setPlan(planId);
      try {
        localStorage.setItem("bizzpal_subscription_plan", planId);
      } catch {
        // ignore
      }
      if (user) {
        try {
          await saveUserPlanToFirestore(user.uid, planId);
        } catch {
          // ignore — local cache already updated
        }
      }
    },
    [user]
  );

  const hasPlanLevel = useCallback(
    (requiredPlan?: string | null) => {
      if (!requiredPlan) return true;
      return planRank(plan) >= planRank(requiredPlan);
    },
    [plan]
  );

  return { plan: plan as PlanId, loading, activatePlan, hasPlanLevel };
}
