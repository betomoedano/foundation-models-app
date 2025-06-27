import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
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
    </Stack>
  );
}
