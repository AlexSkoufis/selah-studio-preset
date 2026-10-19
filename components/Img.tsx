import manifest from '@/lib/image-manifest.json';
import type { ImageKey } from '@/lib/content';

type Entry = { w: number; h: number; widths: number[]; blur: string };
const data = manifest as Record<string, Entry>;

export function srcSet(key: ImageKey, ext: 'avif' | 'webp') {
  return data[key].widths.map((w) => `/img/${key}-${w}.${ext} ${w}w`).join(', ');
}

export function fallbackSrc(key: ImageKey) {
  const ws = data[key].widths;
  return `/img/${key}-${ws.find((w) => w >= 1200) ?? ws[ws.length - 1]}.webp`;
}

type Props = {
  image: ImageKey;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
};

/** AVIF/WebP <picture> with a blurred placeholder painted underneath. */
export function Img({ image, alt, sizes, className, priority, style }: Props) {
  const e = data[image];
  return (
    <picture className={className} style={{ backgroundImage: `url(${e.blur})`, ...style }}>
      <source type="image/avif" srcSet={srcSet(image, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(image, 'webp')} sizes={sizes} />
      <img
        src={fallbackSrc(image)}
        alt={alt}
        width={e.w}
        height={e.h}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  );
}
