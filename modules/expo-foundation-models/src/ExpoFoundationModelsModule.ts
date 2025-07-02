import { NativeModule, requireNativeModule } from "expo";

import {
  FoundationModelsAvailability,
  GenerationRequest,
  GenerationResponse,
  StreamingCancelled,
  StreamingChunk,
  StreamingError,
  StreamingRequest,
  StreamingSession,
  StructuredGenerationRequest,
  StructuredGenerationResponse,
  StructuredStreamingChunk,
} from "./ExpoFoundationModels.types";

declare class ExpoFoundationModelsModule extends NativeModule {
  // Foundation Models Methods
  checkAvailability(): Promise<FoundationModelsAvailability>;
  generateText(request: GenerationRequest): Promise<GenerationResponse>;
  generateStructuredData(
    request: StructuredGenerationRequest
  ): Promise<StructuredGenerationResponse>;

  // Streaming Methods
  startStreamingSession(request: StreamingRequest): Promise<StreamingSession>;
  cancelStreamingSession(sessionId: string): Promise<void>;
  startStructuredStreamingSession(
    request: StreamingRequest
  ): Promise<StreamingSession>;

  // Event listeners
  addListener(
    eventName: "onStreamingChunk",
    listener: (event: StreamingChunk) => void
  ): { remove: () => void };
  addListener(
    eventName: "onStreamingError",
    listener: (event: StreamingError) => void
  ): { remove: () => void };
  addListener(
    eventName: "onStreamingCancelled",
    listener: (event: StreamingCancelled) => void
  ): { remove: () => void };
  addListener(
    eventName: "onStructuredStreamingChunk",
    listener: (event: StructuredStreamingChunk) => void
  ): { remove: () => void };
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoFoundationModelsModule>(
  "ExpoFoundationModels"
);
