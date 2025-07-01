import { NativeModule, registerWebModule } from "expo";

import { FoundationModelsAvailability } from "./ExpoFoundationModels.types";

class ExpoFoundationModelsModule extends NativeModule {
  // Foundation Models Methods - Web Implementation (Not Supported)
  async checkAvailability(): Promise<FoundationModelsAvailability> {
    const userAgent = navigator.userAgent;

    return {
      isAvailable: false,
      deviceSupported: false,
      osVersion: `Web Browser - ${userAgent}`,
      reason:
        "Foundation Models framework is only available on iOS 26+ with Apple Intelligence. Web platform is not supported.",
    };
  }
}

export default registerWebModule(
  ExpoFoundationModelsModule,
  "ExpoFoundationModelsModule"
);
