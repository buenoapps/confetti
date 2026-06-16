import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

/**
 * A puff of smoke. Unlike confetti there is no gravity: each puff drifts
 * outward in its own random direction, swelling as it goes and fading away,
 * so a tap looks like smoke dispersing in every direction.
 */

const BOX = 64;
// Covers the slowest puff (see `duration` below).
export const SMOKE_DURATION = 2600;

type Props = {
  speedMultiplier: number;
};

function SmokeComponent({ speedMultiplier }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  const config = useRef(
    (() => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 60 + Math.random() * 110;
      const steps = [0, 0.5, 1];
      const xs = steps.map((t) => Math.cos(angle) * distance * t);
      const ys = steps.map((t) => Math.sin(angle) * distance * t);
      const duration = (1700 + Math.random() * 900) * speedMultiplier;
      const spin = (Math.random() - 0.5) * 90;
      const fontSize = 30 + Math.random() * 22;
      return { steps, xs, ys, duration, spin, fontSize };
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
    inputRange: [0, 0.15, 1],
    outputRange: [0, 0.8, 0],
  });
  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1.8],
  });
  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${config.spin}deg`],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.box,
        {
          opacity,
          transform: [{ translateX }, { translateY }, { rotate }, { scale }],
        },
      ]}
    >
      <Text style={{ fontSize: config.fontSize }}>💨</Text>
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

export const SmokeParticle = React.memo(SmokeComponent);
