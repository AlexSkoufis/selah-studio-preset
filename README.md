# Selah — pilates & yoga studio preset

A homepage for a fictional pilates & yoga studio in Kolonaki, Athens. Warm plaster palette, arch shapes that echo the studio's doorways, Instrument Serif + Hanken Grotesk.

- **Arch hero.** The photo starts as an arch window between "Strength" and "in stillness."; scrolling opens it to full bleed and brings in the intro, with a live "next class" line computed from the timetable in Athens time.
- **Flow line.** One clay line draws itself down the page as you scroll, through a `<Knot>` in each section (`components/FlowLine.tsx`). Move a knot's `x` (0–1) to re-route it.
- **Classes** as arch panels that open like doors; "See times" filters the timetable.
- **Class finder**: three questions → a recommended class with matching times, linked to the timetable.
- **Timetable**: next 7 days, class and time-of-day filters, spots left, book / waitlist / cancel (demo only), past classes marked as started.
- **Studio**: pinned horizontal gallery on desktop, swipeable on mobile.
- **Pricing calculator**: pick classes per week; drop-in, 10-pack and unlimited re-price per month and per class, cheapest marked.
- **Visit**: live open/closed status, hours with today highlighted, stylised map, first-visit notes, newsletter (demo).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to /out
npm run images   # after adding photos to assets-src/
```

## Customise

- All copy, classes, teachers, weekly schedule, prices and hours: `lib/content.ts`.
- Photos: `assets-src/<key>.jpg` → `npm run images` (AVIF/WebP ladders + blur placeholders). Credits in `assets-src/CREDITS.md` — replace with the studio's own photography.
- Colours and type: top of `app/globals.css`.

Motion respects `prefers-reduced-motion` (hero shows its final state, no scroll-drawn line or pinning). Built with Next.js 15, GSAP 3 (ScrollTrigger, SplitText) and Lenis.
