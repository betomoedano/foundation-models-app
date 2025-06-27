import ExpoFoundationModelsModule, {
  GenerationResponse,
} from "@/modules/expo-foundation-models";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function BasicGenerationScreen() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<GenerationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    checkAvailability();
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

  const generateText = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    if (!isAvailable) {
      setError("Foundation Models is not available on this device");
      return;
    }

    if (!ExpoFoundationModelsModule.generateText) {
      setError("Text generation not supported on this platform");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResponse(null);

      const result = await ExpoFoundationModelsModule.generateText({
        prompt: prompt.trim(),
      });

      // Check if there's an error in the response
      if ("error" in result && result.error) {
        setError(result.error as string);
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
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.content}>
        <Text style={styles.title}>Basic Text Generation</Text>

        <Text style={styles.subtitle}>
          Enter a prompt to generate text using Foundation Models
        </Text>

        <View style={styles.inputCard}>
          <Text style={styles.label}>Prompt:</Text>
          <TextInput
            style={styles.textInput}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Enter your prompt here..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.actionCard}>
          <View style={styles.buttonRow}>
            <View style={styles.buttonContainer}>
              <Button
                title="Generate"
                onPress={generateText}
                disabled={loading || !prompt.trim()}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Clear" onPress={clearAll} color="#666" />
            </View>
          </View>
        </View>

        {loading && (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Generating response...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}

        {response && !loading && (
          <View style={styles.responseCard}>
            <Text style={styles.responseLabel}>Response:</Text>
            <Text style={styles.responseText}>{response.content}</Text>

            <View style={styles.metadataContainer}>
              <Text style={styles.metadataTitle}>Generation Details:</Text>
              <Text style={styles.metadataText}>
                • Tokens: {response.metadata.tokenCount}
              </Text>
              <Text style={styles.metadataText}>
                • Time: {response.metadata.generationTime.toFixed(2)}s
              </Text>
              <Text style={styles.metadataText}>
                • Model: {response.metadata.model}
              </Text>
            </View>
          </View>
        )}

        {isAvailable === false && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Not Available</Text>
            <Text style={styles.infoText}>
              Foundation Models is not available on this device. iOS 26+ with
              Apple Intelligence is required for text generation.
            </Text>
          </View>
        )}

        {isAvailable === true && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Ready to Generate</Text>
            <Text style={styles.infoText}>
              Foundation Models is available! Enter a prompt above to generate
              text using Apple&apos;s on-device language model.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
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
  inputCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  actionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  loadingCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  errorCard: {
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  responseCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  infoCard: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  buttonContainer: {
    flex: 1,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
    lineHeight: 20,
  },
  responseLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  responseText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
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
  metadataContainer: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  metadataTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  metadataText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
});
