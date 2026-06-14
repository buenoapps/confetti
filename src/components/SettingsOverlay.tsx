import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  BACKGROUNDS,
  EXPLOSIONS,
  type BackgroundId,
  type ExplosionId,
} from '../theme';

/**
 * A floating settings button and a playful overlay that lets kids pick a
 * background and an explosion style with big, colorful, icon-first buttons.
 */

type Props = {
  background: BackgroundId;
  explosion: ExplosionId;
  onChangeBackground: (id: BackgroundId) => void;
  onChangeExplosion: (id: ExplosionId) => void;
};

type OptionButtonProps = {
  icon: string;
  label: string;
  selected: boolean;
  onPress: () => void;
};

function OptionButton({ icon, label, selected, onPress }: OptionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        selected && styles.optionSelected,
        pressed && styles.optionPressed,
      ]}
    >
      <Text style={styles.optionIcon}>{icon}</Text>
      <Text style={styles.optionLabel}>{label}</Text>
    </Pressable>
  );
}

export function SettingsOverlay({
  background,
  explosion,
  onChangeBackground,
  onChangeExplosion,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={12}
        style={({ pressed }) => [styles.gear, pressed && styles.gearPressed]}
      >
        <Text style={styles.gearIcon}>⚙️</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          {/* Stop taps inside the card from closing the modal. */}
          <Pressable style={styles.card} onPress={() => {}}>
            <Text style={styles.title}>Background</Text>
            <View style={styles.row}>
              {BACKGROUNDS.map((b) => (
                <OptionButton
                  key={b.id}
                  icon={b.icon}
                  label={b.label}
                  selected={background === b.id}
                  onPress={() => onChangeBackground(b.id)}
                />
              ))}
            </View>

            <Text style={styles.title}>Explosion</Text>
            <View style={styles.row}>
              {EXPLOSIONS.map((e) => (
                <OptionButton
                  key={e.id}
                  icon={e.icon}
                  label={e.label}
                  selected={explosion === e.id}
                  onPress={() => onChangeExplosion(e.id)}
                />
              ))}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.doneButton,
                pressed && styles.optionPressed,
              ]}
              onPress={() => setOpen(false)}
            >
              <Text style={styles.doneLabel}>Let's play! 🎉</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  gear: {
    position: 'absolute',
    top: 54,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearPressed: {
    backgroundColor: 'rgba(255,255,255,0.35)',
    transform: [{ scale: 0.92 }],
  },
  gearIcon: {
    fontSize: 26,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 22,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2b2350',
    marginBottom: 12,
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  option: {
    flexGrow: 1,
    flexBasis: 92,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: '#f0eefb',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: '#7B5BFF',
    backgroundColor: '#ece7ff',
  },
  optionPressed: {
    transform: [{ scale: 0.95 }],
  },
  optionIcon: {
    fontSize: 34,
    marginBottom: 6,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2b2350',
  },
  doneButton: {
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 22,
    backgroundColor: '#FF3B6B',
    alignItems: 'center',
  },
  doneLabel: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
  },
});
