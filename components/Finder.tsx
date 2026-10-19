'use client';

import { useMemo, useRef, useState } from 'react';
import { classes, finder, teacherName, week, type ClassId } from '@/lib/content';
import { classById, DAY_SHORT, period } from '@/lib/schedule';
import { showTimes } from '@/lib/bus';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { scrollToTarget } from './SmoothScroll';
import { Img } from './Img';
import { Intensity } from './Classes';
import Knot from './Knot';

/** Three questions → a recommended class, with its next matching times from the weekly timetable. */
export default function Finder() {
  const root = useRef<HTMLElement>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const step = answers.length;
  const done = step === finder.questions.length;

  const result = useMemo(() => {
    if (!done) return null;
    const score: Record<ClassId, number> = { reformer: 0, mat: 0, vinyasa: 0, yin: 0, breath: 0 };
    answers.forEach((a, qi) => Object.entries(finder.questions[qi].options[a].w).forEach(([k, v]) => (score[k as ClassId] += v ?? 0)));
    const id = (Object.keys(score) as ClassId[]).sort((a, b) => score[b] - score[a])[0];
    const when = finder.questions[2].options[answers[2]].period!;
    const times = week
      .flatMap((slots, day) => slots.filter((s) => s.cls === id && period(s.time) === when).map((s) => ({ ...s, day })))
      .slice(0, 3);
    // Fall back to any time if nothing matches the preferred part of the day.
    const any = week.flatMap((slots, day) => slots.filter((s) => s.cls === id).map((s) => ({ ...s, day }))).slice(0, 3);
    return { cls: classById(id), when, times: times.length ? times : any, matched: times.length > 0 };
  }, [answers, done]);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('.finder__photo', { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 0px 0px)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.finder', start: 'top 75%', once: true } });
      gsap.from('.quiz', { autoAlpha: 0, y: 50, duration: 1.3, scrollTrigger: { trigger: '.finder', start: 'top 70%', once: true } });
    });
  });

  const q = finder.questions[step];
  const whenLabel = { am: 'mornings', mid: 'middays', pm: 'evenings' };

  return (
    <section ref={root} className="finder" aria-labelledby="finder-title">
      <div className="finder__grid wrap">
        <div className="finder__photo">
          <Img image={result ? result.cls.image : 'arches'} alt="" sizes="(min-width: 1024px) 40vw, 90vw" key={result?.cls.id ?? 'arches'} />
        </div>

        <div className="quiz">
          <Knot x={0.035} />
          <p className="eyebrow">Class finder</p>
          <h2 id="finder-title" className="h2">
            {finder.title}
          </h2>
          <p className="lede">{finder.text}</p>

          <ol className="quiz__progress" aria-label="Progress">
            {finder.questions.map((_, i) => (
              <li key={i} className={i < step ? 'done' : i === step ? 'on' : ''} />
            ))}
          </ol>

          <div className="quiz__stage" aria-live="polite">
            {!done && q && (
              <fieldset key={step} className="quiz__q">
                <legend>
                  <span>
                    {step + 1} / {finder.questions.length}
                  </span>
                  {q.q}
                </legend>
                <div className="quiz__opts">
                  {q.options.map((o, i) => (
                    <button key={o.label} type="button" className="opt" onClick={() => setAnswers((a) => [...a, i])}>
                      {o.label}
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <button type="button" className="quiz__back" onClick={() => setAnswers((a) => a.slice(0, -1))}>
                    ← Back
                  </button>
                )}
              </fieldset>
            )}

            {result && (
              <div className="quiz__result">
                <p className="quiz__for">We’d start you with</p>
                <h3>{result.cls.name}</h3>
                <p className="quiz__meta">
                  {result.cls.minutes} min · {result.cls.level} <Intensity n={result.cls.intensity} />
                </p>
                <p>{result.cls.text}</p>
                <p className="quiz__times-k">{result.matched ? `Next ${whenLabel[result.when]}` : 'Next classes'}</p>
                <ul className="quiz__times">
                  {result.times.map((t) => (
                    <li key={`${t.day}-${t.time}`}>
                      <b>{DAY_SHORT[t.day]}</b> {t.time} <span>with {teacherName[t.teacher]}</span>
                    </li>
                  ))}
                </ul>
                <div className="quiz__actions">
                  <a
                    href="#timetable"
                    className="btn btn--ink"
                    onClick={(e) => {
                      e.preventDefault();
                      showTimes({ cls: result.cls.id, period: result.matched ? result.when : undefined });
                      scrollToTarget('#timetable', { offset: -70 });
                    }}
                  >
                    Book {classes.find((c) => c.id === result.cls.id)!.short}
                    <span className="btn__arrow" aria-hidden="true">→</span>
                  </a>
                  <button type="button" className="btn btn--line" onClick={() => setAnswers([])}>
                    Start over
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
