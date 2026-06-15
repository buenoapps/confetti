import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Background } from './src/components/Background';
import { ExplosionLayer } from './src/components/ExplosionLayer';
import { SettingsOverlay } from './src/components/SettingsOverlay';
import {
  AMOUNTS,
  SPEEDS,
  type AmountId,
  type BackgroundId,
  type ExplosionId,
  type SpeedId,
} from './src/theme';

export default function App() {
  const [background, setBackground] = useState<BackgroundId>('space');
  const [explosion, setExplosion] = useState<ExplosionId>('confetti');
  const [speed, setSpeed] = useState<SpeedId>('fast');
  const [amount, setAmount] = useState<AmountId>('medium');

  const speedMultiplier =
    (SPEEDS.find((s) => s.id === speed) ?? SPEEDS[2]).durationMultiplier;
  const particleCount =
    (AMOUNTS.find((a) => a.id === amount) ?? AMOUNTS[1]).count;

  return (
    <View style={styles.container}>
      {/* Decorative, non-interactive layer. */}
      <Background background={background} />

      {/* Full-screen touch surface that produces the explosions. */}
      <ExplosionLayer
        explosionType={explosion}
        amount={particleCount}
        speedMultiplier={speedMultiplier}
      />

      {/* Settings button + overlay, sits on top of everything. */}
      <SettingsOverlay
        background={background}
        explosion={explosion}
        speed={speed}
        amount={amount}
        onChangeBackground={setBackground}
        onChangeExplosion={setExplosion}
        onChangeSpeed={setSpeed}
        onChangeAmount={setAmount}
      />

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05060f',
  },
});
