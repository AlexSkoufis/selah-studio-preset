'use client';

import { useRef } from 'react';
import type { ImageKey } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Img } from './Img';
import Knot from './Knot';

const ROOMS: { image: ImageKey; shape: 'arch' | 'wide' | 'tall' | 'square'; title: string; text: string }[] = [
  { image: 'room', shape: 'wide', title: 'The reformer room', text: 'Eight maple reformers and two towers under north light.' },
  { image: 'roomtall', shape: 'arch', title: 'Tower wall', text: 'Springs, straps and bars for private sessions.' },
  { image: 'windows', shape: 'wide', title: 'The quiet room', text: 'Yin, breath and meditation, with three round windows onto the trees.' },
  { image: 'blocks', shape: 'square', title: 'Props, plenty of them', text: 'Cork blocks, bolsters, blankets and straps for every class.' },
  { image: 'group', shape: 'tall', title: 'Sunday community class', text: 'Pay-what-you-can, every first Sunday of the month.' },
];

const STATS = [
  ['240', 'm² of calm'],
  ['8', 'reformers'],
  ['14', 'mats, max'],
  ['2019', 'opened'],
];

/** The rooms, on a dark ground, travelling sideways while the section is pinned (desktop). */
export default function Studio() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
      const dist = () => track.current!.scrollWidth - window.innerWidth;
      const tween = gsap.to(track.current, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: { trigger: '.studio__pin', start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
      });
      // Each photo drifts inside its frame for depth.
      gsap.utils.toArray<HTMLElement>('.room img').forEach((img) => {
        gsap.fromTo(img, { xPercent: -8, scale: 1.18 }, { xPercent: 8, scale: 1.18, ease: 'none', scrollTrigger: { trigger: img.closest('.room'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      });
    });
    mm.add(MQ.motion, () => {
      gsap.from('.studio__intro > *', { autoAlpha: 0, y: 40, stagger: 0.1, scrollTrigger: { trigger: '.studio', start: 'top 70%', once: true } });
    });
  });

  return (
    <section id="studio" ref={root} className="studio" aria-labelledby="studio-title">
      <Knot x={0.5} className="knot--top" />
      <div className="studio__pin">
        <div ref={track} className="studio__track">
          <div className="studio__intro">
            <p className="eyebrow">The studio</p>
            <h2 id="studio-title" className="h2">
              A room that
              <br />
              <em>slows you down.</em>
            </h2>
            <p className="lede">Plaster walls, oak floors, arched doorways and a lot of light. We built the studio to feel like an exhale the moment you walk in.</p>
            <dl className="stats">
              {STATS.map(([v, k]) => (
                <div key={k}>
                  <dt>{v}</dt>
                  <dd>{k}</dd>
                </div>
              ))}
            </dl>
          </div>
          {ROOMS.map((r, i) => (
            <figure key={r.image} className={`room room--${r.shape}`}>
              <div className="room__frame">
                <Img image={r.image} alt={`${r.title}: ${r.text}`} sizes="(min-width: 1024px) 50vw, 85vw" />
              </div>
              <figcaption>
                <span>0{i + 1}</span>
                <b>{r.title}</b>
                {r.text}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
