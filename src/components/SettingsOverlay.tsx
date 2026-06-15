import React, { useState } from 'react';
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Constants from 'expo-constants';
import * as StoreReview from 'expo-store-review';
import {
  AMOUNTS,
  BACKGROUNDS,
  EXPLOSIONS,
  SPEEDS,
  type AmountId,
  type BackgroundId,
  type ExplosionId,
  type SpeedId,
} from '../theme';

/**
 * A floating settings button that opens a full-screen settings page where kids
 * pick a background, an explosion style, the animation speed and how much
 * confetti — all with big, colorful, icon-first buttons. The page also offers
 * "Share" and "Rate" actions and shows the app version at the bottom.
 */

type Props = {
  background: BackgroundId;
  explosion: ExplosionId;
  speed: SpeedId;
  amount: AmountId;
  onChangeBackground: (id: BackgroundId) => void;
  onChangeExplosion: (id: ExplosionId) => void;
  onChangeSpeed: (id: SpeedId) => void;
  onChangeAmount: (id: AmountId) => void;
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

type ActionButtonProps = {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
};

function ActionButton({ icon, label, color, onPress }: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        { backgroundColor: color },
        pressed && styles.optionPressed,
      ]}
    >
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

async function shareApp() {
  try {
    await Share.share({
      message:
        'Check out Confetti — a super fun tap-to-explode app for kids! 🎉',
    });
  } catch {
    // The user dismissed the share sheet; nothing to do.
  }
}

async function rateApp() {
  try {
    if (await StoreReview.hasAction()) {
      await StoreReview.requestReview();
      return;
    }
    const url = StoreReview.storeUrl();
    if (url) await Linking.openURL(url);
  } catch {
    // Store review isn't available (e.g. in Expo Go / web); ignore.
  }
}

function versionLabel() {
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const build =
    Platform.OS === 'ios'
      ? Constants.expoConfig?.ios?.buildNumber
      : Constants.expoConfig?.android?.versionCode;
  return build != null ? `Version ${version} (${build})` : `Version ${version}`;
}

export function SettingsOverlay({
  background,
  explosion,
  speed,
  amount,
  onChangeBackground,
  onChangeExplosion,
  onChangeSpeed,
  onChangeAmount,
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
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Pressable
              onPress={() => setOpen(false)}
              hitSlop={12}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.optionPressed,
              ]}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.pageContent}
          >
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

            <Text style={styles.title}>Speed</Text>
            <View style={styles.row}>
              {SPEEDS.map((s) => (
                <OptionButton
                  key={s.id}
                  icon={s.icon}
                  label={s.label}
                  selected={speed === s.id}
                  onPress={() => onChangeSpeed(s.id)}
                />
              ))}
            </View>

            <Text style={styles.title}>Amount</Text>
            <View style={styles.row}>
              {AMOUNTS.map((a) => (
                <OptionButton
                  key={a.id}
                  icon={a.icon}
                  label={a.label}
                  selected={amount === a.id}
                  onPress={() => onChangeAmount(a.id)}
                />
              ))}
            </View>

            <View style={styles.actions}>
              <ActionButton
                icon="💌"
                label="Share App"
                color="#3DD2FF"
                onPress={shareApp}
              />
              <ActionButton
                icon="⭐"
                label="Rate this App"
                color="#FF8A3D"
                onPress={rateApp}
              />
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

            <Text style={styles.version}>{versionLabel()}</Text>
          </ScrollView>
        </View>
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
  page: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 58,
    paddingBottom: 16,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7B5BFF',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
  },
  pageContent: {
    padding: 22,
    paddingBottom: 40,
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
  actions: {
    marginTop: 18,
    gap: 12,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 22,
  },
  actionIcon: {
    fontSize: 26,
    marginRight: 12,
  },
  actionLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  doneButton: {
    marginTop: 18,
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
  version: {
    marginTop: 22,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#9a93b8',
  },
});
