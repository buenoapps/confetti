import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import {
  ALPHABET,
  CONFETTI_COLORS,
  EXPLOSION_EMOJIS,
  EXPLOSION_GLYPHS,
  pick,
  type ExplosionId,
} from '../theme';

/**
 * A single flying piece of an explosion.
 *
 * Every particle owns one `Animated.Value` (a linear 0 -> 1 progress) that is
 * driven on the native UI thread (`useNativeDriver: true`). All of the motion
 * is expressed as interpolations of that single value, so the JS thread does no
 * per-frame work — that is what keeps things smooth even with many particles.
 */

// Fixed square box so we can center any kind of content (rectangle, emoji or
// letter) exactly on the touch point.
const BOX = 48;
const GRAVITY = 900; // pixels, pulls particles back down for a natural fall

// Longest a particle can animate at the baseline (fast) speed. Exported so the
// explosion layer knows how long to keep an explosion mounted.
export const PARTICLE_MAX_DURATION = 1800;

type Props = {
  type: ExplosionId;
  /** Multiplies the animation duration (1 = fast baseline, higher = slower). */
  speedMultiplier: number;
  /** Called once the particle has finished animating. */
  onDone?: () => void;
};

function ParticleComponent({ type, speedMultiplier, onDone }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  // Everything random is computed once and frozen for the particle's lifetime.
  const config = useRef(
    (() => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 90 + Math.random() * 200;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const duration = (1100 + Math.random() * 700) * speedMultiplier;

      // Sample the parabolic trajectory at a handful of points so the native
      // interpolation can reproduce the arc (out + gravity fall).
      const steps = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1];
      const xs = steps.map((t) => vx * t);
      const ys = steps.map((t) => vy * t + 0.5 * GRAVITY * t * t * 0.6);

      const spin = (Math.random() < 0.5 ? -1 : 1) * (180 + Math.random() * 720);

      // Pick the right glyph for emoji-based explosions.
      const glyphs = EXPLOSION_GLYPHS[type];
      const glyph =
        type === 'emojis'
          ? pick(EXPLOSION_EMOJIS)
          : glyphs
          ? pick(glyphs)
          : pick(ALPHABET);

      return {
        steps,
        xs,
        ys,
        duration,
        spin,
        color: pick(CONFETTI_COLORS),
        isCircle: Math.random() < 0.35,
        size: 9 + Math.random() * 9,
        glyph,
        glyphSize: 26 + Math.random() * 18,
        fontColor: pick(CONFETTI_COLORS),
      };
    })()
  ).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: config.duration,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onDone?.();
    });
  }, []);

  const translateX = progress.interpolate({
    inputRange: config.steps,
    outputRange: config.xs,
  });
  const translateY = progress.interpolate({
    inputRange: config.steps,
    outputRange: config.ys,
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 1, 0],
  });
  const scale = progress.interpolate({
    inputRange: [0, 0.12, 1],
    outputRange: [0.2, 1, 0.9],
  });
  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${config.spin}deg`],
  });

  const animatedStyle = {
    opacity,
    transform: [{ translateX }, { translateY }, { rotate }, { scale }],
  };

  // Confetti is drawn as solid paper pieces; everything else here is a glyph.
  if (type === 'confetti') {
    return (
      <Animated.View style={[styles.box, animatedStyle]}>
        <Animated.View
          style={{
            width: config.size,
            height: config.isCircle ? config.size : config.size * 1.6,
            borderRadius: config.isCircle ? config.size / 2 : 2,
            backgroundColor: config.color,
          }}
        />
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.box, animatedStyle]} pointerEvents="none">
      <Text
        style={{
          fontSize: config.glyphSize,
          color: config.fontColor,
          fontWeight: '800',
        }}
      >
        {config.glyph}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    left: -BOX / 2,
    top: -BOX / 2,
    width: BOX,
    height: BOX,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const Particle = React.memo(ParticleComponent);
