import { NativeModule, requireNativeModule } from "expo";

import { ExpoFoundationModelsModuleEvents } from "./ExpoFoundationModels.types";

declare class ExpoFoundationModelsModule extends NativeModule<ExpoFoundationModelsModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoFoundationModelsModule>(
  "ExpoFoundationModels"
);
