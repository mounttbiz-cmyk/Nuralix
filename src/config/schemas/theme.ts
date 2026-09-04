import { z } from "zod";

export const ThemeColorTokensSchema = z.object({
  bg: z.string(),
  surface: z.string(),
  surface2: z.string(),
  line: z.string(),
  lineStrong: z.string(),
  text: z.string(),
  textMuted: z.string(),
  brass: z.string(),
  brassSoft: z.string(),
  jade: z.string(),
  rust: z.string(),
  amber: z.string(),
  shadow: z.string(),
  grid: z.string(),
});

export const ThemeTokensSchema = z.object({
  id: z.string(),
  name: z.string(),
  light: ThemeColorTokensSchema,
  dark: ThemeColorTokensSchema,
  typography: z.object({
    sans: z.string().default("Geist, -apple-system, sans-serif"),
    serif: z.string().default("Newsreader, Source Serif 4, Georgia, serif"),
  }),
  radii: z.object({
    input: z.string().default("4px"),
    card: z.string().default("10px"),
    modal: z.string().default("16px"),
  }),
  isDefault: z.boolean().default(false),
});

export type ThemeTokens = z.infer<typeof ThemeTokensSchema>;
