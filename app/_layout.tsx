import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { VoiceProvider } from "@/contexts/VoiceContext";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function RootLayout() {
  const theme = useColorScheme() === "dark" ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={theme}>
      <VoiceProvider>
        <KeyboardProvider>
          <Stack
            screenOptions={{
              headerTransparent: true,
              presentation: "modal",
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="basic-generation"
              options={{
                title: "Basic Text Generation",
              }}
            />
            <Stack.Screen
              name="structured-data"
              options={{
                title: "Structured Data",
              }}
            />
            <Stack.Screen
              name="streaming-chat"
              options={{
                title: "Streaming Chat",
              }}
            />
            <Stack.Screen
              name="streaming-structured"
              options={{
                title: "Streaming Structured",
              }}
            />
          </Stack>
        </KeyboardProvider>
      </VoiceProvider>
    </ThemeProvider>
  );
}
