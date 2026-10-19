import type { ClassId } from './content';

/** Tiny event bus so other sections can open the timetable on a given class (and period). */
export type FilterDetail = { cls: ClassId | 'all'; period?: 'am' | 'mid' | 'pm' };

export function showTimes(detail: FilterDetail) {
  window.dispatchEvent(new CustomEvent<FilterDetail>('selah:filter', { detail }));
}

export function onShowTimes(fn: (d: FilterDetail) => void) {
  const h = (e: Event) => fn((e as CustomEvent<FilterDetail>).detail);
  window.addEventListener('selah:filter', h);
  return () => window.removeEventListener('selah:filter', h);
}
