'use client';

import { useRef } from 'react';
import { nav, studio } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { go, Mark } from './Nav';

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.fromTo('.ft__mark', { yPercent: 35 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 } });
    });
  });

  return (
    <footer ref={root} className="ft">
      <div className="ft__top wrap">
        <div className="ft__brand">
          <Mark />
          <p>
            {studio.line}
            <br />
            {studio.area}
          </p>
        </div>
        <nav className="ft__nav" aria-label="Footer">
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={go(n.href)}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="ft__contact">
          <a href={`mailto:${studio.email}`}>{studio.email}</a>
          <a href={studio.phoneHref}>{studio.phone}</a>
          <span>Instagram {studio.instagram}</span>
        </div>
      </div>
      <p className="ft__mark" aria-hidden="true">
        {studio.name}
      </p>
      <div className="ft__legal wrap">
        <p>{studio.disclaimer}</p>
        <p>
          © {new Date().getFullYear()} {studio.name} · Concept by{' '}
          <a href={studio.credit.href} target="_blank" rel="noreferrer">
            {studio.credit.label}
          </a>
        </p>
      </div>
    </footer>
  );
}
