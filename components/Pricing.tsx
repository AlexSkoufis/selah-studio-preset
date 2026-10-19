'use client';

import { useRef, useState } from 'react';
import { pricing } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { go } from './Nav';
import Knot from './Knot';

const WEEKS = 4.33;
const eur = (v: number) => `€${Math.round(v)}`;

/**
 * Pricing as a calculator: pick how often you'll come and the three options re-price themselves
 * per month and per class, with the cheapest one marked.
 */
export default function Pricing() {
  const root = useRef<HTMLElement>(null);
  const [n, setN] = useState(2);
  const perMonth = n * WEEKS;

  const options = [
    { id: 'drop', name: 'Drop-in', sub: `€${pricing.dropIn} per class`, month: pricing.dropIn * perMonth },
    { id: 'pack', name: `${pricing.pack.size}-class pack`, sub: `€${pricing.pack.price}, valid ${pricing.pack.valid}`, month: (pricing.pack.price / pricing.pack.size) * perMonth },
    { id: 'unl', name: 'Unlimited', sub: pricing.unlimited.text, month: pricing.unlimited.price },
  ];
  const best = options.reduce((a, b) => (b.month < a.month ? b : a));
  const max = Math.max(...options.map((o) => o.month));
  const saving = options[0].month - best.month;

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('.pricing .sec-head > *', { autoAlpha: 0, y: 40, stagger: 0.1, scrollTrigger: { trigger: '.pricing .sec-head', start: 'top 80%', once: true } });
      gsap.from('.intro-card, .calc', { autoAlpha: 0, y: 60, stagger: 0.12, duration: 1.3, scrollTrigger: { trigger: '.pricing__grid', start: 'top 80%', once: true } });
    });
  });

  return (
    <section id="pricing" ref={root} className="pricing" aria-labelledby="pricing-title">
      <div className="sec-head wrap">
        <Knot x={0.965} />
        <p className="eyebrow">Pricing</p>
        <h2 id="pricing-title" className="h2">
          Simple, <em>honest</em> pricing.
        </h2>
      </div>

      <div className="pricing__grid wrap">
        <article className="intro-card">
          <p className="intro-card__k">{pricing.intro.name}</p>
          <p className="intro-card__price">
            €{pricing.intro.price}
            <span>for 3 classes</span>
          </p>
          <p>{pricing.intro.text}</p>
          <a href="#timetable" className="btn btn--light" onClick={go('#timetable')}>
            Start here <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
          <svg className="intro-card__arch" viewBox="0 0 200 240" aria-hidden="true">
            <path d="M20 240V100a80 80 0 0 1 160 0v140" />
            <path d="M50 240V110a50 50 0 0 1 100 0v130" />
          </svg>
        </article>

        <div className="calc">
          <label className="calc__q" htmlFor="freq">
            How often will you come?
          </label>
          <div className="calc__n" aria-hidden="true">
            <b key={n}>{n}</b>
            <span>
              {n === 1 ? 'class' : 'classes'} a week
              <br />≈ {Math.round(perMonth)} a month
            </span>
          </div>
          <input id="freq" type="range" min={1} max={6} step={1} value={n} onChange={(e) => setN(+e.target.value)} style={{ ['--p' as string]: (n - 1) / 5 }} aria-valuetext={`${n} classes a week`} />
          <div className="calc__ticks" aria-hidden="true">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <span key={i}>{i}</span>
            ))}
          </div>

          <ul className="calc__opts" aria-live="polite">
            {options.map((o) => (
              <li key={o.id} className={o === best ? 'is-best' : ''}>
                <div className="calc__name">
                  <b>{o.name}</b>
                  <span>{o.sub}</span>
                </div>
                <span className="calc__bar" aria-hidden="true">
                  <i style={{ width: `${(o.month / max) * 100}%` }} />
                </span>
                <div className="calc__cost">
                  <b>{eur(o.month)}</b>
                  <span>/ month · {eur(o.month / perMonth)} a class</span>
                </div>
                {o === best && <em className="calc__badge">Best for you</em>}
              </li>
            ))}
          </ul>
          <p className="calc__note">{saving > 1 ? `That’s about ${eur(saving)} a month less than paying per class.` : 'At this pace, paying per class keeps things flexible.'}</p>
        </div>
      </div>
    </section>
  );
}
