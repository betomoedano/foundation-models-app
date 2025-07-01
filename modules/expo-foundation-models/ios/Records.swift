//
//  Records.swift
//  ExpoFoundationModels
//
//  Created by beto on 7/1/25.
//

import ExpoModulesCore
import Foundation

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
