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
