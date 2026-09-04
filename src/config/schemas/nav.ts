import { z } from "zod";

export const NavItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
  icon: z.string(), // key to icon registry (e.g. 'LayoutDashboard', 'MessageSquare', 'Target', 'Compass', etc.)
  order: z.number(),
  badge: z.string().optional(),
  mobileTab: z.boolean().default(false), // true if one of the 5 primary items on phone
  group: z.enum(["core", "intelligence", "management", "system"]).default("core"),
  requiredPlan: z.enum(["starter", "growth", "enterprise"]).optional(),
  enabled: z.boolean().default(true),
});

export type NavItem = z.infer<typeof NavItemSchema>;
