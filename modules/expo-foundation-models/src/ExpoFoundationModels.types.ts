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
