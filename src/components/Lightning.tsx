import React, { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

/**
 * Flickering lightning that strikes from the touch point straight down to the
 * bottom of the screen. Several jagged bolts are drawn at once and the whole
 * set is regenerated a few times a second, so it crackles and flashes while the
 * finger is held down. The layer unmounts this as soon as the touch ends.
 */

const BOLTS = 3;
const SEGMENTS = 9;

type Point = { x: number; y: number };

function makeBolt(startX: number, topY: number, bottomY: number): Point[] {
  const points: Point[] = [{ x: startX, y: topY }];
  const stepY = (bottomY - topY) / SEGMENTS;
  let x = startX;
  for (let i = 1; i <= SEGMENTS; i++) {
    x += (Math.random() - 0.5) * 46;
    points.push({ x, y: topY + stepY * i });
  }
  return points;
}

type Props = {
  /** Touch position, in the layer's coordinate space. */
  x: number;
  y: number;
};

export function Lightning({ x, y }: Props) {
  const { height } = useWindowDimensions();
  const [, setTick] = useState(0);

  // Re-render a few times a second to regenerate the bolts (the flicker).
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 80);
    return () => clearInterval(id);
  }, []);

  const bolts = Array.from({ length: BOLTS }, () =>
    makeBolt(x + (Math.random() - 0.5) * 30, y, height)
  );
  const flicker = 0.55 + Math.random() * 0.45;

  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { opacity: flicker }]}
    >
      {bolts.map((points, bi) =>
        points.slice(1).map((p, i) => {
          const a = points[i];
          const dx = p.x - a.x;
          const dy = p.y - a.y;
          const len = Math.hypot(dx, dy);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          const midX = (a.x + p.x) / 2;
          const midY = (a.y + p.y) / 2;
          const transform = [{ rotate: `${angle}deg` }];
          return (
            <React.Fragment key={`${bi}-${i}`}>
              <View
                style={[
                  styles.glow,
                  { left: midX - len / 2, top: midY - 4, width: len, transform },
                ]}
              />
              <View
                style={[
                  styles.core,
                  {
                    left: midX - len / 2,
                    top: midY - 1.25,
                    width: len,
                    transform,
                  },
                ]}
              />
            </React.Fragment>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(140,190,255,0.45)',
  },
  core: {
    position: 'absolute',
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: '#eaf3ff',
  },
});
