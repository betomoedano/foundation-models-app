import { requireNativeView } from "expo";
import * as React from "react";

import { ExpoFoundationModelsViewProps } from "./ExpoFoundationModels.types";

const NativeView: React.ComponentType<ExpoFoundationModelsViewProps> =
  requireNativeView("ExpoFoundationModels");

export default function ExpoFoundationModelsView(
  props: ExpoFoundationModelsViewProps
) {
  return <NativeView {...props} />;
}
