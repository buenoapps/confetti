import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  useWindowDimensions,
} from 'react-native';

/**
 * A single snowflake spawned by a tap. It pops outward briefly (like a confetti
 * piece) and then falls all the way off the bottom of the screen extremely
 * slowly, swaying and turning the whole way down. Only a few are spawned per
 * tap so they linger on screen without crowding it.
 */

const BOX = 48;
// Very long: the flake should drift off-screen super slowly. Covers the
// slowest flake (see `duration` below).
export const SNOW_DURATION = 17000;

type Props = {
  speedMultiplier: number;
};

function SnowComponent({ speedMultiplier }: Props) {
  const { height } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;

  const config = useRef(
    (() => {
      const angle = Math.random() * Math.PI * 2;
      const pop = 30 + Math.random() * 45; // initial outward float
      const popX = Math.cos(angle) * pop;
      const popY = Math.sin(angle) * pop;
      const sway = (Math.random() - 0.5) * 70;
      const fall = height + 80; // travel past the bottom edge
      const duration = (12000 + Math.random() * 5000) * speedMultiplier;
      const fontSize = 18 + Math.random() * 16;
      const spin = (Math.random() < 0.5 ? -1 : 1) * (120 + Math.random() * 240);
      return { popX, popY, sway, fall, duration, fontSize, spin };
    })()
  ).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: config.duration,
      useNativeDriver: true,
    }).start();
  }, []);

  // Quick outward pop (0 -> 0.08), then a long, slow fall with gentle sway.
  const translateX = progress.interpolate({
    inputRange: [0, 0.08, 0.4, 0.7, 1],
    outputRange: [
      0,
      config.popX,
      config.popX + config.sway,
      config.popX - config.sway,
      config.popX + config.sway * 0.5,
    ],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 0.08, 1],
    outputRange: [0, config.popY, config.fall],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.05, 0.9, 1],
    outputRange: [0, 1, 1, 0],
  });
  const scale = progress.interpolate({
    inputRange: [0, 0.08, 1],
    outputRange: [0.2, 1, 1],
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
      <Text style={{ fontSize: config.fontSize, color: '#fff' }}>❄️</Text>
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

export const SnowParticle = React.memo(SnowComponent);
