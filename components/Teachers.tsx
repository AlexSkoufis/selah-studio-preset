'use client';

import { useRef } from 'react';
import { teachers } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Img } from './Img';
import Knot from './Knot';

/** Teachers in arch frames. Hover (or focus) lifts the portrait and reveals a line in their own words. */
export default function Teachers() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('.teachers .sec-head > *', { autoAlpha: 0, y: 40, stagger: 0.1, scrollTrigger: { trigger: '.teachers .sec-head', start: 'top 80%', once: true } });
      gsap.from('.teacher__arch', { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 0px 0px)', stagger: 0.12, duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: '.teacher-grid', start: 'top 80%', once: true } });
      gsap.from('.teacher__info', { autoAlpha: 0, y: 20, stagger: 0.12, delay: 0.6, scrollTrigger: { trigger: '.teacher-grid', start: 'top 80%', once: true } });
      // Alternate columns drift at slightly different speeds.
      gsap.utils.toArray<HTMLElement>('.teacher:nth-child(even)').forEach((el) => {
        gsap.fromTo(el, { y: 60 }, { y: -20, ease: 'none', scrollTrigger: { trigger: '.teacher-grid', start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });
  });

  return (
    <section id="teachers" ref={root} className="teachers" aria-labelledby="teachers-title">
      <div className="sec-head wrap">
        <Knot x={0.035} />
        <p className="eyebrow">Teachers</p>
        <h2 id="teachers-title" className="h2">
          Patient hands, <em>sharp eyes.</em>
        </h2>
        <p className="lede">Four senior teachers with over forty years of practice between them. You’ll know them by name, and they’ll know your knees.</p>
      </div>
      <ul className="teacher-grid wrap">
        {teachers.map((t) => (
          <li key={t.id} className="teacher" tabIndex={0}>
            <div className="teacher__arch">
              <Img image={t.image} alt={`${t.name}, ${t.role}`} sizes="(min-width: 1024px) 24vw, 45vw" />
              <blockquote className="teacher__quote">“{t.quote}”</blockquote>
            </div>
            <div className="teacher__info">
              <h3>{t.name}</h3>
              <p>{t.role}</p>
              <p className="teacher__since">Teaching since {t.since}</p>
              <ul className="tags">
                {t.tags.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
