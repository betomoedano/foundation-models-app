// Foundation Models Availability Types
export interface FoundationModelsAvailability {
  isAvailable: boolean;
  reason?: string;
  deviceSupported: boolean;
  osVersion: string;
  frameworkVersion?: string;
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
}

// Structured Data Generation Types
export interface StructuredGenerationRequest {
  prompt: string;
  schemaType: "userProfile" | "product" | "event";
}

export interface StructuredGenerationResponse {
  data: any;
  schemaType: string;
  metadata: {
    tokenCount: number;
    generationTime: number;
    model: string;
  };
  error?: string;
}
