import ExpoModulesCore
import Foundation

// Import FoundationModels framework if available
#if canImport(FoundationModels)
import FoundationModels
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
}
