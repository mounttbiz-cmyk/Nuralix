import { z } from "zod";

export const WidgetDefSchema = z.object({
  id: z.string(),
  title: z.string(),
  component: z.string(), // key into React component registry
  requires: z.object({
    fields: z.array(z.string()).optional(),
    models: z.array(z.string()).optional(),
    industries: z.array(z.string()).optional(),
  }).optional().default({}),
  priority: z.number().default(10),
  defaultSpan: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).default(1),
  minContainerWidth: z.number().default(300), // drives container-query threshold
  enabled: z.boolean().default(true),
  targeting: z.object({
    plans: z.array(z.string()).optional(),
    stages: z.array(z.string()).optional(),
  }).optional(),
});

export type WidgetDef = z.infer<typeof WidgetDefSchema>;
