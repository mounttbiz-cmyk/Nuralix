/* ============================================================================
   SCROLL
   Lenis for the feel, plus the per-scroll DOM choreography: caption fades,
   the vision word sequence, the progress bar and the nav state.
   ========================================================================== */
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { measureBeats, inv, smoothstep, clamp } from '../lib/story';
import { readScroll, snapStory, stepStory, syncCSSVars, pointer } from '../lib/engine';

const PREFERS_REDUCED = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function sectionProgress (sec) {
  if (!sec) return 0;
  const r = sec.getBoundingClientRect();
  return clamp(-r.top / Math.max(1, sec.offsetHeight - window.innerHeight), 0, 1);
}

export function useSmoothScroll ({ webgl }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const reduced = PREFERS_REDUCED();
    const fadeEls = [...document.querySelectorAll('[data-fade]')].map(el => ({
      el, sec: el.closest('section'), off: parseFloat(el.dataset.fadeOff || 0)
    }));
    const words = [...document.querySelectorAll('[data-word]')];
    const visionSec = document.querySelector('#vision');
    const bar = document.querySelector('.prog__bar');
    const nav = document.querySelector('.nav');

    function choreograph () {
      const p = readScroll();
      if (bar) bar.style.width = (p * 100).toFixed(2) + '%';
      if (nav) nav.classList.toggle('stuck', window.scrollY > 40);
      if (reduced) return;

      for (const f of fadeEls) {
        const sp = sectionProgress(f.sec) - f.off;
        const a = smoothstep(inv(0.04, 0.24, sp)) * (1 - smoothstep(inv(0.76, 0.97, sp)));
        f.el.style.opacity = a.toFixed(3);
        f.el.style.transform = `translate3d(0,${((1 - a) * 34).toFixed(1)}px,0) scale(${(0.985 + a * 0.015).toFixed(4)})`;
      }

      if (visionSec && words.length) {
        const vp = sectionProgress(visionSec), seg = 1 / words.length;
        words.forEach((w, i) => {
          const local = (vp - i * seg) / seg;
          let a = 0, y = 0, sc = 1;
          if (local > -0.85 && local < 1.85) {
            a = smoothstep(inv(-0.30, 0.16, local)) * (1 - smoothstep(inv(0.84, 1.30, local)));
            y = (0.5 - clamp(local, -0.4, 1.4)) * 70;
            sc = 0.94 + a * 0.06;
          }
          w.style.opacity = a.toFixed(3);
          w.style.transform = `translate3d(0,${y.toFixed(1)}px,0) scale(${sc.toFixed(3)})`;
          w.style.filter = a > 0.02 ? `blur(${((1 - a) * 9).toFixed(1)}px)` : 'blur(9px)';
        });
      }
    }

    let lenis = null;
    if (!reduced) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.6, lerp: 0.085 });
      lenis.on('scroll', choreograph);
      lenisRef.current = lenis;
    } else {
      window.addEventListener('scroll', choreograph, { passive: true });
    }

    /* One rAF owns Lenis, and — when there is no WebGL canvas to drive the
       story — the damping and CSS variable sync as well. */
    let raf = 0, last = performance.now();
    const loop = now => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.08, (now - last) / 1000); last = now;
      if (lenis) lenis.raf(now);
      if (!webgl) { stepStory(dt); syncCSSVars(); }
    };
    raf = requestAnimationFrame(loop);

    snapStory();
    choreograph();
    syncCSSVars(true);

    let rt;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => { measureBeats(); choreograph(); }, 180);
    };
    const onPointer = e => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onLoad = () => setTimeout(() => { measureBeats(); choreograph(); }, 200);

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('load', onLoad);
    const settle = setTimeout(() => { measureBeats(); choreograph(); }, 900);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rt); clearTimeout(settle);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('load', onLoad);
      if (lenis) lenis.destroy(); else window.removeEventListener('scroll', choreograph);
      lenisRef.current = null;
    };
  }, [webgl]);

  return lenisRef;
}

/** Smooth in-page navigation that respects Lenis when it is running. */
export function useAnchors (lenisRef, onNavigate) {
  useEffect(() => {
    const onClick = e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      onNavigate?.();
      if (lenisRef.current) lenisRef.current.scrollTo(t, { duration: 1.5 });
      else t.scrollIntoView({ behavior: PREFERS_REDUCED() ? 'auto' : 'smooth' });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [lenisRef, onNavigate]);
}

/** Reveal-on-enter for everything marked `.rv`. */
export function useReveals () {
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    document.querySelectorAll('.rv').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}
