import { NativeModule, requireNativeModule } from "expo";

import { FoundationModelsAvailability, GenerationRequest, GenerationResponse } from "./ExpoFoundationModels.types";

declare class ExpoFoundationModelsModule extends NativeModule {
  // Foundation Models Methods
  checkAvailability(): Promise<FoundationModelsAvailability>;
  generateText?(request: GenerationRequest): Promise<GenerationResponse>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoFoundationModelsModule>(
  "ExpoFoundationModels"
);
