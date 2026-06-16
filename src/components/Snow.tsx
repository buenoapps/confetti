import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

/**
 * Gently falling snowflakes for the "Winter" background. Each flake loops from
 * above the screen to below it on the native thread, swaying side to side as it
 * drifts down.
 */

const FLAKE_COUNT = 36;

function Flake({
  x,
  size,
  duration,
  delay,
  height,
}: {
  x: number;
  size: number;
  duration: number;
  delay: number;
  height: number;
}) {
  const fall = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(fall, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    const timer = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(timer);
      loop.stop();
    };
  }, []);

  // Fall from just above the top edge to just below the bottom edge.
  const translateY = fall.interpolate({
    inputRange: [0, 1],
    outputRange: [-size, height + size],
  });
  // Gentle side-to-side sway as the flake falls.
  const translateX = fall.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 14, 0, -14, 0],
  });

  return (
    <Animated.Text
      style={{
        position: 'absolute',
        left: x,
        top: 0,
        fontSize: size,
        color: 'rgba(255,255,255,0.95)',
        transform: [{ translateY }, { translateX }],
      }}
    >
      ❄
    </Animated.Text>
  );
}

export function Snow() {
  const { width, height } = useWindowDimensions();

  const flakes = useMemo(
    () =>
      Array.from({ length: FLAKE_COUNT }).map((_, i) => ({
        key: i,
        x: Math.random() * width,
        size: 8 + Math.random() * 16,
        duration: 5000 + Math.random() * 6000,
        delay: Math.random() * 6000,
      })),
    [width]
  );

  return (
    <Animated.View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {flakes.map((f) => (
        <Flake
          key={f.key}
          x={f.x}
          size={f.size}
          duration={f.duration}
          delay={f.delay}
          height={height}
        />
      ))}
    </Animated.View>
  );
}
