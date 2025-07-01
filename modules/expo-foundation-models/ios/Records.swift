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
  var isAvailable: Bool
  @Field
  var reason: String?
  @Field
  var deviceSupported: Bool
  @Field
  var osVersion: String
}
