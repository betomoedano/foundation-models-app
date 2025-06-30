import { useKeyboardHandler } from "react-native-keyboard-controller";
import { useSharedValue } from "react-native-reanimated";

const OFFSET = 0;

export const useGradualAnimation = () => {
  const totalOffset = OFFSET;

  const height = useSharedValue(totalOffset);

  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";
        height.value =
          e.height > 0 ? Math.max(e.height + OFFSET, totalOffset) : totalOffset;
      },
    },
    []
  );
  return { height };
};
