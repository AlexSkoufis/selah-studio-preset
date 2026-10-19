import type { Metadata, Viewport } from 'next';
import { preload } from 'react-dom';
import { Instrument_Serif, Hanken_Grotesk } from 'next/font/google';
import { srcSet } from '@/components/Img';
import { studio } from '@/lib/content';
import './globals.css';

// Instrument Serif: slim, high-contrast display serif (with italics). Hanken Grotesk: light, open body face.
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const sans = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: `${studio.name} — ${studio.line}, ${studio.area}`,
  description: `${studio.name}: reformer pilates, slow vinyasa, yin and breathwork in ${studio.area}. A fictional studio design concept.`,
};

export const viewport: Viewport = { themeColor: '#F4EFE8', width: 'device-width', initialScale: 1 };

const motionFlag = `try{if(matchMedia('(prefers-reduced-motion: no-preference)').matches)document.documentElement.classList.add('motion')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  preload('/img/hero-1200.avif', { as: 'image', imageSrcSet: srcSet('hero', 'avif'), imageSizes: '150vw', type: 'image/avif', fetchPriority: 'high' });
  return (
    // suppressHydrationWarning: the inline script adds `motion` to <html> before hydration.
    <html lang="en" suppressHydrationWarning className={`${serif.variable} ${sans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
