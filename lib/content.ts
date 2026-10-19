// ─────────────────────────────────────────────────────────────────────────────
//  PRESET CONFIG — Selah, a FICTIONAL pilates & yoga studio.
//  Names, teachers, prices, schedule and reviews are demo content.
//  Photos: assets-src/<key>.jpg → `npm run images` → reference by key below.
// ─────────────────────────────────────────────────────────────────────────────

export type ImageKey =
  | 'hero' | 'reformer' | 'mat' | 'vinyasa' | 'yin' | 'breath' | 'legstrap' | 'handstrap'
  | 'room' | 'roomtall' | 'windows' | 'blocks' | 'group' | 'feet' | 'hands'
  | 'mara' | 'ines' | 'lea' | 'nadia' | 'side' | 'arches' | 'twist';

export const studio = {
  name: 'Selah',
  line: 'Pilates & Yoga',
  area: 'Kolonaki, Athens',
  address: ['Irodotou 18, 2nd floor', 'Kolonaki, 106 74 Athens'],
  email: 'hello@selah.example',
  phone: '+30 210 000 0000',
  phoneHref: 'tel:+302100000000',
  instagram: '@selah.studio',
  tz: 'Europe/Athens',
  // [open, close] in 24h "HH:MM", indexed Mon..Sun
  hours: [
    ['06:30', '21:00'],
    ['06:30', '21:00'],
    ['06:30', '21:00'],
    ['06:30', '21:00'],
    ['06:30', '20:00'],
    ['08:00', '14:00'],
    ['09:00', '13:00'],
  ] as [string, string][],
  credit: { label: 'Core Concepts Design', href: 'https://coreconcepts.design' },
  disclaimer: 'Selah is a fictional studio created as a design concept. Teachers, prices, schedule and reviews are illustrative placeholders.',
};

