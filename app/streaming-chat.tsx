import ExpoFoundationModelsModule, {
  StreamingChunk,
  StreamingSession,
} from "@/modules/expo-foundation-models";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function StreamingChatScreen() {
  const [prompt, setPrompt] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const [session, setSession] = useState<StreamingSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [totalTokens, setTotalTokens] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);
  const subscriptionsRef = useRef<any[]>([]);

  useEffect(() => {
    checkAvailability();

    // Set up event listeners
    const chunkSub = ExpoFoundationModelsModule.addListener(
      "onStreamingChunk",
      (chunk: StreamingChunk) => {
        if (chunk.isComplete) {
          setSession(null);
          setLoading(false);
        } else {
          // Always replace with the latest content (cumulative)
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
      // Clean up subscriptions
      subscriptionsRef.current.forEach((sub) => sub.remove());
    };
  }, []);

  const checkAvailability = async () => {
    try {
      const availability = await ExpoFoundationModelsModule.checkAvailability();
      setIsAvailable(availability.isAvailable);
    } catch (err) {
      console.error("Failed to check availability:", err);
      setIsAvailable(false);
    }
  };

  const startStreaming = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    if (!isAvailable) {
      setError("Foundation Models is not available on this device");
      return;
    }

    if (!ExpoFoundationModelsModule.startStreamingSession) {
      setError("Streaming not supported on this platform");
      return;
    }

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

  const exportChat = () => {
    const chatData = {
      prompt,
      response: streamingContent,
      totalTokens,
      timestamp: new Date().toISOString(),
    };
    console.log("Chat export:", JSON.stringify(chatData, null, 2));
    // In a real app, you'd implement proper export functionality
  };

  useEffect(() => {
    // Auto-scroll to bottom when content updates
    if (scrollViewRef.current && streamingContent) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [streamingContent]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Streaming Chat</Text>
          <Text style={styles.subtitle}>
            Real-time text generation with streaming
          </Text>

          {/* Response Display */}
          {(streamingContent || loading) && (
            <View style={styles.responseCard}>
              <Text style={styles.responseLabel}>Response:</Text>
              <Text style={styles.responseText}>
                {streamingContent}
                {loading && <Text style={styles.cursor}>▊</Text>}
              </Text>
              {totalTokens > 0 && (
                <Text style={styles.tokenCount}>Tokens: {totalTokens}</Text>
              )}
            </View>
          )}

          {/* Error Display */}
          {error && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>Error: {error}</Text>
            </View>
          )}

          {/* Status Info */}
          {isAvailable === false && (
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Not Available</Text>
              <Text style={styles.infoText}>
                Foundation Models is not available on this device. iOS 26+ with
                Apple Intelligence is required for streaming.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputArea}>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Enter your prompt..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            editable={!loading}
          />

          <View style={styles.buttonRow}>
            {!loading ? (
              <>
                <View style={styles.buttonContainer}>
                  <Button
                    title="Stream"
                    onPress={startStreaming}
                    disabled={!prompt.trim()}
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <Button title="Clear" onPress={clearChat} color="#666" />
                </View>
                {streamingContent && (
                  <View style={styles.buttonContainer}>
                    <Button
                      title="Export"
                      onPress={exportChat}
                      color="#8b5cf6"
                    />
                  </View>
                )}
              </>
            ) : (
              <>
                <View style={styles.buttonContainer}>
                  <Button
                    title="Cancel"
                    onPress={cancelStreaming}
                    color="#dc3545"
                  />
                </View>
                <View style={styles.streamingIndicator}>
                  <ActivityIndicator size="small" color="#007AFF" />
                  <Text style={styles.streamingText}>Streaming...</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  responseCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  responseLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  responseText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  cursor: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  tokenCount: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  errorCard: {
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#1e40af",
    lineHeight: 20,
  },
  inputArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 10,
  },
  inputCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
    boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 60,
    maxHeight: 100,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
  },
  streamingIndicator: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  streamingText: {
    fontSize: 14,
    color: "#007AFF",
  },
});
