import { z } from "zod";

export const FeatureFlagSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(["core", "ai", "simulation", "reporting", "integrations"]),
  status: z.enum(["live", "beta", "hidden", "deprecated"]).default("live"),
  defaultEnabled: z.boolean().default(true),
  plans: z.array(z.enum(["starter", "growth", "enterprise"])).default(["starter", "growth", "enterprise"]),
});

export type FeatureFlag = z.infer<typeof FeatureFlagSchema>;
