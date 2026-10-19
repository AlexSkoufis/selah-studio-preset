'use client';

import { useEffect, useState } from 'react';
import { nav, studio } from '@/lib/content';
import { scrollToTarget } from './SmoothScroll';

/** The studio's mark: a single arch, like the doorways in the room. */
export function Mark({ className = '' }: { className?: string }) {
  return (
    <svg className={`mark ${className}`} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M9 27V15a7 7 0 0 1 14 0v12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M5 27h22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export const go = (href: string, after?: () => void) => (e: React.MouseEvent) => {
  e.preventDefault();
  after?.();
  scrollToTarget(href, { offset: -70 });
};

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.documentElement.classList.add('menu-open');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('menu-open');
    };
  }, [open]);

  return (
    <header className={`nav${solid ? ' is-solid' : ''}${open ? ' is-open' : ''}`}>
      <div className="nav__bar">
        <a href="#top" className="nav__brand" onClick={(e) => (e.preventDefault(), setOpen(false), scrollToTarget(0))} aria-label={`${studio.name} — back to top`}>
          <Mark />
          <span>{studio.name}</span>
        </a>
        <nav className="nav__links" aria-label="Main">
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={go(n.href)}>
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#timetable" className="btn btn--ink btn--sm nav__cta" onClick={go('#timetable')}>
          Book a class
        </a>
        <button type="button" className="nav__menu" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
          <span className="sr">Menu</span>
          <i />
          <i />
        </button>
      </div>
      <div id="menu" className="menu" hidden={!open}>
        <nav aria-label="Mobile">
          {nav.map((n, i) => (
            <a key={n.href} href={n.href} onClick={go(n.href, () => setOpen(false))} style={{ ['--i' as string]: i }}>
              {n.label}
            </a>
          ))}
        </nav>
        <p>
          {studio.address.join(', ')}
          <br />
          <a href={studio.phoneHref}>{studio.phone}</a>
        </p>
      </div>
    </header>
  );
}
