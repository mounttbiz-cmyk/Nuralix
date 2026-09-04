import { z } from "zod";

export const GapRuleSchema = z.object({
  id: z.string(),
  key: z.string(),
  title: z.string(),
  category: z.enum([
    "Financial",
    "Growth",
    "Sales",
    "Marketing",
    "Operations",
    "Team",
    "Product",
    "Strategy",
    "Risk",
    "Pricing"
  ]),
  severity: z.enum(["critical", "high", "medium", "low"]),
  condition: z.object({
    field: z.string(),
    operator: z.enum(["lt", "gt", "lte", "gte", "eq", "neq", "includes"]),
    value: z.any(),
    unit: z.string().optional(),
  }),
  whyItMatters: z.string(),
  effort: z.enum(["quick win", "project", "programme"]),
  evidenceTemplate: z.string(),
  impactEstimateTemplate: z.object({
    metric: z.string(),
    lowFormula: z.string(),
    highFormula: z.string(),
    unit: z.string(),
    horizonDays: z.number().default(90),
  }).optional(),
  solutionPlaybook: z.object({
    summary: stringToZod(),
    steps: z.array(z.object({
      title: z.string(),
      detail: z.string(),
      ownerRole: z.string().optional(),
      days: z.number(),
    })),
    successMetric: z.string(),
    firstAction: z.string(),
  }),
  enabled: z.boolean().default(true),
});

function stringToZod() {
  return z.string();
}

export type GapRule = z.infer<typeof GapRuleSchema>;
