import { z } from "zod";

export const MetricDefSchema = z.object({
  id: z.string(),
  key: z.string(),
  label: z.string(),
  description: z.string(),
  unit: z.enum(["currency", "percent", "number", "ratio", "days", "months"]),
  format: z.object({
    decimals: z.number().default(1),
    prefix: z.string().optional(),
    suffix: z.string().optional(),
  }).default({ decimals: 1 }),
  formula: z.string().optional(),
  direction: z.enum(["up_is_good", "down_is_good", "neutral"]).default("up_is_good"),
  benchmarks: z.record(z.string(), z.object({
    p25: z.number(),
    median: z.number(),
    p75: z.number(),
    source: z.string(),
  })).optional(),
  appliesTo: z.object({
    industries: z.array(z.string()).optional(),
    models: z.array(z.string()).optional(),
  }).default({}),
  enabled: z.boolean().default(true),
});

export type MetricDef = z.infer<typeof MetricDefSchema>;
