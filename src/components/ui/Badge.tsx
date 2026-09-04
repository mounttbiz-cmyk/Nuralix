import React from "react";

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
      label: "Nuralix Estimate",
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
      className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border uppercase tracking-wider ${config.className}`}
      title={citation || `Source: ${config.label}`}
    >
      {config.label}
    </span>
  );
}
