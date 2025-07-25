import { Text } from "@/components/ThemedText";
import { useThemedColors } from "@/components/useThemedColors";
import { useVoice } from "@/contexts/VoiceContext";
import ExpoFoundationModelsModule, {
  GenerationResponse,
} from "@/modules/expo-foundation-models";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function BasicGenerationScreen() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<GenerationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colors = useThemedColors();
  const { speak, stop, isSpeaking } = useVoice();

  const generateText = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setResponse(null);

      const result = await ExpoFoundationModelsModule.generateText({
        prompt: prompt.trim(),
      });

      if (result.error) {
        setError(result.error);
      } else {
        setResponse(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate text");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setPrompt("");
    setResponse(null);
    setError(null);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
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
            autoFocus={true}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Write a poem about..."
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: colors.button,
                borderColor: colors.button,
              },
              pressed && styles.buttonPressed,
              (!prompt.trim() || loading) && styles.buttonDisabled,
            ]}
            onPress={generateText}
            disabled={!prompt.trim() || loading}
          >
            {loading ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator size="small" color={colors.buttonText} />
                <Text
                  style={[
                    styles.buttonText,
                    { color: colors.buttonText, marginLeft: 8 },
                  ]}
                >
                  Generating...
                </Text>
              </View>
            ) : (
              <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                Generate
              </Text>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { borderColor: colors.border },
              pressed && styles.buttonPressed,
            ]}
            onPress={clearAll}
          >
            <Text style={styles.buttonText}>Clear</Text>
          </Pressable>
        </View>

        {error && (
          <View style={styles.section}>
            <Text size="caption" style={styles.errorLabel}>
              ERROR
            </Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {response && !loading && (
          <View style={styles.section}>
            <View style={styles.responseHeader}>
              <Text size="caption" style={styles.label}>
                RESPONSE
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.speakButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => {
                  if (isSpeaking) {
                    stop();
                  } else {
                    speak(response.content);
                  }
                }}
              >
                <Text style={styles.speakButtonText}>
                  {isSpeaking ? "Stop" : "Speak"}
                </Text>
              </Pressable>
            </View>
            <Text style={styles.responseText}>{response.content}</Text>

            <View style={[styles.metadata, { borderTopColor: colors.border }]}>
              <Text size="caption" style={styles.metadataText}>
                {response.metadata.tokenCount} tokens •{" "}
                {response.metadata.generationTime.toFixed(1)}s
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  section: {
    marginTop: 32,
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
  textInput: {
    fontSize: 16,
    minHeight: 120,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
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
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  errorText: {
    color: "red",
  },
  responseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 12,
  },
  speakButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  speakButtonText: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.8,
  },
  responseText: {
    fontSize: 16,
    lineHeight: 24,
  },
  metadata: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  metadataText: {
    opacity: 0.5,
  },
});
