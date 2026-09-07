/* ============================================================================
   THE STORY
   Every beat is anchored to a real DOM section, so the cinematic timeline
   re-derives itself whenever content length or the viewport changes.

   at    0 = section top hits viewport top · 1 = section bottom hits bottom
   morph 0 SPARSE · 1 NET · 2 N · 3 WIDE · 4 HUMAN · 5 TUNNEL · 6 UNIVERSE
   ========================================================================== */
import { Color, Vector3 } from 'three';

export const BEATS = [
  { el: '#hero', at: 0.00, cam: [0, 0, 70], look: [0, 0, 0], morph: 1.00, lines: 0.45, core: 0.80, size: 1.00, drift: 0.55, fog: [60, 210],
    top: '#0B1020', bot: '#05060A', glow: '#0E4E8C', accent: '#00D9FF', accent2: '#6C5CE7', gstr: 0.34 },

  { el: '#hero', at: 0.95, cam: [2, 3, 50], look: [0, 0, 0], morph: 1.05, lines: 0.55, core: 0.85, size: 1.00, drift: 0.55, fog: [50, 190],
    top: '#0B1020', bot: '#05060A', glow: '#0E5FA8', accent: '#00D9FF', accent2: '#6C5CE7', gstr: 0.38 },

  { el: '#s01', at: 0.45, cam: [8, -4, 22], look: [0, 0, 0], morph: 0.00, lines: 0.10, core: 0.22, size: 1.15, drift: 0.30, fog: [30, 150],
    top: '#070A14', bot: '#04050A', glow: '#0A2E55', accent: '#00D9FF', accent2: '#3E7BFF', gstr: 0.19 },

  { el: '#s02', at: 0.30, cam: [0, 0, 26], look: [0, 0, -14], morph: 0.85, lines: 0.70, core: 0.14, size: 1.02, drift: 0.60, fog: [24, 150],
    top: '#0A1226', bot: '#05070F', glow: '#1156A8', accent: '#00D9FF', accent2: '#5B8CFF', gstr: 0.37 },

  { el: '#s02', at: 0.80, cam: [0, 2, 2], look: [2, 0, -34], morph: 1.00, lines: 0.95, core: 0.10, size: 0.95, drift: 0.70, fog: [16, 120],
    top: '#0C1630', bot: '#05070F', glow: '#1668C9', accent: '#22E0FF', accent2: '#6C5CE7', gstr: 0.46 },

  { el: '#s03', at: 0.35, cam: [-18, 7, 34], look: [0, 0, 0], morph: 1.10, lines: 0.90, core: 0.30, size: 1.05, drift: 0.55, fog: [26, 180],
    top: '#170F38', bot: '#07050F', glow: '#5A3BD4', accent: '#8B5CF6', accent2: '#00D9FF', gstr: 0.45 },

  { el: '#s03', at: 0.85, cam: [10, -5, 44], look: [0, 0, 0], morph: 1.45, lines: 0.80, core: 0.55, size: 1.05, drift: 0.42, fog: [30, 190],
    top: '#141043', bot: '#06060E', glow: '#6C5CE7', accent: '#8B5CF6', accent2: '#00D9FF', gstr: 0.50 },

  { el: '#s04', at: 0.45, cam: [0, -1, 55], look: [0, -3, 0], morph: 2.00, lines: 0.62, core: 0.42, size: 0.82, drift: 0.10, fog: [34, 200],
    top: '#0D1B3D', bot: '#050810', glow: '#1D8BE8', accent: '#00D9FF', accent2: '#8B5CF6', gstr: 0.62 },

  { el: '#about', at: 0.50, cam: [22, 8, 64], look: [-2, 0, 0], morph: 2.00, lines: 0.42, core: 0.60, size: 0.95, drift: 0.22, fog: [40, 210],
    top: '#101420', bot: '#05060A', glow: '#15507F', accent: '#00D9FF', accent2: '#6C5CE7', gstr: 0.34 },

  { el: '#s05', at: 0.50, cam: [0, 10, 104], look: [0, 0, -6], morph: 3.00, lines: 0.50, core: 0.45, size: 1.10, drift: 0.45, fog: [60, 300],
    top: '#0F141C', bot: '#04050A', glow: '#1B6FD6', accent: '#3EA9FF', accent2: '#00D9FF', gstr: 0.38 },

  { el: '#solutions', at: 0.50, cam: [-8, 6, 96], look: [2, 0, -6], morph: 3.00, lines: 0.55, core: 0.40, size: 1.05, drift: 0.45, fog: [60, 300],
    top: '#0E131C', bot: '#04050A', glow: '#1E7ADD', accent: '#3EA9FF', accent2: '#00D9FF', gstr: 0.37 },

  { el: '#stats', at: 0.50, cam: [6, 2, 88], look: [0, 0, -6], morph: 3.00, lines: 0.45, core: 0.55, size: 1.00, drift: 0.40, fog: [56, 280],
    top: '#0C1119', bot: '#04050A', glow: '#1A63B8', accent: '#00D9FF', accent2: '#6C5CE7', gstr: 0.34 },

  { el: '#s06', at: 0.45, cam: [-15, 0, 58], look: [7, -1, 0], morph: 4.00, lines: 0.22, core: 0.26, size: 0.76, drift: 0.08, fog: [34, 220],
    top: '#1A1224', bot: '#0A0508', glow: '#7A4BC4', accent: '#8B5CF6', accent2: '#FF9BD2', gstr: 0.41 },

  { el: '#vision', at: 0.08, cam: [0, 0, 34], look: [0, 0, -60], morph: 5.00, lines: 0.28, core: 0.25, size: 1.05, drift: 0.40, fog: [40, 260],
    top: '#080B16', bot: '#03040A', glow: '#0F5FB8', accent: '#00D9FF', accent2: '#6C5CE7', gstr: 0.36 },

  { el: '#vision', at: 0.55, cam: [0, 0, -92], look: [0, 0, -190], morph: 5.00, lines: 0.32, core: 0.20, size: 1.05, drift: 0.45, fog: [40, 260],
    top: '#0A0F24', bot: '#03040A', glow: '#2A6FE0', accent: '#3EA9FF', accent2: '#8B5CF6', gstr: 0.43 },

  { el: '#vision', at: 0.97, cam: [0, 14, -190], look: [0, -4, -300], morph: 5.00, lines: 0.30, core: 0.55, size: 1.05, drift: 0.40, fog: [44, 280],
    top: '#0C1230', bot: '#04050C', glow: '#3F86FF', accent: '#00D9FF', accent2: '#8B5CF6', gstr: 0.53 },

  { el: '#s07', at: 0.55, cam: [0, 72, 148], look: [0, -8, -46], morph: 6.00, lines: 0.10, core: 0.30, size: 2.40, drift: 0.55, fog: [90, 430],
    top: '#111A33', bot: '#03040A', glow: '#4C9BFF', accent: '#7FE7FF', accent2: '#FFFFFF', gstr: 0.62 },

  { el: '#contact', at: 0.35, cam: [0, 0, 66], look: [0, 0, 0], morph: 2.00, lines: 0.40, core: 1.25, size: 0.90, drift: 0.18, fog: [36, 200],
    top: '#08101F', bot: '#03040A', glow: '#118FE0', accent: '#00D9FF', accent2: '#6C5CE7', gstr: 0.59 },

  { el: '#contact', at: 1.00, cam: [0, 0, 54], look: [0, 0, 0], morph: 2.00, lines: 0.30, core: 1.75, size: 0.80, drift: 0.14, fog: [30, 180],
    top: '#060C18', bot: '#03040A', glow: '#0D7FCC', accent: '#00D9FF', accent2: '#6C5CE7', gstr: 0.65 }
];

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const inv = (a, b, v) => (b === a ? 0 : clamp((v - a) / (b - a), 0, 1));
export const smoothstep = t => t * t * (3 - 2 * t);

