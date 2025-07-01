//
//  Records.swift
//  ExpoFoundationModels
//
//  Created by beto on 7/1/25.
//

import ExpoModulesCore
import Foundation

// MARK: - Foundation Models Availability Check

struct FoundationModelsAvailability: Record {
  @Field
  var isAvailable: Bool = false
  
  @Field
  var reason: String? = nil
  
  @Field
  var deviceSupported: Bool = false
  
  @Field
  var osVersion: String = ProcessInfo.processInfo.operatingSystemVersionString
}

// MARK: - Text Generation

struct GenerationTextRequest: Record {
  @Field
  var prompt: String = ""
}

struct GenerationTextResponseMetadata: Record {
  @Field
  var tokenCount: Int = 0
  
  @Field
  var generationTime: Double = 0.0
}

struct GenerationTextResponse: Record {
  @Field
  var content: String = ""
  
  @Field
  var metadata: GenerationTextResponseMetadata
  
  @Field
  var error: String? = nil
}

// MARK: - Structured Data Generation

struct StructuredGenerationRequest: Record {
  @Field
  var prompt: String = ""
}

struct StructuredGenerationMetadata: Record {
  @Field
  var tokenCount: Int = 0
  
  @Field
  var generationTime: Double = 0.0
  
  @Field
  var model: String = "Foundation Models (iOS 26+)"
}

struct StructuredGenerationResponse: Record {
  @Field
  var data: UserProfileRecord
  
  @Field
  var metadata: StructuredGenerationMetadata
  
  @Field
  var error: String? = nil
}

// MARK: - Data Structure Records

struct LocationRecord: Record {
  @Field
  var city: String = ""
  
  @Field
  var country: String = ""
}

struct UserProfileRecord: Record {
  @Field
  var name: String = ""
  
  @Field
  var age: Int = 0
  
  @Field
  var email: String = ""
  
  @Field
  var interests: [String] = []
  
  @Field
  var location: LocationRecord
}


