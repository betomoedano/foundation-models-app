# Expo Modules API Reference

## Overview
- Allows developers to write native code (Swift/Kotlin) to extend app capabilities
- Minimal boilerplate, leverages modern language features
- Supports React Native's New Architecture with JSI
- Performance similar to Turbo Modules (hundreds of thousands of calls/second)

## Module Structure

### File Organization
```
modules/expo-foundation-models/
├── expo-module.config.json    # Module configuration
├── index.ts                   # Main export file
├── src/
│   ├── ExpoFoundationModels.types.ts      # TypeScript types
│   ├── ExpoFoundationModelsModule.ts      # Native module interface
│   ├── ExpoFoundationModelsModule.web.ts  # Web implementation
│   └── ExpoFoundationModelsView.tsx       # Optional view component
└── ios/
    ├── ExpoFoundationModels.podspec       # iOS pod specification
    ├── ExpoFoundationModelsModule.swift   # Swift implementation
    └── ExpoFoundationModelsView.swift     # Optional view implementation
```

### Module Configuration (expo-module.config.json)
```json
{
  "platforms": ["apple", "android", "web"],
  "apple": {
    "modules": ["ExpoFoundationModelsModule"]
  },
  "android": {
    "modules": ["expo.modules.foundationmodels.ExpoFoundationModelsModule"]
  }
}
```

## Swift Implementation Patterns

### Basic Module Structure
```swift
import ExpoModulesCore

public class ExpoFoundationModelsModule: Module {
  public func definition() -> ModuleDefinition {
    // Module name
    Name("ExpoFoundationModels")
    
    // Constants
    Constants([
      "PI": Double.pi
    ])
    
    // Synchronous functions
    Function("hello") {
      return "Hello world! 👋"
    }
    
    // Asynchronous functions
    AsyncFunction("setValueAsync") { (value: String) in
      // Async operations
    }
    
    // Event handling
    Events("onChange")
    
    // Properties
    Property("someProperty") {
      return someValue
    }
  }
}
```

### Function Declaration Patterns
```swift
// Sync function (up to 8 arguments supported)
Function("functionName") { (arg1: String, arg2: Int) -> String in
  return "Result"
}

// Async function with Promise
AsyncFunction("asyncFunction") { (input: String) -> String in
  // Automatically dispatched on background thread
  return await performAsyncOperation(input)
}

// Function with callback
AsyncFunction("withCallback") { (input: String, promise: Promise) in
  DispatchQueue.main.async {
    promise.resolve("Success")
  }
}
```

### Type System
- Automatic type conversion between JS and native types
- Support for primitives: String, Int, Double, Bool, Array, Dictionary
- Complex types via Convertible protocol
- Custom Record types for structured data

### Event Handling
```swift
// Declare events
Events("onDataChanged", "onError")

// Send events from native code
sendEvent("onDataChanged", [
  "data": newData,
  "timestamp": Date().timeIntervalSince1970
])
```

### Error Handling
```swift
AsyncFunction("riskyOperation") { (input: String) throws -> String in
  guard !input.isEmpty else {
    throw InvalidArgumentException("Input cannot be empty")
  }
  return processInput(input)
}
```

## TypeScript Integration

### Module Interface
```typescript
import { NativeModule, requireNativeModule } from "expo";

export interface ExpoFoundationModelsModuleEvents {
  onChange(params: { data: any }): void;
}

declare class ExpoFoundationModelsModule extends NativeModule<ExpoFoundationModelsModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

export default requireNativeModule<ExpoFoundationModelsModule>("ExpoFoundationModels");
```

### Type Definitions
```typescript
export interface ModuleConfig {
  apiKey?: string;
  timeout?: number;
}

export type ModuleResult = {
  success: boolean;
  data?: any;
  error?: string;
};
```

## Best Practices

### Module Lifecycle
```swift
// Initialize resources
OnCreate {
  // Setup code
}

// Cleanup resources  
OnDestroy {
  // Cleanup code
}

// Event listener management
OnStartObserving {
  // Start listening to system events
}

OnStopObserving {
  // Stop listening to system events
}
```

### Threading Considerations
- AsyncFunction automatically runs on background thread
- Use DispatchQueue for main thread operations
- Handle thread safety for shared resources

### Error Handling Strategy
- Use descriptive error messages
- Implement proper exception types
- Handle edge cases gracefully
- Provide fallback values when appropriate

## Platform-Specific Considerations

### iOS Requirements
- iOS 13.4+ for Expo Modules API
- Swift 5.0+
- Xcode 12+
- Proper pod specification setup

### Cross-Platform Compatibility
- Use platform-specific implementations
- Provide web fallbacks for browser compatibility
- Handle platform detection in TypeScript layer