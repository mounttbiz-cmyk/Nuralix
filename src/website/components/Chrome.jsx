/* ============================================================================
   CHROME — preloader, cursor, nav, menu, progress, grain
   ========================================================================== */
import { useEffect, useRef, useState } from 'react';
import { DASHBOARD_URL } from '../config';

const IS_TOUCH = () => typeof window !== 'undefined' && window.matchMedia('(hover:none), (pointer:coarse)').matches;

export function Preloader ({ done }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let raf, start = performance.now();
    const step = now => {
      const t = Math.min(1, (now - start) / 1400);
      setPct(Math.round((done ? 1 : t * 0.92) * 100));
      if (!done || t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [done]);

  return (
    <div className={'pre' + (done ? ' done' : '')} role="status" aria-live="polite">
      <div className="pre__word">NURALIX</div>
      <div className="pre__track"><span className="pre__fill" style={{ width: pct + '%' }} /></div>
      <div className="pre__pct">{String(pct).padStart(2, '0')}</div>
    </div>
  );
}

export function Cursor () {
  const ring = useRef(), dot = useRef(), glow = useRef();
  useEffect(() => {
    if (IS_TOUCH()) return;
    let mx = innerWidth / 2, my = innerHeight / 2;
    const p = [{ x: mx, y: my }, { x: mx, y: my }, { x: mx, y: my }];
    const move = e => { mx = e.clientX; my = e.clientY; };
    addEventListener('pointermove', move, { passive: true });

    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const els = [ring.current, dot.current, glow.current];
      const ease = [0.16, 0.55, 0.07];
      els.forEach((el, i) => {
        if (!el) return;
        p[i].x += (mx - p[i].x) * ease[i];
        p[i].y += (my - p[i].y) * ease[i];
        el.style.transform = `translate3d(${p[i].x}px,${p[i].y}px,0)`;
      });
    };
    raf = requestAnimationFrame(loop);

    const on = () => document.body.classList.add('is-hover');
    const off = () => document.body.classList.remove('is-hover');
    const targets = [...document.querySelectorAll('a, button, .card, input')];
    targets.forEach(el => { el.addEventListener('pointerenter', on); el.addEventListener('pointerleave', off); });

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', move);
      targets.forEach(el => { el.removeEventListener('pointerenter', on); el.removeEventListener('pointerleave', off); });
    };
  }, []);

  return (
    <>
      <div className="cur__glow" ref={glow} aria-hidden="true" />
      <div className="cur" ref={ring} aria-hidden="true"><div className="cur__ring" /></div>
      <div className="cur" ref={dot} aria-hidden="true"><div className="cur__dot" /></div>
    </>
  );
}

export function MagneticButton ({ as: Tag = 'a', className = '', children, ...rest }) {
  const ref = useRef();
  const onMove = e => {
    const el = ref.current; if (!el || IS_TOUCH()) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    el.style.setProperty('--mx', x + 'px');
    el.style.setProperty('--my', y + 'px');
    el.style.transform = `translate(${(x / r.width - 0.5) * 12}px, ${(y / r.height - 0.5) * 8}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ''; };
  return (
    <Tag ref={ref} className={'btn ' + className} onPointerMove={onMove} onPointerLeave={onLeave} {...rest}>
      {children}
    </Tag>
  );
}

const LINKS = [
  ['About', '#about'], ['Intelligence', '#s03'], ['Solutions', '#solutions'],
  ['Vision', '#vision'], ['Contact', '#contact']
];

export function Nav ({ menuOpen, setMenuOpen }) {
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    const esc = e => { if (e.key === 'Escape') setMenuOpen(false); };
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [menuOpen, setMenuOpen]);

  return (
    <>
      <header className="nav">
        <a className="brand" href="#hero" aria-label="Nuralix home">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 19V5l14 14V5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          NURALIX
        </a>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map(([label, href]) => (
            <a key={href} className="nav__link" href={href}>{label}</a>
          ))}
        </nav>

        <div className="nav__right">
          <MagneticButton className="btn--nav" href={DASHBOARD_URL}>
            <span>Start with Nuralix</span><span className="btn__ar" aria-hidden="true">→</span>
          </MagneticButton>
          <button
            className="burger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="menu"
            onClick={() => setMenuOpen(v => !v)}
          ><i /><i /></button>
        </div>
      </header>

      <div className="menu" id="menu" aria-hidden={!menuOpen}>
        {LINKS.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        <a href={DASHBOARD_URL} className="menu__cta">
          <span>Start with Nuralix</span> <span aria-hidden="true">→</span>
        </a>
        <div className="menu__meta">Nuralix — Intelligence in Motion</div>
      </div>
    </>
  );
}

export const Progress = () => (
  <div className="prog" aria-hidden="true"><div className="prog__bar" /></div>
);

export const Atmosphere = () => (
  <>
    <div id="bg-fallback" aria-hidden="true" />
    <div className="vignette" aria-hidden="true" />
    <div className="grain" aria-hidden="true" />
  </>
);
