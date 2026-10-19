'use client';

import { useEffect, useRef, useState } from 'react';
import { reviews } from '@/lib/content';
import { gsap, useGsap, MQ, useReducedMotion } from '@/lib/motion';
import { Img } from './Img';
import Knot from './Knot';

const DURATION = 7000;

/** One review at a time, large and quiet, auto-advancing (paused on hover/focus or reduced motion). */
export default function Reviews() {
  const root = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (paused || reduced) return;
    const t = window.setTimeout(() => setI((v) => (v + 1) % reviews.length), DURATION);
    return () => window.clearTimeout(t);
  }, [i, paused, reduced]);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('.reviews__photo', { clipPath: 'inset(0% 0% 100% 0% round 999px 999px 999px 999px)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.reviews', start: 'top 70%', once: true } });
    });
  });

  const r = reviews[i];
  return (
    <section ref={root} className="reviews" aria-labelledby="reviews-title" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="reviews__grid wrap">
        <div className="reviews__photo">
          <Img image="twist" alt="" sizes="(min-width: 1024px) 26vw, 60vw" />
        </div>
        <div className="reviews__body">
          <Knot x={0.035} />
          <h2 id="reviews-title" className="eyebrow">
            In their words
          </h2>
          <figure key={i} className="quote">
            <blockquote>“{r.text}”</blockquote>
            <figcaption>
              <b>{r.name}</b> · {r.note}
            </figcaption>
          </figure>
          <div className="reviews__nav">
            <ol aria-label="Reviews">
              {reviews.map((x, k) => (
                <li key={x.name}>
                  <button type="button" aria-label={`Review ${k + 1} of ${reviews.length}`} aria-current={k === i} onClick={() => setI(k)}>
                    <i className={k === i && !paused && !reduced ? 'run' : k === i ? 'full' : ''} style={{ animationDuration: `${DURATION}ms` }} />
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
