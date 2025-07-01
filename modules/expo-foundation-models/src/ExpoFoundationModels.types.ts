// Foundation Models Availability Types
export interface FoundationModelsAvailability {
  isAvailable: boolean;
  reason?: string;
  deviceSupported: boolean;
  osVersion: string;
}

// Text Generation Types
export interface GenerationRequest {
  prompt: string;
}

export interface GenerationResponse {
  content: string;
  metadata: {
    tokenCount: number;
    generationTime: number;
    model: string;
  };
  error?: string;
}

// Structured Data Generation Types
export interface StructuredGenerationRequest {
  prompt: string;
}

export interface StructuredGenerationResponse {
  data: {
    name: string;
    age: number;
    email: string;
    interests: string[];
    location: {
      city: string;
      country: string;
    };
  };
  metadata: {
    tokenCount: number;
    generationTime: number;
    model: string;
  };
  error?: string;
}

// Streaming Types
export interface StreamingRequest {
  prompt: string;
  sessionId?: string;
}

export interface StreamingChunk {
  content: string;
  isComplete: boolean;
  tokenCount: number;
  sessionId: string;
}

export interface StreamingSession {
  sessionId: string;
  isActive: boolean;
  totalTokens: number;
  error?: string;
}

// Structured Streaming Types
export interface StructuredStreamingRequest {
  prompt: string;
  sessionId?: string;
}

export interface StructuredStreamingSession {
  sessionId: string;
  isActive: boolean;
  totalTokens: number;
  schemaType: string;
  error?: string;
}

export interface Product {
  name?: string;
  price?: number;
  category?: string;
  description?: string;
  features?: string[];
  inStock?: boolean;
}

export interface StructuredStreamingChunk {
  sessionId: string;
  data: Product;
  schemaType: string;
  isComplete: boolean;
  isPartial: boolean;
}
