"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/firebase/authContext";
import { getUserPlanFromFirestore, saveUserPlanToFirestore } from "@/lib/firebase/firestore";

export const PLAN_ORDER = ["free", "starter", "growth", "enterprise"] as const;
export type PlanId = string;

function getDynamicPlanOrder(): string[] {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("bizzpal_subscription_plans");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((p: any) => p.enabled !== false).map((p: any) => p.id);
        }
      }
    } catch {}
  }
  return [...PLAN_ORDER];
}

function planRank(planId: string | null | undefined): number {
  if (!planId) return 0;
  const order = getDynamicPlanOrder();
  const idx = order.indexOf(planId);
  if (idx !== -1) return idx;
  const fallbackIdx = (PLAN_ORDER as readonly string[]).indexOf(planId);
  return fallbackIdx === -1 ? 0 : fallbackIdx;
}

/**
 * Resolves the current user's active subscription plan (Firestore when signed in,
 * falling back to the local cache used before/without auth) and exposes plan-gating helpers.
 */
export function usePlanAccess() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<string>("free");
  const [hasActivated, setHasActivated] = useState(false);
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
              setHasActivated(true);
              localStorage.setItem("bizzpal_subscription_plan", remotePlan);
            } else {
              const local = localStorage.getItem("bizzpal_subscription_plan");
              setPlan(local || "free");
              setHasActivated(Boolean(local));
            }
          }
          return;
        }
        const local = localStorage.getItem("bizzpal_subscription_plan");
        if (!cancelled) {
          setPlan(local || "free");
          setHasActivated(Boolean(local));
        }
      } catch {
        if (!cancelled) {
          const local = localStorage.getItem("bizzpal_subscription_plan");
          setPlan(local || "free");
          setHasActivated(Boolean(local));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    resolvePlan();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "bizzpal_subscription_plan" && e.newValue) {
        setPlan(e.newValue);
        setHasActivated(true);
      }
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
      setHasActivated(true);
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

  return { plan: plan as PlanId, hasActivated, loading, activatePlan, hasPlanLevel };
}
