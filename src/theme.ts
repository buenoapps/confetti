import type { ColorValue } from 'react-native';

/**
 * Central place for all the playful options the kids can pick from.
 * Keeping the data here (instead of scattered in components) makes it easy
 * to add new themes or explosion styles later.
 */

export type BackgroundId = 'dark' | 'space' | 'underwater';
export type ExplosionId = 'confetti' | 'emojis' | 'alphabet';
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
];

export const EXPLOSIONS: ExplosionOption[] = [
  { id: 'confetti', label: 'Confetti', icon: '🎉' },
  { id: 'emojis', label: 'Emojis', icon: '😄' },
  { id: 'alphabet', label: 'Letters', icon: '🔤' },
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

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
