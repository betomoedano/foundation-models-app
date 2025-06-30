//
//  GenerableDataStructures.swift
//  ExpoFoundationModels
//
//  Created by beto on 6/30/25.
//
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

