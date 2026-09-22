"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  Check,
  Sparkles,
  Save,
  X,
  RotateCcw,
} from "lucide-react";

interface PlanTier {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  color: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  ctaLabel: string;
  enabled?: boolean;
}

interface PricingManagerProps {
  plans: PlanTier[];
  onSave: (updatedPlans: PlanTier[], note?: string) => Promise<void>;
  notify: (msg: string) => void;
  saving: boolean;
}

export function PricingManager({ plans, onSave, notify, saving }: PricingManagerProps) {
  const [planList, setPlanList] = useState<PlanTier[]>(plans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanTier | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scroll and support ESC key to close modal
  useEffect(() => {
    if (!isModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const [form, setForm] = useState<{
    id: string;
    name: string;
    tagline: string;
    price: string;
    period: string;
    color: string;
    badge: string;
    isPopular: boolean;
    featuresRaw: string;
    ctaLabel: string;
    enabled: boolean;
  }>({
    id: "",
    name: "",
    tagline: "",
    price: "₹3,999",
    period: "/month",
    color: "border-gold/30 text-gold",
    badge: "Popular",
    isPopular: false,
    featuresRaw: "",
    ctaLabel: "Get Started",
    enabled: true,
  });

  const openCreateModal = () => {
    setEditingPlan(null);
    setForm({
      id: `plan_${Date.now()}`,
      name: "",
      tagline: "",
      price: "₹4,999",
      period: "/month",
      color: "border-gold/30 text-gold",
      badge: "New",
      isPopular: false,
      featuresRaw: "Feature 1\nFeature 2\nFeature 3",
      ctaLabel: "Activate Plan",
      enabled: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: PlanTier) => {
    setEditingPlan(p);
    setForm({
      id: p.id,
      name: p.name,
      tagline: p.tagline,
      price: p.price,
      period: p.period,
      color: p.color || "border-gold/30 text-gold",
      badge: p.badge || "",
      isPopular: Boolean(p.isPopular),
      featuresRaw: (p.features || []).join("\n"),
      ctaLabel: p.ctaLabel || "Activate Plan",
      enabled: p.enabled !== false,
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const featureList = form.featuresRaw
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    let updated: PlanTier[];
    if (editingPlan) {
      updated = planList.map((p) =>
        p.id === editingPlan.id
          ? {
              ...p,
              name: form.name.trim(),
              tagline: form.tagline.trim(),
              price: form.price.trim(),
              period: form.period.trim(),
              color: form.color,
              badge: form.badge.trim() || undefined,
              isPopular: form.isPopular,
              features: featureList,
              ctaLabel: form.ctaLabel.trim(),
              enabled: form.enabled,
            }
          : p
      );
    } else {
      const newPlan: PlanTier = {
        id: form.id || `plan_${Date.now()}`,
        name: form.name.trim(),
        tagline: form.tagline.trim(),
        price: form.price.trim(),
        period: form.period.trim(),
        color: form.color,
        badge: form.badge.trim() || undefined,
        isPopular: form.isPopular,
        features: featureList,
        ctaLabel: form.ctaLabel.trim(),
        enabled: form.enabled,
      };
      updated = [...planList, newPlan];
    }

    setPlanList(updated);
    setIsModalOpen(false);
    await onSave(updated, `Updated pricing tier "${form.name}"`);
  };

  const handleDelete = async (planId: string, name: string) => {
    if (!window.confirm(`Delete pricing tier "${name}"?`)) return;
    const updated = planList.filter((p) => p.id !== planId);
    setPlanList(updated);
    await onSave(updated, `Deleted pricing tier "${name}"`);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-line flex flex-col sm:flex-row items-center justify-between gap-3 shadow-theme">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-500 shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text">Subscription Plans & Pricing CMS</h2>
            <p className="text-xs text-text-muted">
              Configure tiers, prices in ₹, feature checklists, and badges displayed on /subscription and the website.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-brass hover:brightness-110 text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Pricing Tier</span>
        </button>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {planList.map((plan) => (
          <div
            key={plan.id}
            className={`p-5 rounded-2xl bg-surface border flex flex-col justify-between shadow-theme transition-all relative ${
              plan.isPopular ? "border-gold/60 ring-1 ring-gold/30" : "border-line"
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full btn-gold-gradient text-[#1a1206] text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                {plan.badge}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <h3 className="font-extrabold text-sm text-text">{plan.name}</h3>
                <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">{plan.tagline}</p>
              </div>

              <div className="pt-2 border-t border-line/60">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-text font-mono">{plan.price}</span>
                  <span className="text-xs text-text-muted font-mono">{plan.period}</span>
                </div>
              </div>

              {/* Features List */}
              <div className="pt-3 border-t border-line/60 space-y-1.5">
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">
                  Features Included ({plan.features?.length || 0})
                </div>
                <ul className="space-y-1 text-xs text-text-muted">
                  {(plan.features || []).slice(0, 6).map((feat, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-tight">
                      <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                      <span className="text-[11px] text-text">{feat}</span>
                    </li>
                  ))}
                  {(plan.features || []).length > 6 && (
                    <li className="text-[10px] text-text-muted italic pl-5">
                      +{(plan.features || []).length - 6} more features
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-line flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 border border-line text-text-muted">
                {plan.id}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(plan)}
                  className="p-1.5 rounded-lg border border-line hover:bg-surface-2 text-text-muted hover:text-text cursor-pointer transition-colors"
                  title="Edit plan"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(plan.id, plan.name)}
                  className="p-1.5 rounded-lg border border-line hover:bg-rose-500/10 text-text-muted hover:text-rose-500 cursor-pointer transition-colors"
                  title="Delete plan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD / EDIT PLAN */}
      {mounted && isModalOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-xl max-h-[88vh] flex flex-col bg-surface border border-line rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-surface shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-500">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text">
                    {editingPlan ? `Edit Tier: ${editingPlan.name}` : "Create New Pricing Tier"}
                  </h3>
                  <p className="text-[11px] text-text-muted">Subscription pricing, feature entitlements & badges</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-surface-2 text-text-muted hover:text-text cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="pricing-modal-form" onSubmit={handleSaveModal} className="overflow-y-auto px-6 py-4 space-y-3.5 text-xs flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-text">Tier Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Growth Scale"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-text focus:outline-none focus:border-gold font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text">Badge (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Recommended, Most Popular"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-text">Price String</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹9,999 or Custom"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-text font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text">Billing Period</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. /month, /billed annually"
                    value={form.period}
                    onChange={(e) => setForm({ ...form, period: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-text font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-text">Tagline / Audience</label>
                <input
                  type="text"
                  placeholder="For expanding businesses ready to scale..."
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-text"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-text">CTA Button Label</label>
                <input
                  type="text"
                  placeholder="e.g. Activate Plan →"
                  value={form.ctaLabel}
                  onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-text"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-text">Feature Bullets (One per line)</label>
                <textarea
                  rows={5}
                  placeholder="All Free features&#10;Unlimited AI Executive consultations&#10;Scenario Simulator"
                  value={form.featuresRaw}
                  onChange={(e) => setForm({ ...form, featuresRaw: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-line text-text font-mono text-[11px] focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPopular}
                    onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                    className="rounded border-line text-gold focus:ring-0"
                  />
                  <span className="text-xs font-semibold text-text">Highlight as Popular Tier</span>
                </label>
              </div>
            </form>

            {/* Sticky Footer */}
            <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-line bg-surface-2/60 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-line text-text-muted hover:text-text hover:bg-surface-2 cursor-pointer font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="pricing-modal-form"
                disabled={saving}
                className="px-5 py-2 rounded-xl text-xs font-bold text-[#1a1206] btn-gold-gradient hover:brightness-110 active:scale-[0.98] cursor-pointer transition-all shadow-md shadow-[0_8px_20px_-6px_var(--gold-glow)] flex items-center gap-1.5 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#1a1206] border-t-transparent animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Pricing Tier</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
