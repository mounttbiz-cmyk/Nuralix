import React from "react";

export type StatusTone = "live" | "ai" | "warning" | "critical" | "neutral";

interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
  /** Show the pulsing beacon dot (reserve for genuinely live/real-time states). */
  pulse?: boolean;
  className?: string;
}

const toneClasses: Record<StatusTone, { pill: string; dot: string }> = {
  // green = live / verified
  live: { pill: "bg-jade/10 text-jade border-jade/30", dot: "bg-jade" },
  // gold = AI / autonomous
  ai: { pill: "bg-gold/10 text-gold border-gold/30", dot: "bg-gold" },
  // amber = warning
  warning: { pill: "bg-amber/10 text-amber border-amber/30", dot: "bg-amber" },
  // red = critical
  critical: { pill: "bg-rust/10 text-rust border-rust/30", dot: "bg-rust" },
  // neutral = informational, no strong semantic color
  neutral: { pill: "bg-surface-2 text-text-muted border-line", dot: "bg-text-muted" },
};

/**
 * Standardized status/state pill: fixed height, fully rounded, dot + label.
 * Use for things like "LIVE", "AUTONOMOUS", "SUPERADMIN SECURE", "ACTIVE TENANT".
 */
export function StatusBadge({ label, tone = "neutral", pulse = false, className = "" }: StatusBadgeProps) {
  const cfg = toneClasses[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full border text-[10px] font-bold font-mono uppercase tracking-wider whitespace-nowrap ${cfg.pill} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot} ${pulse ? "beacon-dot-current" : ""}`}
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
}

export type ProvenanceType = "from_data" | "benchmark" | "estimate" | "user";

interface ProvenanceBadgeProps {
  type: ProvenanceType;
  citation?: string;
}

export function ProvenanceBadge({ type, citation }: ProvenanceBadgeProps) {
  const configs: Record<ProvenanceType, { label: string; className: string }> = {
    from_data: {
      label: "Verified Data",
      className: "bg-jade/10 text-jade border-jade/30",
    },
    benchmark: {
      label: "Industry Benchmark",
      className: "bg-brass-soft/50 text-brass border-brass/30",
    },
    estimate: {
      label: "BizzPal Estimate",
      className: "bg-amber/10 text-amber border-amber/30",
    },
    user: {
      label: "User Input",
      className: "bg-surface-2 text-text-muted border-line",
    },
  };

  const config = configs[type];

  return (
    <span
      className={`inline-flex items-center h-6 px-2.5 rounded-full border text-[10px] font-bold font-mono uppercase tracking-wider whitespace-nowrap ${config.className}`}
      title={citation || `Source: ${config.label}`}
    >
      {config.label}
    </span>
  );
}
