'use client';

import { useRef, useState } from 'react';
import { classes } from '@/lib/content';
import { showTimes } from '@/lib/bus';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { scrollToTarget } from './SmoothScroll';
import { Img } from './Img';
import Knot from './Knot';

export function Intensity({ n }: { n: 1 | 2 | 3 }) {
  return (
    <span className="intensity" aria-label={`Intensity ${n} of 3`}>
      {[1, 2, 3].map((i) => (
        <i key={i} className={i <= n ? 'on' : ''} />
      ))}
    </span>
  );
}

/**
 * Classes as a row of arch-topped panels. Hovering or focusing one opens it like a door;
 * "See times" filters the timetable to that class.
 */
export default function Classes() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('.classes .sec-head > *', { autoAlpha: 0, y: 40, stagger: 0.1, scrollTrigger: { trigger: '.classes .sec-head', start: 'top 80%', once: true } });
      gsap.from('.panel', { yPercent: 18, autoAlpha: 0, stagger: 0.09, duration: 1.4, scrollTrigger: { trigger: '.panels', start: 'top 82%', once: true } });
    });
  });

  return (
    <section id="classes" ref={root} className="classes" aria-labelledby="classes-title">
      <div className="sec-head wrap">
        <Knot x={0.965} />
        <p className="eyebrow">Classes</p>
        <h2 id="classes-title" className="h2">
          Five ways to <em>practise.</em>
        </h2>
        <p className="lede">Every class is capped small, taught by a senior teacher, and adaptable to any body on any day.</p>
      </div>

      <ul className="panels wrap">
        {classes.map((c, i) => (
          <li key={c.id} className={`panel${open === i ? ' is-open' : ''}`} onPointerEnter={() => setOpen(i)}>
            <Img image={c.image} alt="" sizes="(min-width: 1024px) 50vw, 80vw" className="panel__img" />
            <button type="button" className="panel__tab" aria-expanded={open === i} aria-controls={`panel-${c.id}`} onClick={() => setOpen(i)} onFocus={() => setOpen(i)}>
              <span className="panel__num">0{i + 1}</span>
              <span className="panel__name">{c.name}</span>
            </button>
            <div id={`panel-${c.id}`} className="panel__body">
              <p className="panel__meta">
                {c.minutes} min · {c.level}
              </p>
              <h3>{c.name}</h3>
              <p>{c.text}</p>
              <div className="panel__foot">
                <Intensity n={c.intensity} />
                <ul className="tags">
                  {c.good.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
                <a
                  href="#timetable"
                  className="link"
                  onClick={(e) => {
                    e.preventDefault();
                    showTimes({ cls: c.id });
                    scrollToTarget('#timetable', { offset: -70 });
                  }}
                >
                  See times →
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