export const nav = [
  { label: 'Classes', href: '#classes' },
  { label: 'Timetable', href: '#timetable' },
  { label: 'Studio', href: '#studio' },
  { label: 'Teachers', href: '#teachers' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Visit', href: '#visit' },
];

export const hero = {
  title: ['Strength', 'in stillness.'],
  kicker: 'Pilates & Yoga · Kolonaki, Athens',
  lede: 'A sunlit studio for reformer pilates, slow flow and deep rest. Small classes, patient teachers, and room to breathe.',
  cta: 'Book your first class',
  offer: 'New here? Three classes for €45',
};

/** Statement with inline photo "pebbles": {key} tokens become small rounded images. */
export const statement =
  'We move {feet} slowly, breathe {hands} deeply and build a strength {blocks} that lasts, in a calm, sunlit room {windows} above the streets of Athens.';

export type ClassId = 'reformer' | 'mat' | 'vinyasa' | 'yin' | 'breath';

export const classes: {
  id: ClassId;
  name: string;
  short: string;
  image: ImageKey;
  minutes: number;
  intensity: 1 | 2 | 3;
  level: string;
  text: string;
  good: string[];
}[] = [
  {
    id: 'reformer',
    name: 'Reformer Pilates',
    short: 'Reformer',
    image: 'reformer',
    minutes: 50,
    intensity: 3,
    level: 'All levels · max 8',
    text: 'Springs, straps and a sliding carriage: slow, precise work that builds deep core strength and long, capable muscles.',
    good: ['Core strength', 'Posture', 'Low impact'],
  },
  {
    id: 'mat',
    name: 'Mat Pilates',
    short: 'Mat',
    image: 'mat',
    minutes: 45,
    intensity: 2,
    level: 'All levels · max 14',
    text: 'Classical pilates on the mat, with small props. Control, breath and precision you can take anywhere.',
    good: ['Stability', 'Mobility', 'Back care'],
  },
  {
    id: 'vinyasa',
    name: 'Slow Vinyasa',
    short: 'Vinyasa',
    image: 'vinyasa',
    minutes: 60,
    intensity: 2,
    level: 'Some experience',
    text: 'A steady, breath-led flow. Strong enough to warm you through, slow enough to notice every shape.',
    good: ['Energy', 'Balance', 'Focus'],
  },
  {
    id: 'yin',
    name: 'Yin & Restore',
    short: 'Yin',
    image: 'yin',
    minutes: 60,
    intensity: 1,
    level: 'Everyone',
    text: 'Long, supported holds on bolsters and blankets. The quietest hour of your week, and often the most useful.',
    good: ['Flexibility', 'Sleep', 'Stress'],
  },
  {
    id: 'breath',
    name: 'Breath & Meditation',
    short: 'Breath',
    image: 'breath',
    minutes: 30,
    intensity: 1,
    level: 'Everyone',
    text: 'Thirty minutes of guided breathwork and sitting. A reset for busy minds, before work or after it.',
    good: ['Calm', 'Clarity', 'Nervous system'],
  },
];

export const teachers = [
  { id: 'mara', name: 'Mara Ilia', role: 'Founder · Reformer', image: 'mara' as ImageKey, since: 2012, quote: 'Strength is a quiet thing. You feel it before anyone sees it.', tags: ['Reformer', 'Rehab pilates'] },
  { id: 'nadia', name: 'Nadia Petrou', role: 'Mat & Reformer', image: 'nadia' as ImageKey, since: 2016, quote: 'Precision first. Then everything else gets easier.', tags: ['Mat', 'Pre & postnatal'] },
  { id: 'lea', name: 'Léa Moreau', role: 'Slow Vinyasa', image: 'lea' as ImageKey, since: 2014, quote: 'Move at the speed of your breath, never ahead of it.', tags: ['Vinyasa', 'Balance'] },
  { id: 'ines', name: 'Inès Laurent', role: 'Yin & Breath', image: 'ines' as ImageKey, since: 2011, quote: 'Rest is a skill. We practise it like any other.', tags: ['Yin', 'Meditation'] },
];

const T = { mara: 'Mara', nadia: 'Nadia', lea: 'Léa', ines: 'Inès' };
type Slot = { time: string; cls: ClassId; teacher: keyof typeof T; cap: number; taken: number };

/** Weekly template, Monday first. `taken` fakes current bookings so some classes are nearly full. */
export const week: Slot[][] = [
  [
    { time: '07:00', cls: 'reformer', teacher: 'mara', cap: 8, taken: 7 },
    { time: '08:15', cls: 'breath', teacher: 'ines', cap: 14, taken: 5 },
    { time: '12:30', cls: 'mat', teacher: 'nadia', cap: 14, taken: 9 },
    { time: '18:00', cls: 'reformer', teacher: 'nadia', cap: 8, taken: 8 },
    { time: '19:30', cls: 'yin', teacher: 'ines', cap: 14, taken: 11 },
  ],
  [
    { time: '06:45', cls: 'vinyasa', teacher: 'lea', cap: 14, taken: 6 },
    { time: '09:30', cls: 'reformer', teacher: 'mara', cap: 8, taken: 3 },
    { time: '13:00', cls: 'breath', teacher: 'ines', cap: 14, taken: 4 },
    { time: '18:15', cls: 'mat', teacher: 'nadia', cap: 14, taken: 12 },
    { time: '19:45', cls: 'vinyasa', teacher: 'lea', cap: 14, taken: 10 },
  ],
  [
    { time: '07:00', cls: 'reformer', teacher: 'nadia', cap: 8, taken: 6 },
    { time: '12:30', cls: 'reformer', teacher: 'mara', cap: 8, taken: 8 },
    { time: '17:45', cls: 'yin', teacher: 'ines', cap: 14, taken: 7 },
    { time: '19:00', cls: 'reformer', teacher: 'mara', cap: 8, taken: 5 },
  ],
  [
    { time: '06:45', cls: 'vinyasa', teacher: 'lea', cap: 14, taken: 8 },
    { time: '09:30', cls: 'mat', teacher: 'nadia', cap: 14, taken: 4 },
    { time: '13:00', cls: 'reformer', teacher: 'nadia', cap: 8, taken: 7 },
    { time: '18:00', cls: 'vinyasa', teacher: 'lea', cap: 14, taken: 13 },
    { time: '19:30', cls: 'breath', teacher: 'ines', cap: 14, taken: 3 },
  ],
  [
    { time: '07:00', cls: 'reformer', teacher: 'mara', cap: 8, taken: 4 },
    { time: '12:30', cls: 'mat', teacher: 'nadia', cap: 14, taken: 6 },
    { time: '18:00', cls: 'yin', teacher: 'ines', cap: 14, taken: 9 },
  ],
  [
    { time: '09:00', cls: 'reformer', teacher: 'mara', cap: 8, taken: 8 },
    { time: '10:15', cls: 'vinyasa', teacher: 'lea', cap: 14, taken: 11 },
    { time: '11:45', cls: 'mat', teacher: 'nadia', cap: 14, taken: 7 },
  ],
  [
    { time: '10:00', cls: 'yin', teacher: 'ines', cap: 14, taken: 10 },
    { time: '11:30', cls: 'breath', teacher: 'ines', cap: 14, taken: 6 },
  ],
];
export const teacherName = T;

export const finder = {
  title: 'Not sure where to start?',
  text: 'Three questions, and we’ll point you to the class that fits.',
  questions: [
    {
      q: 'How do you want to feel afterwards?',
      options: [
        { label: 'Stronger', w: { reformer: 3, mat: 2 } },
        { label: 'Energised', w: { vinyasa: 3, reformer: 1 } },
        { label: 'Calmer', w: { breath: 3, yin: 2 } },
        { label: 'Looser', w: { yin: 3, mat: 1, vinyasa: 1 } },
      ],
    },
    {
      q: 'How familiar is this for you?',
      options: [
        { label: 'Totally new', w: { mat: 1, yin: 1, breath: 1 } },
        { label: 'I’ve tried it', w: { reformer: 1 } },
        { label: 'I practise often', w: { vinyasa: 1, reformer: 1 } },
      ],
    },
    {
      q: 'When do you like to practise?',
      options: [
        { label: 'Early morning', w: {}, period: 'am' },
        { label: 'Around lunch', w: {}, period: 'mid' },
        { label: 'After work', w: {}, period: 'pm' },
      ],
    },
  ] as { q: string; options: { label: string; w: Partial<Record<ClassId, number>>; period?: 'am' | 'mid' | 'pm' }[] }[],
};

export const pricing = {
  title: 'Simple, honest pricing.',
  intro: { name: 'Intro offer', price: 45, text: 'Three classes of anything, within 14 days. New students only.' },
  dropIn: 28,
  pack: { size: 10, price: 230, valid: '4 months' },
  unlimited: { price: 219, text: 'Unlimited classes, monthly, cancel with 30 days’ notice' },
};

export const reviews = [
  { text: 'I came for my back and stayed for the people. Two years in, I’m stronger than I was at twenty-five.', name: 'Eleni K.', note: 'Reformer, 3× a week' },
  { text: 'The Sunday yin class is the reason my week works. It’s the calmest room in Athens.', name: 'Stefan M.', note: 'Yin & Restore' },
  { text: 'Teachers who actually watch you and adjust you. Small classes make all the difference.', name: 'Sofia D.', note: 'Mat & Reformer' },
  { text: 'I was nervous about my first class. Mara remembered my name and my knee by the second.', name: 'Anna P.', note: 'Started this spring' },
];

export const firstVisit = [
  'Arrive ten minutes early — we’ll show you around.',
  'Wear something you can move in. Grip socks for reformer (we sell them).',
  'Mats, props, towels and filtered water are all here.',
  'Tell your teacher about any injuries; every class can be adapted.',
];
