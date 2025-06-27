import { NativeModule, registerWebModule } from "expo";

import { ChangeEventPayload } from "./ExpoFoundationModels.types";

type ExpoFoundationModelsModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

class ExpoFoundationModelsModule extends NativeModule<ExpoFoundationModelsModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit("onChange", { value });
  }
  hello() {
    return "Hello world! 👋";
  }
}

export default registerWebModule(
  ExpoFoundationModelsModule,
  "ExpoFoundationModelsModule"
);
