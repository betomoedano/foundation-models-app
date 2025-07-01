import { Text } from "@/components/ThemedText";
import { useThemedColors } from "@/components/useThemedColors";
import ExpoFoundationModelsModule, {
  StructuredGenerationResponse,
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

const DEFAULT_PROMPT = "Create a profile for a 25-year-old software developer from San Francisco";

export default function StructuredDataScreen() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [response, setResponse] = useState<StructuredGenerationResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colors = useThemedColors();

  const generateStructuredData = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setResponse(null);

      const result = await ExpoFoundationModelsModule.generateStructuredData({
        prompt: prompt.trim(),
      });

      if ("error" in result && result.error) {
        setError(result.error as string);
      } else {
        setResponse(result);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate structured data"
      );
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setPrompt(DEFAULT_PROMPT);
    setResponse(null);
    setError(null);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      <View style={styles.content}>
        <View style={styles.section}>
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
            placeholder="Describe what you want to generate..."
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={3}
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
            onPress={generateStructuredData}
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
            <Text size="caption" style={styles.label}>
              GENERATED DATA
            </Text>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                {JSON.stringify(response.data, null, 2)}
              </Text>
            </View>

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
  textInput: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 100,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
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
  metadata: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  metadataText: {
    opacity: 0.5,
  },
});
