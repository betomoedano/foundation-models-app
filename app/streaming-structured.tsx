import { Text } from "@/components/ThemedText";
import { useGradualAnimation } from "@/components/useGradualAnimation";
import { useThemedColors } from "@/components/useThemedColors";
import ExpoFoundationModelsModule, {
  StreamingSession,
  StructuredStreamingChunk,
} from "@/modules/expo-foundation-models";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

export default function StreamingStructuredScreen() {
  const { height } = useGradualAnimation();
  const [prompt, setPrompt] = useState(
    "Create a profile for a 25-year-old software developer from San Francisco"
  );
  const [streamingData, setStreamingData] = useState<any>(null);
  const [session, setSession] = useState<StreamingSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPartial, setIsPartial] = useState(false);
  const subscriptionsRef = useRef<any[]>([]);
  const colors = useThemedColors();

  useEffect(() => {
    // Set up event listeners
    const chunkSub = ExpoFoundationModelsModule.addListener(
      "onStructuredStreamingChunk",
      (chunk: StructuredStreamingChunk) => {
        if (chunk.isComplete) {
          setSession(null);
          setLoading(false);
          setIsPartial(false);
        } else {
          setStreamingData(chunk.data);
          setIsPartial(chunk.isPartial);
        }
      }
    );

    const errorSub = ExpoFoundationModelsModule.addListener(
      "onStreamingError",
      ({ error }: { sessionId: string; error: string }) => {
        setError(error);
        setSession(null);
        setLoading(false);
        setIsPartial(false);
      }
    );

    const cancelSub = ExpoFoundationModelsModule.addListener(
      "onStreamingCancelled",
      () => {
        setSession(null);
        setLoading(false);
        setIsPartial(false);
      }
    );

    subscriptionsRef.current = [chunkSub, errorSub, cancelSub];

    return () => {
      subscriptionsRef.current.forEach((sub) => sub.remove());
    };
  }, []);

  const keyboardPadding = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  }, []);

  const startStreaming = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setStreamingData(null);
      setIsPartial(false);

      const newSession =
        await ExpoFoundationModelsModule.startStructuredStreamingSession({
          prompt: prompt.trim(),
        });

      if ("error" in newSession && newSession.error) {
        setError(newSession.error as string);
        setLoading(false);
      } else {
        setSession(newSession);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start streaming"
      );
      setLoading(false);
    }
  };

  const cancelStreaming = async () => {
    if (session && ExpoFoundationModelsModule.cancelStreamingSession) {
      try {
        await ExpoFoundationModelsModule.cancelStreamingSession(
          session.sessionId
        );
      } catch (err) {
        console.error("Failed to cancel streaming:", err);
      }
    }
  };

  const clearChat = () => {
    setPrompt(
      "Create a profile for a 25-year-old software developer from San Francisco"
    );
    setStreamingData(null);
    setError(null);
    setSession(null);
    setIsPartial(false);
  };

  const formatProductData = (data: any) => {
    if (!data) return null;

    return (
      <View style={styles.dataContainer}>
        <Text style={styles.dataText}>{JSON.stringify(data, null, 2)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {error && (
            <View style={styles.section}>
              <Text size="caption" style={styles.errorLabel}>
                ERROR
              </Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {(streamingData || loading) && (
            <View style={styles.section}>
              <Text size="caption" style={styles.label}>
                STRUCTURED DATA {isPartial && "(PARTIAL)"}
              </Text>
              {streamingData ? (
                formatProductData(streamingData)
              ) : (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={colors.text} />
                  <Text style={styles.loadingText}>Starting generation...</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Input Area */}
      <View
        style={[
          styles.inputArea,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <View style={styles.inputSection}>
          <Text size="caption" style={styles.label}>
            PROMPT
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Describe a product to generate..."
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
            editable={!loading}
          />
        </View>

        <View style={styles.actions}>
          {!loading ? (
            <>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  {
                    backgroundColor: colors.button,
                    borderColor: colors.button,
                  },
                  pressed && styles.buttonPressed,
                  !prompt.trim() && styles.buttonDisabled,
                ]}
                onPress={startStreaming}
                disabled={!prompt.trim()}
              >
                <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                  Generate
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  { borderColor: colors.border },
                  pressed && styles.buttonPressed,
                ]}
                onPress={clearChat}
              >
                <Text style={styles.buttonText}>Clear</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  {
                    backgroundColor: "red",
                    borderColor: "red",
                  },
                  pressed && styles.buttonPressed,
                ]}
                onPress={cancelStreaming}
              >
                <Text style={[styles.buttonText, { color: "white" }]}>
                  Cancel
                </Text>
              </Pressable>

              <View style={styles.streamingIndicator}>
                <ActivityIndicator size="small" color={colors.text} />
                <Text style={styles.streamingText}>Generating...</Text>
              </View>
            </>
          )}
        </View>
      </View>

      <Animated.View style={keyboardPadding} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  label: {
    opacity: 0.6,
    marginBottom: 12,
  },
  errorLabel: {
    opacity: 0.6,
    marginBottom: 12,
    color: "red",
  },
  dataContainer: {
    backgroundColor: "rgba(128, 128, 128, 0.05)",
    borderRadius: 8,
    padding: 16,
  },
  dataText: {
    fontSize: 12,
    fontFamily: "monospace",
    lineHeight: 18,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    opacity: 0.6,
  },
  errorText: {
    color: "red",
  },
  inputArea: {
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 20,
  },
  inputSection: {
    marginBottom: 16,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 60,
    maxHeight: 100,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  button: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  streamingIndicator: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  streamingText: {
    fontSize: 14,
    opacity: 0.6,
  },
});
