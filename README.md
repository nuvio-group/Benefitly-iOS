# Benefitly iOS

Benefitly is a premium multi-brand loyalty super-app for iOS.

One app can render thousands of merchant loyalty experiences. Each merchant controls its own logo, colors, cover image, loyalty program, rewards, promotions, activities, membership tier, and Apple Wallet-style card design through API configuration. The mobile app keeps the same layout, spacing, navigation, typography, and component structure while the active merchant branding changes instantly.

This project is a new standalone Expo React Native app. It is intentionally separate from Kontopas and is designed to be connected to Nuvio Loyalty as the merchant configuration source.

## Stack

- React Native
- Expo
- TypeScript
- Zustand
- React Navigation
- Reanimated
- Safe Area Context

## MVP Scope

- Dynamic merchant theme engine
- Instant merchant switching without app reload
- Home screen matching the provided Benefitly reference layout
- Promotions and recent activity rendered from merchant config
- 5-tab bottom navigation with central floating QR card button
- Loyalty card screen with merchant-controlled card design
- Rewards, Discover marketplace, and Profile screens

## Run

```sh
npm install
npm run ios
```

For Expo web preview:

```sh
npm run web
```
