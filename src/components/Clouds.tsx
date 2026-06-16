import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

/**
 * Soft white clouds drifting slowly across the "Blue Sky with clouds"
 * background. Each cloud loops from off the left edge to off the right edge on
 * the native thread, so the JS thread does no per-frame work.
 */

const CLOUD_COUNT = 6;

function Cloud({
  y,
  scale,
  duration,
  delay,
  width,
}: {
  y: number;
  scale: number;
  duration: number;
  delay: number;
  width: number;
}) {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(drift, {
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

  // Travel from just off the left edge to just off the right edge.
  const translateX = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [-180, width + 180],
  });

  // A cloud is a few overlapping white blobs grouped together.
  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: y,
        left: 0,
        opacity: 0.9,
        transform: [{ translateX }, { scale }],
      }}
    >
      <Animated.View style={[styles.puff, { width: 90, height: 50, left: 0, bottom: 0 }]} />
      <Animated.View style={[styles.puff, { width: 70, height: 70, left: 40 }]} />
      <Animated.View style={[styles.puff, { width: 80, height: 56, left: 78, bottom: 0 }]} />
      <Animated.View style={[styles.puff, { width: 120, height: 38, left: 18, bottom: 0 }]} />
    </Animated.View>
  );
}

export function Clouds() {
  const { width, height } = useWindowDimensions();

  const clouds = useMemo(
    () =>
      Array.from({ length: CLOUD_COUNT }).map((_, i) => ({
        key: i,
        y: Math.random() * height * 0.6,
        scale: 0.6 + Math.random() * 0.9,
        duration: 18000 + Math.random() * 16000,
        delay: Math.random() * 12000,
      })),
    [height]
  );

  return (
    <Animated.View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {clouds.map((c) => (
        <Cloud
          key={c.key}
          y={c.y}
          scale={c.scale}
          duration={c.duration}
          delay={c.delay}
          width={width}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  puff: {
    position: 'absolute',
    bottom: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
});
