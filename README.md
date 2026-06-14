# Confetti 🎉

A super simple, playful app for young kids. Touch anywhere on the screen and a
colorful explosion bursts out from your finger. A small settings overlay lets
kids switch the background and the kind of explosion.

Built with [Expo](https://expo.dev) (SDK 56) and React Native.

## What it does

- **Tap (or drag) anywhere** to fire an explosion of particles right under the
  finger. Dragging sprays a continuous trail.
- **Settings overlay** (the ⚙️ button, top-right) with two choices:
  - **Background**
    - 🌙 **Night** – a calm dark gradient, nothing else.
    - 🚀 **Space** – dark sky with softly twinkling stars.
    - 🐠 **Ocean** – blue water with bubbles drifting up.
  - **Explosion**
    - 🎉 **Confetti** – colorful paper pieces.
    - 😄 **Emojis** – random fun emojis fly around.
    - 🔤 **Letters** – random alphabet characters get thrown around.

## Why it stays smooth

All of the motion (particles, stars, bubbles) is animated with React Native's
`Animated` API using `useNativeDriver: true`, so each effect runs on the native
UI thread and the JavaScript thread does no per-frame work. Each particle is a
single native-driven `0 → 1` value whose trajectory (a gravity arc), rotation,
fade and scale are all expressed as interpolations of that one value. Finished
explosions are removed from the tree so nothing piles up.

## Running it

```bash
npm install
npm start        # then press a/i, or scan the QR code with Expo Go
# or target a platform directly:
npm run android
npm run ios
npm run web
```

## Project layout

```
App.tsx                         App root: holds the selected background/explosion
src/theme.ts                    All options, colors, emojis and the alphabet
src/components/
  Background.tsx                Gradient + the right decoration for each theme
  Stars.tsx                     Twinkling stars (Space)
  Bubbles.tsx                   Rising bubbles (Ocean)
  ExplosionLayer.tsx            Touch surface; spawns/cleans up explosions
  Particle.tsx                  One flying piece (confetti / emoji / letter)
  SettingsOverlay.tsx           The ⚙️ button and the kid-friendly settings card
```

## Adding more themes or explosions

Everything kid-facing lives in `src/theme.ts`. Add an entry to `BACKGROUNDS` or
`EXPLOSIONS` (with a label, an emoji icon and, for backgrounds, gradient
colors), then handle the new id where it's rendered (`Background.tsx` for a new
decoration, `Particle.tsx` for a new explosion look).
