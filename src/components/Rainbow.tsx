import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RAINBOW_COLORS } from '../theme';

/**
 * A big rainbow that blooms out of the touch point. It is built from several
 * concentric colored rings (so it reads as radial bands of color) centered on
 * the finger, gently expanding and fading. The area above the touch stays
 * clear while a soft white fog washes over the lower part of the screen.
 */

export const RAINBOW_DURATION = 2600;

type Props = {
  /** Touch position, in the layer's coordinate space. */
  x: number;
  y: number;
  speedMultiplier: number;
};

function RainbowComponent({ x, y, speedMultiplier }: Props) {
  const { width, height } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: RAINBOW_DURATION * speedMultiplier,
      useNativeDriver: true,
    }).start();
  }, []);

  const opacity = progress.interpolate({
    inputRange: [0, 0.15, 0.7, 1],
    outputRange: [0, 0.9, 0.9, 0],
  });
  // Bloom outward from the touch point (the rings container is anchored there).
  const scale = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 1, 1.08],
  });

  // Ring thickness scales with the screen so the rainbow spans it.
  const thickness = Math.max(width, height) * 0.06;
  const innerRadius = 40;

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity }]}>
      {/* Zero-size anchor at the touch point so the bloom scales around it. */}
      <Animated.View
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: 0,
          height: 0,
          transform: [{ scale }],
        }}
      >
        {RAINBOW_COLORS.map((color, i) => {
          // Outer ring (i = 0) is the largest; rings tile into one rainbow band.
          const outerR = innerRadius + (RAINBOW_COLORS.length - i) * thickness;
          return (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: -outerR,
                top: -outerR,
                width: outerR * 2,
                height: outerR * 2,
                borderRadius: outerR,
                borderWidth: thickness,
                borderColor: color,
                backgroundColor: 'transparent',
              }}
            />
          );
        })}
      </Animated.View>

      {/* Clear at the top, foggy toward the bottom. */}
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.45)']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
    </Animated.View>
  );
}

export const RainbowEffect = React.memo(RainbowComponent);
