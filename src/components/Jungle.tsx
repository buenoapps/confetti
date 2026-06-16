import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * Decorations for the dark "Jungle" background: a silhouetted treeline, a
 * couple of darkening overlays for a deep, shadowy mood, and a hidden creature
 * lurking in the leaves whose glowing eyes blink from time to time — you can
 * never quite make out what it is.
 */

// Near-black greens so the trees read as silhouettes against the dark sky.
const TREE_BACK = '#06170d';
const TREE_FRONT = '#020c06';

type Shape = {
  left: number;
  bottom: number;
  size: number;
  /** Rectangles (trunks) aren't circular; everything else is a round blob. */
  trunk?: boolean;
  color: string;
};

/** Builds the shapes (a trunk + a few canopy blobs) that make up one tree. */
function buildTree(baseX: number, scale: number, color: string): Shape[] {
  const trunkW = 14 * scale;
  const trunkH = 70 * scale;
  const canopy = trunkH - 12 * scale;
  const blobs = [
    { dx: 0, dy: 44 * scale, s: 86 * scale },
    { dx: -36 * scale, dy: 18 * scale, s: 62 * scale },
    { dx: 36 * scale, dy: 20 * scale, s: 62 * scale },
    { dx: 0, dy: 74 * scale, s: 58 * scale },
  ];
  return [
    { left: baseX - trunkW / 2, bottom: 0, size: trunkW, trunk: true, color },
    ...blobs.map((b) => ({
      left: baseX + b.dx - b.s / 2,
      bottom: canopy + b.dy - b.s / 2,
      size: b.s,
      color,
    })),
  ];
}

function Tree({ shapes, trunkH }: { shapes: Shape[]; trunkH: number }) {
  return (
    <>
      {shapes.map((s, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: s.left,
            bottom: s.bottom,
            width: s.size,
            height: s.trunk ? trunkH : s.size,
            borderRadius: s.trunk ? 4 : s.size / 2,
            backgroundColor: s.color,
          }}
        />
      ))}
    </>
  );
}

/** Two faint glowing eyes that blink at random intervals. */
function Eyes({ left, top, eyeSize, gap }: { left: number; top: number; eyeSize: number; gap: number }) {
  const open = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let active = true;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const blinkOnce = (cb?: () => void) =>
      Animated.sequence([
        Animated.timing(open, { toValue: 0, duration: 80, useNativeDriver: true }),
        Animated.timing(open, { toValue: 1, duration: 130, useNativeDriver: true }),
      ]).start(({ finished }) => finished && cb?.());

    const schedule = () => {
      if (!active) return;
      const delay = 2200 + Math.random() * 4800;
      const t = setTimeout(() => {
        if (!active) return;
        // Every so often the creature blinks twice in quick succession.
        if (Math.random() < 0.3) blinkOnce(() => blinkOnce(schedule));
        else blinkOnce(schedule);
      }, delay);
      timers.push(t);
    };

    schedule();
    return () => {
      active = false;
      timers.forEach(clearTimeout);
      open.stopAnimation();
    };
  }, []);

  const glow = eyeSize * 2.4;

  const Eye = () => (
    <Animated.View
      style={{
        width: glow,
        height: glow,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: open,
      }}
    >
      <View
        style={{
          position: 'absolute',
          width: glow,
          height: glow,
          borderRadius: glow / 2,
          backgroundColor: 'rgba(255,206,84,0.18)',
        }}
      />
      <Animated.View
        style={{
          width: eyeSize,
          height: eyeSize * 0.72,
          borderRadius: eyeSize / 2,
          backgroundColor: '#ffce54',
          transform: [{ scaleY: open }],
        }}
      />
    </Animated.View>
  );

  return (
    <View style={{ position: 'absolute', left, top, flexDirection: 'row', alignItems: 'center' }}>
      <Eye />
      <View style={{ width: gap }} />
      <Eye />
    </View>
  );
}

export function Jungle() {
  const { width, height } = useWindowDimensions();

  const trees = useMemo(() => {
    // A back row of slightly lighter, smaller trees and a darker front row.
    const back = Array.from({ length: 5 }).map((_, i) => {
      const baseX = (width / 5) * (i + 0.5) + (Math.random() - 0.5) * 30;
      const scale = 0.7 + Math.random() * 0.3;
      return { shapes: buildTree(baseX, scale, TREE_BACK), trunkH: 70 * scale };
    });
    const front = Array.from({ length: 4 }).map((_, i) => {
      const baseX = (width / 4) * (i + 0.5) + (Math.random() - 0.5) * 40;
      const scale = 1 + Math.random() * 0.5;
      return { shapes: buildTree(baseX, scale, TREE_FRONT), trunkH: 70 * scale };
    });
    return [...back, ...front];
  }, [width]);

  // Tuck the eyes into the dark canopy, off to one side.
  const eyes = useMemo(
    () => ({
      left: width * (0.45 + Math.random() * 0.25),
      top: height * (0.5 + Math.random() * 0.18),
    }),
    [width, height]
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* Overall darkening for a deep, shadowy jungle. */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.28)' }]} />
      {/* Heavier shadow creeping up from the forest floor. */}
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      {trees.map((t, i) => (
        <Tree key={i} shapes={t.shapes} trunkH={t.trunkH} />
      ))}
      <Eyes left={eyes.left} top={eyes.top} eyeSize={8} gap={10} />
    </View>
  );
}
