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
}
