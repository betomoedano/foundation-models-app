// Foundation Models Availability Types
export interface FoundationModelsAvailability {
  isAvailable: boolean;
  reason?: string;
  deviceSupported: boolean;
  osVersion: string;
  frameworkVersion?: string;
}
