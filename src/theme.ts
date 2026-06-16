import type { ColorValue } from 'react-native';

/**
 * Central place for all the playful options the kids can pick from.
 * Keeping the data here (instead of scattered in components) makes it easy
 * to add new themes or explosion styles later.
 */

export type BackgroundId =
  | 'dark'
  | 'space'
  | 'underwater'
  | 'sky'
  | 'clouds'
  | 'jungle'
  | 'winter';
export type ExplosionId =
  | 'confetti'
  | 'emojis'
  | 'alphabet'
  | 'stars'
  | 'fire'
  | 'firework'
  | 'water'
  | 'smoke'
  | 'lightning'
  | 'rainbow'
  | 'snowflakes'
  | 'strawberries';
export type SpeedId = 'slow' | 'medium' | 'fast';
export type AmountId = 'few' | 'medium' | 'many';

export type BackgroundOption = {
  id: BackgroundId;
  label: string;
  /** Emoji shown on the settings button so non-readers can recognise it. */
  icon: string;
  /** Two (or more) colors used for the background gradient. */
  gradient: readonly [ColorValue, ColorValue, ...ColorValue[]];
};

export type ExplosionOption = {
  id: ExplosionId;
  label: string;
  icon: string;
};

export type SpeedOption = {
  id: SpeedId;
  label: string;
  icon: string;
  /** Multiplies a particle's animation duration. Fast = 1 (the baseline). */
  durationMultiplier: number;
};

export type AmountOption = {
  id: AmountId;
  label: string;
  icon: string;
  /** Number of particles per explosion. */
  count: number;
};

export const BACKGROUNDS: BackgroundOption[] = [
  {
    id: 'dark',
    label: 'Night',
    icon: '🌙',
    gradient: ['#0b1026', '#161b3a', '#05060f'],
  },
  {
    id: 'space',
    label: 'Space',
    icon: '🚀',
    gradient: ['#1b1340', '#3a1a5e', '#06030f'],
  },
  {
    id: 'underwater',
    label: 'Ocean',
    icon: '🐠',
    gradient: ['#0a4f8a', '#0e7fb8', '#021a33'],
  },
  {
    id: 'sky',
    label: 'Blue Sky',
    icon: '☀️',
    gradient: ['#2f9be0', '#7cc7f5', '#cdebff'],
  },
  {
    id: 'clouds',
    label: 'Clouds',
    icon: '☁️',
    gradient: ['#3aa3e6', '#86cdf6', '#e8f6ff'],
  },
  {
    id: 'jungle',
    label: 'Jungle',
    icon: '🌴',
    gradient: ['#0f3d1d', '#08260f', '#030d06'],
  },
  {
    id: 'winter',
    label: 'Winter',
    icon: '⛄',
    gradient: ['#8ec9e6', '#c4e4f2', '#eef7fb'],
  },
];

export const EXPLOSIONS: ExplosionOption[] = [
  { id: 'confetti', label: 'Confetti', icon: '🎉' },
  { id: 'emojis', label: 'Emojis', icon: '😄' },
  { id: 'alphabet', label: 'Letters', icon: '🔤' },
  { id: 'stars', label: 'Stars', icon: '⭐' },
  { id: 'fire', label: 'Fire', icon: '🔥' },
  { id: 'firework', label: 'Firework', icon: '🎆' },
  { id: 'water', label: 'Water', icon: '💧' },
  { id: 'smoke', label: 'Smoke', icon: '💨' },
  { id: 'lightning', label: 'Lightning', icon: '⚡' },
  { id: 'rainbow', label: 'Rainbow', icon: '🌈' },
  { id: 'snowflakes', label: 'Snow', icon: '❄️' },
  { id: 'strawberries', label: 'Berries', icon: '🍓' },
];

// Fast is the original speed (multiplier 1); the others slow the motion down.
export const SPEEDS: SpeedOption[] = [
  { id: 'slow', label: 'Slow', icon: '🐢', durationMultiplier: 2.4 },
  { id: 'medium', label: 'Medium', icon: '🚶', durationMultiplier: 1.6 },
  { id: 'fast', label: 'Fast', icon: '⚡', durationMultiplier: 1 },
];

// Medium is the original amount; few/many are the lighter/heavier variants.
export const AMOUNTS: AmountOption[] = [
  { id: 'few', label: 'Few', icon: '🤏', count: 12 },
  { id: 'medium', label: 'Medium', icon: '✋', count: 24 },
  { id: 'many', label: 'Many', icon: '💥', count: 44 },
];

/** Bright, high-contrast colors that pop on every background. */
export const CONFETTI_COLORS = [
  '#FF3B6B',
  '#FF8A3D',
  '#FFD23D',
  '#3DFF88',
  '#3DD2FF',
  '#7B5BFF',
  '#FF5BE7',
  '#FFFFFF',
];

export const EXPLOSION_EMOJIS = [
  '⭐',
  '❤️',
  '🌈',
  '🎈',
  '🐶',
  '🐱',
  '🦄',
  '🍭',
  '🍦',
  '🌸',
  '⚡',
  '🦋',
];

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * Emoji sets for the simple emoji-based explosions that reuse the confetti
 * motion (see `Particle.tsx`). The richer effects — firework, water, smoke,
 * lightning, rainbow and snow — have their own dedicated components and are not
 * listed here.
 */
export const EXPLOSION_GLYPHS: Partial<Record<ExplosionId, string[]>> = {
  stars: ['⭐', '🌟', '✨', '💫'],
  fire: ['🔥'],
  strawberries: ['🍓'],
};

/** Rainbow colors, from the outer ring inward, for the "Rainbow" effect. */
export const RAINBOW_COLORS = [
  '#FF3B3B',
  '#FF8A3D',
  '#FFD23D',
  '#3DFF88',
  '#3DD2FF',
  '#7B5BFF',
  '#FF5BE7',
];

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
