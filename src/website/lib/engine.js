/* ============================================================================
   ENGINE
   One mutable frame state shared between the scroll layer, the DOM
   choreography and the WebGL scene. Deliberately outside React: this updates
   every frame and must never trigger a re-render.
   ========================================================================== */
import { makeStoryState, sampleStory, measureBeats, clamp } from './story';

export const target  = makeStoryState();
export const current = makeStoryState();

export const scroll  = { p: 0, max: 1 };
export const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

/** Hover-driven reactions from the capability cards. */
export const fx = {
  energy: 0, energyT: 0,
  driftMul: 1, driftMulT: 1,
  lineMul: 1, lineMulT: 1,
  sizeMul: 1, sizeMulT: 1,
  coreMul: 1, coreMulT: 1
};

export const FX_MAP = {
  ai:      { energy: 0.85, line: 1.9, drift: 0.9,  size: 1.05, core: 1.15 },
  auto:    { energy: 0.35, line: 1.3, drift: 0.18, size: 1.00, core: 1.00 },
  data:    { energy: 0.55, line: 0.8, drift: 2.3,  size: 1.15, core: 0.90 },
  digital: { energy: 0.50, line: 1.1, drift: 0.7,  size: 1.45, core: 1.00 },
  custom:  { energy: 0.70, line: 1.0, drift: 0.5,  size: 1.00, core: 1.90 }
};

export function applyFX (key) {
  const f = FX_MAP[key]; if (!f) return;
  fx.energyT = f.energy; fx.lineMulT = f.line; fx.driftMulT = f.drift;
  fx.sizeMulT = f.size; fx.coreMulT = f.core;
}
export function resetFX () {
  fx.energyT = 0; fx.lineMulT = 1; fx.driftMulT = 1; fx.sizeMulT = 1; fx.coreMulT = 1;
}

export function readScroll () {
  scroll.max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  scroll.p = clamp(window.scrollY / scroll.max, 0, 1);
  sampleStory(scroll.p, target);
  return scroll.p;
}

/** Critically-damped catch-up. Frame-rate independent. */
export function stepStory (dt) {
  const k = 1 - Math.exp(-4.6 * dt);
  const kf = 1 - Math.exp(-7.5 * dt);

  pointer.x += (pointer.tx - pointer.x) * kf;
  pointer.y += (pointer.ty - pointer.y) * kf;

  fx.energy   += (fx.energyT - fx.energy) * kf;
  fx.driftMul += (fx.driftMulT - fx.driftMul) * kf;
  fx.lineMul  += (fx.lineMulT - fx.lineMul) * kf;
  fx.sizeMul  += (fx.sizeMulT - fx.sizeMul) * kf;
  fx.coreMul  += (fx.coreMulT - fx.coreMul) * kf;

  current.cam.lerp(target.cam, k);
  current.look.lerp(target.look, k);
  for (const key of ['morph', 'lines', 'core', 'size', 'drift', 'fogN', 'fogF', 'gstr'])
    current[key] += (target[key] - current[key]) * k;
  current.top.lerp(target.top, k);
  current.bot.lerp(target.bot, k);
  current.glow.lerp(target.glow, k);
  current.accent.lerp(target.accent, k);
  current.accent2.lerp(target.accent2, k);
}

/** Snap with no transition — used once on boot so the page never flies in. */
export function snapStory () {
  measureBeats();
  readScroll();
  current.cam.copy(target.cam); current.look.copy(target.look);
  for (const key of ['morph', 'lines', 'core', 'size', 'drift', 'fogN', 'fogF', 'gstr'])
    current[key] = target[key];
  current.top.copy(target.top); current.bot.copy(target.bot); current.glow.copy(target.glow);
  current.accent.copy(target.accent); current.accent2.copy(target.accent2);
}

let tick = 0;
let prevBgA = '', prevBgB = '', prevAcc = '', prevAcc2 = '';

export function syncCSSVars (force = false) {
  if (!force && ++tick % 4 !== 0) return;
  const bgA = '#' + current.bot.getHexString();
  const bgB = '#' + current.top.getHexString();
  const acc = '#' + current.accent.getHexString();
  const acc2 = '#' + current.accent2.getHexString();

  if (!force && bgA === prevBgA && bgB === prevBgB && acc === prevAcc && acc2 === prevAcc2) {
    return;
  }

  const r = document.documentElement.style;
  if (force || bgA !== prevBgA) { r.setProperty('--bg-a', bgA); prevBgA = bgA; }
  if (force || bgB !== prevBgB) { r.setProperty('--bg-b', bgB); prevBgB = bgB; }
  if (force || acc !== prevAcc) { r.setProperty('--accent', acc); prevAcc = acc; }
  if (force || acc2 !== prevAcc2) { r.setProperty('--accent-2', acc2); prevAcc2 = acc2; }
}
