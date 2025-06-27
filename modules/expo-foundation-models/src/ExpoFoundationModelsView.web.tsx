import * as React from "react";

import { ExpoFoundationModelsViewProps } from "./ExpoFoundationModels.types";

export default function ExpoFoundationModelsView(
  props: ExpoFoundationModelsViewProps
) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
