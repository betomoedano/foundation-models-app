import ExpoModulesCore
import Foundation

// Import FoundationModels framework if available
#if canImport(FoundationModels)
import FoundationModels
#endif

// MARK: - Generable Data Structures

#if canImport(FoundationModels)
@available(iOS 26.0, macOS 26.0, *)
@Generable
struct UserProfile {
    @Guide(description: "The user's full name")
    let name: String
    
    @Guide(description: "The user's age in years")
    let age: Int
    
    @Guide(description: "The user's email address")
    let email: String
    
    @Guide(description: "List of user's interests and hobbies")
    let interests: [String]
    
    @Guide(description: "User's location information")
    let location: Location
}

@available(iOS 26.0, macOS 26.0, *)
@Generable
struct Location {
    @Guide(description: "The city name")
    let city: String
    
    @Guide(description: "The country name")
    let country: String
}

@available(iOS 26.0, macOS 26.0, *)
@Generable
struct Product {
    @Guide(description: "The product name")
    let name: String
    
    @Guide(description: "The price in USD")
    let price: Double
    
    @Guide(description: "The product category")
    let category: String
    
    @Guide(description: "Detailed product description")
    let description: String
    
    @Guide(description: "List of key product features")
    let features: [String]
    
    @Guide(description: "Whether the product is currently in stock")
    let inStock: Bool
}

@available(iOS 26.0, macOS 26.0, *)
@Generable
struct Event {
    @Guide(description: "The event title")
    let title: String
    
    @Guide(description: "The event date in YYYY-MM-DD format")
    let date: String
    
    @Guide(description: "The event time in HH:MM format")
    let time: String
    
    @Guide(description: "The event location or venue")
    let location: String
    
    @Guide(description: "Detailed event description")
    let description: String
    
    @Guide(description: "Maximum number of attendees")
    let capacity: Int
    
    @Guide(description: "Ticket price in USD")
    let ticketPrice: Double
}
#endif

