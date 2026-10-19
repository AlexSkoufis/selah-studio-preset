'use client';

import { useEffect, useRef, useState } from 'react';
import { hero, studio } from '@/lib/content';
import { classById, DAY_LONG, nextClass } from '@/lib/schedule';
import { teacherName } from '@/lib/content';
import { gsap, SplitText, useGsap, MQ } from '@/lib/motion';
import { Img } from './Img';
import { go } from './Nav';

// Arch window (desktop / portrait) → full bleed. Same structure on both ends so GSAP can interpolate.
const ARCH = {
  desk: 'inset(15vh 35.5vw 7vh 35.5vw round 14.5vw 14.5vw 0vw 0vw)',
  mob: 'inset(30svh 17vw 14svh 17vw round 33vw 33vw 0vw 0vw)',
  full: 'inset(0vh 0vw 0vh 0vw round 0vw 0vw 0vw 0vw)',
};

/**
 * Hero: the photo starts as an arch window between the two halves of the title. Scrolling opens
 * the arch to full bleed while the words drift apart, then the studio intro settles in over the photo.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [next, setNext] = useState<ReturnType<typeof nextClass>>(null);

  useEffect(() => {
    setNext(nextClass());
    const id = window.setInterval(() => setNext(nextClass()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add({ desk: `${MQ.motion} and (min-width: 768px)`, mob: `${MQ.motion} and (max-width: 767px)` }, (ctx) => {
      const desk = ctx.conditions!.desk;
      const arch = desk ? ARCH.desk : ARCH.mob;
      // Framing inside the arch (matches the CSS start state), eased out as the arch opens.
      // x/y are zeroed so GSAP doesn't also carry over the CSS translate as pixels.
      const frame = desk ? { x: 0, y: 0, scale: 1.5, xPercent: 22, yPercent: 12, transformOrigin: '28% 10%' } : { x: 0, y: 0, scale: 1.3, xPercent: 8, yPercent: 20, transformOrigin: '40% 15%' };
      const split = SplitText.create('.hero__word', { type: 'chars' });

      // Load: the arch rises into place, the letters follow.
      gsap
        .timeline({ delay: 0.15 })
        .from('.hero__media', { yPercent: 55, duration: 1.8, ease: 'expo.out' }, 0)
        .from('.hero__media picture', { scale: 1.5, duration: 2.2, ease: 'expo.out' }, 0)
        .from(split.chars, { yPercent: 80, autoAlpha: 0, stagger: 0.035, duration: 1.4, ease: 'expo.out' }, 0.35)
        .from('.hero__kicker, .hero__scroll', { autoAlpha: 0, y: 16, stagger: 0.1, duration: 1 }, 0.9);

      // Scroll: open the arch, part the words, then bring in the intro.
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 } })
        .fromTo('.hero__media', { clipPath: arch }, { clipPath: ARCH.full, ease: 'power2.inOut', duration: 1 }, 0)
        .fromTo('.hero__media img', frame, { scale: 1, xPercent: 0, yPercent: 0, ease: 'power2.inOut', duration: 1 }, 0)
        .to('.hero__word--a', { xPercent: -60, autoAlpha: 0, ease: 'power1.in', duration: 0.7 }, 0)
        .to('.hero__word--b', { xPercent: 60, autoAlpha: 0, ease: 'power1.in', duration: 0.7 }, 0)
        .to('.hero__kicker, .hero__scroll', { autoAlpha: 0, duration: 0.3 }, 0)
        .fromTo('.hero__shade', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0.6)
        .fromTo('.hero__intro > *', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.4 }, 0.72)
        .to({}, { duration: 0.35 });
      return () => split.revert();
    });
  });

  const cls = next ? classById(next.cls) : null;
  const spots = next ? next.cap - next.taken : 0;

  return (
    <section id="top" ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero__sticky">
        <div className="hero__media">
          <Img image="hero" alt="A woman in a side stretch on a reformer in a warm, arched pilates studio" sizes="150vw" priority />
          <div className="hero__shade" aria-hidden="true" />
        </div>

        <p className="hero__kicker">{hero.kicker}</p>
        <h1 id="hero-title" className="hero__title">
          <span className="hero__word hero__word--a">{hero.title[0]}</span> <span className="hero__word hero__word--b">{hero.title[1]}</span>
        </h1>
        <p className="hero__scroll" aria-hidden="true">
          Scroll to step inside
        </p>

        <div className="hero__intro">
          <p className="hero__lede">{hero.lede}</p>
          <div className="hero__ctas">
            <a href="#timetable" className="btn btn--light" onClick={go('#timetable')}>
              {hero.cta}
              <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
            <a href="#pricing" className="hero__offer" onClick={go('#pricing')}>
              {hero.offer}
            </a>
          </div>
          <p className="hero__next" aria-live="polite">
            {next && cls ? (
              <>
                <span className="dot" aria-hidden="true" />
                Next class · <b>{cls.name}</b> with {teacherName[next.teacher]} · {next.inDays === 0 ? 'today' : next.inDays === 1 ? 'tomorrow' : DAY_LONG[next.day]} {next.time} ·{' '}
                {spots > 0 ? `${spots} ${spots === 1 ? 'spot' : 'spots'} left` : 'waitlist open'}
              </>
            ) : (
              <>
                <span className="dot" aria-hidden="true" />
                {studio.area}
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
