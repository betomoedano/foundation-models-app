# Expo Foundation Models

An experimental React Native project with a local native module that provides access to Apple's Foundation Models API (iOS 26+) through Expo Modules API.

https://github.com/user-attachments/assets/41c6d2f0-b694-4348-99cb-adc6717c9fa8

## Overview

This project exposes Apple's native AI/ML capabilities to React Native applications, focusing on on-device processing with privacy-first design. The native module is developed locally within this project.

## Watch the [video demo](https://x.com/betomoedano/status/1940035890476466420)

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

3. Run on iOS:
   ```bash
   npx expo run:ios
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
