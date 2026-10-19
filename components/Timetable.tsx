'use client';

import { useEffect, useRef, useState } from 'react';
import { classes, teacherName, teachers, week, type ClassId } from '@/lib/content';
import { classById, DAY_SHORT, period, studioNow, toMin } from '@/lib/schedule';
import { onShowTimes } from '@/lib/bus';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Img } from './Img';
import Knot from './Knot';

type Day = { idx: number; label: string; date: string };

/** Next seven days starting today (studio time). Rendered after mount so server and client agree. */
function nextDays(): Day[] {
  const today = studioNow().day;
  const base = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base.getTime() + i * 86_400_000);
    return { idx: (today + i) % 7, label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : DAY_SHORT[(today + i) % 7], date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) };
  });
}

const PERIODS = { am: 'Morning', mid: 'Midday', pm: 'Evening' } as const;

/**
 * Weekly timetable: day tabs, class and time-of-day filters, live spots and a demo booking flow
 * (book → booked, full → waitlist). Other sections can deep-link here via the event bus.
 */
export default function Timetable() {
  const root = useRef<HTMLElement>(null);
  const [days, setDays] = useState<Day[]>(DAY_SHORT.map((d, i) => ({ idx: i, label: d, date: '' })));
  const [sel, setSel] = useState(0);
  const [cls, setCls] = useState<ClassId | 'all'>('all');
  const [when, setWhen] = useState<'am' | 'mid' | 'pm' | 'all'>('all');
  const [booked, setBooked] = useState<Record<string, 'booked' | 'wait'>>({});
  const [toast, setToast] = useState('');
  const [nowMin, setNowMin] = useState(-1);

  useEffect(() => {
    setDays(nextDays());
    setNowMin(studioNow().min);
    return onShowTimes(({ cls, period }) => {
      setCls(cls);
      setWhen(period ?? 'all');
      // Jump to the first day that has a matching class.
      const list = nextDays();
      const first = list.findIndex((d) => week[d.idx].some((s) => (cls === 'all' || s.cls === cls) && (!period || periodOf(s.time) === period)));
      setSel(Math.max(0, first));
    });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(''), 3800);
    return () => window.clearTimeout(t);
  }, [toast]);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('.timetable .sec-head > *', { autoAlpha: 0, y: 40, stagger: 0.1, scrollTrigger: { trigger: '.timetable .sec-head', start: 'top 80%', once: true } });
      gsap.from('.tt', { autoAlpha: 0, y: 60, duration: 1.3, scrollTrigger: { trigger: '.tt', start: 'top 85%', once: true } });
    });
  });

  const day = days[sel];
  const slots = week[day.idx].filter((s) => (cls === 'all' || s.cls === cls) && (when === 'all' || periodOf(s.time) === when));

  const book = (key: string, full: boolean, name: string, time: string) => {
    const had = Boolean(booked[key]);
    setBooked((b) => {
      const next = { ...b };
      if (next[key]) delete next[key];
      else next[key] = full ? 'wait' : 'booked';
      return next;
    });
    setToast(
      had
        ? `Cancelled ${name} at ${time}.`
        : full
          ? `You’re on the waitlist for ${name} (${time}). Demo only.`
          : `Booked: ${name}, ${day.label.toLowerCase()} at ${time}. Demo only, nothing was sent.`,
    );
  };

  return (
    <section id="timetable" ref={root} className="timetable" aria-labelledby="tt-title">
      <div className="sec-head wrap">
        <Knot x={0.965} />
        <p className="eyebrow">Timetable</p>
        <h2 id="tt-title" className="h2">
          Find your <em>hour.</em>
        </h2>
      </div>

      <div className="tt wrap">
        <div className="tt__days" role="tablist" aria-label="Day">
          {days.map((d, i) => (
            <button key={i} role="tab" type="button" aria-selected={sel === i} className={sel === i ? 'on' : ''} onClick={() => setSel(i)}>
              <b>{d.label}</b>
              <span>{d.date || ' '}</span>
              <i aria-hidden="true">
                {week[d.idx].map((s, k) => (
                  <em key={k} className={cls === 'all' || s.cls === cls ? 'm' : ''} />
                ))}
              </i>
            </button>
          ))}
        </div>

        <div className="tt__filters">
          <div role="group" aria-label="Class type">
            <button type="button" className={`chip${cls === 'all' ? ' on' : ''}`} aria-pressed={cls === 'all'} onClick={() => setCls('all')}>
              All classes
            </button>
            {classes.map((c) => (
              <button key={c.id} type="button" className={`chip${cls === c.id ? ' on' : ''}`} aria-pressed={cls === c.id} onClick={() => setCls(c.id)}>
                {c.short}
              </button>
            ))}
          </div>
          <div role="group" aria-label="Time of day">
            {(['all', 'am', 'mid', 'pm'] as const).map((p) => (
              <button key={p} type="button" className={`chip chip--soft${when === p ? ' on' : ''}`} aria-pressed={when === p} onClick={() => setWhen(p)}>
                {p === 'all' ? 'Any time' : PERIODS[p]}
              </button>
            ))}
          </div>
        </div>

        <ul className="tt__list" role="tabpanel" aria-label={`${day.label} classes`}>
          {slots.length === 0 && <li className="tt__empty">No matching classes this day. Try another day or clear a filter.</li>}
          {slots.map((s) => {
            const c = classById(s.cls);
            const key = `${sel}-${s.time}`;
            const state = booked[key];
            const taken = s.taken + (state === 'booked' ? 1 : 0);
            const left = s.cap - taken;
            const full = s.taken >= s.cap;
            const started = sel === 0 && nowMin >= 0 && toMin(s.time) <= nowMin;
            const t = teachers.find((x) => x.id === s.teacher)!;
            return (
              <li key={key} className={`slot${started ? ' is-past' : ''}${state ? ' is-booked' : ''}`}>
                <p className="slot__time">
                  {s.time}
                  <span>{c.minutes} min</span>
                </p>
                <div className="slot__class">
                  <b>{c.name}</b>
                  <span>{c.level}</span>
                </div>
                <p className="slot__teacher">
                  <Img image={t.image} alt="" sizes="40px" />
                  {teacherName[s.teacher]}
                </p>
                <div className="slot__spots" aria-label={full ? 'Class full' : `${left} of ${s.cap} spots left`}>
                  <span className="bar" aria-hidden="true">
                    <i style={{ width: `${(taken / s.cap) * 100}%` }} />
                  </span>
                  <span>{full ? 'Full' : left <= 2 ? `${left} left` : `${left} spots`}</span>
                </div>
                <button type="button" className={`slot__btn${state ? ' on' : ''}`} disabled={started} onClick={() => book(key, full, c.name, s.time)}>
                  {started ? 'Started' : state === 'booked' ? 'Booked ✓' : state === 'wait' ? 'On waitlist' : full ? 'Join waitlist' : 'Book'}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="tt__note">Booking is a demo. Late cancellation within 12 hours uses the class credit.</p>
      </div>

      <div className={`toast${toast ? ' on' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </section>
  );
}

const periodOf = period;
