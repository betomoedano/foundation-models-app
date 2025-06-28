# Expo Foundation Models

An experimental React Native project with a local native module that provides access to Apple's Foundation Models API (iOS 26+) through Expo Modules API.

## Overview

This project exposes Apple's native AI/ML capabilities to React Native applications, focusing on on-device processing with privacy-first design. The native module is developed locally within this project.

## Requirements

- **iOS:** iOS 26+ (required for Foundation Models)
- **Android/Web:** Returns "not implemented" (stub implementations)
- **Expo SDK:** ~53.0.13
- **React Native:** 0.79.4

## Getting Started

1. Install dependencies:

   ```bash
   bun install
   ```

2. Start development:

   ```bash
   npx expo start
   ```

3. Run on specific platform:
   ```bash
   npx expo run:ios     # iOS simulator
   npx expo run:android # Android emulator
   npx expo start --web # Web browser
   ```

## Features

- Native module with Expo Modules API
- iOS availability checking for Foundation Models
- Cross-platform TypeScript interfaces
- Basic text generation
- Structured data generation
- Streaming responses

## Development

- **Linting:** `npm run lint`
- **Documentation:** See `CLAUDE.md` for AI assistant guidance
- **Implementation Plan:** See `plans/` directory for detailed roadmap
