"use client";

/* ============================================================================
   NURALIX — INTELLIGENCE IN MOTION
   ========================================================================== */
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import './styles.css';
import { useSmoothScroll, useAnchors, useReveals } from './scroll/useScroll';
import { Preloader, Cursor, Nav, Progress, Atmosphere } from './components/Chrome';
import {
  Hero, SceneAwakening, SceneConnection, SceneIntelligence, SceneNuralix,
  About, SceneExpansion, Solutions, Stats, SceneHuman, Vision, SceneFuture,
  Contact, Footer
} from './components/Sections';

/* The WebGL bundle is heavy — split it out so the readable page paints first. */
const Experience = lazy(() => import('./three/Experience'));

function detect () {
  if (typeof window === 'undefined') return { webgl: false, reduced: false, low: false };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let webgl = false;
  try {
    const c = document.createElement('canvas');
    webgl = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { webgl = false; }
  return { webgl: webgl && !reduced, reduced, low: window.innerWidth < 820 };
}

export default function App () {
  const [env] = useState(detect);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const lenis = useSmoothScroll({ webgl: env.webgl });
  useAnchors(lenis, useCallback(() => setMenuOpen(false), []));
  useReveals();

  useEffect(() => {
    const root = document.documentElement;
    if (!env.webgl) root.classList.add('no-webgl');
    if (env.reduced) root.classList.add('reduced');
    let done = false;
    const finish = () => { if (!done) { done = true; setReady(true); } };
    document.fonts?.ready.then(() => setTimeout(finish, 400)).catch(finish);
    const safety = setTimeout(finish, 3200);
    return () => clearTimeout(safety);
  }, [env]);

  useEffect(() => {
    if (menuOpen) lenis.current?.stop(); else lenis.current?.start();
  }, [menuOpen, lenis]);

  return (
    <>
      <Atmosphere />
      {env.webgl && (
        <Suspense fallback={null}>
          <Experience quality={env.low ? 'low' : 'high'} />
        </Suspense>
      )}
      <Cursor />
      <Progress />
      <Preloader done={ready} />

      <a href="#hero" className="btn skip">
        <span>Skip to content</span>
      </a>

      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main>
        <Hero ready={ready} />
        <SceneAwakening />
        <SceneConnection />
        <SceneIntelligence />
        <SceneNuralix />
        <About />
        <SceneExpansion />
        <Solutions />
        <Stats />
        <SceneHuman />
        <Vision />
        <SceneFuture />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
