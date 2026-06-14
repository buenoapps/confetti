import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

/**
 * A field of softly twinkling stars for the "Space" background.
 * Each star loops an opacity + scale animation on the native thread.
 */

const STAR_COUNT = 48;

function Star({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  const twinkle = useRef(new Animated.Value(Math.random())).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(twinkle, {
          toValue: 1,
          duration: 900 + Math.random() * 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(twinkle, {
          toValue: 0.2,
          duration: 900 + Math.random() * 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    const timer = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(timer);
      loop.stop();
    };
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#fff',
        opacity: twinkle,
        transform: [{ scale: twinkle }],
      }}
    />
  );
}

export function Stars() {
  const { width, height } = useWindowDimensions();

  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }).map((_, i) => ({
        key: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1.5 + Math.random() * 3.5,
        delay: Math.random() * 1500,
      })),
    [width, height]
  );

  return (
    <Animated.View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {stars.map((s) => (
        <Star key={s.key} x={s.x} y={s.y} size={s.size} delay={s.delay} />
      ))}
    </Animated.View>
  );
}
