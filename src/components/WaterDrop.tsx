import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

/**
 * A single water droplet. It pops up where the finger touched, clings there for
 * a short moment, then slowly slides down the "glass" — gaining a little speed
 * and stretching slightly, like a drop running down a window — before fading.
 */

const BOX = 80;
// Covers the slowest droplet (see `duration` below) so the layer keeps it
// mounted until it has fully slid down and faded.
export const WATER_DURATION = 4800;

type Props = {
  speedMultiplier: number;
};

function WaterDropComponent({ speedMultiplier }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  const config = useRef(
    (() => {
      const size = 20 + Math.random() * 16;
      const drop = 150 + Math.random() * 170; // how far it slides down
      const drift = (Math.random() - 0.5) * 22; // slight sideways wander
      const duration = (3600 + Math.random() * 1200) * speedMultiplier;
      return { size, drop, drift, duration };
    })()
  ).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: config.duration,
      useNativeDriver: true,
    }).start();
  }, []);

  // Clings near the top for the first quarter, then accelerates downward.
  const translateY = progress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 0, config.drop * 0.15, config.drop * 0.5, config.drop],
  });
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, config.drift],
  });
  const scale = progress.interpolate({
    inputRange: [0, 0.12, 1],
    outputRange: [0.3, 1, 1],
  });
  // Stretches vertically a touch as it starts to run.
  const scaleY = progress.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [1, 1, 1.3],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.1, 0.8, 1],
    outputRange: [0, 0.9, 0.9, 0],
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
        style={[
          styles.drop,
          {
            width: config.size,
            height: config.size,
            borderRadius: config.size / 2,
            transform: [{ scaleY }],
          },
        ]}
      >
        <View
          style={[
            styles.shine,
            {
              width: config.size * 0.28,
              height: config.size * 0.28,
              borderRadius: config.size * 0.14,
              top: config.size * 0.18,
              left: config.size * 0.2,
            },
          ]}
        />
      </Animated.View>
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
  drop: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(170,215,255,0.4)',
  },
  shine: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
});

export const WaterDrop = React.memo(WaterDropComponent);
