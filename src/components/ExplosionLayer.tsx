import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  type GestureResponderEvent,
} from 'react-native';
import { Particle } from './Particle';
import type { ExplosionId } from '../theme';

/**
 * Full-screen touch surface that turns every tap (and drag) into an explosion
 * of particles at the finger's position.
 */

const PARTICLE_COUNT = 24;
// A particle lives at most ~1.8s (see Particle.tsx); give a little headroom.
const EXPLOSION_LIFETIME = 2000;
// Throttle drag spawns so dragging a finger sprays particles without flooding.
const DRAG_INTERVAL = 90;
// Hard cap on simultaneous explosions so rapid dragging can never balloon the
// particle count (and frame budget). Oldest explosions are dropped first.
const MAX_EXPLOSIONS = 12;

type Explosion = {
  id: number;
  x: number;
  y: number;
  type: ExplosionId;
};

type Props = {
  explosionType: ExplosionId;
};

export function ExplosionLayer({ explosionType }: Props) {
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const nextId = useRef(0);
  const lastDrag = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Keep the latest type in a ref so the responder callbacks (created once)
  // always read the current selection.
  const typeRef = useRef(explosionType);
  typeRef.current = explosionType;

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const spawn = useCallback((x: number, y: number) => {
    const id = nextId.current++;
    setExplosions((prev) => {
      const next = [...prev, { id, x, y, type: typeRef.current }];
      // Drop the oldest if we exceed the cap.
      return next.length > MAX_EXPLOSIONS ? next.slice(next.length - MAX_EXPLOSIONS) : next;
    });

    const timer = setTimeout(() => {
      setExplosions((prev) => prev.filter((e) => e.id !== id));
    }, EXPLOSION_LIFETIME);
    timers.current.push(timer);
  }, []);

  const handleStart = useCallback(
    (e: GestureResponderEvent) => {
      const { locationX, locationY } = e.nativeEvent;
      spawn(locationX, locationY);
    },
    [spawn]
  );

  const handleMove = useCallback(
    (e: GestureResponderEvent) => {
      const now = Date.now();
      if (now - lastDrag.current < DRAG_INTERVAL) return;
      lastDrag.current = now;
      const { locationX, locationY } = e.nativeEvent;
      spawn(locationX, locationY);
    },
    [spawn]
  );

  return (
    <View
      style={StyleSheet.absoluteFill}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleStart}
      onResponderMove={handleMove}
    >
      {explosions.map((explosion) => (
        <View
          key={explosion.id}
          pointerEvents="none"
          style={[styles.origin, { left: explosion.x, top: explosion.y }]}
        >
          {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
            <Particle key={i} type={explosion.type} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  origin: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
});