let beatPos = [];

export function measureBeats () {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const vh = window.innerHeight;
  beatPos = BEATS.map(b => {
    const el = document.querySelector(b.el);
    if (!el) return 0;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const end = Math.max(top, top + el.offsetHeight - vh);
    return clamp(lerp(top, end, b.at) / max, 0, 1);
  });
  for (let i = 1; i < beatPos.length; i++)
    if (beatPos[i] <= beatPos[i - 1]) beatPos[i] = Math.min(1, beatPos[i - 1] + 0.0015);
  return beatPos;
}

export const makeStoryState = () => ({
  cam: new Vector3(0, 0, 70), look: new Vector3(),
  morph: 1, lines: 0.45, core: 0.8, size: 1, drift: 0.55, fogN: 60, fogF: 210, gstr: 0.34,
  top: new Color('#0B1020'), bot: new Color('#05060A'), glow: new Color('#0E4E8C'),
  accent: new Color('#00D9FF'), accent2: new Color('#6C5CE7')
});

const _a = new Color(), _b = new Color();

/** Write the interpolated story state for scroll position `p` into `out`. */
export function sampleStory (p, out) {
  let i = 0;
  while (i < beatPos.length - 2 && p > beatPos[i + 1]) i++;
  const j = Math.min(i + 1, BEATS.length - 1);
  const a = BEATS[i], b = BEATS[j];
  const e = smoothstep(inv(beatPos[i], beatPos[j], p));

  out.cam.set(lerp(a.cam[0], b.cam[0], e), lerp(a.cam[1], b.cam[1], e), lerp(a.cam[2], b.cam[2], e));
  out.look.set(lerp(a.look[0], b.look[0], e), lerp(a.look[1], b.look[1], e), lerp(a.look[2], b.look[2], e));
  out.morph = lerp(a.morph, b.morph, e);
  out.lines = lerp(a.lines, b.lines, e);
  out.core  = lerp(a.core, b.core, e);
  out.size  = lerp(a.size, b.size, e);
  out.drift = lerp(a.drift, b.drift, e);
  out.fogN  = lerp(a.fog[0], b.fog[0], e);
  out.fogF  = lerp(a.fog[1], b.fog[1], e);
  out.gstr  = lerp(a.gstr, b.gstr, e);
  out.top.lerpColors(_a.set(a.top), _b.set(b.top), e);
  out.bot.lerpColors(_a.set(a.bot), _b.set(b.bot), e);
  out.glow.lerpColors(_a.set(a.glow), _b.set(b.glow), e);
  out.accent.lerpColors(_a.set(a.accent), _b.set(b.accent), e);
  out.accent2.lerpColors(_a.set(a.accent2), _b.set(b.accent2), e);
  return out;
}
