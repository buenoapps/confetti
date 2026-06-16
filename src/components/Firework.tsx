import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { CONFETTI_COLORS, pick } from '../theme';

/**
 * A single spark of a firework: a small glowing dot that shoots out from the
 * center, decelerating as it flies, with a touch of gravity at the end before
 * it fades. Sparks are spread evenly around the circle (via `index`/`total`)
 * so a tap reads as a classic radial firework burst rather than confetti.
 */

const BOX = 10;
export const FIREWORK_DURATION = 1700;

type Props = {
  index: number;
  total: number;
  speedMultiplier: number;
};

function FireworkComponent({ index, total, speedMultiplier }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  const config = useRef(
    (() => {
      // Even angle around the circle plus a little jitter for a natural burst.
      const angle = (index / total) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const distance = 110 + Math.random() * 130;
      const steps = [0, 0.2, 0.4, 0.6, 0.8, 1];
      // Decelerating outward travel (ease-out) plus a small gravity droop.
      const radial = steps.map((t) => distance * (1 - (1 - t) * (1 - t)));
      const xs = radial.map((r) => Math.cos(angle) * r);
      const ys = radial.map(
        (r, i) => Math.sin(angle) * r + 70 * steps[i] * steps[i]
      );
      const duration = (1200 + Math.random() * 500) * speedMultiplier;
      return {
        steps,
        xs,
        ys,
        duration,
        color: pick(CONFETTI_COLORS),
        size: 4 + Math.random() * 4,
      };
    })()
  ).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: config.duration,
      useNativeDriver: true,
    }).start();
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
    inputRange: [0, 0.1, 0.7, 1],
    outputRange: [0, 1, 1, 0],
  });
  const scale = progress.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [0.4, 1.2, 0.5],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.box,
        { opacity, transform: [{ translateX }, { translateY }, { scale }] },
      ]}
    >
      <Animated.View
        style={{
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          backgroundColor: config.color,
        }}
      />
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

export const FireworkParticle = React.memo(FireworkComponent);
