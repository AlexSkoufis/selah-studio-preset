// Builds responsive AVIF + WebP sets (and a tiny blur placeholder) from assets-src/
// into public/img/, and writes lib/image-manifest.json for the <Img> component.
// Add a photo: drop it in assets-src/ as <key>.jpg, add the key to ImageKey in lib/content.ts,
// run `npm run images`.
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const SRC = path.join(root, 'assets-src');
const OUT = path.join(root, 'public', 'img');
const LADDER = [480, 800, 1200, 1600, 2400];

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });
const manifest = {};

const files = (await fs.readdir(SRC)).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
for (const file of files) {
  const key = path.parse(file).name;
  const input = await sharp(path.join(SRC, file)).rotate().toBuffer();
  const { width, height } = await sharp(input).metadata();
  const widths = LADDER.filter((w) => w < width).concat(width > 2400 ? [] : [width]);
  for (const w of widths) {
    const base = sharp(input).resize({ width: w });
    await base.clone().avif({ quality: 52, effort: 4 }).toFile(path.join(OUT, `${key}-${w}.avif`));
    await base.clone().webp({ quality: 76 }).toFile(path.join(OUT, `${key}-${w}.webp`));
  }
  const blur = await sharp(input).resize({ width: 24 }).blur(1.2).webp({ quality: 40 }).toBuffer();
  manifest[key] = { w: width, h: height, widths, blur: `data:image/webp;base64,${blur.toString('base64')}` };
  console.log(key, `${width}x${height}`);
}

await fs.writeFile(path.join(root, 'lib', 'image-manifest.json'), JSON.stringify(manifest, null, 1));
console.log('done', files.length);
