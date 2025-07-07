import { Text } from "@/components/ThemedText";
import { useGradualAnimation } from "@/components/useGradualAnimation";
import { useThemedColors } from "@/components/useThemedColors";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

export default function StreamingChatScreen() {
  const { height } = useGradualAnimation();
  const [prompt, setPrompt] = useState("");
  // const {
  //   startStreaming,
  //   cancelStreaming,
  //   reset,
  //   content,
  //   loading,
  //   error,
  //   tokenCount,
  // } = useFoundationModelsStreaming();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenCount, setTokenCount] = useState(0);
  const colors = useThemedColors();

  const keyboardPadding = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        // style={styles.scrollView}
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

          {(content || loading) && (
            <View style={styles.section}>
              <Text size="caption" style={styles.label}>
                RESPONSE
              </Text>
              <Text style={styles.responseText}>
                {content}
                {loading && (
                  <Text style={[styles.cursor, { color: colors.text }]}>▊</Text>
                )}
              </Text>
              {tokenCount > 0 && (
                <View
                  style={[styles.metadata, { borderTopColor: colors.border }]}
                >
                  <Text size="caption" style={styles.metadataText}>
                    {tokenCount} tokens
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
            autoFocus
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
                // onPress={() => startStreaming(prompt)}
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
                // onPress={reset}
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
                // onPress={cancelStreaming}
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

      <Animated.View style={keyboardPadding} />
    </View>
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
