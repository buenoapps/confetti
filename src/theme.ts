import type { ColorValue } from 'react-native';

/**
 * Central place for all the playful options the kids can pick from.
 * Keeping the data here (instead of scattered in components) makes it easy
 * to add new themes or explosion styles later.
 */

export type BackgroundId = 'dark' | 'space' | 'underwater';
export type ExplosionId = 'confetti' | 'emojis' | 'alphabet';

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
