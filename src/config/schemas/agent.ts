import { z } from "zod";

export const AgentDefSchema = z.object({
  id: z.string(),
  key: z.string(), // e.g. 'ceo', 'cfo', 'marketing', 'sales', 'ops', 'hr', 'strategy'
  name: z.string(),
  role: z.string(),
  avatar: z.string(),
  model: z.string().default("claude-3-7-sonnet"),
  temperature: z.number().default(0.2),
  systemPrompt: z.string(),
  tools: z.array(z.string()).default([]),
  outputStructure: z.string().default("six_part"),
  enablementRules: z.object({
    requiredDepartments: z.array(z.string()).optional(),
    minTeamSize: z.number().optional(),
    alwaysEnabled: z.boolean().default(false),
  }).default({ alwaysEnabled: false }),
  version: z.number().default(1),
  status: z.enum(["active", "draft", "deprecated"]).default("active"),
});

export type AgentDef = z.infer<typeof AgentDefSchema>;
