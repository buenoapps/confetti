import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

/**
 * Bubbles slowly rising for the "Ocean" background.
 * Each bubble loops from below the screen to above it on the native thread.
 */

const BUBBLE_COUNT = 16;

function Bubble({
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
  const rise = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rise, {
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

  const translateY = rise.interpolate({
    inputRange: [0, 1],
    outputRange: [height + size, -size],
  });
  // Gentle side-to-side sway as the bubble rises.
  const translateX = rise.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 12, 0, -12, 0],
  });
  const opacity = rise.interpolate({
    inputRange: [0, 0.1, 0.85, 1],
    outputRange: [0, 0.5, 0.5, 0],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        bottom: 0,
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.7)',
        backgroundColor: 'rgba(255,255,255,0.12)',
        opacity,
        transform: [{ translateY }, { translateX }],
      }}
    />
  );
}

export function Bubbles() {
  const { width, height } = useWindowDimensions();

  const bubbles = useMemo(
    () =>
      Array.from({ length: BUBBLE_COUNT }).map((_, i) => {
        const size = 10 + Math.random() * 32;
        return {
          key: i,
          x: Math.random() * width,
          size,
          duration: 6000 + Math.random() * 6000,
          delay: Math.random() * 6000,
        };
      }),
    [width]
  );

  return (
    <Animated.View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {bubbles.map((b) => (
        <Bubble
          key={b.key}
          x={b.x}
          size={b.size}
          duration={b.duration}
          delay={b.delay}
          height={height}
        />
      ))}
    </Animated.View>
  );
}
