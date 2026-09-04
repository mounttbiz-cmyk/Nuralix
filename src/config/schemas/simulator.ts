import { z } from "zod";

export const ScenarioInputDefSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(["number", "currency", "percent", "text", "select"]),
  defaultValue: z.any(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  helpText: z.string().optional(),
});

export const ScenarioAssumptionSchema = z.object({
  key: z.string(),
  label: z.string(),
  low: z.number(),
  likely: z.number(),
  high: z.number(),
  unit: z.string(),
  source: z.enum(["profile", "benchmark", "user", "nuralix_estimate"]),
});

export const ScenarioTemplateSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  description: z.string(),
  modelKey: z.string(), // maps to deterministic calculation model
  inputs: z.array(ScenarioInputDefSchema),
  defaultAssumptions: z.array(ScenarioAssumptionSchema),
  outputs: z.array(z.object({
    key: z.string(),
    label: z.string(),
    format: z.string(),
  })),
  enabled: z.boolean().default(true),
});

export type ScenarioTemplate = z.infer<typeof ScenarioTemplateSchema>;
