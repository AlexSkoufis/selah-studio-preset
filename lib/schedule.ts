import { classes, studio, week, type ClassId } from './content';

export const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const DAY_LONG = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export const classById = (id: ClassId) => classes.find((c) => c.id === id)!;

/** Studio-local time: weekday (0 = Monday) and minutes since midnight. */
export function studioNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: studio.tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return { day: DAY_SHORT.indexOf(get('weekday')), min: Number(get('hour')) * 60 + Number(get('minute')) };
}

/** The next class that hasn't started yet, searching up to a week ahead. */
export function nextClass(now = studioNow()) {
  for (let d = 0; d < 7; d++) {
    const day = (now.day + d) % 7;
    const slot = week[day].find((s) => d > 0 || toMin(s.time) > now.min);
    if (slot) return { ...slot, day, inDays: d };
  }
  return null;
}

/** Open/closed status for the visit section. */
export function openStatus(now = studioNow()) {
  const [o, c] = studio.hours[now.day].map(toMin);
  if (now.min >= o && now.min < c) return { open: true, text: `Open now · closes ${studio.hours[now.day][1]}` };
  const opensToday = now.min < o;
  const nd = opensToday ? now.day : (now.day + 1) % 7;
  return { open: false, text: `Closed · opens ${opensToday ? 'today' : DAY_LONG[nd]} at ${studio.hours[nd][0]}` };
}

export const period = (t: string): 'am' | 'mid' | 'pm' => (toMin(t) < 11 * 60 ? 'am' : toMin(t) < 16 * 60 ? 'mid' : 'pm');
