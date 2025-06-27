import ExpoFoundationModelsModule from "@/modules/expo-foundation-models";
import { Button, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button
        title="Test"
        onPress={() => {
          console.log(ExpoFoundationModelsModule.hello());
        }}
      />
    </View>
  );
}
