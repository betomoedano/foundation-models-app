import { Text } from "@/components/ThemedText";
import { useThemedColors } from "@/components/useThemedColors";
import ExpoFoundationModelsModule, {
  StreamingChunk,
  StreamingSession,
} from "@/modules/expo-foundation-models";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function StreamingChatScreen() {
  const [prompt, setPrompt] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const [session, setSession] = useState<StreamingSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalTokens, setTotalTokens] = useState(0);
  const subscriptionsRef = useRef<any[]>([]);
  const colors = useThemedColors();

  useEffect(() => {
    // Set up event listeners
    const chunkSub = ExpoFoundationModelsModule.addListener(
      "onStreamingChunk",
      (chunk: StreamingChunk) => {
        if (chunk.isComplete) {
          setSession(null);
          setLoading(false);
        } else {
          setStreamingContent(chunk.content);
          setTotalTokens(chunk.tokenCount);
        }
      }
    );

    const errorSub = ExpoFoundationModelsModule.addListener(
      "onStreamingError",
      ({ error }: { sessionId: string; error: string }) => {
        setError(error);
        setSession(null);
        setLoading(false);
      }
    );

    const cancelSub = ExpoFoundationModelsModule.addListener(
      "onStreamingCancelled",
      () => {
        setSession(null);
        setLoading(false);
      }
    );

    subscriptionsRef.current = [chunkSub, errorSub, cancelSub];

    return () => {
      subscriptionsRef.current.forEach((sub) => sub.remove());
    };
  }, []);

  const startStreaming = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setStreamingContent("");
      setTotalTokens(0);

      const newSession = await ExpoFoundationModelsModule.startStreamingSession(
        {
          prompt: prompt.trim(),
        }
      );

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
    setPrompt("");
    setStreamingContent("");
    setTotalTokens(0);
    setError(null);
    setSession(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
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

          {(streamingContent || loading) && (
            <View style={styles.section}>
              <Text size="caption" style={styles.label}>
                RESPONSE
              </Text>
              <Text style={styles.responseText}>
                {streamingContent}
                {loading && (
                  <Text style={[styles.cursor, { color: colors.text }]}>▊</Text>
                )}
              </Text>
              {totalTokens > 0 && (
                <View
                  style={[styles.metadata, { borderTopColor: colors.border }]}
                >
                  <Text size="caption" style={styles.metadataText}>
                    {totalTokens} tokens
                  </Text>
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
            placeholder="Enter your prompt..."
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
                  Stream
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
                <Text style={styles.streamingText}>Streaming...</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 200, // Space for input area
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
  responseText: {
    fontSize: 16,
    lineHeight: 24,
  },
  cursor: {
    fontWeight: "bold",
  },
  metadata: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  metadataText: {
    opacity: 0.5,
  },
  errorText: {
    color: "red",
  },
  inputArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
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
