import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Background } from './src/components/Background';
import { ExplosionLayer } from './src/components/ExplosionLayer';
import { SettingsOverlay } from './src/components/SettingsOverlay';
import type { BackgroundId, ExplosionId } from './src/theme';

export default function App() {
  const [background, setBackground] = useState<BackgroundId>('space');
  const [explosion, setExplosion] = useState<ExplosionId>('confetti');

  return (
    <View style={styles.container}>
      {/* Decorative, non-interactive layer. */}
      <Background background={background} />

      {/* Full-screen touch surface that produces the explosions. */}
      <ExplosionLayer explosionType={explosion} />

      {/* Settings button + overlay, sits on top of everything. */}
      <SettingsOverlay
        background={background}
        explosion={explosion}
        onChangeBackground={setBackground}
        onChangeExplosion={setExplosion}
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
