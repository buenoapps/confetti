import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BACKGROUNDS, type BackgroundId } from '../theme';
import { Stars } from './Stars';
import { Bubbles } from './Bubbles';
import { Clouds } from './Clouds';
import { Snow } from './Snow';
import { Jungle } from './Jungle';

/**
 * Renders the selected background: a full-screen gradient plus optional
 * animated decorations (stars for space, bubbles for the ocean, drifting
 * clouds for the sky, falling snow for winter and a shadowy treeline with a
 * lurking creature for the jungle).
 */

type Props = {
  background: BackgroundId;
};

export function Background({ background }: Props) {
  const option =
    BACKGROUNDS.find((b) => b.id === background) ?? BACKGROUNDS[0];

  return (
    <LinearGradient
      colors={option.gradient}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={StyleSheet.absoluteFill}
    >
      {background === 'space' && <Stars />}
      {background === 'underwater' && <Bubbles />}
      {background === 'clouds' && <Clouds />}
      {background === 'winter' && <Snow />}
      {background === 'jungle' && <Jungle />}
    </LinearGradient>
  );
}
