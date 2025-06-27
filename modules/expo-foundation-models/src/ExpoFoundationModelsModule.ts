import { NativeModule, requireNativeModule } from "expo";

import {
  FoundationModelsAvailability,
  GenerationRequest,
  GenerationResponse,
  StructuredGenerationRequest,
  StructuredGenerationResponse,
} from "./ExpoFoundationModels.types";

declare class ExpoFoundationModelsModule extends NativeModule {
  // Foundation Models Methods
  checkAvailability(): Promise<FoundationModelsAvailability>;
  generateText?(request: GenerationRequest): Promise<GenerationResponse>;
  generateStructuredData?(
    request: StructuredGenerationRequest
  ): Promise<StructuredGenerationResponse>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoFoundationModelsModule>(
  "ExpoFoundationModels"
);
