import ExpoModulesCore
import Foundation

import FoundationModels

public class ExpoFoundationModelsModule: Module {
  // Store active streaming sessions (using Any to avoid availability issues)
  private var streamingSessions: [String: Any] = [:]
  // Store active streaming tasks for cancellation
  private var streamingTasks: [String: Task<Void, Never>] = [:]
  
  public func definition() -> ModuleDefinition {
    Name("ExpoFoundationModels")

    // Foundation Models Methods
    AsyncFunction("checkAvailability") { () -> FoundationModelsAvailability in
      return await getFoundationModelsAvailability()
    }
    
    AsyncFunction("generateText") { (request: GenerationTextRequest) -> GenerationTextResponse in
      return await generateText(request: request)
    }
    
    AsyncFunction("generateStructuredData") { (request: StructuredGenerationRequest) -> StructuredGenerationResponse in
      return await generateStructuredData(request: request)
    }
    
    AsyncFunction("startStreamingSession") { (request: StreamingRequest) -> StreamingSession in
      return await startStreamingSession(request: request)
    }
    
    AsyncFunction("cancelStreamingSession") { (sessionId: String) -> Void in
      await cancelStreamingSession(sessionId: sessionId)
    }
    
    AsyncFunction("startStructuredStreamingSession") { (request: StructuredStreamingRequest) -> StructuredStreamingSession in
      return await startStructuredStreamingSession(request: request)
    }
    
    // Event definitions
    Events("onStreamingChunk", "onStreamingError", "onStreamingCancelled", "onStructuredStreamingChunk")
  }
  
  // MARK: - Foundation Models Availability Check
  
  private func getFoundationModelsAvailability() async -> FoundationModelsAvailability {
    let availability = FoundationModelsAvailability()

    if #available(iOS 26.0, macOS 26.0, *) {
      let systemModel = SystemLanguageModel.default
      let isAvailable = systemModel.isAvailable

      availability.isAvailable = isAvailable
      availability.deviceSupported = true

      if !isAvailable {
        availability.reason = "Foundation Models not available on this device. Requires Apple Intelligence support."
      }
    } else {
      availability.reason = "Foundation Models requires iOS 26.0+ or macOS 26.0+"
    }

