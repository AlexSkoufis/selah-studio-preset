'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, MQ } from '@/lib/motion';

type Pt = { x: number; y: number };

/**
 * One continuous hand-drawn-feeling line that runs through the whole page, passing through every
 * <Knot>. It draws itself as you scroll so its tip stays just below the middle of the screen.
 */
export default function FlowLine() {
  const svg = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  const tip = useRef<SVGCircleElement>(null);
  const [geo, setGeo] = useState<{ d: string; w: number; h: number; knots: Pt[] } | null>(null);

  // Measure knots → build a smooth S-curve through them.
  useEffect(() => {
    const main = svg.current?.parentElement;
    if (!main) return;
    const measure = () => {
      const mr = main.getBoundingClientRect();
      const w = main.clientWidth;
      const knots = [...main.querySelectorAll<HTMLElement>('.knot')].map((k) => {
        const r = k.getBoundingClientRect();
        return { x: Number(k.dataset.knotX) * w, y: r.top - mr.top };
      });
      if (knots.length < 2) return;
      let d = `M${knots[0].x},${knots[0].y}`;
      for (let i = 1; i < knots.length; i++) {
        const a = knots[i - 1];
        const b = knots[i];
        const dy = (b.y - a.y) * 0.55;
        d += ` C${a.x},${a.y + dy} ${b.x},${b.y - dy} ${b.x},${b.y}`;
      }
      setGeo({ d, w, h: main.scrollHeight, knots });
    };
    let t = 0;
    const later = () => {
      window.clearTimeout(t);
      t = window.setTimeout(measure, 150);
    };
    const ro = new ResizeObserver(later);
    ro.observe(main);
    document.fonts?.ready.then(later);
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  // Draw on scroll: map the viewport's "reading line" to a length along the path.
  useEffect(() => {
    const p = path.current;
    if (!geo || !p) return;
    const total = p.getTotalLength();
    p.style.strokeDasharray = `${total}`;
    if (window.matchMedia(MQ.reduced).matches) {
      p.style.strokeDashoffset = '0';
      return;
    }
    const lut: { l: number; x: number; y: number }[] = [];
    for (let l = 0; l <= total; l += 6) {
      const pt = p.getPointAtLength(l);
      lut.push({ l, x: pt.x, y: pt.y });
    }
    const main = svg.current!.parentElement!;
    const state = { l: 0 };
    const apply = () => {
      p.style.strokeDashoffset = String(total - state.l);
      // Tip position from the lookup table.
      let i = 0;
      while (i < lut.length - 1 && lut[i].l < state.l) i++;
      tip.current?.setAttribute('cx', String(lut[i].x));
      tip.current?.setAttribute('cy', String(lut[i].y));
      svg.current!.querySelectorAll<SVGCircleElement>('.flow__knot').forEach((c) => c.classList.toggle('on', Number(c.getAttribute('cy')) <= lut[i].y + 1));
    };
    const to = gsap.quickTo(state, 'l', { duration: 0.6, ease: 'power3.out', onUpdate: apply });
    const target = () => {
      const y = window.scrollY + window.innerHeight * 0.62 - (main.getBoundingClientRect().top + window.scrollY);
      // Binary search: y along the path only grows, so the first point past `y` gives the length.
      let lo = 0;
      let hi = lut.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (lut[mid].y < y) lo = mid + 1;
        else hi = mid;
      }
      return y <= lut[0].y ? 0 : lut[lo].l;
    };
    const st = ScrollTrigger.create({ trigger: main, start: 'top bottom', end: 'bottom top', onUpdate: () => to(target()) });
    state.l = target();
    apply();
    return () => st.kill();
  }, [geo]);

  return (
    <svg ref={svg} className="flow" width={geo?.w ?? 0} height={geo?.h ?? 0} aria-hidden="true">
      {geo && (
        <>
          <path ref={path} d={geo.d} className="flow__path" />
          {geo.knots.map((k, i) => (
            <circle key={i} cx={k.x} cy={k.y} r="5" className="flow__knot" />
          ))}
          <circle ref={tip} r="3.5" className="flow__tip" />
        </>
      )}
    </svg>
  );
}
