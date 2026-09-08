"use client";

import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Flame,
  Users,
  Cpu,
  ArrowRight,
  Check,
  Clock,
  Send
} from "lucide-react";

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted: (data: any) => void;
  questionRules: {
    skipRevenue?: boolean;
    skipTech?: boolean;
  };
}

export function DailyCheckInModal({
  isOpen,
  onClose,
  onCompleted,
  questionRules,
}: DailyCheckInModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [revenueAnswer, setRevenueAnswer] = useState("");
  const [blockersAnswer, setBlockersAnswer] = useState("");
  const [urgentAnswer, setUrgentAnswer] = useState("");
  const [teamAnswer, setTeamAnswer] = useState("");
  const [techAnswer, setTechAnswer] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitting(true);

    const answers: Record<string, string> = {
      revenue: questionRules.skipRevenue ? "Auto-synced via Stripe/Accounting" : revenueAnswer || "On target / Nominal",
      blockers: blockersAnswer || "None / Smooth sailing",
      urgent: urgentAnswer || "All clear / Nominal",
      team: teamAnswer || "Team fully productive",
      tech: questionRules.skipTech ? "Auto-synced via Help Desk" : techAnswer || "Systems 100% operational",
    };

    const rawSummary = Object.entries(answers)
      .map(([k, v]) => `${k}: ${v}`)
      .join(" · ");

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          rawText: rawSummary,
          source: "manual_web",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onCompleted(data);
        onClose();
      }
    } catch (err) {
      console.error("Failed to submit daily check-in", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full p-6 rounded-2xl bg-surface border border-line shadow-2xl space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brass-soft text-brass border border-brass/30 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-text">Daily Executive Check-In</h2>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-semibold">
                  &lt; 60 seconds
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">
                Quick pulse check to update your AI executive team and calibrate today&apos;s briefings.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-text-muted hover:text-text font-semibold px-2 py-1 rounded bg-surface-2 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Question 1: Revenue (Skipped if Stripe or Accounting connected) */}
          {!questionRules.skipRevenue ? (
            <div className="p-3.5 rounded-xl border border-line bg-surface-2/40 space-y-2">
              <label className="font-bold text-text flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-jade" />
                <span>1. How was revenue / sales today?</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {["Strong sales day (above target)", "Steady / on track", "Slow / below average", "Major deal closed"].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setRevenueAnswer(opt)}
                    className={`px-2.5 py-1 rounded-md text-[11px] border transition-all cursor-pointer ${
                      revenueAnswer === opt
                        ? "bg-brass text-white border-brass font-semibold"
                        : "bg-surface border-line text-text-muted hover:text-text"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={revenueAnswer}
                onChange={e => setRevenueAnswer(e.target.value)}
                placeholder="Or type custom amount / deal notes..."
                className="w-full px-3 py-1.5 rounded-lg bg-surface border border-line text-text text-xs focus:ring-1 focus:ring-brass"
              />
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-jade/10 border border-jade/20 text-[11px] text-jade flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Revenue question skipped — live telemetry is connected via Stripe / Accounting.</span>
            </div>
          )}

          {/* Question 2: Blockers (Always Asked) */}
          <div className="p-3.5 rounded-xl border border-line bg-surface-2/40 space-y-2">
            <label className="font-bold text-text flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>2. Any problems or blockers today?</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {["None / Smooth sailing", "Client delayed signoff", "Vendor / supply hold", "Cash collection lag"].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setBlockersAnswer(opt)}
                  className={`px-2.5 py-1 rounded-md text-[11px] border transition-all cursor-pointer ${
                    blockersAnswer === opt
                      ? "bg-brass text-white border-brass font-semibold"
                      : "bg-surface border-line text-text-muted hover:text-text"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={blockersAnswer}
              onChange={e => setBlockersAnswer(e.target.value)}
              placeholder="Or write blocker details..."
              className="w-full px-3 py-1.5 rounded-lg bg-surface border border-line text-text text-xs focus:ring-1 focus:ring-brass"
            />
          </div>

          {/* Question 3: Urgent or Unusual (Always Asked) */}
          <div className="p-3.5 rounded-xl border border-line bg-surface-2/40 space-y-2">
            <label className="font-bold text-text flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rust" />
              <span>3. Anything urgent or unusual?</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {["All clear / Nominal", "Urgent client escalation", "Unexpected cash outflow", "Inbound acquisition interest"].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setUrgentAnswer(opt)}
                  className={`px-2.5 py-1 rounded-md text-[11px] border transition-all cursor-pointer ${
                    urgentAnswer === opt
                      ? "bg-brass text-white border-brass font-semibold"
                      : "bg-surface border-line text-text-muted hover:text-text"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={urgentAnswer}
              onChange={e => setUrgentAnswer(e.target.value)}
              placeholder="Or note urgent items..."
              className="w-full px-3 py-1.5 rounded-lg bg-surface border border-line text-text text-xs focus:ring-1 focus:ring-brass"
            />
          </div>

          {/* Question 4: Team / HR Issues (Always Asked) */}
          <div className="p-3.5 rounded-xl border border-line bg-surface-2/40 space-y-2">
            <label className="font-bold text-text flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>4. Any team or HR issues?</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {["Team fully productive", "Key role interview scheduled", "Capacity stretched / overload", "Key employee sick / leave"].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setTeamAnswer(opt)}
                  className={`px-2.5 py-1 rounded-md text-[11px] border transition-all cursor-pointer ${
                    teamAnswer === opt
                      ? "bg-brass text-white border-brass font-semibold"
                      : "bg-surface border-line text-text-muted hover:text-text"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={teamAnswer}
              onChange={e => setTeamAnswer(e.target.value)}
              placeholder="Or specify team updates..."
              className="w-full px-3 py-1.5 rounded-lg bg-surface border border-line text-text text-xs focus:ring-1 focus:ring-brass"
            />
          </div>

          {/* Question 5: Tech / IT (Skipped if Help Desk connected) */}
          {!questionRules.skipTech ? (
            <div className="p-3.5 rounded-xl border border-line bg-surface-2/40 space-y-2">
              <label className="font-bold text-text flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-violet-400" />
                <span>5. Anything tech or IT related?</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {["Systems 100% operational", "Minor customer bug resolved", "Cloud deploy scheduled", "Security update completed"].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTechAnswer(opt)}
                    className={`px-2.5 py-1 rounded-md text-[11px] border transition-all cursor-pointer ${
                      techAnswer === opt
                        ? "bg-brass text-white border-brass font-semibold"
                        : "bg-surface border-line text-text-muted hover:text-text"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={techAnswer}
                onChange={e => setTechAnswer(e.target.value)}
                placeholder="Or specify tech items..."
                className="w-full px-3 py-1.5 rounded-lg bg-surface border border-line text-text text-xs focus:ring-1 focus:ring-brass"
              />
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-jade/10 border border-jade/20 text-[11px] text-jade flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Tech / support question skipped — ticket telemetry is synced via Help Desk.</span>
            </div>
          )}

          <div className="pt-3 border-t border-line flex items-center justify-between">
            <span className="text-[11px] text-text-muted">
              Auto-calibrates Astra, Marcus & Elena briefing models.
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-brass text-white font-bold text-xs shadow-md hover:brightness-110 btn-tactile inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Saving Pulse…" : "Submit Daily Check-In"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
