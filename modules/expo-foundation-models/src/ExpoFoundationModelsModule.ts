import { NativeModule, requireNativeModule } from "expo";

import { FoundationModelsAvailability } from "./ExpoFoundationModels.types";

declare class ExpoFoundationModelsModule extends NativeModule {
  // Foundation Models Methods
  checkAvailability(): Promise<FoundationModelsAvailability>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoFoundationModelsModule>(
  "ExpoFoundationModels"
);
