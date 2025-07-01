# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start Development Server:**

```bash
npx expo start
```

**Platform-Specific Development:**

```bash
expo run:ios        # Run on iOS simulator
expo run:android    # Run on Android emulator
npx expo start --web # Run on web
```

**Code Quality:**

```bash
npm run lint        # Run ESLint with Expo config
```

## Project Goal

This project creates a native module to expose Apple's Foundation Models API (iOS 26+) to React Native applications through Expo Modules API. The module provides access to Apple's native AI/ML capabilities introduced in iOS 26.

**Primary Focus:** iOS implementation using Apple's Foundation Models framework
**Secondary Platforms:** Android and Web return "not implemented" messages

## Architecture Overview

This is an Expo React Native application with a custom native module for iOS Foundation Models integration.

**Core Structure:**

- **App Router:** Uses Expo Router with file-based routing in the `app/` directory
- **Native Module:** Custom `expo-foundation-models` module built with Expo Modules API
- **TypeScript:** Strict TypeScript configuration with path mapping (`@/*` -> `./`)

**Key Components:**

- `app/_layout.tsx` - Root layout using Stack navigation
- `app/index.tsx` - Main screen with foundation models integration
- `modules/expo-foundation-models/` - Custom native module for Apple's Foundation Models

**Native Module Architecture (Expo Modules API):**

- **iOS:** Swift implementation (`ExpoFoundationModelsModule.swift`) - Wraps Apple's Foundation Models framework
- **Android:** Kotlin stub (`ExpoFoundationModelsModule.kt`) - Returns "not implemented"
- **Web:** TypeScript stub (`ExpoFoundationModelsModule.web.ts`) - Returns "not implemented"
- **Shared:** TypeScript types and React components for cross-platform interface

**Foundation Models Integration:**

- Uses Apple's FoundationModels framework (iOS 26+)
- Provides native AI/ML capabilities through Expo Modules API
- Handles model loading, inference, and result processing
- Follows Apple's privacy and security guidelines for on-device processing

**Configuration:**

- Expo SDK ~53.0.13 with React Native 0.79.4
- New Architecture enabled (`newArchEnabled: true`)
- TypedRoutes experiment enabled for better routing TypeScript support
- ESLint with Expo flat config
- iOS target: iOS 26+ (required for Foundation Models)

**Package Manager:** Uses Bun (lockfile: bun.lockb)

**Platform Support:** Primary iOS focus, with Android/Web stubs

## UI/UX Development Notes

- Use with scroll views instead of safe area: `contentInsetAdjustmentBehavior="automatic"`

## Development Reminders

- Remember to use boxshadow instead of old shadow stuff
