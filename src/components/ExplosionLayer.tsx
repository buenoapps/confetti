import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  type GestureResponderEvent,
} from 'react-native';
import { Particle, PARTICLE_MAX_DURATION } from './Particle';
import { FireworkParticle, FIREWORK_DURATION } from './Firework';
import { WaterDrop, WATER_DURATION } from './WaterDrop';
import { SmokeParticle, SMOKE_DURATION } from './Smoke';
import { SnowParticle, SNOW_DURATION } from './SnowParticle';
import { RainbowEffect, RAINBOW_DURATION } from './Rainbow';
import { Lightning } from './Lightning';
import type { ExplosionId } from '../theme';

/**
 * Full-screen touch surface that turns every tap (and drag) into an explosion
 * of particles at the finger's position.
 *
 * Most explosions are short-lived bursts that are spawned on touch and removed
 * once their slowest particle has finished. Two effects are special: `rainbow`
 * paints a full-screen bloom centered on the touch, and `lightning` is a "held"
 * effect that strikes from the finger while it stays down and vanishes on lift.
 */

// Throttle drag spawns so dragging a finger sprays particles without flooding.
const DRAG_INTERVAL = 90;
// Hard cap on simultaneous explosions so rapid dragging can never balloon the
// particle count (and frame budget). Oldest explosions are dropped first.
const MAX_EXPLOSIONS = 12;

// Per-type lifetime (at fast/baseline speed) used to keep an explosion mounted
// until its effect has fully finished. Anything not listed uses the confetti
// baseline.
const EFFECT_DURATION: Partial<Record<ExplosionId, number>> = {
  firework: FIREWORK_DURATION,
  water: WATER_DURATION,
  smoke: SMOKE_DURATION,
  snowflakes: SNOW_DURATION,
  rainbow: RAINBOW_DURATION,
};

type Explosion = {
  id: number;
  x: number;
  y: number;
  type: ExplosionId;
  /** Particle count, captured at spawn so changing the setting won't disturb
   * explosions that are already in flight. */
  count: number;
  /** Duration multiplier, also captured at spawn. */
  speed: number;
};

type Props = {
  explosionType: ExplosionId;
  /** Number of particles per explosion. */
  amount: number;
  /** Animation duration multiplier (1 = fast). */
  speedMultiplier: number;
};

/** Renders the right particles for a given explosion at its origin. */
function renderParticles(type: ExplosionId, count: number, speed: number) {
  switch (type) {
    case 'firework':
      return Array.from({ length: count }).map((_, i) => (
        <FireworkParticle key={i} index={i} total={count} speedMultiplier={speed} />
      ));
    case 'water':
      return <WaterDrop speedMultiplier={speed} />;
    case 'smoke':
      return Array.from({ length: count }).map((_, i) => (
        <SmokeParticle key={i} speedMultiplier={speed} />
      ));
    case 'snowflakes':
      return Array.from({ length: count }).map((_, i) => (
        <SnowParticle key={i} speedMultiplier={speed} />
      ));
    default:
      return Array.from({ length: count }).map((_, i) => (
        <Particle key={i} type={type} speedMultiplier={speed} />
      ));
  }
}

export function ExplosionLayer({ explosionType, amount, speedMultiplier }: Props) {
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  // Live touch position, used by the "held" lightning effect.
  const [touch, setTouch] = useState<{ x: number; y: number } | null>(null);
  const nextId = useRef(0);
  const lastDrag = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Keep the latest settings in refs so the responder callbacks (created once)
  // always read the current selection.
  const typeRef = useRef(explosionType);
  typeRef.current = explosionType;
  const amountRef = useRef(amount);
  amountRef.current = amount;
  const speedRef = useRef(speedMultiplier);
  speedRef.current = speedMultiplier;

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const spawn = useCallback((x: number, y: number) => {
    const id = nextId.current++;
    const speed = speedRef.current;
    const type = typeRef.current;

    // A few effects override the configured amount.
    let count = amountRef.current;
    if (type === 'water') count = 1;
    else if (type === 'snowflakes') count = 1 + Math.floor(Math.random() * 4);

    setExplosions((prev) => {
      const next = [...prev, { id, x, y, type, count, speed }];
      // Drop the oldest if we exceed the cap.
      return next.length > MAX_EXPLOSIONS ? next.slice(next.length - MAX_EXPLOSIONS) : next;
    });

    // Keep the explosion mounted until its slowest particle has finished.
    const base = EFFECT_DURATION[type] ?? PARTICLE_MAX_DURATION;
    const lifetime = base * speed + 300;
    const timer = setTimeout(() => {
      setExplosions((prev) => prev.filter((e) => e.id !== id));
    }, lifetime);
    timers.current.push(timer);
  }, []);

  const handleStart = useCallback(
    (e: GestureResponderEvent) => {
      const { locationX, locationY } = e.nativeEvent;
      // Lightning follows the finger instead of spawning a burst.
      if (typeRef.current === 'lightning') {
        setTouch({ x: locationX, y: locationY });
        return;
      }
      spawn(locationX, locationY);
    },
    [spawn]
  );

  const handleMove = useCallback(
    (e: GestureResponderEvent) => {
      const { locationX, locationY } = e.nativeEvent;
      if (typeRef.current === 'lightning') {
        setTouch({ x: locationX, y: locationY });
        return;
      }
      const now = Date.now();
      if (now - lastDrag.current < DRAG_INTERVAL) return;
      lastDrag.current = now;
      spawn(locationX, locationY);
    },
    [spawn]
  );

  const handleEnd = useCallback(() => setTouch(null), []);

  return (
    <View
      style={StyleSheet.absoluteFill}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleStart}
      onResponderMove={handleMove}
      onResponderRelease={handleEnd}
      onResponderTerminate={handleEnd}
    >
      {explosions.map((explosion) =>
        explosion.type === 'rainbow' ? (
          <RainbowEffect
            key={explosion.id}
            x={explosion.x}
            y={explosion.y}
            speedMultiplier={explosion.speed}
          />
        ) : (
          <View
            key={explosion.id}
            pointerEvents="none"
            style={[styles.origin, { left: explosion.x, top: explosion.y }]}
          >
            {renderParticles(explosion.type, explosion.count, explosion.speed)}
          </View>
        )
      )}

      {/* Held lightning: only while the finger is down and the mode is active. */}
      {explosionType === 'lightning' && touch && (
        <Lightning x={touch.x} y={touch.y} />
      )}
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
