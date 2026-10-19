'use client';

import { useEffect, useRef, useState } from 'react';
import { firstVisit, studio } from '@/lib/content';
import { DAY_LONG, openStatus, studioNow } from '@/lib/schedule';
import { gsap, useGsap, MQ } from '@/lib/motion';
import Knot from './Knot';

/** Address, live open/closed status, hours (today highlighted), first-visit notes and a stylised map. */
export default function Visit() {
  const root = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<{ open: boolean; text: string } | null>(null);
  const [today, setToday] = useState(-1);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const tick = () => {
      setStatus(openStatus());
      setToday(studioNow().day);
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('.visit__info > *, .visit__map', { autoAlpha: 0, y: 40, stagger: 0.08, duration: 1.2, scrollTrigger: { trigger: '.visit', start: 'top 75%', once: true } });
      gsap.from('.map__route', { strokeDashoffset: 600, duration: 2.4, ease: 'power2.inOut', scrollTrigger: { trigger: '.visit__map', start: 'top 80%', once: true } });
    });
  });

  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(studio.address.join(', '))}`;

  return (
    <section id="visit" ref={root} className="visit" aria-labelledby="visit-title">
      <div className="visit__grid wrap">
        <div className="visit__info">
          <Knot x={0.965} />
          <p className="eyebrow">Visit</p>
          <h2 id="visit-title" className="h2">
            Come as <em>you are.</em>
          </h2>
          <address>
            {studio.address.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </address>
          <p className={`status${status?.open ? ' is-open' : ''}`}>
            <span className="dot" aria-hidden="true" />
            {status?.text ?? 'Opening hours'}
          </p>
          <table className="hours">
            <caption className="sr">Opening hours</caption>
            <tbody>
              {studio.hours.map(([o, c], i) => (
                <tr key={i} className={i === today ? 'is-today' : ''}>
                  <th scope="row">{DAY_LONG[i]}</th>
                  <td>
                    {o} – {c}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="visit__contact">
            <a href={studio.phoneHref}>{studio.phone}</a>
            <a href={`mailto:${studio.email}`}>{studio.email}</a>
          </p>
        </div>

        <div className="visit__side">
          <a className="visit__map" href={maps} target="_blank" rel="noreferrer" aria-label="Open the studio location in Google Maps">
            <svg viewBox="0 0 600 440" aria-hidden="true">
              <rect width="600" height="440" className="map__ground" />
              <path className="map__park" d="M380 40c60-10 150 20 170 90s-30 120-90 130-120-30-130-90 0-120 50-130z" />
              <g className="map__streets">
                <path d="M-10 120 L610 60" />
                <path d="M-10 250 L610 200" />
                <path d="M-10 370 L610 330" />
                <path d="M110 -10 L170 450" />
                <path d="M300 -10 L330 450" />
                <path d="M480 280 L520 450" />
                <path d="M-10 40 Q200 170 300 220" />
              </g>
              <path className="map__route" d="M40 420 L60 330 L320 300 L308 205" />
              <g className="map__pin" transform="translate(308 205)">
                <circle r="30" className="map__pulse" />
                <circle r="9" />
              </g>
              <text x="398" y="140" className="map__label">
                Lycabettus
              </text>
              <text x="72" y="418" className="map__label">
                Syntagma · 12 min walk
              </text>
            </svg>
            <span className="visit__dir">Get directions ↗</span>
          </a>

          <div className="first">
            <h3>Your first visit</h3>
            <ol>
              {firstVisit.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ol>
          </div>

          <form
            className="letters"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label htmlFor="nl">Letters from the studio: new classes, workshops, the odd recipe. Monthly, never more.</label>
            {sent ? (
              <p role="status" className="letters__ok">
                Thank you. This is a demo, so nothing was sent.
              </p>
            ) : (
              <div className="letters__row">
                <input id="nl" type="email" required placeholder="you@email.com" autoComplete="email" />
                <button type="submit" className="btn btn--ink btn--sm">
                  Subscribe
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
