/* ============================================================================
   SECTIONS — the written half of the experience.

   CONTENT NOTE
   Copy is built from what Nuralix publishes about itself. Anything not
   verifiable is marked as a placeholder rather than invented — see the
   `PLACEHOLDER` markers below and README.md.
   ========================================================================== */
import { useState } from 'react';
import { MagneticButton } from './Chrome';
import { applyFX, resetFX } from '../lib/engine';
import { DASHBOARD_URL } from '../config';

/* -- swap these for the real Nuralix details -------------------------------- */
export const CONTACT = {
  email: 'hello@nuralix.in',        // PLACEHOLDER — confirm the real inbox
  site: 'nuralix.in',
  linkedin: '',                     // PLACEHOLDER — paste the profile URL
  twitter: ''                       // PLACEHOLDER — paste the profile URL
};

const IS_TOUCH = () => typeof window !== 'undefined' && window.matchMedia('(hover:none), (pointer:coarse)').matches;

/* ------------------------------------------------------------------- hero */
export function Hero ({ ready }) {
  const word = 'NURALIX';
  return (
    <section id="hero" className="story" aria-label="Nuralix — Intelligence engineered for tomorrow">
      <div className="pin">
        <div className="wrap hero__inner">
          <p className={'eyebrow rv' + (ready ? ' in' : '')} data-d="1">Artificial Intelligence · Nuralix.in</p>

          <h1 className={'hero__mark' + (ready ? ' in' : '')} aria-label={word}>
            {[...word].map((ch, i) => (
              <span key={i} className="ch" aria-hidden="true" style={{ transitionDelay: `${0.3 + i * 0.055}s` }}>{ch}</span>
            ))}
          </h1>

          <p className={'hero__sub rv' + (ready ? ' in' : '')} data-d="4">
            Intelligence. <em>Engineered for Tomorrow.</em>
          </p>

          <div className={'hero__cta rv' + (ready ? ' in' : '')} data-d="5">
            <MagneticButton className="btn--solid btn--lg" href="#s01">
              <span>Explore Nuralix</span><span className="btn__ar" aria-hidden="true">→</span>
            </MagneticButton>
            <MagneticButton className="btn--lg" href="#s03"><span>Discover Our Intelligence</span></MagneticButton>
          </div>
        </div>

        <div className="scroll-ind" aria-hidden="true">
          <span>Scroll to enter</span><span className="scroll-ind__line" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ cinematic captions */
function Beat ({ id, height, label, align = 'center', modifier = '', children }) {
  const beatClass = ['beat', align === 'center' ? 'beat--c' : '', modifier, 'fade'].filter(Boolean).join(' ');
  const style = align === 'right' ? { marginLeft: 'auto', textAlign: 'right' } : undefined;
  return (
    <section id={id} className="story" style={{ height }} aria-label={label}>
      <div className="pin">
        <div className="wrap">
          <div className={beatClass} data-fade style={style}>{children}</div>
        </div>
      </div>
    </section>
  );
}

export const SceneAwakening = () => (
  <Beat id="s01" height="170svh" label="Awakening">
    <p className="eyebrow" style={{ justifyContent: 'center' }}>Scene 01 — Awakening</p>
    <h2 className="h-xl">Every breakthrough<br />begins with a signal.</h2>
  </Beat>
);

export const SceneConnection = () => (
  <Beat id="s02" height="190svh" label="Connection" align="left">
    <p className="eyebrow">Scene 02 — Connection</p>
    <h2 className="h-xl">We connect data,<br />intelligence and<br />possibility.</h2>
  </Beat>
);

const FLOATERS = [
  ['Signal', '1,204', 'pathways active', 0.10],
  ['Inference', '0.8ms', 'mean latency', 0.14],
  ['Structure', null, 'self-organising graph', 0.12],
  ['Context', null, 'continuously learning', 0.16]
];

export const SceneIntelligence = () => (
  <section id="s03" className="story" style={{ height: '205svh' }} aria-label="Intelligence">
    <div className="pin">
      <div className="floaters" aria-hidden="true">
        {FLOATERS.map(([title, val, tail, off]) => (
          <div className="floater fade" key={title} data-fade data-fade-off={off}>
            <b>{title}</b>{val && <i>{val}</i>}{val ? ' ' : ''}{tail}
          </div>
        ))}
      </div>
      <div className="wrap">
        <div className="beat beat--c fade" data-fade>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>Scene 03 — Intelligence</p>
          <h2 className="h-xl">Turning complexity<br />into intelligence.</h2>
        </div>
      </div>
    </div>
  </section>
);

export const SceneNuralix = () => (
  <Beat id="s04" height="175svh" label="This is Nuralix" modifier="beat--n">
    <h2 className="h-xl" style={{ fontWeight: 500 }}>This is Nuralix.</h2>
    <p className="lead" style={{ margin: '26px auto 0', textAlign: 'center' }}>
      Building intelligent systems for a rapidly evolving world.
    </p>
  </Beat>
);

export const SceneExpansion = () => (
  <Beat id="s05" height="160svh" label="Expansion">
    <p className="eyebrow" style={{ justifyContent: 'center' }}>Scene 05 — Expansion</p>
    <h2 className="h-xl">One intelligence.<br />Infinite possibilities.</h2>
  </Beat>
);

export const SceneHuman = () => (
  <Beat id="s06" height="190svh" label="Human and AI" align="right">
    <p className="eyebrow" style={{ justifyContent: 'flex-end' }}>Scene 06 — Human + AI</p>
    <h2 className="h-xl">AI doesn&rsquo;t replace<br />possibility.<br />It expands it.</h2>
    <p className="lead" style={{ margin: '26px 0 0 auto' }}>
      Technology should amplify human potential — not stand in for it.
    </p>
  </Beat>
);

export const SceneFuture = () => (
  <section id="s07" className="story" style={{ height: '180svh' }} aria-label="The future">
    <div className="pin">
      <div className="wrap">
        <div className="beat beat--c fade" data-fade>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>Scene 07 — Future</p>
          <h2 className="h-xl">The future isn&rsquo;t coming.<br />We&rsquo;re engineering it.</h2>
          <div className="hero__cta" style={{ marginTop: 40 }}>
            <MagneticButton className="btn--solid btn--lg" href={DASHBOARD_URL}>
              <span>Build the Future with Nuralix</span><span className="btn__ar" aria-hidden="true">→</span>
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ about */
const APPROACH = [
  ['Understand the problem', '01'], ['Model the intelligence', '02'],
  ['Engineer the system', '03'], ['Scale what works', '04']
];

export const About = () => (
  <section id="about" aria-labelledby="about-h">
    <div className="wrap">
      <p className="eyebrow rv">About Nuralix</p>
      <h2 className="h-xl rv" id="about-h">We build intelligence that moves the world forward.</h2>
      <div className="rule rv" />
      <div className="about__grid">
        <div className="about__cols">
          <p className="lead rv" data-d="1">
            Nuralix uses artificial intelligence to automate tasks, analyse data, and help businesses
            make smarter, faster decisions for growth.
          </p>
          <p className="lead rv" data-d="2">
            We work at the point where information becomes understanding — designing systems that read
            complexity, find the signal inside it, and turn that signal into a decision a business can
            act on today.
          </p>
        </div>
        <div className="rv" data-d="3">
          <p className="small" style={{ letterSpacing: '.24em', textTransform: 'uppercase', fontSize: 10.5, color: 'var(--ink-faint)' }}>
            Our approach
          </p>
          <div className="clist" style={{ marginTop: 20 }}>
            {APPROACH.map(([label, n]) => (
              <div className="crow" key={n}><span className="crow__v">{label}</span><span className="crow__k">{n}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* -------------------------------------------------------------- solutions */
const GLYPHS = {
  ai: <><circle cx="50" cy="50" r="8" /><circle cx="20" cy="24" r="4" /><circle cx="82" cy="30" r="4" /><circle cx="26" cy="78" r="4" /><circle cx="76" cy="76" r="4" /><path d="M50 50 20 24M50 50 82 30M50 50 26 78M50 50 76 76M20 24 82 30M26 78 76 76" /></>,
  auto: <><rect x="14" y="14" width="26" height="26" rx="4" /><rect x="60" y="14" width="26" height="26" rx="4" /><rect x="14" y="60" width="26" height="26" rx="4" /><rect x="60" y="60" width="26" height="26" rx="4" /><path d="M40 27h20M27 40v20M73 40v20M40 73h20" /></>,
  data: <><path d="M12 78 34 52l18 14 22-38" /><path d="M12 88h76" /><circle cx="34" cy="52" r="3.5" /><circle cx="52" cy="66" r="3.5" /><circle cx="74" cy="28" r="3.5" /></>,
  digital: <><rect x="12" y="20" width="76" height="52" rx="6" /><path d="M12 36h76M34 84h32" /><circle cx="24" cy="28" r="2.5" /><circle cx="34" cy="28" r="2.5" /></>,
  custom: <><path d="M50 10 86 30v40L50 90 14 70V30z" /><path d="M50 32 68 42v20L50 72 32 62V42z" /><circle cx="50" cy="52" r="5" /></>
};

const CARDS = [
  ['01', 'ai', 'AI & Machine Intelligence', 'Systems that transform complex information into actionable intelligence.'],
  ['02', 'auto', 'Intelligent Automation', 'Smarter workflows designed to reduce friction and increase scale.'],
  ['03', 'data', 'Data & Analytics', 'Turning data into clarity, prediction and strategic advantage.'],
  ['04', 'digital', 'Digital Intelligence', 'Building intelligent digital experiences for modern organisations.'],
  ['05', 'custom', 'Custom AI Systems', 'Purpose-built intelligence designed around specific business challenges.']
];

function Card ({ n, fx, title, desc, delay }) {
  const onMove = e => {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    el.style.setProperty('--mx', x + 'px');
    el.style.setProperty('--my', y + 'px');
    if (IS_TOUCH()) return;
    el.style.transform = `perspective(1000px) rotateX(${(0.5 - y / r.height) * 9}deg) rotateY(${(x / r.width - 0.5) * 11}deg) translateY(-4px)`;
  };
  const leave = e => { e.currentTarget.style.transform = ''; resetFX(); };
  return (
    <article
      className="card rv" data-d={delay} tabIndex={0}
      onPointerMove={onMove}
      onPointerEnter={() => applyFX(fx)}
      onFocus={() => applyFX(fx)}
      onPointerLeave={leave}
      onBlur={resetFX}
    >
      <div className="card__n">{n}</div>
      <div className="card__b">
        <h3 className="card__t">{title}</h3>
        <p className="card__d">{desc}</p>
      </div>
      <svg className="card__glyph" viewBox="0 0 100 100" aria-hidden="true">{GLYPHS[fx]}</svg>
    </article>
  );
}

export const Solutions = () => (
  <section id="solutions" aria-labelledby="sol-h">
    <div className="wrap">
      <div className="sol__head">
        <div>
          <p className="eyebrow rv">Solutions</p>
          <h2 className="h-l rv" id="sol-h" data-d="1">Capabilities, engineered.</h2>
        </div>
        <p className="small rv" data-d="2" style={{ maxWidth: '34ch' }}>
          Each capability is a system, not a feature — built around the problem it is meant to solve.
        </p>
      </div>
      <div className="cards">
        {CARDS.map(([n, fx, title, desc], i) => (
          <Card key={n} n={n} fx={fx} title={title} desc={desc} delay={i + 1} />
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ stats */
const STATS = [['01', 'Intelligence'], ['∞', 'Possibilities'], ['24/7', 'Designed to think'], ['01', 'Vision']];

export const Stats = () => (
  <section id="stats" aria-label="Impact">
    <div className="wrap">
      <div className="stats">
        {STATS.map(([n, l], i) => (
          <div className="rv" key={l} data-d={i || undefined}>
            <div className="stat__n">{n}</div>
            <div className="stat__l">{l}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ----------------------------------------------------------------- vision */
const WORDS = ['Understand.', 'Predict.', 'Adapt.', 'Create.', 'Evolve.', 'Nuralix.'];

export const Vision = () => (
  <section id="vision" aria-labelledby="vision-h">
    <div className="pin">
      <div className="wrap" style={{ position: 'relative', height: '100%' }}>
        <p className="vision__label" id="vision-h">The next interface is intelligence</p>
        {WORDS.map((w, i) => (
          <div className={'vision__word' + (i === WORDS.length - 1 ? ' is-final' : '')} key={w} data-word>{w}</div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------------------------------------------------------- contact */
export function Contact () {
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('Enter your email to begin your executive onboarding.');
  const [alert, setAlert] = useState(false);

  const submit = e => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setNote('Please enter a valid business email address.'); setAlert(true); return;
    }
    window.location.href = `${DASHBOARD_URL}?email=${encodeURIComponent(email.trim())}`;
  };

  const social = (label, url) => url
    ? <a className="crow" key={label} href={url} target="_blank" rel="noopener"><span className="crow__v">{label}</span><span className="crow__k">Social</span></a>
    : <span className="crow" key={label}><span className="crow__v">{label} <span className="ph">add link</span></span><span className="crow__k">Social</span></span>;

  return (
    <section id="contact" aria-labelledby="contact-h">
      <div className="wrap">
        <div className="contact__grid">
          <div>
            <p className="eyebrow rv">Start with Nuralix</p>
            <h2 className="h-xl rv" id="contact-h" data-d="1">Ready to build<br />what&rsquo;s next?</h2>
            <form className="field rv" data-d="2" onSubmit={submit} noValidate>
              <label htmlFor="email" style={{ position: 'absolute', left: -9999 }}>Your email address</label>
              <input
                id="email" type="email" name="email" placeholder="founder@company.com"
                autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required
              />
              <button type="submit" aria-label="Start with Nuralix">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h13M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
            <p className="small rv" data-d="3" style={{ marginTop: 14, fontSize: 12.5, color: alert ? '#f87171' : 'var(--ink-faint)' }}>
              {note}
            </p>
            <div className="rv" data-d="4" style={{ marginTop: 20 }}>
              <MagneticButton className="btn--solid btn--lg" href={DASHBOARD_URL}>
                <span>Start with Nuralix</span><span className="btn__ar" aria-hidden="true">→</span>
              </MagneticButton>
            </div>
          </div>

          <div className="rv" data-d="2">
            <p className="small" style={{ letterSpacing: '.24em', textTransform: 'uppercase', fontSize: 10.5, color: 'var(--ink-faint)', marginBottom: 20 }}>
              Direct
            </p>
            <div className="clist">
              <a className="crow" href={`mailto:${CONTACT.email}`}><span className="crow__v">{CONTACT.email}</span><span className="crow__k">Email</span></a>
              <a className="crow" href={`https://${CONTACT.site}`} target="_blank" rel="noopener"><span className="crow__v">{CONTACT.site}</span><span className="crow__k">Website</span></a>
              {social('LinkedIn', CONTACT.linkedin)}
              {social('X / Twitter', CONTACT.twitter)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const Footer = () => (
  <footer>
    <div className="wrap foot">
      <span>© {new Date().getFullYear()} Nuralix</span>
      <span>Nuralix — Intelligence in Motion</span>
      <a href="#hero">Back to top ↑</a>
    </div>
  </footer>
);