    return availability
  }
  
  // MARK: - Text Generation
  
  private func generateText(request: GenerationTextRequest) async -> GenerationTextResponse {
    let textResponse = GenerationTextResponse()
    
    if #available(iOS 26.0, macOS 26.0, *) {
      do {
        let startTime = Date()
        let prompt = Prompt(request.prompt)
        let session = LanguageModelSession()
        
        let response = try await session.respond(to: prompt)
        
        let endTime = Date()
        let generationTime = endTime.timeIntervalSince(startTime)
        
        // Estimate token count (rough approximation: 1 token ≈ 4 characters)
        let estimatedTokenCount = response.content.count / 4
        
        textResponse.content = response.content
        textResponse.metadata = GenerationTextResponseMetadata(tokenCount: estimatedTokenCount, generationTime: generationTime)
        
        return textResponse
      } catch {
        textResponse.error = error.localizedDescription
        return textResponse
      }
    } else {
      textResponse.error = "Foundation Models requires iOS 26.0+ or macOS 26.0+"
      return textResponse
    }
  }
  
  // MARK: - Structured Data Generation
  
  private func generateStructuredData(request: StructuredGenerationRequest) async -> StructuredGenerationResponse {
    let response = StructuredGenerationResponse()
    
    // Validate request
    guard !request.prompt.isEmpty else {
      response.error = "Prompt is required and cannot be empty"
      return response
    }
    
    
    if #available(iOS 26.0, macOS 26.0, *) {
      do {
        let startTime = Date()
        
        // Create a language model session
        let session = LanguageModelSession()
        let promptObj = Prompt(request.prompt)
        
        // Generate user profile data
        let profileResponse = try await session.respond(to: promptObj, generating: UserProfile.self)
        let profile = profileResponse.content
        
        let record = UserProfileRecord()
        record.name = profile.name
        record.age = profile.age
        record.email = profile.email
        record.interests = profile.interests
        
        let locationRecord = LocationRecord()
        locationRecord.city = profile.location.city
        locationRecord.country = profile.location.country
        record.location = locationRecord
        
        let endTime = Date()
        let generationTime = endTime.timeIntervalSince(startTime)
        
        response.data = record
        response.metadata = StructuredGenerationMetadata()
        response.metadata.tokenCount = estimateTokenCountFromRecord(record)
        response.metadata.generationTime = generationTime
        
      } catch {
        response.error = "Structured data generation failed: \(error.localizedDescription)"
      }
    } else {
      response.error = "Foundation Models requires iOS 26.0+ or macOS 26.0+"
    }
    
    return response
  }
  
  private func estimateTokenCountFromRecord(_ record: UserProfileRecord) -> Int {
    let allText = "\(record.name) \(record.email) \(record.interests.joined(separator: " ")) \(record.location.city) \(record.location.country)"
    return allText.count / 4 // Rough estimation: 1 token ≈ 4 characters
  }
  
  @available(iOS 26.0, *)
  private func partialProductToDictionary(_ partialProduct: Product.PartiallyGenerated) -> [String: Any] {
    var data: [String: Any] = [:]
    if let name = partialProduct.name { data["name"] = name }
    if let price = partialProduct.price { data["price"] = price }
    if let category = partialProduct.category { data["category"] = category }
    if let description = partialProduct.description { data["description"] = description }
    if let features = partialProduct.features { data["features"] = features }
    if let inStock = partialProduct.inStock { data["inStock"] = inStock }
    return data
  }
  
  // MARK: - Streaming Implementation
  
  private func startStreamingSession(request: StreamingRequest) async -> StreamingSession {
    let session = StreamingSession()
    
    if #available(iOS 26.0, macOS 26.0, *) {
      // Generate a unique session ID
      let sessionId = UUID().uuidString
      session.sessionId = sessionId
      
      // Create a new language model session
      let languageSession = LanguageModelSession()
      
      // Store the session
      streamingSessions[sessionId] = languageSession
      
      // Create and store the streaming task
      let streamingTask = Task {
        do {
          let promptObj = Prompt(request.prompt)
          let stream = languageSession.streamResponse(to: promptObj)
          
          for try await currentContent in stream {
            // Check if task is cancelled
            if Task.isCancelled {
              throw CancellationError()
            }
            
            // The stream returns the full accumulated content each time
            // We'll send the full content and let JS handle it
            
            // Estimate total tokens for the full content
            let currentTokens = currentContent.content.count / 4
            
            // Send the full content as a chunk event
            let chunkEvent = StreamingChunkEvent()
            chunkEvent.sessionId = sessionId
            chunkEvent.content = currentContent.content
            chunkEvent.isComplete = false
            chunkEvent.tokenCount = currentTokens
            sendEvent("onStreamingChunk", chunkEvent.toDictionary())
          }
          
          // Send completion event
          let completionEvent = StreamingChunkEvent()
          completionEvent.sessionId = sessionId
          completionEvent.content = ""
          completionEvent.isComplete = true
          completionEvent.tokenCount = 0
          sendEvent("onStreamingChunk", completionEvent.toDictionary())
          
          // Clean up
          streamingSessions.removeValue(forKey: sessionId)
          streamingTasks.removeValue(forKey: sessionId)
          
        } catch is CancellationError {
          // Task was cancelled, no need to send error
          streamingSessions.removeValue(forKey: sessionId)
          streamingTasks.removeValue(forKey: sessionId)
        } catch {
          // Send error event
          let errorEvent = StreamingErrorEvent()
          errorEvent.sessionId = sessionId
          errorEvent.error = error.localizedDescription
          sendEvent("onStreamingError", errorEvent.toDictionary())
          
          // Clean up
          streamingSessions.removeValue(forKey: sessionId)
          streamingTasks.removeValue(forKey: sessionId)
        }
      }
      
      // Store the task for cancellation
      streamingTasks[sessionId] = streamingTask
      
      return session
    } else {
      let unavailableSession = StreamingSession()
      unavailableSession.error = "Foundation Models requires iOS 26.0+ or macOS 26.0+"
      unavailableSession.isActive = false
      return unavailableSession
    }
  }
  
  private func cancelStreamingSession(sessionId: String) async {
    // Cancel the streaming task if it exists
    if let task = streamingTasks[sessionId] {
      task.cancel()
      streamingTasks.removeValue(forKey: sessionId)
    }
    
    // Remove the session
    if streamingSessions.removeValue(forKey: sessionId) != nil {
      // Send cancellation event
      let cancelledEvent = StreamingCancelledEvent()
      cancelledEvent.sessionId = sessionId
      sendEvent("onStreamingCancelled", cancelledEvent.toDictionary())
    }
  }
  
  // MARK: - Structured Streaming Implementation
  
  private func startStructuredStreamingSession(request: StructuredStreamingRequest) async -> StructuredStreamingSession {
    let session = StructuredStreamingSession()
    session.schemaType = "product"
    
    if #available(iOS 26.0, macOS 26.0, *) {
      // Generate a unique session ID
      let sessionId = UUID().uuidString
      session.sessionId = sessionId
      
      // Create a new language model session
      let languageSession = LanguageModelSession()
      
      let prompt = """
          \(request.prompt)
          Give it a real name, price, category, description, features, and inStock.
          """
      
      // Store the session
      streamingSessions[sessionId] = languageSession
      
      // Create and store the streaming task
      let streamingTask = Task {
        do {
          // Stream Product generation (keeping it simple)
          let stream = languageSession.streamResponse(
            to: prompt,
            generating: Product.self,
            includeSchemaInPrompt: false,
            options: GenerationOptions(sampling: .greedy)
          )
          
          for try await snapshot in stream {
            if Task.isCancelled { throw CancellationError() }
            
            // Extract the partially generated Product
            let partial = snapshot.content   // <- This is Product.PartiallyGenerated
            
            let productData = partialProductToDictionary(partial)
            
            let structuredEvent = StructuredStreamingChunkEvent()
            structuredEvent.sessionId = sessionId
            structuredEvent.data = productData
            structuredEvent.schemaType = "product"
            structuredEvent.isComplete = false
            structuredEvent.isPartial = true
            sendEvent("onStructuredStreamingChunk", structuredEvent.toDictionary())
          }
          
          // Send completion event
          let completionStructuredEvent = StructuredStreamingChunkEvent()
          completionStructuredEvent.sessionId = sessionId
          completionStructuredEvent.data = [:] // Empty data for completion
          completionStructuredEvent.schemaType = "product"
          completionStructuredEvent.isComplete = true
          completionStructuredEvent.isPartial = false
          sendEvent("onStructuredStreamingChunk", completionStructuredEvent.toDictionary())
          
          // Clean up
          streamingSessions.removeValue(forKey: sessionId)
          streamingTasks.removeValue(forKey: sessionId)
          
        } catch is CancellationError {
          // Task was cancelled, no need to send error
          streamingSessions.removeValue(forKey: sessionId)
          streamingTasks.removeValue(forKey: sessionId)
        } catch {
          // Send error event
          let errorEvent = StreamingErrorEvent()
          errorEvent.sessionId = sessionId
          errorEvent.error = error.localizedDescription
          sendEvent("onStreamingError", errorEvent.toDictionary())
          
          // Clean up
          streamingSessions.removeValue(forKey: sessionId)
          streamingTasks.removeValue(forKey: sessionId)
        }
      }
      
      // Store the task for cancellation
      streamingTasks[sessionId] = streamingTask
      
      return session
    } else {
      let unavailableSession = StructuredStreamingSession()
      unavailableSession.error = "Foundation Models requires iOS 26.0+ or macOS 26.0+"
      unavailableSession.isActive = false
      unavailableSession.schemaType = "product"
      return unavailableSession
    }
  }
}
