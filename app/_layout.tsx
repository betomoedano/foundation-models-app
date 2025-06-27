import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackground: () => <View style={{ backgroundColor: "red" }} />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Foundation Models Demo",
        }}
      />
      <Stack.Screen
        name="availability"
        options={{
          title: "Availability Check",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="basic-generation"
        options={{
          title: "Basic Generation",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="structured-data"
        options={{
          title: "Structured Data",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
