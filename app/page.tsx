import SmoothScroll from '@/components/SmoothScroll';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Statement from '@/components/Statement';
import Classes from '@/components/Classes';
import Finder from '@/components/Finder';
import Timetable from '@/components/Timetable';
import Studio from '@/components/Studio';
import Teachers from '@/components/Teachers';
import Pricing from '@/components/Pricing';
import Reviews from '@/components/Reviews';
import Visit from '@/components/Visit';
import Footer from '@/components/Footer';
import FlowLine from '@/components/FlowLine';

export default function Page() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SmoothScroll />
      <Nav />
      <Hero />
      <main id="main">
        <FlowLine />
        <Statement />
        <Classes />
        <Finder />
        <Timetable />
        <Studio />
        <Teachers />
        <Pricing />
        <Reviews />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
