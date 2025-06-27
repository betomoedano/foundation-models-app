# Apple Foundation Models Framework Reference

## Overview
- Provides on-device Large Language Model access via Swift API
- Part of Apple Intelligence ecosystem (iOS 26+, macOS 26+)
- Requires Apple Intelligence-capable devices with Apple Silicon
- Privacy-focused: all processing happens on-device
- Supports offline operation

## Framework Import and Setup

### Requirements
- iOS 26.0+ / macOS 26.0+
- Apple Intelligence enabled
- Apple Silicon device
- Xcode with iOS 26 SDK

### Basic Import
```swift
import FoundationModels
```

### Availability Check
```swift
let systemModel = SystemLanguageModel.default
if systemModel.isAvailable {
    // Foundation Models is available
} else {
    // Handle unavailable case
}
```

## Core API Structure

### Primary Classes
- `SystemLanguageModel`: Entry point for accessing the model
- `LanguageModelSession`: Session for model interactions
- `Prompt`: Input structure for model queries
- `Response`: Output structure from model

### Session Management
```swift
// Create a session
let session = LanguageModelSession()

// Basic interaction
let prompt = Prompt("Tell me a knock knock joke.")
let response = try await session.respond(to: prompt)
print(response.content)
```

## API Methods and Patterns

### Basic Text Generation
```swift
// Simple response
let response = try await session.respond(to: "Suggest a coffee shop name.")
print(response.content)
```

### Structured Data Generation
```swift
// Define structured output type
@Generable
struct BookRecommendation {
    @Guide(description: "Book title")
    let title: String
    
    @Guide(description: "Author name")  
    let author: String
    
    @Guide(description: "Brief description")
    let description: String
}

// Generate structured response
let bookInfo = try await session.respond(
    to: "Suggest a sci-fi book.", 
    generating: BookRecommendation.self
)
print("Title: \(bookInfo.title)")
print("Author: \(bookInfo.author)")
```

### Streaming Responses
```swift
// Stream response incrementally
for try await chunk in session.streamResponse(to: "Write a short story") {
    print(chunk.content, terminator: "")
}
```

### Multi-turn Conversations
```swift
// Continue conversation with context
let session = LanguageModelSession()
let response1 = try await session.respond(to: "What's the weather like?")
let response2 = try await session.respond(to: "What should I wear?")
// Context from first response is maintained
```

## Advanced Features

### Tool Calling
```swift
// Define custom tool
struct WeatherTool: Tool {
    func name() -> String { "get_weather" }
    
    func description() -> String { "Get weather for a city" }
    
    func parameters() -> [ToolParameter] {
        [ToolParameter(name: "city", type: .string, description: "City name")]
    }
    
    func execute(parameters: [String: Any]) async throws -> String {
        let city = parameters["city"] as? String ?? ""
        return "Weather in \(city): Sunny, 75°F"
    }
}

// Attach tool to session
let session = LanguageModelSession()
session.attachTool(WeatherTool())

let response = try await session.respond(to: "What's the weather in New York?")
```

### Custom Instructions
```swift
// Set system instructions
let session = LanguageModelSession()
session.setInstructions("You are a helpful assistant specializing in iOS development.")

let response = try await session.respond(to: "How do I create a SwiftUI view?")
```

### Temperature Control
```swift
// Adjust creativity/randomness (0.0 - 1.0)
let session = LanguageModelSession()
session.temperature = 0.7  // More creative responses

let response = try await session.respond(to: "Write a creative story opening.")
```

## Data Types and Annotations

### @Generable Annotation
```swift
@Generable
struct UserProfile {
    @Guide(description: "User's full name")
    let name: String
    
    @Guide(description: "User's age in years")
    let age: Int
    
    @Guide(description: "List of user's hobbies")
    let hobbies: [String]
    
    @Guide(description: "User's preferred contact method")
    let contactMethod: ContactMethod
}

enum ContactMethod: String, CaseIterable {
    case email = "email"
    case phone = "phone"
    case text = "text"
}
```

### Dynamic Schema Support
```swift
// Runtime schema definition
let schema = DynamicSchema(
    name: "ProductInfo",
    properties: [
        "name": .string(description: "Product name"),
        "price": .number(description: "Product price in USD"),
        "inStock": .boolean(description: "Product availability")
    ]
)

let response = try await session.respond(
    to: "Generate product info for a laptop",
    using: schema
)
```

## Error Handling

### Common Error Types
- `ModelUnavailableError`: Foundation Models not available on device
- `InvalidInputError`: Malformed input or unsupported format
- `GenerationError`: Model failed to generate response
- `RateLimitError`: Too many requests in short time period

### Error Handling Pattern
```swift
do {
    let response = try await session.respond(to: prompt)
    // Handle successful response
} catch let error as ModelUnavailableError {
    // Handle model unavailable
    print("Foundation Models not available: \(error.localizedDescription)")
} catch let error as InvalidInputError {
    // Handle invalid input
    print("Invalid input: \(error.localizedDescription)")
} catch {
    // Handle other errors
    print("Unexpected error: \(error)")
}
```

## Performance Considerations

### Best Practices
- Reuse `LanguageModelSession` instances when possible
- Keep prompts concise but descriptive
- Use structured generation for consistent output format
- Implement streaming for long-form content
- Cache frequently used results

### Limitations
- On-device processing may be slower than cloud models
- Model capabilities limited to on-device model size
- Requires Apple Intelligence-enabled devices
- May have rate limiting for intensive usage

## Privacy and Security

### Privacy Features
- All processing happens on-device
- No data sent to external servers
- Built-in content safety guardrails
- User data never leaves the device

### Security Considerations
- Content filtering built into the model
- Automatic harmful content detection
- Safe output generation policies
- Respects user privacy settings

## Integration Patterns

### Common Use Cases
- Content generation (writing assistance, brainstorming)
- Data summarization and analysis
- Conversational interfaces
- Structured data extraction
- Creative writing assistance

### App Integration Example
```swift
class AIAssistantService {
    private let session = LanguageModelSession()
    
    init() {
        session.setInstructions("You are a helpful writing assistant.")
    }
    
    func generateSuggestions(for text: String) async throws -> [String] {
        let prompt = "Suggest improvements for: \(text)"
        let response = try await session.respond(to: prompt)
        return response.content.components(separatedBy: "\n")
    }
}
```