public class ExpoFoundationModelsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoFoundationModels")

    // Foundation Models Methods
    AsyncFunction("checkAvailability") { () -> [String: Any] in
      return await self.getFoundationModelsAvailability()
    }
    
    AsyncFunction("generateText") { (request: [String: Any]) -> [String: Any] in
      return await self.generateText(request: request)
    }
    
    AsyncFunction("generateStructuredData") { (request: [String: Any]) -> [String: Any] in
      return await self.generateStructuredData(request: request)
    }
  }
  
  // MARK: - Foundation Models Availability Check
  
  private func getFoundationModelsAvailability() async -> [String: Any] {
    let osVersion = ProcessInfo.processInfo.operatingSystemVersionString
    
    #if canImport(FoundationModels)
    // Check if we're on iOS 26+ and have Apple Intelligence support
    if #available(iOS 26.0, macOS 26.0, *) {
      // Try to access the SystemLanguageModel to check availability
      let systemModel = SystemLanguageModel.default
      let isAvailable = systemModel.isAvailable
      
      var result: [String: Any] = [
        "isAvailable": isAvailable,
        "deviceSupported": true,
        "osVersion": osVersion,
        "frameworkVersion": "1.0"
      ]
      
      if !isAvailable {
        result["reason"] = "Foundation Models not available on this device. Requires Apple Intelligence support."
      }
      
      return result
    } else {
      return [
        "isAvailable": false,
        "deviceSupported": false,
        "osVersion": osVersion,
        "reason": "Foundation Models requires iOS 26.0+ or macOS 26.0+"
      ]
    }
    #else
    return [
      "isAvailable": false,
      "deviceSupported": false,
      "osVersion": osVersion,
      "reason": "Foundation Models framework not available in this build"
    ]
    #endif
  }
  
  // MARK: - Text Generation
  
  private func generateText(request: [String: Any]) async -> [String: Any] {
    guard let prompt = request["prompt"] as? String, !prompt.isEmpty else {
      return [
        "content": "",
        "metadata": [
          "tokenCount": 0,
          "generationTime": 0.0,
          "model": "none"
        ],
        "error": "Prompt is required and cannot be empty"
      ]
    }
    
    #if canImport(FoundationModels)
    if #available(iOS 26.0, macOS 26.0, *) {
      do {
        let startTime = Date()
        
        // Create a language model session
        let session = LanguageModelSession()
        
        // Create prompt and generate response
        let prompt = Prompt(prompt)
        let response = try await session.respond(to: prompt)
        
        let endTime = Date()
        let generationTime = endTime.timeIntervalSince(startTime)
        
        // Estimate token count (rough approximation: 1 token ≈ 4 characters)
        let estimatedTokenCount = response.content.count / 4
        
        return [
          "content": response.content,
          "metadata": [
            "tokenCount": estimatedTokenCount,
            "generationTime": generationTime,
            "model": "Foundation Models (iOS 26+)"
          ]
        ]
        
      } catch {
        return [
          "content": "",
          "metadata": [
            "tokenCount": 0,
            "generationTime": 0.0,
            "model": "Foundation Models (iOS 26+)"
          ],
          "error": "Text generation failed: \(error.localizedDescription)"
        ]
      }
    } else {
      return [
        "content": "",
        "metadata": [
          "tokenCount": 0,
          "generationTime": 0.0,
          "model": "none"
        ],
        "error": "Foundation Models requires iOS 26.0+ or macOS 26.0+"
      ]
    }
    #else
    return [
      "content": "",
      "metadata": [
        "tokenCount": 0,
        "generationTime": 0.0,
        "model": "none"
      ],
      "error": "Foundation Models framework not available in this build"
    ]
    #endif
  }
  
  // MARK: - Structured Data Generation
  
  private func generateStructuredData(request: [String: Any]) async -> [String: Any] {
    guard let prompt = request["prompt"] as? String, !prompt.isEmpty else {
      return [
        "data": [:],
        "schemaType": "",
        "metadata": [
          "tokenCount": 0,
          "generationTime": 0.0,
          "model": "none"
        ],
        "error": "Prompt is required and cannot be empty"
      ]
    }
    
    guard let schemaType = request["schemaType"] as? String else {
      return [
        "data": [:],
        "schemaType": "",
        "metadata": [
          "tokenCount": 0,
          "generationTime": 0.0,
          "model": "none"
        ],
        "error": "Schema type is required for structured data generation"
      ]
    }
    
    #if canImport(FoundationModels)
    if #available(iOS 26.0, macOS 26.0, *) {
      do {
        let startTime = Date()
        
        // Create a language model session
        let session = LanguageModelSession()
        
        // Generate structured data based on schema type
        switch schemaType {
        case "userProfile":
          let promptObj = Prompt(prompt)
          let profileResponse = try await session.respond(to: promptObj, generating: UserProfile.self)
          let profile = profileResponse.content
          
          let endTime = Date()
          let generationTime = endTime.timeIntervalSince(startTime)
          
          // Convert to dictionary for JSON serialization
          let profileData: [String: Any] = [
            "name": profile.name,
            "age": profile.age,
            "email": profile.email,
            "interests": profile.interests,
            "location": [
              "city": profile.location.city,
              "country": profile.location.country
            ]
          ]
          
          return [
            "data": profileData,
            "schemaType": schemaType,
            "metadata": [
              "tokenCount": estimateTokenCount(from: profileData),
              "generationTime": generationTime,
              "model": "Foundation Models (iOS 26+)"
            ]
          ]
          
        case "product":
          let promptObj = Prompt(prompt)
          let productResponse = try await session.respond(to: promptObj, generating: Product.self)
          let product = productResponse.content
          
          let endTime = Date()
          let generationTime = endTime.timeIntervalSince(startTime)
          
          let productData: [String: Any] = [
            "name": product.name,
            "price": product.price,
            "category": product.category,
            "description": product.description,
            "features": product.features,
            "inStock": product.inStock
          ]
          
          return [
            "data": productData,
            "schemaType": schemaType,
            "metadata": [
              "tokenCount": estimateTokenCount(from: productData),
              "generationTime": generationTime,
              "model": "Foundation Models (iOS 26+)"
            ]
          ]
          
        case "event":
          let promptObj = Prompt(prompt)
          let eventResponse = try await session.respond(to: promptObj, generating: Event.self)
          let event = eventResponse.content
          
          let endTime = Date()
          let generationTime = endTime.timeIntervalSince(startTime)
          
          let eventData: [String: Any] = [
            "title": event.title,
            "date": event.date,
            "time": event.time,
            "location": event.location,
            "description": event.description,
            "capacity": event.capacity,
            "ticketPrice": event.ticketPrice
          ]
          
          return [
            "data": eventData,
            "schemaType": schemaType,
            "metadata": [
              "tokenCount": estimateTokenCount(from: eventData),
              "generationTime": generationTime,
              "model": "Foundation Models (iOS 26+)"
            ]
          ]
          
        default:
          return [
            "data": [:],
            "schemaType": schemaType,
            "metadata": [
              "tokenCount": 0,
              "generationTime": 0.0,
              "model": "Foundation Models (iOS 26+)"
            ],
            "error": "Unsupported schema type: \(schemaType). Supported types: userProfile, product, event"
          ]
        }
        
      } catch {
        return [
          "data": [:],
          "schemaType": schemaType,
          "metadata": [
            "tokenCount": 0,
            "generationTime": 0.0,
            "model": "Foundation Models (iOS 26+)"
          ],
          "error": "Structured data generation failed: \(error.localizedDescription)"
        ]
      }
    } else {
      return [
        "data": [:],
        "schemaType": schemaType,
        "metadata": [
          "tokenCount": 0,
          "generationTime": 0.0,
          "model": "none"
        ],
        "error": "Foundation Models requires iOS 26.0+ or macOS 26.0+"
      ]
    }
    #else
    return [
      "data": [:],
      "schemaType": schemaType,
      "metadata": [
        "tokenCount": 0,
        "generationTime": 0.0,
        "model": "none"
      ],
      "error": "Foundation Models framework not available in this build"
    ]
    #endif
  }
  
  // Helper function to estimate token count from structured data
  private func estimateTokenCount(from data: [String: Any]) -> Int {
    do {
      let jsonData = try JSONSerialization.data(withJSONObject: data, options: [])
      let jsonString = String(data: jsonData, encoding: .utf8) ?? ""
      return jsonString.count / 4 // Rough estimation: 1 token ≈ 4 characters
    } catch {
      return 0
    }
  }
}
