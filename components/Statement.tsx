'use client';

import { Fragment, useRef } from 'react';
import { statement, type ImageKey } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Img } from './Img';
import Knot from './Knot';

/** A single sentence set large, with small photo "pebbles" between words. Words brighten as you read. */
export default function Statement() {
  const root = useRef<HTMLElement>(null);
  const parts = statement.split(/(\{\w+\})/).filter(Boolean);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.fromTo('.statement .w', { opacity: 0.16 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '.statement__text', start: 'top 80%', end: 'bottom 45%', scrub: true } });
      gsap.from('.pebble', { width: 0, marginInline: 0, stagger: 0.12, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.statement__text', start: 'top 70%', once: true } });
    });
  });

  return (
    <section ref={root} className="statement" aria-label="About the studio">
      <Knot x={0.965} />
      <p className="statement__text wrap">
        {parts.map((p, i) => {
          const m = p.match(/^\{(\w+)\}$/);
          if (m)
            return (
              <span key={i} className="pebble" aria-hidden="true">
                <Img image={m[1] as ImageKey} alt="" sizes="160px" />
              </span>
            );
          return (
            <Fragment key={i}>
              {p.split(/(\s+)/).map((w, j) => (/\s+/.test(w) ? w : w && <span key={j} className="w">{w}</span>))}
            </Fragment>
          );
        })}
      </p>
    </section>
  );
}
